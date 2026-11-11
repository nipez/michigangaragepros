/**
 * Lightweight assertions for weekly performance digest helpers.
 * Covers window math, activity gating, formatting, and cron constant.
 * Does not hit D1 or Resend.
 *
 * Run: npx tsx scripts/test-weekly-digest.mjs
 */
import assert from "node:assert/strict";
import { SITE_URL } from "../src/data/site.ts";
import {
  WEEKLY_DIGEST_CRON,
  digestUnsubscribeUrl,
  digestWindowFor,
  emptyDigestStats,
  featuredPlansUrl,
  formatWeeklyDigestNotify,
  hasDigestActivity,
  mondayOnOrBefore,
} from "../src/lib/weekly-digest.ts";

assert.equal(WEEKLY_DIGEST_CRON, "0 14 * * 1");

// --- Monday-on-or-before ---
assert.equal(mondayOnOrBefore("2026-03-09"), "2026-03-09"); // Mon
assert.equal(mondayOnOrBefore("2026-03-10"), "2026-03-09"); // Tue
assert.equal(mondayOnOrBefore("2026-03-15"), "2026-03-09"); // Sun → prior Mon
assert.equal(mondayOnOrBefore("2026-03-08"), "2026-03-02"); // Sun

// --- Digest window (cron Monday → previous Mon–Sun) ---
const window = digestWindowFor("2026-03-16"); // Monday
assert.equal(window.asOfDay, "2026-03-16");
assert.equal(window.weekStart, "2026-03-09");
assert.equal(window.periodStart, "2026-03-09");
assert.equal(window.periodEnd, "2026-03-15");

// Mid-week asOf still keys off that week's Monday → same prior week
const mid = digestWindowFor("2026-03-18");
assert.equal(mid.weekStart, "2026-03-09");
assert.equal(mid.periodEnd, "2026-03-15");

// --- Activity gating ---
assert.equal(hasDigestActivity(emptyDigestStats()), false);
assert.equal(
  hasDigestActivity({
    ...emptyDigestStats(),
    listing: { ...emptyDigestStats().listing, profile_views: 1 },
  }),
  true,
);
assert.equal(
  hasDigestActivity({ ...emptyDigestStats(), leadsCount: 2 }),
  true,
);
assert.equal(
  hasDigestActivity({ ...emptyDigestStats(), reviewsCount: 1 }),
  true,
);

// --- URLs ---
const token = "a".repeat(64);
assert.equal(
  digestUnsubscribeUrl(token),
  `${SITE_URL}/api/manage/${token}/digest/?action=unsubscribe`,
);
assert.ok(
  featuredPlansUrl({
    name: "Acme Doors",
    city: "Ann Arbor",
    slug: "acme-doors",
  }).includes("#featured"),
);

// --- Email format ---
const payload = formatWeeklyDigestNotify({
  company: {
    slug: "acme-doors",
    name: "Acme Doors",
    city: "Ann Arbor",
    featured: false,
    notifyEmail: "owner@example.com",
    manageToken: token,
    weeklyDigestOptOut: false,
  },
  window,
  stats: {
    listing: {
      profile_views: 12,
      contact_clicks: 3,
      leads_routed: 1,
      review_link_visits: 0,
      review_submissions: 0,
    },
    leadsCount: 1,
    reviewsCount: 0,
  },
  managePageUrl: `${SITE_URL}/manage/${token}/`,
  unsubscribeUrl: digestUnsubscribeUrl(token),
  featuredUrl: featuredPlansUrl({
    name: "Acme Doors",
    city: "Ann Arbor",
    slug: "acme-doors",
  }),
  hasActivity: true,
});

assert.equal(payload.kind, "weekly-digest");
assert.match(payload.subject, /Your week on Michigan Garage Pros/);
assert.match(payload.text, /Hi Acme Doors/);
assert.match(payload.text, /Profile views: 12/);
assert.match(payload.text, /New leads: 1/);
assert.match(payload.text, /Featured Pros/);
assert.match(payload.text, /unsubscribe/i);
assert.match(payload.html, /Profile views: 12/);
assert.match(payload.html, /manage/);
assert.match(payload.html, /unsubscribe/i);

const featuredPayload = formatWeeklyDigestNotify({
  company: {
    slug: "acme-doors",
    name: "Acme Doors",
    city: "Ann Arbor",
    featured: true,
    notifyEmail: "owner@example.com",
    manageToken: token,
    weeklyDigestOptOut: false,
  },
  window,
  stats: {
    listing: {
      profile_views: 4,
      contact_clicks: 0,
      leads_routed: 0,
      review_link_visits: 0,
      review_submissions: 0,
    },
    leadsCount: 0,
    reviewsCount: 0,
  },
  managePageUrl: `${SITE_URL}/manage/${token}/`,
  unsubscribeUrl: digestUnsubscribeUrl(token),
  featuredUrl: featuredPlansUrl({
    name: "Acme Doors",
    city: "Ann Arbor",
    slug: "acme-doors",
  }),
  hasActivity: true,
});
assert.doesNotMatch(featuredPayload.text, /Featured Pros sit/);
assert.doesNotMatch(featuredPayload.html, /see Featured plans/);

console.log("test-weekly-digest: ok");
