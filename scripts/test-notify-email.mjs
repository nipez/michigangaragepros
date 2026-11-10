/**
 * Lightweight assertions for notification email helpers.
 * Covers normalize/validate, rate-limit constants, and manage-token format
 * guards used by the notify-email API. (Does not import notify.ts — that
 * module pulls Cloudflare context at load time.)
 *
 * Run: npx tsx scripts/test-notify-email.mjs
 */
import assert from "node:assert/strict";
import { isValidManageTokenFormat } from "../src/lib/listing-manage.ts";
import {
  NOTIFY_EMAIL_MAX_LEN,
  RATE_LIMIT_PER_COMPANY,
  RATE_LIMIT_PER_IP,
  RATE_LIMIT_WINDOW_HOURS,
  normalizeNotifyEmail,
  validateNotifyEmail,
} from "../src/lib/notify-email.ts";

// --- Constants / rate limits ---
assert.equal(RATE_LIMIT_WINDOW_HOURS, 1);
assert.equal(RATE_LIMIT_PER_COMPANY, 5);
assert.equal(RATE_LIMIT_PER_IP, 20);
assert.equal(NOTIFY_EMAIL_MAX_LEN, 254);

// --- Normalization ---
assert.equal(normalizeNotifyEmail("  Owner@Example.COM "), "owner@example.com");
assert.equal(normalizeNotifyEmail(""), "");

// --- Validation ---
assert.equal(validateNotifyEmail("owner@example.com"), null);
assert.equal(validateNotifyEmail("  Owner@Example.COM "), null);
assert.ok(validateNotifyEmail("") != null);
assert.ok(validateNotifyEmail("not-an-email") != null);
assert.ok(validateNotifyEmail("missing-domain@") != null);
assert.ok(validateNotifyEmail("@nodomain.com") != null);
assert.ok(validateNotifyEmail("a@b") != null);
assert.ok(validateNotifyEmail("a@.com") != null);
assert.ok(validateNotifyEmail("a@com.") != null);
assert.ok(
  validateNotifyEmail(`${"a".repeat(250)}@x.com`) != null,
  "rejects overlong emails",
);
assert.equal(
  validateNotifyEmail("office+leads@garage-doors.example.com"),
  null,
);

// --- Auth failure path (token format mirrors manage APIs) ---
assert.equal(isValidManageTokenFormat("not-a-token"), false);
assert.equal(isValidManageTokenFormat("a".repeat(64)), true);
assert.equal(isValidManageTokenFormat("g".repeat(64)), false);

console.log("test-notify-email: ok");
