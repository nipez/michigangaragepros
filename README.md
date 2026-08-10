# Michigan Garage Pros

Two-sided local marketplace connecting Michigan homeowners with garage-door service companies.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Deploy target: Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) (not classic Pages static hosting)
- **Database: Cloudflare D1** for leads, claim requests, and company profiles

## Cloudflare dashboard setup (Workers Builds)

This app must be a **Worker** with OpenNext — not a classic Pages static project.

### 1. Use the branch that has the app

`main` currently only has a stub `test` file until [PR #1](https://github.com/nipez/michigangaragepros/pull/1) is merged.

Until then, in the Worker → **Settings → Build**:

- **Production branch:** `cursor/michigan-garage-pros-site-732a`  
  (or merge PR #1 and keep `main`)

### 2. Build / deploy commands

| Setting | Value |
|---|---|
| **Build command** | `npm run cf:build` |
| **Deploy command** | `npx wrangler deploy` |
| **Root directory** | `/` (repo root) |
| **Non-production deploy** | `npx wrangler versions upload` |

Do **not** use classic Pages defaults like “framework: Next.js” + output directory `.next` / `out`.

### 3. Create D1 and paste the ID

```bash
npx wrangler login
npx wrangler d1 create michigangaragepros
```

Copy the returned `database_id` into `wrangler.jsonc` → `d1_databases[0].database_id`, commit, then:

```bash
npm run db:migrate:remote
```

In the dashboard, confirm **Bindings** shows `DB` → D1 `michigangaragepros`.

### 4. Enable a public URL

Worker → **Settings → Domains & Routes**:

- Turn **workers.dev** **On** (screenshot showed it Disabled → “No URLs enabled”)
- Optionally add custom domain `michigangaragepros.com`

### 5. Retry the build

Push a commit or click **Retry** on the failed build after the settings above are saved.

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
| `POST /api/leads` | Persist quote leads to D1 |
| `POST /api/claims` | Persist profile claim requests to D1 |

## Why builds fail (checklist)

1. Building `main` before the app is merged → only `test` file present  
2. Classic Pages build settings instead of `npm run cf:build` + `wrangler deploy`  
3. Placeholder D1 `database_id` still in `wrangler.jsonc`  
4. `workers.dev` disabled → no public URL even after a successful deploy  
