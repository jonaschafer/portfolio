-- Sounds: music blog entries with YouTube playback + streaming links
-- Run this migration in your Supabase project if the sounds table doesn't exist

create table if not exists public.sounds (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  date text not null,
  youtube_id text,
  note text,
  links jsonb default '{}',
  created_at timestamptz default now()
);

alter table public.sounds enable row level security;

create policy "Sounds are viewable by everyone"
  on public.sounds for select
  using (true);

create policy "Anyone can add sounds"
  on public.sounds for insert
  with check (true);
