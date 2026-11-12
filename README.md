# Michigan Garage Pros

Two-sided local marketplace connecting Michigan homeowners with garage-door service companies.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Deploy target: Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) (not classic Pages static hosting)
- **Database: Cloudflare D1** for leads, claim requests, and company profiles

## Cloudflare Workers Builds

This app must be a **Worker** with OpenNext — not a classic Pages static project.

Workers Builds is wired to GitHub (`main` + preview branches). Required commands:

| Setting | Value |
|---|---|
| **Build command** | `npm run cf:build` |
| **Deploy command (main)** | `npx wrangler deploy && npm run indexnow:postdeploy` |
| **Deploy command (other branches)** | `npx wrangler versions upload` |
| **Root directory** | `/` (repo root) |

If Git deploys fail with `Could not find compiled Open Next config`, the build command is missing or empty — set it to `npm run cf:build` and retry.

### IndexNow

After each production deploy, `indexnow:postdeploy` diffs the live sitemap against `data/indexnow-snapshot.json` and POSTs new/changed URLs to [IndexNow](https://www.indexnow.org/). It always exits 0 so a submit failure never fails the deploy.

| Item | Value |
|---|---|
| **Key file** | `https://michigangaragepros.com/427fa9d9fd78243932aba8b20d6f7afd.txt` (also `public/427fa9d9fd78243932aba8b20d6f7afd.txt`) |
| **Snapshot** | `data/indexnow-snapshot.json` (committed; refreshed locally after a successful submit) |

Manual runs:

```bash
# Diff sitemap and submit (writes snapshot on success)
npm run indexnow

# Dry-run: print JSON payload only
npm run indexnow -- --dry-run

# One-time full sitemap submit after the key file is live
npm run indexnow -- --force-all

# Single new blog article (or any URL)
npm run indexnow -- https://michigangaragepros.com/blog/your-slug/

# Helper unit checks
npm run test:indexnow
```

Set the Workers Builds **Deploy command (main)** to `npx wrangler deploy && npm run indexnow:postdeploy` (dashboard) so production deploys notify search engines automatically. After the first production deploy that publishes the key file, run `npm run indexnow -- --force-all` once, then commit the refreshed `data/indexnow-snapshot.json`.

Do **not** use classic Pages defaults like “framework: Next.js” + output directory `.next` / `out`.

### D1

```bash
npx wrangler login
npx wrangler d1 create michigangaragepros
```

Copy the returned `database_id` into `wrangler.jsonc` → `d1_databases[0].database_id`, commit, then:

```bash
npm run db:migrate:remote
```

Confirm **Bindings** shows `DB` → D1 `michigangaragepros` and `MEDIA` → R2 `michigangaragepros-media`.

### R2 media bucket (company logos + profile photos)

One-time setup (Nick):

```bash
npx wrangler r2 bucket create michigangaragepros-media
```

The bucket stays **private**. The Worker binding `MEDIA` is already in `wrangler.jsonc`. Public reads go through `GET /api/media/<key>` (no R2.dev / custom domain required). After creating the bucket, redeploy so the binding attaches.

Company image columns use migration `0020_company_media.sql` (`companies.logo_key`, `companies.photo_key`). After deploy:

```bash
npm run db:migrate:remote
```

Uploads apply **live** for claimed companies (no `listing_edit_requests` queue for binaries). Validation: JPEG/PNG/WebP only; logo ≤512KB (roughly square); photo ≤1.5MB.

### Trust credentials (self-reported)

Claimed companies can set licensed (optional license #), insured, bonded, family-owned, and years in business on `/manage/<token>/`. Values apply **live** and show on public profiles + listing cards, always labeled **self-reported** (no verification). Columns use migration `0021_company_trust.sql`. After deploy:

```bash
npm run db:migrate:remote
```

### Secrets (operator alerts + admin inbox + Stripe)

Email alerts already use Resend. Set secrets on the Worker:

```bash
npx wrangler secret put RESEND_API_KEY
# optional override (defaults in wrangler.jsonc vars):
# npx wrangler secret put NOTIFY_EMAIL
# npx wrangler secret put NOTIFY_FROM_EMAIL
# npx wrangler secret put NOTIFY_WEBHOOK_URL

# Required for /admin/leads/, /admin/claims/, /admin/featured/, and /admin/reviews/ login
npx wrangler secret put ADMIN_TOKEN

# Stripe Featured Checkout (test mode first: sk_test_… / whsec_…)
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
# Optional — Checkout Sessions redirect does not need a publishable key today:
# npx wrangler secret put NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

Without `ADMIN_TOKEN`, the admin inboxes return unauthorized / 503 on login. Leads, claims, and Featured interest still save and email notify still works when Resend is configured.

Without `STRIPE_SECRET_KEY`, `/api/featured/checkout` returns 503 and the form’s “talk to us” interest path still works.

**Stripe webhook endpoint** (Dashboard → Developers → Webhooks, or Stripe CLI):

- URL: `https://michigangaragepros.com/api/stripe/webhook/`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Signing secret → `STRIPE_WEBHOOK_SECRET`

**Stripe Customer Portal** (Dashboard → Settings → Billing → Customer portal): enable so claimed companies can update cards / view invoices / cancel from `/manage/<token>/`.

Featured Stripe columns use migrations `0011_featured_stripe.sql` + `0024_company_stripe_billing.sql`. After deploy, Nick must run:

```bash
npm run db:migrate:remote
```

Lead routing (claimed-company notify) uses migration `0012_lead_routing.sql` (`companies.notify_email`, `leads.routed_at` / `routed_to`, `lead_routings`). After deploy, Nick must run:

```bash
npm run db:migrate:remote
```

Company reviews use migration `0010_company_reviews.sql` (table `company_reviews`). Review moderation adds `moderated_at` via `0013_review_moderation.sql`. Shareable review-request links add `companies.review_token` via `0015_review_request_token.sql`. After deploy, Nick must run:

```bash
npm run db:migrate:remote
```

Seed columns `companies.rating` / `companies.reviews` remain unused for display — averages and counts come only from `company_reviews`.

**Moderation choice:** new reviews are inserted as `pending` and only become public when an operator Approves them to `status = 'visible'` in `/admin/reviews/`. Hide → `hidden`, Spam → `spam`. Public profiles and rating aggregates still query `status = 'visible'` only (unchanged from PR 30). Existing already-visible reviews are not backfilled, so they stay public after the migration.

**Review request links:** claimed companies get a regenerable `/review/<token>/` URL (shown on `/manage/<token>/` and in `/admin/claims/`). Customers submit anonymously through that link; company context is locked from the token. Submissions still insert as `pending` and use the same IP rate limits + honeypot as `POST /api/reviews`.

### Weekly performance digest (claimed companies)

Cron Trigger `0 14 * * 1` (Monday 14:00 UTC ≈ 9am Eastern Standard / 10am Eastern Daylight) runs from `custom-worker.ts` and emails each claimed company that has a notification email, has not opted out, and has activity in the prior Mon–Sun UTC window (profile views / contact clicks / leads / reviews). Sends are recorded in `weekly_digest_sends` (migration `0023_weekly_digest.sql`) so the same company is never emailed twice for the same `week_start`.

Requires `RESEND_API_KEY` (same as other company emails). Without it the scheduled handler logs and skips — it never throws. Opt-out: manage page toggle or unsubscribe link in the email (`/api/manage/<token>/digest/?action=unsubscribe`).

Admin (cookie + `ADMIN_TOKEN`):

```bash
# Preview one company (no send)
# GET /api/admin/weekly-digest?slug=<company-slug>

# Dry-run all eligible (default) or one slug
# POST /api/admin/weekly-digest  {"dryRun":true,"slug":"optional-slug"}
```

After deploy, apply the migration:

```bash
npm run db:migrate:remote
```

### Public URL

Worker → **Settings → Domains & Routes**: enable **workers.dev**, and optionally add `michigangaragepros.com`.

## Local develop

```bash
npm install
npm run db:migrate:local
# optional for local admin inboxes:
# export ADMIN_TOKEN=dev-token
npm run dev
```

Preview in the Workers runtime:

```bash
npm run preview
```

## Routes

| Path | Page |
|---|---|
| `/` | Homepage + lead modal |
| `/garage-door-repair/` (+ 5 other services) | Service template |
| `/cities/[slug]/` | City listings |
| `/companies/[slug]/` | Company profile |
| `/for-companies/` | Contractor acquisition |
| `/for-companies/featured/success/` | Stripe Checkout success (verifies session) |
| `/for-companies/featured/cancel/` | Stripe Checkout cancel return |
| `/get-a-quote/` | 5-step lead flow (`?company=slug` when started from a listing) |
| `/admin/leads/` | Token-protected lead inbox (triage `new` / `contacted` / `closed`) |
| `/admin/claims/` | Token-protected claim inbox (triage `pending` → `approved` / `rejected`; approve sets `companies.claimed` + `notify_email`) |
| `/admin/featured/` | Token-protected Featured interest inbox (triage `new` / `contacted` / `checkout_pending` / `paid` / `won` / `closed`; won sets `companies.featured`) |
| `/admin/reviews/` | Token-protected review moderation inbox (triage `pending` → `visible` / `hidden` / `spam`) |
| `/manage/<token>/` | Claimed-company listing self-manage + logo/photo + trust credentials + review-request link |
| `/review/<token>/` | Shareable customer review form locked to one claimed company (`noIndex`) |
| `GET/POST/DELETE /api/manage/<token>/media` | Claimed company upload/replace/remove logo or profile photo (R2) |
| `GET/PUT /api/manage/<token>/trust` | Claimed company self-reported trust credentials (live) |
| `GET/PUT /api/manage/<token>/digest` | Weekly digest opt-out (`?action=unsubscribe` HTML link) |
| `GET/POST /api/admin/weekly-digest` | Admin preview / dry-run (or single live send with slug) |
| `GET /api/media/<key>` | Public read proxy for company media objects in private R2 |
| `GET /api/companies/media` | Public logo/photo URLs by `slug` or batch `slugs` |
| `GET /api/companies/trust` | Public trust credentials by `slug` or batch `slugs` |
| `POST /api/leads` | Persist quote leads to D1; notify operator + route to claimed companies |
| `POST /api/claims` | Persist profile claim requests to D1 |
| `POST /api/featured` | Persist Featured interest to D1 (offline / talk-to-us fallback) |
| `POST /api/featured/checkout` | Create Stripe Checkout Session (subscription) for Featured |
| `GET /api/featured/checkout/verify` | Verify Checkout Session + activate Featured (success page) |
| `POST /api/stripe/webhook` | Stripe webhooks (`checkout.session.completed`, `customer.subscription.updated|deleted`) |
| `GET/POST /api/manage/<token>/billing` | Featured plan status + Stripe Customer Portal session |
| `GET/POST /api/reviews` | List/submit homeowner reviews (D1); new submissions start as `pending` |
| `POST /api/review/<token>` | Submit review via shareable review-request token (company locked server-side) |
| `POST /api/manage/<token>/review-token` | Claimed company ensure/regenerate review-request link |
| `POST /api/admin/review-token` | Admin regenerate/revoke review-request link |
| `GET/PATCH /api/admin/leads` | List / update leads (admin cookie) |
| `GET/PATCH /api/admin/claims` | List / update claim requests (admin cookie); approve flips `companies.claimed` |
| `GET/PATCH /api/admin/featured` | List / update Featured requests (admin cookie); won flips `companies.featured` |
| `GET/PATCH /api/admin/reviews` | List / moderate reviews (admin cookie); approve → `visible` |
| `POST/DELETE /api/admin/session` | Admin token login / logout |

## Why builds fail (checklist)

1. Building `main` before the app is merged → only `test` file present  
2. Classic Pages build settings instead of `npm run cf:build` + `wrangler deploy`  
3. Placeholder D1 `database_id` still in `wrangler.jsonc`  
4. `workers.dev` disabled → no public URL even after a successful deploy  
