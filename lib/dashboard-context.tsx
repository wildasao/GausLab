"use client";

import { createContext, useContext, useState } from "react";
import { useDashboardData, type DashboardData } from "@/lib/dashboard-data";
import type { Student } from "@/lib/dashboard";

type Ctx = DashboardData & {
  activeStudent: Student;
  activeId: string;
  setActiveId: (id: string) => void;
};

const DashboardContext = createContext<Ctx | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveIdState] = useState<string | undefined>(undefined);
  const data = useDashboardData(activeId);
  const active = data.students.find((s) => s.id === activeId) ?? data.students[0];

  const value: Ctx | null = active
    ? { ...data, activeId: active.id, activeStudent: active, setActiveId: setActiveIdState }
    : null;

  if (data.loading || !value) {
    return (
      <div className="grid min-h-dvh place-items-center bg-mist">
        <div className="text-sm text-slate-500">Loading dashboard…</div>
      </div>
    );
  }
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): Ctx {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}
