-- =====================================================================
-- GausLab Maths Academy · Supabase schema
-- Run this in the Supabase SQL Editor for project pvkgwtehkkhnnykzpvxe.
-- Safe to run more than once (uses IF NOT EXISTS / DROP IF EXISTS).
-- =====================================================================

-- ─── Extensions ───────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Tables ───────────────────────────────────────────────────────────

-- Parent profile (extends auth.users, filled by trigger below)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text not null default 'parent',
  phone text,
  created_at timestamptz not null default now()
);

-- Students belong to a parent
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  year int not null check (year in (3,5,7,9,4,6,8,10)),
  target_band int,
  current_band int,
  mastery int not null default 0,
  streak_days int not null default 0,
  hours_term int not null default 0,
  avatar_gradient text default 'from-sky-500 to-sky-700',
  next_lesson_topic text,
  next_lesson_starts_at timestamptz,
  next_lesson_tutor text,
  next_lesson_format text,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_min int not null default 60,
  topic text not null,
  strand text,
  tutor text,
  format text,
  status text not null default 'Upcoming' check (status in ('Upcoming','Attended','Missed','Cancelled')),
  score int,
  created_at timestamptz not null default now()
);

create table if not exists public.homework (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  due_at timestamptz not null,
  progress int not null default 0,
  total_questions int not null,
  strand text,
  strand_color text default 'sky',
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  from_name text not null,
  from_role text,
  preview text not null,
  unread boolean not null default false,
  initials text,
  color text default 'from-sky-500 to-sky-700',
  direction text not null default 'inbound',
  sender_id uuid references auth.users(id),
  sent_at timestamptz not null default now()
);

-- Migrate old tables (idempotent)
alter table public.messages add column if not exists direction text not null default 'inbound';
alter table public.messages add column if not exists sender_id uuid references auth.users(id);
do $$ begin
  alter table public.messages drop constraint if exists messages_direction_check;
  alter table public.messages add constraint messages_direction_check
    check (direction in ('inbound','outbound'));
exception when others then null; end $$;
create index if not exists messages_thread_idx on public.messages(student_id, from_name, sent_at desc);

create table if not exists public.topic_mastery (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  topic text not null,
  mastery int not null,
  delta int not null default 0,
  band text not null check (band in ('Well below','Developing','Meeting','Exceeding')),
  ord int not null default 0
);

create table if not exists public.weekly_mastery (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  week text not null,
  value int not null,
  ord int not null default 0
);

-- Public forms
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  child_name text,
  email text not null,
  phone text,
  year_level text,
  preferred_format text,
  notes text,
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new','contacted','booked','won','lost','spam')),
  source_url text,
  created_at timestamptz not null default now()
);
-- Add columns if the table already existed before this migration
alter table public.enquiries add column if not exists source_url text;
do $$ begin
  alter table public.enquiries drop constraint if exists enquiries_status_check;
  alter table public.enquiries add constraint enquiries_status_check
    check (status in ('new','contacted','booked','won','lost','spam'));
exception when others then null; end $$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  child_year int,
  source text not null default 'newsletter',
  created_at timestamptz not null default now()
);
create unique index if not exists leads_email_source_idx on public.leads (lower(email), source);

-- ─── Row-Level Security ───────────────────────────────────────────────

alter table public.profiles       enable row level security;
alter table public.students       enable row level security;
alter table public.lessons        enable row level security;
alter table public.homework       enable row level security;
alter table public.messages       enable row level security;
alter table public.topic_mastery  enable row level security;
alter table public.weekly_mastery enable row level security;
alter table public.enquiries      enable row level security;
alter table public.leads          enable row level security;

-- Profiles: only the owner
drop policy if exists "profiles self read"   on public.profiles;
drop policy if exists "profiles self write"  on public.profiles;
drop policy if exists "profiles self insert" on public.profiles;
create policy "profiles self read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles self write"  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert with check (auth.uid() = id);

-- Students: parent access only
drop policy if exists "students parent access" on public.students;
create policy "students parent access" on public.students
  for all using (parent_id = auth.uid()) with check (parent_id = auth.uid());

-- Related tables: readable when the row's student belongs to the current parent
drop policy if exists "lessons via student"        on public.lessons;
drop policy if exists "homework via student"       on public.homework;
drop policy if exists "messages via student"       on public.messages;
drop policy if exists "topic_mastery via student"  on public.topic_mastery;
drop policy if exists "weekly_mastery via student" on public.weekly_mastery;

create policy "lessons via student"        on public.lessons        for select using (student_id in (select id from public.students where parent_id = auth.uid()));
create policy "homework via student"       on public.homework       for select using (student_id in (select id from public.students where parent_id = auth.uid()));
create policy "messages via student"       on public.messages       for select using (student_id in (select id from public.students where parent_id = auth.uid()));

-- Parent replies: authenticated parent may INSERT outbound messages into
-- threads that belong to one of THEIR students. Direction locked to 'outbound'
-- so parents can't spoof tutor messages.
drop policy if exists "messages parent send" on public.messages;
create policy "messages parent send" on public.messages
  for insert to authenticated
  with check (
    student_id in (select id from public.students where parent_id = auth.uid())
    and direction = 'outbound'
    and sender_id = auth.uid()
  );

-- Parent may mark inbound messages read/unread on their student's threads.
drop policy if exists "messages parent update" on public.messages;
create policy "messages parent update" on public.messages
  for update to authenticated
  using (student_id in (select id from public.students where parent_id = auth.uid()))
  with check (student_id in (select id from public.students where parent_id = auth.uid()));
create policy "topic_mastery via student"  on public.topic_mastery  for select using (student_id in (select id from public.students where parent_id = auth.uid()));
create policy "weekly_mastery via student" on public.weekly_mastery for select using (student_id in (select id from public.students where parent_id = auth.uid()));

-- Public forms: anon can INSERT only (no read exposed)
drop policy if exists "enquiries anon insert" on public.enquiries;
drop policy if exists "leads anon insert"     on public.leads;
create policy "enquiries anon insert" on public.enquiries for insert to anon, authenticated with check (true);
create policy "leads anon insert"     on public.leads     for insert to anon, authenticated with check (true);

-- Admin CRM access — only profiles with role='admin' can read/update enquiries and leads.
drop policy if exists "enquiries admin read"   on public.enquiries;
drop policy if exists "enquiries admin update" on public.enquiries;
drop policy if exists "leads admin read"       on public.leads;
create policy "enquiries admin read"   on public.enquiries for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "enquiries admin update" on public.enquiries for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "leads admin read"       on public.leads     for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Self-promote helper: the FIRST parent to sign up can call this once to become admin.
-- After that, further calls are no-ops. This is safe because it only affects the caller
-- and only if no admin exists yet.
create or replace function public.claim_admin()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing int;
begin
  if auth.uid() is null then raise exception 'must be authenticated'; end if;
  select count(*) into existing from public.profiles where role = 'admin';
  if existing > 0 then return 'admin already claimed'; end if;
  update public.profiles set role = 'admin' where id = auth.uid();
  return 'promoted to admin';
end;
$$;
grant execute on function public.claim_admin() to authenticated;

-- =====================================================================
-- ASSESSMENT RESULTS
-- Rows saved when a visitor completes the free /assessment quiz and
-- opts to receive the emailed report. Public insert; admin-only read.
-- =====================================================================

create table if not exists public.assessment_results (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete set null,
  year           int not null check (year in (3,5,7,9)),
  parent_name    text,
  email          text not null,
  score_correct  int not null,
  score_total    int not null,
  score_pct      int not null,
  band_estimate  text,
  per_strand     jsonb,
  source_url     text,
  created_at     timestamptz not null default now()
);

-- Backfill for schemas created before user_id was added
alter table public.assessment_results add column if not exists user_id uuid references auth.users(id) on delete set null;

-- =====================================================================
-- PERSONALITY / LEARNER PROFILE
-- Short pre-quiz survey so we can personalise the visuals, tone and
-- pacing of the diagnostic experience for each learner.
-- =====================================================================

create table if not exists public.personality_profiles (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  interests      text[] default '{}',
  learning_style text,
  confidence     text,
  motivation     text,
  visual_theme   text default 'apples',
  updated_at     timestamptz not null default now()
);

alter table public.personality_profiles enable row level security;

drop policy if exists "profile own"        on public.personality_profiles;
drop policy if exists "profile own insert" on public.personality_profiles;
drop policy if exists "profile own update" on public.personality_profiles;

create policy "profile own"        on public.personality_profiles for select to authenticated using (user_id = auth.uid());
create policy "profile own insert" on public.personality_profiles for insert to authenticated with check (user_id = auth.uid());
create policy "profile own update" on public.personality_profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists assessment_results_created_idx on public.assessment_results (created_at desc);
create index if not exists assessment_results_user_idx    on public.assessment_results (user_id, created_at desc);

alter table public.assessment_results enable row level security;

drop policy if exists "assessment_results anon insert" on public.assessment_results;
drop policy if exists "assessment_results admin read"  on public.assessment_results;
drop policy if exists "assessment_results own read"    on public.assessment_results;
create policy "assessment_results anon insert" on public.assessment_results
  for insert to anon, authenticated with check (true);
-- Parents can see their own past results
create policy "assessment_results own read" on public.assessment_results
  for select to authenticated
  using (user_id = auth.uid());
-- Admins see everything
create policy "assessment_results admin read" on public.assessment_results
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ─── Trigger: create a profile row when a new auth user is created ────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ─── Optional: RPC to seed a demo student + progress for the caller ───
-- Call this once per authenticated parent to see a rich dashboard.
create or replace function public.seed_demo_data()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_parent uuid := auth.uid();
  v_student uuid;
begin
  if v_parent is null then raise exception 'must be authenticated'; end if;

  -- Only seed if the parent has no students yet
  if exists (select 1 from public.students where parent_id = v_parent) then return; end if;

  insert into public.students (parent_id, name, year, target_band, current_band, mastery, streak_days, hours_term,
    avatar_gradient, next_lesson_topic, next_lesson_starts_at, next_lesson_tutor, next_lesson_format)
  values (v_parent, 'Ava L.', 5, 8, 7, 84, 21, 42,
    'from-sky-500 to-sky-700', 'Multi-step word problems', now() + interval '1 day', 'Ms Priya Rao', 'Online 1:1')
  returning id into v_student;

  insert into public.weekly_mastery (student_id, week, value, ord) values
    (v_student,'W1',58,1),(v_student,'W2',62,2),(v_student,'W3',65,3),
    (v_student,'W4',68,4),(v_student,'W5',72,5),(v_student,'W6',74,6),
    (v_student,'W7',78,7),(v_student,'W8',81,8),(v_student,'W9',82,9),(v_student,'W10',84,10);

  insert into public.topic_mastery (student_id, topic, mastery, delta, band, ord) values
    (v_student,'Fractions & equivalence',96, 8,'Exceeding',1),
    (v_student,'Decimal operations',88, 6,'Exceeding',2),
    (v_student,'Percentages',82, 4,'Meeting',3),
    (v_student,'Multi-step word problems',78,12,'Meeting',4),
    (v_student,'Area & perimeter',74, 3,'Meeting',5),
    (v_student,'Composite shapes',62, 9,'Developing',6),
    (v_student,'Angle properties',58,-2,'Developing',7),
    (v_student,'Data interpretation',81, 5,'Meeting',8);

  insert into public.lessons (student_id, scheduled_at, duration_min, topic, strand, tutor, format, status) values
    (v_student, now() + interval '1 day',  60, 'Multi-step word problems', 'Number & Algebra',        'Ms Priya Rao', 'Online 1:1', 'Upcoming'),
    (v_student, now() + interval '4 days', 60, 'Composite areas',          'Measurement & Geometry', 'Ms Priya Rao', 'Online 1:1', 'Upcoming'),
    (v_student, now() + interval '5 days', 45, 'NAPLAN mock (mini)',        'Mixed strand',           'Ms Priya Rao', 'Online 1:1', 'Upcoming');

  insert into public.homework (student_id, title, due_at, progress, total_questions, strand, strand_color) values
    (v_student, 'Fractions consolidation set', now() + interval '1 day', 6, 10, 'Fractions', 'sky'),
    (v_student, 'Composite area practice',     now() + interval '3 days', 2,  8, 'Geometry',  'orange'),
    (v_student, 'NAPLAN mixed mini-quiz',      now() + interval '5 days', 0, 15, 'Mixed',     'navy');

  insert into public.messages (student_id, from_name, from_role, preview, unread, initials, color) values
    (v_student, 'Ms Priya Rao', 'Ava''s Tutor', 'Great session today — Ava nailed the multi-step problems. Homework focus this week: composite areas.', true, 'PR', 'from-sky-500 to-sky-700'),
    (v_student, 'Emma (Support)', 'GausLab Team', 'Ava''s Term 2 progress report is now available. Would you like a 15-min parent call next week?', false, 'EM', 'from-orange-500 to-orange-600'),
    (v_student, 'Ms Priya Rao', 'Ava''s Tutor', 'Lesson recap and slides uploaded to Ava''s portal.', false, 'PR', 'from-sky-500 to-sky-700');
end;
$$;

grant execute on function public.seed_demo_data() to authenticated;

-- =====================================================================
-- QUESTION BANK
-- Reusable pool of NAPLAN-style questions authored by GausLab or imported.
-- The interactive study modules (Y3/Y5/Y7/Y9/Advanced) also write
-- attempt-level analytics here so we can build mastery over time.
-- =====================================================================

create table if not exists public.questions (
  id             uuid primary key default gen_random_uuid(),
  year           int check (year in (3,5,7,9)),
  pathway        text not null default 'core' check (pathway in ('core','advanced')),
  strand         text,                          -- 'Number & Algebra' | 'Measurement & Geometry' | 'Statistics & Probability'
  topic          text,                          -- freeform topic label
  difficulty     text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  kind           text not null check (kind in ('mcq','numeric')),
  prompt         text not null,
  -- MCQ fields
  choices        text[],                        -- for kind = 'mcq'
  answer_index   int,                           -- for kind = 'mcq'
  -- Numeric fields
  answer_numeric numeric,                       -- for kind = 'numeric'
  unit           text,
  tolerance      numeric not null default 0,
  -- Teaching
  explanation    text,
  hint           text,
  visual_name    text,
  visual_props   jsonb,
  -- Provenance
  source         text not null default 'gauslab',
  tags           text[] default '{}',
  created_at     timestamptz not null default now()
);

create index if not exists questions_year_strand_idx on public.questions(year, strand);
create index if not exists questions_tags_idx        on public.questions using gin (tags);

alter table public.questions enable row level security;

drop policy if exists "questions read all"       on public.questions;
create policy "questions read all" on public.questions
  for select to anon, authenticated using (true);

-- Per-attempt analytics (one row per answer)
create table if not exists public.question_attempts (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid references public.students(id) on delete cascade,
  question_id    uuid references public.questions(id) on delete set null,
  -- Fallback when the module's questions are still in code (not yet in DB)
  module_slug    text,
  lesson_id      text,
  block_index    int,
  correct        boolean not null,
  answer_given   text,
  duration_ms    int,
  attempted_at   timestamptz not null default now()
);

create index if not exists attempts_student_idx on public.question_attempts(student_id, attempted_at desc);

alter table public.question_attempts enable row level security;

drop policy if exists "attempts insert own" on public.question_attempts;
drop policy if exists "attempts read own"   on public.question_attempts;

create policy "attempts insert own" on public.question_attempts
  for insert to authenticated
  with check (
    student_id is null OR
    student_id in (select id from public.students where parent_id = auth.uid())
  );

create policy "attempts read own" on public.question_attempts
  for select to authenticated
  using (
    student_id is null OR
    student_id in (select id from public.students where parent_id = auth.uid())
  );

-- STUDENT-CREATED PROBLEMS (from module labs)
-- Turns learners into authors — they design their own maths problems.
create table if not exists public.student_problems (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid references public.students(id) on delete cascade,
  module_slug    text,
  kind           text not null check (kind in ('multiplication','fraction','pythagoras','place-value')),
  config         jsonb not null,           -- e.g. {"rows":3,"cols":8,"theme":"cookies"}
  story          text,                      -- the story the student invented
  answer         text,                      -- their computed answer
  favorite       boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists student_problems_student_idx on public.student_problems(student_id, created_at desc);

alter table public.student_problems enable row level security;

drop policy if exists "student_problems own read"   on public.student_problems;
drop policy if exists "student_problems own write"  on public.student_problems;
drop policy if exists "student_problems own delete" on public.student_problems;

create policy "student_problems own read" on public.student_problems
  for select to authenticated
  using (student_id in (select id from public.students where parent_id = auth.uid()));

create policy "student_problems own write" on public.student_problems
  for insert to authenticated
  with check (student_id in (select id from public.students where parent_id = auth.uid()));

create policy "student_problems own delete" on public.student_problems
  for delete to authenticated
  using (student_id in (select id from public.students where parent_id = auth.uid()));

-- Seed a starter question bank so /questions has content out of the box
insert into public.questions
  (year, strand, topic, difficulty, kind, prompt, choices, answer_index, answer_numeric, unit, explanation, hint, visual_name, visual_props, source, tags)
values
  (3, 'Number & Algebra', 'Multiplication', 'easy',   'mcq',     'A box holds 8 crayons. How many crayons in 3 boxes?', array['16','20','24','28'], 2, null, null, '3 groups of 8 → 3 × 8 = 24.', 'Try 3 rows of 8 in the array.',                'multiplication-array', '{"startRows":3,"startCols":8,"startTheme":"cookies"}'::jsonb, 'gauslab', array['multiplication','arrays']),
  (3, 'Number & Algebra', 'Place value',    'medium', 'mcq',     'What is the value of the digit 7 in 471?',           array['7','70','700','7000'],   1, null, null, '7 is in the tens place → 70.',            'Look at where the 7 sits.',                    'place-value-blocks',   '{"start":471}'::jsonb,                                       'gauslab', array['place-value']),
  (5, 'Number & Algebra', 'Fractions',      'medium', 'numeric', 'Complete the equivalent fraction: 2/5 = ?/15',        null,                            null, 6, null, '5 × 3 = 15, so 2 × 3 = 6 → 2/5 = 6/15.',   'What do you multiply 5 by to get 15?',         null,                    null,                                                          'gauslab', array['fractions','equivalence']),
  (7, 'Number & Algebra', 'Linear equations','medium','numeric', 'Solve for x: 5x + 2 = 32',                            null,                            null, 6, null, '5x = 30 → x = 6.',                         'Subtract 2 first, then divide by 5.',          null,                    null,                                                          'gauslab', array['algebra','equations']),
  (9, 'Measurement & Geometry','Pythagoras','medium','numeric', 'Legs are 5 and 12. Find the hypotenuse.',              null,                            null, 13, 'cm', '5² + 12² = 169 → √169 = 13.',              'Square each leg, add them, then square-root.', 'pythagoras',            '{"a":5,"b":12}'::jsonb,                                       'gauslab', array['pythagoras'])
on conflict do nothing;

-- =====================================================================
-- PROJECTS
-- Cross-family student teams tackling a real-life maths challenge tied to
-- a year/module, with in-app team workspace + video meetings.
--
-- Child-safety boundary: a student can only be added to a team once THEIR
-- OWN parent approves (see "project_team_members decide own child" below).
-- One parent can never approve another family's child into a team. A team
-- only becomes 'active' (workspace + meetings unlocked) once every member
-- is approved — enforced by project_team_maybe_activate() below, not by
-- the client.
-- =====================================================================

create table if not exists public.project_challenges (
  id          uuid primary key default gen_random_uuid(),
  module_slug text,                     -- optional link to a MODULES[].slug in lib/modules.ts
  year        int not null check (year in (3,5,7,9,4,6,8,10)),
  title       text not null,
  summary     text not null,            -- short teaser shown on the catalogue card
  brief       text not null,            -- the full "apply this to real life" challenge prompt
  deliverable text,                     -- what a team should produce/submit
  difficulty  text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists project_challenges_year_idx on public.project_challenges(year, active);

alter table public.project_challenges enable row level security;

drop policy if exists "project_challenges read all" on public.project_challenges;
create policy "project_challenges read all" on public.project_challenges
  for select to authenticated using (active = true);

drop policy if exists "project_challenges admin write" on public.project_challenges;
create policy "project_challenges admin write" on public.project_challenges
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create table if not exists public.project_teams (
  id                     uuid primary key default gen_random_uuid(),
  challenge_id           uuid not null references public.project_challenges(id) on delete cascade,
  name                   text not null,
  status                 text not null default 'forming' check (status in ('forming','active','completed')),
  created_by_student_id  uuid not null references public.students(id) on delete cascade,
  created_at             timestamptz not null default now()
);

create index if not exists project_teams_challenge_idx on public.project_teams(challenge_id);

-- student_display_name/avatar are denormalized copies (first-name only,
-- by convention) supplied by the requesting student's own parent at insert
-- time. This is deliberate: public.students RLS only lets a parent read
-- THEIR OWN children (full academic record — bands, mastery, next lesson),
-- so a teammate from another family must never be joined in from
-- public.students directly. These two columns are the only teammate info
-- exposed cross-family.
create table if not exists public.project_team_members (
  id                     uuid primary key default gen_random_uuid(),
  team_id                uuid not null references public.project_teams(id) on delete cascade,
  student_id             uuid not null references public.students(id) on delete cascade,
  student_display_name   text not null,
  student_avatar_gradient text default 'from-sky-500 to-sky-700',
  status       text not null default 'pending' check (status in ('pending','approved','removed')),
  approved_by  uuid references auth.users(id),   -- must be the approved student's own parent
  requested_at timestamptz not null default now(),
  decided_at   timestamptz,
  unique (team_id, student_id)
);

create index if not exists project_team_members_team_idx    on public.project_team_members(team_id);
create index if not exists project_team_members_student_idx on public.project_team_members(student_id);

create table if not exists public.project_workspace_posts (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references public.project_teams(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  body       text not null,
  link_url   text,
  created_at timestamptz not null default now()
);

create index if not exists project_workspace_posts_team_idx on public.project_workspace_posts(team_id, created_at);

create table if not exists public.project_meetings (
  id                     uuid primary key default gen_random_uuid(),
  team_id                uuid not null references public.project_teams(id) on delete cascade,
  room_name              text not null unique,
  scheduled_at           timestamptz not null default now(),
  status                 text not null default 'scheduled' check (status in ('scheduled','live','ended')),
  created_by_student_id  uuid not null references public.students(id) on delete cascade,
  created_at             timestamptz not null default now()
);

create index if not exists project_meetings_team_idx on public.project_meetings(team_id);

alter table public.project_teams           enable row level security;
alter table public.project_team_members    enable row level security;
alter table public.project_workspace_posts enable row level security;
alter table public.project_meetings        enable row level security;

-- project_teams and project_team_members each need to read the other to
-- decide visibility, and project_team_members' own "am I on this team"
-- check subqueries the SAME table. Direct cross-table subqueries in a
-- USING clause make Postgres re-evaluate the referenced table's policies,
-- which — because these two tables reference each other — creates a cycle
-- ("infinite recursion detected in policy for relation ..."). These
-- SECURITY DEFINER helpers break the cycle: their body runs as the
-- (superuser) function owner, which bypasses RLS entirely, so calling them
-- from inside a policy never re-triggers policy evaluation.
create or replace function public.my_project_team_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select team_id from public.project_team_members
  where student_id in (select id from public.students where parent_id = auth.uid());
$$;
grant execute on function public.my_project_team_ids() to authenticated;

create or replace function public.my_active_project_team_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select m.team_id
  from public.project_team_members m
  join public.project_teams t on t.id = m.team_id
  where m.status = 'approved'
    and t.status = 'active'
    and m.student_id in (select id from public.students where parent_id = auth.uid());
$$;
grant execute on function public.my_active_project_team_ids() to authenticated;

create or replace function public.project_team_status(p_team_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select status from public.project_teams where id = p_team_id;
$$;
grant execute on function public.project_team_status(uuid) to authenticated;

-- Teams: visible to a parent if their student created it, or is a
-- pending/approved member (pending so they can see what they asked to join).
drop policy if exists "project_teams via membership" on public.project_teams;
create policy "project_teams via membership" on public.project_teams
  for select to authenticated
  using (
    created_by_student_id in (select id from public.students where parent_id = auth.uid())
    or id in (select public.my_project_team_ids())
  );

-- A parent may start a team on behalf of their own student.
drop policy if exists "project_teams parent create" on public.project_teams;
create policy "project_teams parent create" on public.project_teams
  for insert to authenticated
  with check (created_by_student_id in (select id from public.students where parent_id = auth.uid()));

-- Discovery: any signed-in parent can browse teams still 'forming' for a
-- challenge, so their student has something to request to join. Team name
-- only — no student identities are exposed by this policy alone.
drop policy if exists "project_teams discover forming" on public.project_teams;
create policy "project_teams discover forming" on public.project_teams
  for select to authenticated using (status = 'forming');

-- Status transitions ('forming' -> 'active'/'completed') happen only via
-- project_team_maybe_activate() (security definer) below — no direct
-- client update policy is granted on project_teams.

-- Team members: a parent can see membership rows for any team their own
-- student belongs to (pending or approved), so they can see teammates.
drop policy if exists "project_team_members via team" on public.project_team_members;
create policy "project_team_members via team" on public.project_team_members
  for select to authenticated
  using (
    student_id in (select id from public.students where parent_id = auth.uid())
    or team_id in (select public.my_project_team_ids())
  );

-- Discovery: the *approved* roster of a still-'forming' team is visible to
-- any signed-in parent, so a family can see who they'd be teaming up with
-- before requesting to join. Other families' *pending* requests stay
-- private until you're a member of that same team.
drop policy if exists "project_team_members browse forming roster" on public.project_team_members;
create policy "project_team_members browse forming roster" on public.project_team_members
  for select to authenticated
  using (
    status = 'approved'
    and public.project_team_status(team_id) = 'forming'
  );

-- A parent may request THEIR OWN student to join a team (starts 'pending').
drop policy if exists "project_team_members request join" on public.project_team_members;
create policy "project_team_members request join" on public.project_team_members
  for insert to authenticated
  with check (
    student_id in (select id from public.students where parent_id = auth.uid())
    and status = 'pending'
  );

-- Core child-safety boundary: a parent may approve/remove ONLY their own
-- student's membership row — never another family's child.
drop policy if exists "project_team_members decide own child" on public.project_team_members;
create policy "project_team_members decide own child" on public.project_team_members
  for update to authenticated
  using (student_id in (select id from public.students where parent_id = auth.uid()))
  with check (
    student_id in (select id from public.students where parent_id = auth.uid())
    and status in ('approved','removed')
    and approved_by = auth.uid()
  );

-- Workspace + meetings only unlock once the team is fully 'active'
-- (every member approved) — checked server-side via RLS, not just in the UI.
drop policy if exists "project_workspace_posts via active team" on public.project_workspace_posts;
create policy "project_workspace_posts via active team" on public.project_workspace_posts
  for select to authenticated
  using (team_id in (select public.my_active_project_team_ids()));

drop policy if exists "project_workspace_posts post as own child" on public.project_workspace_posts;
create policy "project_workspace_posts post as own child" on public.project_workspace_posts
  for insert to authenticated
  with check (
    student_id in (select id from public.students where parent_id = auth.uid())
    and team_id in (select public.my_active_project_team_ids())
  );

drop policy if exists "project_meetings via active team" on public.project_meetings;
create policy "project_meetings via active team" on public.project_meetings
  for select to authenticated
  using (team_id in (select public.my_active_project_team_ids()));

drop policy if exists "project_meetings create in active team" on public.project_meetings;
create policy "project_meetings create in active team" on public.project_meetings
  for insert to authenticated
  with check (
    created_by_student_id in (select id from public.students where parent_id = auth.uid())
    and team_id in (select public.my_active_project_team_ids())
  );

-- Auto-add the team's creator as its first, already-approved member
-- (their own parent just created the team, so consent is implicit).
create or replace function public.project_team_add_creator()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  creator_name text;
  creator_gradient text;
begin
  select name, avatar_gradient into creator_name, creator_gradient
  from public.students where id = new.created_by_student_id;

  insert into public.project_team_members
    (team_id, student_id, student_display_name, student_avatar_gradient, status, approved_by, decided_at)
  values
    (new.id, new.created_by_student_id, coalesce(creator_name, 'Student'), creator_gradient, 'approved', auth.uid(), now())
  on conflict (team_id, student_id) do nothing;
  return new;
end;
$$;

drop trigger if exists project_teams_add_creator on public.project_teams;
create trigger project_teams_add_creator
  after insert on public.project_teams
  for each row execute function public.project_team_add_creator();

-- Flip a team to 'active' the moment every (non-removed) member is approved.
create or replace function public.project_team_maybe_activate()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  total    int;
  approved int;
begin
  select count(*) into total    from public.project_team_members where team_id = new.team_id and status <> 'removed';
  select count(*) into approved from public.project_team_members where team_id = new.team_id and status = 'approved';
  if total >= 2 and total = approved then
    update public.project_teams set status = 'active' where id = new.team_id and status = 'forming';
  end if;
  return new;
end;
$$;

drop trigger if exists project_team_members_maybe_activate on public.project_team_members;
create trigger project_team_members_maybe_activate
  after insert or update on public.project_team_members
  for each row execute function public.project_team_maybe_activate();

-- =====================================================================
-- PROJECT MODERATION
-- Lightweight safety reporting for cross-family Projects, plus the admin
-- read/override access needed to triage it. Reporting is deliberately easy
-- (any parent, about their own student, no team-status prerequisite) —
-- moderation should never be gated behind team membership state.
-- =====================================================================

do $$ begin
  alter table public.project_teams drop constraint if exists project_teams_status_check;
  alter table public.project_teams add constraint project_teams_status_check
    check (status in ('forming','active','completed','suspended'));
exception when others then null; end $$;

create table if not exists public.project_reports (
  id                  uuid primary key default gen_random_uuid(),
  team_id             uuid not null references public.project_teams(id) on delete cascade,
  post_id             uuid references public.project_workspace_posts(id) on delete set null,
  reporter_student_id uuid not null references public.students(id) on delete cascade,
  reported_by         uuid not null references auth.users(id),
  reason              text not null check (reason in ('inappropriate_content','harassment','safety_concern','spam','other')),
  details             text,
  status              text not null default 'open' check (status in ('open','reviewed','dismissed')),
  created_at          timestamptz not null default now()
);

create index if not exists project_reports_team_idx   on public.project_reports(team_id, created_at desc);
create index if not exists project_reports_status_idx on public.project_reports(status, created_at desc);

alter table public.project_reports enable row level security;

-- Any parent may report a team/post on behalf of their own student — never
-- gated by team status, so a concern can be raised even from a 'forming'
-- team before the workspace unlocks.
drop policy if exists "project_reports insert own child" on public.project_reports;
create policy "project_reports insert own child" on public.project_reports
  for insert to authenticated
  with check (
    reporter_student_id in (select id from public.students where parent_id = auth.uid())
    and reported_by = auth.uid()
  );

drop policy if exists "project_reports read own" on public.project_reports;
create policy "project_reports read own" on public.project_reports
  for select to authenticated
  using (reported_by = auth.uid());

drop policy if exists "project_reports admin read" on public.project_reports;
create policy "project_reports admin read" on public.project_reports
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "project_reports admin triage" on public.project_reports;
create policy "project_reports admin triage" on public.project_reports
  for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Admin visibility across ALL teams/rosters/posts, for triage — parents
-- otherwise only see teams their own student is connected to.
drop policy if exists "project_teams admin read" on public.project_teams;
create policy "project_teams admin read" on public.project_teams
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "project_team_members admin read" on public.project_team_members;
create policy "project_team_members admin read" on public.project_team_members
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "project_workspace_posts admin read" on public.project_workspace_posts;
create policy "project_workspace_posts admin read" on public.project_workspace_posts
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Admin override: suspend/reinstate a team (status), or remove a specific
-- member — independent of that member's own parent. This is the escalation
-- path when a report is confirmed.
drop policy if exists "project_teams admin moderate" on public.project_teams;
create policy "project_teams admin moderate" on public.project_teams
  for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "project_team_members admin moderate" on public.project_team_members;
create policy "project_team_members admin moderate" on public.project_team_members
  for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Seed a couple of starter challenges so /projects has content out of the box
insert into public.project_challenges (year, title, summary, brief, deliverable, difficulty)
values
  (3, 'Plan a Class Picnic Budget', 'Use place value and addition to plan a picnic for 20 people under a $50 budget.', 'Your team is organising a picnic for 20 classmates. Snacks cost different amounts per pack, and each pack feeds a set number of people. Work out how many packs of each snack to buy, add up the total cost, and make sure you stay under $50 — with as little food wasted as possible.', 'A shopping list with quantities and a total cost under $50, plus a one-paragraph explanation of your choices.', 'easy'),
  (5, 'Design a Fair Raffle', 'Apply fractions and probability to design a raffle that feels fair to every ticket buyer.', 'Your school fete is running a raffle with 3 prizes. Decide how many tickets to sell, how much each ticket costs, and how prizes are drawn, so the chance of winning is clear and fair. Explain the probability of winning at least one prize if someone buys 5 tickets.', 'A one-page raffle plan with the probability calculations shown.', 'medium'),
  (7, 'Model a Phone Plan', 'Use linear equations to compare real phone/data plans and recommend the best value one.', 'Find (or invent, using realistic numbers) three phone plans with different monthly fees and per-GB data costs. Write an equation for the total monthly cost of each plan based on data used, and recommend which plan is best for someone who uses about 6GB a month — showing your working.', 'A short comparison with one equation per plan and a written recommendation.', 'medium'),
  (9, 'Survey Your Street (Pythagoras)', 'Use Pythagoras'' theorem to measure a real diagonal distance you can''t measure directly.', 'Pick a real rectangular space near you (a room, a park, a court) where you can measure two sides but not the diagonal directly. Measure the two sides, calculate the diagonal using Pythagoras'' theorem, and describe how you would check your answer in real life.', 'Your two measurements, the calculated diagonal, and a short write-up with a diagram.', 'hard')
on conflict do nothing;
