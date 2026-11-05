/**
 * Lightweight assertions for manage-link recovery helpers.
 * Covers email normalization, validation, match selection,
 * and anti-enumeration success response shape.
 *
 * Run: npx tsx scripts/test-manage-recover.mjs
 */
import assert from "node:assert/strict";
import {
  EMPTY_MANAGE_RECOVER,
  MANAGE_RECOVER_SUCCESS_MESSAGE,
  RATE_LIMIT_PER_EMAIL,
  RATE_LIMIT_PER_IP,
  RATE_LIMIT_WINDOW_HOURS,
  emailsMatch,
  manageRecoverSuccessResponse,
  normalizeRecoverEmail,
  selectRecoverMatch,
  validateManageRecover,
} from "../src/lib/manage-recover.ts";

// --- Constants / rate limits ---
assert.equal(RATE_LIMIT_WINDOW_HOURS, 1);
assert.equal(RATE_LIMIT_PER_IP, 5);
assert.equal(RATE_LIMIT_PER_EMAIL, 3);
assert.ok(MANAGE_RECOVER_SUCCESS_MESSAGE.includes("If we find a claimed listing"));

// --- Email normalization ---
assert.equal(normalizeRecoverEmail("  Owner@Example.COM "), "owner@example.com");
assert.equal(normalizeRecoverEmail(""), "");
assert.equal(
  emailsMatch("Owner@Example.COM", "owner@example.com"),
  true,
);
assert.equal(emailsMatch("other@example.com", "owner@example.com"), false);
assert.equal(emailsMatch(null, "owner@example.com"), false);
assert.equal(emailsMatch("  ", "owner@example.com"), false);

// --- Validation ---
assert.equal(
  validateManageRecover({ ...EMPTY_MANAGE_RECOVER, email: "owner@example.com" }),
  null,
);
assert.equal(
  validateManageRecover({ ...EMPTY_MANAGE_RECOVER, email: "not-an-email" }) !=
    null,
  true,
);
assert.equal(
  validateManageRecover({ ...EMPTY_MANAGE_RECOVER, email: "" }) != null,
  true,
);
// Optional company fields never required
assert.equal(
  validateManageRecover({
    email: "owner@example.com",
    companyName: "",
    companySlug: "",
    website: "",
  }),
  null,
);

// --- Anti-enumeration response shape ---
const success = manageRecoverSuccessResponse();
assert.deepEqual(success, {
  ok: true,
  message: MANAGE_RECOVER_SUCCESS_MESSAGE,
});
// Matched and unmatched callers must receive the identical public payload.
assert.deepEqual(manageRecoverSuccessResponse(), success);

// --- Match selection ---
const candidates = [
  {
    slug: "alpha-doors",
    companyName: "Alpha Garage Doors",
    manageToken: "a".repeat(64),
    notifyEmail: "owner@example.com",
  },
  {
    slug: "beta-garage",
    companyName: "Beta Garage Pros",
    manageToken: "b".repeat(64),
    notifyEmail: "owner@example.com",
  },
];

assert.equal(selectRecoverMatch([], {}), null);
assert.deepEqual(selectRecoverMatch(candidates, {}), candidates[0]);

assert.deepEqual(
  selectRecoverMatch(candidates, { companySlug: "beta-garage" }),
  candidates[1],
);
assert.deepEqual(
  selectRecoverMatch(candidates, { companySlug: "BETA-GARAGE" }),
  candidates[1],
);
// Unknown slug must not fall through to another company
assert.equal(
  selectRecoverMatch(candidates, { companySlug: "missing-co" }),
  null,
);

assert.deepEqual(
  selectRecoverMatch(candidates, { companyName: "Beta" }),
  candidates[1],
);
assert.deepEqual(
  selectRecoverMatch(candidates, { companyName: "Garage" }),
  candidates[0],
);
assert.equal(
  selectRecoverMatch(candidates, { companyName: "No Such Co" }),
  null,
);

// Slug wins over name when both provided
assert.deepEqual(
  selectRecoverMatch(candidates, {
    companySlug: "alpha-doors",
    companyName: "Beta",
  }),
  candidates[0],
);

console.log("test-manage-recover: ok");
