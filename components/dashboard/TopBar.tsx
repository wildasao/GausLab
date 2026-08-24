"use client";

import { useState } from "react";
import { Bell, Search, Menu, ChevronDown } from "lucide-react";
import type { Student } from "@/lib/dashboard";
import { cn } from "@/lib/cn";
import { AddChildDialog } from "./AddChildDialog";
import { useRouter } from "next/navigation";

export function TopBar({
  onOpenSidebar,
  students,
  activeId,
  parentName,
  onSelectStudent,
}: {
  onOpenSidebar?: () => void;
  students: Student[];
  activeId: string;
  parentName: string;
  onSelectStudent: (id: string) => void;
}) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const router = useRouter();
  const active = students.find((s) => s.id === activeId) ?? students[0];
  const parentInitials = (parentName || "Parent")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <>
    <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/85 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open navigation"
            className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-navy-100 text-navy-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Student switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSwitcherOpen((v) => !v)}
              aria-expanded={switcherOpen}
              className="inline-flex items-center gap-3 rounded-full bg-white px-3 py-1.5 ring-1 ring-navy-100 hover:ring-sky-200"
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br ${active.avatarGradient} text-xs font-semibold text-white`}
              >
                {active.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <span className="flex flex-col items-start leading-none">
                <span className="text-sm font-semibold text-navy-800">{active.name}</span>
                <span className="text-[11px] text-slate-500">Year {active.year} · Accelerate plan</span>
              </span>
              <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", switcherOpen && "rotate-180")} />
            </button>

            {switcherOpen && (
              <div
                role="listbox"
                className="absolute left-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lift"
              >
                {students.map((s) => {
                  const isActive = s.id === activeId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        onSelectStudent(s.id);
                        setSwitcherOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-navy-50",
                        isActive && "bg-sky-50"
                      )}
                    >
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${s.avatarGradient} text-xs font-semibold text-white`}
                      >
                        {s.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <span className="flex-1">
                        <div className="font-semibold text-navy-800">{s.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Year {s.year} · Band {s.currentBand} → {s.targetBand}
                        </div>
                      </span>
                      {isActive && (
                        <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    setSwitcherOpen(false);
                    setAddOpen(true);
                  }}
                  className="w-full border-t border-navy-100 px-4 py-3 text-left text-sm font-semibold text-sky-700 hover:bg-sky-50"
                >
                  + Add another child
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden flex-1 max-w-md md:block">
          <label htmlFor="dash-search" className="sr-only">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="dash-search"
              type="search"
              placeholder="Search topics, homework, tutors…"
              className="w-full rounded-full bg-mist py-2 pl-9 pr-3 text-sm ring-1 ring-inset ring-navy-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-full ring-1 ring-navy-100 text-navy-700 hover:ring-sky-200"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>
          <div className="hidden items-center gap-2 rounded-full bg-mist px-3 py-1.5 ring-1 ring-inset ring-navy-100 sm:flex">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-navy-700 text-[11px] font-semibold text-white">
              {parentInitials}
            </div>
            <div className="pr-1 text-xs">
              <div className="font-semibold text-navy-800">{parentName || "Parent"}</div>
              <div className="text-[10px] text-slate-500">Parent · Verified</div>
            </div>
          </div>
        </div>
      </div>
    </header>
    {addOpen && (
      <AddChildDialog
        onClose={() => setAddOpen(false)}
        onCreated={(newId) => {
          setAddOpen(false);
          onSelectStudent(newId);
          router.refresh();
        }}
      />
    )}
    </>
  );
}
