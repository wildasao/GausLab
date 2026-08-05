"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { HeroBanner } from "@/components/dashboard/widgets/HeroBanner";
import { KpiCards } from "@/components/dashboard/widgets/KpiCards";
import { ProgressChart } from "@/components/dashboard/widgets/ProgressChart";
import { TopicMastery } from "@/components/dashboard/widgets/TopicMastery";
import { UpcomingLessons } from "@/components/dashboard/widgets/UpcomingLessons";
import { HomeworkList } from "@/components/dashboard/widgets/HomeworkList";
import { Messages } from "@/components/dashboard/widgets/Messages";
import { AiTutorCard } from "@/components/dashboard/widgets/AiTutorCard";
import { daysUntilNaplan } from "@/lib/dashboard";
import { useDashboardData } from "@/lib/dashboard-data";
import { X, Database } from "lucide-react";

export default function DashboardOverview() {
  const [studentId, setStudentId] = useState<string | undefined>(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);
  const data = useDashboardData(studentId);
  const active = data.students.find((s) => s.id === studentId) ?? data.students[0];
  const days = daysUntilNaplan();

  if (data.loading || !active) {
    return (
      <div className="grid min-h-dvh place-items-center bg-mist">
        <div className="text-sm text-slate-500">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      <div className="sticky top-0 hidden h-dvh lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-[80vw] max-w-[300px] shadow-lift">
            <div className="relative h-full">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15"
              >
                <X className="h-4 w-4" />
              </button>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <TopBar
          onOpenSidebar={() => setMobileOpen(true)}
          students={data.students}
          parentName={data.parentName}
          activeId={active.id}
          onSelectStudent={setStudentId}
        />

        <div className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-4 lg:p-8">
          {data.source === "demo" && (
            <div className="rounded-2xl bg-orange-50 p-3 text-xs text-orange-800 ring-1 ring-inset ring-orange-200">
              <div className="flex items-start gap-2">
                <Database className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <span className="font-semibold">Demo mode.</span>{" "}
                  Your Supabase tables are empty or the schema hasn&rsquo;t been applied yet.
                  Run <code className="rounded bg-orange-100 px-1">supabase/schema.sql</code> in
                  the SQL editor, then click <em>Sign out</em> and sign back in — a demo student
                  will be seeded automatically.
                </div>
              </div>
            </div>
          )}

          <HeroBanner student={active} days={days} parentName={data.parentName} />
          <KpiCards student={active} />

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <ProgressChart weekly={data.weekly} studentFirstName={active.name.split(" ")[0]} />
              <TopicMastery topics={data.topics} studentFirstName={active.name.split(" ")[0]} />
              <UpcomingLessons lessons={data.upcoming} />
            </div>
            <div className="space-y-6 lg:col-span-4">
              <AiTutorCard />
              <HomeworkList homework={data.homework} />
              <Messages messages={data.messages} tutorName={data.messages[0]?.from} />
            </div>
          </div>

          <footer className="pt-4 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} GausLab Maths Academy · Data powered by Supabase · Australian data hosting
          </footer>
        </div>
      </div>
    </div>
  );
}
