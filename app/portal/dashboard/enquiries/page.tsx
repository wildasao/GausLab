"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useEnquiries, updateEnquiryStatus, useIsAdmin, claimAdmin, type EnquiryStatus } from "@/lib/enquiries";
import {
  Mail,
  Phone,
  User,
  Calendar,
  Filter,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/cn";

const STATUS_TONE: Record<EnquiryStatus, string> = {
  new:       "bg-orange-50 text-orange-700 ring-orange-200",
  contacted: "bg-sky-50 text-sky-700 ring-sky-200",
  booked:    "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
  won:       "bg-emerald-50 text-emerald-700 ring-emerald-200",
  lost:      "bg-slate-100 text-slate-600 ring-slate-200",
  spam:      "bg-rose-50 text-rose-700 ring-rose-200",
};

const STATUS_ORDER: EnquiryStatus[] = ["new", "contacted", "booked", "won", "lost", "spam"];

export default function EnquiriesPage() {
  const { isAdmin, loading: adminLoading, refresh: refreshAdmin } = useIsAdmin();
  const { rows, loading, error, refresh } = useEnquiries();
  const [filter, setFilter] = useState<"all" | EnquiryStatus>("all");
  const [claimMsg, setClaimMsg] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    STATUS_ORDER.forEach((s) => (c[s] = 0));
    rows.forEach((r) => {
      c[r.status] = (c[r.status] ?? 0) + 1;
    });
    return c;
  }, [rows]);

  async function onClaim() {
    setClaimMsg("…");
    const res = await claimAdmin();
    setClaimMsg(res.message);
    if (res.ok) {
      await refreshAdmin();
      await refresh();
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="CRM · Admin only"
        title="Enquiries"
        description="Free-assessment requests submitted from your website. Track them from new → contacted → booked → won."
        actions={
          <button
            onClick={refresh}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 ring-1 ring-navy-100 hover:bg-navy-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        }
      />

      {/* Admin gate */}
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
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                The first person to click below becomes the workspace admin and gets
                access to all enquiries and leads submitted via the website. Only works if
                no admin has been claimed yet.
              </p>
              <button
                onClick={onClaim}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
              >
                <Sparkles className="h-4 w-4 text-orange-300" /> Claim admin access
              </button>
              {claimMsg && (
                <div className="mt-3 text-xs text-navy-700">Server said: {claimMsg}</div>
              )}
              <p className="mt-3 text-[11px] text-slate-500">
                Prefer SQL? Run in Supabase SQL editor:{" "}
                <code className="rounded bg-navy-50 px-1 font-mono">select public.claim_admin();</code>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* KPI strip */}
      {isAdmin && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Total enquiries" value={counts.all} tone="text-navy-700" />
          <Kpi label="New (unread)" value={counts.new ?? 0} tone="text-orange-600" />
          <Kpi label="Booked" value={counts.booked ?? 0} tone="text-fuchsia-600" />
          <Kpi label="Won" value={counts.won ?? 0} tone="text-emerald-600" />
        </div>
      )}

      {isAdmin && (
        <>
          {/* Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="All"
              count={counts.all}
            />
            {STATUS_ORDER.map((s) => (
              <Chip
                key={s}
                active={filter === s}
                onClick={() => setFilter(s)}
                label={s}
                count={counts[s] ?? 0}
              />
            ))}
            <div className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="h-3.5 w-3.5" /> {filtered.length} shown
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-inset ring-rose-200">
              {error}
            </div>
          )}

          {/* List */}
          {loading ? (
            <div className="rounded-3xl bg-white p-12 text-center text-sm text-slate-500 ring-1 ring-navy-100">
              Loading enquiries…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center text-sm text-slate-500 ring-1 ring-navy-100">
              No enquiries in this view yet.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((e) => (
                <EnquiryRow key={e.id} enquiry={e} onChanged={refresh} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <div className={`mt-2 font-display text-3xl font-semibold ${tone}`}>{value}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
        active ? "bg-navy-700 text-white shadow-soft" : "bg-white text-navy-700/70 ring-1 ring-navy-100 hover:bg-navy-50"
      )}
    >
      {label}
      <span className={cn("text-[10px]", active ? "text-sky-200" : "text-slate-500")}>{count}</span>
    </button>
  );
}

function EnquiryRow({ enquiry: e, onChanged }: { enquiry: ReturnType<typeof useEnquiries>["rows"][number]; onChanged: () => void }) {
  const [status, setStatus] = useState<EnquiryStatus>(e.status);
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function setNewStatus(s: EnquiryStatus) {
    setStatus(s);
    setBusy(true);
    await updateEnquiryStatus(e.id, s);
    setBusy(false);
    await onChanged();
  }

  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-base font-semibold text-navy-800">
              {e.parentName}
            </span>
            {e.childName && (
              <span className="text-xs text-slate-500">
                · child <span className="font-semibold text-navy-700">{e.childName}</span>
              </span>
            )}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ring-inset",
                STATUS_TONE[status]
              )}
            >
              {status}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-600">
            <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1 hover:text-navy-800">
              <Mail className="h-3 w-3" /> {e.email}
            </a>
            {e.phone && (
              <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1 hover:text-navy-800">
                <Phone className="h-3 w-3" /> {e.phone}
              </a>
            )}
            {e.yearLevel && (
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" /> {e.yearLevel}
              </span>
            )}
            {e.preferredFormat && <span>· {e.preferredFormat}</span>}
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(e.createdAt).toLocaleString("en-AU", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Status quick-set */}
        <div className="flex flex-wrap items-center gap-1">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => setNewStatus(s)}
              disabled={busy || s === status}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize transition-colors",
                s === status
                  ? "bg-navy-700 text-white"
                  : "bg-navy-50 text-navy-700 hover:bg-navy-100 disabled:opacity-40"
              )}
              title={`Mark as ${s}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {(e.notes || e.sourceUrl) && (
        <button
          type="button"
          onClick={() => setExpanded((x) => !x)}
          className="mt-3 text-[11px] font-semibold text-sky-700 hover:text-sky-800"
        >
          {expanded ? "Hide" : "Show"} details
        </button>
      )}
      {expanded && (
        <div className="mt-2 space-y-2 rounded-2xl bg-mist p-3 text-[12px] text-navy-700 ring-1 ring-inset ring-navy-100">
          {e.notes && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Parent notes
              </div>
              <p className="mt-1 whitespace-pre-line">{e.notes}</p>
            </div>
          )}
          {e.sourceUrl && (
            <a
              href={e.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:text-sky-800"
            >
              <ExternalLink className="h-3 w-3" /> Source page
            </a>
          )}
        </div>
      )}
    </article>
  );
}
