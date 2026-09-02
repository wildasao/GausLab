"use client";

import { use, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useDashboard } from "@/lib/dashboard-context";
import {
  useProjectTeam,
  useWorkspacePosts,
  decideOwnChildMembership,
  postToWorkspace,
  type ProjectTeamMember,
} from "@/lib/projects";
import { ArrowLeft, Check, X, Send, Lock } from "lucide-react";
import { cn } from "@/lib/cn";

const teamStatusStyle: Record<string, string> = {
  forming: "bg-amber-50 text-amber-700 ring-amber-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  completed: "bg-navy-50 text-navy-700 ring-navy-200",
};

function MemberRow({
  member,
  canDecide,
  onDecide,
}: {
  member: ProjectTeamMember;
  canDecide: boolean;
  onDecide: (decision: "approved" | "removed") => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            `grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${member.avatarGradient} text-xs font-semibold text-white`,
            member.status === "pending" && "opacity-60"
          )}
        >
          {member.displayName.slice(0, 2).toUpperCase()}
        </span>
        <div>
          <div className="text-sm font-semibold text-navy-800">{member.displayName}</div>
          <div className="text-xs text-slate-500 capitalize">{member.status}</div>
        </div>
      </div>
      {canDecide && member.status === "pending" && (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onDecide("approved")}
            aria-label={`Approve ${member.displayName}`}
            className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDecide("removed")}
            aria-label={`Decline ${member.displayName}`}
            className="grid h-8 w-8 place-items-center rounded-full bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 hover:bg-rose-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </li>
  );
}

export default function ProjectTeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = use(params);
  const { activeStudent, students } = useDashboard();
  const { team, loading, refresh } = useProjectTeam(teamId);
  const { posts, loading: postsLoading, refresh: refreshPosts } = useWorkspacePosts(
    team?.status === "active" ? teamId : undefined
  );

  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ownStudentIds = new Set(students.map((s) => s.id));

  async function onDecide(memberRowId: string, decision: "approved" | "removed") {
    const res = await decideOwnChildMembership({ memberRowId, decision });
    if (res.ok) await refresh();
  }

  async function onSubmitPost(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !team) return;
    setPosting(true);
    setError(null);
    const res = await postToWorkspace({ teamId: team.id, studentId: activeStudent.id, body: draft.trim() });
    setPosting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDraft("");
    await refreshPosts();
  }

  if (loading) {
    return <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-soft ring-1 ring-navy-100">Loading…</div>;
  }

  if (!team) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-soft ring-1 ring-navy-100">
        Team not found, or you don't have access to it.
        <div className="mt-3">
          <Link href="/portal/dashboard/projects" className="text-sky-600 hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const isActive = team.status === "active";

  return (
    <>
      <Link
        href="/portal/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700"
      >
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <PageHeader
        eyebrow="Project team"
        title={team.name}
        description={
          isActive
            ? "Everyone's approved — the workspace is unlocked."
            : "Waiting on every member's own parent to approve before the workspace unlocks."
        }
        actions={
          <span className={cn("rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset", teamStatusStyle[team.status])}>
            {team.status}
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy-100 lg:col-span-4">
          <h2 className="mb-1 text-sm font-semibold text-navy-800">Team roster</h2>
          <ul className="divide-y divide-navy-100">
            {team.members.map((m) => (
              <MemberRow
                key={m.id}
                member={m}
                canDecide={ownStudentIds.has(m.studentId)}
                onDecide={(decision) => onDecide(m.id, decision)}
              />
            ))}
          </ul>
        </aside>

        <section className="rounded-2xl bg-white shadow-soft ring-1 ring-navy-100 lg:col-span-8">
          {!isActive ? (
            <div className="flex flex-col items-center justify-center gap-2 p-10 text-center text-sm text-slate-500">
              <Lock className="h-5 w-5 text-slate-400" />
              The shared workspace unlocks once every teammate is approved by their own parent.
            </div>
          ) : (
            <>
              <div className="border-b border-navy-100 p-4">
                <h2 className="text-sm font-semibold text-navy-800">Workspace</h2>
                <p className="text-xs text-slate-500">Share progress, ideas and links with your team.</p>
              </div>
              <div className="max-h-[50vh] space-y-3 overflow-y-auto p-4">
                {postsLoading && <div className="text-center text-sm text-slate-500">Loading…</div>}
                {!postsLoading && posts.length === 0 && (
                  <div className="text-center text-sm text-slate-500">No posts yet — be the first to share something.</div>
                )}
                {posts.map((p) => {
                  const author = team.members.find((m) => m.studentId === p.studentId);
                  return (
                    <div key={p.id} className="rounded-xl bg-mist p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-navy-700">
                        {author?.displayName ?? "Teammate"}
                        <span className="font-normal text-slate-400">
                          {new Date(p.createdAt).toLocaleString("en-AU", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-1 whitespace-pre-line text-sm text-navy-800">{p.body}</p>
                      {p.linkUrl && (
                        <a href={p.linkUrl} target="_blank" rel="noreferrer" className="mt-1 block truncate text-xs text-sky-600 hover:underline">
                          {p.linkUrl}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
              {error && (
                <div className="mx-4 mb-2 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-inset ring-rose-200" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={onSubmitPost} className="flex items-center gap-2 border-t border-navy-100 p-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Share an update…"
                  className="w-full rounded-full bg-mist px-4 py-2.5 text-sm ring-1 ring-inset ring-navy-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || posting}
                  aria-label="Post"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </>
  );
}
