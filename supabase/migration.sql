-- Run this in the Supabase SQL editor (or via `supabase db push`) to set up
-- the tables the RSVP form and reminder cron job depend on.

create table if not exists registrants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  age_group text,
  reminders_sent text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Run this if `registrants` already exists from an earlier migration:
alter table registrants add column if not exists age_group text;

create table if not exists reminder_log (
  id uuid primary key default gen_random_uuid(),
  registrant_id uuid references registrants(id) on delete cascade,
  milestone text not null,
  error text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security: only the service role (used server-side) may read or
-- write these tables. The site's API routes always use the service role
-- key, so no anon-key policies are needed.
alter table registrants enable row level security;
alter table reminder_log enable row level security;
