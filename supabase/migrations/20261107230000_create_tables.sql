create table public.surveys (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  title text not null check (char_length(trim(title)) between 1 and 100),
  category text not null check (category in (
    'Team Activities', 'Health & Wellness', 'Gaming & Entertainment',
    'Education & Learning', 'Lifestyle & Preferences', 'Technology & Innovation'
  )),
  description text,
  end_date date
);

create table public.questions (
  id bigint generated always as identity primary key,
  survey_id bigint not null references public.surveys (id) on delete cascade,
  position bigint not null check (position >= 1),
  text text not null check (char_length(trim(text)) between 1 and 150),
  allow_multiple boolean not null default false,
  unique (survey_id, position)
);

create table public.answer_options (
  id bigint generated always as identity primary key,
  question_id bigint not null references public.questions (id) on delete cascade,
  position bigint not null check (position >= 1),
  text text not null check (char_length(trim(text)) between 1 and 80),
  votes bigint not null default 0 check (votes >= 0),
  unique (question_id, position)
);
