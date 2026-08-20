"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { MODULES, type Module } from "@/lib/modules";

export type Strand = Module["strand"];

export type ActivityCell = {
  date: string;      // ISO yyyy-mm-dd
  count: number;
  correct: number;
};

export type ModuleProgress = {
  slug: string;
  title: string;
  strand: Strand;
  year: number;
  color: string;
  totalLessons: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctQuestions: number;
  accuracyPct: number;
  coveragePct: number;
  lastPlayedAt: string | null;
};

export type StrandStat = {
  strand: Strand;
  attempts: number;
  correct: number;
  accuracyPct: number;
  color: "sky" | "orange" | "navy";
};

export type WeekPoint = { week: string; value: number };

export type RecentEvent = {
  kind: "attempt" | "problem";
  moduleSlug: string;
  moduleTitle: string;
  lessonId?: string;
  correct?: boolean;
  story?: string;
  answer?: string;
  when: string; // ISO
};

export type ProgressData = {
  loading: boolean;
  source: "supabase" | "demo";
  kpis: {
    totalAttempts: number;
    correct: number;
    accuracyPct: number;
    daysActive: number;
    currentStreakDays: number;
    problemsCreated: number;
  };
  weekly: WeekPoint[];
  activity: ActivityCell[]; // exactly 84 cells (12 weeks × 7)
  modules: ModuleProgress[];
  strands: StrandStat[];
  recent: RecentEvent[];
};

const STRAND_COLOR: Record<Strand, StrandStat["color"]> = {
  "Number & Algebra": "sky",
  "Measurement & Geometry": "orange",
  "Statistics & Probability": "navy",
};

/** Build a 12-week (84 day) activity grid ending today. */
function buildEmptyActivity(): ActivityCell[] {
  const out: ActivityCell[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push({ date: d.toISOString().slice(0, 10), count: 0, correct: 0 });
  }
  return out;
}

function isoDay(iso: string): string {
  return iso.slice(0, 10);
}

/** Longest run of consecutive days-with-activity ending today. */
function computeCurrentStreak(activity: ActivityCell[]): number {
  let streak = 0;
  for (let i = activity.length - 1; i >= 0; i--) {
    if (activity[i].count > 0) streak++;
    else break;
  }
  return streak;
}

export function useProgressData(studentId?: string): ProgressData {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [state, setState] = useState<ProgressData>({
    loading: true,
    source: "demo",
    kpis: {
      totalAttempts: 0,
      correct: 0,
      accuracyPct: 0,
      daysActive: 0,
      currentStreakDays: 0,
      problemsCreated: 0,
    },
    weekly: [],
    activity: buildEmptyActivity(),
    modules: [],
    strands: [],
    recent: [],
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));

    // Bring back every module in code as scaffolding (0-progress rows if never touched).
    const moduleMap = new Map<string, ModuleProgress>();
    for (const m of MODULES) {
      const totalQuestions = m.lessons.reduce(
        (a, l) => a + l.blocks.filter((b) => b.kind === "mcq" || b.kind === "numeric").length,
        0
      );
      moduleMap.set(m.slug, {
        slug: m.slug,
        title: m.title,
        strand: m.strand,
        year: m.year,
        color: m.color,
        totalLessons: m.lessons.length,
        totalQuestions,
        attemptedQuestions: 0,
        correctQuestions: 0,
        accuracyPct: 0,
        coveragePct: 0,
        lastPlayedAt: null,
      });
    }

    // Anonymous or demo — return scaffolded data with 0 activity.
    let source: "supabase" | "demo" = "supabase";
    let attempts:
      | { module_slug: string | null; lesson_id: string | null; correct: boolean; attempted_at: string }[]
      | null = null;
    let problems: { story: string | null; answer: string | null; module_slug: string | null; created_at: string }[] | null = null;

    if (studentId) {
      const [aRes, pRes] = await Promise.all([
        supabase
          .from("question_attempts")
          .select("module_slug, lesson_id, correct, attempted_at")
          .eq("student_id", studentId)
          .order("attempted_at", { ascending: false })
          .limit(2000),
        supabase
          .from("student_problems")
          .select("story, answer, module_slug, created_at")
          .eq("student_id", studentId)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      if (aRes.error && pRes.error) source = "demo";
      attempts = aRes.data ?? null;
      problems = pRes.data ?? null;
    } else {
      source = "demo";
    }

    // Aggregate attempts.
    const activity = buildEmptyActivity();
    const activityByDay = new Map(activity.map((c, i) => [c.date, i]));
    const strandAgg = new Map<Strand, { attempts: number; correct: number }>();

    let totalAttempts = 0;
    let totalCorrect = 0;

    (attempts ?? []).forEach((a) => {
      totalAttempts += 1;
      if (a.correct) totalCorrect += 1;
      const day = isoDay(a.attempted_at);
      const idx = activityByDay.get(day);
      if (idx !== undefined) {
        activity[idx].count += 1;
        if (a.correct) activity[idx].correct += 1;
      }
      if (a.module_slug) {
        const mp = moduleMap.get(a.module_slug);
        if (mp) {
          mp.attemptedQuestions += 1;
          if (a.correct) mp.correctQuestions += 1;
          if (!mp.lastPlayedAt || mp.lastPlayedAt < a.attempted_at) mp.lastPlayedAt = a.attempted_at;

          const bucket = strandAgg.get(mp.strand) ?? { attempts: 0, correct: 0 };
          bucket.attempts += 1;
          if (a.correct) bucket.correct += 1;
          strandAgg.set(mp.strand, bucket);
        }
      }
    });

    for (const mp of moduleMap.values()) {
      mp.accuracyPct = mp.attemptedQuestions === 0 ? 0 : Math.round((mp.correctQuestions / mp.attemptedQuestions) * 100);
      mp.coveragePct = mp.totalQuestions === 0 ? 0 : Math.min(100, Math.round((mp.attemptedQuestions / mp.totalQuestions) * 100));
    }

    // Weekly mastery = accuracy per week over the 12-week window.
    const weekly: WeekPoint[] = [];
    for (let w = 0; w < 12; w++) {
      const start = w * 7;
      const slice = activity.slice(start, start + 7);
      const c = slice.reduce((a, x) => a + x.count, 0);
      const k = slice.reduce((a, x) => a + x.correct, 0);
      const pct = c === 0 ? 0 : Math.round((k / c) * 100);
      weekly.push({ week: `W${w + 1}`, value: pct });
    }

    const strands: StrandStat[] = Array.from(strandAgg.entries()).map(([strand, s]) => ({
      strand,
      attempts: s.attempts,
      correct: s.correct,
      accuracyPct: s.attempts === 0 ? 0 : Math.round((s.correct / s.attempts) * 100),
      color: STRAND_COLOR[strand],
    }));

    const daysActive = activity.filter((c) => c.count > 0).length;
    const currentStreakDays = computeCurrentStreak(activity);

    const modules = Array.from(moduleMap.values()).sort((a, b) => {
      // Show played modules first (by lastPlayedAt desc), then unplayed (by year asc).
      if (a.lastPlayedAt && !b.lastPlayedAt) return -1;
      if (!a.lastPlayedAt && b.lastPlayedAt) return 1;
      if (a.lastPlayedAt && b.lastPlayedAt) return a.lastPlayedAt < b.lastPlayedAt ? 1 : -1;
      return a.year - b.year;
    });

    const recentAttempts: RecentEvent[] = (attempts ?? []).slice(0, 20).map((a) => {
      const mp = a.module_slug ? moduleMap.get(a.module_slug) : undefined;
      return {
        kind: "attempt",
        moduleSlug: a.module_slug ?? "",
        moduleTitle: mp?.title ?? a.module_slug ?? "Module",
        lessonId: a.lesson_id ?? undefined,
        correct: a.correct,
        when: a.attempted_at,
      };
    });
    const recentProblems: RecentEvent[] = (problems ?? []).slice(0, 10).map((p) => {
      const mp = p.module_slug ? moduleMap.get(p.module_slug) : undefined;
      return {
        kind: "problem",
        moduleSlug: p.module_slug ?? "",
        moduleTitle: mp?.title ?? "Lab",
        story: p.story ?? undefined,
        answer: p.answer ?? undefined,
        when: p.created_at,
      };
    });
    const recent = [...recentAttempts, ...recentProblems].sort((a, b) => (a.when < b.when ? 1 : -1)).slice(0, 15);

    setState({
      loading: false,
      source,
      kpis: {
        totalAttempts,
        correct: totalCorrect,
        accuracyPct: totalAttempts === 0 ? 0 : Math.round((totalCorrect / totalAttempts) * 100),
        daysActive,
        currentStreakDays,
        problemsCreated: problems?.length ?? 0,
      },
      weekly,
      activity,
      modules,
      strands,
      recent,
    });
  }, [supabase, studentId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return state;
}
