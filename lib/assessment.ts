export type AssessmentYear = 3 | 5 | 7 | 9;
export type Strand = "Number & Algebra" | "Measurement & Geometry" | "Statistics & Probability";
export type Difficulty = "easy" | "medium" | "hard";

export type QuestionVisual =
  | { name: "multiplication-array"; props: { rows: number; cols: number; theme?: "apples" | "stars" | "hearts" | "cookies" } }
  | { name: "fraction-bar"; props: { num: number; den: number } }
  | { name: "place-value-blocks"; props: { n: number } }
  | { name: "pythagoras"; props: { a: number; b: number } };

export type Question =
  | {
      id: string;
      kind: "mcq";
      strand: Strand;
      difficulty: Difficulty;
      prompt: string;
      choices: string[];
      answerIndex: number;
      explanation: string;
      visual?: QuestionVisual;
    }
  | {
      id: string;
      kind: "numeric";
      strand: Strand;
      difficulty: Difficulty;
      prompt: string;
      answer: number;
      unit?: string;
      tolerance?: number;
      explanation: string;
      visual?: QuestionVisual;
    }
  | {
      id: string;
      kind: "multiselect";
      strand: Strand;
      difficulty: Difficulty;
      prompt: string;
      options: string[];
      correct: number[];       // indexes
      explanation: string;
    }
  | {
      id: string;
      kind: "fill-fraction";
      strand: Strand;
      difficulty: Difficulty;
      prompt: string;
      denominator: number;
      correctNumerator: number;
      explanation: string;
    };

// ─── Question banks by year ─────────────────────────────────────────

const Y3: Question[] = [
  { id: "y3-01", kind: "mcq", strand: "Number & Algebra", difficulty: "easy",
    prompt: "What is the value of the digit 4 in 342?",
    choices: ["4", "40", "400", "34"], answerIndex: 1,
    explanation: "The 4 is in the tens place → 4 × 10 = 40.",
    visual: { name: "place-value-blocks", props: { n: 342 } } },
  { id: "y3-02", kind: "numeric", strand: "Number & Algebra", difficulty: "easy",
    prompt: "A box holds 8 crayons. How many crayons in 3 boxes?",
    answer: 24, unit: "crayons",
    explanation: "3 rows × 8 = 24.",
    visual: { name: "multiplication-array", props: { rows: 3, cols: 8, theme: "cookies" } } },
  { id: "y3-03", kind: "fill-fraction", strand: "Number & Algebra", difficulty: "medium",
    prompt: "Shade one half of the bar.",
    denominator: 2, correctNumerator: 1,
    explanation: "One half = 1 out of 2 equal parts." },
  { id: "y3-04", kind: "mcq", strand: "Number & Algebra", difficulty: "easy",
    prompt: "Which is bigger: 428 or 471?",
    choices: ["428", "471", "They are equal", "Cannot tell"], answerIndex: 1,
    explanation: "Hundreds tie (4 = 4). Tens: 2 vs 7 — 7 is bigger, so 471 wins." },
  { id: "y3-05", kind: "numeric", strand: "Number & Algebra", difficulty: "medium",
    prompt: "45 + 27 = ?",
    answer: 72,
    explanation: "40+20 = 60, then 5+7 = 12. Total 72." },
  { id: "y3-06", kind: "multiselect", strand: "Number & Algebra", difficulty: "medium",
    prompt: "Which of these numbers are EVEN? (Tap all that apply.)",
    options: ["7", "12", "23", "48", "31", "60"], correct: [1, 3, 5],
    explanation: "Even numbers end in 0, 2, 4, 6 or 8. So 12, 48 and 60." },
  { id: "y3-07", kind: "mcq", strand: "Measurement & Geometry", difficulty: "easy",
    prompt: "A movie starts at 3:30pm and ends at 5:00pm. How long is it?",
    choices: ["1 hour", "1 hour 30 min", "2 hours", "30 min"], answerIndex: 1,
    explanation: "3:30 → 4:30 = 1 hour. 4:30 → 5:00 = 30 min. Total 1h 30." },
  { id: "y3-08", kind: "numeric", strand: "Measurement & Geometry", difficulty: "medium",
    prompt: "A square has sides of 9 cm. What is its perimeter in cm?",
    answer: 36, unit: "cm",
    explanation: "4 equal sides: 9 × 4 = 36 cm." },
  { id: "y3-09", kind: "mcq", strand: "Measurement & Geometry", difficulty: "easy",
    prompt: "Which shape has EXACTLY 3 sides?",
    choices: ["Square", "Triangle", "Pentagon", "Hexagon"], answerIndex: 1,
    explanation: "A triangle has 3 sides." },
  { id: "y3-10", kind: "mcq", strand: "Statistics & Probability", difficulty: "easy",
    prompt: "How likely is it that the sun rises tomorrow morning?",
    choices: ["Impossible", "Unlikely", "Likely", "Certain"], answerIndex: 3,
    explanation: "The sun rises every day — certain." },
  { id: "y3-11", kind: "numeric", strand: "Number & Algebra", difficulty: "easy",
    prompt: "7 × 6 = ?", answer: 42,
    explanation: "7 groups of 6 = 42. (Or 6 groups of 7.)" },
  { id: "y3-12", kind: "fill-fraction", strand: "Number & Algebra", difficulty: "medium",
    prompt: "Shade three quarters of the bar.",
    denominator: 4, correctNumerator: 3,
    explanation: "Three quarters = 3 out of 4 equal parts." },
];

const Y5: Question[] = [
  { id: "y5-01", kind: "fill-fraction", strand: "Number & Algebra", difficulty: "easy",
    prompt: "Shade five eighths of the bar.",
    denominator: 8, correctNumerator: 5,
    explanation: "Five eighths = 5 out of 8 equal parts." },
  { id: "y5-02", kind: "mcq", strand: "Number & Algebra", difficulty: "medium",
    prompt: "Which fraction is equivalent to 3/4?",
    choices: ["6/8", "4/5", "5/6", "9/16"], answerIndex: 0,
    explanation: "Multiply top and bottom of 3/4 by 2 → 6/8.",
    visual: { name: "fraction-bar", props: { num: 3, den: 4 } } },
  { id: "y5-03", kind: "numeric", strand: "Number & Algebra", difficulty: "medium",
    prompt: "What is 25% of 80?", answer: 20,
    explanation: "25% = 1/4. One quarter of 80 = 20." },
  { id: "y5-04", kind: "numeric", strand: "Number & Algebra", difficulty: "medium",
    prompt: "0.7 + 0.35 = ? (decimal)", answer: 1.05, tolerance: 0.01,
    explanation: "Line up decimals: 0.70 + 0.35 = 1.05." },
  { id: "y5-05", kind: "mcq", strand: "Number & Algebra", difficulty: "medium",
    prompt: "A recipe uses 3/4 cup of sugar. Mia is making 2 times the recipe. How much sugar total?",
    choices: ["1 cup", "1 1/2 cups", "2 cups", "3/8 cup"], answerIndex: 1,
    explanation: "3/4 × 2 = 6/4 = 1 1/2 cups." },
  { id: "y5-06", kind: "multiselect", strand: "Number & Algebra", difficulty: "hard",
    prompt: "Which of these are equivalent to 1/2? (Tap all that apply.)",
    options: ["2/4", "3/6", "3/5", "4/8", "5/9"], correct: [0, 1, 3],
    explanation: "2/4, 3/6 and 4/8 all simplify to 1/2. 3/5 and 5/9 do not." },
  { id: "y5-07", kind: "numeric", strand: "Measurement & Geometry", difficulty: "medium",
    prompt: "A rectangle is 6 m long and 4 m wide. What is its area in m²?",
    answer: 24, unit: "m²",
    explanation: "Area = length × width = 6 × 4 = 24 m²." },
  { id: "y5-08", kind: "numeric", strand: "Measurement & Geometry", difficulty: "hard",
    prompt: "An L-shape is made of a 10 × 4 m rectangle plus a 5 × 3 m rectangle. Total area in m²?",
    answer: 55, unit: "m²",
    explanation: "10×4 = 40. 5×3 = 15. Total 55 m²." },
  { id: "y5-09", kind: "mcq", strand: "Measurement & Geometry", difficulty: "medium",
    prompt: "What is 45 minutes AFTER 2:20pm?",
    choices: ["2:65pm", "3:05pm", "3:00pm", "3:15pm"], answerIndex: 1,
    explanation: "2:20 + 40 min = 3:00, +5 more min = 3:05pm." },
  { id: "y5-10", kind: "numeric", strand: "Statistics & Probability", difficulty: "medium",
    prompt: "In a class of 20 students, 8 have blue eyes. What FRACTION have blue eyes? Enter as a decimal.",
    answer: 0.4, tolerance: 0.01,
    explanation: "8/20 = 2/5 = 0.4 (or 40%)." },
  { id: "y5-11", kind: "mcq", strand: "Statistics & Probability", difficulty: "medium",
    prompt: "The numbers 4, 7, 7, 8, 9 — what is the mode?",
    choices: ["4", "7", "8", "9"], answerIndex: 1,
    explanation: "The mode is the most-common number. 7 appears twice; nothing else does." },
  { id: "y5-12", kind: "numeric", strand: "Number & Algebra", difficulty: "hard",
    prompt: "72 ÷ 8 = ?", answer: 9,
    explanation: "8 × 9 = 72, so 72 ÷ 8 = 9." },
];

const Y7: Question[] = [
  { id: "y7-01", kind: "numeric", strand: "Number & Algebra", difficulty: "medium",
    prompt: "Solve for x:  5x + 2 = 32", answer: 6,
    explanation: "Subtract 2: 5x = 30. Divide by 5: x = 6." },
  { id: "y7-02", kind: "numeric", strand: "Number & Algebra", difficulty: "medium",
    prompt: "What is (-3) × (-4)?", answer: 12,
    explanation: "Two negatives multiply to a positive: 3 × 4 = 12." },
  { id: "y7-03", kind: "mcq", strand: "Number & Algebra", difficulty: "medium",
    prompt: "Simplify the ratio 24 : 36.",
    choices: ["3 : 4", "2 : 3", "4 : 5", "6 : 9"], answerIndex: 1,
    explanation: "Divide both by 12: 2 : 3." },
  { id: "y7-04", kind: "numeric", strand: "Number & Algebra", difficulty: "medium",
    prompt: "5 apples cost $10. How much do 8 apples cost, in dollars?",
    answer: 16, unit: "$",
    explanation: "1 apple = $2. 8 × $2 = $16." },
  { id: "y7-05", kind: "mcq", strand: "Number & Algebra", difficulty: "medium",
    prompt: "A $120 pair of shoes is 25% off. What is the sale price?",
    choices: ["$90", "$95", "$100", "$105"], answerIndex: 0,
    explanation: "25% of 120 = 30. 120 − 30 = $90." },
  { id: "y7-06", kind: "multiselect", strand: "Number & Algebra", difficulty: "hard",
    prompt: "Which of these expressions equal 24? (Tap all that apply.)",
    options: ["2 × 3 × 4", "5 + 3 × 6", "48 ÷ 2", "3² + 15", "50 − 26"], correct: [0, 2, 3, 4],
    explanation: "2×3×4=24; 5+18=23 ✗; 48÷2=24; 9+15=24; 50-26=24." },
  { id: "y7-07", kind: "numeric", strand: "Measurement & Geometry", difficulty: "medium",
    prompt: "Angles on a straight line sum to 180°. If one angle is 65°, what is the other in degrees?",
    answer: 115, unit: "°",
    explanation: "180 − 65 = 115°." },
  { id: "y7-08", kind: "numeric", strand: "Measurement & Geometry", difficulty: "hard",
    prompt: "Area of a triangle with base 12 cm and height 5 cm, in cm²?",
    answer: 30, unit: "cm²",
    explanation: "A = ½ × base × height = ½ × 12 × 5 = 30 cm²." },
  { id: "y7-09", kind: "mcq", strand: "Measurement & Geometry", difficulty: "hard",
    prompt: "Which are corresponding angles on parallel lines cut by a transversal?",
    choices: ["Same size", "Sum to 180°", "Sum to 90°", "Always different"], answerIndex: 0,
    explanation: "Corresponding angles are equal." },
  { id: "y7-10", kind: "numeric", strand: "Statistics & Probability", difficulty: "medium",
    prompt: "The mean of 6, 8, 10, 12, 14 is what?",
    answer: 10,
    explanation: "Sum = 50. 50 ÷ 5 = 10." },
  { id: "y7-11", kind: "mcq", strand: "Statistics & Probability", difficulty: "medium",
    prompt: "You roll a fair six-sided die. Probability of getting an even number?",
    choices: ["1/6", "1/3", "1/2", "2/3"], answerIndex: 2,
    explanation: "3 even faces (2, 4, 6) out of 6 = 3/6 = 1/2." },
  { id: "y7-12", kind: "numeric", strand: "Number & Algebra", difficulty: "easy",
    prompt: "Evaluate: 3 × (7 − 2) + 4²", answer: 31,
    explanation: "3×5 + 16 = 15 + 16 = 31 (BIDMAS: brackets, indices, then ×, +)." },
];

const Y9: Question[] = [
  { id: "y9-01", kind: "numeric", strand: "Measurement & Geometry", difficulty: "medium",
    prompt: "Right triangle with legs 5 and 12. Hypotenuse in units?",
    answer: 13,
    explanation: "5² + 12² = 25 + 144 = 169. √169 = 13.",
    visual: { name: "pythagoras", props: { a: 5, b: 12 } } },
  { id: "y9-02", kind: "numeric", strand: "Number & Algebra", difficulty: "medium",
    prompt: "Simplify: 2⁵ × 2³. Enter the exponent only.", answer: 8,
    explanation: "Same base, add exponents: 5+3 = 8. So 2⁸." },
  { id: "y9-03", kind: "mcq", strand: "Number & Algebra", difficulty: "medium",
    prompt: "What is 3⁻²?",
    choices: ["9", "6", "1/6", "1/9"], answerIndex: 3,
    explanation: "3⁻² = 1/3² = 1/9." },
  { id: "y9-04", kind: "numeric", strand: "Number & Algebra", difficulty: "hard",
    prompt: "Solve for x:  2(x + 3) = 4x − 4", answer: 5,
    explanation: "2x + 6 = 4x − 4 → 10 = 2x → x = 5." },
  { id: "y9-05", kind: "mcq", strand: "Number & Algebra", difficulty: "hard",
    prompt: "Expand (x + 2)(x + 3).",
    choices: ["x² + 5x + 6", "x² + 6x + 5", "x² + 5x + 5", "x² + 6"], answerIndex: 0,
    explanation: "FOIL: x² + 3x + 2x + 6 = x² + 5x + 6." },
  { id: "y9-06", kind: "multiselect", strand: "Number & Algebra", difficulty: "hard",
    prompt: "Which of these represent a linear function? (Tap all that apply.)",
    options: ["y = 2x + 3", "y = x²", "y = -x + 5", "y = 1/x", "y = 4x"],
    correct: [0, 2, 4],
    explanation: "Linear = highest power of x is 1. x² is quadratic; 1/x is reciprocal." },
  { id: "y9-07", kind: "numeric", strand: "Measurement & Geometry", difficulty: "hard",
    prompt: "sin 30° × 20 = ? (integer)", answer: 10,
    explanation: "sin 30° = 0.5. 0.5 × 20 = 10." },
  { id: "y9-08", kind: "numeric", strand: "Measurement & Geometry", difficulty: "medium",
    prompt: "Volume of a rectangular prism 3 × 4 × 5 m in m³?", answer: 60, unit: "m³",
    explanation: "V = l × w × h = 3 × 4 × 5 = 60 m³." },
  { id: "y9-09", kind: "mcq", strand: "Statistics & Probability", difficulty: "medium",
    prompt: "Two coins are tossed. P(both heads)?",
    choices: ["1/2", "1/3", "1/4", "1/8"], answerIndex: 2,
    explanation: "Independent: 1/2 × 1/2 = 1/4." },
  { id: "y9-10", kind: "numeric", strand: "Statistics & Probability", difficulty: "hard",
    prompt: "For 3, 7, 8, 8, 10, 14 — what is the median?",
    answer: 8,
    explanation: "Middle values are the 3rd and 4th (both 8). Median = 8." },
  { id: "y9-11", kind: "numeric", strand: "Number & Algebra", difficulty: "medium",
    prompt: "Write 45,000 in scientific notation — enter the exponent of 10 only.",
    answer: 4,
    explanation: "45,000 = 4.5 × 10⁴. Exponent = 4." },
  { id: "y9-12", kind: "mcq", strand: "Measurement & Geometry", difficulty: "medium",
    prompt: "In a similar triangle scaled ×3, if one side was 4 cm, its new length is?",
    choices: ["4/3 cm", "7 cm", "9 cm", "12 cm"], answerIndex: 3,
    explanation: "4 × 3 = 12 cm." },
];

const BANKS: Record<AssessmentYear, Question[]> = { 3: Y3, 5: Y5, 7: Y7, 9: Y9 };

export function getBank(year: AssessmentYear): Question[] {
  return BANKS[year];
}

/** Pick 10 questions covering all strands and mixed difficulty. Deterministic per year on client render. */
export function sampleQuestions(year: AssessmentYear, seed = Date.now()): Question[] {
  const bank = [...BANKS[year]];
  const rng = mulberry32(seed);
  bank.sort(() => rng() - 0.5);

  // Guarantee at least 2 from each strand where possible
  const chosen: Question[] = [];
  const strands: Strand[] = ["Number & Algebra", "Measurement & Geometry", "Statistics & Probability"];
  strands.forEach((s) => {
    bank
      .filter((q) => q.strand === s)
      .slice(0, 2)
      .forEach((q) => {
        if (!chosen.find((x) => x.id === q.id)) chosen.push(q);
      });
  });

  // Fill remaining up to 10
  for (const q of bank) {
    if (chosen.length >= 10) break;
    if (!chosen.find((x) => x.id === q.id)) chosen.push(q);
  }
  return chosen.slice(0, 10);
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Scoring ─────────────────────────────────────────────────────────

export type Answer =
  | { qid: string; kind: "mcq"; picked: number | null }
  | { qid: string; kind: "numeric"; picked: number | null }
  | { qid: string; kind: "multiselect"; picked: number[] }
  | { qid: string; kind: "fill-fraction"; picked: number };

export function isCorrect(q: Question, a: Answer): boolean {
  if (q.kind !== a.kind) return false;
  if (q.kind === "mcq" && a.kind === "mcq") return a.picked === q.answerIndex;
  if (q.kind === "numeric" && a.kind === "numeric") {
    if (a.picked === null || Number.isNaN(a.picked)) return false;
    const tol = q.tolerance ?? 0;
    return Math.abs(a.picked - q.answer) <= tol + 1e-9;
  }
  if (q.kind === "multiselect" && a.kind === "multiselect") {
    const A = new Set(a.picked);
    const B = new Set(q.correct);
    if (A.size !== B.size) return false;
    for (const v of A) if (!B.has(v)) return false;
    return true;
  }
  if (q.kind === "fill-fraction" && a.kind === "fill-fraction") return a.picked === q.correctNumerator;
  return false;
}

export type ScoreBreakdown = {
  total: number;
  correct: number;
  pct: number;
  perStrand: Record<Strand, { total: number; correct: number; pct: number }>;
  bandEstimate: { low: number; high: number; label: string };
};

const BAND_TABLE: Record<AssessmentYear, { low: number; high: number; label: string }[]> = {
  3: [
    { low: 1, high: 2, label: "Below expected" },
    { low: 3, high: 4, label: "Meeting Year 3" },
    { low: 5, high: 6, label: "Exceeding — advanced" },
  ],
  5: [
    { low: 3, high: 4, label: "Developing" },
    { low: 5, high: 6, label: "Meeting Year 5" },
    { low: 7, high: 8, label: "Exceeding — top of class" },
  ],
  7: [
    { low: 5, high: 6, label: "Developing" },
    { low: 7, high: 8, label: "Meeting Year 7" },
    { low: 9, high: 10, label: "Exceeding — advanced stream" },
  ],
  9: [
    { low: 6, high: 7, label: "Developing" },
    { low: 8, high: 9, label: "Meeting Year 9" },
    { low: 10, high: 10, label: "Exceeding — top band" },
  ],
};

export function score(year: AssessmentYear, questions: Question[], answers: Answer[]): ScoreBreakdown {
  const perStrand: ScoreBreakdown["perStrand"] = {
    "Number & Algebra": { total: 0, correct: 0, pct: 0 },
    "Measurement & Geometry": { total: 0, correct: 0, pct: 0 },
    "Statistics & Probability": { total: 0, correct: 0, pct: 0 },
  };
  let correct = 0;
  for (const q of questions) {
    perStrand[q.strand].total += 1;
    const ans = answers.find((a) => a.qid === q.id);
    if (ans && isCorrect(q, ans)) {
      correct += 1;
      perStrand[q.strand].correct += 1;
    }
  }
  Object.values(perStrand).forEach((s) => {
    s.pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
  });
  const pct = Math.round((correct / questions.length) * 100);
  const bandBands = BAND_TABLE[year];
  const band =
    pct >= 80 ? bandBands[2] : pct >= 50 ? bandBands[1] : bandBands[0];
  return {
    total: questions.length,
    correct,
    pct,
    perStrand,
    bandEstimate: band,
  };
}

// Module recommendations per year — used on results page
export const MODULE_RECS: Record<AssessmentYear, string[]> = {
  3: ["y3-times-tables-mastery", "y3-place-value-1000", "y3-time-calendars"],
  5: ["y5-fractions-mastery", "y5-decimals-percentages", "y5-area-perimeter"],
  7: ["y7-linear-equations", "y7-ratio-rate-proportion", "y7-percentages-financial"],
  9: ["y9-pythagoras-theorem", "y9-trigonometry", "y9-index-laws"],
};
