"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import {
  STUDENTS as DEMO_STUDENTS,
  WEEKLY_MASTERY as DEMO_WEEKLY,
  TOPIC_MASTERY as DEMO_TOPIC,
  UPCOMING_LESSONS as DEMO_LESSONS,
  HOMEWORK as DEMO_HOMEWORK,
  MESSAGES as DEMO_MESSAGES,
  type Student,
  type LessonEntry,
  type HomeworkTask,
  type Message,
  type MasteryRow,
} from "@/lib/dashboard";

export type DashboardData = {
  students: Student[];
  weekly: { week: string; value: number }[];
  topics: MasteryRow[];
  upcoming: LessonEntry[];
  homework: HomeworkTask[];
  messages: Message[];
  loading: boolean;
  source: "supabase" | "demo";
  parentName: string;
};

const AVATAR_ROTATION = [
  "from-sky-500 to-sky-700",
  "from-orange-500 to-orange-600",
  "from-emerald-500 to-emerald-600",
  "from-navy-500 to-navy-700",
];

export function useDashboardData(activeStudentId?: string) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [state, setState] = useState<DashboardData>({
    students: [],
    weekly: [],
    topics: [],
    upcoming: [],
    homework: [],
    messages: [],
    loading: true,
    source: "demo",
    parentName: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const parentName =
        (userRes.user?.user_metadata as { full_name?: string })?.full_name ||
        userRes.user?.email?.split("@")[0] ||
        "";

      // Load students
      const { data: studentsRows, error: studentsErr } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: true });

      const students: Student[] =
        studentsErr || !studentsRows?.length
          ? DEMO_STUDENTS
          : studentsRows.map((r, i) => ({
              id: r.id,
              name: r.name,
              year: r.year,
              avatarGradient: r.avatar_gradient || AVATAR_ROTATION[i % AVATAR_ROTATION.length],
              targetBand: r.target_band ?? 8,
              currentBand: r.current_band ?? 7,
              mastery: r.mastery ?? 0,
              streakDays: r.streak_days ?? 0,
              hoursThisTerm: r.hours_term ?? 0,
              nextLesson: {
                topic: r.next_lesson_topic ?? "Next lesson TBD",
                startsAt: r.next_lesson_starts_at
                  ? formatLessonDateTime(r.next_lesson_starts_at)
                  : "To be scheduled",
                tutor: r.next_lesson_tutor ?? "Your tutor",
                format: (r.next_lesson_format as Student["nextLesson"]["format"]) ?? "Online 1:1",
              },
            }));

      const source: "supabase" | "demo" =
        studentsErr || !studentsRows?.length ? "demo" : "supabase";

      const activeId =
        activeStudentId && students.find((s) => s.id === activeStudentId)
          ? activeStudentId
          : students[0]?.id;

      if (!activeId) {
        if (!cancelled) setState((s) => ({ ...s, students, parentName, loading: false, source }));
        return;
      }

      if (source === "demo") {
        if (!cancelled)
          setState({
            students,
            weekly: DEMO_WEEKLY,
            topics: DEMO_TOPIC,
            upcoming: DEMO_LESSONS,
            homework: DEMO_HOMEWORK,
            messages: DEMO_MESSAGES,
            loading: false,
            source,
            parentName,
          });
        return;
      }

      const [weeklyRes, topicRes, lessonRes, hwRes, msgRes] = await Promise.all([
        supabase.from("weekly_mastery").select("*").eq("student_id", activeId).order("ord"),
        supabase.from("topic_mastery").select("*").eq("student_id", activeId).order("ord"),
        supabase
          .from("lessons")
          .select("*")
          .eq("student_id", activeId)
          .eq("status", "Upcoming")
          .order("scheduled_at", { ascending: true }),
        supabase
          .from("homework")
          .select("*")
          .eq("student_id", activeId)
          .order("due_at", { ascending: true }),
        supabase
          .from("messages")
          .select("*")
          .eq("student_id", activeId)
          .order("sent_at", { ascending: false }),
      ]);

      const weekly = weeklyRes.data?.length
        ? weeklyRes.data.map((r) => ({ week: r.week, value: r.value }))
        : DEMO_WEEKLY;

      const topics: MasteryRow[] = topicRes.data?.length
        ? topicRes.data.map((r) => ({
            topic: r.topic,
            mastery: r.mastery,
            delta: r.delta,
            band: r.band as MasteryRow["band"],
          }))
        : DEMO_TOPIC;

      const upcoming: LessonEntry[] = lessonRes.data?.length
        ? lessonRes.data.map((r) => ({
            id: r.id,
            date: formatLessonDateTime(r.scheduled_at),
            topic: r.topic,
            strand: r.strand ?? "",
            tutor: r.tutor ?? "Your tutor",
            score: 0,
            duration: `${r.duration_min} min`,
            status: r.status as LessonEntry["status"],
          }))
        : DEMO_LESSONS;

      const homework: HomeworkTask[] = hwRes.data?.length
        ? hwRes.data.map((r) => ({
            id: r.id,
            title: r.title,
            dueIn: formatDueIn(r.due_at),
            progress: r.progress ?? 0,
            totalQuestions: r.total_questions,
            strand: r.strand ?? "",
            strandColor: (r.strand_color ?? "sky") as HomeworkTask["strandColor"],
          }))
        : DEMO_HOMEWORK;

      const messages: Message[] = msgRes.data?.length
        ? msgRes.data.map((r) => ({
            id: r.id,
            from: r.from_name,
            role: r.from_role ?? "",
            time: formatRelative(r.sent_at),
            preview: r.preview,
            unread: !!r.unread,
            initials: r.initials ?? initialsFrom(r.from_name),
            color: r.color ?? "from-sky-500 to-sky-700",
          }))
        : DEMO_MESSAGES;

      if (!cancelled)
        setState({
          students,
          weekly,
          topics,
          upcoming,
          homework,
          messages,
          loading: false,
          source,
          parentName,
        });
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, activeStudentId]);

  return state;
}

function initialsFrom(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatLessonDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDueIn(iso: string): string {
  const due = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.round((due - now) / 86400000);
  if (days <= 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const min = Math.round((now - then) / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
