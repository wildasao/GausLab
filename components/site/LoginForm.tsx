"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { Lock, Sparkles } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { cn } from "@/lib/cn";

type Mode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = getSupabaseBrowser();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "check-email">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setStatus("error");
        return;
      }
      // Optional: seed demo data on first login (no-op if student rows already exist)
      try { await supabase.rpc("seed_demo_data"); } catch {}
      router.push(params.get("next") || "/portal/dashboard");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name || email.split("@")[0] } },
      });
      if (error) {
        setError(error.message);
        setStatus("error");
        return;
      }
      // If email confirmation is disabled in the project, Supabase returns a session immediately.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        try { await supabase.rpc("seed_demo_data"); } catch {}
        router.push("/portal/dashboard");
        router.refresh();
      } else {
        setStatus("check-email");
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-8 sm:p-10">
      <div className="lg:hidden">
        <Logo />
      </div>
      <h1 className="mt-6 font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
        {mode === "signin" ? "Parent portal login" : "Create your parent account"}
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        {mode === "signin"
          ? "Enter your details to view your child's progress."
          : "Sign up in a minute and we'll set up a demo dashboard for you."}
      </p>

      {/* mode toggle */}
      <div className="mt-5 inline-flex rounded-full bg-navy-50 p-1 ring-1 ring-navy-100">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setStatus("idle");
            }}
            aria-pressed={mode === m}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              mode === m ? "bg-white text-navy-800 shadow-soft" : "text-navy-700/60"
            )}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="p-name" className="mb-1.5 block text-xs font-semibold text-navy-700">
              Parent name
            </label>
            <input
              id="p-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-full border border-navy-100 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            />
          </div>
        )}
        <div>
          <label htmlFor="p-email" className="mb-1.5 block text-xs font-semibold text-navy-700">
            Email
          </label>
          <input
            id="p-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border border-navy-100 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          />
        </div>
        <div>
          <label htmlFor="p-pw" className="mb-1.5 block text-xs font-semibold text-navy-700">
            Password
          </label>
          <input
            id="p-pw"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border border-navy-100 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          />
        </div>

        {mode === "signin" && (
          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="h-4 w-4 rounded border-navy-200 text-sky-600" />
              Remember me
            </label>
            <Link href="#" className="font-semibold text-sky-700 hover:text-sky-800">
              Forgot password?
            </Link>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-inset ring-rose-200"
          >
            {error}
          </div>
        )}

        {status === "check-email" && (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-200">
            Check your inbox — we've sent a confirmation link to <b>{email}</b>.
          </div>
        )}

        <Button size="lg" type="submit" className="w-full" disabled={status === "loading"}>
          {mode === "signin" ? <Lock className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          {status === "loading"
            ? "Please wait…"
            : mode === "signin"
            ? "Log in securely"
            : "Create account & continue"}
        </Button>

        <p className="text-center text-xs text-slate-500">
          {mode === "signin" ? (
            <>
              Don&rsquo;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-semibold text-sky-700 hover:text-sky-800"
              >
                Create one
              </button>
              {" "}or{" "}
              <Link href="/contact#assessment" className="font-semibold text-sky-700">
                book a free assessment
              </Link>
            </>
          ) : (
            <>
              Already have one?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-semibold text-sky-700 hover:text-sky-800"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
