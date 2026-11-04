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
  // Prefer claim contact email as durable companies.notify_email for lead routing.
  let notifyEmail = "";
  if (id) {
    const raw = run(
      `SELECT email FROM claim_requests WHERE id = ${Number(id)} LIMIT 1`,
    );
    try {
      const parsed = JSON.parse(raw);
      const rows = parsed?.[0]?.results ?? parsed?.results ?? [];
      notifyEmail = String(rows[0]?.email ?? "").trim();
    } catch {
      // fall through — still mark claimed
    }
  } else {
    const raw = run(
      `SELECT email FROM claim_requests
       WHERE company_slug = '${escapeSql(slug)}' AND status = 'approved'
       ORDER BY datetime(COALESCE(reviewed_at, created_at)) DESC
       LIMIT 1`,
    );
    try {
      const parsed = JSON.parse(raw);
      const rows = parsed?.[0]?.results ?? parsed?.results ?? [];
      notifyEmail = String(rows[0]?.email ?? "").trim();
    } catch {
      // fall through
    }
  }

  if (notifyEmail) {
    run(
      `UPDATE companies
       SET claimed = 1, notify_email = '${escapeSql(notifyEmail)}'
       WHERE slug = '${escapeSql(slug)}'`,
    );
  } else {
    run(
      `UPDATE companies
       SET claimed = 1
       WHERE slug = '${escapeSql(slug)}'`,
    );
  }

  // Issue a manage_token if the claimed company does not already have one.
  let manageToken = "";
  const tokenLookup = run(
    `SELECT manage_token FROM companies WHERE slug = '${escapeSql(slug)}' LIMIT 1`,
  );
  try {
    const parsed = JSON.parse(tokenLookup);
    const rows = parsed?.[0]?.results ?? parsed?.results ?? [];
    manageToken = String(rows[0]?.manage_token ?? "").trim();
  } catch {
    // fall through
  }

  if (!manageToken) {
    manageToken = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0"),
    ).join("");
    run(
      `UPDATE companies
       SET manage_token = '${escapeSql(manageToken)}',
           manage_token_created_at = datetime('now')
       WHERE slug = '${escapeSql(slug)}'`,
    );
  }

  // Retain historical leads that targeted this listing into lead_routings so
  // they appear in the company manage inbox (emailed=0 — no re-notify).
  const retainEmail =
    notifyEmail || `retained+${slug}@michigangaragepros.local`;
  run(
    `INSERT INTO lead_routings
       (lead_id, company_id, company_slug, email, reason, emailed, company_status)
     SELECT l.id,
            c.id,
            '${escapeSql(slug)}',
            '${escapeSql(retainEmail)}',
            'retained',
            0,
            'new'
     FROM leads l
     INNER JOIN companies c ON c.slug = '${escapeSql(slug)}'
     WHERE l.company_slug = '${escapeSql(slug)}'
       AND NOT EXISTS (
         SELECT 1 FROM lead_routings lr
         WHERE lr.lead_id = l.id AND lr.company_slug = '${escapeSql(slug)}'
       )`,
  );

  console.log(
    `\nApproved claim${id ? ` id ${id}` : ""} for slug "${slug}" and marked companies.claimed = 1 (if row exists)${notifyEmail ? ` with notify_email=${notifyEmail}` : ""}.`,
  );
  console.log(
    "Retained any prior company-targeted leads into lead_routings (reason=retained, emailed=0).",
  );
  if (manageToken) {
    console.log(
      `Manage link: https://michigangaragepros.com/manage/${manageToken}/`,
    );
  }
} else {
  console.log(
    `\nApproved claim id ${id}, but no company_slug was on the request — companies.claimed was not updated.`,
  );
}
