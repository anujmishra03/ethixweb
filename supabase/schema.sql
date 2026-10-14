-- Run in Supabase SQL Editor. Create an admin user under Authentication > Users first.
create extension if not exists pgcrypto;
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  company text not null default '',
  phone text not null default '',
  service text not null,
  budget text not null default '',
  message text not null check (char_length(message) between 10 and 3000),
  status text not null default 'new' check (status in ('new','in_progress','completed')),
  created_at timestamptz not null default now()
);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
alter table public.enquiries enable row level security;
-- Public visitors cannot read or update leads. Inserts are made only by the server's service role key.
-- Admin access is restricted to the exact email set in the JWT claim below. Replace with your admin email.
drop policy if exists "Admin can read enquiries" on public.enquiries;
create policy "Admin can read enquiries" on public.enquiries for select to authenticated
  using ((auth.jwt() ->> 'email') = 'itachimishra2@gmail.com');
drop policy if exists "Admin can update enquiries" on public.enquiries;
create policy "Admin can update enquiries" on public.enquiries for update to authenticated
  using ((auth.jwt() ->> 'email') = 'itachimishra2@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'itachimishra2@gmail.com');
-- No anon/authenticated INSERT policy: public submissions go through the rate-limited Express API.
