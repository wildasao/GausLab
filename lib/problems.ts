"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export type ProblemKind = "multiplication" | "fraction" | "pythagoras" | "place-value";

export type SavedProblem = {
  id: string;
  studentId: string | null;
  moduleSlug: string;
  kind: ProblemKind;
  config: Record<string, unknown>;
  story: string;
  answer: string;
  favorite: boolean;
  createdAt: string;
};

export async function saveProblem(input: {
  studentId?: string;
  moduleSlug: string;
  kind: ProblemKind;
  config: Record<string, unknown>;
  story: string;
  answer: string;
}): Promise<{ ok: true; row: SavedProblem } | { ok: false; error: string }> {
  try {
    const supabase = getSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Sign in to save problems." };
    if (!input.studentId) return { ok: false, error: "No active student — add one first." };

    const { data, error } = await supabase
      .from("student_problems")
      .insert({
        student_id: input.studentId,
        module_slug: input.moduleSlug,
        kind: input.kind,
        config: input.config,
        story: input.story,
        answer: input.answer,
      })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };

    return {
      ok: true,
      row: {
        id: data.id,
        studentId: data.student_id,
        moduleSlug: data.module_slug,
        kind: data.kind,
        config: data.config,
        story: data.story,
        answer: data.answer,
        favorite: !!data.favorite,
        createdAt: data.created_at,
      },
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function deleteProblem(id: string) {
  try {
    const supabase = getSupabaseBrowser();
    await supabase.from("student_problems").delete().eq("id", id);
    return true;
  } catch {
    return false;
  }
}

/** Fetch problems for the current student, filtered by module slug. */
export function useMyProblems(moduleSlug: string, studentId?: string) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [rows, setRows] = useState<SavedProblem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (!studentId) {
        setRows([]);
        return;
      }
      const { data } = await supabase
        .from("student_problems")
        .select("*")
        .eq("student_id", studentId)
        .eq("module_slug", moduleSlug)
        .order("created_at", { ascending: false })
        .limit(20);
      setRows(
        (data ?? []).map((r) => ({
          id: r.id,
          studentId: r.student_id,
          moduleSlug: r.module_slug,
          kind: r.kind,
          config: r.config,
          story: r.story,
          answer: r.answer,
          favorite: !!r.favorite,
          createdAt: r.created_at,
        }))
      );
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, studentId, moduleSlug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { rows, loading, refresh };
}
