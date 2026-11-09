#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing and other participants).
 *
 * Usage:
 *   npm run indexnow -- --dry-run
 *   npm run indexnow -- --from-sitemap
 *   npm run indexnow -- https://michigangaragepros.com/blog/my-article/
 *   npm run indexnow:postdeploy   # never fails the deploy
 *
 * Modes:
 *   (a) Explicit URL args — submit only those URLs
 *   (b) --from-sitemap (default when no URLs) — fetch the live sitemap,
 *       diff <loc>/<lastmod> against data/indexnow-snapshot.json, submit
 *       new or changed URLs, then refresh the snapshot on success
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SNAPSHOT_PATH = join(ROOT, "data/indexnow-snapshot.json");

export const INDEXNOW = {
  host: "michigangaragepros.com",
  key: "427fa9d9fd78243932aba8b20d6f7afd",
  keyLocation:
    "https://michigangaragepros.com/427fa9d9fd78243932aba8b20d6f7afd.txt",
  endpoint: "https://api.indexnow.org/indexnow",
  sitemapUrl: "https://michigangaragepros.com/sitemap.xml",
  batchSize: 10_000,
};

/**
 * Parse sitemap XML into { loc, lastmod } entries.
 * lastmod is "" when absent.
 */
export function parseSitemap(xml) {
  const urls = [];
  const urlBlocks = xml.match(/<url\b[^>]*>[\s\S]*?<\/url>/gi) ?? [];
  for (const block of urlBlocks) {
    const locMatch = block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/i);
    if (!locMatch) continue;
    const lastmodMatch = block.match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/i);
    urls.push({
      loc: locMatch[1].trim(),
      lastmod: lastmodMatch ? lastmodMatch[1].trim() : "",
    });
  }
  return urls;
}

export function loadSnapshot(path = SNAPSHOT_PATH) {
  if (!existsSync(path)) {
    return { updatedAt: null, urls: {} };
  }
  try {
    const raw = JSON.parse(readFileSync(path, "utf8"));
    return {
      updatedAt: raw.updatedAt ?? null,
      urls:
        raw.urls && typeof raw.urls === "object" && !Array.isArray(raw.urls)
          ? raw.urls
          : {},
    };
  } catch {
    return { updatedAt: null, urls: {} };
  }
}

export function saveSnapshot(entries, path = SNAPSHOT_PATH) {
  const urls = {};
  for (const { loc, lastmod } of entries) {
    urls[loc] = lastmod ?? "";
  }
  const payload = {
    updatedAt: new Date().toISOString(),
    urls,
  };
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`);
  return payload;
}

/** URLs whose loc is new or whose lastmod changed vs the snapshot. */
export function diffSitemap(entries, snapshot) {
  const prev = snapshot?.urls ?? {};
  const changed = [];
  for (const entry of entries) {
    if (!(entry.loc in prev) || prev[entry.loc] !== (entry.lastmod ?? "")) {
      changed.push(entry.loc);
    }
  }
  return changed;
}

export function chunk(list, size) {
  const batches = [];
  for (let i = 0; i < list.length; i += size) {
    batches.push(list.slice(i, i + size));
  }
  return batches;
}

export function buildPayload(urlList) {
  return {
    host: INDEXNOW.host,
    key: INDEXNOW.key,
    keyLocation: INDEXNOW.keyLocation,
    urlList,
  };
}

function parseArgs(argv) {
  const flags = {
    dryRun: false,
    fromSitemap: false,
    forceAll: false,
    neverFail: false,
    help: false,
  };
  const urls = [];
  for (const arg of argv) {
    if (arg === "--dry-run") flags.dryRun = true;
    else if (arg === "--from-sitemap") flags.fromSitemap = true;
    else if (arg === "--force-all") flags.forceAll = true;
    else if (arg === "--never-fail") flags.neverFail = true;
    else if (arg === "--help" || arg === "-h") flags.help = true;
    else if (arg.startsWith("-")) {
      throw new Error(`Unknown flag: ${arg}`);
    } else {
      urls.push(arg);
    }
  }
  if (!flags.fromSitemap && urls.length === 0) {
    flags.fromSitemap = true;
  }
  return { flags, urls };
}

function printHelp() {
  console.log(`IndexNow submit for ${INDEXNOW.host}

Usage:
  node scripts/indexnow-submit.mjs [options] [url ...]

Options:
  --from-sitemap   Diff live sitemap vs data/indexnow-snapshot.json (default)
  --force-all      Submit every sitemap URL (ignore snapshot; one-time kickoff)
  --dry-run        Print JSON payload(s); do not POST or write snapshot
  --never-fail     Log errors and exit 0 (for Workers Builds post-deploy)
  --help           Show this help

Examples:
  npm run indexnow -- --dry-run
  npm run indexnow -- --from-sitemap
  npm run indexnow -- --force-all
  npm run indexnow -- https://michigangaragepros.com/blog/my-article/
  npm run indexnow:postdeploy
`);
}

async function fetchSitemap(url = INDEXNOW.sitemapUrl) {
  const res = await fetch(url, {
    headers: { accept: "application/xml,text/xml,*/*" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap ${url}: HTTP ${res.status}`);
  }
  return res.text();
}

async function postIndexNow(payload, { dryRun }) {
  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    return { ok: true, status: 0, dryRun: true };
  }
  const res = await fetch(INDEXNOW.endpoint, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const text = await res.text().catch(() => "");
  // 200 = OK, 202 = accepted pending key verification
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(
      `IndexNow HTTP ${res.status}: ${text.slice(0, 500) || res.statusText}`,
    );
  }
  console.log(
    `IndexNow accepted batch of ${payload.urlList.length} URL(s) (HTTP ${res.status})`,
  );
  return { ok: true, status: res.status };
}

async function run(argv = process.argv.slice(2)) {
  const { flags, urls } = parseArgs(argv);
  if (flags.help) {
    printHelp();
    return 0;
  }

  let urlList;
  let sitemapEntries = null;

  if (urls.length > 0) {
    urlList = [...new Set(urls)];
    console.log(`Submitting ${urlList.length} explicit URL(s)`);
  } else {
    console.log(`Fetching sitemap ${INDEXNOW.sitemapUrl}`);
    const xml = await fetchSitemap();
    sitemapEntries = parseSitemap(xml);
    if (flags.forceAll) {
      urlList = sitemapEntries.map((e) => e.loc);
      console.log(
        `Sitemap has ${sitemapEntries.length} URL(s); --force-all submitting all`,
      );
    } else {
      const snapshot = loadSnapshot();
      urlList = diffSitemap(sitemapEntries, snapshot);
      console.log(
        `Sitemap has ${sitemapEntries.length} URL(s); ${urlList.length} new/changed vs snapshot`,
      );
    }
  }

  if (urlList.length === 0) {
    console.log("Nothing to submit.");
    if (sitemapEntries && !flags.dryRun) {
      saveSnapshot(sitemapEntries);
      console.log(`Refreshed snapshot at ${SNAPSHOT_PATH}`);
    }
    return 0;
  }

  const batches = chunk(urlList, INDEXNOW.batchSize);
  for (let i = 0; i < batches.length; i++) {
    const payload = buildPayload(batches[i]);
    console.log(
      `Batch ${i + 1}/${batches.length}: ${batches[i].length} URL(s)${
        flags.dryRun ? " (dry-run)" : ""
      }`,
    );
    await postIndexNow(payload, { dryRun: flags.dryRun });
  }

  if (!flags.dryRun) {
    if (sitemapEntries) {
      saveSnapshot(sitemapEntries);
      console.log(`Wrote snapshot ${SNAPSHOT_PATH}`);
    } else {
      // Explicit URL submit: merge into snapshot so re-runs stay quiet.
      const snapshot = loadSnapshot();
      const merged = Object.entries(snapshot.urls).map(([loc, lastmod]) => ({
        loc,
        lastmod,
      }));
      for (const loc of urlList) {
        if (!(loc in snapshot.urls)) merged.push({ loc, lastmod: "" });
      }
      saveSnapshot(merged);
      console.log(`Updated snapshot ${SNAPSHOT_PATH} with explicit URL(s)`);
    }
  }

  return 0;
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const neverFail = process.argv.includes("--never-fail");
  run().then(
    (code) => process.exit(code ?? 0),
    (err) => {
      console.error(`[indexnow] ${err?.stack || err}`);
      process.exit(neverFail ? 0 : 1);
    },
  );
}
