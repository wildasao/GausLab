"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useIsAdmin, claimAdmin } from "@/lib/enquiries";
import {
  useAdminProjectTeams,
  useAdminProjectReports,
  adminSetTeamStatus,
  adminRemoveMember,
  adminSetReportStatus,
  type AdminReportStatus,
} from "@/lib/project-admin";
import { ShieldAlert, Sparkles, RefreshCw, Flag, Users, Check, X, Ban } from "lucide-react";
import { cn } from "@/lib/cn";

const teamStatusStyle: Record<string, string> = {
  forming: "bg-amber-50 text-amber-700 ring-amber-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  completed: "bg-navy-50 text-navy-700 ring-navy-200",
  suspended: "bg-rose-50 text-rose-700 ring-rose-200",
};

const reportStatusStyle: Record<AdminReportStatus, string> = {
  open: "bg-rose-50 text-rose-700 ring-rose-200",
  reviewed: "bg-sky-50 text-sky-700 ring-sky-200",
  dismissed: "bg-navy-50 text-navy-700 ring-navy-200",
};

const REASON_LABEL: Record<string, string> = {
  inappropriate_content: "Inappropriate content",
  harassment: "Harassment or bullying",
  safety_concern: "Safety concern",
  spam: "Spam",
  other: "Other",
};

export default function ProjectsAdminPage() {
  const { isAdmin, loading: adminLoading, refresh: refreshAdmin } = useIsAdmin();
  const { teams, loading: teamsLoading, refresh: refreshTeams } = useAdminProjectTeams();
  const { reports, loading: reportsLoading, refresh: refreshReports } = useAdminProjectReports();
  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const [reportFilter, setReportFilter] = useState<"open" | "all">("open");

  const filteredReports = useMemo(
    () => (reportFilter === "open" ? reports.filter((r) => r.status === "open") : reports),
    [reports, reportFilter]
  );

  async function onClaim() {
    setClaimMsg("…");
    const res = await claimAdmin();
    setClaimMsg(res.message);
    if (res.ok) await refreshAdmin();
  }

  async function refreshAll() {
    await Promise.all([refreshTeams(), refreshReports()]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Projects · Admin only"
        title="Project moderation"
        description="Review reported content and manage cross-family teams."
        actions={
          <button
            onClick={refreshAll}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 ring-1 ring-navy-100 hover:bg-navy-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        }
      />

      {!adminLoading && !isAdmin && (
        <section className="rounded-3xl bg-gradient-to-br from-orange-50 via-white to-sky-50 p-6 ring-1 ring-navy-100 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-orange-500 text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-orange-700">
                Admin access required
              </div>
              <h2 className="mt-1 font-display text-lg font-semibold text-navy-800">
                Claim this workspace as owner
              </h2>
              <button
                onClick={onClaim}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
              >
                <Sparkles className="h-4 w-4 text-orange-300" /> Claim admin access
              </button>
              {claimMsg && <div className="mt-3 text-xs text-navy-700">Server said: {claimMsg}</div>}
            </div>
          </div>
        </section>
      )}

      {isAdmin && (
        <>
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-navy-800">Reports</h2>
              <div className="flex gap-1.5">
                {(["open", "all"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setReportFilter(f)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                      reportFilter === f ? "bg-navy-700 text-white" : "bg-white text-navy-700 ring-1 ring-navy-100 hover:bg-navy-50"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {reportsLoading ? (
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-soft ring-1 ring-navy-100">Loading…</div>
            ) : filteredReports.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-soft ring-1 ring-navy-100">
                No {reportFilter === "open" ? "open " : ""}reports.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReports.map((r) => (
                  <article key={r.id} className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy-100">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Flag className="h-3.5 w-3.5 text-rose-500" />
                          <span className="text-sm font-semibold text-navy-800">{REASON_LABEL[r.reason] ?? r.reason}</span>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ring-inset", reportStatusStyle[r.status])}>
                            {r.status}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Team: <span className="font-semibold text-navy-700">{r.teamName}</span> ·{" "}
                          {new Date(r.createdAt).toLocaleString("en-AU", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                        </div>
                        {r.postBody && (
                          <p className="mt-2 rounded-xl bg-mist p-2.5 text-xs text-navy-700">"{r.postBody}"</p>
                        )}
                        {r.details && <p className="mt-2 text-xs text-slate-600">{r.details}</p>}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {r.status !== "reviewed" && (
                          <button
                            onClick={async () => {
                              await adminSetReportStatus(r.id, "reviewed");
                              await refreshReports();
                            }}
                            className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-inset ring-sky-200 hover:bg-sky-100"
                          >
                            <Check className="h-3 w-3" /> Reviewed
                          </button>
                        )}
                        {r.status !== "dismissed" && (
                          <button
                            onClick={async () => {
                              await adminSetReportStatus(r.id, "dismissed");
                              await refreshReports();
                            }}
                            className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-semibold text-navy-700 ring-1 ring-inset ring-navy-100 hover:bg-navy-100"
                          >
                            <X className="h-3 w-3" /> Dismiss
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            await adminSetTeamStatus(r.teamId, "suspended");
                            await refreshAll();
                          }}
                          className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-200 hover:bg-rose-100"
                        >
                          <Ban className="h-3 w-3" /> Suspend team
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-navy-800">All teams</h2>
            {teamsLoading ? (
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-soft ring-1 ring-navy-100">Loading…</div>
            ) : teams.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-soft ring-1 ring-navy-100">No teams yet.</div>
            ) : (
              <div className="space-y-3">
                {teams.map((t) => (
                  <article key={t.id} className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy-100">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-navy-400" />
                          <span className="text-sm font-semibold text-navy-800">{t.name}</span>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ring-inset", teamStatusStyle[t.status])}>
                            {t.status}
                          </span>
                        </div>
                        {t.challengeTitle && <div className="mt-0.5 text-xs text-slate-500">{t.challengeTitle}</div>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {t.status !== "active" && (
                          <button
                            onClick={async () => {
                              await adminSetTeamStatus(t.id, "active");
                              await refreshTeams();
                            }}
                            className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100"
                          >
                            Reinstate
                          </button>
                        )}
                        {t.status !== "suspended" && (
                          <button
                            onClick={async () => {
                              await adminSetTeamStatus(t.id, "suspended");
                              await refreshTeams();
                            }}
                            className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-200 hover:bg-rose-100"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {t.members.map((m) => (
                        <li
                          key={m.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-[11px] text-navy-700"
                        >
                          {m.displayName}
                          <span className="text-slate-400 capitalize">({m.status})</span>
                          {m.status !== "removed" && (
                            <button
                              onClick={async () => {
                                await adminRemoveMember(m.id);
                                await refreshTeams();
                              }}
                              aria-label={`Remove ${m.displayName}`}
                              className="text-rose-500 hover:text-rose-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
