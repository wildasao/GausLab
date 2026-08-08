import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ARTICLES, getArticle, getRelatedArticles, type ArticleBlock } from "@/lib/blog";
import { getModule } from "@/lib/modules";
import {
  ArrowLeft,
  Clock,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Info,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Article not found" };
  return {
    title: a.title,
    description: a.excerpt,
    openGraph: {
      title: a.title,
      description: a.excerpt,
      type: "article",
      publishedTime: a.publishedAt,
      authors: [a.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description: a.excerpt,
    },
  };
}

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return notFound();

  const related = getRelatedArticles(slug, article.tag);
  const relatedModules = (article.relatedModules ?? [])
    .map(getModule)
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: { "@type": "Person", name: article.author.name },
    publisher: {
      "@type": "Organization",
      name: "GausLab Maths Academy",
      logo: {
        "@type": "ImageObject",
        url: "https://gauslab.com.au/logo.png",
      },
    },
    mainEntityOfPage: `https://gauslab.com.au/blog/${article.slug}`,
  };

  return (
    <>
      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${article.color} text-white`}>
        {article.heroImage ? (
          <>
            <Image
              src={article.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/60 to-navy-900/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-noise opacity-30" />
        )}
        <Container>
          <div className="relative py-14 sm:py-20">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All articles
            </Link>
            <div className="mt-4 max-w-3xl">
              <Badge tone={article.tagTone} className="!bg-white/15 !text-white !ring-white/30">
                {article.tag}
              </Badge>
              <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                {article.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/85">
                <div className="flex items-center gap-2">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br ${article.author.color} text-[11px] font-semibold text-white ring-2 ring-white/50`}
                  >
                    {article.author.initials}
                  </span>
                  <span className="font-semibold text-white">{article.author.name}</span>
                  <span className="text-white/70">· {article.author.role}</span>
                </div>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(article.publishedAt).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {article.readMinutes} min read
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Body */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
            {/* Main column */}
            <article className="lg:col-span-8">
              {/* Key takeaways */}
              <aside className="mb-10 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-orange-50 p-6 ring-1 ring-navy-100 shadow-soft">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-navy-700 ring-1 ring-navy-100">
                  <Sparkles className="h-3 w-3 text-orange-500" /> Key takeaways
                </div>
                <ul className="mt-3 space-y-2 text-sm text-navy-800">
                  {article.keyTakeaways.map((k) => (
                    <li key={k} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="prose-styled">
                {article.body.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>

              {/* Author card */}
              <div className="mt-14 flex items-center gap-4 rounded-3xl bg-mist p-5 ring-1 ring-navy-100">
                <div
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br ${article.author.color} font-display text-lg font-semibold text-white`}
                >
                  {article.author.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-base font-semibold text-navy-800">
                    Written by {article.author.name}
                  </div>
                  <div className="text-xs text-slate-600">{article.author.role}</div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Related modules */}
                {relatedModules.length > 0 && (
                  <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-orange-600">
                      Interactive modules
                    </div>
                    <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
                      Practice what you just read
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {relatedModules.map((m) => (
                        <li key={m.slug}>
                          <Link
                            href={`/portal/dashboard/modules/${m.slug}`}
                            className="flex items-start gap-3 rounded-2xl bg-mist p-3 ring-1 ring-inset ring-navy-100 transition-colors hover:bg-navy-50"
                          >
                            <span className={`h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br ${m.color}`} />
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-navy-800">
                                {m.title}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                Year {m.year} · {m.minutes} min
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="rounded-3xl bg-gradient-to-br from-navy-800 via-navy-700 to-sky-700 p-6 text-white shadow-lift">
                  <div className="text-xs font-semibold uppercase tracking-widest text-sky-200">
                    Free assessment
                  </div>
                  <h3 className="mt-1 font-display text-lg font-semibold">
                    Want a proper plan for your child?
                  </h3>
                  <p className="mt-2 text-xs text-navy-100">
                    Book a 45-minute diagnostic. Written report. Zero obligation.
                  </p>
                  <Button
                    href="/contact#assessment"
                    variant="primary"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    Book free assessment
                  </Button>
                </div>
              </div>
            </aside>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="mx-auto mt-20 max-w-6xl">
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="font-display text-xl font-semibold text-navy-800">
                  Related articles
                </h2>
                <Link href="/blog" className="text-xs font-semibold text-sky-700 hover:text-sky-800">
                  Browse all →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-navy-100 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift hover:ring-sky-200"
                  >
                    <div className={`relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br ${r.color}`}>
                      {r.heroImage ? (
                        <Image
                          src={r.heroImage}
                          alt=""
                          fill
                          sizes="(min-width: 640px) 33vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-noise opacity-40" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <Badge tone={r.tagTone}>{r.tag}</Badge>
                      <h3 className="mt-3 line-clamp-2 font-display text-sm font-semibold text-navy-800">
                        {r.title}
                      </h3>
                      <div className="mt-auto pt-3 text-[11px] text-slate-500">
                        {r.readMinutes} min read
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

// ─── Content block renderer ────────────────────────────────────────────

function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "paragraph":
      return (
        <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-[17px]">
          {renderInline(block.text)}
        </p>
      );
    case "heading":
      if (block.level === 2) {
        return (
          <h2 className="mt-10 font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
            {block.text}
          </h2>
        );
      }
      return (
        <h3 className="mt-8 font-display text-lg font-semibold text-navy-800 sm:text-xl">
          {block.text}
        </h3>
      );
    case "list":
      if (block.ordered) {
        return (
          <ol className="mt-4 list-outside list-decimal space-y-2 pl-6 text-base text-slate-700 marker:font-semibold marker:text-orange-500">
            {block.items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="mt-4 space-y-2 text-base text-slate-700">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 leading-relaxed">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-8 border-l-4 border-orange-500 bg-orange-50/40 py-3 pl-5 pr-4 text-lg italic leading-relaxed text-navy-800">
          &ldquo;{block.text}&rdquo;
          {block.author && (
            <footer className="mt-2 text-xs font-semibold not-italic text-slate-500">
              — {block.author}
            </footer>
          )}
        </blockquote>
      );
    case "callout": {
      const map = {
        info: { icon: Info, tone: "from-sky-50 to-sky-100 ring-sky-200", iconColor: "text-sky-600" },
        tip: { icon: Lightbulb, tone: "from-emerald-50 to-emerald-100 ring-emerald-200", iconColor: "text-emerald-600" },
        warning: {
          icon: AlertTriangle,
          tone: "from-orange-50 to-orange-100 ring-orange-200",
          iconColor: "text-orange-600",
        },
      } as const;
      const { icon: Icon, tone, iconColor } = map[block.tone];
      return (
        <div className={`mt-8 rounded-3xl bg-gradient-to-br ${tone} p-5 ring-1 ring-inset`}>
          <div className="flex items-start gap-3">
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} />
            <div>
              <div className="font-display text-sm font-semibold text-navy-800">
                {block.title}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-navy-700">
                {renderInline(block.body)}
              </p>
            </div>
          </div>
        </div>
      );
    }
    case "cta":
      return (
        <div className="mt-10 rounded-3xl bg-navy-800 p-6 text-white shadow-lift">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-sky-200">
                Take the next step
              </div>
              <div className="mt-1 font-display text-lg font-semibold text-white">
                {block.description}
              </div>
            </div>
            <Link
              href={block.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              {block.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      );
  }
}

/**
 * Very light-weight inline parser:
 *   **bold**  and  *italic*  (single-line, non-nested).
 * Kept intentionally tiny to avoid pulling in a markdown lib.
 */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(<strong key={i++} className="font-semibold text-navy-900">{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      parts.push(<em key={i++}>{m[2]}</em>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
