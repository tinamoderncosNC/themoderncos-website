-- Local/dev seed data only — run automatically by `supabase db reset`.
-- /references was empty at the time this was written (see DECISIONS.md,
-- "Product content inventory"), so every text field below is a labeled
-- placeholder, not real product copy, and must not be mistaken for it.

with seeded_product as (
  insert into public.products (slug, name, summary, status)
  values (
    'found-by-ai',
    'Found by AI',
    '[PLACEHOLDER — product summary pending real copy]',
    'active'
  )
  returning id
),
seeded_version as (
  insert into public.product_versions (product_id, version_label, is_current, changelog)
  select id, 'v1.0', true, '[PLACEHOLDER — changelog pending real copy]'
  from seeded_product
  returning id
)
insert into public.product_content (product_version_id, prompt_body, usage_guidance, license_terms)
select
  id,
  '[PLACEHOLDER — proprietary prompt body pending real content]',
  '[PLACEHOLDER — usage guidance pending real content]',
  '[PLACEHOLDER — license/redistribution terms pending real content]'
from seeded_version;

-- No product_resources row is seeded: it would need a storage_path pointing
-- at a real file in Supabase Storage, and none exists yet. Add one once a
-- real downloadable resource is uploaded.
