"use client";

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { CheckCircle2, Phone, Sparkles } from "lucide-react";

type Status = "idle" | "loading" | "done" | "error";

export function ContactForm() {
  const supabase = getSupabaseBrowser();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const parentName = String(data.get("name") || "");
    const payload = {
      parent_name: parentName,
      child_name: String(data.get("child") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      year_level: String(data.get("year") || ""),
      preferred_format: String(data.get("format") || ""),
      notes: String(data.get("notes") || ""),
      consent: data.get("consent") === "on",
      source_url: typeof window !== "undefined" ? window.location.href : null,
    };
    const { error } = await supabase.from("enquiries").insert(payload);
    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }
    setSubmittedName(parentName.split(" ")[0] || "");
    form.reset();
    setStatus("done");
  }

  if (status === "done") {
    return (
      <section className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 shadow-soft ring-1 ring-navy-100">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lift">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
          Thanks{submittedName ? `, ${submittedName}` : ""} — your enquiry is in.
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
          One of our program coordinators will call you within one business day to schedule
          your child&rsquo;s free 45-minute diagnostic assessment.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Step n={1} label="We call you" desc="To pick a time that suits your family." />
          <Step n={2} label="Free assessment" desc="45 min, no obligation. Written report emailed." />
          <Step n={3} label="You decide" desc="Enrol or take the report and go — no pressure." />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <a
            href="tel:+61212345678"
            className="inline-flex items-center gap-1.5 rounded-full bg-navy-700 px-4 py-2 font-semibold text-white hover:bg-navy-800"
          >
            <Phone className="h-4 w-4" /> Or call us: 02 1234 5678
          </a>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Sparkles className="h-3 w-3 text-orange-500" /> Meanwhile, check the free resource library.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs font-semibold text-sky-700 hover:text-sky-800"
        >
          Send another enquiry
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-navy-100">
      <h2 className="font-display text-2xl font-semibold text-navy-800">
        Book your free diagnostic assessment
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Fill in the form and one of our program coordinators will call you to schedule a time.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Parent name" id="name" name="name" required />
        <Field label="Child's first name" id="child" name="child" required />
        <Field label="Email" id="email" name="email" type="email" required />
        <Field label="Phone" id="phone" name="phone" type="tel" required />
        <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
          <SelectField label="Year level" id="year" name="year" options={["Year 3", "Year 5", "Year 7", "Year 9"]} required />
          <SelectField
            label="Preferred format"
            id="format"
            name="format"
            options={["Online 1:1", "Online small group", "In-person (Sydney)", "Not sure yet"]}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="mb-1.5 block text-xs font-semibold text-navy-700">
            Tell us about your child (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Current strengths, struggles, NAPLAN goals…"
            className="w-full rounded-2xl border border-navy-100 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          />
        </div>
      </div>
      <div className="mt-6 flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-navy-200 text-sky-600 focus:ring-sky-500"
        />
        <label htmlFor="consent" className="text-xs leading-relaxed text-slate-600">
          I agree to be contacted by GausLab about my enquiry. See our{" "}
          <a href="/privacy" className="text-sky-700 underline">privacy policy</a>.
        </label>
      </div>
      {status === "error" && error && (
        <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-inset ring-rose-200" role="alert">
          {error}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="lg" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Book my free assessment"}
        </Button>
        <Button href="tel:+61212345678" variant="outline" size="lg">
          Prefer to call? 02 1234 5678
        </Button>
      </div>
    </form>
  );
}

function Step({ n, label, desc }: { n: number; label: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-navy-100">
      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-700 text-xs font-semibold text-white">
        {n}
      </div>
      <div className="mt-2 text-sm font-semibold text-navy-800">{label}</div>
      <div className="mt-0.5 text-xs text-slate-500">{desc}</div>
    </div>
  );
}

function Field({
  label,
  id,
  name,
  type = "text",
  required,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-navy-700">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-full border border-navy-100 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      />
    </div>
  );
}

function SelectField({
  label,
  id,
  name,
  options,
  required,
}: {
  label: string;
  id: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-navy-700">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        className="w-full appearance-none rounded-full border border-navy-100 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <option value="" disabled>Select</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
