"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export type AdminTeamMember = {
  id: string;
  studentId: string;
  displayName: string;
  status: "pending" | "approved" | "removed";
};

export type AdminTeam = {
  id: string;
  name: string;
  status: "forming" | "active" | "completed" | "suspended";
  challengeTitle: string | null;
  createdAt: string;
  members: AdminTeamMember[];
};

export type AdminReportStatus = "open" | "reviewed" | "dismissed";

export type AdminReport = {
  id: string;
  teamId: string;
  teamName: string;
  postId: string | null;
  postBody: string | null;
  reason: string;
  details: string | null;
  status: AdminReportStatus;
  createdAt: string;
};

/** Admin-only: every team + its full roster, across all families. */
export function useAdminProjectTeams() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [{ data: teamRows, error }, { data: memberRows }] = await Promise.all([
      supabase
        .from("project_teams")
        .select("*, project_challenges(title)")
        .order("created_at", { ascending: false }),
      supabase.from("project_team_members").select("*"),
    ]);

    if (error || !teamRows) {
      setTeams([]);
      setLoading(false);
      return;
    }

    const byTeam = new Map<string, AdminTeamMember[]>();
    for (const m of memberRows ?? []) {
      const list = byTeam.get(m.team_id) ?? [];
      list.push({ id: m.id, studentId: m.student_id, displayName: m.student_display_name, status: m.status });
      byTeam.set(m.team_id, list);
    }

    setTeams(
      teamRows.map((t: any) => ({
        id: t.id,
        name: t.name,
        status: t.status,
        challengeTitle: t.project_challenges?.title ?? null,
        createdAt: t.created_at,
        members: byTeam.get(t.id) ?? [],
      }))
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { teams, loading, refresh };
}

/** Admin-only: the moderation queue. */
export function useAdminProjectReports() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("project_reports")
      .select("*, project_teams(name), project_workspace_posts(body)")
      .order("created_at", { ascending: false });

    setReports(
      error || !data
        ? []
        : data.map((r: any) => ({
            id: r.id,
            teamId: r.team_id,
            teamName: r.project_teams?.name ?? "Unknown team",
            postId: r.post_id,
            postBody: r.project_workspace_posts?.body ?? null,
            reason: r.reason,
            details: r.details,
            status: r.status,
            createdAt: r.created_at,
          }))
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { reports, loading, refresh };
}

export async function adminSetTeamStatus(
  teamId: string,
  status: "active" | "suspended" | "completed"
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowser();
  const { error } = await supabase.from("project_teams").update({ status }).eq("id", teamId);
  return { ok: !error, error: error?.message };
}

export async function adminRemoveMember(memberRowId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowser();
  const { error } = await supabase
    .from("project_team_members")
    .update({ status: "removed" })
    .eq("id", memberRowId);
  return { ok: !error, error: error?.message };
}

export async function adminSetReportStatus(
  reportId: string,
  status: AdminReportStatus
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowser();
  const { error } = await supabase.from("project_reports").update({ status }).eq("id", reportId);
  return { ok: !error, error: error?.message };
}
