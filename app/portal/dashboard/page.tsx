"use client";

import { HeroBanner } from "@/components/dashboard/widgets/HeroBanner";
import { KpiCards } from "@/components/dashboard/widgets/KpiCards";
import { ProgressChart } from "@/components/dashboard/widgets/ProgressChart";
import { TopicMastery } from "@/components/dashboard/widgets/TopicMastery";
import { UpcomingLessons } from "@/components/dashboard/widgets/UpcomingLessons";
import { HomeworkList } from "@/components/dashboard/widgets/HomeworkList";
import { Messages } from "@/components/dashboard/widgets/Messages";
import { AiTutorCard } from "@/components/dashboard/widgets/AiTutorCard";
import { daysUntilNaplan } from "@/lib/dashboard";
import { useDashboard } from "@/lib/dashboard-context";

export default function DashboardOverview() {
  const d = useDashboard();
  const days = daysUntilNaplan();
  const firstName = d.activeStudent.name.split(" ")[0];
  return (
    <>
      <HeroBanner student={d.activeStudent} days={days} parentName={d.parentName} />
      <KpiCards student={d.activeStudent} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <ProgressChart weekly={d.weekly} studentFirstName={firstName} />
          <TopicMastery topics={d.topics} studentFirstName={firstName} />
          <UpcomingLessons lessons={d.upcoming} />
        </div>
        <div className="space-y-6 lg:col-span-4">
          <AiTutorCard />
          <HomeworkList homework={d.homework} />
          <Messages messages={d.messages} tutorName={d.messages[0]?.from} />
        </div>
      </div>
    </>
  );
}
