import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Clock } from "lucide-react";
import { ARTICLES } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog · NAPLAN & Maths Learning Tips for Parents",
  description:
    "Insights, strategies and parenting advice for helping your child succeed in maths and NAPLAN.",
};

export default function BlogPage() {
  const [featured, ...rest] = ARTICLES;
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="NAPLAN, maths and parenting — from our tutors."
        description="Practical advice for helping your child build a lifelong love of maths, and prepare with confidence for NAPLAN and beyond."
      />
      <section className="pb-24">
        <Container>
          {/* Featured */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="mb-10 grid overflow-hidden rounded-3xl bg-white ring-1 ring-navy-100 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:ring-sky-200 lg:grid-cols-2"
            >
              <div className={`relative min-h-[220px] bg-gradient-to-br ${featured.color}`}>
                <div className="absolute inset-0 bg-noise opacity-40" />
                <div className="absolute left-4 top-4">
                  <Badge tone={featured.tagTone}>{featured.tag}</Badge>
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-orange-600">
                  Featured
                </div>
                <h2 className="mt-1 font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {featured.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {featured.readMinutes} min read
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-navy-100 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift hover:ring-sky-200"
              >
                <div className={`aspect-[16/9] w-full bg-gradient-to-br ${p.color} relative`}>
                  <div className="absolute inset-0 bg-noise opacity-40" />
                  <div className="absolute bottom-3 left-3">
                    <Badge tone={p.tagTone}>{p.tag}</Badge>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold text-navy-800 group-hover:text-navy-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {p.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {p.readMinutes} min read
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700">
                      Read more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
