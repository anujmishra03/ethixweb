-- ==============================================================================
-- Ethixweb India — Production Supabase Schema & Row Level Security (RLS)
-- ==============================================================================
-- Execute this script in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Admin access is strictly enforced at the Postgres database layer.
-- Public anonymous visitors cannot query or tamper with enquiries.
-- Enquiries are created securely via the rate-limited backend using the service role key.
-- ==============================================================================

-- 1. Enable pgcrypto extension for cryptographic UUID generation
create extension if not exists pgcrypto;

-- 2. Create the core enquiries table with strict field constraints
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  company text not null default '',
  phone text not null default '',
  service text not null,
  budget text not null default '',
  message text not null check (char_length(message) between 10 and 3000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed')),
  created_at timestamptz not null default now()
);

-- 3. Create index on created_at for fast descending triage queries
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

-- 4. Enable Row Level Security
alter table public.enquiries enable row level security;

-- 5. Row Level Security Policies
-- Public / anonymous users: NO read or write access via the Supabase client.
-- Public form submissions are routed through the Express backend API (/api/enquiries),
-- which validates inputs, enforces honeypots, applies IP rate-limiting, and inserts
-- records using the private SUPABASE_SERVICE_ROLE_KEY.

-- Drop existing policies if updating
drop policy if exists "Admin can read enquiries" on public.enquiries;
drop policy if exists "Admin can update enquiries" on public.enquiries;

-- Policy 1: Authorised Administrators can read all enquiry records
create policy "Admin can read enquiries" on public.enquiries
  for select
  to authenticated
  using (
    (auth.jwt() ->> 'email') in ('itachimishra2@gmail.com', 'itachimishra@gmail.com')
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Policy 2: Authorised Administrators can update enquiry triage statuses
create policy "Admin can update enquiries" on public.enquiries
  for update
  to authenticated
  using (
    (auth.jwt() ->> 'email') in ('itachimishra2@gmail.com', 'itachimishra@gmail.com')
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  )
  with check (
    status in ('new', 'in_progress', 'completed')
  );

-- Note: No INSERT or DELETE policy is granted to public or anon roles.
-- This ensures zero lead data leakage and full spam immunity at the DB level.
