"use client";

import { getSupabaseBrowser } from "@/lib/supabase/browser";

/**
 * Record a single question attempt to Supabase.
 * Silently no-ops if the user isn't signed in, the tables don't exist yet,
 * or the write fails — the UI keeps working regardless.
 */
export async function recordAttempt(input: {
  studentId?: string;
  moduleSlug: string;
  lessonId: string;
  blockIndex: number;
  correct: boolean;
  durationMs?: number;
  answerGiven?: string;
}) {
  try {
    const supabase = getSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return; // demo mode / logged out — skip

    await supabase.from("question_attempts").insert({
      student_id: input.studentId ?? null,
      module_slug: input.moduleSlug,
      lesson_id: input.lessonId,
      block_index: input.blockIndex,
      correct: input.correct,
      duration_ms: input.durationMs ?? null,
      answer_given: input.answerGiven ?? null,
    });
  } catch {
    // Ignore — analytics failure should never break the lesson
  }
}
