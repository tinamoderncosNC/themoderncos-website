# DECISIONS.md

Living record of Stage A decisions and open items for the Modern CoS product-sales site ("Found by AI" and future prompt products). Update as decisions change; never delete history, mark superseded entries instead.

## Roles (per code-review process, `/security/code-review-prompt-package (2).md`)

- **Approver** (reviews and locks every increment): Tina Biello
- **Owner** (holds production credentials — Supabase, Lemon Squeezy, Netlify, GitHub, GoDaddy DNS): Tina Biello
- If either changes, stop and update this file before locking further increments.

## Domain & site scope

- This Next.js app **is** themoderncos.com in its entirety — not a subpath bolted onto an existing separately-hosted site. No integration/proxy layer needed.
- The protected content area lives at `/library` exactly as originally specified — there is no naming collision, since the whole site (not just a "/library" slice of it) is this codebase.
- **Version control deferred by explicit instruction:** no `git init` / GitHub repo yet. Work stays local ("staging") until told otherwise. This means the STACK requirement of "private GitHub repo" and any deploy-from-repo steps in DEPLOYMENT.md are written as pending setup steps, not yet executed. Flagged so it isn't forgotten before go-live.

## Brand inventory (Stage A, confirmed)

- `TheModernCoS_Brand_Guide.docx` v1.0 matches the locked spec in-prompt exactly (Navy #052439 primary, Coral #E0705D accent, Poppins headings / Inter body, voice rules, trademark statuses for CoS Scan™, CoS Sprint™, Ops Intake™, CoS on Call™ verified; The Ops Seat™ / The CoS Method™ pending — not used publicly).
- Off-white #F7F5F2, muted text #5C5C5C, hairline #D9D9D9 are **provisional neutrals**, not verified brand assets — used as CSS tokens but documented as provisional in the design-system increment.
- Master logo (`Modern CoS LLC Official Logo.png`) is a flattened **square** PNG with the "Automate • Optimize • Grow" tagline baked into the raster. Used directly (never recreated) in header/footer, never below 150px wide, with clear space = height of the "C" in CoS.
- **No cropped coral "CoS"-only mark exists.** Per explicit instruction, not cropped/recreated by the assistant. **Decision: ship v1 with a labeled placeholder favicon/app-icon/social-avatar**, clearly marked as temporary, swapped in later without a rebuild (single icon asset reference, no code changes needed when the real mark arrives).

## Product content inventory

- `/references` is **empty** — no supplied copy, pricing, FAQs, screenshots, video link, or resources for "Found by AI." All product-specific content ships as clearly labeled placeholders (e.g. `[PLACEHOLDER — pending product content]`) until real material is supplied. No invented claims, testimonials, or certifications.

## Security package

- `/security/code-review-prompt-package (2).md` is the process document referenced by the mandatory build process (Stage A/B/C, Definition of Done, review battery, Conditional Test Checklist, report spec) — not a separate technical security spec. It contains no CSP domain list, RLS policy specifics, or rate-limit thresholds beyond what's already in the build prompt's SECURITY BASELINE section, which is treated as the technical spec. Where the process doc is stricter on **process** (e.g., "stop and ask if Approver/Owner unset," "don't lock without sign-off"), it governs.
- This process doc will be committed as `CLAUDE.md` at repo root once git is initialized (deferred per above).

## Architecture

**Framework:** Next.js (App Router, TypeScript strict) + Tailwind, deployed on Netlify (`@netlify/plugin-nextjs`), Supabase (Postgres + Auth + Storage + RLS), Lemon Squeezy (one-time purchases now; schema is subscription-ready so a future all-access plan requires no schema rebuild — only new `plans` rows, subscription checkout UI, and an entitlement-issuing branch in the existing webhook handler).

**Rendering approach:** Public marketing/product pages are statically generated or ISR'd from `products`/`product_versions` (non-sensitive columns only). Protected library pages and any resource-signing endpoints are Server Components / Route Handlers that run the entitlement check server-side on every request — never a client-side boolean or hidden route.

**Content boundary enforcement:** `product_content` (the actual proprietary prompt) is never fetched by any code path that doesn't first verify an active entitlement server-side. It has its own RLS policy keyed to a `has_active_entitlement(profile_id, product_id)` SQL function — so even a bug in application code can't leak rows through direct table access. It's fetched only inside the `/library/[productSlug]` Server Component, never included in props passed to client components beyond what's rendered, never in JSON-LD, sitemap, or logs.

**Open items not blocking Stage A sign-off** (needed before their respective increment locks, will ask when reached):

- Video host choice (Vimeo / Loom / unlisted YouTube) — needed for increment 6 (library page) and its CSP entry.
- Auth method (magic link vs. password) — needed for increment 4.
- Analytics tool, if any — no tool named in the prompt; CSP will omit an analytics domain entirely until one is specified (not inventing one).
- Rate-limiting backend: proposing **Upstash Redis** (free tier, low-latency, standard pairing with Netlify Edge Functions) as a **new dependency** — flagging per the "don't add a dependency silently" guardrail. Alternative is a Postgres-backed counter table (no new vendor, adds per-request DB round-trips and is weaker under distributed edge traffic). Will confirm with Approver at increment 8 rather than deciding unilaterally now.

## Route map

**Public:** `/`, `/products`, `/products/[slug]`, `/how-it-works`, `/services`, `/about`, `/contact`, `/login`, `/privacy`, `/terms`, `/refund-policy`, `/ai-use-and-responsibility`

**Protected:** `/library`, `/library/[productSlug]`, `/account`, `/account/billing`

**System:** `/auth/callback` (Supabase auth callback), `/api/webhooks/lemon-squeezy` (signature-verified, idempotent), `/api/checkout/[productSlug]` (creates LS checkout session server-side, no price logic client-side), `/api/library/resource/[resourceId]` (entitlement check → short-lived Supabase signed URL), `/api/contact` (rate-limited, validated)

All protected/account/callback/checkout-return/system routes are `noindex`.

## Data model

Minimum entities per the brief, with the roles each plays:

- **profiles** — 1:1 with `auth.users`, basic identity fields.
- **products** — catalog metadata only (slug, name, status, summary). No sensitive content lives here — safe to read publicly for listing/slug pages.
- **product_versions** — versioned content container per product; `is_current` flag; changelog.
- **product_content** — the proprietary prompt body, usage guidance, license terms. Locked down (see Architecture section above). Never joined into any publicly-queryable view.
- **product_resources** — downloadable file metadata, pointing at private Supabase Storage paths (never public URLs).
- **payment_customers** — links a profile to a Lemon Squeezy customer ID. No card data.
- **orders** / **order_items** — purchase history, immutable once written (refunds change entitlements, not the historical order record).
- **plans** — future subscription plan definitions; can exist in a `planned` status pre-launch with no UI exposing them yet.
- **subscriptions** — subscription state mirrored from Lemon Squeezy webhooks.
- **entitlements** — the single access-control table everything else feeds: `profile_id`, nullable `product_id` (null = all-products grant, e.g. subscription/bundle), `source` (order / subscription / admin_grant), nullable `source_id`, `granted_at`, nullable `expires_at`, nullable `revoked_at` + `revoke_reason`, `status`. Supports single-product ownership, bundles (one row per included product), time-limited access (`expires_at`), subscription access (`product_id` null, `expires_at` = current period end, refreshed by webhook), revocation and refund-driven changes (`revoked_at`/`revoke_reason`, row kept — never deleted), and admin grants (`source = admin_grant`). Purchase history is never deleted on archival; only `products.status` moves to `archived`.
- **webhook_events** — raw Lemon Squeezy event log keyed by the provider's event ID for idempotency; records signature-verification result and processing outcome.
- **access_events** — audit log of protected-content views/copies/downloads/video plays, IP stored hashed (not raw), supports the "log access, never the content" requirement.
- **contact_inquiries** — validated, rate-limited contact form submissions.

RLS is enabled on every table except `products`/`product_versions` metadata columns needed for public catalog pages (which themselves contain no sensitive data — the sensitive body lives only in `product_content`).

## Security-sensitive flows (summary — full detail in SECURITY.md at Stage B)

1. **Checkout:** server-side route creates a Lemon Squeezy checkout session using a server-only API key; user is redirected to LS-hosted checkout. No price is rendered on our site. No entitlement is granted here.
2. **Webhook:** verify HMAC signature before parsing payload → check `webhook_events` for the event ID (idempotency) → only then create/update orders, entitlements, subscriptions. This is the **only** place entitlements are granted, changed, or revoked — never the checkout-success redirect page, which only displays current state.
3. **Protected content read:** Server Component resolves the authenticated user server-side, checks `entitlements` for an active row, and only then queries `product_content`. RLS backs this up independently.
4. **Signed downloads:** same entitlement check, then a short-lived (5–10 min) Supabase Storage signed URL is issued — files are never proxied through the app and never public.
5. **CSRF/cookies:** Server Actions get Next.js's built-in origin checking; the contact/checkout API routes add explicit origin/CSRF checks; Supabase session cookies are HttpOnly/Secure/SameSite=Lax via the Supabase SSR helper.
6. **CSP:** scoped to Supabase project domain, Lemon Squeezy checkout domain, and the video host once chosen — no analytics domain added until one is named.

## Increment breakdown (Stage B)

Each gets its own Definition of Done and applicable Conditional Test Checklist items at build time, per the mandatory process. No increment is locked without Approver sign-off.

0. **Project scaffold** — Next.js + TS strict + Tailwind init, ESLint/Prettier, `.env.example`, Netlify config skeleton, base layout shell. No data yet.
1. **Design system & shared layout** — header/footer with master logo file, placeholder favicon, nav, skip link, focus styles, color/type tokens (flagging provisional neutrals), accessible components baseline.
2. **Catalog schema + RLS** — `profiles`, `products`, `product_versions`, `product_content`, `product_resources` migrations + RLS policies; seed one placeholder "Found by AI" product row.
3. **Public marketing pages** — `/`, `/products`, `/products/[slug]`, `/how-it-works`, `/services`, `/about`, `/contact` (display only) + sitemap/robots/canonical/OG + JSON-LD for what's actually on-page.
4. **Auth** — Supabase Auth, `/login`, `/auth/callback`, `/account`, server-side protected-route pattern.
5. **Payments schema + Lemon Squeezy integration** — `payment_customers`, `orders`, `order_items`, `subscriptions`, `plans`, `entitlements`, `webhook_events` + RLS; checkout route; webhook handler with signature verification + idempotency; refund/dispute handling.
6. **Protected library delivery** — `/library`, `/library/[productSlug]`, copy-to-clipboard with confirmation, video embed, signed resource downloads, `access_events` logging, version/last-updated, related products, consulting CTA.
7. **Contact flow** — `/contact`, `/api/contact`, `contact_inquiries`, validation + spam protection.
8. **Rate limiting & hardening pass** — login/checkout/contact/protected-content, chosen backend (Upstash vs. DB-based — Approver decides at this increment), CSP finalized, generic public errors + server-side logging.
9. **Legal/policy pages** — `/privacy`, `/terms`, `/refund-policy`, `/ai-use-and-responsibility` — placeholder legal copy, explicitly flagged as not legal advice/approval.
10. **SEO/GEO polish + llms.txt + accessibility audit** — final sitemap/robots pass, draft `llms.txt` (labeled experimental, no protected content/routes), WCAG 2.2 AA pass.

Subscription **UI** (plan selection, subscription checkout, all-access upsell) is intentionally **not** built in v1 — the schema supports it, but building the UI now would be overbuilding ahead of need.

## Stage A sign-off

Approved by Tina Biello (Approver) on 2026-07-25: architecture, route map, data model, roles, and brand/content inventory as documented above. Increment 0 build authorized to start.

## Increment 0 — Project scaffold (built, pending Approver lock)

**What was built:**

- Next.js 16.2.11 (App Router, Turbopack), React 19, TypeScript strict, Tailwind v4 — scaffolded via `create-next-app` into a temp folder then merged into repo root (root already held `DECISIONS.md`/`brand`/`references`/`security`, so it couldn't target the root directly).
- ESLint (flat config, `eslint-config-next` + `eslint-config-prettier` so the two don't fight) and Prettier (`prettier-plugin-tailwindcss` for class sorting) — both passing clean. Added `typecheck`, `format`, `format:check` npm scripts alongside the default `dev`/`build`/`start`/`lint`.
- `.env.example` — placeholders for site URL, Supabase, Lemon Squeezy; no real values; comments note which increment introduces each var.
- `netlify.toml` — `@netlify/plugin-nextjs`, build command, publish dir. Actual env vars set in the Netlify dashboard per deploy context, not committed.
- Base layout shell: `src/app/layout.tsx`, `src/components/site-header.tsx`, `site-footer.tsx`, `skip-link.tsx`, `src/app/globals.css`. Poppins (600/700) + Inter (400/500) self-hosted via `next/font/google`. Tailwind `@theme` tokens for navy/coral (locked) and off-white/muted/hairline (flagged provisional in a code comment, matching the brand-inventory flag above). Master logo file copied into `public/brand/modern-cos-logo.png` and rendered via `next/image` in header (~176px) and footer (~160px) — both above the 150px floor, never recreated. Skip link, keyboard-focus styles, and heading font rules (`h1`–`h3` → Poppins bold) are wired at the layout level so every future page inherits them.
- Placeholder favicon/app icon: `src/app/icon.tsx` + `apple-icon.tsx` generate a plain solid navy square (no attempt at the coral mark) — explicitly commented as a stand-in to swap for the real cropped asset later, per the brand-inventory decision above. Replaced Next.js's own default favicon and boilerplate SVGs/homepage, which were unrelated to this project.
- Homepage (`src/app/page.tsx`) is an honest, labeled placeholder — no invented marketing copy; real marketing content is Increment 3's job.
- `CLAUDE.md` now holds the actual process rules (Section 1 of the security-package doc) instead of the auto-generated Next.js stub; `AGENTS.md` (Next.js's own version-specific agent note) kept alongside it.
- Note: this increment's "base layout shell" absorbed most of what Increment 1 ("Design system & shared layout") originally scoped — header/footer/skip-link/tokens/fonts are already done. Increment 1's remaining scope narrows to real nav links and a broader accessible-component baseline (buttons, form fields) once Increment 3's routes exist.

**Dependency security note:** `npm audit` initially reported 12 high-severity advisories, all transitive (eslint's `minimatch`/`brace-expansion` chain — build-time only; `postcss` and `sharp` bundled inside Next's own dependency tree). `npm audit fix --force`'s suggested fix was downgrading to `next@9.3.3`, which would be a severe regression, not a real fix. Instead added targeted `overrides` in `package.json` (`sharp@^0.35.3`, `postcss@^8.5.23`, `minimatch@^10.2.5`, `brace-expansion@^5.0.8`) forcing patched versions without downgrading Next/ESLint. Re-verified `npm run build` still succeeds after the overrides. `npm audit` now reports 0 vulnerabilities. Sharp matters most here since it runs at request time in production for `next/image` optimization; the others are dev-tooling only.

**Verification:** `npm run typecheck`, `npm run lint`, `npm run format:check`, and `npm run build` all pass clean. Dev server started and the homepage was checked in a real headless-Chromium browser (desktop + mobile viewports, keyboard-focus skip-link state) via Playwright — renders correctly, brand colors/fonts/logo all correct, zero console errors. Screenshots are in the session scratchpad, not committed to the repo.

**Review battery:**

| Item                                    | Status                               | Note                                                                                                                                                                                                                                                                                  |
| --------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Extra security pass                     | ✅ done                              | No secrets in code; `.env.example` is placeholder-only; no dynamic input surface exists yet in this increment; dependency vulnerabilities resolved (see above), confirmed via `npm audit` → 0 found.                                                                                  |
| API input trust boundary                | N/A                                  | No API routes or user input exist yet — first arrives in Increment 5 (checkout/webhook) and Increment 7 (contact); trust boundary gets defined there.                                                                                                                                 |
| Rate limiting                           | N/A                                  | No endpoints to rate-limit yet. Backend choice (Upstash vs. Postgres-backed) stays an open item for Increment 8 per the architecture section above.                                                                                                                                   |
| Fake account / spam / abuse protection  | N/A                                  | No auth or forms yet — Increments 4 and 7.                                                                                                                                                                                                                                            |
| Performance                             | ✅ done (for this increment's scope) | Homepage is static/prerendered; fonts self-hosted via `next/font` (no external font request blocking render); logo served through `next/image`. ⚠️ still needed: N+1/index review once the database exists (Increment 2+); image-format/size tuning once real product imagery exists. |
| Migrations                              | N/A                                  | No database yet — introduced Increment 2.                                                                                                                                                                                                                                             |
| Input validation / basic bot protection | N/A                                  | No forms or inputs yet.                                                                                                                                                                                                                                                               |

**Conditional Test Checklist (this increment):**

| Item                                             | Status          | Note                                                                                                                                                  |
| ------------------------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login and password reset                         | N/A             | Increment 4.                                                                                                                                          |
| Real credit card payments                        | N/A             | Increment 5.                                                                                                                                          |
| SSL on a real domain                             | ⚠️ still needed | Deferred to go-live; DNS/Netlify steps land in `DEPLOYMENT.md`.                                                                                       |
| Separate development and production environments | ⚠️ still needed | `netlify.toml` is in place; per-context env var setup (production vs. deploy previews) is a Netlify-dashboard step for Increment 8 / `DEPLOYMENT.md`. |
| API keys not exposed anywhere                    | ✅ done         | None exist yet beyond documented placeholders in `.env.example`; nothing client-exposed.                                                              |
| Production database backups verifiable           | N/A             | No database yet.                                                                                                                                      |
| Email verification                               | N/A             | Increment 4.                                                                                                                                          |
| Rate limiting                                    | N/A             | See battery above.                                                                                                                                    |
| Input validation                                 | N/A             | See battery above.                                                                                                                                    |
| Basic bot protection                             | N/A             | See battery above.                                                                                                                                    |

**Status:** 🔒 **Locked** by Tina Biello (Approver) on 2026-07-25. Decision: since the base layout shell already absorbed most of Increment 1's original scope, skip straight to Increment 2 (catalog schema + RLS) rather than building Increment 1 as its own step. Increment 1's remaining narrow scope (real nav links, broader accessible-component baseline) will fold into Increment 3 when those routes exist.

## Increment 2 — Catalog schema + RLS (built, pending Approver lock)

**Environment constraint:** this session has no Docker (no local Supabase stack) and no local Postgres, so the migrations below could not be executed. Tina chose "write migrations now, verify later" — they're based on careful manual review only and are explicitly flagged execution-untested until applied against a real Supabase project (`supabase link` + `supabase db push`, or `supabase start` with Docker). This is a real gap versus the process's migration Definition-of-Done item, not a formality — it's called out plainly in the battery below rather than marked done.

**What was built** (`supabase/` — initialized via `supabase init`, `project_id` set to `themoderncos-website`):

- `migrations/20260725200246_create_extensions_and_helpers.sql` — enables `pgcrypto` (kept for `digest()`/`hmac()` needed by Increment 6's hashed-IP `access_events`, not for UUID generation — Postgres 13+ has `gen_random_uuid()` in core) and a shared `set_updated_at()` trigger function reused by every table with an `updated_at` column.
- `migrations/20260725200252_create_profiles.sql` — `profiles` (1:1 with `auth.users`), RLS restricting select/update to the owning user only, and a `security definer` `handle_new_user()` trigger on `auth.users` that auto-creates the profile row on signup. (The login/signup UI is still Increment 4 — this is just the data-integrity mechanism, needed the moment any user is created regardless of when the UI ships.)
- `migrations/20260725200257_create_catalog_tables.sql` — `products` (RLS: public select only where `status = 'active'`), `product_versions` (metadata only; partial unique index enforcing one `is_current` row per product; public select mirrors the parent product's active status), `product_content` and `product_resources` (RLS **enabled with zero policies** — this denies anon/authenticated access entirely by default; only the service-role key, used server-side, can reach these rows until Increment 5 adds the real `has_active_entitlement()`-backed policy once `entitlements` exists). This matches the content-boundary design in the Architecture section above without referencing tables that don't exist yet.
- `seed.sql` — one placeholder "Found by AI" product (`status = 'active'`) with one current version and placeholder `product_content`. Every text field is literally labeled `[PLACEHOLDER — ...]` since `/references` is still empty — none of it is real product copy. No `product_resources` row seeded (would need a real Storage file, which doesn't exist).

**Manual review findings:** none — checked FK references, RLS role/policy syntax, trigger/function ordering across the three migration files (helpers before profiles before catalog, since both later files call `set_updated_at()`), the partial unique index condition, and the `search_path`-hardening on both `security definer`/`security invoker` functions. No changes needed.

**Review battery:**

| Item                                    | Status  | Note                                                                                                                                                                                                                                                                                                           |
| --------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Extra security pass                     | ✅ done | `product_content`/`product_resources` default-deny by design (RLS on, no policies) rather than a permissive policy referencing tables that don't exist yet. `handle_new_user()` is `security definer` with `search_path = ''` and fully schema-qualified, avoiding search-path hijacking. No secrets involved. |
| API input trust boundary                | N/A     | No API routes consume this schema yet — Increment 3 (public reads) and Increment 5/6 (entitlement-gated reads) are where a trust boundary gets exercised.                                                                                                                                                      |
| Rate limiting                           | N/A     | No endpoints yet.                                                                                                                                                                                                                                                                                              |
| Fake account / spam / abuse protection  | N/A     | `handle_new_user()` only fires on real `auth.users` inserts, which don't exist until Increment 4 wires up signup.                                                                                                                                                                                              |
| Performance                             | ✅ done | Indexes: primary keys, the `products.slug` unique index, and the partial unique index on `product_versions(product_id) where is_current` for the one-current-version constraint. No N+1 risk yet since nothing queries this schema from the app yet.                                                           |
| Migrations                              | ✅ done | **Applied and verified against a real project** (see below) — no longer execution-untested.                                                                                                                                                                                                                    |
| Input validation / basic bot protection | N/A     | No user-facing input yet.                                                                                                                                                                                                                                                                                      |

**Live verification (2026-07-25):** Tina created a Supabase project (`oqthoigllspxnhnvqdbk`) and ran all three migrations plus `seed.sql` herself via the Dashboard SQL Editor (all succeeded). Using only the project URL and anon public key — both meant to be public/client-safe, no service-role key or DB password was ever exchanged — verified live against the real REST API:

- `GET products` → returns the one seeded `status = 'active'` row. ✅ public catalog read works.
- `GET product_versions` → returns the seeded `v1.0` row. ✅ metadata read works.
- `GET product_content` → **returns `[]`, not the prompt body.** ✅ the non-negotiable content boundary holds on a live database, not just on paper.
- `GET product_resources` → returns `[]`. ✅ same lockdown confirmed.
- `GET profiles` → returns `[]` (no anon session). ✅.
- `POST products` (attempted insert as anon) → `401`, `"new row violates row-level security policy for table \"products\""`. ✅ writes correctly denied.
- `PATCH products` (attempted tamper of the seeded row's name) → `204`/0 rows affected; re-fetched the row afterward and confirmed the name was untouched. ✅ no silent partial write.
- `GET product_content?select=prompt_body` (column-scoped query, checking for a filter-bypass) → still `[]`. ✅ no bypass via column selection.

Real credentials now live in `.env.local` (gitignored, never committed): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_KEY` is still unset — not needed until Increment 5 (webhook handler, signed URLs) and deliberately not requested before then.

Also installed `@supabase/supabase-js` and `@supabase/ssr` (client SDK + Next.js App Router cookie/session helper) — both already scoped in the Architecture section above, needed starting with Increment 4 (or once `/products` is unblocked).

**Conditional Test Checklist (this increment):** unchanged from Increment 0 — still N/A across the board except the same two ⚠️ items (SSL on a real domain, separate dev/prod environments), both deferred to go-live per `DEPLOYMENT.md`.

**Status:** 🔒 **Locked** by Tina Biello (Approver) on 2026-07-25. Every battery item is now ✅ or correctly N/A — migrations are applied and live-verified, not just reviewed. `/products` and `/products/[slug]` (held back from Increment 3a) are now unblocked.

## Increment 3a — Static marketing pages (built, pending Approver lock)

Scoped down from the original Increment 3 at Tina's direction: `/products` and `/products/[slug]` (the catalog-dependent pages) are held until Supabase is actually connected, since they'd otherwise stack a second layer of execution-untested code on top of Increment 2's unverified migrations. Everything below has no database dependency and is fully verified.

**What was built:**

- `/how-it-works`, `/services`, `/about` — all render a shared `MarketingPlaceholderPage` component (`src/components/marketing-placeholder-page.tsx`) rather than three copies of the same markup, since `/references` still has no real copy for any of them (see "Product content inventory" above). The component renders the GEO-required structure — subject stated near the top, an audience/problem section, a process/limitations section, and a Q&A section — as explicitly labeled placeholder slots, so the structural pattern is consistent across pages now and only needs real copy dropped in per Increment 10, not a rebuild.
- `/contact` — display-only per this increment's scope (no backend; `contact_inquiries` and `/api/contact` are Increment 7). Still needed a real, accessible form (`src/components/contact-form-placeholder.tsx`, a small client component) rather than a dead page, so a visitor who fills it in and clicks "Send message" gets an honest "this isn't wired up yet" status message instead of silence or a fake success state.
- Homepage (`src/app/page.tsx`) copy and metadata brought in line with the same labeled-placeholder pattern; added a canonical URL.
- Header nav now links to all four new routes (folds in the remaining Increment 1 scope noted at that lock). Footer intentionally does **not** yet link to `/privacy`, `/terms`, `/refund-policy`, `/ai-use-and-responsibility` — those routes don't exist until Increment 9.
- SEO scaffolding: `sitemap.ts` (the 5 static routes only — `/products` and its slugs are added once Supabase-backed and queryable), `robots.ts` (allows all, disallows the already-decided protected paths `/api/`, `/account`, `/library`, `/auth/callback` as defense in depth even before those routes exist), per-page canonical `alternates`, Open Graph metadata (using the real master logo as the share image — no invented asset), and site-wide `Organization`/`WebSite` JSON-LD in the root layout (name/url/logo only — no `sameAs` social links since none were supplied, no fabricated ratings/reviews). `Product`/`Service`/`FAQPage` JSON-LD is intentionally not added yet since none of those pages have real content to describe.

**Loop-QA finding (caught and fixed before presenting):** the eyebrow labels (`text-coral` on the `off-white` background) measured a 2.90:1 contrast ratio — below WCAG 2.2 AA's 4.5:1 for normal text and even below the 3:1 floor for large text. Computed via the standard relative-luminance formula rather than eyeballing it (see the calculation this was caught with, in-session). Fixed by switching those labels to navy (`text-navy`), which measures 14.64:1 — coral stays reserved for non-text accents, consistent with the brand guide's own "accent only, used sparingly" framing; no brand-color values were changed. Re-verified build/lint/typecheck/format clean after the fix.

**Verification:** `npm run typecheck`, `npm run lint`, `npm run format:check`, and `npm run build` all pass clean (all 5 new/updated routes prerender as static). Checked in a real headless-Chromium browser via Playwright across all 5 routes plus a live interaction test (filled and submitted the contact form, confirmed the "not wired up yet" message appears) — zero console errors on any route. Confirmed `robots.txt` and `sitemap.xml` render the expected output, and that the Organization/WebSite JSON-LD is present in the served HTML.

**Review battery:**

| Item                                    | Status  | Note                                                                                                                                                                                                                                                                          |
| --------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Extra security pass                     | ✅ done | No secrets; the two JSON-LD `dangerouslySetInnerHTML` uses are static, developer-controlled constants (not user input), additionally escaped against `<` as defense in depth. Contact form has no network call yet — `preventDefault` only, nothing crosses a trust boundary. |
| API input trust boundary                | N/A     | Contact form isn't wired to a backend yet — real trust-boundary handling arrives with `/api/contact` in Increment 7.                                                                                                                                                          |
| Rate limiting                           | N/A     | No endpoints yet.                                                                                                                                                                                                                                                             |
| Fake account / spam / abuse protection  | N/A     | No real form submission yet.                                                                                                                                                                                                                                                  |
| Performance                             | ✅ done | Every new/changed route builds as static (`○` in the build output) — confirmed in the build log, not assumed.                                                                                                                                                                 |
| Migrations                              | N/A     | No schema changes this increment.                                                                                                                                                                                                                                             |
| Input validation / basic bot protection | N/A     | Contact form uses HTML5 `required`/`type` attributes only (cosmetic, client-side); real validation lands with the backend in Increment 7.                                                                                                                                     |

**Accessibility spot-check (WCAG 2.2 AA):** heading order correct on every page (single `h1`, then `h2`s, no skipped levels); skip link, visible focus rings, and keyboard-operable nav/form all carried over from Increment 0; contrast issue above caught and fixed; the contact form's submission result is in a `role="status" aria-live="polite"` region so screen reader users hear it without moving focus; no information conveyed by color alone.

**Conditional Test Checklist (this increment):** unchanged — still N/A across the board except the same two ⚠️ items (SSL on a real domain, separate dev/prod environments), both deferred to go-live per `DEPLOYMENT.md`.

**Status:** 🔒 **Locked** by Tina Biello (Approver) on 2026-07-25. Decision: pause new pages and set up a real Supabase project next, so Increment 2 and everything downstream (auth, catalog pages, payments) can actually be verified instead of stacking further execution-untested code.

## Increment 3b — Catalog pages (built, pending Approver lock)

The part of the original Increment 3 held back at Increment 3a's lock — `/products` and `/products/[slug]`, now unblocked since Increment 2's schema is live and verified.

**What was built:**

- `src/lib/supabase/public.ts` — a plain, cookie-free Supabase client (`createPublicClient`, wraps `@supabase/supabase-js` directly) for anonymous public reads. `src/lib/supabase/server.ts` (the cookie-aware `@supabase/ssr` client) stays reserved for session-dependent work starting Increment 4 — see the architectural note below on why these needed to be two different clients.
- `src/lib/supabase/types.ts` — hand-written `Database` type covering only the columns actually queried (`products`, `product_versions`). Not the full `supabase gen types` output (CLI still isn't linked), but shaped to match it so it's a drop-in replacement later.
- `/products` — queries `products` where `status = 'active'`, renders a linked list. ISR, `revalidate = 3600`.
- `/products/[slug]` — queries the active product by slug plus its current version; 404s via `notFound()` for an unknown or inactive slug (verified: returns real HTTP 404, not a soft-404 200). Renders name, summary, version label, last-updated date, and changelog — all real data from the database, not placeholders (the _content_ of that data happens to still say `[PLACEHOLDER — ...]` because that's genuinely what's seeded, per the Increment 2 seed decision). "What's included," "Video preview," and "FAQs" sections are honestly labeled placeholders, matching the same pattern as Increment 3a. CTA button is a real "Get Access" (from the brief's approved CTA list) but rendered `disabled` with a visible note that checkout isn't wired up until Increment 5 — same "don't fake a working feature" approach as the Increment 3a contact form. `Product` JSON-LD includes only `name`/`description` — no `offers`/price (no pricing on the public site, per the brief) and no fabricated ratings/reviews, since neither exists yet. `generateStaticParams` prerenders every currently-active slug at build time, with `dynamicParams` left at its default `true` so a product added later renders on first request without a rebuild.
- `sitemap.ts` updated to include `/products` and every active product slug, pulled live from the database.
- Header nav gained a "Products" link.

**Bug caught during verification (fixed before presenting):** the first version of this increment reused Increment 4's planned cookie-aware `server.ts` client for these public reads. That broke `generateStaticParams` outright — `cookies()` isn't available at build time, since there's no HTTP request yet (confirmed via the actual build error: `used cookies() inside generateStaticParams... not supported`) — and it silently forced `sitemap.xml` to render fully dynamic instead of static, undermining the "statically generated or ISR'd" approach the Architecture section commits to. This wasn't just a lint-level issue — the first build actually produced 0 prerendered product pages and the try/catch fallback masked it rather than fixing it. Root cause: conflating "public, anonymous, cacheable read" with "session-aware read" in one client. Fixed by introducing `createPublicClient` and pointing all three read sites (`/products`, `/products/[slug]`, `sitemap.ts`) at it instead. Re-verified: the rebuilt output shows `/products` and `/products/[slug]` as static/SSG (not dynamic), `/products/found-by-ai` actually prerendered at build time, and `sitemap.xml` static again with the live product URL included.

**Adversarial check (the non-negotiable boundary):** fetched the rendered `/products/found-by-ai` HTML directly and grepped it for `prompt_body`, `product_content`, `usage_guidance`, `license_terms`, and the literal seeded placeholder prompt text — all absent. This isn't just "the page didn't render it" — the Supabase `.select()` calls in both catalog pages only ever name `id, slug, name, summary` and `version_label, changelog, created_at`; `product_content`/`product_resources` are never queried at all by any code in this increment, so there's no code path through which those fields could reach a prop, the HTML, or JSON-LD, RLS backing it up independently regardless.

**Verification:** `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build` all pass clean after the client fix. Checked live in a headless-Chromium browser: `/products` lists the real seeded product, `/products/found-by-ai` renders real DB data end-to-end (name, version, dates), `/products/does-not-exist` returns a genuine HTTP 404 — zero unexpected console errors across all three.

**Review battery:**

| Item                                    | Status  | Note                                                                                                                                                                                                                                                                                         |
| --------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Extra security pass                     | ✅ done | `product_content`/`product_resources` never queried by this increment's code (see adversarial check above) — not just unrendered, structurally unreachable. `Product` JSON-LD has no invented `offers`/ratings. Disabled CTA button has no click handler, so no dead/misleading interaction. |
| API input trust boundary                | N/A     | Read-only public pages; the only "input" is the `slug` route param, used solely in a parameterized Supabase filter (`.eq("slug", slug)`) — no raw SQL, no path traversal surface.                                                                                                            |
| Rate limiting                           | N/A     | No mutating endpoints.                                                                                                                                                                                                                                                                       |
| Fake account / spam / abuse protection  | N/A     | No forms on these pages.                                                                                                                                                                                                                                                                     |
| Performance                             | ✅ done | Confirmed via build output: `/products` and `/products/[slug]` are static/SSG with `revalidate: 1h`, not per-request dynamic. `generateStaticParams` prerenders all currently-active slugs at build time; new products render on-demand and get cached rather than rebuilding.               |
| Migrations                              | N/A     | No schema changes this increment (Increment 2 already locked).                                                                                                                                                                                                                               |
| Input validation / basic bot protection | N/A     | No user input accepted.                                                                                                                                                                                                                                                                      |

**Conditional Test Checklist (this increment):** unchanged — still N/A across the board except the same two ⚠️ items (SSL on a real domain, separate dev/prod environments), deferred to go-live per `DEPLOYMENT.md`.

**Status:** 🔒 **Locked** by Tina Biello (Approver) on 2026-07-25.

## Auth method decision (Increment 4)

Confirmed by Tina on 2026-07-25: **magic-link email authentication** (Supabase `signInWithOtp`), not password-based. Closes the open item flagged in the Architecture section. This also means the "Email verification" Conditional Test Checklist item is inherently satisfied by the login mechanism itself once Increment 4 ships — a magic link can't be used without access to the email address.

## Increment 4 — Auth (built, pending Approver lock)

**What was built:**

- `src/lib/supabase/client.ts` — browser-side Supabase client (`createBrowserClient`) for Client Components that need to call auth methods directly (the login form).
- `src/proxy.ts` — the standard Supabase/Next.js session-refresh proxy (Next.js 16 renamed "middleware" to "proxy" — same mechanism; built it as `middleware.ts` first, then hit the build's own deprecation warning and renamed before presenting). Refreshes the auth cookie on every matched request so Server Components see a current session.
- `/login` — Server Component wrapper (redirects to `/account` if already signed in, checked via `supabase.auth.getUser()`, never the unverified `getSession()`) rendering `LoginForm` (`src/components/login-form.tsx`, Client Component). Calls `signInWithOtp`; on error shows a generic "Something went wrong" message and logs details server-side only — deliberately doesn't confirm/deny whether an email has an account, to avoid enumeration.
- `/auth/callback` (`src/app/auth/callback/route.ts`) — exchanges the magic-link `code` for a session via `exchangeCodeForSession`, then redirects to `/account`. Does not accept a `next` redirect param from the query string — that would be an open-redirect surface for no benefit here. `X-Robots-Tag: noindex` set explicitly (Route Handlers have no `<head>` for a meta tag).
- `/account` — Server Component, checks `supabase.auth.getUser()` server-side and redirects to `/login` if unauthenticated; shows the signed-in email and a "Sign out" button wired to a Server Action (`src/app/account/actions.ts`) — Server Actions get Next.js's built-in origin/CSRF checking, per the brief's CSRF section. `robots: { index: false, follow: false }` in its metadata.
- Header nav gained an auth-aware "Log In"/"Account" link.

**Bug caught during build (fixed before presenting):** the header's auth link was first implemented by making `SiteHeader` itself (rendered on every page via the root layout) call the cookie-aware server client. That would have forced **every page on the site** — including the static/ISR marketing and catalog pages just fixed in Increment 3b — to render dynamically on every request, since reading cookies anywhere in a shared layout poisons the whole tree. Caught before running the build. Fixed by extracting a small Client Component (`src/components/auth-nav-link.tsx`) that checks auth state client-side via `supabase.auth.onAuthStateChange`/`getUser()` after hydration — `SiteHeader` itself touches no cookies again. Rebuilt and confirmed `/`, `/products`, `/products/[slug]`, and the other marketing pages are still static/SSG; only `/login`, `/account`, and `/auth/callback` are dynamic, which is correct since those are inherently session-dependent.

**Live verification (2026-07-25):**

- Automated: `GET /account` while logged out → `307` to `/login` (confirmed via `curl`, no session bypass). `GET /login` while logged out → `200`, renders the form. `GET /auth/callback` with no `code` or a bogus `code` → redirects to `/login` cleanly, no crash, `X-Robots-Tag: noindex` present. Checked in a headless browser: header shows "Log In" correctly when signed out, zero console errors on `/` and `/login`.
- **Manual, by Tina (Approver) — the one step that structurally requires a real inbox, which the assistant can't access:** submitted her real email at `/login`, received the magic-link email (sent by Supabase's own default sender — see branding note below), clicked it, landed on `/account` showing her email, used "Sign out," landed back on `/`, and confirmed `/account` again required signing in. Full loop confirmed working end-to-end on a live Supabase project.

**Follow-up flagged, not blocking this lock — branded auth email:** the magic-link email currently arrives from Supabase's default sender/branding, not Modern CoS. Fixing this needs a verified sending domain (DNS records under `themoderncos.com`) and either a custom SMTP/transactional-email provider or Supabase's own template customization — real scope beyond "wire up auth," and it overlaps with the DNS work `DEPLOYMENT.md` already covers for go-live. **Decision (Tina, 2026-07-25): defer to go-live/DNS setup** rather than address twice. Added as a required pre-launch step, tracked alongside the GoDaddy DNS steps.

**Review battery:**

| Item                                    | Status          | Note                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Extra security pass                     | ✅ done         | `getUser()` used (not `getSession()`) everywhere an auth decision is made — the only server-verified check, per Supabase's own guidance. No enumeration leak on login error. `/auth/callback` has no open-redirect param. Sign-out uses a Server Action (built-in CSRF protection) rather than a bare client-side call. |
| API input trust boundary                | ✅ done         | The only untrusted input is the email in the login form (passed straight to `signInWithOtp`, which Supabase validates) and the `code` query param in the callback (passed straight to `exchangeCodeForSession`, which validates or rejects it — never parsed or trusted directly by application code).                  |
| Rate limiting                           | ⚠️ still needed | No app-level rate limiting yet (Increment 8, as planned). Interim protection: Supabase's own built-in auth rate limits (email OTP requests capped per hour at the project level) already apply today.                                                                                                                   |
| Fake account / spam / abuse protection  | ⚠️ still needed | Same as above — relying on Supabase's built-in throttling until Increment 8's dedicated pass.                                                                                                                                                                                                                           |
| Performance                             | ✅ done         | Confirmed via build output: adding auth did not regress the static/ISR pages from Increment 3b — only the three inherently session-dependent routes (`/login`, `/account`, `/auth/callback`) are dynamic.                                                                                                               |
| Migrations                              | N/A             | No schema changes — Increment 2's `profiles` table and its `handle_new_user()` trigger (built ahead of need for exactly this moment) already handle new-user rows automatically; confirmed working via the live signup during Tina's test.                                                                              |
| Input validation / basic bot protection | ⚠️ still needed | Email field uses the browser's native `type="email"` validation only; no CAPTCHA/bot-protection layer yet — deferred to Increment 8 alongside rate limiting, consistent with the rest of the plan.                                                                                                                      |

**Conditional Test Checklist (this increment):**

| Item                                             | Status                                 | Note                                                                                                        |
| ------------------------------------------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Login and password reset                         | ✅ done (login) / N/A (password reset) | Magic-link login verified live end-to-end. No password reset flow applicable — there are no passwords.      |
| Real credit card payments                        | N/A                                    | Increment 5.                                                                                                |
| SSL on a real domain                             | ⚠️ still needed                        | Unchanged — deferred to go-live.                                                                            |
| Separate development and production environments | ⚠️ still needed                        | Unchanged — deferred to go-live.                                                                            |
| API keys not exposed anywhere                    | ✅ done                                | Only the anon key (meant to be public) is used client-side; no service-role key exists in the codebase yet. |
| Production database backups verifiable           | N/A                                    | Backup verification is a Stage C / pre-launch item.                                                         |
| Email verification                               | ✅ done                                | Inherently satisfied by the magic-link mechanism itself, confirmed via Tina's live test.                    |
| Rate limiting                                    | ⚠️ still needed                        | See battery above.                                                                                          |
| Input validation                                 | ⚠️ still needed                        | See battery above.                                                                                          |
| Basic bot protection                             | ⚠️ still needed                        | See battery above.                                                                                          |

**Status:** 🔒 **Locked** by Tina Biello (Approver) on 2026-07-25, per her live end-to-end test. Branded-email follow-up tracked as a required pre-launch step, not a blocker.

## Homepage offer-ladder & Ops Leak Scorecard — scope decision

The "Home Page Content & Structure" brief (2026-09-09) referenced "your existing decision" that the Ops Leak Scorecard fires as a scroll-triggered popup, site-wide. No such decision exists anywhere in this file or the codebase prior to this entry — flagged and confirmed with Tina before building, per the intake rule above ("ask first if anything is ambiguous or missing").

**Decision (Tina, 2026-09-09):** This increment ships homepage copy and structure only. The Scorecard popup, the Scorecard flow itself, and the CoS Sprint details page are real future scope, not yet numbered or designed in the Increment breakdown above — they need their own Stage A pass (data model for scoring/lead capture, popup trigger mechanics, rate limiting/bot protection) rather than being bolted onto a content increment. Where this brief's copy names a CTA with no built destination (`Get Your Score`, `See What's Included`), the button renders as a real, full-strength, disabled control with an honest "Launching soon." caption — same non-negotiable ("don't fake a working feature") already applied to the Increment 3b product-page CTA, just in plain customer-facing language since this page's copy is final, not a labeled placeholder. `Talk to Tina` links to the real, already-built `/contact` page.

## Increment 3c — Homepage content & structure (real copy, built, pending Approver lock)

Replaces the Increment 3a homepage placeholder with the final copy and structure from the brief. No schema, auth, or payments changes.

**What was built:**

- `src/components/home/` — one component per section (`hero.tsx`, `problem-section.tsx`, `what-we-do.tsx`, `offer-ladder.tsx`, `proof-section.tsx`, `final-cta.tsx`) plus a shared `pending-cta-button.tsx` for the two CTAs with no built destination yet, composed in `src/app/page.tsx`. All real, final copy from the brief — no invented claims, testimonials, or stats.
- Section backgrounds alternate navy/off-white (Hero navy, Problem off-white, What We Do navy, How to Start off-white, Proof off-white, Final CTA navy) so the closing CTA bookends the hero, per the brief's "coral used only on eyebrow + CTA button" rule for the Hero and the general "coral stays sparse" rule elsewhere — coral appears only as the two eyebrow-style labels (Hero eyebrow, and the Free/Project/Retainer tier tags) and the two Scorecard CTA buttons; every other CTA and heading is navy/off-white.
- `PendingCtaButton` (`Get Your Score`, `See What's Included`, and both `Take the Free Ops Leak Scorecard` instances) renders as a normal full-strength button (not grayed out) with `disabled` + `aria-describedby` pointing at a real "Launching soon." caption, so it reads as a finished page with an honest not-yet-available state, not a dev placeholder or a fake working link.
- `Talk to Tina` is a real `<Link href="/contact">`, styled as a button — verified it actually navigates to the live `/contact` page.
- The offer-ladder cards use `<h3>` for `Ops Leak Scorecard` / `CoS Sprint™` / `Fractional Chief of Staff` (not `<p>`) so screen-reader users can navigate the three offers by heading, consistent with the rest of the site's heading structure.
- Secondary hero CTA ("See how it works ↓") is a same-page anchor to the Problem section (`#the-problem`) — the brief didn't specify a target; a same-page scroll cue was the most literal reading of the "↓" and doesn't assert a routing decision Tina didn't make. Flagged here in case she meant the `/how-it-works` page instead — trivial to change.
- Homepage `metadata` (`title`, `description`, `og:description`) updated to reflect the real hero/subhead copy instead of the Increment 0 placeholder description; root layout defaults untouched (still used as fallback by other pages).

**Verification:** `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build` all pass clean; `/` still prerenders static (`○`), unchanged from Increment 3a/3b. Checked live in headless Chromium (Playwright, ad hoc — not a committed dependency) at desktop (1280×900) and mobile (390×844) viewports: zero console/page errors either viewport; the secondary CTA anchor scrolls to the Problem section; all 4 `PendingCtaButton`s render as genuinely non-interactive `disabled` buttons; `Talk to Tina` resolves to `/contact`. Screenshots reviewed, not committed (session scratchpad only, per the Increment 0 precedent).

**Review battery:**

| Item                                    | Status  | Note                                                                                                                                                                                                                                    |
| --------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Extra security pass                     | ✅ done | No secrets, no new data reads/writes, no forms. The two `dangerouslySetInnerHTML` JSON-LD blocks in the root layout are untouched by this increment.                                                                                    |
| API input trust boundary                | N/A     | No API routes, forms, or user input on this page — every CTA is either a disabled placeholder or a static `Link` to an existing page.                                                                                                   |
| Rate limiting                           | N/A     | No endpoints introduced.                                                                                                                                                                                                                |
| Fake account / spam / abuse protection  | N/A     | No forms introduced.                                                                                                                                                                                                                    |
| Performance                             | ✅ done | Confirmed via build output: `/` is still static/prerendered, not regressed to dynamic by the new sections. No new client components/JS beyond what already existed (`AuthNavLink`); every new homepage component is a Server Component. |
| Migrations                              | N/A     | No schema changes.                                                                                                                                                                                                                      |
| Input validation / basic bot protection | N/A     | No input accepted on this page.                                                                                                                                                                                                         |

**Accessibility spot-check (WCAG 2.2 AA):** single `h1` (Hero), sequential `h2`s per section, `h3`s for the three offer cards — no skipped levels. Contrast checked by calculation (relative-luminance formula, same method as the Increment 3a fix): navy text on the coral CTA fill measures ~5.0:1 (passes 4.5:1); off-white text on navy backgrounds is well over 7:1. Coral is never used as the only signal — every coral element also carries its own text label. Disabled buttons are genuinely non-interactive (skipped in tab order by the browser, not a fake `aria-disabled`-only state) and carry `aria-describedby` linking to their caption.

**Conditional Test Checklist (this increment):** unchanged — still N/A across the board except the same two ⚠️ items (SSL on a real domain, separate dev/prod environments), deferred to go-live per `DEPLOYMENT.md`.

**Status:** Built, pending Tina's review and lock. Flagged for her attention: (1) the "See how it works ↓" anchor target (Problem section vs. `/how-it-works` page — see note above), (2) the Scorecard-popup scope decision recorded above, since it changes what "the existing decision" in the brief actually refers to going forward.

## Public-facing founder name — confirmed

The "About Page Content & Structure" brief (2026-09-09) flagged its own open item: business plan documents use "Tina Biello" everywhere except one founder-bio paragraph that uses "Tina Biello-Frumkin." **Confirmed by Tina, 2026-09-09: "Tina Biello"** is the name that ships on the live site, matching the brand guide and every other public document. Recorded here since this is exactly the kind of pre-indexing decision that's cheap now and expensive after Google has crawled it.

## Increment 3d — About page content & structure (real copy, built, pending Approver lock)

Replaces the Increment 3a `/about` placeholder (shared `MarketingPlaceholderPage` component) with the final copy and structure from the brief. `/how-it-works` and `/services` are untouched and still use the shared placeholder. No schema, auth, or payments changes.

**What was built:**

- `src/components/about/` — one component per section (`hero.tsx`, `story-section.tsx`, `background-section.tsx`, `how-we-work-section.tsx`, `final-cta.tsx`), composed in `src/app/about/page.tsx` (no longer using `MarketingPlaceholderPage`). All real, final copy from the brief.
- Sections alternate navy/off-white (Hero navy, Story off-white, Background navy, How We Work off-white, Final CTA navy), same convention as the homepage (Increment 3c).
- No headshot exists yet (checked `/public` and `/brand` — only the logo file is present). Per the brief, shipped text-only rather than holding up the build; the Hero section's layout is a simple centered block a future `<Image>` can drop into without restructuring.
- **Em-dash conflict caught and resolved:** the brief's own credentials strip used em dashes as a degree/institution separator ("MBA, ... — NC State University"), which conflicts with this build's global "no em dashes" rule (repeated explicitly in this brief). Substituted a middle dot (`·`) instead of silently keeping the dash or silently changing it without a record — e.g. "MBA, Entrepreneurship & Technology Commercialization · NC State University." Verified live: the rendered page contains zero em-dash characters.
- The one real CTA (`Talk to Tina` → `/contact`) uses the coral-fill button style (navy text on coral, same ~5:1 contrast pairing as the homepage), since it's a genuinely functioning link, not a pending-feature placeholder like the homepage's Scorecard CTAs. No second CTA was added, per the brief.
- Page `metadata` (`title`, `description`, `og:description`) set from the real hero copy.

**Verification:** `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build` all pass clean; `/about` still prerenders static (`○`). Checked live in headless Chromium (Playwright) at desktop (1280×900) and mobile (390×844): zero console/page errors either viewport; single `h1` ("Tina Biello, Founder"); `Talk to Tina` resolves to `/contact`; confirmed programmatically that the rendered page text contains no instance of "Biello-Frumkin" and no em-dash character.

**Review battery:**

| Item                                    | Status  | Note                                                                                                                              |
| --------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Extra security pass                     | ✅ done | No secrets, no new data reads/writes, no forms.                                                                                   |
| API input trust boundary                | N/A     | No API routes, forms, or user input — the only interactive element is a static `Link` to the existing `/contact` page.            |
| Rate limiting                           | N/A     | No endpoints introduced.                                                                                                          |
| Fake account / spam / abuse protection  | N/A     | No forms introduced.                                                                                                              |
| Performance                             | ✅ done | Confirmed via build output: `/about` is still static/prerendered. Every new component is a Server Component — no client JS added. |
| Migrations                              | N/A     | No schema changes.                                                                                                                |
| Input validation / basic bot protection | N/A     | No input accepted on this page.                                                                                                   |

**Accessibility spot-check (WCAG 2.2 AA):** single `h1`, sequential `h2`s per section, no skipped levels. Contrast: navy text on the coral CTA fill (~5.0:1, same calculation as Increment 3c) and off-white text on navy backgrounds (well over 7:1) both pass. Credentials strip is plain, tightly-spaced text (not color- or icon-only), per the brief.

**Conditional Test Checklist (this increment):** unchanged — still N/A across the board except the same two ⚠️ items (SSL on a real domain, separate dev/prod environments), deferred to go-live per `DEPLOYMENT.md`.

**Status:** 🔒 **Locked** by Tina Biello (Approver) on 2026-09-12, after reviewing the live page in the dev server. Founder-name choice already confirmed above. The only open item is the headshot, expected to slot in later per the brief without a rebuild.

## Increment 3e — Services page content & structure (real copy, built, pending Approver lock)

Replaces the Increment 3a `/services` placeholder (shared `MarketingPlaceholderPage` component) with the final copy and section-by-section layout from the "Services Page Build Spec" brief (2026-09-12). Scoped to the guided/project/retainer services ladder only, per the brief's own scope note — self-serve digital tools stay on `/products`, untouched here. `/how-it-works` is untouched and still uses the shared placeholder. No schema, auth, or payments changes.

**What was built:**

- `src/components/services/` — one component per section (`hero.tsx`, `ladder-section.tsx`, `on-call-section.tsx`, `how-different-section.tsx`, `final-cta.tsx`), composed in `src/app/services/page.tsx` (no longer using `MarketingPlaceholderPage`). All real, final copy from the brief.
- `src/components/pending-cta-button.tsx` — moved out of `src/components/home/` to the shared top-level components folder (alongside `marketing-placeholder-page.tsx` and `contact-form-placeholder.tsx`) since the Services final CTA now needed the same not-yet-shipped-Scorecard treatment as the homepage. All three call sites in `src/components/home/` updated to the new import path; behavior unchanged.
- Sections alternate navy/off-white per the brief's own proposed mapping (Hero navy, Ladder off-white, On-Call off-white/same-tone, How It's Different navy, Final CTA off-white) — **confirmed with Tina before build**, same pattern as flagging the founder-name choice on the About brief.
- **Ladder grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, `gap-6` (24px). The brief specified custom 600px/860px breakpoints but also said to match whatever's already live if it differs, "consistency across pages matters more than the exact pixel values here" — the rest of the site uses Tailwind's default `sm`(640px)/`md`(768px)/`lg`(1024px) scale (see `offer-ladder.tsx`, `what-we-do.tsx`), so this section uses that scale instead of introducing a one-off breakpoint. Verified live: 4 cols at 1280px, 2 cols at 800px, 1 col at 390px.
- **Card heights are not equalized.** `items-start` on the grid container overrides CSS Grid's default row-stretch, so each card (`<li>`) sizes to its own content — Card 3's longer body and Card 4's longer "Includes" list make those cards taller than Cards 1 and 2, per the brief ("that's expected, not a bug to fix"). Confirmed visually in the desktop screenshot.
- **Card CTA destinations — assumption flagged:** the brief specifies four different CTA labels ("Book a Diagnostic Call," "Get a Sprint Quote," "Discuss Your Project," "Talk to Tina About a Retainer") but no distinct booking page, calendar link, or intake form per tier exists anywhere in the codebase or `/references`. All four link to the existing `/contact` route today, differentiated only by label text — same pattern as the About and homepage CTAs that already point there. Revisit once a real per-tier booking flow (e.g., a Diagnostic-specific Calendly link) exists.
- CTA fill colors: navy on Cards 1-3, coral only on Card 4 (Fractional CoS), per the brief's instruction to mark the highest-commitment tier without a "most popular" badge or other framework device.
- **On-Call Support** section: same off-white tone as the ladder above it (not a color break), set apart with a `border-hairline border-t` rule and a narrower `max-w-2xl` column instead. Heading uses `<h2>` for correct document structure but styled at `text-xl` (smaller than the ladder's `text-3xl` H2) so it doesn't visually compete with Card 4's retainer positioning, per the brief. No CTA, per the brief.
- **How It's Different** section: `max-w-prose` (Tailwind's 65ch column) for the centered body text, matching the brief's "max ~65ch, this is a statement section, not a content-dense one."
- **Final CTA:** primary is a `PendingCtaButton` (coral tone, "Take the Free Ops Leak Scorecard," "The Scorecard is launching soon.") since the Scorecard still hasn't shipped (confirmed against the homepage's own still-pending status) — not a working link yet, matching the brief's own conditional note to flip this once the Scorecard popup exists. Secondary CTA (`Talk to Tina` → `/contact`) renders as a plain underlined text link beneath it, not a second button of equal weight, per the brief.
- No dollar figures anywhere in the new copy — confirmed by inspection; pricing stays internal per the AI Workflow Support Partnership one-pager referenced in the brief.
- Page `metadata` (`title`, `description`, `og:description`) set from the real hero/subhead copy.

**Verification:** `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build` all pass clean; `/services` still prerenders static (`○`). Checked live in headless Chromium (Playwright) at desktop (1280×1000), tablet (800×1000), and mobile (390×1000): zero console/page errors at any viewport; confirmed computed `grid-template-columns` is 4 columns at desktop, 2 at tablet, 1 at mobile; mobile stacking order matches the brief's required ladder order (Diagnostic → Sprint → Implementation → Retainer); confirmed programmatically that the only em dash anywhere in the rendered page is in the pre-existing site-wide header/footer logo `aria-label` ("Modern CoS — home"), unrelated to this brief's scope and untouched by it.

**Review battery:**

| Item                                    | Status  | Note                                                                                                                                          |
| --------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Extra security pass                     | ✅ done | No secrets, no new data reads/writes, no forms.                                                                                               |
| API input trust boundary                | N/A     | No API routes or user input — every interactive element is a static `Link` to the existing `/contact` page, or a disabled `PendingCtaButton`. |
| Rate limiting                           | N/A     | No endpoints introduced.                                                                                                                      |
| Fake account / spam / abuse protection  | N/A     | No forms introduced.                                                                                                                          |
| Performance                             | ✅ done | Confirmed via build output: `/services` is still static/prerendered. Every new component is a Server Component — no client JS added.          |
| Migrations                              | N/A     | No schema changes.                                                                                                                            |
| Input validation / basic bot protection | N/A     | No input accepted on this page.                                                                                                               |

**Accessibility spot-check (WCAG 2.2 AA):** single `h1`, sequential `h2`s per section (Ladder, On-Call, How It's Different, Final CTA), `h3` per card, no skipped levels. "Includes" lists use real `<ul>`/`<li>` markup, not visual-only bullets. Contrast for the ladder CTAs is covered in the revision note directly below (superseded the original two-color navy/coral pairing this box originally described).

**Conditional Test Checklist (this increment):** unchanged — still N/A across the board except the same two ⚠️ items (SSL on a real domain, separate dev/prod environments), deferred to go-live per `DEPLOYMENT.md`.

### Revision — equal-height cards and 4-color CTA progression (2026-09-12)

After the first build above, Tina asked for two changes to the ladder cards, superseding two specific instructions in the original brief:

1. **Equal card heights.** The brief had explicitly said not to force equal heights ("Card 3's description is naturally longer... that's expected, not a bug to fix"). Tina's revised instruction: `align-items: stretch` on the grid (Tailwind's default — the earlier build had explicitly opted out with `items-start`) plus `flex flex-col` on each card and `margin-top: auto` on the CTA wrapper, so every card matches the tallest one in its row and all four buttons land on the same bottom edge, without adding padding or trimming copy. Implemented in `ladder-section.tsx`; confirmed live via Playwright — all four cards measured exactly 618px tall at 1280px width.
2. **4-color CTA progression**, one color per card signaling ladder position, replacing the brief's original navy-on-1-3/coral-on-4 pairing: Card 1 navy, Card 2 amber, Card 3 sage, Card 4 coral.

**Contrast review of the requested colors (WCAG AA, 4.5:1 for normal-weight button text) surfaced three failures, one caught by Tina before asking, two caught in review:**

| Card | Fill                    | Tina's requested text                                    | Contrast | Result                                                   |
| ---- | ----------------------- | -------------------------------------------------------- | -------- | -------------------------------------------------------- |
| 1    | Navy #052439            | white/off-white                                          | 15.93:1  | Pass — as requested                                      |
| 2    | Amber #c98a3e           | white (Tina caught this herself, requested navy instead) | 2.92:1   | Fails — not used                                         |
| 2    | Amber #c98a3e           | navy                                                     | 5.45:1   | Pass — used                                              |
| 3    | Sage #6b8f82 (original) | white                                                    | 3.57:1   | Fails                                                    |
| 3    | Sage #6b8f82 (original) | navy                                                     | 4.46:1   | Fails (just under 4.5:1)                                 |
| 4    | Coral #e0705d           | white                                                    | 3.16:1   | Fails                                                    |
| 4    | Coral #e0705d           | navy                                                     | 5.04:1   | Pass — matches every other coral CTA already on the site |

Flagged both remaining failures to Tina directly rather than silently picking a fix, per the same "ask before building when underspecified" rule this file already follows elsewhere:

- **Card 4:** confirmed navy text over the originally-requested white, matching the coral-button convention already used on the homepage and About page.
- **Card 3:** Tina's own proposed fix (darken sage to `#5c7a6e`) was tried and made contrast _worse_ (3.39:1) — sage sits lighter than navy text, so darkening the fill moves it toward navy rather than away from it; lightening is what increases the gap. Confirmed with Tina and shipped a lightened sage, `#729588` (navy text: 4.82:1), close enough to the original hue that it doesn't read as a different color. `--color-sage` in `globals.css` documents both the original spec value and why it changed.

**New CSS tokens:** `--color-amber: #c98a3e` and `--color-sage: #729588` added to `globals.css`'s `@theme` block, explicitly commented as **not part of Brand Guide v1.0** — flagged for Tina to confirm whether these become permanent brand accents or stay scoped to this page.

**Build note:** after this revision, the Turbopack dev server initially kept serving a stale compiled CSS chunk (same content hash) with neither the new tokens nor the `bg-amber`/`bg-sage` utilities present, even after a plain restart. A full `.next` cache clear plus restart fixed it — worth knowing if a future CSS-only `@theme` change doesn't seem to take effect in dev.

**Updated verification:** `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build` all pass clean after the revision; `/services` still prerenders static (`○`). Re-checked live in headless Chromium at desktop (1280×1000), confirmed via `getBoundingClientRect()` that all four cards measure identically (618px), and visually confirmed the navy → amber → sage → coral progression renders correctly against the previously-stale-CSS state.

**Status:** 🔒 **Locked** by Tina Biello (Approver) on 2026-09-12, after reviewing the equal-height/4-color revision. Two open items carry forward, not blockers: (1) the card-CTA-to-`/contact` routing assumption, which stands until per-tier booking links exist, (2) whether amber/sage graduate from page-scoped tokens to permanent Brand Guide accents.
