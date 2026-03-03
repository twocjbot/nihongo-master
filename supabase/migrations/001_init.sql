create table user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  jlpt_level text default 'N5',
  xp integer default 0,
  streak_days integer default 0,
  last_study_date date,
  daily_goal_minutes integer default 10,
  created_at timestamptz default now()
);

create table srs_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  card_type text not null,
  card_id text not null,
  due_date timestamptz default now(),
  interval_days float default 1,
  ease_factor float default 2.5,
  reviews integer default 0,
  lapses integer default 0,
  unique(user_id, card_type, card_id)
);

create table study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  session_type text,
  cards_reviewed integer default 0,
  correct integer default 0,
  duration_ms integer,
  created_at timestamptz default now()
);
