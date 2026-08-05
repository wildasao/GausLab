export type Year = "3" | "5" | "7" | "9";

export type Topic = {
  title: string;
  explanation: string;
  skills: string[];
};

export type Strand = {
  name: string;
  color: "sky" | "orange" | "navy" | "emerald";
  weight: number;
  topics: Topic[];
};

export type SampleQuestion = {
  band: string;
  prompt: string;
  choices?: string[];
  answer: string;
  workingOut: string;
};

export type Program = {
  year: Year;
  tag: string;
  headline: string;
  tagline: string;
  overview: string;
  ageRange: string;
  weeklyLoad: string;
  sessionLength: string;
  formats: string[];
  outcomes: string[];
  naplanFocus: string[];
  strands: Strand[];
  sample: SampleQuestion;
};

export const PROGRAMS: Record<Year, Program> = {
  "3": {
    year: "3",
    tag: "Foundations",
    headline: "Year 3 · Foundations",
    tagline: "Cement number sense and build early problem-solving stamina.",
    overview:
      "Year 3 is the first NAPLAN year. Our program secures the mental-arithmetic foundations most classrooms rush past, introduces structured problem-solving language, and de-mystifies exam conditions with playful, low-pressure practice.",
    ageRange: "Ages 8–9",
    weeklyLoad: "1 × 45 min session + 20 min homework",
    sessionLength: "45 minutes",
    formats: ["Online 1:1", "Small group (max 4)", "In-person Sydney"],
    outcomes: [
      "Recall multiplication facts to 10 × 10 with 90%+ accuracy",
      "Read, write and order numbers to 10,000",
      "Solve 2-step word problems using diagrams",
      "Interpret column and picture graphs",
      "Sit NAPLAN Y3 confidently, targeting Band 4–5",
    ],
    naplanFocus: [
      "Numeracy computation strategies",
      "Reading questions carefully",
      "Time-boxed practice (40-min mock papers)",
    ],
    strands: [
      {
        name: "Number & Algebra",
        color: "sky",
        weight: 55,
        topics: [
          {
            title: "Place value to 10,000",
            explanation:
              "Students build the mental model of thousands/hundreds/tens/ones using MAB blocks, then translate into written and expanded notation.",
            skills: ["Read & write numbers to 10,000", "Rounding to 10 and 100", "Ordering and comparing"],
          },
          {
            title: "Addition & subtraction strategies",
            explanation:
              "Beyond the standard algorithm — we teach compensation, bridging to ten, and split strategies so students choose the fastest method.",
            skills: ["Mental addition to 100", "Column algorithm to 4 digits", "Estimating totals"],
          },
          {
            title: "Multiplication facts (0–10)",
            explanation:
              "Fluent recall unlocks every later topic. We use skip counting, arrays and daily 90-second drills to hit automaticity.",
            skills: ["Skip counting patterns", "Times tables recall", "Arrays & area models"],
          },
          {
            title: "Introduction to fractions",
            explanation:
              "Fractions of shapes and small sets, using visual partitioning before symbolic notation.",
            skills: ["Halves, quarters, eighths", "Fractions of a group", "Equivalent visuals"],
          },
        ],
      },
      {
        name: "Measurement & Geometry",
        color: "orange",
        weight: 30,
        topics: [
          {
            title: "Length, mass & capacity",
            explanation:
              "Estimating, then measuring with standard units. Students learn to pick the right unit for the job.",
            skills: ["mm/cm/m/km", "g and kg", "mL and L"],
          },
          {
            title: "Time & calendars",
            explanation:
              "Analog and digital reading, calculating elapsed time, and reading Australian school calendars.",
            skills: ["Read analog clocks", "Elapsed time", "Days, weeks, months"],
          },
          {
            title: "2D & 3D shapes",
            explanation:
              "Identifying shape properties, mapping 2D nets to 3D shapes and describing symmetry.",
            skills: ["Polygon vocabulary", "Symmetry lines", "3D nets"],
          },
        ],
      },
      {
        name: "Statistics & Probability",
        color: "navy",
        weight: 15,
        topics: [
          {
            title: "Data displays",
            explanation:
              "Reading and constructing column and picture graphs from small surveys.",
            skills: ["Tally marks", "Column graphs", "Simple data questions"],
          },
          {
            title: "Chance language",
            explanation:
              "Everyday probability vocabulary — certain, likely, unlikely, impossible — with real examples.",
            skills: ["Chance vocabulary", "Ordering likelihood"],
          },
        ],
      },
    ],
    sample: {
      band: "NAPLAN Y3 · Band 4 sample",
      prompt:
        "There are 8 rows of chairs in the school hall. Each row has 6 chairs. Another 12 chairs are added along the back wall. How many chairs are in the hall altogether?",
      choices: ["48", "54", "60", "66"],
      answer: "60",
      workingOut:
        "8 × 6 = 48 chairs in rows. 48 + 12 = 60 chairs total. Students learn to identify the two operations from the wording (‘rows of’ → multiply, ‘added’ → add) before computing.",
    },
  },
  "5": {
    year: "5",
    tag: "Fluency",
    headline: "Year 5 · Fluency",
    tagline: "Master fractions, decimals and multi-step reasoning for NAPLAN Y5.",
    overview:
      "Year 5 is the make-or-break year for later maths. We take the sprawling Y5 curriculum and sequence it so fractions, decimals and percentages become one connected idea — then apply it under NAPLAN time pressure.",
    ageRange: "Ages 10–11",
    weeklyLoad: "1 × 60 min session + 30 min homework",
    sessionLength: "60 minutes",
    formats: ["Online 1:1", "Small group (max 4)", "In-person Sydney"],
    outcomes: [
      "Perform four operations on fractions and decimals",
      "Convert fluently between fractions, decimals and percentages",
      "Solve multi-step word problems with unknown values",
      "Read and construct line and column graphs",
      "Target NAPLAN Y5 Bands 6–8 with strategy-driven answers",
    ],
    naplanFocus: [
      "Fraction-decimal conversion under time",
      "Order-of-operations traps",
      "Full-length Y5 mock papers with review",
    ],
    strands: [
      {
        name: "Number & Algebra",
        color: "sky",
        weight: 55,
        topics: [
          {
            title: "Fractions: equivalence & operations",
            explanation:
              "From bar models to symbolic manipulation. Students learn why 2/3 = 4/6 (multiplicative identity) before drilling operations.",
            skills: ["Equivalent fractions", "Adding/subtracting like & unlike", "Multiplying by whole numbers"],
          },
          {
            title: "Decimals to thousandths",
            explanation:
              "Placing decimals on a number line, reading them aloud correctly, and computing with them without losing the point.",
            skills: ["Place value to 0.001", "×/÷ by 10, 100, 1000", "Decimal-fraction links"],
          },
          {
            title: "Percentages in real life",
            explanation:
              "Understanding % as ‘out of 100’, calculating discounts and simple interest — grounded in supermarket and phone-plan examples.",
            skills: ["Fraction ↔ decimal ↔ %", "10% mental shortcut", "GST estimation"],
          },
          {
            title: "Patterns & early algebra",
            explanation:
              "Describing number patterns algebraically and finding rules — the bridge into Year 7 linear equations.",
            skills: ["Function machines", "Missing-number equations", "Growing patterns"],
          },
        ],
      },
      {
        name: "Measurement & Geometry",
        color: "orange",
        weight: 25,
        topics: [
          {
            title: "Area, perimeter & volume",
            explanation:
              "Deriving area formulas from unit squares instead of memorising them, then extending to composite shapes.",
            skills: ["Rectangle & triangle area", "Composite shapes", "Volume of prisms"],
          },
          {
            title: "Angles & transformations",
            explanation:
              "Measuring with a protractor, classifying angles and identifying rotations, reflections and translations.",
            skills: ["Angle measurement", "Angle classification", "Transformations"],
          },
        ],
      },
      {
        name: "Statistics & Probability",
        color: "navy",
        weight: 20,
        topics: [
          {
            title: "Data analysis",
            explanation:
              "Constructing and interpreting line, column and dot plots. Introducing mean as ‘fair share’.",
            skills: ["Line & dot plots", "Mean, median, mode", "Interpreting data"],
          },
          {
            title: "Probability fractions",
            explanation:
              "Expressing chance as a fraction, decimal or percentage — connecting the number strand.",
            skills: ["0 to 1 scale", "Fraction probabilities", "Sample spaces"],
          },
        ],
      },
    ],
    sample: {
      band: "NAPLAN Y5 · Band 7 sample",
      prompt:
        "A cake recipe uses 3/4 cup of sugar. Mia is making 2½ times the recipe for a party. How much sugar does she need in total?",
      choices: ["1 7/8 cups", "2 1/4 cups", "2 1/2 cups", "3 cups"],
      answer: "1 7/8 cups",
      workingOut:
        "3/4 × 5/2 = 15/8 = 1 7/8. Students practise converting mixed numbers to improper before multiplying, then converting back.",
    },
  },
  "7": {
    year: "7",
    tag: "Transition",
    headline: "Year 7 · Transition",
    tagline: "Bridge primary maths into high-school algebra with confidence.",
    overview:
      "Year 7 is a step-change. New notation (variables, negative numbers, coordinates), new expectations. Our program eases the transition by front-loading algebra fundamentals and building strong problem-solving routines before Y7 NAPLAN.",
    ageRange: "Ages 12–13",
    weeklyLoad: "1 × 60 min session + 45 min homework",
    sessionLength: "60 minutes",
    formats: ["Online 1:1", "Small group (max 4)", "In-person Sydney"],
    outcomes: [
      "Solve linear equations of the form ax + b = c fluently",
      "Compute with integers, fractions and decimals",
      "Use ratio and proportion in real contexts",
      "Calculate angles in polygons and on parallel lines",
      "Target NAPLAN Y7 Bands 7–9 with confidence",
    ],
    naplanFocus: [
      "Algebraic substitution & manipulation",
      "Rate & proportion word problems",
      "Two full Y7 NAPLAN mock papers with tutor review",
    ],
    strands: [
      {
        name: "Number & Algebra",
        color: "sky",
        weight: 55,
        topics: [
          {
            title: "Integers & order of operations",
            explanation:
              "Reasoning with negatives on a number line, then applying BIDMAS/PEMDAS to messy expressions.",
            skills: ["Integer arithmetic", "BIDMAS", "Negative in real contexts"],
          },
          {
            title: "Linear equations",
            explanation:
              "The ‘balance model’ for solving equations, moving from arithmetic to algebra using inverse operations.",
            skills: ["One-step equations", "Two-step equations", "Solving with negatives"],
          },
          {
            title: "Ratio, rate & proportion",
            explanation:
              "Interpreting ratios in recipes, maps and pricing. The unit-rate strategy for solving proportion problems.",
            skills: ["Simplifying ratios", "Unitary method", "Best-buy problems"],
          },
          {
            title: "Percentages of amounts",
            explanation:
              "Increase/decrease by a %, GST calculations and simple discount problems.",
            skills: ["% increase/decrease", "GST", "Discount & mark-up"],
          },
        ],
      },
      {
        name: "Measurement & Geometry",
        color: "orange",
        weight: 25,
        topics: [
          {
            title: "Angles & parallel lines",
            explanation:
              "Naming angle pairs (co-interior, alternate, corresponding) and using them to find unknowns.",
            skills: ["Angle pairs", "Angle sums in triangles/quadrilaterals", "Reasoning proofs"],
          },
          {
            title: "Coordinate geometry (intro)",
            explanation:
              "Plotting points in four quadrants and interpreting simple linear patterns as lines.",
            skills: ["4-quadrant plotting", "Tables → graphs", "Interpreting gradients"],
          },
          {
            title: "Area & volume",
            explanation:
              "Area of parallelograms and trapeziums; volume of rectangular and triangular prisms.",
            skills: ["Composite areas", "Prism volume", "Unit conversion"],
          },
        ],
      },
      {
        name: "Statistics & Probability",
        color: "navy",
        weight: 20,
        topics: [
          {
            title: "Descriptive statistics",
            explanation:
              "Comparing datasets using mean, median, mode and range. Choosing the right measure for the story.",
            skills: ["Mean/median/mode/range", "Outliers", "Comparing distributions"],
          },
          {
            title: "Probability",
            explanation:
              "Theoretical vs experimental probability. Introducing sample spaces with two events.",
            skills: ["Two-event sample spaces", "Complementary events", "Long-run frequency"],
          },
        ],
      },
    ],
    sample: {
      band: "NAPLAN Y7 · Band 8 sample",
      prompt:
        "A phone plan costs $29 per month plus $0.15 per minute of calls. Ben's bill for June was $47. How many minutes did he spend on calls?",
      choices: ["100", "120", "150", "180"],
      answer: "120",
      workingOut:
        "Let m = minutes. 29 + 0.15m = 47 → 0.15m = 18 → m = 120. We drill setting up the equation from the wording before solving.",
    },
  },
  "9": {
    year: "9",
    tag: "Advanced",
    headline: "Year 9 · Advanced",
    tagline: "Sharpen algebra, geometry and NAPLAN — and set up Year 10 success.",
    overview:
      "Year 9 NAPLAN is the last standardised checkpoint before the senior years. We stretch students into quadratics, coordinate geometry and trigonometry while ensuring every fundamental — from fractions to indices — is airtight under exam pressure.",
    ageRange: "Ages 14–15",
    weeklyLoad: "2 × 60 min sessions + 60 min homework",
    sessionLength: "60 minutes (×2/week)",
    formats: ["Online 1:1", "Small group (max 3)", "In-person Sydney"],
    outcomes: [
      "Factorise and expand quadratic expressions",
      "Apply Pythagoras and basic trigonometry in right-angled triangles",
      "Solve linear simultaneous equations",
      "Analyse probability trees and two-way tables",
      "Sit NAPLAN Y9 targeting Bands 9–10 and preparing for Y10 Advanced",
    ],
    naplanFocus: [
      "Non-calculator arithmetic under 3 minutes",
      "Coordinate-geometry Band 10 questions",
      "Full-length calculator & non-calculator mock papers",
    ],
    strands: [
      {
        name: "Number & Algebra",
        color: "sky",
        weight: 60,
        topics: [
          {
            title: "Index laws",
            explanation:
              "The five index laws proven from first principles, then applied to scientific notation and surds.",
            skills: ["a^m × a^n rules", "Negative & zero indices", "Scientific notation"],
          },
          {
            title: "Expanding & factorising",
            explanation:
              "Distributive law, binomial expansion (FOIL), common factor and monic quadratic factorising.",
            skills: ["Expand binomials", "Common factor", "Monic quadratics"],
          },
          {
            title: "Linear equations & inequalities",
            explanation:
              "Multi-step equations, equations with variables both sides, and graphical interpretation of solutions.",
            skills: ["Variables both sides", "Simultaneous equations", "Linear inequalities"],
          },
          {
            title: "Coordinate geometry",
            explanation:
              "Gradient, midpoint and distance formulas — with an intuition-first approach before formulas.",
            skills: ["Gradient & y-intercept", "Distance & midpoint", "Parallel & perpendicular"],
          },
        ],
      },
      {
        name: "Measurement & Geometry",
        color: "orange",
        weight: 25,
        topics: [
          {
            title: "Pythagoras' theorem",
            explanation:
              "Proving Pythagoras visually, then applying it to real 2D and 3D problems.",
            skills: ["Finding hypotenuse", "Finding a shorter side", "3D applications"],
          },
          {
            title: "Trigonometry (right-angled)",
            explanation:
              "SOH-CAH-TOA with real trigonometric ratios, plus angle-of-elevation/depression problems.",
            skills: ["Finding sides", "Finding angles", "Bearings problems"],
          },
          {
            title: "Similar figures",
            explanation:
              "Scale factor, enlargement and applications to maps and models.",
            skills: ["Scale factor", "Similar triangles", "Enlargement"],
          },
        ],
      },
      {
        name: "Statistics & Probability",
        color: "navy",
        weight: 15,
        topics: [
          {
            title: "Two-way tables & probability",
            explanation:
              "Reading two-way tables, computing conditional probability and interpreting Venn diagrams.",
            skills: ["Two-way tables", "Venn diagrams", "Conditional probability"],
          },
          {
            title: "Statistical measures",
            explanation:
              "Quartiles, IQR and interpreting box plots. Comparing distributions in context.",
            skills: ["Quartiles & IQR", "Box plots", "Comparing datasets"],
          },
        ],
      },
    ],
    sample: {
      band: "NAPLAN Y9 · Band 10 sample",
      prompt:
        "A right-angled triangle has legs of length 5 cm and 12 cm. A similar triangle has a hypotenuse of 39 cm. What is the length of the shorter leg of the similar triangle?",
      choices: ["12 cm", "13 cm", "15 cm", "18 cm"],
      answer: "15 cm",
      workingOut:
        "Original hypotenuse = √(5² + 12²) = 13. Scale factor = 39 ÷ 13 = 3. Shorter leg = 5 × 3 = 15 cm. We drill the two-step: solve first, then apply the scale factor.",
    },
  },
};

export const YEAR_ORDER: Year[] = ["3", "5", "7", "9"];
