-- /row: rowing workouts synced from Strava, plus the advice written for each.
-- PRs aren't stored; lib/row/records.js derives them from the streams in order.

create table if not exists public.row_workouts (
  id bigint primary key,                 -- Strava activity id
  name text not null,
  start_local timestamp not null,        -- the activity's local wall-clock time
  distance real not null,                -- meters
  moving_time integer not null,          -- seconds
  avg_watts real,
  avg_spm real,
  calories integer,
  laps jsonb not null default '[]',      -- [{ time, distance, watts, spm }]
  stream jsonb not null default '{}',    -- { t: [], d: [], spm: [], w: [] }
  notes text,                            -- the Strava description
  advice jsonb,                          -- see lib/row/advice.js for the shape
  advice_notes text,                     -- the notes the advice was written from
  notified jsonb not null default '[]',  -- PR keys already pushed, so retries don't double-notify
  updated_at timestamptz not null default now()
);

create index if not exists row_workouts_start_idx on public.row_workouts (start_local);

-- Small key/value store. Holds Strava's latest refresh token, which rotates.
create table if not exists public.row_state (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.row_workouts enable row level security;
alter table public.row_state enable row level security;

-- The page is public, so reads are too. Writes go through the service role only.
create policy "Rows are viewable by everyone"
  on public.row_workouts for select
  using (true);
