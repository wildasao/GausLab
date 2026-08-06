"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useDashboard } from "@/lib/dashboard-context";
import { RECENT_LESSONS, type LessonEntry } from "@/lib/dashboard";
import { Video, Users, CalendarPlus, PlayCircle, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Tab = "upcoming" | "past";

export default function LessonsPage() {
  const { upcoming, activeStudent } = useDashboard();
  const firstName = activeStudent.name.split(" ")[0];
  const [tab, setTab] = useState<Tab>("upcoming");

  const lessons: LessonEntry[] = tab === "upcoming" ? upcoming : RECENT_LESSONS;

  const attended = RECENT_LESSONS.length;
  const totalHours = activeStudent.hoursThisTerm;

  return (
    <>
      <PageHeader
        eyebrow="Lessons"
        title={`${firstName}'s schedule`}
        description="Join upcoming sessions in one click. Every past lesson has a recording, notes and a score."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            <CalendarPlus className="h-4 w-4" /> Book extra lesson
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Upcoming" value={upcoming.length} sub="Next 14 days" tone="text-sky-600" />
        <Stat label="Attended this term" value={attended} sub={`${totalHours}h total`} tone="text-emerald-600" />
        <Stat label="Attendance rate" value="98%" sub="You're crushing it" tone="text-orange-600" />
        <Stat label="Preferred tutor" value="Ms Priya Rao" sub="Since Term 1 2025" tone="text-navy-700" />
      </div>

      <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-navy-100 shadow-soft">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors",
              tab === t ? "bg-navy-700 text-white" : "text-navy-700/70 hover:bg-navy-50"
            )}
          >
            {t === "upcoming" ? `Upcoming · ${upcoming.length}` : `Past · ${RECENT_LESSONS.length}`}
          </button>
        ))}
      </div>

      {/* Lessons list */}
      <div className="space-y-3">
        {lessons.map((l) =>
          tab === "upcoming" ? <UpcomingCard key={l.id} lesson={l} /> : <PastCard key={l.id} lesson={l} />
        )}
        {lessons.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center text-slate-500 ring-1 ring-navy-100">
            {tab === "upcoming" ? "No lessons scheduled — book one from above." : "No past lessons yet."}
          </div>
        )}
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  sub: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`mt-2 font-display text-2xl font-semibold ${tone}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function UpcomingCard({ lesson }: { lesson: LessonEntry }) {
  return (
    <article className="flex flex-col items-start gap-4 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100 sm:flex-row sm:items-center">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-soft">
        <Video className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          {lesson.date}
        </div>
        <div className="mt-0.5 font-display text-base font-semibold text-navy-800">{lesson.topic}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" /> {lesson.tutor}
          </span>
          <span>· {lesson.duration}</span>
          <span>· {lesson.strand}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className="rounded-full bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-100">
          Reschedule
        </button>
        <button className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-600">
          Join <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}

function PastCard({ lesson }: { lesson: LessonEntry }) {
  const score = lesson.score || 90;
  const tone =
    score >= 90 ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : score >= 75 ? "bg-sky-50 text-sky-700 ring-sky-200" : "bg-amber-50 text-amber-700 ring-amber-200";
  return (
    <article className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100 sm:flex-row sm:items-center">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-100">
        <PlayCircle className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            {lesson.date}
          </span>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset", tone)}>
            {score}%
          </span>
        </div>
        <div className="mt-0.5 font-display text-base font-semibold text-navy-800">{lesson.topic}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" /> {lesson.tutor}
          </span>
          <span>· {lesson.duration}</span>
          <span>· {lesson.strand}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-100">
          <FileText className="h-3.5 w-3.5" /> Lesson notes
        </button>
        <button className="inline-flex items-center gap-1 rounded-full bg-navy-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-navy-800">
          <PlayCircle className="h-3.5 w-3.5" /> Recording
        </button>
      </div>
    </article>
  );
}
