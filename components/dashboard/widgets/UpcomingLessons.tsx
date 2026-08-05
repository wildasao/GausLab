"use client";

import type { LessonEntry } from "@/lib/dashboard";
import { Video, Users } from "lucide-react";

export function UpcomingLessons({ lessons }: { lessons: LessonEntry[] }) {
  return (
    <section
      aria-labelledby="upcoming-title"
      className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Schedule
          </div>
          <h2 id="upcoming-title" className="mt-1 font-display text-lg font-semibold text-navy-800">
            Upcoming lessons
          </h2>
        </div>
        <button className="text-xs font-semibold text-sky-700 hover:text-sky-800">Manage →</button>
      </div>
      <ul className="mt-5 divide-y divide-navy-100">
        {lessons.length === 0 && (
          <li className="py-8 text-center text-sm text-slate-500">No upcoming lessons scheduled.</li>
        )}
        {lessons.map((l) => (
          <li key={l.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200">
              <Video className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                {l.date}
              </div>
              <div className="mt-0.5 truncate text-sm font-semibold text-navy-800">{l.topic}</div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" /> {l.tutor}
                </span>
                <span>· {l.duration}</span>
                <span>· {l.strand}</span>
              </div>
            </div>
            <button className="hidden shrink-0 rounded-full bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-100 sm:inline-flex">
              Reschedule
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
