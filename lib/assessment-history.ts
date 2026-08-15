"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import type { AssessmentYear, Strand } from "@/lib/assessment";

export type PastResult = {
  id: string;
  year: AssessmentYear;
  scoreCorrect: number;
  scoreTotal: number;
  scorePct: number;
  bandEstimate: string | null;
  perStrand: Record<Strand, { total: number; correct: number; pct: number }> | null;
  createdAt: string;
};

export function useAssessmentHistory() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [rows, setRows] = useState<PastResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setRows([]);
        return;
      }
      const { data, error: err } = await supabase
        .from("assessment_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (err) {
        setError(err.message);
        setRows([]);
        return;
      }
      setRows(
        (data ?? []).map((r) => ({
          id: r.id,
          year: r.year as AssessmentYear,
          scoreCorrect: r.score_correct,
          scoreTotal: r.score_total,
          scorePct: r.score_pct,
          bandEstimate: r.band_estimate,
          perStrand: r.per_strand,
          createdAt: r.created_at,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { rows, loading, error, refresh };
}
