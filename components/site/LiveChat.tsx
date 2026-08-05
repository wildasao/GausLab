"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export function LiveChat() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open live chat"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lift ring-4 ring-orange-500/20 transition-transform hover:-translate-y-1 hover:bg-orange-600"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat with GausLab"
          className="fixed bottom-24 right-5 z-50 w-[min(92vw,360px)] overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-navy-100"
        >
          <div className="flex items-center gap-3 bg-navy-800 p-4 text-white">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 font-semibold">
              G
            </div>
            <div>
              <div className="text-sm font-semibold">GausLab support</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online now · replies in minutes
              </div>
            </div>
          </div>
          <div className="max-h-72 space-y-3 overflow-auto bg-mist p-4">
            <div className="max-w-[85%] rounded-2xl bg-white p-3 text-sm text-navy-800 shadow-soft">
              G&rsquo;day! I&rsquo;m Emma from GausLab. Happy to answer questions about
              programs, pricing or the free assessment.
            </div>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 border-t border-navy-100 bg-white p-3"
          >
            <input
              type="text"
              placeholder="Type a message…"
              className="w-full rounded-full bg-mist px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            />
            <button
              type="submit"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
