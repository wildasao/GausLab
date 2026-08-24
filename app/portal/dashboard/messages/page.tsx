"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useDashboard } from "@/lib/dashboard-context";
import {
  useMessageThreads,
  sendMessage,
  markThreadRead,
  formatRelative,
  type MessageThread,
  type MessageRow,
} from "@/lib/messages";
import { Search, Send, Paperclip, Smile, Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/cn";

function parentInitials(name: string | undefined) {
  if (!name) return "P";
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MessagesPage() {
  const { activeStudent, parentName } = useDashboard();
  const firstName = activeStudent.name.split(" ")[0];
  const { threads, loading, source, refresh } = useMessageThreads(activeStudent.id);

  const [activeKey, setActiveKey] = useState<string>("");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Optimistic bubbles keyed by thread key
  const [pending, setPending] = useState<Record<string, MessageRow[]>>({});

  // Pick a default thread when data loads
  useEffect(() => {
    if (!activeKey && threads.length > 0) setActiveKey(threads[0].key);
  }, [threads, activeKey]);

  // Mark inbound messages read when opening a thread
  useEffect(() => {
    if (!activeKey || !activeStudent.id || source !== "supabase") return;
    const t = threads.find((x) => x.key === activeKey);
    if (t && t.unread > 0) {
      void markThreadRead(activeStudent.id, activeKey).then(() => refresh());
    }
  }, [activeKey, activeStudent.id, threads, source, refresh]);

  const filtered = useMemo(
    () =>
      threads.filter(
        (t) =>
          !query ||
          t.fromName.toLowerCase().includes(query.toLowerCase()) ||
          t.lastPreview.toLowerCase().includes(query.toLowerCase())
      ),
    [threads, query]
  );

  const active = threads.find((t) => t.key === activeKey);
  const activeWithPending: MessageThread | undefined = active
    ? { ...active, bubbles: [...active.bubbles, ...(pending[active.key] ?? [])] }
    : undefined;

  const parentDisplay = parentName || "You";
  const pInitials = parentInitials(parentName);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !active || !activeStudent.id) return;
    setSending(true);
    setError(null);
    const text = draft.trim();
    setDraft("");

    // Optimistic bubble
    const optimisticId = `opt-${Date.now()}`;
    const optimistic: MessageRow = {
      id: optimisticId,
      studentId: activeStudent.id,
      fromName: active.fromName,
      fromRole: active.fromRole,
      preview: text,
      unread: false,
      initials: pInitials,
      color: "from-orange-500 to-orange-600",
      direction: "outbound",
      senderId: null,
      sentAt: new Date().toISOString(),
    };
    setPending((p) => ({ ...p, [active.key]: [...(p[active.key] ?? []), optimistic] }));

    const res = await sendMessage({
      studentId: activeStudent.id,
      threadKey: active.fromName,
      fromRole: active.fromRole,
      color: active.color,
      initials: active.initials,
      body: text,
    });
    setSending(false);

    if (!res.ok) {
      setError(res.error);
      // Roll back the optimistic bubble
      setPending((p) => ({
        ...p,
        [active.key]: (p[active.key] ?? []).filter((b) => b.id !== optimisticId),
      }));
      return;
    }

    // Server accepted — refresh from source of truth, drop optimistic bubble
    await refresh();
    setPending((p) => {
      const next = { ...p };
      next[active.key] = (next[active.key] ?? []).filter((b) => b.id !== optimisticId);
      return next;
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Messages"
        title="Your inbox"
        description={`Stay in touch with ${firstName}'s tutors, the GausLab team and the AI tutor.`}
      />

      {source === "demo" && (
        <div className="rounded-2xl bg-orange-50 p-3 text-xs text-orange-800 ring-1 ring-inset ring-orange-200">
          <div className="inline-flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Demo mode — sign in and run <code className="rounded bg-orange-100 px-1">supabase/schema.sql</code> to enable real message sending.
          </div>
        </div>
      )}

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
            {loading && (
              <li className="px-4 py-8 text-center text-sm text-slate-500">Loading…</li>
            )}
            {!loading && filtered.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-slate-500">
                {query ? "No matches." : "No conversations yet."}
              </li>
            )}
            {filtered.map((t) => {
              const isActive = t.key === activeKey;
              return (
                <li key={t.key}>
                  <button
                    type="button"
                    onClick={() => setActiveKey(t.key)}
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
                          {t.fromName}
                        </span>
                        <span className="shrink-0 text-[11px] text-slate-500">
                          {formatRelative(t.lastAt)}
                        </span>
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
          </ul>
        </aside>

        {/* Active thread */}
        <section className="flex min-h-[400px] flex-col lg:col-span-8">
          {activeWithPending ? (
            <>
              <header className="flex items-center justify-between gap-3 border-b border-navy-100 p-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${activeWithPending.color} text-xs font-semibold text-white`}
                  >
                    {activeWithPending.initials}
                  </span>
                  <div>
                    <div className="font-semibold text-navy-800">{activeWithPending.fromName}</div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online · {activeWithPending.fromRole || "GausLab"}
                    </div>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-100">
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" /> AI summary
                </button>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto bg-mist p-4">
                <AnimatePresence initial={false}>
                  {activeWithPending.bubbles.map((b) => {
                    const outbound = b.direction === "outbound";
                    return (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={cn("flex items-end gap-2", outbound && "flex-row-reverse")}
                      >
                        {!outbound ? (
                          <span
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${activeWithPending.color} text-[10px] font-semibold text-white`}
                          >
                            {activeWithPending.initials}
                          </span>
                        ) : (
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-[10px] font-semibold text-white">
                            {pInitials}
                          </span>
                        )}
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-soft",
                            outbound
                              ? "rounded-br-md bg-navy-700 text-white"
                              : "rounded-bl-md bg-white text-navy-800 ring-1 ring-navy-100"
                          )}
                        >
                          <p className="leading-relaxed whitespace-pre-line">{b.preview}</p>
                          <div className={cn("mt-1 text-[10px]", outbound ? "text-navy-200" : "text-slate-500")}>
                            {outbound ? parentDisplay + " · " : ""}
                            {formatRelative(b.sentAt)}
                            {b.id.startsWith("opt-") && " · sending"}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {error && (
                <div className="mx-3 mb-2 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-inset ring-rose-200" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-navy-100 p-3">
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
                  placeholder={`Message ${activeWithPending.fromName}…`}
                  disabled={source === "demo" || sending}
                  className="w-full rounded-full bg-mist px-4 py-2.5 text-sm ring-1 ring-inset ring-navy-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || sending || source === "demo"}
                  aria-label="Send"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="grid h-full place-items-center text-sm text-slate-500">
              {loading ? "Loading…" : "Select a conversation to view messages."}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
