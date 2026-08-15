"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export type Interest = "sports" | "art" | "reading" | "building" | "gaming" | "nature";
export type LearningStyle = "visual" | "kinesthetic" | "reading" | "social";
export type Confidence = "anxious" | "building" | "confident";
export type Motivation = "competition" | "mastery" | "praise" | "exploration";
export type VisualTheme = "apples" | "stars" | "hearts" | "cookies";

export type PersonalityProfile = {
  interests: Interest[];
  learningStyle: LearningStyle | null;
  confidence: Confidence | null;
  motivation: Motivation | null;
  visualTheme: VisualTheme;
  updatedAt?: string;
};

export const EMPTY_PROFILE: PersonalityProfile = {
  interests: [],
  learningStyle: null,
  confidence: null,
  motivation: null,
  visualTheme: "apples",
};

// ─── The 5-question survey ─────────────────────────────────────────

type BaseQ = { id: string; prompt: string; kind: "single" | "multi" };
type Option<T> = { id: T; label: string; emoji?: string };

export type PersonalityQuestion =
  | (BaseQ & { key: "interests"; kind: "multi"; options: Option<Interest>[]; maxPicks: number })
  | (BaseQ & { key: "learningStyle"; kind: "single"; options: Option<LearningStyle>[] })
  | (BaseQ & { key: "confidence"; kind: "single"; options: Option<Confidence>[] })
  | (BaseQ & { key: "motivation"; kind: "single"; options: Option<Motivation>[] })
  | (BaseQ & { key: "visualTheme"; kind: "single"; options: Option<VisualTheme>[] });

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    id: "q1",
    key: "interests",
    kind: "multi",
    prompt: "What do you love doing? Pick your top 3.",
    maxPicks: 3,
    options: [
      { id: "sports", label: "Sports", emoji: "⚽" },
      { id: "art", label: "Art & drawing", emoji: "🎨" },
      { id: "reading", label: "Reading", emoji: "📚" },
      { id: "building", label: "Building things", emoji: "🧱" },
      { id: "gaming", label: "Video games", emoji: "🎮" },
      { id: "nature", label: "Nature & animals", emoji: "🌱" },
    ],
  },
  {
    id: "q2",
    key: "learningStyle",
    kind: "single",
    prompt: "When you learn something new, what helps most?",
    options: [
      { id: "visual", label: "Seeing pictures and diagrams", emoji: "👀" },
      { id: "kinesthetic", label: "Doing it with my hands", emoji: "✋" },
      { id: "reading", label: "Reading about it", emoji: "📖" },
      { id: "social", label: "Talking about it with someone", emoji: "💬" },
    ],
  },
  {
    id: "q3",
    key: "confidence",
    kind: "single",
    prompt: "How do you feel about maths right now?",
    options: [
      { id: "anxious", label: "A bit nervous — I want to feel better at it", emoji: "😟" },
      { id: "building", label: "It's okay some days, tricky others", emoji: "🙂" },
      { id: "confident", label: "I like it and want to get even better!", emoji: "😄" },
    ],
  },
  {
    id: "q4",
    key: "motivation",
    kind: "single",
    prompt: "What makes you want to keep going with a hard question?",
    options: [
      { id: "competition", label: "Beating my previous score", emoji: "🏆" },
      { id: "mastery", label: "Getting every question right", emoji: "🎯" },
      { id: "praise", label: "Someone saying 'well done'", emoji: "🌟" },
      { id: "exploration", label: "Trying tricky new things", emoji: "🧠" },
    ],
  },
  {
    id: "q5",
    key: "visualTheme",
    kind: "single",
    prompt: "Pick your favourite theme — this will show up in the questions.",
    options: [
      { id: "apples", label: "Apples", emoji: "🍎" },
      { id: "stars", label: "Stars", emoji: "⭐" },
      { id: "hearts", label: "Hearts", emoji: "❤️" },
      { id: "cookies", label: "Cookies", emoji: "🍪" },
    ],
  },
];

// ─── Supabase hooks ────────────────────────────────────────────────

export function usePersonalityProfile() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("personality_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!data) {
        setProfile(null);
      } else {
        setProfile({
          interests: (data.interests ?? []) as Interest[],
          learningStyle: data.learning_style as LearningStyle | null,
          confidence: data.confidence as Confidence | null,
          motivation: data.motivation as Motivation | null,
          visualTheme: (data.visual_theme ?? "apples") as VisualTheme,
          updatedAt: data.updated_at,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { profile, loading, refresh };
}

export async function saveProfile(p: PersonalityProfile) {
  const supabase = getSupabaseBrowser();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  const { error } = await supabase.from("personality_profiles").upsert(
    {
      user_id: user.id,
      interests: p.interests,
      learning_style: p.learningStyle,
      confidence: p.confidence,
      motivation: p.motivation,
      visual_theme: p.visualTheme,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  return error ? { ok: false, error: error.message } : { ok: true };
}

// ─── Personalisation helpers ───────────────────────────────────────

export function overallToneFor(profile: PersonalityProfile | null): "encouraging" | "neutral" | "stretch" {
  if (!profile?.confidence) return "neutral";
  if (profile.confidence === "anxious") return "encouraging";
  if (profile.confidence === "confident") return "stretch";
  return "neutral";
}
