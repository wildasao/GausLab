export type Student = {
  id: string;
  name: string;
  year: number;
  avatarGradient: string;
  targetBand: number;
  currentBand: number;
  mastery: number;
  streakDays: number;
  hoursThisTerm: number;
  nextLesson: {
    topic: string;
    startsAt: string;
    tutor: string;
    format: "Online 1:1" | "Small group" | "In-person";
  };
};

export type LessonEntry = {
  id: string;
  date: string;
  topic: string;
  strand: string;
  tutor: string;
  score: number;
  duration: string;
  status: "Attended" | "Upcoming" | "Missed";
};

export type HomeworkTask = {
  id: string;
  title: string;
  dueIn: string;
  progress: number;
  totalQuestions: number;
  strand: string;
  strandColor: "sky" | "orange" | "navy" | "emerald";
};

export type Message = {
  id: string;
  from: string;
  role: string;
  time: string;
  preview: string;
  unread?: boolean;
  initials: string;
  color: string;
};

export type MasteryRow = {
  topic: string;
  mastery: number;
  delta: number;
  band: "Well below" | "Developing" | "Meeting" | "Exceeding";
};

export const STUDENTS: Student[] = [
  {
    id: "ava",
    name: "Ava L.",
    year: 5,
    avatarGradient: "from-sky-500 to-sky-700",
    targetBand: 8,
    currentBand: 7,
    mastery: 84,
    streakDays: 21,
    hoursThisTerm: 42,
    nextLesson: {
      topic: "Multi-step word problems",
      startsAt: "Tomorrow · 4:00pm",
      tutor: "Ms Priya Rao",
      format: "Online 1:1",
    },
  },
  {
    id: "noah",
    name: "Noah L.",
    year: 7,
    avatarGradient: "from-orange-500 to-orange-600",
    targetBand: 9,
    currentBand: 8,
    mastery: 76,
    streakDays: 14,
    hoursThisTerm: 38,
    nextLesson: {
      topic: "Linear equations · 2-step",
      startsAt: "Wed · 5:30pm",
      tutor: "Mr James O'Neill",
      format: "Small group",
    },
  },
];

export const WEEKLY_MASTERY: { week: string; value: number }[] = [
  { week: "W1", value: 58 },
  { week: "W2", value: 62 },
  { week: "W3", value: 65 },
  { week: "W4", value: 68 },
  { week: "W5", value: 72 },
  { week: "W6", value: 74 },
  { week: "W7", value: 78 },
  { week: "W8", value: 81 },
  { week: "W9", value: 82 },
  { week: "W10", value: 84 },
];

export const TOPIC_MASTERY: MasteryRow[] = [
  { topic: "Fractions & equivalence", mastery: 96, delta: 8, band: "Exceeding" },
  { topic: "Decimal operations", mastery: 88, delta: 6, band: "Exceeding" },
  { topic: "Percentages", mastery: 82, delta: 4, band: "Meeting" },
  { topic: "Multi-step word problems", mastery: 78, delta: 12, band: "Meeting" },
  { topic: "Area & perimeter", mastery: 74, delta: 3, band: "Meeting" },
  { topic: "Composite shapes", mastery: 62, delta: 9, band: "Developing" },
  { topic: "Angle properties", mastery: 58, delta: -2, band: "Developing" },
  { topic: "Data interpretation", mastery: 81, delta: 5, band: "Meeting" },
];

export const UPCOMING_LESSONS: LessonEntry[] = [
  {
    id: "l-1",
    date: "Tue 6 Aug · 4:00pm",
    topic: "Multi-step word problems",
    strand: "Number & Algebra",
    tutor: "Ms Priya Rao",
    score: 0,
    duration: "60 min",
    status: "Upcoming",
  },
  {
    id: "l-2",
    date: "Fri 9 Aug · 4:30pm",
    topic: "Composite areas",
    strand: "Measurement & Geometry",
    tutor: "Ms Priya Rao",
    score: 0,
    duration: "60 min",
    status: "Upcoming",
  },
  {
    id: "l-3",
    date: "Sat 10 Aug · 10:00am",
    topic: "NAPLAN mock (mini)",
    strand: "Mixed strand",
    tutor: "Ms Priya Rao",
    score: 0,
    duration: "45 min",
    status: "Upcoming",
  },
];

export const RECENT_LESSONS: LessonEntry[] = [
  {
    id: "r-1",
    date: "Fri 2 Aug",
    topic: "Percentages of amounts",
    strand: "Number & Algebra",
    tutor: "Ms Priya Rao",
    score: 92,
    duration: "60 min",
    status: "Attended",
  },
  {
    id: "r-2",
    date: "Tue 30 Jul",
    topic: "Decimal operations",
    strand: "Number & Algebra",
    tutor: "Ms Priya Rao",
    score: 88,
    duration: "60 min",
    status: "Attended",
  },
  {
    id: "r-3",
    date: "Fri 26 Jul",
    topic: "Equivalent fractions",
    strand: "Number & Algebra",
    tutor: "Ms Priya Rao",
    score: 96,
    duration: "60 min",
    status: "Attended",
  },
];

export const HOMEWORK: HomeworkTask[] = [
  {
    id: "h-1",
    title: "Fractions consolidation set",
    dueIn: "Due tomorrow",
    progress: 6,
    totalQuestions: 10,
    strand: "Fractions",
    strandColor: "sky",
  },
  {
    id: "h-2",
    title: "Composite area practice",
    dueIn: "Due in 3 days",
    progress: 2,
    totalQuestions: 8,
    strand: "Geometry",
    strandColor: "orange",
  },
  {
    id: "h-3",
    title: "NAPLAN mixed mini-quiz",
    dueIn: "Due in 5 days",
    progress: 0,
    totalQuestions: 15,
    strand: "Mixed",
    strandColor: "navy",
  },
];

export const MESSAGES: Message[] = [
  {
    id: "m-1",
    from: "Ms Priya Rao",
    role: "Ava's Tutor",
    time: "2h ago",
    preview:
      "Great session today — Ava nailed the multi-step problems. Homework focus this week: composite areas.",
    unread: true,
    initials: "PR",
    color: "from-sky-500 to-sky-700",
  },
  {
    id: "m-2",
    from: "Emma (Support)",
    role: "GausLab Team",
    time: "Yesterday",
    preview:
      "Ava's Term 2 progress report is now available. Would you like a 15-min parent call next week?",
    initials: "EM",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "m-3",
    from: "Ms Priya Rao",
    role: "Ava's Tutor",
    time: "3 days ago",
    preview: "Lesson recap and slides uploaded to Ava's portal.",
    initials: "PR",
    color: "from-sky-500 to-sky-700",
  },
];

export function daysUntilNaplan(from: Date = new Date()): number {
  const naplan = new Date("2026-03-11T09:00:00+10:00");
  const ms = naplan.getTime() - from.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
