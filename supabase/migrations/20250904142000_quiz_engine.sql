-- Basic quiz engine tables
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  created_at timestamptz default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade,
  body text not null,
  ordinal int not null default 0
);

create table if not exists public.quiz_choices (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references public.quiz_questions(id) on delete cascade,
  body text not null,
  is_correct boolean default false
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  score int not null default 0,
  started_at timestamptz default now(),
  completed_at timestamptz
);

-- RLS suggestions
-- alter table public.quizzes enable row level security;
-- create policy "read_quizzes" on public.quizzes for select using (true);
-- alter table public.quiz_questions enable row level security;
-- create policy "read_questions" on public.quiz_questions for select using (true);
-- alter table public.quiz_choices enable row level security;
-- create policy "read_choices" on public.quiz_choices for select using (true);
-- alter table public.quiz_attempts enable row level security;
-- create policy "insert_attempts" on public.quiz_attempts for insert to authenticated with check (auth.uid() = user_id);
-- create policy "read_attempts_owner" on public.quiz_attempts for select to authenticated using (auth.uid() = user_id);

