# Michigan Garage Pros

Two-sided local marketplace connecting Michigan homeowners with garage-door service companies.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Deploy target: Vercel** (recommended)

### Why Vercel (not Railway or Cloudflare Pages)

| | Vercel | Cloudflare Pages | Railway |
|---|---|---|---|
| Next.js App Router | Native, zero-config | Needs OpenNext adapter | Runs Node container |
| SEO (SSR/SSG) | Excellent | Good with adapter | Good |
| Edge lead APIs | Built-in | Workers | Separate setup |
| Best when… | SEO marketplace + forms | Already on CF edge | Long-running DB/API workers |

This site is SEO-driven marketing + lead capture. **Vercel** is the lowest-friction fit. Switch to Cloudflare later via `@opennextjs/cloudflare` if you want edge/CDN consolidation; use Railway when you add a dedicated Postgres API or background jobs.

## Routes

| Path | Page |
|---|---|
| `/` | Homepage + lead modal |
| `/garage-door-repair/` (+ 5 other services) | Service template |
| `/cities/[slug]/` | City listings |
| `/companies/[slug]/` | Company profile |
| `/for-companies/` | Contractor acquisition |
| `/get-a-quote/` | 5-step lead flow |

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build
npm start
```

## Deploy (Vercel)

1. Import `nipez/michigangaragepros` in the Vercel dashboard (or `npx vercel`).
2. Framework preset: Next.js. Build: `next build`. Output: default.
3. Point `michigangaragepros.com` DNS to Vercel.

## Next production work

- Lead submission API + email/CRM
- Company search by ZIP/city
- Profile claim / contractor auth
- Replace sample company/review data with real listings
