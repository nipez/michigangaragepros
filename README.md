# Michigan Garage Pros

Two-sided local marketplace connecting Michigan homeowners with garage-door service companies.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Deploy target: Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)
- **Database: Cloudflare D1** (SQLite) for leads, claim requests, and company profiles

### Why Cloudflare

| Need | Cloudflare product |
|---|---|
| SEO pages + SSR | Workers + OpenNext |
| Leads / claims / listings | **D1** |
| Future photos | R2 |
| Future cache/sessions | KV |
| Edge + custom domain | Workers custom domains |

## Routes

| Path | Page |
|---|---|
| `/` | Homepage + lead modal |
| `/garage-door-repair/` (+ 5 other services) | Service template |
| `/cities/[slug]/` | City listings |
| `/companies/[slug]/` | Company profile |
| `/for-companies/` | Contractor acquisition |
| `/get-a-quote/` | 5-step lead flow |
| `POST /api/leads` | Persist quote leads to D1 |
| `POST /api/claims` | Persist profile claim requests to D1 |

## Develop

```bash
npm install
npm run cf-typegen
npm run db:migrate:local
npm run dev
```

`next dev` uses local D1 simulation via `initOpenNextCloudflareForDev()`.

## Preview in the Workers runtime

```bash
npm run preview
```

## Deploy

1. Authenticate: `npx wrangler login`
2. Create the D1 database once:

```bash
npx wrangler d1 create michigangaragepros
```

3. Paste the returned `database_id` into `wrangler.jsonc`.
4. Apply migrations:

```bash
npm run db:migrate:remote
```

5. Deploy:

```bash
npm run deploy
```

Point `michigangaragepros.com` at the Worker (custom domain in the Cloudflare dashboard).

## D1 schema

Migrations live in `migrations/`:

- `leads` — homeowner quote requests
- `claim_requests` — contractor claim form submissions
- `companies` (+ services / service areas) — seeded sample profiles

## Next production work

- Contractor auth / claim verification
- ZIP/city search queries against D1
- R2 for company photos
- Lead routing email/notifications
