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
  sent_at timestamptz not null default now()
);

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
  status text not null default 'new',
  created_at timestamptz not null default now()
);

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
create policy "topic_mastery via student"  on public.topic_mastery  for select using (student_id in (select id from public.students where parent_id = auth.uid()));
create policy "weekly_mastery via student" on public.weekly_mastery for select using (student_id in (select id from public.students where parent_id = auth.uid()));

-- Public forms: anon can INSERT only (no read exposed)
drop policy if exists "enquiries anon insert" on public.enquiries;
drop policy if exists "leads anon insert"     on public.leads;
create policy "enquiries anon insert" on public.enquiries for insert to anon, authenticated with check (true);
create policy "leads anon insert"     on public.leads     for insert to anon, authenticated with check (true);

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
