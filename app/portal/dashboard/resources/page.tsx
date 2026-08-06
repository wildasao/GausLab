"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useDashboard } from "@/lib/dashboard-context";
import { Download, FileText, BookOpen, Puzzle, Video, Star, Search, Filter } from "lucide-react";
import { cn } from "@/lib/cn";

type ResourceType = "Worksheet" | "Study guide" | "Practice pack" | "Video" | "Cheat sheet";

type Resource = {
  id: string;
  title: string;
  type: ResourceType;
  strand: "Number & Algebra" | "Measurement & Geometry" | "Statistics & Probability" | "NAPLAN";
  years: number[];
  pages?: number;
  minutes?: number;
  downloads: number;
  featured?: boolean;
  color: string;
};

const RESOURCES: Resource[] = [
  { id: "r-01", title: "NAPLAN Y5 Practice Pack",         type: "Practice pack", strand: "NAPLAN",                       years: [5],       pages: 32, downloads: 4820, featured: true,  color: "from-orange-500 to-orange-600" },
  { id: "r-02", title: "Fractions Mastery Worksheets",    type: "Worksheet",    strand: "Number & Algebra",              years: [3, 5, 7], pages: 18, downloads: 3611,                    color: "from-sky-500 to-sky-700" },
  { id: "r-03", title: "Decimals & Percentages Guide",    type: "Study guide",  strand: "Number & Algebra",              years: [5, 7],    pages: 22, downloads: 2740,                    color: "from-sky-500 to-sky-700" },
  { id: "r-04", title: "Area, Perimeter & Volume Set",    type: "Worksheet",    strand: "Measurement & Geometry",        years: [5, 7],    pages: 14, downloads: 2013,                    color: "from-orange-500 to-orange-600" },
  { id: "r-05", title: "Y7 Algebra Bridging Videos",      type: "Video",        strand: "Number & Algebra",              years: [7],       minutes: 45, downloads: 1850,                  color: "from-navy-600 to-navy-800" },
  { id: "r-06", title: "Angles & Parallel Lines Cheatsheet", type: "Cheat sheet", strand: "Measurement & Geometry",       years: [7, 9],    pages: 2,  downloads: 1502,                    color: "from-orange-500 to-orange-600" },
  { id: "r-07", title: "Statistics & Probability Y9 Pack", type: "Practice pack", strand: "Statistics & Probability",     years: [9],       pages: 24, downloads: 1381,                    color: "from-emerald-500 to-emerald-600" },
  { id: "r-08", title: "Times Tables Speed Drills",       type: "Worksheet",    strand: "Number & Algebra",              years: [3, 5],    pages: 6,  downloads: 1204,                    color: "from-sky-500 to-sky-700" },
  { id: "r-09", title: "NAPLAN Y9 Full Mock Exam",        type: "Practice pack", strand: "NAPLAN",                       years: [9],       pages: 40, downloads: 990,  featured: true,   color: "from-orange-500 to-orange-600" },
  { id: "r-10", title: "Word-Problem Strategies Guide",   type: "Study guide",  strand: "Number & Algebra",              years: [3, 5, 7], pages: 12, downloads: 872,                     color: "from-sky-500 to-sky-700" },
  { id: "r-11", title: "NAPLAN Y3 Warmup Booklet",        type: "Practice pack", strand: "NAPLAN",                       years: [3],       pages: 18, downloads: 741,                     color: "from-orange-500 to-orange-600" },
  { id: "r-12", title: "Coordinate Geometry Video Series", type: "Video",        strand: "Number & Algebra",              years: [9],       minutes: 60, downloads: 601,                    color: "from-navy-600 to-navy-800" },
];

const iconFor = (t: ResourceType) => {
  if (t === "Worksheet") return Puzzle;
  if (t === "Study guide") return BookOpen;
  if (t === "Practice pack") return FileText;
  if (t === "Video") return Video;
  return Star;
};

export default function ResourcesPage() {
  const { activeStudent } = useDashboard();
  const [query, setQuery] = useState("");
  const [strand, setStrand] = useState<"All" | Resource["strand"]>("All");
  const [year, setYear] = useState<"All" | number>(activeStudent.year || "All");
  const [type, setType] = useState<"All" | ResourceType>("All");

  const filtered = useMemo(() => {
    return RESOURCES.filter((r) => {
      if (query && !r.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (strand !== "All" && r.strand !== strand) return false;
      if (year !== "All" && !r.years.includes(year as number)) return false;
      if (type !== "All" && r.type !== type) return false;
      return true;
    });
  }, [query, strand, year, type]);

  const featured = RESOURCES.filter((r) => r.featured);

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Downloads, worksheets & study guides"
        description="Everything your tutor recommends — plus our full public NAPLAN library."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800">
            Suggest a resource
          </button>
        }
      />

      {/* Featured strip */}
      <section className="grid gap-4 sm:grid-cols-2">
        {featured.map((r) => {
          const Icon = iconFor(r.type);
          return (
            <article
              key={r.id}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-lift"
              style={{
                background:
                  r.strand === "NAPLAN"
                    ? "linear-gradient(135deg, #F97316, #EA580C)"
                    : "linear-gradient(135deg, #0EA5E9, #0369A1)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ring-white/25">
                  <Star className="h-3 w-3 fill-white" /> Featured
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-inset ring-white/25">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{r.title}</h3>
              <div className="mt-1 text-xs text-white/85">
                {r.type} · Y{r.years.join("/")} · {r.pages ? `${r.pages} pages` : `${r.minutes} min`}
              </div>
              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="text-white/80">{r.downloads.toLocaleString()} downloads</span>
                <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy-800 hover:bg-white/90">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Filters */}
      <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-navy-100">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="res-search" className="sr-only">Search resources</label>
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="res-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search worksheets, guides, videos…"
              className="w-full rounded-full bg-mist py-2 pl-9 pr-3 text-sm ring-1 ring-inset ring-navy-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            />
          </div>
          <Select label="Strand" value={String(strand)} options={["All", "Number & Algebra", "Measurement & Geometry", "Statistics & Probability", "NAPLAN"]} onChange={(v) => setStrand(v as "All" | Resource["strand"])} />
          <Select label="Year" value={String(year)} options={["All", "3", "5", "7", "9"]} onChange={(v) => setYear(v === "All" ? "All" : Number(v))} />
          <Select label="Type" value={String(type)} options={["All", "Worksheet", "Study guide", "Practice pack", "Video", "Cheat sheet"]} onChange={(v) => setType(v as "All" | ResourceType)} />
          <div className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            {filtered.length} of {RESOURCES.length}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => {
          const Icon = iconFor(r.type);
          return (
            <article
              key={r.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className={`relative h-28 bg-gradient-to-br ${r.color}`}>
                <div className="absolute inset-0 bg-noise opacity-30" />
                <div className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-inset ring-white/25 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="absolute right-4 top-4 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white ring-1 ring-inset ring-white/25">
                  {r.strand === "NAPLAN" ? "NAPLAN" : r.strand.split(" ")[0]}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {r.type}
                </div>
                <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
                  {r.title}
                </h3>
                <div className="mt-1 text-xs text-slate-500">
                  Year {r.years.join(", ")} · {r.pages ? `${r.pages} pages` : `${r.minutes} min`}
                </div>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="text-[11px] text-slate-500">
                    {r.downloads.toLocaleString()} downloads
                  </span>
                  <button className="inline-flex items-center gap-1 rounded-full bg-navy-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800">
                    <Download className="h-3.5 w-3.5" /> Get
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-3xl bg-white p-12 text-center text-slate-500 ring-1 ring-navy-100">
            No resources match those filters.
          </div>
        )}
      </section>
    </>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-xs text-slate-500">
      <span className="hidden sm:inline">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "appearance-none rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-navy-800 ring-1 ring-inset ring-navy-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        )}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
