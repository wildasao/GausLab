"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useDashboard } from "@/lib/dashboard-context";
import {
  useProjectChallenges,
  useMyProjectTeams,
  useOpenTeamsForChallenge,
  createTeam,
  requestJoinTeam,
  type ProjectChallenge,
} from "@/lib/projects";
import type { Student } from "@/lib/dashboard";
import { Users, Sparkles, Info, X, ArrowRight, UserPlus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const difficultyStyle: Record<ProjectChallenge["difficulty"], string> = {
  easy: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium: "bg-sky-50 text-sky-700 ring-sky-200",
  hard: "bg-orange-50 text-orange-700 ring-orange-200",
};

const teamStatusStyle: Record<string, string> = {
  forming: "bg-amber-50 text-amber-700 ring-amber-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  completed: "bg-navy-50 text-navy-700 ring-navy-200",
};

function ChallengeCard({
  challenge,
  activeStudent,
  onStartTeam,
  onJoined,
}: {
  challenge: ProjectChallenge;
  activeStudent: Student;
  onStartTeam: () => void;
  onJoined: (teamId: string) => void;
}) {
  const { teams: openTeams, loading, refresh } = useOpenTeamsForChallenge(challenge.id);
  const [expanded, setExpanded] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onRequestJoin(teamId: string) {
    setJoiningId(teamId);
    setError(null);
    const res = await requestJoinTeam({
      teamId,
      studentId: activeStudent.id,
      displayName: activeStudent.name.split(" ")[0],
      avatarGradient: activeStudent.avatarGradient,
    });
    setJoiningId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await refresh();
    onJoined(teamId);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
      <div className="flex items-center justify-between">
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ring-1 ring-inset", difficultyStyle[challenge.difficulty])}>
          {challenge.difficulty}
        </span>
        <Sparkles className="h-4 w-4 text-orange-400" />
      </div>
      <h3 className="font-display text-base font-semibold text-navy-800">{challenge.title}</h3>
      <p className="text-sm text-slate-600">{challenge.summary}</p>

      <button
        onClick={onStartTeam}
        className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
      >
        <Users className="h-4 w-4" /> Start a team
      </button>

      {!loading && openTeams.length > 0 && (
        <div className="border-t border-navy-100 pt-3">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center justify-between text-xs font-semibold text-sky-700"
          >
            {openTeams.length} team{openTeams.length > 1 ? "s" : ""} looking for members
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
          </button>
          {expanded && (
            <ul className="mt-2 space-y-2">
              {openTeams.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 rounded-xl bg-mist p-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-navy-800">{t.name}</div>
                    <div className="text-[11px] text-slate-500">{t.members.length} member{t.members.length !== 1 ? "s" : ""}</div>
                  </div>
                  <button
                    onClick={() => onRequestJoin(t.id)}
                    disabled={joiningId === t.id}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-200 disabled:opacity-50"
                  >
                    <UserPlus className="h-3 w-3" /> {joiningId === t.id ? "Requesting…" : "Request to join"}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {error && <p className="mt-2 text-[11px] text-rose-600">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const { activeStudent } = useDashboard();
  const firstName = activeStudent.name.split(" ")[0];
  const { challenges, loading: challengesLoading, refresh: refreshChallenges } =
    useProjectChallenges(activeStudent.year);
  const { teams, loading: teamsLoading, refresh: refreshTeams } = useMyProjectTeams(activeStudent.id);
  const router = useRouter();

  const [starting, setStarting] = useState<ProjectChallenge | null>(null);
  const [teamName, setTeamName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!starting || !teamName.trim() || !activeStudent.id) return;
    setSubmitting(true);
    setError(null);
    const res = await createTeam({
      challengeId: starting.id,
      studentId: activeStudent.id,
      teamName: teamName.trim(),
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setStarting(null);
    setTeamName("");
    await Promise.all([refreshTeams(), refreshChallenges()]);
    router.push(`/portal/dashboard/projects/${res.teamId}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Real-life maths challenges"
        description={`Team up with other students and turn what ${firstName} is learning into a real-world challenge.`}
      />

      <div className="rounded-2xl bg-sky-50 p-3 text-xs text-sky-800 ring-1 ring-inset ring-sky-200">
        <div className="inline-flex items-start gap-1.5">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Teams can include students from other families. A team only becomes active — unlocking the
          shared workspace and video meetings — once every member's own parent has approved them.
        </div>
      </div>

      {teams.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-navy-800">My teams</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((t) => (
              <button
                key={t.id}
                onClick={() => router.push(`/portal/dashboard/projects/${t.id}`)}
                className="flex flex-col gap-3 rounded-2xl bg-white p-4 text-left shadow-soft ring-1 ring-navy-100 transition hover:ring-sky-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-navy-800">{t.name}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", teamStatusStyle[t.status])}>
                    {t.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-2">
                    {t.members.slice(0, 4).map((m) => (
                      <span
                        key={m.id}
                        title={`${m.displayName}${m.status === "pending" ? " (pending)" : ""}`}
                        className={cn(
                          `grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br ${m.avatarGradient} text-[10px] font-semibold text-white ring-2 ring-white`,
                          m.status === "pending" && "opacity-50"
                        )}
                      >
                        {m.displayName.slice(0, 2).toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">
                    {t.members.filter((m) => m.status === "approved").length} approved
                    {t.members.some((m) => m.status === "pending") && ", awaiting approval"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-800">
          Challenges for Year {activeStudent.year}
        </h2>
        {challengesLoading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-soft ring-1 ring-navy-100">
            Loading…
          </div>
        ) : challenges.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-soft ring-1 ring-navy-100">
            No challenges yet — run <code className="rounded bg-mist px-1">supabase/schema.sql</code> to seed the starter set, or sign in.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((c) => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                activeStudent={activeStudent}
                onStartTeam={() => setStarting(c)}
                onJoined={(teamId) => router.push(`/portal/dashboard/projects/${teamId}`)}
              />
            ))}
          </div>
        )}
      </section>

      {starting && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-900/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-navy-800">Start a team</h3>
                <p className="mt-1 text-sm text-slate-600">{starting.title}</p>
              </div>
              <button
                onClick={() => setStarting(null)}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-mist hover:text-navy-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 rounded-xl bg-mist p-3 text-xs text-slate-600">{starting.brief}</p>
            <form onSubmit={onCreateTeam} className="mt-4 space-y-3">
              <div>
                <label htmlFor="team-name" className="mb-1 block text-xs font-semibold text-navy-700">
                  Team name
                </label>
                <input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder={`${firstName}'s team`}
                  required
                  className="w-full rounded-full bg-mist px-4 py-2.5 text-sm ring-1 ring-inset ring-navy-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                />
              </div>
              {error && (
                <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-inset ring-rose-200" role="alert">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting || !teamName.trim()}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {submitting ? "Creating…" : "Create team"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
