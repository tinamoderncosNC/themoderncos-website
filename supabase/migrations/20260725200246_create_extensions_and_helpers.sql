-- Extensions and shared helper functions used across later migrations.
--
-- Postgres 13+ has gen_random_uuid() built into core, so pgcrypto isn't
-- needed for the id defaults below. It's enabled anyway for digest()/hmac(),
-- which access_events (Increment 6) needs to store hashed IPs, not raw ones.
create extension if not exists "pgcrypto" with schema "extensions";

-- Generic updated_at maintenance trigger, reused by every table below that
-- has an updated_at column.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
