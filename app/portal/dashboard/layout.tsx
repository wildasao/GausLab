import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parent Dashboard · Ava's Progress",
  description:
    "Monitor your child's mastery, lessons, homework and tutor feedback in one place.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-mist">{children}</div>;
}
