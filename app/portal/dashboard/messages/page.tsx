"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useDashboard } from "@/lib/dashboard-context";
import { Search, Send, Paperclip, Smile, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Message } from "@/lib/dashboard";

type Thread = {
  id: string;
  from: string;
  role: string;
  color: string;
  initials: string;
  lastPreview: string;
  lastTime: string;
  unread: number;
  bubbles: { fromMe: boolean; text: string; time: string }[];
};

// Group messages by sender into threads and add a couple of scripted replies for realism.
function buildThreads(messages: Message[]): Thread[] {
  const byFrom = new Map<string, Message[]>();
  messages.forEach((m) => {
    const list = byFrom.get(m.from) ?? [];
    list.push(m);
    byFrom.set(m.from, list);
  });
  return Array.from(byFrom.entries()).map(([from, ms], i) => {
    const first = ms[0];
    return {
      id: `t-${i}`,
      from,
      role: first.role,
      color: first.color,
      initials: first.initials,
      lastPreview: first.preview,
      lastTime: first.time,
      unread: ms.filter((m) => m.unread).length,
      bubbles: [
        ...ms.map((m) => ({ fromMe: false, text: m.preview, time: m.time })),
        // A friendly parent reply for the top thread so the chat pane isn't one-sided
        ...(i === 0
          ? [
              {
                fromMe: true,
                text: "Thanks so much! Really glad to hear the multi-step problems clicked. Should we schedule a parent call this Friday?",
                time: "1h ago",
              },
              {
                fromMe: false,
                text: "Absolutely — Friday at 3:30pm works for me. I'll send a calendar invite shortly.",
                time: "45m ago",
              },
            ]
          : []),
      ],
    };
  });
}

export default function MessagesPage() {
  const { messages, activeStudent } = useDashboard();
  const firstName = activeStudent.name.split(" ")[0];
  const threads = useMemo(() => buildThreads(messages), [messages]);
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const active = threads.find((t) => t.id === activeThreadId) ?? threads[0];

  const filtered = threads.filter(
    (t) =>
      !query ||
      t.from.toLowerCase().includes(query.toLowerCase()) ||
      t.lastPreview.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="Messages"
        title="Your inbox"
        description={`Stay in touch with ${firstName}'s tutors, the GausLab team and the AI tutor.`}
      />

      <div className="grid gap-6 rounded-3xl bg-white shadow-soft ring-1 ring-navy-100 lg:grid-cols-12 lg:h-[70vh]">
        {/* Thread list */}
        <aside className="border-navy-100 lg:col-span-4 lg:border-r">
          <div className="p-4">
            <label htmlFor="msg-search" className="sr-only">Search messages</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="msg-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full rounded-full bg-mist py-2 pl-9 pr-3 text-sm ring-1 ring-inset ring-navy-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
            </div>
          </div>
          <ul className="max-h-[52vh] overflow-y-auto pb-2 lg:max-h-none">
            {filtered.map((t) => {
              const isActive = t.id === active?.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setActiveThreadId(t.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "flex w-full items-start gap-3 border-t border-navy-100 px-4 py-3 text-left transition-colors hover:bg-navy-50",
                      isActive && "bg-sky-50"
                    )}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${t.color} text-xs font-semibold text-white`}
                    >
                      {t.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-navy-800">
                          {t.from}
                        </span>
                        <span className="shrink-0 text-[11px] text-slate-500">{t.lastTime}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-slate-500">
                        {t.lastPreview}
                      </span>
                    </span>
                    {t.unread > 0 && (
                      <span className="mt-1 min-w-[18px] rounded-full bg-orange-500 px-1.5 text-center text-[10px] font-semibold text-white">
                        {t.unread}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-slate-500">No matches.</li>
            )}
          </ul>
        </aside>

        {/* Active thread */}
        <section className="flex min-h-[400px] flex-col lg:col-span-8">
          {active ? (
            <>
              <header className="flex items-center justify-between gap-3 border-b border-navy-100 p-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${active.color} text-xs font-semibold text-white`}
                  >
                    {active.initials}
                  </span>
                  <div>
                    <div className="font-semibold text-navy-800">{active.from}</div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online · {active.role}
                    </div>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-100">
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" /> AI summary
                </button>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto bg-mist p-4">
                {active.bubbles.map((b, i) => (
                  <div key={i} className={cn("flex items-end gap-2", b.fromMe && "flex-row-reverse")}>
                    {!b.fromMe && (
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${active.color} text-[10px] font-semibold text-white`}
                      >
                        {active.initials}
                      </span>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-soft",
                        b.fromMe
                          ? "rounded-br-md bg-navy-700 text-white"
                          : "rounded-bl-md bg-white text-navy-800 ring-1 ring-navy-100"
                      )}
                    >
                      <p className="leading-relaxed">{b.text}</p>
                      <div className={cn("mt-1 text-[10px]", b.fromMe ? "text-navy-200" : "text-slate-500")}>{b.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDraft("");
                }}
                className="flex items-center gap-2 border-t border-navy-100 p-3"
              >
                <button
                  type="button"
                  aria-label="Attach file"
                  className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-navy-50 hover:text-navy-700"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Insert emoji"
                  className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-navy-50 hover:text-navy-700"
                >
                  <Smile className="h-4 w-4" />
                </button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message ${active.from}…`}
                  className="w-full rounded-full bg-mist px-4 py-2.5 text-sm ring-1 ring-inset ring-navy-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  aria-label="Send"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="grid h-full place-items-center text-sm text-slate-500">
              Select a conversation to view messages.
            </div>
          )}
        </section>
      </div>
    </>
  );
}
