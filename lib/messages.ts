"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export type MessageRow = {
  id: string;
  studentId: string;
  fromName: string;      // the OTHER party in the thread (tutor/support/AI)
  fromRole: string | null;
  preview: string;
  unread: boolean;
  initials: string | null;
  color: string;
  direction: "inbound" | "outbound";
  senderId: string | null;
  sentAt: string;
};

export type MessageThread = {
  key: string;           // thread identifier = fromName
  fromName: string;
  fromRole: string;
  color: string;
  initials: string;
  lastPreview: string;
  lastAt: string;
  unread: number;
  bubbles: MessageRow[]; // sorted oldest → newest
};

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function toRow(r: {
  id: string;
  student_id: string;
  from_name: string;
  from_role: string | null;
  preview: string;
  unread: boolean;
  initials: string | null;
  color: string | null;
  direction: string | null;
  sender_id: string | null;
  sent_at: string;
}): MessageRow {
  return {
    id: r.id,
    studentId: r.student_id,
    fromName: r.from_name,
    fromRole: r.from_role,
    preview: r.preview,
    unread: !!r.unread,
    initials: r.initials,
    color: r.color ?? "from-sky-500 to-sky-700",
    direction: (r.direction ?? "inbound") as "inbound" | "outbound",
    senderId: r.sender_id,
    sentAt: r.sent_at,
  };
}

function buildThreads(rows: MessageRow[]): MessageThread[] {
  const by = new Map<string, MessageRow[]>();
  for (const r of rows) {
    const list = by.get(r.fromName) ?? [];
    list.push(r);
    by.set(r.fromName, list);
  }
  const threads: MessageThread[] = [];
  for (const [name, msgs] of by.entries()) {
    // Sort ascending for bubble display
    const sorted = [...msgs].sort((a, b) => a.sentAt.localeCompare(b.sentAt));
    const last = sorted[sorted.length - 1];
    const anyInbound = sorted.find((m) => m.direction === "inbound");
    threads.push({
      key: name,
      fromName: name,
      fromRole: anyInbound?.fromRole ?? sorted[0].fromRole ?? "",
      color: anyInbound?.color ?? sorted[0].color,
      initials: anyInbound?.initials ?? sorted[0].initials ?? initialsFrom(name),
      lastPreview: last.preview,
      lastAt: last.sentAt,
      unread: sorted.filter((m) => m.unread && m.direction === "inbound").length,
    bubbles: sorted,
    });
  }
  // Most-recent thread first
  threads.sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
  return threads;
}

/**
 * Real messages hook: pulls from Supabase, live-refreshes on demand.
 * Returns empty threads gracefully when unauthenticated / demo mode.
 */
export function useMessageThreads(studentId: string | undefined) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [rows, setRows] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"supabase" | "demo">("supabase");

  const refresh = useCallback(async () => {
    if (!studentId) {
      setRows([]);
      setLoading(false);
      setSource("demo");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("student_id", studentId)
      .order("sent_at", { ascending: false })
      .limit(500);
    if (error) {
      setRows([]);
      setSource("demo");
    } else {
      setRows((data ?? []).map(toRow));
      setSource("supabase");
    }
    setLoading(false);
  }, [supabase, studentId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const threads = useMemo(() => buildThreads(rows), [rows]);
  return { threads, loading, source, refresh };
}

export async function sendMessage(input: {
  studentId: string;
  threadKey: string;      // = the tutor/support/AI name
  fromRole: string | null;
  color: string;
  initials: string;
  body: string;
}): Promise<{ ok: true; row: MessageRow } | { ok: false; error: string }> {
  try {
    const supabase = getSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Sign in to send messages." };

    const { data, error } = await supabase
      .from("messages")
      .insert({
        student_id: input.studentId,
        from_name: input.threadKey,   // preserve thread grouping
        from_role: input.fromRole,
        color: input.color,
        initials: input.initials,
        preview: input.body,
        unread: false,
        direction: "outbound",
        sender_id: user.id,
      })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, row: toRow(data) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Send failed" };
  }
}

export async function markThreadRead(studentId: string, threadKey: string): Promise<void> {
  try {
    const supabase = getSupabaseBrowser();
    await supabase
      .from("messages")
      .update({ unread: false })
      .eq("student_id", studentId)
      .eq("from_name", threadKey)
      .eq("direction", "inbound")
      .eq("unread", true);
  } catch {
    // best-effort
  }
}

export function formatRelative(iso: string): string {
  const t = new Date(iso).getTime();
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  if (s < 604800) return `${Math.round(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
