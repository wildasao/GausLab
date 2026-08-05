"use client";

import type { Message } from "@/lib/dashboard";

export function Messages({
  messages,
  tutorName,
}: {
  messages: Message[];
  tutorName?: string;
}) {
  return (
    <section
      aria-labelledby="messages-title"
      className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Inbox
          </div>
          <h2 id="messages-title" className="mt-1 font-display text-lg font-semibold text-navy-800">
            Messages from your tutor & team
          </h2>
        </div>
        <button className="text-xs font-semibold text-sky-700 hover:text-sky-800">Open inbox →</button>
      </div>
      <ul className="mt-4 divide-y divide-navy-100">
        {messages.length === 0 && (
          <li className="py-6 text-center text-sm text-slate-500">Inbox is empty.</li>
        )}
        {messages.map((m) => (
          <li key={m.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${m.color} text-xs font-semibold text-white`}
            >
              {m.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <div className="truncate text-sm font-semibold text-navy-800">
                  {m.from}
                  <span className="ml-2 font-normal text-[11px] text-slate-500">{m.role}</span>
                </div>
                <span className="shrink-0 text-[11px] text-slate-500">{m.time}</span>
              </div>
              <div className="mt-0.5 line-clamp-2 text-sm text-slate-600">{m.preview}</div>
            </div>
            {m.unread && (
              <span
                className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500"
                aria-label="Unread"
              />
            )}
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-4 flex items-center gap-2 rounded-full bg-mist p-1.5 ring-1 ring-inset ring-navy-100"
      >
        <input
          type="text"
          placeholder={tutorName ? `Reply to ${tutorName}…` : "Send a message…"}
          className="w-full bg-transparent px-3 text-sm placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600"
        >
          Send
        </button>
      </form>
    </section>
  );
}
