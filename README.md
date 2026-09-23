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
| **Deploy command (main)** | `npx wrangler deploy` |
| **Deploy command (other branches)** | `npx wrangler versions upload` |
| **Root directory** | `/` (repo root) |

If Git deploys fail with `Could not find compiled Open Next config`, the build command is missing or empty — set it to `npm run cf:build` and retry.

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

Confirm **Bindings** shows `DB` → D1 `michigangaragepros`.

### Secrets (operator alerts + admin inbox)

Email alerts already use Resend. Set secrets on the Worker:

```bash
npx wrangler secret put RESEND_API_KEY
# optional override (defaults in wrangler.jsonc vars):
# npx wrangler secret put NOTIFY_EMAIL
# npx wrangler secret put NOTIFY_FROM_EMAIL
# npx wrangler secret put NOTIFY_WEBHOOK_URL

# Required for /admin/leads/ login
npx wrangler secret put ADMIN_TOKEN
```

Without `ADMIN_TOKEN`, the admin inbox returns unauthorized / 503 on login. Leads still save and email notify still works when Resend is configured.

Company reviews use migration `0010_company_reviews.sql` (table `company_reviews`). After deploy, Nick must run:

```bash
npm run db:migrate:remote
```

Seed columns `companies.rating` / `companies.reviews` remain unused for display — averages and counts come only from `company_reviews`.

**Moderation choice:** new reviews are `visible` by default after honeypot + per-IP rate limits (5/day global, 1/day per company). Status `hidden` is available for future moderation without a pending queue.

### Public URL

Worker → **Settings → Domains & Routes**: enable **workers.dev**, and optionally add `michigangaragepros.com`.

## Local develop

```bash
npm install
npm run db:migrate:local
# optional for local admin inbox:
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
| `/get-a-quote/` | 5-step lead flow (`?company=slug` when started from a listing) |
| `/admin/leads/` | Token-protected lead inbox (triage `new` / `contacted` / `closed`) |
| `POST /api/leads` | Persist quote leads to D1 |
| `POST /api/claims` | Persist profile claim requests to D1 |
| `GET/POST /api/reviews` | List/submit homeowner reviews (D1) |
| `GET/PATCH /api/admin/leads` | List / update leads (admin cookie) |
| `POST/DELETE /api/admin/session` | Admin token login / logout |

## Why builds fail (checklist)

1. Building `main` before the app is merged → only `test` file present  
2. Classic Pages build settings instead of `npm run cf:build` + `wrangler deploy`  
3. Placeholder D1 `database_id` still in `wrangler.jsonc`  
4. `workers.dev` disabled → no public URL even after a successful deploy  
