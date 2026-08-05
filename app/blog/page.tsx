import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog · NAPLAN & Maths Learning Tips for Parents",
  description:
    "Insights, strategies and parenting advice for helping your child succeed in maths and NAPLAN.",
};

const posts = [
  {
    slug: "naplan-year-5-2026-preparation-guide",
    title: "NAPLAN Year 5 2026: The Complete Preparation Guide for Parents",
    excerpt:
      "A step-by-step plan for the eight weeks leading into NAPLAN — with topic checklists and practice question sets.",
    tag: "NAPLAN",
    tone: "orange" as const,
    read: "8 min read",
    color: "from-orange-500 to-orange-600",
  },
  {
    slug: "fractions-that-actually-make-sense",
    title: "Fractions That Actually Make Sense: How We Teach Year 5",
    excerpt:
      "The classroom strategies parents can use at home to make fractions click for their child.",
    tag: "Learning strategies",
    tone: "sky" as const,
    read: "6 min read",
    color: "from-sky-500 to-sky-700",
  },
  {
    slug: "helping-anxious-maths-students",
    title: "Maths Anxiety Is Real — Here's How To Help At Home",
    excerpt:
      "Practical, evidence-based ways parents can rebuild a child's confidence with numbers.",
    tag: "Parent advice",
    tone: "navy" as const,
    read: "5 min read",
    color: "from-navy-600 to-navy-800",
  },
  {
    slug: "year-9-naplan-band-9-what-it-takes",
    title: "Year 9 NAPLAN Band 9: What It Actually Takes",
    excerpt:
      "A breakdown of what Band 9 students demonstrate — and how to close the gap.",
    tag: "NAPLAN",
    tone: "orange" as const,
    read: "7 min read",
    color: "from-orange-500 to-orange-600",
  },
  {
    slug: "why-mental-maths-still-matters",
    title: "Why Mental Maths Still Matters In An AI World",
    excerpt:
      "Cognitive science suggests strong mental arithmetic remains foundational for higher-order thinking.",
    tag: "Learning strategies",
    tone: "sky" as const,
    read: "4 min read",
    color: "from-sky-500 to-sky-700",
  },
  {
    slug: "choosing-a-maths-tutor-checklist",
    title: "Choosing A Maths Tutor: The Parent's Checklist",
    excerpt:
      "Ten questions to ask before enrolling your child in any tutoring program.",
    tag: "Parent advice",
    tone: "navy" as const,
    read: "5 min read",
    color: "from-navy-600 to-navy-800",
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="NAPLAN, maths and parenting — from our tutors."
        description="Practical advice for helping your child build a lifelong love of maths, and prepare with confidence for NAPLAN and beyond."
      />
      <section className="pb-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-navy-100 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-sky-200"
              >
                <div className={`aspect-[16/9] w-full bg-gradient-to-br ${p.color} relative`}>
                  <div className="absolute inset-0 bg-noise opacity-40" />
                  <div className="absolute bottom-3 left-3">
                    <Badge tone={p.tone}>{p.tag}</Badge>
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
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {p.read}</span>
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
