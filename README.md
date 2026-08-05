# GausLab Maths Academy — Website

Premium Next.js 15 marketing site for **GausLab Maths Academy**, an Australian NAPLAN maths tutoring business for students in Years 3, 5, 7 and 9.

## Stack

- **Next.js 15** (App Router, RSC)
- **React 19 / TypeScript**
- **Tailwind CSS** with a bespoke brand token layer
- **Framer Motion** for tasteful, reduced-motion-aware micro-interactions
- **Lucide React** icons (Phosphor-adjacent stroke style)
- Custom design system: primitives (`Button`, `Card`, `Section`, `Badge`, `Reveal`), site chrome (`Header`, `Footer`, `Logo`, `LiveChat`), page sections.

## Brand system

| Token       | Value       | Usage                          |
|-------------|-------------|--------------------------------|
| Navy 700    | `#0B1E3F`   | Primary text, dark surfaces    |
| Sky 500     | `#0EA5E9`   | Secondary CTA, links, accents  |
| Orange 500  | `#F97316`   | Primary CTA, highlights        |
| Mist        | `#F6F9FE`   | Section backgrounds            |
| Poppins     | Display     | Headings                       |
| Inter       | Sans        | Body                           |

## Pages included

- `/` — Homepage (Hero, Trust bar, Why us, Programs, Process, Stats, Testimonials, Resource centre, Pricing, FAQ, Final CTA)
- `/programs` — Programs (with Y3/5/7/9 tabs)
- `/pricing` — Plans (weekly/term toggle)
- `/resources` — Resource centre + email capture
- `/blog` — Article grid
- `/contact` — Enquiry form + Google Maps embed
- `/portal` — Secure parent portal login screen
- `/about` — About + stats + testimonials
- `/robots.txt` + `/sitemap.xml` — SEO

## SEO & accessibility

- Rich metadata on every page (`title`, `description`, OG, Twitter)
- `EducationalOrganization` JSON-LD in `app/layout.tsx`
- `robots.ts` and `sitemap.ts`
- WCAG AA colour pairings; visible focus rings; `prefers-reduced-motion` respected
- Skip-to-main-content link; semantic landmarks; alt/aria labels

## Get running

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Build for production:

```bash
npm run build && npm start
```

## Supabase backend

The site is wired to Supabase for auth, form submissions and the parent dashboard.

**Environment** — copy [`.env.example`](.env.example) to `.env.local` (already present with the GausLab keys). The anon key is browser-safe when RLS is enforced; never commit `.env.local`.

**One-time setup**:

1. Open your Supabase project → SQL editor.
2. Paste and run [`supabase/schema.sql`](supabase/schema.sql). It creates every table, RLS policy, and a trigger that creates a `profiles` row when a new user signs up.
3. In **Authentication → Providers**, keep Email enabled. If you want instant login without email confirmation for demo, turn off *Confirm email* (Authentication → Sign In / Providers → Email).

**Wired flows**:

| UI                                        | Table / RPC             |
|-------------------------------------------|-------------------------|
| `/contact` form                           | `enquiries` (anon insert) |
| Footer newsletter + `/resources` form     | `leads` (anon insert)   |
| `/portal` login/signup                    | `auth.users` + trigger creates `profiles` |
| First login                               | Calls `seed_demo_data()` RPC — populates a demo student, lessons, homework, messages, mastery |
| `/portal/dashboard`                       | Reads `students`, `weekly_mastery`, `topic_mastery`, `lessons`, `homework`, `messages` for the signed-in parent |
| Dashboard sign-out                        | `supabase.auth.signOut()` |

Middleware (`middleware.ts`) refreshes the Supabase session on every request and redirects unauthenticated visitors from `/portal/dashboard` to `/portal?next=…`.

If the schema hasn't been applied yet, the dashboard renders demo data with a visible banner so the UI keeps working end-to-end.

## Roadmap (still to wire)

- **Payments** — Stripe Checkout / Payment Element from `/pricing`
- **AI homework assistant** — Anthropic Claude via `/api/chat`
- **Live chat** — swap `LiveChat` widget for Intercom / Crisp / HubSpot
- **Booking calendar** — embed Calendly / Cal.com in `/contact`
- **Google Reviews** — pull via Places API into the Testimonials section
