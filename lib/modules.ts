export type Year = 3 | 5 | 7 | 9;

export type Choice = { text: string; correct?: boolean };

export type Block =
  | { kind: "theory"; title?: string; body: string }
  | { kind: "tip"; body: string }
  | { kind: "example"; problem: string; steps: string[]; answer: string }
  | {
      kind: "mcq";
      prompt: string;
      choices: string[];
      answerIndex: number;
      explanation: string;
      hint?: string;
    }
  | {
      kind: "numeric";
      prompt: string;
      answer: number;
      unit?: string;
      tolerance?: number;
      explanation: string;
      hint?: string;
    }
  | { kind: "visual"; name: "fraction-bar" | "equation-balance" | "pythagoras" | "times-table"; props?: Record<string, unknown> };

export type Lesson = {
  id: string;
  title: string;
  intro: string;
  blocks: Block[];
};

export type Module = {
  slug: string;
  title: string;
  subtitle: string;
  year: Year;
  strand: "Number & Algebra" | "Measurement & Geometry" | "Statistics & Probability";
  minutes: number;
  color: string;
  overview: string;
  outcomes: string[];
  lessons: Lesson[];
};

export const MODULES: Module[] = [
  // ─────────────────────────────────────────────────────────────
  // YEAR 3 · TIMES TABLES MASTERY
  // ─────────────────────────────────────────────────────────────
  {
    slug: "y3-times-tables-mastery",
    title: "Times Tables Mastery",
    subtitle: "Build fast, confident recall of the 2×–10× times tables.",
    year: 3,
    strand: "Number & Algebra",
    minutes: 35,
    color: "from-sky-500 to-sky-700",
    overview:
      "Multiplication is repeated addition — once your child sees the patterns, the tables click. This module uses arrays, skip counting and quick-recall practice to build automaticity for Year 3 NAPLAN.",
    outcomes: [
      "Understand multiplication as equal groups",
      "Recognise patterns in the 2, 5 and 10 times tables",
      "Recall multiplication facts to 10×10 with 90%+ accuracy",
      "Apply times tables to simple word problems",
    ],
    lessons: [
      {
        id: "l1",
        title: "Multiplication = equal groups",
        intro: "Before we memorise anything, let's build the picture of what multiplication really means.",
        blocks: [
          {
            kind: "theory",
            title: "Equal groups",
            body:
              "When we multiply, we count equal groups of the same size. **4 × 3** means \"4 groups of 3\". We could add: 3 + 3 + 3 + 3 = 12. Or use an array: 4 rows of 3 dots = 12 dots.",
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
            hint: "Add 4 six times, or use skip counting: 4, 8, 12, 16, 20, 24.",
          },
          {
            kind: "numeric",
            prompt: "A box holds 8 crayons. How many crayons are in 3 boxes?",
            answer: 24,
            unit: "crayons",
            explanation: "3 groups of 8 → 3 × 8 = 24.",
            hint: "Try skip counting by 8: 8, 16, 24.",
          },
        ],
      },
      {
        id: "l2",
        title: "The 2×, 5× and 10× patterns",
        intro: "The easiest times tables are the ones with a pattern you can hear.",
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
            hint: "Multiply the number of nights by pages per night.",
          },
          {
            kind: "numeric",
            prompt: "A pack of stickers has 8 stickers. How many stickers are in 6 packs?",
            answer: 48,
            explanation: "6 × 8 = 48. Break it down: 5 × 8 = 40, then add one more 8 → 48.",
          },
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
    lessons: [
      {
        id: "l1",
        title: "What is a fraction, really?",
        intro:
          "A fraction is not a strange new number — it's just a way of splitting a whole into equal parts.",
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
            hint: "Start with the whole (8/8) and subtract what was eaten.",
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
    lessons: [
      {
        id: "l1",
        title: "What is an equation?",
        intro:
          "An equation is a mathematical sentence with a = sign. Whatever is on the left equals whatever is on the right — always.",
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
    lessons: [
      {
        id: "l1",
        title: "The theorem: a² + b² = c²",
        intro:
          "For any right-angled triangle, the two shorter sides squared, added together, equal the longest side squared.",
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
            hint: "Square each leg, add them, then take the square root.",
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
