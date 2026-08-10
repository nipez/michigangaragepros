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

### Public URL

Worker → **Settings → Domains & Routes**: enable **workers.dev**, and optionally add `michigangaragepros.com`.

## Local develop

```bash
npm install
npm run db:migrate:local
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
| `/get-a-quote/` | 5-step lead flow |
| `POST /api/leads` | Persist quote leads to D1 + email admin inbox |
| `POST /api/claims` | Persist profile claim requests to D1 + email admin |
| `/admin/leads/` | Password-protected lead inbox (mark new/contacted/closed) |

## Lead delivery (Resend + admin inbox)

Quote requests still save to D1. To get emailed when a lead arrives, set Worker secrets:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put LEAD_NOTIFY_TO          # your inbox
npx wrangler secret put ADMIN_TOKEN             # long random string for /admin/leads
# optional:
npx wrangler secret put LEAD_NOTIFY_FROM        # verified Resend from-address
```

Then apply the notification columns migration:

```bash
npm run db:migrate:remote
```

Open `/admin/leads/`, sign in with `ADMIN_TOKEN`, and manage inbound quotes.

## Why builds fail (checklist)

1. Building `main` before the app is merged → only `test` file present  
2. Classic Pages build settings instead of `npm run cf:build` + `wrangler deploy`  
3. Placeholder D1 `database_id` still in `wrangler.jsonc`  
4. `workers.dev` disabled → no public URL even after a successful deploy  
