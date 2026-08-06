import type { Metadata } from "next";
import { DashboardProvider } from "@/lib/dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Parent Dashboard",
  description:
    "Monitor your child's mastery, lessons, homework and tutor feedback in one place.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-mist">
      <DashboardProvider>
        <DashboardShell>{children}</DashboardShell>
      </DashboardProvider>
    </div>
  );
}
