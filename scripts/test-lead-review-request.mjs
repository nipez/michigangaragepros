/**
 * Lightweight assertions for won-lead → review-request helpers.
 * Covers eligibility, idempotency, scoping, rate limits, URL attribution,
 * and graceful missing-Resend behavior. Does not import notify.ts
 * (Cloudflare context at load time).
 *
 * Run: npx tsx scripts/test-lead-review-request.mjs
 */
import assert from "node:assert/strict";
import {
  REVIEW_REQUEST_RATE_LIMIT_PER_DAY,
  canRequestReviewForLead,
  decideLeadReviewRequest,
  formatReviewRequestedLabel,
  isValidHomeownerEmail,
  parseLeadReviewRequestBody,
  reviewRequestUrlForLead,
} from "../src/lib/lead-review-request.ts";

// --- Body parser ---
assert.deepEqual(parseLeadReviewRequestBody({ routingId: 42 }), {
  routingId: 42,
});
assert.deepEqual(parseLeadReviewRequestBody({ id: 7 }), { routingId: 7 });
assert.equal("error" in parseLeadReviewRequestBody({}), true);
assert.equal("error" in parseLeadReviewRequestBody(null), true);
assert.equal("error" in parseLeadReviewRequestBody({ routingId: 0 }), true);

// --- Homeowner email ---
assert.equal(isValidHomeownerEmail("owner@example.com"), true);
assert.equal(isValidHomeownerEmail("  Owner@Example.COM "), true);
assert.equal(isValidHomeownerEmail(null), false);
assert.equal(isValidHomeownerEmail(""), false);
assert.equal(isValidHomeownerEmail("not-an-email"), false);
assert.equal(isValidHomeownerEmail("a@b"), false);

// --- Eligibility: won + email only ---
assert.equal(
  canRequestReviewForLead({
    companyStatus: "won",
    email: "home@example.com",
  }).ok,
  true,
);
assert.equal(
  "error" in
    canRequestReviewForLead({
      companyStatus: "quoted",
      email: "home@example.com",
    }),
  true,
);
assert.equal(
  "error" in
    canRequestReviewForLead({ companyStatus: "won", email: null }),
  true,
);

// --- Decision matrix (pure; no D1) ---
assert.deepEqual(
  decideLeadReviewRequest({
    ownedByCompany: false,
    companyStatus: "won",
    email: "a@b.co",
    alreadyRequestedAt: null,
    recentCount: 0,
    resendConfigured: true,
    sendSucceeded: true,
  }),
  { action: "reject", error: "Not found", status: 404 },
);

const idempotent = decideLeadReviewRequest({
  ownedByCompany: true,
  companyStatus: "won",
  email: "a@b.co",
  alreadyRequestedAt: "2026-03-01 12:00:00",
  recentCount: 0,
  resendConfigured: true,
  sendSucceeded: true,
});
assert.equal(idempotent.action, "idempotent");
assert.match(idempotent.label, /^Review requested on /);

assert.equal(
  decideLeadReviewRequest({
    ownedByCompany: true,
    companyStatus: "contacted",
    email: "a@b.co",
    alreadyRequestedAt: null,
    recentCount: 0,
    resendConfigured: true,
    sendSucceeded: true,
  }).action,
  "reject",
);

assert.equal(
  decideLeadReviewRequest({
    ownedByCompany: true,
    companyStatus: "won",
    email: "a@b.co",
    alreadyRequestedAt: null,
    recentCount: REVIEW_REQUEST_RATE_LIMIT_PER_DAY,
    resendConfigured: true,
    sendSucceeded: true,
  }).status,
  429,
);

assert.equal(
  decideLeadReviewRequest({
    ownedByCompany: true,
    companyStatus: "won",
    email: "a@b.co",
    alreadyRequestedAt: null,
    recentCount: 0,
    resendConfigured: false,
    sendSucceeded: false,
  }).status,
  503,
);

assert.deepEqual(
  decideLeadReviewRequest({
    ownedByCompany: true,
    companyStatus: "won",
    email: "a@b.co",
    alreadyRequestedAt: null,
    recentCount: 0,
    resendConfigured: true,
    sendSucceeded: true,
  }),
  { action: "send" },
);

// Company A cannot trigger for company B — ownedByCompany is the API's
// company_slug filter result; false → 404 (same as leads PATCH).
assert.equal(
  decideLeadReviewRequest({
    ownedByCompany: false,
    companyStatus: "won",
    email: "homeowner@example.com",
    alreadyRequestedAt: null,
    recentCount: 0,
    resendConfigured: true,
    sendSucceeded: true,
  }).status,
  404,
);

// --- Review URL attribution ---
const url = reviewRequestUrlForLead("a".repeat(64), 99);
assert.match(url, /\/review\/a{64}\//);
assert.match(url, /[?&]lead=99$/);
assert.equal(
  reviewRequestUrlForLead("b".repeat(64), 0).includes("lead="),
  false,
);

// --- Label formatting ---
assert.equal(formatReviewRequestedLabel(null), "");
assert.match(
  formatReviewRequestedLabel("2026-03-18 15:30:00"),
  /^Review requested on /,
);

// Email body lives in notify.ts (Resend path); not imported here because
// that module pulls Cloudflare context. Content requirements are covered by
// formatLeadReviewRequestNotify in src/lib/notify.ts (company name + why +
// review URL; homeowner email is the sole recipient).

console.log("test-lead-review-request: ok");
