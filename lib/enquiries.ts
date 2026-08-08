"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export type EnquiryStatus = "new" | "contacted" | "booked" | "won" | "lost" | "spam";

export type Enquiry = {
  id: string;
  parentName: string;
  childName: string | null;
  email: string;
  phone: string | null;
  yearLevel: string | null;
  preferredFormat: string | null;
  notes: string | null;
  consent: boolean;
  status: EnquiryStatus;
  sourceUrl: string | null;
  createdAt: string;
};

export function useIsAdmin() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [state, setState] = useState<{ loading: boolean; isAdmin: boolean }>({
    loading: true,
    isAdmin: false,
  });
  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setState({ loading: false, isAdmin: false });
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      setState({ loading: false, isAdmin: data?.role === "admin" });
    } catch {
      setState({ loading: false, isAdmin: false });
    }
  }, [supabase]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return { ...state, refresh };
}

export async function claimAdmin(): Promise<{ ok: boolean; message: string }> {
  try {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.rpc("claim_admin");
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: typeof data === "string" ? data : "ok" };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Failed" };
  }
}

export function useEnquiries() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) {
        setError(error.message);
        setRows([]);
        return;
      }
      setRows(
        (data ?? []).map((r) => ({
          id: r.id,
          parentName: r.parent_name,
          childName: r.child_name,
          email: r.email,
          phone: r.phone,
          yearLevel: r.year_level,
          preferredFormat: r.preferred_format,
          notes: r.notes,
          consent: !!r.consent,
          status: (r.status || "new") as EnquiryStatus,
          sourceUrl: r.source_url,
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

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  const supabase = getSupabaseBrowser();
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
  return { ok: !error, error: error?.message };
}
