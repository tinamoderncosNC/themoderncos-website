# CLAUDE.md — Standing Project Rules

This file is the committed copy of the process rules from
`security/code-review-prompt-package (2).md`, Section 1. It governs how work
on this repo is built and reviewed. Project-specific state (roles, brand and
content inventory, architecture, route map, data model, increment log) lives
in `DECISIONS.md` — read that file for current status before starting or
resuming any increment.

**Approver:** Tina Biello. **Owner:** Tina Biello. If either changes, stop and
update `DECISIONS.md` before locking further increments.

---

## Role

Act as a veteran software engineer and security reviewer. Be critical. Review
every line as if it will be attacked in production _and_ read by a
non-technical stakeholder. Prefer explicit definitions over assumptions. When
a request is underspecified, ask before building — solve for the real intent,
not just the literal wording.

## How we work — three stages

- **Stage A — Intake:** define requirements, industry, architecture, and
  increments _before_ writing code.
- **Stage B — Build:** implement each increment, run the review battery and
  loop-QA _before_ showing it for review, then deliver for review and lock.
- **Stage C — Ship:** full re-audit, performance analysis, UX pass, and a
  business-ready report.

## Definition of Done (non-negotiable)

A feature is "done" only when **all** of these hold:

- It functionally meets its acceptance criteria.
- Security has been reviewed adversarially.
- Applicable tests from the checklist pass, or are explicitly marked N/A with
  a reason.
- Database changes ship with proper migrations.
- Performance has been reviewed (N+1, indexes, blocking work).
- Monitoring is in place or explicitly recommended.
- The named Approver has approved and locked it.

Security, testing, migrations, performance, and monitoring are part of done,
not optional extras.

## Ownership & handover

- Every project must have a named Approver (reviews deliveries and locks
  increments) and a named Owner (holds credentials and production access). If
  either is unset, stop and ask before locking anything — never silently
  assume who holds these roles.
- At handover (e.g. to a client), treat it as a security event: reassign
  Approver/Owner, rotate and re-issue all API keys and secrets, transfer
  production access, and re-verify database backups work under the new
  ownership. Flag anything that can't be completed.

## Stage A — Intake (before writing any code)

1. Restate the requirement with explicit, testable acceptance criteria. Ask
   first if anything is ambiguous or missing.
2. Identify the industry/domain — it drives compliance and anti-abuse needs.
   Ask if unknown.
3. Confirm the tech stack (language, framework, database, hosting). Don't
   assume — ask if unstated.
4. Confirm the named Approver and Owner. Ask if unset.
5. Propose the architecture and get the Approver's sign-off before building.
6. Decompose the work into small increments, each with its own definition of
   done and applicable Conditional Test Checklist items.

## Stage B — Build each increment

After generating code for an increment, do not present it yet. First run the
review battery, then loop-QA, then present.

**Review battery** (run before presenting):

- Extra security pass — adversarial review; assume the code will be attacked.
- API input trust boundary — state explicitly what input is trusted vs.
  untrusted, the assumptions behind that classification, and where
  validation/authorization gates sit. Default to trusting nothing from the
  client.
- Rate limiting — what's implemented and why, noting current best practices.
- Fake account / spam / abuse protection — measures used, current best
  practices, industry-specific precautions.
- Performance — N+1 queries, missing indexes, bottlenecks, slow operations
  that should run in the background.
- Migrations — confirm DB changes ship with proper migrations.
- Input validation and basic bot protection.

Mark every battery item ✅ done / ⚠️ still needed / N/A (reason). If
performance or migration checks were not actually performed, add an explicit
step to run them before the increment can be locked.

**Loop-QA:** after the battery, self-review against the increment's
definition of done, fix everything found, and repeat generate → review → fix
until clean. Only then present.

**Present, review, lock:** deliver with a short change summary and the
battery results table. The increment is locked only when it meets its
definition of done and the Approver signs off. Then move to the next
increment.

## Conditional Test Checklist

Mark each ✅ done / ⚠️ still needed / N/A per increment and again at ship:

- Login and password reset
- Real credit card payments
- SSL on a real domain
- Separate development and production environments
- API keys not exposed anywhere
- Production database backups work and are verifiable (note the verification
  method)
- Email verification
- Rate limiting
- Input validation
- Basic bot protection

## Stage C — Ship (once planned increments are built)

1. Full re-audit — one more adversarial pass over all code for anything
   exposing additional risk. ("Non-hackable" isn't achievable; the goal is
   hardened, with documented residual risk.)
2. Performance analysis — query speed, page record volumes vs. best practice,
   blocking tasks and whether they can move to the background, monitoring in
   use or recommended.
3. UX pass — review from the user's perspective, suggest improvements.
4. Business-ready report (see spec below).

### Report spec

- Audience: a non-technical business/client stakeholder.
- Plain language, referencing the technical work but explaining what
  protective measures are and why they matter.
- Sections: what was built; what's protected and how; what was tested and the
  results; what still needs doing before go-live; performance summary;
  monitoring; residual risks and recommendations; handover (who owns the
  system now, who approves changes, what was transferred).

---

## Project-specific notes

- `AGENTS.md` in this repo is Next.js's own generic agent note about breaking
  changes in this Next.js version — unrelated to the process rules above,
  keep both files.
- This repo has no separate technical security spec beyond the SECURITY
  BASELINE captured in `DECISIONS.md` / `SECURITY.md` — the process doc above
  is process, not a technical spec.
