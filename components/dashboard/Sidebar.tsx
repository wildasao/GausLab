"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/site/Logo";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarDays,
  MessageSquare,
  FolderDown,
  Sparkles,
  Settings,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";

const primary = [
  { label: "Overview", href: "/portal/dashboard", icon: LayoutDashboard },
  { label: "Progress", href: "/portal/dashboard/progress", icon: BookOpen },
  { label: "Homework", href: "/portal/dashboard/homework", icon: ClipboardList, badge: 3 },
  { label: "Lessons", href: "/portal/dashboard/lessons", icon: CalendarDays },
  { label: "Messages", href: "/portal/dashboard/messages", icon: MessageSquare, badge: 1 },
  { label: "Resources", href: "/portal/dashboard/resources", icon: FolderDown },
  { label: "AI tutor", href: "/portal/dashboard/ai", icon: Sparkles, pro: true },
];

const secondary = [
  { label: "Settings", href: "/portal/dashboard/settings", icon: Settings },
  { label: "Help", href: "/portal/dashboard/help", icon: LifeBuoy },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const supabase = getSupabaseBrowser();
  async function signOut() {
    await supabase.auth.signOut();
    router.push("/portal");
    router.refresh();
  }
  return (
    <aside className="flex h-full w-full flex-col bg-navy-800 text-navy-100">
      <div className="px-5 py-5">
        <Logo invert />
      </div>

      <div className="mx-4 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-200">
          NAPLAN 2026
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <div className="font-display text-2xl font-semibold text-white">218</div>
          <div className="text-[11px] text-navy-200">days to go</div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-sky-400 to-orange-400" />
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-3" aria-label="Portal">
        {primary.map((item) => {
          const active =
            item.href === "/portal/dashboard"
              ? pathname === "/portal/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white ring-1 ring-inset ring-white/15"
                  : "text-navy-200 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-sky-300" : "text-navy-300 group-hover:text-sky-300"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
              {item.pro && (
                <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-300 ring-1 ring-inset ring-sky-400/30">
                  New
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-1 border-t border-white/10 px-3 py-4">
        {secondary.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-white/10 text-white" : "text-navy-200 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-200 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
