export type Tag = "NAPLAN" | "Learning strategies" | "Parent advice";

export type ArticleBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "quote"; text: string; author?: string }
  | { kind: "callout"; title: string; body: string; tone: "info" | "tip" | "warning" }
  | { kind: "cta"; label: string; href: string; description: string };

export type Author = {
  name: string;
  role: string;
  initials: string;
  color: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  tag: Tag;
  tagTone: "orange" | "sky" | "navy";
  color: string;
  readMinutes: number;
  publishedAt: string;
  author: Author;
  body: ArticleBlock[];
  relatedModules?: string[];
  keyTakeaways: string[];
};

const AUTHORS: Record<string, Author> = {
  priya: {
    name: "Ms Priya Rao",
    role: "Senior Tutor · Y3–Y7 specialist",
    initials: "PR",
    color: "from-sky-500 to-sky-700",
  },
  james: {
    name: "Mr James O'Neill",
    role: "Senior Tutor · Y7–Y9 specialist",
    initials: "JO",
    color: "from-orange-500 to-orange-600",
  },
  academy: {
    name: "GausLab Academy",
    role: "Editorial team",
    initials: "GL",
    color: "from-navy-600 to-navy-800",
  },
};

export const ARTICLES: Article[] = [
  {
    slug: "naplan-year-5-2026-preparation-guide",
    title: "NAPLAN Year 5 2026: The Complete Preparation Guide for Parents",
    excerpt:
      "A step-by-step plan for the eight weeks leading into NAPLAN — with topic checklists and practice question sets.",
    tag: "NAPLAN",
    tagTone: "orange",
    color: "from-orange-500 to-orange-600",
    readMinutes: 8,
    publishedAt: "2026-01-14",
    author: AUTHORS.priya,
    keyTakeaways: [
      "Year 5 NAPLAN in 2026 runs 11–20 March. Start preparation ~8 weeks out.",
      "Prioritise fluency in fractions, decimals and percentages — they carry most weight.",
      "Two full mock papers in the final fortnight beats endless topic drills.",
      "Timing is a separate skill — practise it deliberately.",
    ],
    relatedModules: ["y5-fractions-mastery", "y5-decimals-percentages", "y5-area-perimeter"],
    body: [
      {
        kind: "paragraph",
        text:
          "Every year we hear the same worry from Year 5 parents: 'We don't know what to focus on.' NAPLAN Year 5 covers a lot of ground, but the reality is that a handful of topics account for most of the marks — and confidence with them is much more valuable than shallow coverage of every dot-point.",
      },
      {
        kind: "paragraph",
        text:
          "This is the eight-week plan we use with our Year 5 students at GausLab. It works whether your child is aiming for Band 6 or Band 8.",
      },
      { kind: "heading", level: 2, text: "The 80/20 of Year 5 NAPLAN Maths" },
      {
        kind: "paragraph",
        text:
          "Roughly 80% of what's tested comes from four topic clusters. Focus your prep here:",
      },
      {
        kind: "list",
        ordered: true,
        items: [
          "Fractions, decimals and percentages (the biggest single weight — usually ~30% of questions)",
          "Multi-step word problems (~20% — every strand disguised as story)",
          "Measurement (area, perimeter, volume, time) (~15%)",
          "Data & simple probability (~10%)",
        ],
      },
      {
        kind: "callout",
        title: "The one skill parents underestimate",
        tone: "tip",
        body:
          "Reading the question carefully is worth 5–10 extra marks alone. Many Year 5 students lose points not on the maths but on the wording. Get them to underline what's actually being asked.",
      },
      { kind: "heading", level: 2, text: "The 8-week plan (week-by-week)" },
      { kind: "heading", level: 3, text: "Weeks 1–2 — Foundations" },
      {
        kind: "paragraph",
        text:
          "Diagnostic first. Sit down with your child and work through 10 mixed questions from a past paper. Not to score — just to see where confidence breaks down. Then rebuild.",
      },
      {
        kind: "list",
        items: [
          "Times tables to 10 × 10 — 3 mins of drills daily. Speed matters here.",
          "Fraction fluency: what does 3/8 look like on a bar? On a pizza? On a number line?",
          "Order of operations (BIDMAS) — non-negotiable for algebra later.",
        ],
      },
      { kind: "heading", level: 3, text: "Weeks 3–5 — The high-yield topics" },
      {
        kind: "paragraph",
        text:
          "Now go deep on the 80% cluster. One focused topic per week is better than surface-level coverage of ten.",
      },
      {
        kind: "list",
        items: [
          "Week 3: Fractions ↔ decimals ↔ percentages conversion. Fluency, not memorisation.",
          "Week 4: Area & perimeter of rectangles and composite (L-shaped) figures.",
          "Week 5: Multi-step word problems. Read → underline → sketch → compute.",
        ],
      },
      { kind: "heading", level: 3, text: "Weeks 6–7 — Interleaved practice" },
      {
        kind: "paragraph",
        text:
          "Now mix everything. Interleaving (studying different topics in the same session) beats blocked practice — even though it feels harder. This is where the confidence to handle a surprise question comes from.",
      },
      { kind: "heading", level: 3, text: "Week 8 — Two full mock papers, timed" },
      {
        kind: "paragraph",
        text:
          "The final week is timing and endurance, not new content. Two full 50-minute practice papers, marked together, discussed together. The goal is to remove exam-day surprise.",
      },
      {
        kind: "callout",
        title: "Sleep, not cramming, in the last 48 hours",
        tone: "warning",
        body:
          "Late-night cramming the night before NAPLAN is one of the most common mistakes. A rested brain outperforms a stressed one by a wide margin. Early bed, light breakfast, good hydration.",
      },
      {
        kind: "cta",
        label: "Start the Fractions Mastery module",
        href: "/portal/dashboard/modules/y5-fractions-mastery",
        description:
          "The single most impactful place to spend an hour. Interactive, adaptive, NAPLAN-aligned.",
      },
    ],
  },
  {
    slug: "fractions-that-actually-make-sense",
    title: "Fractions That Actually Make Sense: How We Teach Year 5",
    excerpt:
      "The classroom strategies parents can use at home to make fractions click for their child.",
    tag: "Learning strategies",
    tagTone: "sky",
    color: "from-sky-500 to-sky-700",
    readMinutes: 6,
    publishedAt: "2026-01-28",
    author: AUTHORS.priya,
    keyTakeaways: [
      "Introduce fractions as parts of a whole — pizza, bar, group — before symbols.",
      "Equivalent fractions come from multiplying by 1 (in disguise) — not memorising rules.",
      "Denominator = how many equal pieces. Numerator = how many you have.",
      "Common home practice: 'What fraction of the pizza is left?' beats any worksheet.",
    ],
    relatedModules: ["y5-fractions-mastery", "y5-decimals-percentages"],
    body: [
      {
        kind: "paragraph",
        text:
          "Fractions are the topic Year 5 students are most likely to say 'I don't get it' about — and it's rarely their fault. Most fraction teaching jumps to symbols too early. This is how we teach it at GausLab, using the Montessori-inspired Concrete → Pictorial → Abstract progression.",
      },
      { kind: "heading", level: 2, text: "Step 1 — Concrete before anything symbolic" },
      {
        kind: "paragraph",
        text:
          "Before your child sees the symbol 3/4, they should have physically split something into four equal pieces and picked up three. A pizza, a chocolate bar, a piece of paper — anything.",
      },
      {
        kind: "quote",
        text:
          "The child who has folded paper into halves, quarters and eighths understands fractions in a way no textbook can teach.",
        author: "Maria Montessori",
      },
      { kind: "heading", level: 2, text: "Step 2 — Give the parts names" },
      {
        kind: "paragraph",
        text:
          "Once the physical intuition is there, add the language: denominator = *the number of equal pieces*. Numerator = *how many pieces you have or want*.",
      },
      {
        kind: "callout",
        title: "The 'd' trick",
        tone: "tip",
        body:
          "Denominator = down and defines how many pieces. That single mnemonic saves hours of confusion.",
      },
      { kind: "heading", level: 2, text: "Step 3 — Equivalent fractions via multiplication by 1" },
      {
        kind: "paragraph",
        text:
          "The classic error: 'Add the tops and bottoms.' Instead, teach *why* 2/3 = 4/6: because you multiplied the whole fraction by 2/2, which equals 1, which changes nothing.",
      },
      {
        kind: "list",
        items: [
          "2/3 × (2/2) = 4/6  — same value, different look.",
          "1/2 × (5/5) = 5/10 — same value, different look.",
          "The rule isn't magic; it's identity.",
        ],
      },
      { kind: "heading", level: 2, text: "Step 4 — Real-world practice" },
      {
        kind: "paragraph",
        text:
          "Cook together. Ask 'we need 3/4 of a cup, but I only have a 1/4 cup measure — how many scoops?' That single question rehearses equivalence, multiplication and division of fractions.",
      },
      {
        kind: "cta",
        label: "Try the interactive Fractions module",
        href: "/portal/dashboard/modules/y5-fractions-mastery",
        description:
          "Uses the same Concrete → Pictorial → Abstract progression we describe here.",
      },
    ],
  },
  {
    slug: "helping-anxious-maths-students",
    title: "Maths Anxiety Is Real — Here's How To Help At Home",
    excerpt:
      "Practical, evidence-based ways parents can rebuild a child's confidence with numbers.",
    tag: "Parent advice",
    tagTone: "navy",
    color: "from-navy-600 to-navy-800",
    readMinutes: 5,
    publishedAt: "2026-02-04",
    author: AUTHORS.academy,
    keyTakeaways: [
      "Maths anxiety is a real, measurable phenomenon — not a character trait.",
      "Praise effort and strategy, not 'being smart at maths'.",
      "Never say 'I was bad at maths too' — it hands your child permission to give up.",
      "Small daily wins matter more than big monthly ones.",
    ],
    body: [
      {
        kind: "paragraph",
        text:
          "About 20% of Australian students report significant anxiety around maths. It's not laziness, and it's not fixed. It's a learned response — and it can be unlearned.",
      },
      { kind: "heading", level: 2, text: "What maths anxiety actually looks like" },
      {
        kind: "list",
        items: [
          "Freezing on a test they can normally do at home.",
          "Tummy aches on maths mornings.",
          "The 'I'm just not a maths person' script — usually inherited from a parent.",
          "Avoidance: 'I'll do it later' becomes never.",
        ],
      },
      {
        kind: "callout",
        title: "The one thing NOT to say",
        tone: "warning",
        body:
          "'I was bad at maths too, honey.' This single sentence gives your child permission to give up. It reframes maths difficulty as genetic. Please avoid it, even in sympathy.",
      },
      { kind: "heading", level: 2, text: "Three things to say instead" },
      {
        kind: "list",
        ordered: true,
        items: [
          "'You haven't figured it out YET.' The word yet is powerful — it implies the door is open.",
          "'What strategy did you try?' Praise the process, not the outcome.",
          "'That was a smart mistake.' Mistakes are how the brain wires new connections.",
        ],
      },
      { kind: "heading", level: 2, text: "The 5-minute rule" },
      {
        kind: "paragraph",
        text:
          "For an anxious child, 5 minutes of daily maths at low pressure beats 45 minutes of high-pressure weekend cramming. Small wins compound. A month of 5-minute sessions rebuilds identity: 'I can do this.'",
      },
      {
        kind: "quote",
        text:
          "You are not born a mathematician. You become one, gently, over years, one small victory at a time.",
      },
    ],
  },
  {
    slug: "year-9-naplan-band-9-what-it-takes",
    title: "Year 9 NAPLAN Band 9: What It Actually Takes",
    excerpt: "A breakdown of what Band 9 students demonstrate — and how to close the gap.",
    tag: "NAPLAN",
    tagTone: "orange",
    color: "from-orange-500 to-orange-600",
    readMinutes: 7,
    publishedAt: "2026-02-11",
    author: AUTHORS.james,
    keyTakeaways: [
      "Band 9 requires speed AND accuracy — not just correct answers eventually.",
      "Algebra, coordinate geometry and trig are the differentiators.",
      "Non-calculator arithmetic is the invisible ceiling for most students.",
      "Two full mock papers per term is enough — more is diminishing returns.",
    ],
    relatedModules: ["y9-pythagoras-theorem", "y9-trigonometry", "y9-index-laws"],
    body: [
      {
        kind: "paragraph",
        text:
          "Around 25% of Year 9 students reach Band 8. Around 10% reach Band 9. Around 3% reach Band 10. The gap between them is not IQ — it's specific, teachable skills.",
      },
      { kind: "heading", level: 2, text: "What Band 8 looks like" },
      {
        kind: "paragraph",
        text:
          "Band 8 students confidently handle year-level content: linear equations, Pythagoras, basic trigonometry, area of composite shapes, probability with two-way tables. They get the right answer eventually.",
      },
      { kind: "heading", level: 2, text: "What Band 9 adds" },
      {
        kind: "list",
        items: [
          "Speed under pressure — right answers in under 90 seconds on standard questions.",
          "Fluent algebra manipulation — factorising, expanding, substituting without cognitive strain.",
          "Coordinate geometry — gradient, distance, midpoint used interchangeably.",
          "Trigonometry beyond the basic SOHCAHTOA question.",
          "The confidence to skip and return — knowing when a question isn't worth the time yet.",
        ],
      },
      { kind: "heading", level: 2, text: "What Band 10 requires" },
      {
        kind: "paragraph",
        text:
          "Band 10 students combine everything above with genuine problem-solving fluency — the ability to look at a novel question, see the underlying structure, and choose the right tool without hesitation.",
      },
      {
        kind: "callout",
        title: "The invisible ceiling",
        tone: "info",
        body:
          "Non-calculator arithmetic is where most Band 8 students hit a wall. Fractions, decimals, percentages under 20 seconds each — without a calculator — is the price of admission to Band 9+.",
      },
      { kind: "heading", level: 2, text: "The 12-week Band 9 program" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Weeks 1–3: Fix any Y8 gaps found in a diagnostic. Non-calc arithmetic drills daily.",
          "Weeks 4–6: Deep dive on algebra (equations, factoring, coordinate geometry).",
          "Weeks 7–9: Trigonometry + Pythagoras applied to 2D and 3D problems.",
          "Weeks 10–11: Interleaved practice across all Y9 strands.",
          "Week 12: Two full mock papers, timed, marked together.",
        ],
      },
      {
        kind: "cta",
        label: "Try the Y9 Trigonometry module",
        href: "/portal/dashboard/modules/y9-trigonometry",
        description: "The clearest single lift from Band 8 to Band 9 for most students.",
      },
    ],
  },
  {
    slug: "why-mental-maths-still-matters",
    title: "Why Mental Maths Still Matters In An AI World",
    excerpt:
      "Cognitive science suggests strong mental arithmetic remains foundational for higher-order thinking.",
    tag: "Learning strategies",
    tagTone: "sky",
    color: "from-sky-500 to-sky-700",
    readMinutes: 4,
    publishedAt: "2026-02-18",
    author: AUTHORS.academy,
    keyTakeaways: [
      "AI is a calculator, not a substitute for numerical intuition.",
      "Working memory is finite — automaticity frees space for reasoning.",
      "Mental maths correlates with problem-solving performance in every study.",
      "Five minutes of daily practice is enough. Consistency > intensity.",
    ],
    body: [
      {
        kind: "paragraph",
        text:
          "'Why should my child memorise times tables when they can just use their phone?' It's a fair question. Here's the honest answer.",
      },
      { kind: "heading", level: 2, text: "The working memory bottleneck" },
      {
        kind: "paragraph",
        text:
          "Working memory can hold about 4 items at once. If solving a problem requires you to also *compute* 7 × 8, that's one of your four slots gone. Suddenly there's no room left to think about the actual problem.",
      },
      {
        kind: "paragraph",
        text:
          "Students with automatic recall of basic facts don't just get faster at arithmetic — they get better at reasoning. Their working memory is free to focus on the higher-order thinking.",
      },
      { kind: "heading", level: 2, text: "AI is a calculator, not a brain" },
      {
        kind: "paragraph",
        text:
          "AI is brilliant at doing the arithmetic you already know how to do. It's much less useful when you don't know what to ask. Mathematical intuition — the ability to feel that an answer is roughly right — is what tells you the AI hallucinated a nonsense answer.",
      },
      {
        kind: "callout",
        title: "The 5-minute daily rule",
        tone: "tip",
        body:
          "Two rounds of the Times Table Race in our app, done every school morning, is enough to build automatic recall over a term. Consistency, not duration, is the key.",
      },
      {
        kind: "cta",
        label: "Try the 60-second Times Table Race",
        href: "/portal/dashboard/modules/y3-times-tables-mastery",
        description: "Play daily. Watch your child's brain build the shortcuts.",
      },
    ],
  },
  {
    slug: "choosing-a-maths-tutor-checklist",
    title: "Choosing A Maths Tutor: The Parent's Checklist",
    excerpt: "Ten questions to ask before enrolling your child in any tutoring program.",
    tag: "Parent advice",
    tagTone: "navy",
    color: "from-navy-600 to-navy-800",
    readMinutes: 5,
    publishedAt: "2026-02-25",
    author: AUTHORS.academy,
    keyTakeaways: [
      "Ask for a written progress plan — not just 'we'll work on their weaknesses'.",
      "Insist on measurable outcomes, not vague promises.",
      "Small groups (3–4) are often better than 1:1 for confidence-building.",
      "A trial session should be free and no-pressure.",
    ],
    body: [
      {
        kind: "paragraph",
        text:
          "Tutoring is expensive and time-consuming. A great tutor will change your child's relationship with maths. A poor one will make it worse. Here's the checklist we wish every parent used.",
      },
      { kind: "heading", level: 2, text: "The 10 questions to ask before you enrol" },
      {
        kind: "list",
        ordered: true,
        items: [
          "'Can I see a written learning plan after the diagnostic?' — a real tutor will offer this without prompting.",
          "'Who will be tutoring my child each week — the same person?' — continuity matters more than credentials.",
          "'What are the tutor's qualifications and Working With Children Check?' — non-negotiable in Australia.",
          "'How will I know my child is progressing?' — expect specific metrics, not 'they're doing well'.",
          "'What happens if my child doesn't improve?' — a confident business will have a guarantee or a plan.",
          "'Do you use the current Australian Curriculum?' — surprisingly rare with private tutors.",
          "'How much homework will you set?' — too much = burnout. Too little = no traction.",
          "'What's the cancellation policy?' — kids get sick. Kids have birthday parties.",
          "'Can I see a sample progress report?' — you'll receive them; ask what they look like.",
          "'Can we start with a no-obligation trial?' — the answer should always be yes.",
        ],
      },
      {
        kind: "callout",
        title: "The red flag most parents miss",
        tone: "warning",
        body:
          "'We guarantee your child will improve by 2 bands.' No serious tutor promises specific band improvements — outcomes depend on effort, attendance, and starting point. Vague progress guarantees ('measurable improvement or your money back') are honest. Specific numerical guarantees are marketing.",
      },
      { kind: "heading", level: 2, text: "1:1 vs small group — which is right?" },
      {
        kind: "paragraph",
        text:
          "Counter-intuitively, small groups of 3–4 students often outperform 1:1 for confidence-building. Kids learn from watching peers work through problems, and the mild social pressure motivates focus without becoming stressful.",
      },
      {
        kind: "paragraph",
        text:
          "1:1 is best for: severe gaps, exam-prep sprints, students who need very specific pacing. Otherwise small groups deliver more per dollar and often more per hour.",
      },
      {
        kind: "cta",
        label: "Book a free diagnostic with GausLab",
        href: "/contact#assessment",
        description:
          "45-min assessment, written report, no obligation. Even if you don't enrol, you'll leave with a plan.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, tag: Tag, limit = 3): Article[] {
  return ARTICLES.filter((a) => a.slug !== slug && a.tag === tag)
    .slice(0, limit)
    .concat(
      ARTICLES.filter((a) => a.slug !== slug && a.tag !== tag)
    )
    .slice(0, limit);
}
