export type Year = 3 | 5 | 7 | 9;
export type Pathway = Year | "Advanced";

export type Choice = { text: string; correct?: boolean };

/**
 * Small interactive visual pinned to a question — e.g. the crayons-in-boxes
 * array a student can manipulate to verify their thinking before answering.
 */
export type QuestionVisual = {
  name:
    | "multiplication-array"
    | "fraction-bar"
    | "pythagoras"
    | "coordinate-plane"
    | "place-value-blocks";
  props?: Record<string, unknown>;
};

export type Block =
  | { kind: "theory"; title?: string; body: string }
  | { kind: "tip"; body: string }
  | { kind: "video"; src: string; title?: string; caption?: string }
  | { kind: "example"; problem: string; steps: string[]; answer: string }
  | {
      kind: "mcq";
      prompt: string;
      choices: string[];
      answerIndex: number;
      explanation: string;
      hint?: string;
      visual?: QuestionVisual;
    }
  | {
      kind: "numeric";
      prompt: string;
      answer: number;
      unit?: string;
      tolerance?: number;
      explanation: string;
      hint?: string;
      visual?: QuestionVisual;
    }
  | {
      kind: "visual";
      name:
        | "fraction-bar"
        | "equation-balance"
        | "pythagoras"
        | "times-table"
        | "place-value-blocks"
        | "coordinate-plane"
        | "number-line"
        | "multiplication-array";
      props?: Record<string, unknown>;
    }
  | {
      kind: "game";
      name: "times-table-race";
      props?: Record<string, unknown>;
    }
  | {
      kind: "lab";
      name: "multiplication" | "fraction" | "pythagoras" | "place-value";
      props?: Record<string, unknown>;
    };

/**
 * Concrete → Pictorial → Abstract (Montessori / Bruner)
 * We label each lesson so learners see the deliberate progression.
 */
export type Phase = "concrete" | "pictorial" | "abstract" | "applied";

export type Lesson = {
  id: string;
  title: string;
  intro: string;
  phase?: Phase;
  blocks: Block[];
};

export type Module = {
  slug: string;
  title: string;
  subtitle: string;
  year: Year;
  pathway?: Pathway;              // defaults to `year` for core, "Advanced" for extension
  strand: "Number & Algebra" | "Measurement & Geometry" | "Statistics & Probability";
  minutes: number;
  color: string;
  overview: string;
  outcomes: string[];
  /** Short paragraph on how the module is taught (Montessori CPA + neuroscience) */
  learningApproach?: string;
  /** Spaced-repetition prompt shown at module completion */
  cognitiveTip?: string;
  lessons: Lesson[];
};

export const MODULES: Module[] = [
  // ─────────────────────────────────────────────────────────────
  // YEAR 3 · TIMES TABLES MASTERY
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y3-times-tables-mastery",
    title: "Times Tables Mastery",
    subtitle: "Build fast, confident recall of the 2×–10× times tables — and race the clock.",
    year: 3,
    strand: "Number & Algebra",
    minutes: 45,
    color: "from-sky-500 to-sky-700",
    overview:
      "Multiplication is repeated addition — once your child sees the patterns, the tables click. This module uses arrays, skip counting and quick-recall practice to build automaticity for Year 3 NAPLAN.",
    outcomes: [
      "Understand multiplication as equal groups",
      "Recognise patterns in the 2, 5 and 10 times tables",
      "Recall multiplication facts to 10×10 with 90%+ accuracy",
      "Apply times tables to simple word problems",
    ],
    learningApproach:
      "We build from concrete (equal groups you can count) to pictorial (arrays) to abstract (recall). Spaced quick-recall drills consolidate the facts to long-term memory.",
    cognitiveTip:
      "Practise for 3 minutes daily for the next 5 days — short, spaced sessions build recall far better than one long study block.",
    lessons: [
      {
        id: "l1",
        title: "Multiplication = equal groups",
        intro: "Before we memorise anything, let's build the picture of what multiplication really means.",
        phase: "concrete",
        blocks: [
          {
            kind: "theory",
            title: "Equal groups",
            body:
              "When we multiply, we count equal groups of the same size. **4 × 3** means \"4 groups of 3\". We could add: 3 + 3 + 3 + 3 = 12. Or use an **array** — a rectangle split into rows and columns.",
          },
          {
            kind: "visual",
            name: "multiplication-array",
            props: { startRows: 3, startCols: 2, startTheme: "apples" },
          },
          {
            kind: "tip",
            body:
              "Try changing the theme (apples, stars, hearts, cookies). Then use *Highlight rows* and *Highlight columns* — notice how 3 rows of 4 is the SAME number as 4 rows of 3. That's the commutative rule.",
          },
          { kind: "visual", name: "times-table" },
          {
            kind: "example",
            problem: "How many wheels are on 5 tricycles?",
            steps: [
              "Each tricycle has 3 wheels — that's the group size.",
              "There are 5 tricycles — that's how many groups.",
              "So we compute 5 × 3.",
              "5 × 3 = 3 + 3 + 3 + 3 + 3 = 15 wheels.",
            ],
            answer: "15 wheels",
          },
          {
            kind: "mcq",
            prompt: "There are 6 packs of markers. Each pack has 4 markers. How many markers in total?",
            choices: ["10", "20", "24", "28"],
            answerIndex: 2,
            explanation: "6 groups of 4 → 6 × 4 = 24. You can also think 4+4+4+4+4+4 = 24.",
            hint: "Try changing the visual to 6 rows of 4 stars — then count.",
            visual: {
              name: "multiplication-array",
              props: { startRows: 6, startCols: 4, startTheme: "stars" },
            },
          },
          {
            kind: "numeric",
            prompt:
              "A box holds 8 crayons. How many crayons are in 3 boxes? Use the array above — 3 rows (boxes) of 8 (crayons per box). Change the rows and columns and see it live.",
            answer: 24,
            unit: "crayons",
            explanation: "3 groups of 8 → 3 × 8 = 24. Each row in the visual = one box.",
            hint: "Set the visual to 3 rows × 8 columns, then count the cookies.",
            visual: {
              name: "multiplication-array",
              props: { startRows: 3, startCols: 8, startTheme: "cookies" },
            },
          },
        ],
      },
      {
        id: "l2",
        title: "The 2×, 5× and 10× patterns",
        intro: "The easiest times tables are the ones with a pattern you can hear.",
        phase: "pictorial",
        blocks: [
          {
            kind: "theory",
            title: "Skip counting",
            body:
              "**2×** table: skip count by 2 (2, 4, 6, 8, 10, 12…). All even.\n**5×** table: skip count by 5 (5, 10, 15, 20, 25…). Ends in 0 or 5.\n**10×** table: skip count by 10 (10, 20, 30…). Just add a zero.",
          },
          {
            kind: "tip",
            body: "Any number × 10 = that number with a 0 on the end. So 7 × 10 = 70. Easy!",
          },
          {
            kind: "mcq",
            prompt: "What is 7 × 5?",
            choices: ["30", "35", "40", "45"],
            answerIndex: 1,
            explanation: "5×7 counts up in 5s seven times: 5, 10, 15, 20, 25, 30, 35 → 35.",
            hint: "The 5× table ends in 0 or 5. 7 is odd, so the answer ends in 5.",
          },
          {
            kind: "numeric",
            prompt: "What is 9 × 10?",
            answer: 90,
            explanation: "Any number times 10 just adds a zero. 9 → 90.",
          },
        ],
      },
      {
        id: "l3",
        title: "NAPLAN-style word problems",
        intro: "Word problems are where times tables become powerful. Read carefully and identify the two numbers.",
        phase: "applied",
        blocks: [
          {
            kind: "example",
            problem: "There are 4 tables in Miss Kelly's classroom. Each table seats 6 students. How many students can sit at the tables altogether?",
            steps: [
              "Identify the group size: 6 students per table.",
              "Identify the number of groups: 4 tables.",
              "Multiply: 4 × 6 = 24.",
              "Answer: 24 students.",
            ],
            answer: "24 students",
          },
          {
            kind: "mcq",
            prompt: "Ali reads 3 pages of his book every night. How many pages does he read in one week (7 nights)?",
            choices: ["10", "18", "21", "24"],
            answerIndex: 2,
            explanation: "7 nights × 3 pages = 21 pages. Skip count by 3: 3, 6, 9, 12, 15, 18, 21.",
            hint: "The visual shows 7 rows (nights) of 3 pages. Count them all.",
            visual: {
              name: "multiplication-array",
              props: { startRows: 7, startCols: 3, startTheme: "hearts" },
            },
          },
          {
            kind: "numeric",
            prompt: "A pack of stickers has 8 stickers. How many stickers are in 6 packs?",
            answer: 48,
            explanation: "6 × 8 = 48. Break it down: 5 × 8 = 40, then add one more 8 → 48.",
            hint: "Build 6 rows of 8 in the visual, then count.",
            visual: {
              name: "multiplication-array",
              props: { startRows: 6, startCols: 8, startTheme: "apples" },
            },
          },
        ],
      },
      {
        id: "l4",
        title: "Race the clock — mini-game",
        intro:
          "You've learned the ideas — now train recall speed. Automaticity is what lets your child solve NAPLAN questions in seconds.",
        phase: "applied",
        blocks: [
          {
            kind: "theory",
            title: "Why speed matters",
            body:
              "NAPLAN gives you around 45 seconds per question. If a child spends 30 seconds recalling 7 × 8, they've got 15 seconds to actually solve the problem. **Automatic recall** = brain power freed for reasoning.\n\nPlay this game a few times a week — it's how athletes train reflexes, and it's how the brain builds durable multiplication memory.",
          },
          { kind: "game", name: "times-table-race", props: { durationSeconds: 60 } },
          {
            kind: "tip",
            body:
              "Small brain, big principle: your child grows more from **60 seconds of hard recall** than from 10 minutes of copying tables. That's retrieval practice — one of the most-studied learning techniques in cognitive science.",
          },
        ],
      },
      {
        id: "l5",
        title: "Your turn — invent a multiplication problem",
        intro:
          "Now you're the teacher. Design a problem, write the story and save it to your collection.",
        phase: "applied",
        blocks: [
          {
            kind: "theory",
            title: "Why creating beats copying",
            body:
              "When you *invent* a problem, your brain builds a much deeper understanding than when you solve someone else's. Try telling the story to a family member — teaching is one of the most powerful ways to learn.",
          },
          { kind: "lab", name: "multiplication" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 5 · FRACTIONS MASTERY  (the flagship — user named it)
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y5-fractions-mastery",
    title: "Fractions Mastery",
    subtitle: "The visual, intuitive way to master fractions for Year 5 NAPLAN.",
    year: 5,
    strand: "Number & Algebra",
    minutes: 45,
    color: "from-orange-500 to-orange-600",
    overview:
      "Fractions confuse most Year 5 students because they're taught symbolically. This module builds the visual model first — students *see* why 2/3 = 4/6 — then applies it to equivalence and operations under NAPLAN conditions.",
    outcomes: [
      "Explain what the numerator and denominator represent",
      "Identify equivalent fractions using visual and numerical reasoning",
      "Compare fractions with different denominators",
      "Add and subtract simple fractions with like denominators",
    ],
    learningApproach:
      "Fractions click when students see them. We start with the interactive fraction bar (concrete), then move to visual comparisons (pictorial), then to symbolic operations (abstract). Retrieval-practice questions between each stage lock the concept in.",
    cognitiveTip:
      "Explain fractions to someone else this week — teaching is one of the highest-retention learning strategies (Feynman technique).",
    lessons: [
      {
        id: "l1",
        title: "What is a fraction, really?",
        intro:
          "A fraction is not a strange new number — it's just a way of splitting a whole into equal parts.",
        phase: "concrete",
        blocks: [
          {
            kind: "theory",
            title: "Numerator and denominator",
            body:
              "A fraction has two numbers, separated by a bar:\n\n**Numerator** (top) — how many equal parts we have.\n**Denominator** (bottom) — how many equal parts the whole is split into.\n\nSo **3/4** means: split the whole into 4 equal parts, then take 3 of them.",
          },
          { kind: "visual", name: "fraction-bar", props: { start: [3, 4] } },
          {
            kind: "tip",
            body:
              "Bigger denominator = smaller pieces. 1/8 is smaller than 1/4, because eighths are smaller pieces than quarters.",
          },
          {
            kind: "mcq",
            prompt: "Look at the fraction bar above. What does the shaded portion represent?",
            choices: ["1/4", "3/4", "4/3", "3/7"],
            answerIndex: 1,
            explanation: "The bar is split into 4 equal parts and 3 of them are shaded → 3/4.",
            hint: "Count total parts (denominator), then shaded parts (numerator).",
          },
          {
            kind: "mcq",
            prompt: "Which of these fractions is the largest?",
            choices: ["1/2", "1/4", "1/8", "1/16"],
            answerIndex: 0,
            explanation:
              "All the numerators are 1. The smaller the denominator, the bigger the piece. Halves are the biggest of those, so 1/2 is the largest.",
            hint: "When numerators are equal, compare the denominators — smaller denominator = bigger fraction.",
          },
        ],
      },
      {
        id: "l2",
        title: "Equivalent fractions — same value, different look",
        intro:
          "Two fractions can look completely different but represent the same amount. That's equivalence.",
        phase: "pictorial",
        blocks: [
          {
            kind: "theory",
            title: "The multiply-both rule",
            body:
              "If you multiply the numerator AND denominator by the same number, you get an equivalent fraction.\n\n**Example:** 2/3 × (2/2) = 4/6.\n\nBoth mean the same amount — you've just cut each piece in half.",
          },
          { kind: "visual", name: "fraction-bar", props: { start: [2, 3] } },
          {
            kind: "example",
            problem: "Find a fraction equivalent to 3/5 with denominator 20.",
            steps: [
              "We want the new denominator to be 20.",
              "5 × 4 = 20, so we multiply by 4/4.",
              "Numerator: 3 × 4 = 12.",
              "Denominator: 5 × 4 = 20.",
              "Answer: 12/20.",
            ],
            answer: "12/20",
          },
          {
            kind: "mcq",
            prompt: "Which fraction is equivalent to 1/2?",
            choices: ["2/3", "3/6", "4/5", "5/8"],
            answerIndex: 1,
            explanation: "3/6 = 1/2 because both 3 and 6 divide by 3 to give 1/2. You can also see 3 is half of 6.",
            hint: "Which of these fractions has a numerator exactly half of its denominator?",
          },
          {
            kind: "numeric",
            prompt: "Complete the equivalent fraction: 2/5 = ?/15",
            answer: 6,
            explanation: "5 × 3 = 15, so we multiply the numerator by 3 too: 2 × 3 = 6. So 2/5 = 6/15.",
            hint: "What do you multiply 5 by to get 15? Do the same to the top.",
          },
        ],
      },
      {
        id: "l3",
        title: "Adding & subtracting fractions with like denominators",
        intro:
          "When the denominators are already the same, adding fractions is easy — just add the numerators.",
        phase: "abstract",
        blocks: [
          {
            kind: "theory",
            body:
              "**Same denominator** → just add or subtract the tops. Keep the bottom the same.\n\n**Example:** 2/7 + 3/7 = 5/7 (2 pieces + 3 pieces = 5 pieces, each is a seventh).",
          },
          {
            kind: "tip",
            body:
              "Never add the denominators. 2/7 + 3/7 ≠ 5/14. The size of the pieces doesn't change when you add more of them!",
          },
          {
            kind: "example",
            problem: "Mia ate 3/8 of a pizza. Her brother ate 2/8. How much did they eat together?",
            steps: [
              "Same denominator (8), so we can add straight away.",
              "Numerators: 3 + 2 = 5.",
              "Keep the denominator: 8.",
              "Answer: 5/8 of the pizza.",
            ],
            answer: "5/8",
          },
          {
            kind: "mcq",
            prompt: "Calculate: 5/9 − 2/9",
            choices: ["3/0", "3/9", "3/18", "7/9"],
            answerIndex: 1,
            explanation: "Same denominator, subtract the tops: 5 − 2 = 3. Denominator stays 9 → 3/9.",
            hint: "Subtract the numerators; keep the denominator the same.",
          },
          {
            kind: "numeric",
            prompt: "In a jar, 4/10 of the lollies are red and 3/10 are green. What fraction are red or green? Give the numerator only (denominator will be 10).",
            answer: 7,
            explanation: "4/10 + 3/10 = 7/10. Numerator = 7.",
          },
        ],
      },
      {
        id: "l4",
        title: "NAPLAN Year 5 · fractions in the wild",
        intro:
          "Now let's practise the way NAPLAN asks these questions — often disguised as a picture or a word problem.",
        phase: "applied",
        blocks: [
          {
            kind: "mcq",
            prompt: "A cake recipe uses 3/4 cup of sugar. Mia is making 2 batches. How much sugar does she need in total?",
            choices: ["1 cup", "1 1/4 cups", "1 1/2 cups", "6/8 cup"],
            answerIndex: 2,
            explanation:
              "2 batches × 3/4 cup = 6/4 cups. 6/4 = 1 and 2/4 = 1 1/2 cups.",
            hint: "Add 3/4 + 3/4. Same denominator, so add the tops: 3+3 = 6, over 4 → 6/4.",
          },
          {
            kind: "mcq",
            prompt: "A pizza is cut into 8 equal slices. Ben eats 3 slices. What fraction of the pizza is LEFT?",
            choices: ["3/8", "4/8", "5/8", "8/8"],
            answerIndex: 2,
            explanation:
              "The whole pizza is 8/8. Ben eats 3/8. What's left = 8/8 − 3/8 = 5/8.",
            hint: "Set the visual to show 8 pieces with 3 shaded (what Ben ate). The rest is what's left.",
            visual: {
              name: "fraction-bar",
              props: { start: [3, 8] },
            },
          },
          {
            kind: "numeric",
            prompt: "Which fraction is bigger: 2/3 or 4/6? Enter 1 if 2/3, 2 if 4/6, or 0 if they're equal.",
            answer: 0,
            explanation:
              "They're equivalent! 2/3 × (2/2) = 4/6, so they represent the same amount. Answer: 0.",
            hint: "Try multiplying 2/3 by 2/2 and see what you get.",
          },
        ],
      },
      {
        id: "l5",
        title: "Your turn — invent a fraction problem",
        intro:
          "You've explored fractions. Now design your own. Set the numerator and denominator, write a story, save it.",
        phase: "applied",
        blocks: [
          {
            kind: "theory",
            body:
              "**Tip for great story problems:** think of something you'd actually split — a pizza, a chocolate bar, a class of kids, minutes of screen time. Concrete stories make abstract fractions memorable.",
          },
          { kind: "lab", name: "fraction" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 7 · SOLVING LINEAR EQUATIONS
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y7-linear-equations",
    title: "Solving Linear Equations",
    subtitle: "The balance method — the single most useful algebra skill in high school.",
    year: 7,
    strand: "Number & Algebra",
    minutes: 40,
    color: "from-navy-600 to-navy-800",
    overview:
      "Year 7 is where letters start showing up in maths. Learn the balance method — do the same thing to both sides — and you can solve almost any linear equation you'll meet in Year 7 NAPLAN.",
    outcomes: [
      "Solve one-step and two-step linear equations",
      "Interpret a word problem as an algebraic equation",
      "Check a solution by substitution",
      "Handle equations involving negative numbers",
    ],
    learningApproach:
      "The balance metaphor makes an abstract concept physical. We interleave equations with substitution-checks — a proven neuroscience technique for encoding.",
    cognitiveTip:
      "Solve one new equation each day this week without looking at the steps — retrieval, not review, is what builds durable memory.",
    lessons: [
      {
        id: "l1",
        title: "What is an equation?",
        intro:
          "An equation is a mathematical sentence with a = sign. Whatever is on the left equals whatever is on the right — always.",
        phase: "concrete",
        blocks: [
          {
            kind: "theory",
            title: "Think of a balance",
            body:
              "Imagine a pair of scales. If the two sides balance, they're equal. If you add weight to one side, you must add the same to the other side to keep it balanced.\n\nThat's the golden rule: **whatever you do to one side, you must do to the other**.",
          },
          { kind: "visual", name: "equation-balance", props: { equation: "x + 3 = 7" } },
          {
            kind: "example",
            problem: "Solve x + 3 = 7.",
            steps: [
              "We want x by itself on the left.",
              "There's a +3 with the x. To remove it, subtract 3.",
              "But to keep the balance, we must subtract 3 from BOTH sides.",
              "x + 3 − 3 = 7 − 3",
              "x = 4.",
              "Check: 4 + 3 = 7 ✓",
            ],
            answer: "x = 4",
          },
          {
            kind: "mcq",
            prompt: "Solve: x − 5 = 12",
            choices: ["7", "17", "60", "-7"],
            answerIndex: 1,
            explanation:
              "To undo −5, add 5 to both sides: x − 5 + 5 = 12 + 5 → x = 17. Check: 17 − 5 = 12 ✓.",
            hint: "The opposite of subtracting 5 is adding 5.",
          },
        ],
      },
      {
        id: "l2",
        title: "One-step equations with × and ÷",
        intro: "When the x is being multiplied or divided, we undo it with the opposite operation.",
        phase: "pictorial",
        blocks: [
          {
            kind: "theory",
            body:
              "**Multiplied x** (like 3x) → divide both sides.\n\n**Divided x** (like x/4) → multiply both sides.\n\nAlways ask: what's happening to x, and how do I undo it?",
          },
          {
            kind: "example",
            problem: "Solve 4x = 20.",
            steps: [
              "4x means 4 times x.",
              "To undo × 4, divide both sides by 4.",
              "4x ÷ 4 = 20 ÷ 4",
              "x = 5.",
              "Check: 4 × 5 = 20 ✓",
            ],
            answer: "x = 5",
          },
          {
            kind: "numeric",
            prompt: "Solve for x: 6x = 42",
            answer: 7,
            explanation: "Divide both sides by 6: x = 42 ÷ 6 = 7. Check: 6 × 7 = 42 ✓.",
            hint: "What number times 6 equals 42?",
          },
          {
            kind: "numeric",
            prompt: "Solve for x: x/3 = 12",
            answer: 36,
            explanation: "Multiply both sides by 3: x = 12 × 3 = 36. Check: 36/3 = 12 ✓.",
            hint: "The opposite of divide by 3 is multiply by 3.",
          },
        ],
      },
      {
        id: "l3",
        title: "Two-step equations",
        intro:
          "Two operations on x? Undo them in reverse order — additions/subtractions first, then multiplications/divisions.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "Solve 2x + 5 = 13.",
            steps: [
              "Two things are happening to x: multiplied by 2, then +5. Undo in reverse.",
              "Step 1: subtract 5 from both sides. 2x + 5 − 5 = 13 − 5 → 2x = 8.",
              "Step 2: divide both sides by 2. 2x ÷ 2 = 8 ÷ 2 → x = 4.",
              "Check: 2(4) + 5 = 8 + 5 = 13 ✓",
            ],
            answer: "x = 4",
          },
          {
            kind: "tip",
            body:
              "Golden order: **Sanchez rule** — get rid of the added/subtracted number first, THEN divide off the coefficient.",
          },
          {
            kind: "mcq",
            prompt: "Solve: 3x − 4 = 11",
            choices: ["3", "5", "7", "9"],
            answerIndex: 1,
            explanation:
              "Add 4 to both sides: 3x = 15. Divide by 3: x = 5. Check: 3(5) − 4 = 15 − 4 = 11 ✓.",
            hint: "First undo −4 by adding 4 to both sides.",
          },
          {
            kind: "numeric",
            prompt: "Solve for x: 5x + 2 = 32",
            answer: 6,
            explanation: "5x = 30 → x = 6. Check: 5(6) + 2 = 32 ✓.",
            hint: "Subtract 2 first, then divide by 5.",
          },
        ],
      },
      {
        id: "l4",
        title: "NAPLAN word problems",
        intro:
          "The hardest part isn't the algebra — it's translating the words into an equation. Read twice, write once.",
        phase: "applied",
        blocks: [
          {
            kind: "example",
            problem: "A phone plan costs $29 per month plus $0.15 per minute. Ben's bill was $47. How many minutes of calls did he make?",
            steps: [
              "Let m = minutes.",
              "Cost = base + per-minute charge × minutes.",
              "29 + 0.15m = 47.",
              "Subtract 29 from both sides: 0.15m = 18.",
              "Divide both sides by 0.15: m = 120.",
              "Ben made 120 minutes of calls.",
            ],
            answer: "120 minutes",
          },
          {
            kind: "mcq",
            prompt:
              "A taxi charges $5 to start plus $2 per kilometre. A ride cost $23. How many kilometres was the ride?",
            choices: ["9", "11", "14", "18"],
            answerIndex: 0,
            explanation:
              "Let k = km. 5 + 2k = 23. Subtract 5: 2k = 18. Divide by 2: k = 9.",
            hint: "Set up the equation as start fee + $2 per km = total cost.",
          },
          {
            kind: "numeric",
            prompt:
              "The perimeter of a rectangle is 26 cm. Its length is 8 cm. What is its width in cm?",
            answer: 5,
            explanation:
              "Perimeter = 2(L + W). 2(8 + W) = 26 → 8 + W = 13 → W = 5 cm.",
            hint: "Divide both sides by 2 first to simplify.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 9 · PYTHAGORAS' THEOREM
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y9-pythagoras-theorem",
    title: "Pythagoras' Theorem",
    subtitle: "The most famous formula in maths — and one of the easiest to use once you see it.",
    year: 9,
    strand: "Measurement & Geometry",
    minutes: 40,
    color: "from-emerald-500 to-emerald-600",
    overview:
      "Pythagoras' theorem lets you find any missing side of a right-angled triangle. It's a NAPLAN Year 9 staple and the launchpad for coordinate geometry and trigonometry.",
    outcomes: [
      "State Pythagoras' theorem: a² + b² = c²",
      "Find the hypotenuse of a right-angled triangle",
      "Find a shorter side of a right-angled triangle",
      "Apply Pythagoras to real-world 2D problems",
    ],
    learningApproach:
      "We introduce Pythagoras visually with a manipulable triangle, then move to symbolic manipulation. The rearrangement (finding a shorter side) is taught immediately after the direct form so learners see both flavours together — reducing cognitive load later.",
    cognitiveTip:
      "Memorise the 3-4-5 and 5-12-13 triples — they appear in most NAPLAN Pythagoras questions and let you answer in seconds.",
    lessons: [
      {
        id: "l1",
        title: "The theorem: a² + b² = c²",
        intro:
          "For any right-angled triangle, the two shorter sides squared, added together, equal the longest side squared.",
        phase: "concrete",
        blocks: [
          {
            kind: "theory",
            title: "Naming the sides",
            body:
              "The **hypotenuse** (c) is the side OPPOSITE the right angle — always the longest side.\n\nThe other two sides (a and b) are the **legs**.\n\n**Pythagoras:** a² + b² = c²",
          },
          { kind: "visual", name: "pythagoras", props: { a: 3, b: 4 } },
          {
            kind: "tip",
            body:
              "The 3–4–5 triangle is Pythagoras' most famous example. Check: 3² + 4² = 9 + 16 = 25 = 5². ✓",
          },
          {
            kind: "mcq",
            prompt:
              "Which side is the hypotenuse in a right-angled triangle?",
            choices: [
              "The shortest side",
              "The side touching the right angle",
              "The side opposite the right angle",
              "Any of the three sides",
            ],
            answerIndex: 2,
            explanation: "The hypotenuse is always OPPOSITE the right angle, and it's always the longest.",
            hint: "Which side does the right-angle symbol point away from?",
          },
        ],
      },
      {
        id: "l2",
        title: "Finding the hypotenuse",
        intro:
          "If you know both legs, use a² + b² = c² and take a square root at the end.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem:
              "A right-angled triangle has legs of 6 cm and 8 cm. Find the hypotenuse.",
            steps: [
              "Write the formula: a² + b² = c².",
              "Substitute: 6² + 8² = c².",
              "Compute squares: 36 + 64 = c².",
              "Add: c² = 100.",
              "Square root: c = √100 = 10 cm.",
            ],
            answer: "c = 10 cm",
          },
          {
            kind: "numeric",
            prompt:
              "A right-angled triangle has legs of 5 cm and 12 cm. Find the hypotenuse in cm.",
            answer: 13,
            unit: "cm",
            explanation:
              "5² + 12² = 25 + 144 = 169 → c = √169 = 13 cm. (Another famous Pythagorean triple!)",
            hint: "Drag the sliders to a = 5, b = 12 and watch the hypotenuse update.",
            visual: {
              name: "pythagoras",
              props: { a: 5, b: 12 },
            },
          },
          {
            kind: "mcq",
            prompt: "Legs are 9 and 12. What's the hypotenuse?",
            choices: ["11", "13", "15", "18"],
            answerIndex: 2,
            explanation: "9² + 12² = 81 + 144 = 225 → √225 = 15.",
            hint: "9 and 12 form a triple with a familiar answer — it's 3× the 3–4–5 triangle.",
          },
        ],
      },
      {
        id: "l3",
        title: "Finding a shorter side",
        intro:
          "If you know the hypotenuse and one leg, rearrange: leg² = hypotenuse² − other leg².",
        phase: "abstract",
        blocks: [
          {
            kind: "theory",
            body:
              "**Rearranged form:** a² = c² − b² (or b² = c² − a²).\n\nSubtract instead of add — the hypotenuse must be the biggest number, so we always subtract.",
          },
          {
            kind: "example",
            problem:
              "A ladder 13 m long leans against a wall. The base of the ladder is 5 m from the wall. How far up the wall does the ladder reach?",
            steps: [
              "The ladder is the hypotenuse: c = 13. Base = 5 = a. Wall = b (unknown).",
              "Rearrange: b² = c² − a² = 13² − 5² = 169 − 25 = 144.",
              "b = √144 = 12 m.",
              "The ladder reaches 12 m up the wall.",
            ],
            answer: "12 m",
          },
          {
            kind: "numeric",
            prompt:
              "A right-angled triangle has hypotenuse 17 cm and one leg 8 cm. Find the other leg in cm.",
            answer: 15,
            unit: "cm",
            explanation: "17² − 8² = 289 − 64 = 225 → √225 = 15 cm.",
            hint: "Subtract the leg squared from the hypotenuse squared, then take the square root.",
          },
        ],
      },
      {
        id: "l4",
        title: "NAPLAN Year 9 applications",
        intro: "In NAPLAN, Pythagoras usually appears inside a real-world diagram.",
        phase: "applied",
        blocks: [
          {
            kind: "mcq",
            prompt:
              "A rectangular garden is 6 m wide and 8 m long. What is the length of the diagonal path across the garden?",
            choices: ["10 m", "12 m", "14 m", "48 m"],
            answerIndex: 0,
            explanation:
              "The diagonal is the hypotenuse of a right triangle with legs 6 and 8. c² = 6² + 8² = 36 + 64 = 100. c = 10 m.",
            hint: "The two sides of the rectangle are the legs; the diagonal is the hypotenuse.",
          },
          {
            kind: "mcq",
            prompt:
              "A right-angled triangle has legs 5 cm and 12 cm. A similar triangle has hypotenuse 39 cm. What is the shorter leg of the similar triangle?",
            choices: ["12 cm", "13 cm", "15 cm", "26 cm"],
            answerIndex: 2,
            explanation:
              "Original hypotenuse = √(5² + 12²) = 13. Scale factor = 39 ÷ 13 = 3. Shorter leg = 5 × 3 = 15 cm.",
            hint: "First find the original hypotenuse. Then work out the scale factor by dividing.",
          },
          {
            kind: "numeric",
            prompt:
              "A TV screen is advertised as 60 cm diagonal. Its width is 48 cm. What is its height in cm?",
            answer: 36,
            unit: "cm",
            explanation:
              "Height² = 60² − 48² = 3600 − 2304 = 1296. Height = √1296 = 36 cm.",
            hint: "Diagonal is the hypotenuse. Subtract width² from diagonal² and square-root.",
          },
        ],
      },
      {
        id: "l5",
        title: "Your turn — invent a Pythagoras problem",
        intro:
          "Pick two legs. See the hypotenuse. Write a real-world story — a ladder, a diagonal path, a TV screen — and save it.",
        phase: "applied",
        blocks: [
          {
            kind: "theory",
            body:
              "**Design tip:** the more real your story, the more useful the maths. Look around the room for right angles — walls & floors, screens, book edges — anywhere you spot one, Pythagoras applies.",
          },
          { kind: "lab", name: "pythagoras" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 3 · PLACE VALUE TO 1000
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y3-place-value-1000",
    title: "Place Value to 1000",
    subtitle: "See numbers as hundreds, tens and ones you can hold in your hand.",
    year: 3,
    strand: "Number & Algebra",
    minutes: 30,
    color: "from-emerald-500 to-emerald-600",
    overview:
      "Y3 students need to *feel* that 342 is 3 hundreds, 4 tens and 2 ones. This module uses virtual place-value blocks (Montessori MAB) so numbers become concrete before they're symbolic.",
    outcomes: [
      "Read, write and expand numbers to 1000",
      "Recognise the value of each digit by position",
      "Compare and order 3-digit numbers",
      "Round to nearest 10 and 100",
    ],
    learningApproach:
      "Straight Montessori: manipulable blocks first, then written expansion, then abstract comparison. Learners hear it, see it, and touch it before they write it.",
    cognitiveTip:
      "Ask your child to build 3 random numbers with blocks each morning this week. Dual-coding (visual + verbal) is one of the strongest evidence-based memory boosters.",
    lessons: [
      {
        id: "l1",
        title: "Hundreds, tens and ones — build them",
        intro: "Every 3-digit number is made of three kinds of pieces. Let's play with them.",
        phase: "concrete",
        blocks: [
          {
            kind: "video",
            src: "/videos/place-value-intro.mp4",
            title: "See it in action",
            caption: "Watch a student build numbers with place-value blocks before you try it yourself.",
          },
          {
            kind: "theory",
            title: "The three place values",
            body:
              "In the number **342**:\n\n**3** is in the hundreds place → 3 × 100 = 300\n**4** is in the tens place → 4 × 10 = 40\n**2** is in the ones place → 2 × 1 = 2\n\nAdd them: 300 + 40 + 2 = 342. That's called *expanded form*.",
          },
          { kind: "visual", name: "place-value-blocks", props: { start: 342 } },
          {
            kind: "mcq",
            prompt: "What is the value of the digit **7** in 471?",
            choices: ["7", "70", "700", "7000"],
            answerIndex: 1,
            explanation: "7 is in the tens place, so its value is 7 × 10 = 70.",
            hint: "Use the blocks — build 471 and see which pile the 7 falls into.",
            visual: {
              name: "place-value-blocks",
              props: { start: 471 },
            },
          },
          {
            kind: "numeric",
            prompt: "Write 500 + 60 + 8 as a single number.",
            answer: 568,
            explanation: "500 + 60 + 8 = 568.",
            hint: "Build 5 hundreds, 6 tens, 8 ones. Read the number.",
            visual: {
              name: "place-value-blocks",
              props: { start: 568 },
            },
          },
        ],
      },
      {
        id: "l2",
        title: "Comparing and ordering",
        intro: "Bigger hundreds win. If they're tied, compare the tens. Still tied? Compare the ones.",
        phase: "pictorial",
        blocks: [
          {
            kind: "example",
            problem: "Which is bigger: 428 or 471?",
            steps: [
              "Compare hundreds: both have 4. Tied.",
              "Compare tens: 2 vs 7 → 7 is bigger.",
              "So 471 > 428.",
            ],
            answer: "471",
          },
          {
            kind: "mcq",
            prompt: "Order these from smallest to largest: 305, 350, 309.",
            choices: ["305, 309, 350", "305, 350, 309", "309, 305, 350", "350, 309, 305"],
            answerIndex: 0,
            explanation: "All have 3 hundreds. Tens: 350 has 5 (biggest), 305 and 309 both have 0. So compare ones: 5 < 9. Order: 305, 309, 350.",
            hint: "Compare hundreds, then tens, then ones.",
          },
        ],
      },
      {
        id: "l3",
        title: "Rounding to 10 and 100",
        intro: "Rounding is estimating — a life-skill NAPLAN loves to test.",
        phase: "abstract",
        blocks: [
          {
            kind: "theory",
            body:
              "**Round to nearest 10:** look at the ones digit. 0–4 rounds down, 5–9 rounds up.\n\n**Round to nearest 100:** look at the tens digit. Same rule.",
          },
          {
            kind: "numeric",
            prompt: "Round 267 to the nearest 10.",
            answer: 270,
            explanation: "Ones digit is 7 (5 or more), so round up: 267 → 270.",
            hint: "Look at the ones digit. Is it 5 or more?",
          },
          {
            kind: "numeric",
            prompt: "Round 543 to the nearest 100.",
            answer: 500,
            explanation: "Tens digit is 4 (less than 5), so round down: 543 → 500.",
            hint: "Look at the tens digit. Is it under 5?",
          },
        ],
      },
      {
        id: "l4",
        title: "Your turn — design a place-value problem",
        intro:
          "Build any number with the blocks. Ask a good question about one of its digits. Save it.",
        phase: "applied",
        blocks: [
          {
            kind: "theory",
            body:
              "**Prompt starters:** *What is the value of the digit ___ in ___?* *Which digit is worth 40?* *Write the number in expanded form.* Try one of these — or invent your own.",
          },
          { kind: "lab", name: "place-value" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 3 · TIME & CALENDARS
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y3-time-calendars",
    title: "Time & Calendars",
    subtitle: "Read analog and digital clocks, calculate elapsed time, use calendars.",
    year: 3,
    strand: "Measurement & Geometry",
    minutes: 25,
    color: "from-sky-500 to-sky-700",
    overview:
      "Time is the sneakiest Year 3 NAPLAN topic. This module builds a physical sense of the clock face and links it to elapsed-time word problems.",
    outcomes: [
      "Read time on analog and digital clocks",
      "Convert between formats (quarter past, 3:15)",
      "Calculate elapsed time in whole hours & half hours",
      "Read a calendar to find dates and days of the week",
    ],
    learningApproach:
      "Time is spatial and rhythmic. We use the clock face as a visual manipulative and connect quarters/halves to fractions the student already knows.",
    cognitiveTip:
      "Ask your child to be the family timekeeper this week — 'How many minutes until dinner?' Retrieval in real contexts locks it in far better than worksheets alone.",
    lessons: [
      {
        id: "l1",
        title: "Reading the clock",
        intro: "The two hands move together. The short hand tells hours; the long hand tells minutes.",
        phase: "concrete",
        blocks: [
          {
            kind: "theory",
            body:
              "**Analog clock**: 12 numbers around a circle. **Hour hand** (short) → tells us the hour. **Minute hand** (long) → tells us minutes past the hour.\n\nEvery 5 numbers = 5 minutes. When the minute hand is at 3, that's 15 minutes past.",
          },
          {
            kind: "tip",
            body:
              "**Quarter past** = 15 minutes past (¼ of the clock).\n**Half past** = 30 minutes past (½ of the clock).\n**Quarter to** = 45 minutes past (¾ around).",
          },
          {
            kind: "mcq",
            prompt: "How would you write 'quarter past 4' in digital form?",
            choices: ["4:04", "4:15", "4:45", "15:04"],
            answerIndex: 1,
            explanation: "Quarter past = 15 minutes past → 4:15.",
            hint: "A quarter of an hour is 15 minutes.",
          },
        ],
      },
      {
        id: "l2",
        title: "Elapsed time",
        intro: "How long between two times? Count the hours first, then the minutes.",
        phase: "applied",
        blocks: [
          {
            kind: "example",
            problem: "A movie starts at 3:30pm and finishes at 5:00pm. How long is the movie?",
            steps: [
              "From 3:30pm to 4:30pm = 1 hour.",
              "From 4:30pm to 5:00pm = 30 minutes.",
              "Total = 1 hour 30 minutes.",
            ],
            answer: "1 hour 30 minutes",
          },
          {
            kind: "numeric",
            prompt: "A lesson starts at 9:00am and ends at 10:45am. How many minutes long is it?",
            answer: 105,
            unit: "min",
            explanation: "9:00 → 10:00 = 60 min. 10:00 → 10:45 = 45 min. Total = 105 min.",
            hint: "Count full hours first (in minutes), then add the leftover minutes.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 5 · DECIMALS & PERCENTAGES
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y5-decimals-percentages",
    title: "Decimals & Percentages",
    subtitle: "Fractions, decimals and percentages — three flavours of the same idea.",
    year: 5,
    strand: "Number & Algebra",
    minutes: 40,
    color: "from-orange-500 to-orange-600",
    overview:
      "Once fractions click, decimals and percentages become easy translations. This module makes the fraction ↔ decimal ↔ percent triangle so fluent it becomes automatic.",
    outcomes: [
      "Read and write decimals to thousandths",
      "Convert between fractions, decimals and percentages",
      "Calculate 10%, 25% and 50% mentally",
      "Solve real-world discount and GST problems",
    ],
    learningApproach:
      "Decimals are fractions with denominators of 10, 100, 1000. We connect the two forms visually before drilling the mental shortcuts — deep understanding first, speed second.",
    cognitiveTip:
      "Estimate the % discount every time you see a sale price for a week. Real-world retrieval beats any drill book.",
    lessons: [
      {
        id: "l1",
        title: "Decimals — beyond the point",
        intro:
          "Just as tens sit LEFT of the ones, tenths sit RIGHT of the ones. The decimal point is the boundary.",
        phase: "concrete",
        blocks: [
          {
            kind: "theory",
            body:
              "**0.1** = one tenth = 1/10 (split a whole into 10)\n**0.01** = one hundredth = 1/100 (split into 100)\n**0.001** = one thousandth = 1/1000\n\nSo **0.7** = 7/10, and **0.25** = 25/100 = 1/4.",
          },
          {
            kind: "mcq",
            prompt: "What is 0.6 as a fraction (in simplest form)?",
            choices: ["6/10", "3/5", "60/1", "6/100"],
            answerIndex: 1,
            explanation: "0.6 = 6/10. Divide top and bottom by 2 → 3/5.",
            hint: "Write it as tenths first, then simplify.",
          },
          {
            kind: "numeric",
            prompt: "Enter as a decimal: three-hundredths.",
            answer: 0.03,
            explanation: "3 hundredths = 3/100 = 0.03.",
            hint: "Hundredths are two decimal places.",
          },
        ],
      },
      {
        id: "l2",
        title: "The 10% shortcut",
        intro: "10% of anything is just move the decimal point one place left.",
        phase: "abstract",
        blocks: [
          {
            kind: "tip",
            body:
              "**10% of 80 = 8** (move decimal one place).\n**5% is half of 10%**.\n**20% is double 10%**.\nThat's most of the mental-maths percentages you'll ever need.",
          },
          {
            kind: "example",
            problem: "What is 25% of $60?",
            steps: [
              "25% is the same as 1/4.",
              "1/4 of 60 = 60 ÷ 4 = 15.",
              "Answer: $15.",
            ],
            answer: "$15",
          },
          {
            kind: "numeric",
            prompt: "What is 10% of 240?",
            answer: 24,
            explanation: "Move the decimal one place left: 240 → 24.",
          },
        ],
      },
      {
        id: "l3",
        title: "NAPLAN Y5 · shopping problems",
        intro: "Percentages usually show up in NAPLAN as discounts or GST.",
        phase: "applied",
        blocks: [
          {
            kind: "mcq",
            prompt: "A jacket costs $80 and is on sale at 20% off. How much do you save?",
            choices: ["$8", "$12", "$16", "$20"],
            answerIndex: 2,
            explanation: "10% of $80 = $8. 20% = double = $16. Save $16.",
            hint: "Find 10% first, then double it.",
          },
          {
            kind: "numeric",
            prompt: "A book costs $40. GST is 10%. What is the GST amount in dollars?",
            answer: 4,
            unit: "$",
            explanation: "10% of $40 = $4.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 5 · AREA & PERIMETER
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y5-area-perimeter",
    title: "Area & Perimeter",
    subtitle: "Measure the size of shapes — inside (area) and around (perimeter).",
    year: 5,
    strand: "Measurement & Geometry",
    minutes: 35,
    color: "from-navy-600 to-navy-800",
    overview:
      "Area and perimeter both measure size, but they measure different things. This module makes the distinction obvious with grid visuals, then extends to composite shapes.",
    outcomes: [
      "Distinguish area (inside) from perimeter (around)",
      "Calculate perimeter of rectangles and triangles",
      "Calculate area of rectangles using base × height",
      "Find the area of L-shaped composite figures",
    ],
    learningApproach:
      "We start with counting unit squares (concrete), abstract that to a formula (pictorial), then apply to real gardens/rooms (applied). Interleaving perimeter with area — instead of teaching them in separate weeks — prevents the classic 'which is which?' confusion.",
    cognitiveTip:
      "Measure the perimeter and area of two rooms in your house this week — a lived example rewires the concept.",
    lessons: [
      {
        id: "l1",
        title: "Perimeter — around the outside",
        intro: "Perimeter is the distance around a shape. Add up all the sides.",
        phase: "concrete",
        blocks: [
          {
            kind: "example",
            problem: "A rectangle has length 8 cm and width 5 cm. What is the perimeter?",
            steps: [
              "Rectangle has 2 lengths and 2 widths.",
              "Sides: 8 + 5 + 8 + 5 = 26.",
              "Or use formula: P = 2(L + W) = 2(8 + 5) = 2 × 13 = 26.",
              "Answer: 26 cm.",
            ],
            answer: "26 cm",
          },
          {
            kind: "numeric",
            prompt: "A square has side length 9 cm. What is its perimeter in cm?",
            answer: 36,
            unit: "cm",
            explanation: "All 4 sides equal: 9 × 4 = 36 cm.",
            hint: "A square has 4 equal sides.",
          },
        ],
      },
      {
        id: "l2",
        title: "Area — inside the shape",
        intro: "Area counts how many unit squares fit inside. For rectangles: base × height.",
        phase: "pictorial",
        blocks: [
          {
            kind: "theory",
            body:
              "**Area of a rectangle** = base × height (or length × width).\n\nUnits are squared: cm², m², mm².\n\nA 4 × 3 rectangle has 4 rows of 3 squares = 12 squares → 12 cm².",
          },
          {
            kind: "tip",
            body:
              "Perimeter uses cm (length units). Area uses cm² (square units). If the answer's in the wrong unit, you've solved the wrong thing!",
          },
          {
            kind: "numeric",
            prompt: "A rectangle is 6 m long and 4 m wide. What is its area in m²?",
            answer: 24,
            unit: "m²",
            explanation: "Area = 6 × 4 = 24 m².",
          },
          {
            kind: "mcq",
            prompt: "A square has area 49 m². What is its side length?",
            choices: ["6 m", "7 m", "8 m", "9 m"],
            answerIndex: 1,
            explanation: "Side × side = 49 → side = √49 = 7 m.",
            hint: "What number multiplied by itself gives 49?",
          },
        ],
      },
      {
        id: "l3",
        title: "Composite shapes (L-shapes)",
        intro: "Split the shape into rectangles, find each area, then add.",
        phase: "applied",
        blocks: [
          {
            kind: "example",
            problem: "An L-shaped room: a 6m × 4m rectangle attached to a 3m × 2m rectangle. Total area?",
            steps: [
              "Rectangle 1: 6 × 4 = 24 m².",
              "Rectangle 2: 3 × 2 = 6 m².",
              "Total: 24 + 6 = 30 m².",
            ],
            answer: "30 m²",
          },
          {
            kind: "numeric",
            prompt:
              "A garden is an L-shape: a 10 × 4 m rectangle plus a 5 × 3 m rectangle. What is the total area in m²?",
            answer: 55,
            unit: "m²",
            explanation: "10×4 = 40. 5×3 = 15. 40 + 15 = 55 m².",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 7 · RATIO, RATE & PROPORTION
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y7-ratio-rate-proportion",
    title: "Ratio, Rate & Proportion",
    subtitle: "The language of comparing quantities — recipes, maps, best-buys.",
    year: 7,
    strand: "Number & Algebra",
    minutes: 40,
    color: "from-sky-500 to-sky-700",
    overview:
      "Ratio is everywhere in daily life — from cake recipes to fuel efficiency. Year 7 introduces the formal language. The unit-rate method taught here is the most powerful problem-solving tool in the curriculum.",
    outcomes: [
      "Simplify ratios by dividing by common factors",
      "Solve proportion problems using the unit-rate method",
      "Compare best-buys with unit-price reasoning",
      "Convert rates (km/h, $/kg)",
    ],
    learningApproach:
      "Every abstract ratio is grounded in a concrete real-world scenario. We use the unit-rate strategy — find the value of one — because it's the universal problem-solving tool that scales to Year 9 and beyond.",
    cognitiveTip:
      "Practice mental unit rates when shopping: 'How much per 100 g?' The brain builds these shortcuts through frequent low-stakes practice.",
    lessons: [
      {
        id: "l1",
        title: "What is a ratio?",
        intro: "A ratio compares two amounts of the same thing.",
        phase: "concrete",
        blocks: [
          {
            kind: "theory",
            body:
              "A **ratio** is written **a : b** (say 'a to b'). It's a comparison — not a fraction, though they're closely related.\n\n**Example:** In a class of 12 boys and 18 girls, the boy-to-girl ratio is **12 : 18**, which simplifies to **2 : 3** (divide both by 6).",
          },
          {
            kind: "mcq",
            prompt: "Simplify the ratio 24 : 36.",
            choices: ["3 : 4", "2 : 3", "4 : 5", "6 : 9"],
            answerIndex: 1,
            explanation: "Divide both by 12: 24÷12 = 2, 36÷12 = 3 → 2 : 3.",
            hint: "Find the largest number that divides both.",
          },
        ],
      },
      {
        id: "l2",
        title: "The unit-rate method",
        intro: "Whenever you don't know what to do — find the value of ONE, then multiply.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "8 apples cost $6. How much do 5 apples cost?",
            steps: [
              "Find the price of 1 apple: $6 ÷ 8 = $0.75.",
              "Multiply by 5: $0.75 × 5 = $3.75.",
              "Answer: $3.75.",
            ],
            answer: "$3.75",
          },
          {
            kind: "numeric",
            prompt: "5 chocolate bars cost $10. How much do 8 cost, in dollars?",
            answer: 16,
            unit: "$",
            explanation: "1 bar = $10 ÷ 5 = $2. 8 bars = $2 × 8 = $16.",
            hint: "Find the price per bar first.",
          },
        ],
      },
      {
        id: "l3",
        title: "Rates and best-buys",
        intro: "A rate compares two DIFFERENT units — km per hour, $ per kg.",
        phase: "applied",
        blocks: [
          {
            kind: "mcq",
            prompt: "Which is the better buy? A) 500 g for $4  B) 800 g for $6",
            choices: ["A", "B", "Same price", "Cannot tell"],
            answerIndex: 1,
            explanation:
              "A: $4 / 500 g = $0.008/g. B: $6 / 800 g = $0.0075/g. B is cheaper per gram.",
            hint: "Find the price per gram for each.",
          },
          {
            kind: "numeric",
            prompt: "A car travels 240 km in 3 hours. What is its speed in km/h?",
            answer: 80,
            unit: "km/h",
            explanation: "Speed = distance ÷ time = 240 ÷ 3 = 80 km/h.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 7 · PERCENTAGES & FINANCIAL MATHS
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y7-percentages-financial",
    title: "Percentages & Financial Maths",
    subtitle: "GST, discounts, simple interest — real money, real maths.",
    year: 7,
    strand: "Number & Algebra",
    minutes: 40,
    color: "from-orange-500 to-orange-600",
    overview:
      "Year 7 percentages tighten the connection between the maths and everyday finance. This module builds the mental shortcuts (10%, 25%, 50%) then extends to increase/decrease and simple interest.",
    outcomes: [
      "Calculate a percentage of an amount mentally",
      "Increase or decrease a value by a percentage",
      "Solve simple GST and discount problems",
      "Calculate simple interest",
    ],
    learningApproach:
      "Money is inherently motivating — we lean into it. The mental shortcuts are drilled with spaced retrieval, then applied to varied real-life scenarios (interleaving).",
    cognitiveTip:
      "Whenever your child sees a price tag, ask them the 10% and 25% versions. Two questions, thirty seconds, huge retention.",
    lessons: [
      {
        id: "l1",
        title: "Percent of an amount",
        intro: "% means 'per hundred'. 25% = 25/100 = 1/4.",
        phase: "abstract",
        blocks: [
          {
            kind: "tip",
            body:
              "The universal shortcut: **% of amount = (%/100) × amount.**\n25% of 80 = (25/100) × 80 = 20.",
          },
          {
            kind: "numeric",
            prompt: "What is 15% of 200?",
            answer: 30,
            explanation: "15% = 15/100. (15/100) × 200 = 30. Or: 10% of 200 = 20, 5% = 10, add → 30.",
            hint: "Try 10% + 5%.",
          },
        ],
      },
      {
        id: "l2",
        title: "Increase and decrease",
        intro: "Add-on-top or take-off situations — discount, GST, tips.",
        phase: "applied",
        blocks: [
          {
            kind: "example",
            problem: "A t-shirt costs $30. GST of 10% is added. What is the total?",
            steps: [
              "10% of 30 = $3.",
              "Total = 30 + 3 = $33.",
            ],
            answer: "$33",
          },
          {
            kind: "mcq",
            prompt:
              "A $120 pair of shoes is discounted by 25%. What is the sale price?",
            choices: ["$90", "$95", "$100", "$105"],
            answerIndex: 0,
            explanation: "25% of 120 = 30. Sale price = 120 − 30 = $90.",
            hint: "25% is a quarter. Find a quarter of 120, then subtract.",
          },
        ],
      },
      {
        id: "l3",
        title: "Simple interest",
        intro: "Money grows over time — simple interest is the introductory model.",
        phase: "applied",
        blocks: [
          {
            kind: "theory",
            body: "**Simple interest formula:** I = P × R × T\n\n**P** = principal (starting amount), **R** = rate as a decimal (5% = 0.05), **T** = time in years.",
          },
          {
            kind: "numeric",
            prompt:
              "You invest $500 at 4% per year for 3 years. What is the simple interest earned, in dollars?",
            answer: 60,
            unit: "$",
            explanation: "I = 500 × 0.04 × 3 = 60. Interest = $60.",
            hint: "I = P × R × T. Rate 4% = 0.04.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 9 · TRIGONOMETRY (SOHCAHTOA)
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y9-trigonometry",
    title: "Trigonometry (SOHCAHTOA)",
    subtitle: "The single most useful formula set in Year 9 & 10 maths.",
    year: 9,
    strand: "Measurement & Geometry",
    minutes: 45,
    color: "from-sky-500 to-sky-700",
    overview:
      "Trigonometry lets you find any side or angle of a right-angled triangle. This module builds the mental picture of opposite / adjacent / hypotenuse first, then drills SOHCAHTOA.",
    outcomes: [
      "Label sides of a right-angled triangle relative to an angle",
      "Choose the correct trig ratio (sin, cos, tan)",
      "Find missing sides using SOHCAHTOA",
      "Find missing angles using inverse trig",
    ],
    learningApproach:
      "Trig is language before it's numbers. We name the sides first (concrete), then map them to ratios (abstract), then apply to problems (applied). Chunking SOHCAHTOA as three tiny facts, not one big formula, reduces working-memory load.",
    cognitiveTip:
      "Draw a right triangle every morning for a week and label its sides relative to a chosen angle. Repetition of the labelling — not calculation — is where trig fluency comes from.",
    lessons: [
      {
        id: "l1",
        title: "Naming the sides",
        intro:
          "Before formulas, we need vocabulary. The three sides have names — and they depend on which angle you're standing at.",
        phase: "concrete",
        blocks: [
          {
            kind: "theory",
            body:
              "Pick an angle θ (not the right angle). Then:\n\n**Hypotenuse** = the longest side (opposite the right angle). Same every time.\n**Opposite** = the side facing θ.\n**Adjacent** = the side NEXT to θ (that isn't the hypotenuse).",
          },
          {
            kind: "tip",
            body:
              "The hypotenuse is fixed. Opposite and adjacent SWAP if you switch to the other angle. Always ask: 'from *this* angle, which side is opposite me?'",
          },
        ],
      },
      {
        id: "l2",
        title: "SOH · CAH · TOA",
        intro: "Three ratios, one memory trick.",
        phase: "abstract",
        blocks: [
          {
            kind: "theory",
            body:
              "**SOH** — Sine = Opposite ÷ Hypotenuse\n**CAH** — Cosine = Adjacent ÷ Hypotenuse\n**TOA** — Tangent = Opposite ÷ Adjacent",
          },
          {
            kind: "example",
            problem: "In a right triangle, the hypotenuse is 10 and the opposite side to angle θ is 6. Find sin θ.",
            steps: [
              "Sine = Opposite ÷ Hypotenuse (SOH).",
              "sin θ = 6 / 10 = 0.6.",
            ],
            answer: "0.6",
          },
          {
            kind: "numeric",
            prompt:
              "In a right triangle, adjacent = 4 and hypotenuse = 5. What is cos θ? (Decimal.)",
            answer: 0.8,
            tolerance: 0.01,
            explanation: "CAH: cos θ = adjacent / hypotenuse = 4/5 = 0.8.",
          },
        ],
      },
      {
        id: "l3",
        title: "Finding a missing side",
        intro: "Pick the ratio that uses what you know AND what you want.",
        phase: "applied",
        blocks: [
          {
            kind: "example",
            problem:
              "A right triangle has an angle of 30° and a hypotenuse of 12. Find the length of the OPPOSITE side.",
            steps: [
              "We know: angle 30°, hypotenuse = 12, want opposite.",
              "Opposite and hypotenuse → use SIN.",
              "sin 30° = opposite / 12.",
              "opposite = 12 × sin 30° = 12 × 0.5 = 6.",
            ],
            answer: "6",
          },
          {
            kind: "mcq",
            prompt:
              "You know the adjacent side and want to find the opposite side of a right triangle. Which ratio do you use?",
            choices: ["Sine", "Cosine", "Tangent", "Pythagoras"],
            answerIndex: 2,
            explanation:
              "TOA — Tangent = Opposite / Adjacent — uses both those sides, so it's the right choice.",
            hint: "Which ratio pairs opposite with adjacent?",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 9 · INDEX LAWS & SCIENTIFIC NOTATION
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y9-index-laws",
    title: "Index Laws & Scientific Notation",
    subtitle: "Master exponents once — they underpin all high-school maths.",
    year: 9,
    strand: "Number & Algebra",
    minutes: 40,
    color: "from-emerald-500 to-emerald-600",
    overview:
      "Index (exponent) laws let you manipulate expressions like 2^3 × 2^4 without expanding. They also unlock scientific notation — the shorthand of science.",
    outcomes: [
      "Apply the multiplication and division index laws",
      "Handle negative and zero indices",
      "Convert numbers to/from scientific notation",
      "Perform arithmetic in scientific notation",
    ],
    learningApproach:
      "We derive each law from first principles once (understanding), then drill (fluency). Deriving before drilling reduces the number of separate rules from five to essentially one.",
    cognitiveTip:
      "When you meet a new expression, ask: 'Can I write this with the same base?' 90% of index-law questions come down to that one question.",
    lessons: [
      {
        id: "l1",
        title: "The two big laws",
        intro:
          "When you multiply powers of the SAME base, add the exponents. When you divide, subtract. That's most of the game.",
        phase: "abstract",
        blocks: [
          {
            kind: "theory",
            body:
              "**Multiplication:** aᵐ × aⁿ = a^(m+n)\n\n**Division:** aᵐ ÷ aⁿ = a^(m−n)\n\nBase must be the same!\n\n**Example:** 2³ × 2⁴ = 2⁷.",
          },
          {
            kind: "numeric",
            prompt: "Simplify: 3⁵ × 3² and give the exponent only.",
            answer: 7,
            explanation: "Same base, add exponents: 5 + 2 = 7. So 3⁵ × 3² = 3⁷.",
            hint: "When multiplying powers with the same base, add exponents.",
          },
          {
            kind: "mcq",
            prompt: "Simplify: 5⁸ ÷ 5³",
            choices: ["5²", "5⁵", "5¹¹", "5²⁴"],
            answerIndex: 1,
            explanation: "Same base, subtract exponents: 8 − 3 = 5 → 5⁵.",
            hint: "Division of same-base powers: subtract the exponents.",
          },
        ],
      },
      {
        id: "l2",
        title: "Zero and negative indices",
        intro: "Two quirky rules — but they follow from the two big laws.",
        phase: "abstract",
        blocks: [
          {
            kind: "theory",
            body:
              "**Zero index:** anything to the power 0 = 1. (Except 0⁰.)\n\n**Negative index:** a⁻ⁿ = 1/aⁿ. It flips the base to the denominator.\n\n**Example:** 2⁻³ = 1/2³ = 1/8.",
          },
          {
            kind: "numeric",
            prompt: "What is 7⁰?",
            answer: 1,
            explanation: "Anything (non-zero) to the power 0 is 1.",
          },
          {
            kind: "mcq",
            prompt: "Which is equal to 3⁻²?",
            choices: ["9", "6", "1/6", "1/9"],
            answerIndex: 3,
            explanation: "3⁻² = 1/3² = 1/9.",
            hint: "Negative index flips the base to the denominator.",
          },
        ],
      },
      {
        id: "l3",
        title: "Scientific notation",
        intro: "Very big or very small numbers written in a compact way.",
        phase: "applied",
        blocks: [
          {
            kind: "theory",
            body:
              "**Standard form:** a × 10ⁿ, where 1 ≤ a < 10.\n\n**Big numbers:** positive n. Example: 4,500 = 4.5 × 10³.\n**Small numbers:** negative n. Example: 0.006 = 6 × 10⁻³.",
          },
          {
            kind: "numeric",
            prompt:
              "Write 72,000 in scientific notation. Enter the exponent of 10 only.",
            answer: 4,
            explanation: "72,000 = 7.2 × 10⁴. Exponent is 4.",
            hint: "Move the decimal point until the number is between 1 and 10. Count the moves.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // ADVANCED · LOGIC & REASONING
  // ─────────────────────────────────────────────────────────────
  {
    slug: "advanced-logic-reasoning",
    title: "Logic & Reasoning Puzzles",
    subtitle: "Train the mathematical brain with challenging non-routine puzzles.",
    year: 7,
    pathway: "Advanced",
    strand: "Number & Algebra",
    minutes: 45,
    color: "from-fuchsia-500 to-fuchsia-700",
    overview:
      "For students aiming beyond NAPLAN — selective schools, scholarships, Olympiads. Non-routine problems don't have a formula; they have a *strategy*. This module builds the strategies.",
    outcomes: [
      "Apply working-backwards strategy",
      "Use guess-check-adjust systematically",
      "Draw diagrams and tables to model problems",
      "Recognise pattern-and-invariant problems",
    ],
    learningApproach:
      "Non-routine problems build the prefrontal cortex — the seat of executive function. Struggling productively is the goal. We normalise being stuck as *part of the process* to build growth mindset.",
    cognitiveTip:
      "Being stuck for 15 minutes on a good problem builds more brainpower than 60 minutes of easy drills. Sit with the discomfort — that's your brain rewiring.",
    lessons: [
      {
        id: "l1",
        title: "Working backwards",
        intro:
          "Sometimes it's easier to start at the answer and undo each step to find the beginning.",
        phase: "concrete",
        blocks: [
          {
            kind: "example",
            problem:
              "I think of a number. I add 5, then multiply by 3. My result is 27. What was my original number?",
            steps: [
              "Result: 27. Last step was ×3. Undo: 27 ÷ 3 = 9.",
              "Previous step was +5. Undo: 9 − 5 = 4.",
              "My original number was 4.",
              "Check: 4 + 5 = 9. 9 × 3 = 27. ✓",
            ],
            answer: "4",
          },
          {
            kind: "numeric",
            prompt:
              "I think of a number. I multiply by 4, then subtract 7. My result is 25. What was my number?",
            answer: 8,
            explanation: "Undo −7 by +7: 25 + 7 = 32. Undo ×4 by ÷4: 32 ÷ 4 = 8.",
            hint: "Work back from 25. The last operation was −7 — undo it first.",
          },
        ],
      },
      {
        id: "l2",
        title: "Guess, check, adjust",
        intro:
          "Not cheating — a genuine strategy. Make a smart guess, see how far off you are, adjust.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem:
              "A rectangle has area 60 cm² and perimeter 32 cm. What are its dimensions?",
            steps: [
              "Let L and W be the sides. LW = 60 and 2(L+W) = 32 → L+W = 16.",
              "Guess L=10, W=6: 10+6=16 ✓, 10×6=60 ✓. Done.",
              "Answer: 10 cm × 6 cm.",
            ],
            answer: "10 cm × 6 cm",
          },
          {
            kind: "numeric",
            prompt:
              "Two whole numbers add to 20 and multiply to 91. What is the LARGER number?",
            answer: 13,
            explanation:
              "Guess pairs adding to 20: 1&19 (19), 2&18 (36), … try 7&13: sum 20, product 91 ✓.",
            hint: "List pairs of whole numbers adding to 20, and try their products.",
          },
        ],
      },
      {
        id: "l3",
        title: "Draw a diagram",
        intro: "For anything spatial, geometric or involving movement — sketch it.",
        phase: "applied",
        blocks: [
          {
            kind: "mcq",
            prompt:
              "A frog is at the bottom of a 12-metre well. Each day it climbs 3 metres up but slides back 2 metres at night. How many days until it reaches the top?",
            choices: ["8 days", "9 days", "10 days", "12 days"],
            answerIndex: 2,
            explanation:
              "Net gain per day = 1 m. After 9 days it's at 9 m. On day 10 it climbs 3 to reach 12 m — and doesn't slide because it's out! Answer: 10 days.",
            hint:
              "Track the frog's position DAY by DAY on paper. Watch what happens on the final day.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // ADVANCED · COMBINATORICS
  // ─────────────────────────────────────────────────────────────
  {
    slug: "advanced-combinatorics",
    title: "Combinatorics: The Art of Counting",
    subtitle: "How many ways? A gateway to probability and higher maths.",
    year: 9,
    pathway: "Advanced",
    strand: "Statistics & Probability",
    minutes: 40,
    color: "from-orange-500 to-orange-600",
    overview:
      "Counting cleverly is a superpower. The multiplication principle and factorial notation unlock probability, algebra and computer science.",
    outcomes: [
      "Apply the multiplication (product) rule",
      "Use factorials to count arrangements",
      "Distinguish arrangements (order matters) from selections (order doesn't)",
      "Solve real-world counting problems",
    ],
    learningApproach:
      "Combinatorics is where kids realise maths can be *play*. We start with concrete scenarios (menus, seating, PIN codes) and abstract only after the pattern is clear.",
    cognitiveTip:
      "For every counting problem ask two questions: (1) How many choices at each step? (2) Does order matter?",
    lessons: [
      {
        id: "l1",
        title: "The multiplication principle",
        intro:
          "If one choice has A options and the next has B options, together there are A × B combinations.",
        phase: "concrete",
        blocks: [
          {
            kind: "example",
            problem:
              "A menu has 4 mains and 3 desserts. How many meal combinations are possible?",
            steps: [
              "Choice 1: main → 4 options.",
              "Choice 2: dessert → 3 options.",
              "Multiply: 4 × 3 = 12 combinations.",
            ],
            answer: "12",
          },
          {
            kind: "numeric",
            prompt:
              "A 4-digit PIN uses digits 0–9, with repeats allowed. How many possible PINs?",
            answer: 10000,
            explanation:
              "Each of the 4 positions has 10 options. 10 × 10 × 10 × 10 = 10,000.",
            hint: "How many choices for each digit?",
          },
        ],
      },
      {
        id: "l2",
        title: "Factorials — arranging things",
        intro: "n! (n factorial) = n × (n−1) × … × 2 × 1. It counts arrangements.",
        phase: "abstract",
        blocks: [
          {
            kind: "theory",
            body:
              "**n!** (n factorial) = n × (n−1) × (n−2) × … × 1.\n\n**Example:** 4! = 4 × 3 × 2 × 1 = 24.\n\nWhy does this count arrangements? For n objects: n choices for position 1, then (n−1) left for position 2, etc.",
          },
          {
            kind: "numeric",
            prompt: "How many ways can 5 people line up for a photo?",
            answer: 120,
            explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120.",
            hint: "Multiply 5 × 4 × 3 × 2 × 1.",
          },
          {
            kind: "mcq",
            prompt:
              "Two friends need to sit in adjacent seats in a row of 5 seats. How many arrangements? (Treat the two friends as one block.)",
            choices: ["24", "48", "60", "120"],
            answerIndex: 1,
            explanation:
              "Treat the pair as 1 block → 4 items to arrange = 4! = 24. Inside the pair, the two friends can swap: × 2 = 48.",
            hint: "Combine the pair into one 'super-person', arrange, then multiply for their internal order.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 3 · CURRICULUM EXPANSION (compact study modules)
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y3-addition-subtraction",
    title: "Addition & Subtraction",
    subtitle: "Regrouping across columns and estimating totals.",
    year: 3,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-sky-500 to-sky-700",
    overview:
      "Fluent addition and subtraction with regrouping — the workhorse operations behind every Year 3 numeracy task.",
    outcomes: [
      "Add and subtract 3-digit numbers with regrouping",
      "Estimate sums by rounding to the nearest 10",
      "Solve one-step word problems using +/−",
      "Check by using the inverse operation",
    ],
    learningApproach:
      "Column method with place-value scaffolding; check by inverse each time. Regrouping is taught with concrete blocks first.",
    cognitiveTip:
      "Common mistake to avoid: forgetting to regroup across a zero. Always work column by column, right to left.",
    lessons: [
      {
        id: "l1",
        title: "Column method fluency",
        intro:
          "Line up ones, tens and hundreds. Work right to left. Carry when a column ≥ 10; borrow when you can't subtract.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "268 + 157 = ?",
            steps: [
              "Ones: 8 + 7 = 15 → write 5, carry 1.",
              "Tens: 6 + 5 + 1 = 12 → write 2, carry 1.",
              "Hundreds: 2 + 1 + 1 = 4.",
            ],
            answer: "425",
          },
          {
            kind: "tip",
            body:
              "**Common mistake:** forgetting to regroup across a zero (e.g. 503 − 178). Always borrow step by step.",
          },
          {
            kind: "numeric",
            prompt: "Solve: 503 − 178",
            answer: 325,
            explanation:
              "Borrow twice: 503 → 4 hundreds, 9 tens, 13 ones. 13−8=5, 9−7=2, 4−1=3 → 325.",
            hint: "Borrow from the tens; the tens borrow from the hundreds.",
          },
          {
            kind: "mcq",
            prompt: "Estimate 397 + 218 by rounding each to the nearest 10.",
            choices: ["600", "610", "620", "630"],
            answerIndex: 2,
            explanation: "397 → 400, 218 → 220. 400 + 220 = 620.",
            hint: "Round each number first, then add.",
          },
        ],
      },
    ],
  },
  {
    slug: "y3-division-sharing",
    title: "Division as Equal Sharing",
    subtitle: "The inverse of multiplication — sharing into equal groups.",
    year: 3,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-emerald-500 to-emerald-600",
    overview:
      "Division is either sharing equally or grouping. Both link straight back to multiplication facts.",
    outcomes: [
      "Recognise division as equal sharing or equal grouping",
      "Solve division facts using known multiplication facts",
      "Interpret division word problems",
      "Recognise the ÷ symbol and its equivalence to × inverse",
    ],
    learningApproach:
      "Every division fact is a multiplication fact in disguise: 24 ÷ 6 = 4 because 6 × 4 = 24.",
    cognitiveTip:
      "Common mistake: choosing multiplication when the wording is really about equal sharing.",
    lessons: [
      {
        id: "l1",
        title: "Share or group?",
        intro: "Two ways to think about division — both give the same answer.",
        phase: "concrete",
        blocks: [
          {
            kind: "theory",
            body:
              "**Sharing:** 12 lollies shared between 3 friends → each gets 12 ÷ 3 = 4.\n**Grouping:** 12 lollies grouped in 3s → makes 12 ÷ 3 = 4 groups.",
          },
          {
            kind: "example",
            problem: "24 ÷ 6 = ?",
            steps: [
              "Ask: 6 × ? = 24.",
              "6 × 4 = 24.",
              "So 24 ÷ 6 = 4.",
            ],
            answer: "4",
          },
          {
            kind: "numeric",
            prompt: "36 students form teams of 4. How many teams?",
            answer: 9,
            explanation: "36 ÷ 4 = 9 (because 4 × 9 = 36).",
            hint: "Ask: 4 × ? = 36.",
          },
        ],
      },
    ],
  },
  {
    slug: "y3-fractions-intro",
    title: "Fractions of a Whole (Intro)",
    subtitle: "Halves, quarters and eighths — with pictures first.",
    year: 3,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-orange-500 to-orange-600",
    overview:
      "The Year 3 introduction to fractions: equal parts of a whole, and simple fractions of a group.",
    outcomes: [
      "Recognise ½, ⅓, ¼, ⅛ visually",
      "Find simple fractions of a group",
      "Recognise 2/4 and ½ as the same amount",
      "Compare simple unit fractions",
    ],
    learningApproach:
      "Fractions must be seen before they are written. Fold paper, share pizza, count halves — then write the symbol.",
    cognitiveTip:
      "Common mistake: treating unequal parts as fractions. The parts must be equal!",
    lessons: [
      {
        id: "l1",
        title: "Equal parts",
        intro:
          "A fraction only works when the whole is split into equal parts. Otherwise it isn't really a fraction.",
        phase: "concrete",
        blocks: [
          {
            kind: "theory",
            body:
              "**Denominator** = how many equal parts the whole is split into.\n**Numerator** = how many of those parts we take.\n\n¼ means: split into 4 equal parts, take 1.",
          },
          {
            kind: "mcq",
            prompt: "12 apples shared between 3 friends. What fraction does each friend get?",
            choices: ["1/2", "1/3", "1/4", "1/12"],
            answerIndex: 1,
            explanation: "One out of three friends → each gets 1/3.",
            hint: "How many friends are sharing? That's the denominator.",
          },
          {
            kind: "numeric",
            prompt: "Half of 20 is what?",
            answer: 10,
            explanation: "Split 20 into 2 equal parts → 10 each.",
          },
        ],
      },
    ],
  },
  {
    slug: "y3-money",
    title: "Money & Change",
    subtitle: "Australian coins, notes, totals and change.",
    year: 3,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-emerald-500 to-emerald-600",
    overview:
      "Handling money is decimal arithmetic dressed up. Y3 focuses on totals and change, using real Australian denominations.",
    outcomes: [
      "Identify coins and notes ($0.05 to $100)",
      "Add and subtract money amounts",
      "Calculate change from a given amount",
      "Solve simple shopping word problems",
    ],
    learningApproach:
      "Real coins and pretend shopping cement money faster than any worksheet. Encourage 'shopkeeper' role play.",
    cognitiveTip:
      "Common mistake: ignoring decimal place value in money. $7.5 is not $7 and 5c — it's $7 and 50c.",
    lessons: [
      {
        id: "l1",
        title: "Totals and change",
        intro: "Add up prices, then subtract from what you paid to find the change.",
        phase: "applied",
        blocks: [
          {
            kind: "example",
            problem: "$7.50 + $3.20 = ?  Change from $20?",
            steps: [
              "Total: $7.50 + $3.20 = $10.70.",
              "Change: $20.00 − $10.70 = $9.30.",
            ],
            answer: "Total $10.70, change $9.30",
          },
          {
            kind: "numeric",
            prompt:
              "An ice cream costs $4.60. You pay with $10. What is your change, in dollars?",
            answer: 5.4,
            tolerance: 0.01,
            unit: "$",
            explanation: "$10.00 − $4.60 = $5.40.",
            hint: "Subtract the price from what you paid.",
          },
        ],
      },
    ],
  },
  {
    slug: "y3-measurement-basics",
    title: "Measurement Basics",
    subtitle: "Length, mass, capacity and time in Australian units.",
    year: 3,
    strand: "Measurement & Geometry",
    minutes: 20,
    color: "from-sky-500 to-sky-700",
    overview:
      "Introduces the metric units children will use for the rest of school — plus reading time to the minute.",
    outcomes: [
      "Choose sensible units for length, mass and capacity",
      "Convert between mm/cm/m and g/kg (whole-number only)",
      "Read time to the nearest 5 minutes",
      "Calculate simple elapsed time",
    ],
    learningApproach:
      "Estimate first, then measure. Estimation builds a physical sense of size — a superpower for later maths.",
    cognitiveTip:
      "Common mistake: mixing units without converting (e.g. adding 3 m + 40 cm as if they're the same).",
    lessons: [
      {
        id: "l1",
        title: "Units & conversions",
        intro: "Same-sized things get compared with the same unit. Convert first if needed.",
        phase: "abstract",
        blocks: [
          {
            kind: "theory",
            body:
              "**Length:** 1 m = 100 cm. 1 cm = 10 mm. 1 km = 1000 m.\n**Mass:** 1 kg = 1000 g.\n**Capacity:** 1 L = 1000 mL.",
          },
          {
            kind: "numeric",
            prompt: "How many centimetres in 2 metres?",
            answer: 200,
            unit: "cm",
            explanation: "1 m = 100 cm, so 2 m = 200 cm.",
          },
          {
            kind: "mcq",
            prompt: "It is 2:15pm. What time is it 45 minutes later?",
            choices: ["2:45pm", "3:00pm", "3:15pm", "3:30pm"],
            answerIndex: 1,
            explanation: "2:15pm + 45min = 3:00pm.",
            hint: "45 min from :15 = :60 = next hour.",
          },
        ],
      },
    ],
  },
  {
    slug: "y3-shapes-space",
    title: "2D Shapes & 3D Objects",
    subtitle: "Naming shapes by properties, not just by look.",
    year: 3,
    strand: "Measurement & Geometry",
    minutes: 20,
    color: "from-navy-600 to-navy-800",
    overview:
      "Move from identifying shapes visually to describing them by properties — sides, corners, faces.",
    outcomes: [
      "Name common 2D shapes and their properties",
      "Name common 3D objects and their faces/edges/vertices",
      "Recognise symmetry lines",
      "Map 2D nets to 3D objects",
    ],
    learningApproach:
      "Play with paper nets and blocks. Learn the vocabulary alongside the object, not from a book.",
    cognitiveTip:
      "Common mistake: identifying shapes only by appearance. A shape's *properties* are what matter.",
    lessons: [
      {
        id: "l1",
        title: "Properties over pictures",
        intro:
          "A square is not just 'square-shaped'. It has 4 equal sides and 4 right angles. Those are its properties.",
        phase: "concrete",
        blocks: [
          {
            kind: "theory",
            body:
              "**2D examples:** triangle (3 sides), quadrilateral (4 sides), pentagon (5), hexagon (6).\n**3D examples:** cube (6 square faces), sphere (0 flat faces), cylinder (2 circular + 1 curved).",
          },
          {
            kind: "mcq",
            prompt: "How many faces does a cube have?",
            choices: ["4", "6", "8", "12"],
            answerIndex: 1,
            explanation: "A cube has 6 identical square faces (top, bottom, 4 sides).",
            hint: "Count the sides of a die (which is a cube).",
          },
          {
            kind: "numeric",
            prompt:
              "A pentagon has how many sides?",
            answer: 5,
            explanation: "Pentagon = 5 sides (from Greek *penta* = five).",
          },
        ],
      },
    ],
  },
  {
    slug: "y3-patterns",
    title: "Patterns & Rules",
    subtitle: "Find the rule, continue the sequence.",
    year: 3,
    strand: "Number & Algebra",
    minutes: 15,
    color: "from-orange-500 to-orange-600",
    overview:
      "Every pattern has a rule. Finding it is a mini-detective game — and the foundation of early algebra.",
    outcomes: [
      "Identify a rule from the first few terms of a pattern",
      "Continue an arithmetic sequence",
      "Recognise a multiplicative pattern",
      "Describe a rule in words",
    ],
    learningApproach:
      "Look at what CHANGES between terms. Say the rule aloud in plain English before writing it down.",
    cognitiveTip:
      "Common mistake: assuming every pattern uses addition. Check for multiplication or subtraction too.",
    lessons: [
      {
        id: "l1",
        title: "Spot the rule",
        intro:
          "Compare each number to the next. What did someone DO to get from one to the next?",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "Continue the pattern: 4, 7, 10, 13, ?",
            steps: [
              "Difference: 7−4 = 3.",
              "Check next: 10−7 = 3 ✓ ; 13−10 = 3 ✓.",
              "Rule: add 3. Next term: 13 + 3 = 16.",
            ],
            answer: "16",
          },
          {
            kind: "numeric",
            prompt: "What's the next number in: 3, 6, 12, 24, ?",
            answer: 48,
            explanation: "Each term doubles. 24 × 2 = 48.",
            hint: "Try dividing consecutive terms.",
          },
        ],
      },
    ],
  },
  {
    slug: "y3-data-chance",
    title: "Data & Chance",
    subtitle: "Reading picture graphs, describing likelihood in words.",
    year: 3,
    strand: "Statistics & Probability",
    minutes: 15,
    color: "from-sky-500 to-sky-700",
    overview:
      "Y3 statistics is about reading data displays. Y3 chance is about describing likelihood in words.",
    outcomes: [
      "Read information from picture graphs and simple tables",
      "Compare quantities in a graph",
      "Use the language of chance (certain, likely, unlikely, impossible)",
      "Order everyday events by likelihood",
    ],
    learningApproach:
      "Start with real classroom surveys — favourite fruit, birthday months. Graphs about YOUR class stick.",
    cognitiveTip:
      "Common mistake: confusing 'most common' with 'most likely to happen again'. Data describes what already happened.",
    lessons: [
      {
        id: "l1",
        title: "Reading graphs and talking chance",
        intro: "A graph turns numbers into a picture. Chance words describe how likely something is.",
        phase: "concrete",
        blocks: [
          {
            kind: "mcq",
            prompt:
              "8 students chose apples, 5 chose bananas. Which is more common?",
            choices: ["Apples", "Bananas", "Same", "Can't tell"],
            answerIndex: 0,
            explanation: "8 > 5, so apples were chosen more often.",
            hint: "Which number is bigger?",
          },
          {
            kind: "mcq",
            prompt:
              "Which describes the chance the sun will rise tomorrow?",
            choices: ["Impossible", "Unlikely", "Even chance", "Certain"],
            answerIndex: 3,
            explanation: "The sun rising is certain — it always happens.",
            hint: "Does the sun always rise?",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 5 · CURRICULUM EXPANSION
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y5-place-value-big",
    title: "Place Value: Big Numbers",
    subtitle: "Reading, writing and comparing numbers into the millions.",
    year: 5,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-emerald-500 to-emerald-600",
    overview:
      "Y5 extends place value beyond thousands. Comfort with 5- and 6-digit numbers is essential for later multiplication and money problems.",
    outcomes: [
      "Read and write numbers up to 1,000,000",
      "Compare and order large numbers",
      "Partition using expanded form",
      "Round to nearest 10, 100, 1000",
    ],
    learningApproach:
      "Group digits in threes to make reading easy: 1|234|567 = 'one million, two hundred and thirty-four thousand, five hundred and sixty-seven'.",
    cognitiveTip:
      "Common mistake: misreading zeros as missing place values. Every zero holds a place open.",
    lessons: [
      {
        id: "l1",
        title: "Big numbers made easy",
        intro: "Split the digits into groups of three — thousands, then millions.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "Write 45,306 in expanded form.",
            steps: [
              "40,000 (4 in ten-thousands)",
              "5,000 (5 in thousands)",
              "300 (3 in hundreds)",
              "0 tens, 6 ones.",
              "= 40,000 + 5,000 + 300 + 6",
            ],
            answer: "40,000 + 5,000 + 300 + 6",
          },
          {
            kind: "numeric",
            prompt: "Round 46,782 to the nearest 1,000.",
            answer: 47000,
            explanation: "Hundreds digit is 7 (≥5) → round up: 46,782 → 47,000.",
            hint: "Look at the hundreds digit.",
          },
        ],
      },
    ],
  },
  {
    slug: "y5-operations-order",
    title: "Operations & Order (BIDMAS)",
    subtitle: "Do brackets and multiplication BEFORE addition.",
    year: 5,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-sky-500 to-sky-700",
    overview:
      "Order of operations makes maths unambiguous. Multi-step problems only work if everyone agrees on the order.",
    outcomes: [
      "Apply BIDMAS (Brackets, Indices, Divide/Multiply, Add/Subtract)",
      "Solve multi-step arithmetic problems",
      "Recognise when brackets change the answer",
      "Use inverse operations to check",
    ],
    learningApproach:
      "BIDMAS is a rule everyone follows so we all get the same answer. Say the acronym out loud each time.",
    cognitiveTip:
      "Common mistake: working left-to-right without checking for brackets or multiplication first.",
    lessons: [
      {
        id: "l1",
        title: "Order matters",
        intro: "BIDMAS = Brackets → Indices → Divide/Multiply → Add/Subtract.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "Compute 4 × 25 + 10",
            steps: [
              "Multiplication first: 4 × 25 = 100.",
              "Then add: 100 + 10 = 110.",
            ],
            answer: "110",
          },
          {
            kind: "numeric",
            prompt: "Compute (5 + 3) × 4",
            answer: 32,
            explanation: "Brackets first: 5+3 = 8. Then 8 × 4 = 32.",
            hint: "Do what's in the brackets first.",
          },
          {
            kind: "mcq",
            prompt: "Compute 20 − 6 ÷ 2",
            choices: ["7", "12", "13", "17"],
            answerIndex: 3,
            explanation: "Division before subtraction: 6 ÷ 2 = 3. Then 20 − 3 = 17.",
            hint: "Divide before you subtract.",
          },
        ],
      },
    ],
  },
  {
    slug: "y5-measurement-conversion",
    title: "Measurement Conversions",
    subtitle: "Metric conversions and duration calculations.",
    year: 5,
    strand: "Measurement & Geometry",
    minutes: 20,
    color: "from-orange-500 to-orange-600",
    overview:
      "Practical measurement — from converting units cleanly to reading train timetables and calculating duration.",
    outcomes: [
      "Convert between mm/cm/m/km and g/kg",
      "Compute elapsed time across the hour",
      "Read and interpret timetables",
      "Choose sensible units for a task",
    ],
    learningApproach:
      "For unit conversions, ask: 'Is the new unit BIGGER or smaller than the old one?' Then multiply or divide accordingly.",
    cognitiveTip:
      "Common mistake: converting in the wrong direction. Sanity-check: converting to a bigger unit gives a smaller number.",
    lessons: [
      {
        id: "l1",
        title: "Convert with confidence",
        intro: "Same amount, different unit — the number just resizes.",
        phase: "abstract",
        blocks: [
          {
            kind: "numeric",
            prompt: "3 m = ? cm",
            answer: 300,
            unit: "cm",
            explanation: "1 m = 100 cm. 3 × 100 = 300 cm.",
          },
          {
            kind: "numeric",
            prompt: "2,500 g = ? kg (decimal)",
            answer: 2.5,
            tolerance: 0.01,
            unit: "kg",
            explanation: "1 kg = 1,000 g. 2500 ÷ 1000 = 2.5 kg.",
            hint: "Divide by 1000.",
          },
          {
            kind: "mcq",
            prompt:
              "A train leaves at 9:45am and arrives at 11:20am. How long is the trip?",
            choices: ["1 h 25 min", "1 h 35 min", "1 h 45 min", "2 h 25 min"],
            answerIndex: 1,
            explanation:
              "9:45 → 10:45 = 1h. 10:45 → 11:20 = 35 min. Total 1h 35min.",
            hint: "Count hours first, then the extra minutes.",
          },
        ],
      },
    ],
  },
  {
    slug: "y5-angles-shapes",
    title: "Angles & Shape Properties",
    subtitle: "Classifying angles and measuring with a protractor.",
    year: 5,
    strand: "Measurement & Geometry",
    minutes: 20,
    color: "from-navy-600 to-navy-800",
    overview:
      "Angles describe turns. Y5 classifies angles and measures them accurately with a protractor.",
    outcomes: [
      "Classify angles (acute, right, obtuse, straight, reflex)",
      "Measure angles with a protractor to the nearest degree",
      "Recognise angle properties of common shapes",
      "Use appropriate vocabulary",
    ],
    learningApproach:
      "Estimate first, then measure. A right angle is 90° — it becomes an anchor for all other estimates.",
    cognitiveTip:
      "Common mistake: reading the wrong scale on a protractor. Line up the base, then read the scale that starts at 0° on your side.",
    lessons: [
      {
        id: "l1",
        title: "Angle vocabulary",
        intro: "Every angle is either acute (<90°), right (=90°), obtuse (90–180°), straight (=180°) or reflex (>180°).",
        phase: "abstract",
        blocks: [
          {
            kind: "theory",
            body:
              "**Acute** < 90° · **Right** = 90° · **Obtuse** 90°–180° · **Straight** = 180° · **Reflex** > 180°",
          },
          {
            kind: "mcq",
            prompt: "An angle of 135° is called what?",
            choices: ["Acute", "Right", "Obtuse", "Reflex"],
            answerIndex: 2,
            explanation: "Between 90° and 180° is obtuse.",
            hint: "It's bigger than a right angle but smaller than straight.",
          },
        ],
      },
    ],
  },
  {
    slug: "y5-coordinates-transformations",
    title: "Coordinates & Transformations",
    subtitle: "Plotting points and describing translations, reflections & rotations.",
    year: 5,
    strand: "Measurement & Geometry",
    minutes: 20,
    color: "from-sky-500 to-sky-700",
    overview:
      "Coordinates give every point on the plane a unique address. Transformations describe how shapes move.",
    outcomes: [
      "Plot points on a coordinate grid",
      "Describe translations, reflections and rotations",
      "Predict a transformed shape's position",
      "Use (x, y) notation correctly",
    ],
    learningApproach:
      "Say '(x is across, y is up)' every time. That rhythm prevents the classic axis-swap error.",
    cognitiveTip:
      "Common mistake: swapping x and y. Always read across before up.",
    lessons: [
      {
        id: "l1",
        title: "Points & moves",
        intro: "(x, y) means: go x across, then y up.",
        phase: "abstract",
        blocks: [
          {
            kind: "visual",
            name: "coordinate-plane",
            props: { start: [3, 2] },
          },
          {
            kind: "mcq",
            prompt:
              "Point A is at (2, 3). Translate 3 right and 1 down. New coordinates?",
            choices: ["(5, 4)", "(5, 2)", "(3, 5)", "(2, 1)"],
            answerIndex: 1,
            explanation: "x: 2+3=5. y: 3−1=2. New = (5, 2).",
            hint: "Add to x for right, subtract from y for down.",
          },
        ],
      },
    ],
  },
  {
    slug: "y5-patterns-sequences",
    title: "Patterns & Sequences",
    subtitle: "Growing sequences and expressing rules more generally.",
    year: 5,
    strand: "Number & Algebra",
    minutes: 15,
    color: "from-orange-500 to-orange-600",
    overview:
      "Y5 extends pattern-spotting into growing sequences and starts building the language of algebra.",
    outcomes: [
      "Find the rule of a sequence with two operations",
      "Describe growing patterns numerically and visually",
      "Continue a pattern beyond a few terms",
      "Recognise linear vs multiplicative growth",
    ],
    learningApproach:
      "For a rule that fits ALL terms, test it on at least 3 of them — one instance isn't enough.",
    cognitiveTip:
      "Common mistake: finding a rule that only works for the first step. Test on more terms.",
    lessons: [
      {
        id: "l1",
        title: "Finding a general rule",
        intro: "Test the rule against multiple terms — if it fails once, it isn't the right rule.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "Continue: 3, 6, 12, 24, ?",
            steps: [
              "Try × 2: 3×2=6 ✓, 6×2=12 ✓, 12×2=24 ✓.",
              "Rule: multiply by 2. Next: 48.",
            ],
            answer: "48",
          },
          {
            kind: "numeric",
            prompt: "What's the 5th term of: 5, 8, 11, 14, ?",
            answer: 17,
            explanation: "Add 3 each time. 14 + 3 = 17.",
            hint: "Find the difference between consecutive terms.",
          },
        ],
      },
    ],
  },
  {
    slug: "y5-data-probability",
    title: "Data & Probability (Y5)",
    subtitle: "Line and dot plots, chance as a fraction.",
    year: 5,
    strand: "Statistics & Probability",
    minutes: 20,
    color: "from-navy-600 to-navy-800",
    overview:
      "Y5 introduces varied data displays (line, dot, column) and expresses chance numerically as a fraction.",
    outcomes: [
      "Read line, dot and column plots",
      "Choose an appropriate display for a dataset",
      "Express probability as a fraction between 0 and 1",
      "Identify equally-likely outcomes",
    ],
    learningApproach:
      "Every graph tells a story. Ask 'what's the biggest, smallest, and what changed?' as a habit.",
    cognitiveTip:
      "Common mistake: assuming a 'likely' event must happen. Likely means MORE probable, not certain.",
    lessons: [
      {
        id: "l1",
        title: "Fraction probabilities",
        intro: "Probability = favourable outcomes ÷ total equally-likely outcomes.",
        phase: "abstract",
        blocks: [
          {
            kind: "mcq",
            prompt: "You roll a fair 6-sided die. Probability of rolling a 4?",
            choices: ["1/2", "1/3", "1/4", "1/6"],
            answerIndex: 3,
            explanation: "1 favourable outcome (rolling 4) out of 6 equally likely = 1/6.",
            hint: "How many sides? How many are a 4?",
          },
          {
            kind: "numeric",
            prompt:
              "In a bag: 3 red, 2 blue. Probability of drawing red? (Decimal, 2 dp)",
            answer: 0.6,
            tolerance: 0.01,
            explanation: "3 red out of 5 total = 3/5 = 0.6.",
            hint: "Red divided by total.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 7 · CURRICULUM EXPANSION
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y7-integers",
    title: "Integers & Number Properties",
    subtitle: "Positive and negative whole numbers, factors and multiples.",
    year: 7,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-emerald-500 to-emerald-600",
    overview:
      "Y7 introduces negative numbers and the vocabulary of divisibility — factors, multiples, primes.",
    outcomes: [
      "Add and subtract integers",
      "Multiply and divide with sign rules",
      "Find factors and multiples of small numbers",
      "Recognise prime and composite numbers",
    ],
    learningApproach:
      "The number line makes integers visual. For sign rules, say them out loud: 'same signs make positive, different signs make negative'.",
    cognitiveTip:
      "Common mistake: losing track of negative signs. Rewrite subtraction as adding a negative.",
    lessons: [
      {
        id: "l1",
        title: "Working with integers",
        intro: "Below zero is a real place. −3 is less than −1.",
        phase: "abstract",
        blocks: [
          {
            kind: "numeric",
            prompt: "Compute: −3 + 7",
            answer: 4,
            explanation: "Move 7 places right from −3 → 4.",
            hint: "Start at −3, count up 7.",
          },
          {
            kind: "mcq",
            prompt: "Which is a factor of 12?",
            choices: ["5", "7", "8", "6"],
            answerIndex: 3,
            explanation: "12 ÷ 6 = 2 exactly. So 6 is a factor. (5, 7, 8 don't divide evenly.)",
            hint: "A factor divides the number with no remainder.",
          },
          {
            kind: "mcq",
            prompt: "Which number is prime?",
            choices: ["9", "15", "17", "21"],
            answerIndex: 2,
            explanation: "17 has only 1 and itself as factors. 9=3², 15=3×5, 21=3×7.",
            hint: "A prime has exactly TWO factors: 1 and itself.",
          },
        ],
      },
    ],
  },
  {
    slug: "y7-fdp-conversions",
    title: "Fractions ↔ Decimals ↔ Percentages",
    subtitle: "Fluent conversion between the three representations.",
    year: 7,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-sky-500 to-sky-700",
    overview:
      "Fractions, decimals and percentages are three ways to say the same thing. Y7 makes moving between them second nature.",
    outcomes: [
      "Convert any fraction to a decimal and percent",
      "Recognise recurring decimals",
      "Order mixed representations",
      "Calculate a fraction/decimal/% of an amount",
    ],
    learningApproach:
      "Memorise the top common conversions (1/2=0.5=50%, 1/4=0.25=25%, 1/5=0.2=20%). Everything else follows.",
    cognitiveTip:
      "Common mistake: forgetting to divide by 100 when converting % to a decimal for a calculation.",
    lessons: [
      {
        id: "l1",
        title: "Three names, one number",
        intro: "0.35 = 35% = 35/100 = 7/20. All the same amount.",
        phase: "abstract",
        blocks: [
          {
            kind: "numeric",
            prompt: "Convert 3/8 to a decimal (3 dp).",
            answer: 0.375,
            tolerance: 0.001,
            explanation: "3 ÷ 8 = 0.375.",
          },
          {
            kind: "numeric",
            prompt: "20% of 80",
            answer: 16,
            explanation: "20% = 0.2. 0.2 × 80 = 16.",
            hint: "20% is one fifth.",
          },
        ],
      },
    ],
  },
  {
    slug: "y7-indices-squares",
    title: "Indices & Square Numbers",
    subtitle: "Repeated multiplication in shorthand.",
    year: 7,
    strand: "Number & Algebra",
    minutes: 15,
    color: "from-orange-500 to-orange-600",
    overview:
      "Y7 introduces exponent notation — 3² means 3 × 3, not 3 × 2. Foundational for Y9 index laws.",
    outcomes: [
      "Evaluate small powers",
      "Recognise perfect squares to 100",
      "Distinguish 3² from 3 × 2",
      "Find square roots of perfect squares",
    ],
    learningApproach:
      "Say 'three squared means three multiplied by itself'. Say it out loud until it's automatic.",
    cognitiveTip:
      "Common mistake: interpreting 3² as 3 × 2 (=6). It's 3 × 3 = 9.",
    lessons: [
      {
        id: "l1",
        title: "Powers made simple",
        intro: "The small number tells you how many times to multiply.",
        phase: "abstract",
        blocks: [
          {
            kind: "numeric",
            prompt: "Compute 2³",
            answer: 8,
            explanation: "2 × 2 × 2 = 8.",
          },
          {
            kind: "numeric",
            prompt: "√64 (positive root only)",
            answer: 8,
            explanation: "8 × 8 = 64. So √64 = 8.",
            hint: "What number multiplied by itself is 64?",
          },
        ],
      },
    ],
  },
  {
    slug: "y7-algebraic-expressions",
    title: "Algebraic Expressions",
    subtitle: "Variables, like terms and substitution.",
    year: 7,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-emerald-500 to-emerald-600",
    overview:
      "Variables are just letters standing in for numbers. Y7 teaches how to write, simplify and evaluate expressions.",
    outcomes: [
      "Simplify by collecting like terms",
      "Substitute values for variables",
      "Recognise like vs unlike terms",
      "Use standard notation (no × sign between letter and number)",
    ],
    learningApproach:
      "Treat x as 'a box holding a number'. Collect only boxes of the same kind.",
    cognitiveTip:
      "Common mistake: combining unlike terms (x and x²). x² is 'x boxes each holding x' — different from a single x.",
    lessons: [
      {
        id: "l1",
        title: "Collect and substitute",
        intro: "Like terms have the same variable at the same power.",
        phase: "abstract",
        blocks: [
          {
            kind: "mcq",
            prompt: "Simplify 3x + 2x + 4",
            choices: ["9x", "5x + 4", "6x + 4", "5x²"],
            answerIndex: 1,
            explanation: "3x + 2x = 5x. Add the constant 4: 5x + 4.",
            hint: "Combine the terms with x. The 4 stands alone.",
          },
          {
            kind: "numeric",
            prompt: "If x = 4, what is 3x + 2?",
            answer: 14,
            explanation: "3(4) + 2 = 12 + 2 = 14.",
            hint: "Replace x with 4, then compute.",
          },
        ],
      },
    ],
  },
  {
    slug: "y7-sequences",
    title: "Sequences & Rules",
    subtitle: "From term-to-term rule to position-to-term.",
    year: 7,
    strand: "Number & Algebra",
    minutes: 15,
    color: "from-sky-500 to-sky-700",
    overview:
      "Y7 shifts from continuing patterns to describing them algebraically — a bridge to functions.",
    outcomes: [
      "Identify a constant difference sequence",
      "Predict the nth term from a rule",
      "Express a rule algebraically (simple cases)",
      "Distinguish term number from term value",
    ],
    learningApproach:
      "The 'position' is which term you're on (1st, 2nd, 3rd). The 'value' is what number appears there. Don't confuse them!",
    cognitiveTip:
      "Common mistake: confusing the term number (position) with the term value.",
    lessons: [
      {
        id: "l1",
        title: "Position, value, rule",
        intro: "The rule uses the position n to give the value.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "Sequence: 5, 8, 11, 14, ... Find the 10th term.",
            steps: [
              "Rule: 3n + 2 (test: n=1 → 5 ✓)",
              "10th term: 3(10) + 2 = 32.",
            ],
            answer: "32",
          },
          {
            kind: "numeric",
            prompt: "For rule Tₙ = 4n − 1, what's T₆?",
            answer: 23,
            explanation: "4(6) − 1 = 24 − 1 = 23.",
            hint: "Plug 6 in for n.",
          },
        ],
      },
    ],
  },
  {
    slug: "y7-measurement-practical",
    title: "Measurement in Context",
    subtitle: "Perimeter, area, volume and unit choice.",
    year: 7,
    strand: "Measurement & Geometry",
    minutes: 20,
    color: "from-orange-500 to-orange-600",
    overview:
      "Y7 measurement is applied — solving real problems and choosing sensible units for the answer.",
    outcomes: [
      "Calculate perimeter of rectangles and composite shapes",
      "Calculate area of rectangles, triangles, parallelograms",
      "Calculate volume of rectangular prisms",
      "Use appropriate units (cm, cm², cm³)",
    ],
    learningApproach:
      "Always check the unit at the end. Perimeter (cm), area (cm²), volume (cm³) — the number and unit must match the concept.",
    cognitiveTip:
      "Common mistake: using cm instead of cm² for area. If the answer's in the wrong unit, you've solved the wrong thing.",
    lessons: [
      {
        id: "l1",
        title: "Right formula, right unit",
        intro: "Match the formula to what you're finding. Match the unit to the formula.",
        phase: "applied",
        blocks: [
          {
            kind: "example",
            problem: "Rectangle 9 m × 4 m. Perimeter? Area?",
            steps: [
              "Perimeter = 2(L+W) = 2(9+4) = 26 m.",
              "Area = L × W = 9 × 4 = 36 m².",
            ],
            answer: "Perimeter 26 m, Area 36 m²",
          },
          {
            kind: "numeric",
            prompt:
              "Volume of a rectangular prism 5 × 4 × 3 cm (in cm³).",
            answer: 60,
            unit: "cm³",
            explanation: "V = L × W × H = 5 × 4 × 3 = 60 cm³.",
            hint: "Multiply all three dimensions.",
          },
        ],
      },
    ],
  },
  {
    slug: "y7-angles-parallel-lines",
    title: "Angles & Parallel Lines",
    subtitle: "Angle pairs and geometric reasoning.",
    year: 7,
    strand: "Measurement & Geometry",
    minutes: 20,
    color: "from-navy-600 to-navy-800",
    overview:
      "Y7 geometry uses angle relationships to find unknowns without measuring. This is the entry point to formal proof.",
    outcomes: [
      "Recognise vertically opposite, corresponding, alternate, co-interior angles",
      "Apply angle sums (triangle = 180°, quadrilateral = 360°, straight line = 180°)",
      "Find unknown angles with reasoning",
      "Never trust the diagram — trust the numbers",
    ],
    learningApproach:
      "Name the angle relationship before you calculate. Reasoning first, arithmetic second.",
    cognitiveTip:
      "Common mistake: assuming the diagram is drawn to scale. Angles that LOOK equal may not be — use the given values.",
    lessons: [
      {
        id: "l1",
        title: "Angle rules",
        intro: "Every unknown angle has a relationship you can name.",
        phase: "abstract",
        blocks: [
          {
            kind: "theory",
            body:
              "**On a straight line:** angles sum to 180°.\n**Triangle:** angles sum to 180°.\n**Vertically opposite:** equal.\n**Corresponding & alternate** (parallel lines): equal.\n**Co-interior** (parallel lines): sum to 180°.",
          },
          {
            kind: "numeric",
            prompt:
              "Two angles on a straight line. One is 65°. What is the other?",
            answer: 115,
            unit: "°",
            explanation: "180° − 65° = 115°.",
            hint: "They must sum to 180°.",
          },
          {
            kind: "numeric",
            prompt:
              "In a triangle, two angles are 50° and 70°. The third angle?",
            answer: 60,
            unit: "°",
            explanation: "180 − 50 − 70 = 60°.",
            hint: "Triangle angles sum to 180°.",
          },
        ],
      },
    ],
  },
  {
    slug: "y7-coordinates-transformations",
    title: "Cartesian Plane & Transformations",
    subtitle: "All four quadrants and geometric moves.",
    year: 7,
    strand: "Measurement & Geometry",
    minutes: 20,
    color: "from-sky-500 to-sky-700",
    overview:
      "Y7 extends coordinates to negative values and formalises transformations — translations, reflections, rotations.",
    outcomes: [
      "Plot and read points in all 4 quadrants",
      "Reflect points across x- or y-axis",
      "Translate by a vector",
      "Rotate simple shapes 90°/180°",
    ],
    learningApproach:
      "For reflections, one coordinate flips sign; the other stays. Say which axis reflects which.",
    cognitiveTip:
      "Common mistake: reversing x and y. Always: across (x), then up (y).",
    lessons: [
      {
        id: "l1",
        title: "Moves on the plane",
        intro: "Every geometric move can be written as coordinate arithmetic.",
        phase: "abstract",
        blocks: [
          {
            kind: "visual",
            name: "coordinate-plane",
            props: { start: [-2, 3] },
          },
          {
            kind: "mcq",
            prompt: "Reflect (−2, 3) in the y-axis. New point?",
            choices: ["(−2, −3)", "(2, 3)", "(2, −3)", "(−2, 3)"],
            answerIndex: 1,
            explanation: "Reflecting in the y-axis flips the sign of x: (−2, 3) → (2, 3).",
            hint: "Y-axis reflection flips x.",
          },
        ],
      },
    ],
  },
  {
    slug: "y7-statistics",
    title: "Statistics: Centre & Spread",
    subtitle: "Mean, median, mode, range.",
    year: 7,
    strand: "Statistics & Probability",
    minutes: 20,
    color: "from-emerald-500 to-emerald-600",
    overview:
      "Y7 statistics summarises data using measures of centre (mean, median, mode) and spread (range).",
    outcomes: [
      "Compute mean, median, mode, range",
      "Choose the right measure for the story",
      "Recognise the effect of outliers on the mean",
      "Compare two datasets",
    ],
    learningApproach:
      "Mean = average, sensitive to outliers. Median = middle, robust. Mode = most common.",
    cognitiveTip:
      "Common mistake: dividing the total by the wrong number of values when finding the mean.",
    lessons: [
      {
        id: "l1",
        title: "Summarising data",
        intro: "Every measure tells a different story about the same data.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "Data: 2, 4, 5, 9, 10. Find mean, median, range.",
            steps: [
              "Mean: (2+4+5+9+10)/5 = 30/5 = 6.",
              "Median: middle value of sorted list = 5.",
              "Range: max − min = 10 − 2 = 8.",
            ],
            answer: "Mean 6, Median 5, Range 8",
          },
          {
            kind: "numeric",
            prompt: "Mean of 3, 7, 8, 12, 15.",
            answer: 9,
            explanation: "Sum = 45. 45 / 5 = 9.",
            hint: "Add them, divide by the count.",
          },
        ],
      },
    ],
  },
  {
    slug: "y7-probability",
    title: "Probability (Y7)",
    subtitle: "Theoretical, experimental and complementary events.",
    year: 7,
    strand: "Statistics & Probability",
    minutes: 15,
    color: "from-orange-500 to-orange-600",
    overview:
      "Y7 formalises probability as a number between 0 and 1 (or 0–100%).",
    outcomes: [
      "Express probability as a fraction/decimal/percent",
      "Calculate P(A) for equally likely outcomes",
      "Compute complementary events: P(not A) = 1 − P(A)",
      "Distinguish theoretical from experimental",
    ],
    learningApproach:
      "Any probability question: (1) count favourable outcomes, (2) count total outcomes, (3) divide.",
    cognitiveTip:
      "Common mistake: counting outcomes that are NOT equally likely as if they were.",
    lessons: [
      {
        id: "l1",
        title: "Fair chance",
        intro: "Probability = favourable ÷ total, when all outcomes are equally likely.",
        phase: "abstract",
        blocks: [
          {
            kind: "numeric",
            prompt: "P(rolling an even number on a fair die). Decimal (2 dp).",
            answer: 0.5,
            tolerance: 0.01,
            explanation: "Even numbers: 2, 4, 6 (three out of six). 3/6 = 0.5.",
            hint: "How many even? How many total?",
          },
          {
            kind: "numeric",
            prompt: "P(A) = 0.3. Find P(not A) as a decimal.",
            answer: 0.7,
            tolerance: 0.01,
            explanation: "P(not A) = 1 − P(A) = 1 − 0.3 = 0.7.",
            hint: "Complementary events sum to 1.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // YEAR 9 · CURRICULUM EXPANSION
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y9-real-numbers",
    title: "Real Numbers: Rational & Irrational",
    subtitle: "Where numbers sit on the number line.",
    year: 9,
    strand: "Number & Algebra",
    minutes: 15,
    color: "from-emerald-500 to-emerald-600",
    overview:
      "Y9 categorises numbers as rational (fractions/terminating/recurring decimals) or irrational (√2, π).",
    outcomes: [
      "Distinguish rational from irrational",
      "Recognise recurring decimals as rational",
      "Estimate irrational values on a number line",
      "Simplify simple surds",
    ],
    learningApproach:
      "A rational number can be written as a fraction of integers. If it can't, it's irrational.",
    cognitiveTip:
      "Common mistake: assuming every decimal is rational. Only terminating and recurring decimals are.",
    lessons: [
      {
        id: "l1",
        title: "Which is which?",
        intro: "√2, √3, π are irrational. 0.75, 0.333..., 3 are rational.",
        phase: "abstract",
        blocks: [
          {
            kind: "mcq",
            prompt: "Which is irrational?",
            choices: ["0.75", "5/8", "√5", "0.333…"],
            answerIndex: 2,
            explanation: "√5 = 2.236... never repeats and can't be written as a fraction. Irrational.",
            hint: "Which one can NOT be written as a simple fraction?",
          },
        ],
      },
    ],
  },
  {
    slug: "y9-percentages-financial",
    title: "Percentages, Ratios & Rates (Y9)",
    subtitle: "Discounts, mark-ups, GST and best-buy problems.",
    year: 9,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-orange-500 to-orange-600",
    overview:
      "Y9 applies percentages, ratios and rates to real financial problems.",
    outcomes: [
      "Calculate % increase and decrease",
      "Solve GST and discount problems",
      "Compare using unit rates",
      "Reverse-engineer a percentage change",
    ],
    learningApproach:
      "Multiplier method: an increase of 20% multiplies by 1.20. A decrease of 20% multiplies by 0.80.",
    cognitiveTip:
      "Common mistake: subtracting 20 rather than 20% of the original amount.",
    lessons: [
      {
        id: "l1",
        title: "Change by a percentage",
        intro: "Multipliers are faster than adding/subtracting percentages.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "$150 with 20% discount.",
            steps: [
              "Multiplier = 1 − 0.20 = 0.80.",
              "$150 × 0.80 = $120.",
            ],
            answer: "$120",
          },
          {
            kind: "numeric",
            prompt: "Price after 10% GST added to $80.",
            answer: 88,
            unit: "$",
            explanation: "Multiplier 1.10. 80 × 1.10 = 88.",
            hint: "10% GST means multiply by 1.10.",
          },
        ],
      },
    ],
  },
  {
    slug: "y9-algebraic-expressions",
    title: "Algebraic Expressions (Y9)",
    subtitle: "Expand, simplify, factorise.",
    year: 9,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-sky-500 to-sky-700",
    overview:
      "Y9 extends Y7 algebra with expanding brackets, common factors and monic quadratic factorising.",
    outcomes: [
      "Expand brackets using the distributive law",
      "Factorise by common factor",
      "Simplify by collecting like terms",
      "Handle negative signs correctly",
    ],
    learningApproach:
      "Every term inside the bracket must be multiplied — no cheating!",
    cognitiveTip:
      "Common mistake: multiplying only the first term inside brackets. Every term gets multiplied.",
    lessons: [
      {
        id: "l1",
        title: "Expanding cleanly",
        intro: "a(b + c) = ab + ac. Every term inside gets the a.",
        phase: "abstract",
        blocks: [
          {
            kind: "mcq",
            prompt: "Expand 3(x + 4).",
            choices: ["3x + 4", "3x + 7", "3x + 12", "3x + 4x"],
            answerIndex: 2,
            explanation: "3 × x = 3x. 3 × 4 = 12. Answer: 3x + 12.",
            hint: "Multiply the 3 into BOTH terms.",
          },
          {
            kind: "mcq",
            prompt: "Factorise 6x + 12.",
            choices: ["6(x + 2)", "6(x + 12)", "6(x) + 12", "3(x + 4)"],
            answerIndex: 0,
            explanation: "6 is the highest common factor. 6x = 6·x; 12 = 6·2. → 6(x+2).",
            hint: "Find the biggest number that divides both.",
          },
        ],
      },
    ],
  },
  {
    slug: "y9-linear-equations-inequalities",
    title: "Linear Equations & Inequalities",
    subtitle: "Multi-step equations and inequality rules.",
    year: 9,
    strand: "Number & Algebra",
    minutes: 20,
    color: "from-navy-600 to-navy-800",
    overview:
      "Y9 extends solving to equations with variables on both sides and to inequalities (with the negative-flip rule).",
    outcomes: [
      "Solve equations with variables on both sides",
      "Solve linear inequalities",
      "Recognise the negative-flip rule",
      "Represent solutions on a number line",
    ],
    learningApproach:
      "Do the same thing to both sides — that's the ONE rule. Except when multiplying/dividing by a negative in an inequality — then flip.",
    cognitiveTip:
      "Common mistake: forgetting to reverse the inequality when multiplying or dividing by a negative.",
    lessons: [
      {
        id: "l1",
        title: "Both sides, then flip",
        intro: "Collect variables one side, numbers the other. For inequalities, watch the negatives.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "Solve 2x + 5 = 17.",
            steps: [
              "Subtract 5: 2x = 12.",
              "Divide by 2: x = 6.",
            ],
            answer: "x = 6",
          },
          {
            kind: "numeric",
            prompt: "Solve 5x − 3 = 2x + 12. Enter x.",
            answer: 5,
            explanation: "3x − 3 = 12 → 3x = 15 → x = 5.",
            hint: "Collect variables one side, numbers the other.",
          },
          {
            kind: "mcq",
            prompt: "Solve −2x > 6.",
            choices: ["x > 3", "x < 3", "x > −3", "x < −3"],
            answerIndex: 3,
            explanation: "Divide by −2 AND flip: x < −3.",
            hint: "Dividing by negative flips the inequality.",
          },
        ],
      },
    ],
  },
  {
    slug: "y9-sequences-relationships",
    title: "Sequences as Functions",
    subtitle: "Express sequences algebraically as Tₙ.",
    year: 9,
    strand: "Number & Algebra",
    minutes: 15,
    color: "from-sky-500 to-sky-700",
    overview:
      "Y9 formalises sequences as functions of position, Tₙ = an + b for arithmetic sequences.",
    outcomes: [
      "Find the general term of an arithmetic sequence",
      "Predict any term without listing intermediate ones",
      "Distinguish arithmetic from geometric",
      "Express a rule using n notation",
    ],
    learningApproach:
      "For arithmetic sequences: Tₙ = a + (n−1)d, where a is the first term and d is the common difference.",
    cognitiveTip:
      "Common mistake: finding a numerical pattern without stating the general rule.",
    lessons: [
      {
        id: "l1",
        title: "The nth term rule",
        intro: "You can compute any term directly if you know the rule.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "Sequence 4, 7, 10, 13, ... Find Tₙ.",
            steps: [
              "First term a = 4. Common difference d = 3.",
              "Tₙ = a + (n−1)d = 4 + 3(n−1) = 3n + 1.",
              "Check: n=1 → 4 ✓, n=2 → 7 ✓.",
            ],
            answer: "Tₙ = 3n + 1",
          },
          {
            kind: "numeric",
            prompt: "For Tₙ = 3n + 1, find T₂₀.",
            answer: 61,
            explanation: "3(20) + 1 = 61.",
            hint: "Plug in n = 20.",
          },
        ],
      },
    ],
  },
  {
    slug: "y9-measurement-scale",
    title: "Measurement, Surface Area & Scale",
    subtitle: "Volume, surface area and scaled drawings.",
    year: 9,
    strand: "Measurement & Geometry",
    minutes: 20,
    color: "from-orange-500 to-orange-600",
    overview:
      "Y9 extends measurement to surface area, composite volumes and scale problems.",
    outcomes: [
      "Calculate surface area of prisms",
      "Calculate volume of prisms",
      "Use scale factors on maps and models",
      "Distinguish surface area from volume",
    ],
    learningApproach:
      "Surface area = the wrapping paper. Volume = what fits inside. Very different measurements.",
    cognitiveTip:
      "Common mistake: confusing surface area with volume. Different units (cm² vs cm³) — that's your cue.",
    lessons: [
      {
        id: "l1",
        title: "Wrap vs fill",
        intro: "Surface area sums all faces. Volume is width × depth × height.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "Cube of side 4 cm. Volume? Surface area?",
            steps: [
              "V = 4 × 4 × 4 = 64 cm³.",
              "One face = 16 cm². 6 faces → SA = 96 cm².",
            ],
            answer: "V = 64 cm³, SA = 96 cm²",
          },
          {
            kind: "numeric",
            prompt: "Volume of a rectangular prism 8 × 5 × 4 cm.",
            answer: 160,
            unit: "cm³",
            explanation: "8 × 5 × 4 = 160 cm³.",
          },
        ],
      },
    ],
  },
  {
    slug: "y9-coordinates-transformations",
    title: "Coordinate Geometry (Y9)",
    subtitle: "Gradient, midpoint and distance formulas.",
    year: 9,
    strand: "Measurement & Geometry",
    minutes: 20,
    color: "from-navy-600 to-navy-800",
    overview:
      "Y9 moves coordinates into formal geometry — gradient (slope), midpoint, distance between points.",
    outcomes: [
      "Calculate gradient between two points",
      "Find midpoint of a segment",
      "Find distance between two points",
      "Interpret gradient as rate of change",
    ],
    learningApproach:
      "Gradient = rise ÷ run. Midpoint = average of x's, average of y's. Distance = Pythagoras applied.",
    cognitiveTip:
      "Common mistake: subtracting coordinates in the wrong order — be consistent (always A minus B).",
    lessons: [
      {
        id: "l1",
        title: "Gradient, midpoint, distance",
        intro: "Three formulas, all built from x/y differences.",
        phase: "abstract",
        blocks: [
          {
            kind: "theory",
            body:
              "**Gradient** m = (y₂ − y₁) / (x₂ − x₁)\n**Midpoint** M = ((x₁+x₂)/2, (y₁+y₂)/2)\n**Distance** d = √((x₂−x₁)² + (y₂−y₁)²)",
          },
          {
            kind: "numeric",
            prompt: "Gradient from (1, 2) to (5, 10).",
            answer: 2,
            explanation: "(10−2)/(5−1) = 8/4 = 2.",
            hint: "Rise over run.",
          },
          {
            kind: "mcq",
            prompt: "Midpoint of (2, 4) and (8, 10)?",
            choices: ["(5, 7)", "(6, 6)", "(10, 14)", "(4, 8)"],
            answerIndex: 0,
            explanation: "Averages: (2+8)/2=5, (4+10)/2=7.",
            hint: "Average the x's and average the y's.",
          },
        ],
      },
    ],
  },
  {
    slug: "y9-statistics-spread",
    title: "Statistics: Comparing Distributions",
    subtitle: "Quartiles, IQR and box plots.",
    year: 9,
    strand: "Statistics & Probability",
    minutes: 20,
    color: "from-emerald-500 to-emerald-600",
    overview:
      "Y9 goes deeper than mean and median — quartiles, IQR and box plots let you compare distributions properly.",
    outcomes: [
      "Compute Q1, Q3, IQR",
      "Interpret a box plot",
      "Compare two datasets meaningfully",
      "Recognise skewness",
    ],
    learningApproach:
      "IQR (Q3 − Q1) shows the spread of the middle 50%. It's robust — outliers don't distort it like they do the range.",
    cognitiveTip:
      "Common mistake: assuming a bigger mean means bigger spread. Spread and centre are different.",
    lessons: [
      {
        id: "l1",
        title: "Quartiles & spread",
        intro: "Quartiles divide sorted data into four equal parts.",
        phase: "abstract",
        blocks: [
          {
            kind: "example",
            problem: "Data: 2, 4, 5, 7, 9, 12, 15. Find IQR.",
            steps: [
              "Q1 = median of lower half (2, 4, 5) = 4.",
              "Q3 = median of upper half (9, 12, 15) = 12.",
              "IQR = Q3 − Q1 = 12 − 4 = 8.",
            ],
            answer: "8",
          },
          {
            kind: "numeric",
            prompt:
              "In a dataset Q1=6 and Q3=14. What is the IQR?",
            answer: 8,
            explanation: "IQR = Q3 − Q1 = 14 − 6 = 8.",
          },
        ],
      },
    ],
  },
  {
    slug: "y9-probability-complex",
    title: "Probability: Two-Way Tables & Complements",
    subtitle: "Multi-step chance and conditional reasoning.",
    year: 9,
    strand: "Statistics & Probability",
    minutes: 20,
    color: "from-fuchsia-500 to-fuchsia-700",
    overview:
      "Y9 handles more complex probability: two-way tables, complementary events and independent events.",
    outcomes: [
      "Compute P(A) and P(not A)",
      "Multiply for independent events",
      "Read two-way tables",
      "Use Venn diagrams",
    ],
    learningApproach:
      "'AND' events (both happen) — multiply. 'OR' events (either happens) — add (minus overlap).",
    cognitiveTip:
      "Common mistake: adding probabilities of independent events that should be multiplied.",
    lessons: [
      {
        id: "l1",
        title: "Combined events",
        intro: "For independent events A and B: P(A and B) = P(A) × P(B).",
        phase: "abstract",
        blocks: [
          {
            kind: "numeric",
            prompt:
              "P(rolling a 6 on a fair die twice in a row). Fraction as decimal to 4 dp.",
            answer: 0.0278,
            tolerance: 0.001,
            explanation: "P(6) = 1/6. P(6 AND 6) = 1/6 × 1/6 = 1/36 ≈ 0.0278.",
            hint: "Independent events — multiply.",
          },
          {
            kind: "numeric",
            prompt:
              "In a class, P(likes maths) = 0.4. Find P(does NOT like maths).",
            answer: 0.6,
            tolerance: 0.01,
            explanation: "P(not A) = 1 − 0.4 = 0.6.",
          },
        ],
      },
    ],
  },
  {
    slug: "y9-mathematical-reasoning",
    title: "Mathematical Reasoning",
    subtitle: "Estimate, calculate, check — the meta-skill.",
    year: 9,
    strand: "Number & Algebra",
    minutes: 15,
    color: "from-navy-700 to-navy-900",
    overview:
      "The most important Y9 module: how to APPROACH a problem you've never seen. Estimate first, calculate carefully, then sanity-check.",
    outcomes: [
      "Estimate before calculating",
      "Choose a strategy from a mental toolkit",
      "Check answer against the estimate",
      "Recognise unreasonable answers",
    ],
    learningApproach:
      "Every problem: (1) estimate the size of the answer, (2) solve exactly, (3) compare. If they disagree, something's wrong.",
    cognitiveTip:
      "Common mistake: accepting the calculator answer without checking. Always ask 'does this make sense?'",
    lessons: [
      {
        id: "l1",
        title: "Estimate, solve, check",
        intro: "A 3-step habit that prevents most careless errors.",
        phase: "applied",
        blocks: [
          {
            kind: "theory",
            body:
              "**Step 1 — Estimate:** round numbers to something friendly.\n**Step 2 — Solve:** compute exactly.\n**Step 3 — Check:** does the exact answer match the estimate? Are the units right?",
          },
          {
            kind: "example",
            problem: "Estimate then compute 397 × 21.",
            steps: [
              "Estimate: 400 × 20 = 8,000.",
              "Exact: 397 × 21 = 8,337.",
              "Check: 8,337 ≈ 8,000 ✓ — answer is reasonable.",
            ],
            answer: "8,337 (estimate: ~8,000)",
          },
          {
            kind: "mcq",
            prompt:
              "A calculator shows 476.19 as the area of a rectangle 10.5 m × 4.3 m. Reasonable?",
            choices: [
              "Yes, that's correct",
              "No — it should be around 45",
              "No — units are wrong",
              "No — the numbers look reversed",
            ],
            answerIndex: 1,
            explanation:
              "Estimate: 10 × 4 = 40 m². Exact: 10.5 × 4.3 = 45.15 m². The calculator answer (476) is 10× too big — likely someone typed an extra zero.",
            hint: "Estimate the answer with rounded numbers first.",
          },
        ],
      },
    ],
  },
];

export function getModule(slug: string) {
  return MODULES.find((m) => m.slug === slug);
}

export function modulesByYear() {
  return MODULES.reduce<Record<Year, Module[]>>(
    (acc, m) => {
      acc[m.year] = acc[m.year] ? [...acc[m.year], m] : [m];
      return acc;
    },
    { 3: [], 5: [], 7: [], 9: [] } as Record<Year, Module[]>
  );
}

export function modulesByPathway() {
  const out: Record<Pathway, Module[]> = { 3: [], 5: [], 7: [], 9: [], Advanced: [] };
  for (const m of MODULES) {
    const key: Pathway = m.pathway ?? m.year;
    out[key].push(m);
  }
  return out;
}

export const PHASE_META: Record<Phase, { label: string; tone: string; body: string }> = {
  concrete: {
    label: "Concrete",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    body: "See it and touch it. Physical or visual manipulation before symbols.",
  },
  pictorial: {
    label: "Pictorial",
    tone: "bg-sky-50 text-sky-700 ring-sky-200",
    body: "Diagrams and models — the bridge between hands-on and symbolic.",
  },
  abstract: {
    label: "Abstract",
    tone: "bg-orange-50 text-orange-700 ring-orange-200",
    body: "Pure symbolic reasoning — numbers, letters, formulas.",
  },
  applied: {
    label: "Applied",
    tone: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
    body: "Real-world problems in NAPLAN style.",
  },
};
