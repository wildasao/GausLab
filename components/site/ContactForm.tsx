"use client";

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

type Status = "idle" | "loading" | "done" | "error";

export function ContactForm() {
  const supabase = getSupabaseBrowser();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      parent_name: String(data.get("name") || ""),
      child_name: String(data.get("child") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      year_level: String(data.get("year") || ""),
      preferred_format: String(data.get("format") || ""),
      notes: String(data.get("notes") || ""),
      consent: data.get("consent") === "on",
    };
    const { error } = await supabase.from("enquiries").insert(payload);
    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("done");
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
      {status === "done" && (
        <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-200">
          Thanks — your enquiry is in. We&rsquo;ll call within one business day.
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
