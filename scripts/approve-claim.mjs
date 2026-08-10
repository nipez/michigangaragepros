#!/usr/bin/env node
/**
 * Approve a pending company page claim in remote D1.
 *
 * Usage:
 *   npm run db:approve-claim -- --slug=acme-garage-doors
 *   npm run db:approve-claim -- --id=12
 */
import { spawnSync } from "node:child_process";

function arg(name) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : "";
}

let slug = arg("slug").trim();
const id = arg("id").trim();

if (!slug && !id) {
  console.error("Provide --slug=<company-slug> and/or --id=<claim-id>");
  process.exit(1);
}

function run(sql) {
  const result = spawnSync(
    "npx",
    [
      "wrangler",
      "d1",
      "execute",
      "michigangaragepros",
      "--remote",
      "--json",
      "--command",
      sql,
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    process.exit(result.status ?? 1);
  }
  return result.stdout || "";
}

function escapeSql(value) {
  return String(value).replaceAll("'", "''");
}

if (!slug && id) {
  const raw = run(
    `SELECT company_slug FROM claim_requests WHERE id = ${Number(id)} LIMIT 1`,
  );
  try {
    const parsed = JSON.parse(raw);
    const rows = parsed?.[0]?.results ?? parsed?.results ?? [];
    slug = String(rows[0]?.company_slug ?? "").trim();
  } catch {
    console.error("Could not parse claim lookup response.");
    process.exit(1);
  }
}

const where = id
  ? `id = ${Number(id)}`
  : `company_slug = '${escapeSql(slug)}' AND status IN ('new', 'pending')`;

run(
  `UPDATE claim_requests
   SET status = 'approved', reviewed_at = datetime('now')
   WHERE ${where}`,
);

if (slug) {
  run(
    `UPDATE companies
     SET claimed = 1
     WHERE slug = '${escapeSql(slug)}'`,
  );
  console.log(
    `\nApproved claim${id ? ` id ${id}` : ""} for slug "${slug}" and marked companies.claimed = 1 (if row exists).`,
  );
} else {
  console.log(
    `\nApproved claim id ${id}, but no company_slug was on the request — companies.claimed was not updated.`,
  );
}
