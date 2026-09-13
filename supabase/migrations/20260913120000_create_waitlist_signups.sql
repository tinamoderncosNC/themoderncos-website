-- waitlist_signups: public, anonymous lead capture for the three paid
-- Products-page tiers while real checkout (Lemon Squeezy, see Architecture
-- section of DECISIONS.md, still Increment 5) isn't built yet. Card 1 (the
-- free Ops Leak Scorecard) is intentionally excluded — it's tied to the
-- separate Scorecard popup work, not this table.
--
-- RLS: insert-only for anon/authenticated. No select/update/delete policy
-- exists at all, which denies read access entirely by default (same
-- "safe default" pattern as product_content in the catalog migration) —
-- only the service-role key (Supabase dashboard, or a future export job)
-- can read collected emails back. tier_name/tier_price are constrained via
-- CHECK to the three real paid tiers, so a direct REST call using the
-- public anon key can't seed arbitrary junk rows into the table.
create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  tier_name text not null check (
    tier_name in (
      'GEO/AEO Content Prompt Builder',
      'Full Prompt-Builder Bundle',
      'Bundle + Workflow Tier Diagnostic'
    )
  ),
  tier_price text not null check (tier_price in ('$25', '$35', '$49')),
  created_at timestamptz not null default now()
);

alter table public.waitlist_signups enable row level security;

-- Stops the same email from stacking duplicate rows for the same tier (a
-- double-submitted form, a retried request) without blocking one visitor
-- from joining more than one tier's waitlist. The client treats the
-- resulting unique-violation as a success, not an error — see
-- waitlist-cta.tsx.
create unique index waitlist_signups_email_tier_unique
  on public.waitlist_signups (email, tier_name);

create policy "waitlist_signups_insert_anyone"
  on public.waitlist_signups for insert
  to anon, authenticated
  with check (true);
