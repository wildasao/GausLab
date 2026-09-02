"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export type ProjectChallenge = {
  id: string;
  moduleSlug: string | null;
  year: number;
  title: string;
  summary: string;
  brief: string;
  deliverable: string | null;
  difficulty: "easy" | "medium" | "hard";
};

export type ProjectTeamMember = {
  id: string;
  teamId: string;
  studentId: string;
  displayName: string;
  avatarGradient: string;
  status: "pending" | "approved" | "removed";
  isOwnChild: boolean;
  requestedAt: string;
  decidedAt: string | null;
};

export type ProjectTeam = {
  id: string;
  challengeId: string;
  name: string;
  status: "forming" | "active" | "completed" | "suspended";
  createdByStudentId: string;
  createdAt: string;
  members: ProjectTeamMember[];
};

export type ReportReason = "inappropriate_content" | "harassment" | "safety_concern" | "spam" | "other";

export type WorkspacePost = {
  id: string;
  teamId: string;
  studentId: string;
  body: string;
  linkUrl: string | null;
  createdAt: string;
};

export type ProjectMeeting = {
  id: string;
  teamId: string;
  roomName: string;
  scheduledAt: string;
  status: "scheduled" | "live" | "ended";
  createdByStudentId: string;
};

function toChallenge(r: any): ProjectChallenge {
  return {
    id: r.id,
    moduleSlug: r.module_slug,
    year: r.year,
    title: r.title,
    summary: r.summary,
    brief: r.brief,
    deliverable: r.deliverable,
    difficulty: r.difficulty,
  };
}

function toMember(r: any, ownStudentIds: Set<string>): ProjectTeamMember {
  return {
    id: r.id,
    teamId: r.team_id,
    studentId: r.student_id,
    displayName: r.student_display_name,
    avatarGradient: r.student_avatar_gradient ?? "from-sky-500 to-sky-700",
    status: r.status,
    isOwnChild: ownStudentIds.has(r.student_id),
    requestedAt: r.requested_at,
    decidedAt: r.decided_at,
  };
}

/** Challenges available for a student's year. Demo mode returns []. */
export function useProjectChallenges(year: number | undefined) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [challenges, setChallenges] = useState<ProjectChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!year) {
      setChallenges([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("project_challenges")
      .select("*")
      .eq("year", year)
      .order("difficulty", { ascending: true });
    setChallenges(error ? [] : (data ?? []).map(toChallenge));
    setLoading(false);
  }, [supabase, year]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { challenges, loading, refresh };
}

/** All teams (any status) the given student belongs to, across challenges. */
export function useMyProjectTeams(studentId: string | undefined) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [teams, setTeams] = useState<ProjectTeam[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!studentId) {
      setTeams([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: memberRows, error: memberErr } = await supabase
      .from("project_team_members")
      .select("team_id")
      .eq("student_id", studentId)
      .neq("status", "removed");

    if (memberErr || !memberRows || memberRows.length === 0) {
      setTeams([]);
      setLoading(false);
      return;
    }

    const teamIds = [...new Set(memberRows.map((r) => r.team_id))];

    const [{ data: teamRows }, { data: allMembers }] = await Promise.all([
      supabase.from("project_teams").select("*").in("id", teamIds),
      supabase.from("project_team_members").select("*").in("team_id", teamIds),
    ]);

    const ownIds = new Set([studentId]);
    const byTeam = new Map<string, ProjectTeamMember[]>();
    for (const m of allMembers ?? []) {
      const list = byTeam.get(m.team_id) ?? [];
      list.push(toMember(m, ownIds));
      byTeam.set(m.team_id, list);
    }

    setTeams(
      (teamRows ?? []).map((t) => ({
        id: t.id,
        challengeId: t.challenge_id,
        name: t.name,
        status: t.status,
        createdByStudentId: t.created_by_student_id,
        createdAt: t.created_at,
        members: byTeam.get(t.id) ?? [],
      }))
    );
    setLoading(false);
  }, [supabase, studentId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { teams, loading, refresh };
}

/** Teams still 'forming' for a challenge (any family) — for "join an existing team" browsing. */
export function useOpenTeamsForChallenge(challengeId: string | undefined) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [teams, setTeams] = useState<ProjectTeam[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!challengeId) {
      setTeams([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: teamRows, error } = await supabase
      .from("project_teams")
      .select("*")
      .eq("challenge_id", challengeId)
      .eq("status", "forming");

    if (error || !teamRows || teamRows.length === 0) {
      setTeams([]);
      setLoading(false);
      return;
    }

    const teamIds = teamRows.map((t) => t.id);
    const { data: memberRows } = await supabase
      .from("project_team_members")
      .select("*")
      .in("team_id", teamIds)
      .eq("status", "approved");

    const byTeam = new Map<string, ProjectTeamMember[]>();
    for (const m of memberRows ?? []) {
      const list = byTeam.get(m.team_id) ?? [];
      list.push(toMember(m, new Set()));
      byTeam.set(m.team_id, list);
    }

    setTeams(
      teamRows.map((t) => ({
        id: t.id,
        challengeId: t.challenge_id,
        name: t.name,
        status: t.status,
        createdByStudentId: t.created_by_student_id,
        createdAt: t.created_at,
        members: byTeam.get(t.id) ?? [],
      }))
    );
    setLoading(false);
  }, [supabase, challengeId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { teams, loading, refresh };
}

/** A single team + its full roster, for the team workspace page. Requires the
 * caller to already be a member (or the team to still be 'forming') per RLS. */
export function useProjectTeam(teamId: string | undefined) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [team, setTeam] = useState<ProjectTeam | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!teamId) {
      setTeam(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: t }, { data: members }] = await Promise.all([
      supabase.from("project_teams").select("*").eq("id", teamId).maybeSingle(),
      supabase.from("project_team_members").select("*").eq("team_id", teamId),
    ]);
    if (!t) {
      setTeam(null);
      setLoading(false);
      return;
    }
    setTeam({
      id: t.id,
      challengeId: t.challenge_id,
      name: t.name,
      status: t.status,
      createdByStudentId: t.created_by_student_id,
      createdAt: t.created_at,
      members: (members ?? []).map((m) => toMember(m, new Set())),
    });
    setLoading(false);
  }, [supabase, teamId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { team, loading, refresh };
}

export async function createTeam(input: {
  challengeId: string;
  studentId: string;
  teamName: string;
}): Promise<{ ok: true; teamId: string } | { ok: false; error: string }> {
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase
    .from("project_teams")
    .insert({
      challenge_id: input.challengeId,
      name: input.teamName,
      created_by_student_id: input.studentId,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, teamId: data.id };
}

/** A parent requests THEIR OWN student join an existing team (row starts 'pending'). */
export async function requestJoinTeam(input: {
  teamId: string;
  studentId: string;
  displayName: string;
  avatarGradient: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseBrowser();
  const { error } = await supabase.from("project_team_members").insert({
    team_id: input.teamId,
    student_id: input.studentId,
    student_display_name: input.displayName,
    student_avatar_gradient: input.avatarGradient,
    status: "pending",
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** A parent approves or removes THEIR OWN student's membership row — never another family's. */
export async function decideOwnChildMembership(input: {
  memberRowId: string;
  decision: "approved" | "removed";
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseBrowser();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  const { error } = await supabase
    .from("project_team_members")
    .update({ status: input.decision, approved_by: user.id, decided_at: new Date().toISOString() })
    .eq("id", input.memberRowId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export function useWorkspacePosts(teamId: string | undefined) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [posts, setPosts] = useState<WorkspacePost[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!teamId) {
      setPosts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("project_workspace_posts")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: true });
    setPosts(
      error
        ? []
        : (data ?? []).map((r) => ({
            id: r.id,
            teamId: r.team_id,
            studentId: r.student_id,
            body: r.body,
            linkUrl: r.link_url,
            createdAt: r.created_at,
          }))
    );
    setLoading(false);
  }, [supabase, teamId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { posts, loading, refresh };
}

export async function postToWorkspace(input: {
  teamId: string;
  studentId: string;
  body: string;
  linkUrl?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseBrowser();
  const { error } = await supabase.from("project_workspace_posts").insert({
    team_id: input.teamId,
    student_id: input.studentId,
    body: input.body,
    link_url: input.linkUrl ?? null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Any parent can flag a team (or one post in it) for admin review, on behalf of their own student. */
export async function submitProjectReport(input: {
  teamId: string;
  postId?: string;
  reporterStudentId: string;
  reason: ReportReason;
  details?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseBrowser();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to report." };

  const { error } = await supabase.from("project_reports").insert({
    team_id: input.teamId,
    post_id: input.postId ?? null,
    reporter_student_id: input.reporterStudentId,
    reported_by: user.id,
    reason: input.reason,
    details: input.details ?? null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
