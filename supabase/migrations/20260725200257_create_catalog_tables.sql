-- Catalog schema: products, product_versions, product_content,
-- product_resources. See DECISIONS.md ("Data model") for the role each
-- table plays and why product_content/product_resources are locked down
-- with no public policies yet.

-- ---------------------------------------------------------------------------
-- products — catalog metadata only. No sensitive content lives here, so it's
-- safe to expose the "active" rows publicly for listing/slug pages.
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create trigger set_products_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();

-- Public catalog pages (Increment 3) read only active products. Draft and
-- archived rows are visible only via the service-role key (admin/dashboard
-- use), since there is no admin UI yet.
create policy "products_select_active"
  on public.products for select
  to anon, authenticated
  using (status = 'active');

-- ---------------------------------------------------------------------------
-- product_versions — versioned content container per product. Metadata only
-- (label, changelog, current flag) — the prompt body itself lives in
-- product_content, one row per version.
-- ---------------------------------------------------------------------------
create table public.product_versions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  version_label text not null,
  is_current boolean not null default false,
  changelog text,
  created_at timestamptz not null default now()
);

-- Only one current version per product.
create unique index product_versions_one_current_per_product
  on public.product_versions (product_id)
  where is_current;

alter table public.product_versions enable row level security;

-- Version metadata is non-sensitive (no prompt body here) and readable
-- alongside its parent product, once that product is active.
create policy "product_versions_select_for_active_product"
  on public.product_versions for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products
      where products.id = product_versions.product_id
        and products.status = 'active'
    )
  );

-- ---------------------------------------------------------------------------
-- product_content — the proprietary prompt body, usage guidance, and license
-- terms. RLS is enabled with NO policies below, which denies all access to
-- the anon and authenticated roles by default; only the service-role key
-- (used server-side, after an application-level entitlement check) can read
-- or write these rows. The entitlements table and its has_active_entitlement()
-- function don't exist until Increment 5 — the real "verified purchaser"
-- read policy is added there, backing up (not replacing) the server-side
-- check described in DECISIONS.md. Until then this table is correctly
-- unreadable through the public API, which is the safe default.
-- ---------------------------------------------------------------------------
create table public.product_content (
  id uuid primary key default gen_random_uuid(),
  product_version_id uuid not null unique references public.product_versions (id) on delete cascade,
  prompt_body text not null,
  usage_guidance text,
  license_terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_content enable row level security;

create trigger set_product_content_updated_at
  before update on public.product_content
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- product_resources — downloadable file metadata, pointing at private
-- Supabase Storage paths (never public URLs). Same lockdown rationale as
-- product_content: RLS enabled, no policies until Increment 5.
-- ---------------------------------------------------------------------------
create table public.product_resources (
  id uuid primary key default gen_random_uuid(),
  product_version_id uuid not null references public.product_versions (id) on delete cascade,
  label text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

alter table public.product_resources enable row level security;
