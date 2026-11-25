/**
 * Pure-helper assertions for homeowner lead check-in:
 * HMAC signing/verify, eligibility/idempotency gates, spam skip,
 * status labels, cron constant, and email copy.
 *
 * Run: npx tsx scripts/test-homeowner-checkin.mjs
 */
import assert from "node:assert/strict";
import {
  HOMEOWNER_CHECKIN_CRON,
  HOMEOWNER_CHECKIN_HOURS,
  checkinActionUrl,
  decideHomeownerCheckinSend,
  formatCheckinStatus,
  formatHomeownerCheckinNotify,
  isLikelyTestOrSpamLead,
  leadNeedsHomeownerCheckin,
} from "../src/lib/homeowner-checkin.ts";
import {
  CHECKIN_TOKEN_TTL_SECONDS,
  resolveCheckinSigningSecret,
  signCheckinToken,
  verifyCheckinToken,
} from "../src/lib/homeowner-checkin-sign.ts";

assert.equal(HOMEOWNER_CHECKIN_HOURS, 60);
assert.equal(HOMEOWNER_CHECKIN_CRON, "0 * * * *");
assert.equal(CHECKIN_TOKEN_TTL_SECONDS, 7 * 24 * 60 * 60);

// --- Spam / test skip ---
assert.equal(
  isLikelyTestOrSpamLead({ email: "owner@gmail.com", name: "Jordan Lee" }),
  false,
);
assert.equal(
  isLikelyTestOrSpamLead({ email: "foo@example.com", name: "Jordan" }),
  true,
);
assert.equal(
  isLikelyTestOrSpamLead({ email: "test@gmail.com", name: "Jordan" }),
  true,
);
assert.equal(
  isLikelyTestOrSpamLead({ email: "jordan+test@gmail.com", name: "Jordan" }),
  true,
);
assert.equal(
  isLikelyTestOrSpamLead({ email: "jordan@gmail.com", name: "Test User" }),
  true,
);
assert.equal(
  isLikelyTestOrSpamLead({ email: "jordan@gmail.com", name: "asdf" }),
  true,
);

// --- Eligibility / idempotency ---
const now = Date.parse("2026-03-10T15:00:00Z");
const oldEnough = "2026-03-08T00:00:00Z"; // > 60h earlier
const tooFresh = "2026-03-10T01:00:00Z"; // 14h earlier

assert.equal(
  leadNeedsHomeownerCheckin({
    email: "home@realmail.com",
    name: "Sam Rivera",
    createdAt: oldEnough,
    nowMs: now,
    windowHours: 60,
  }),
  true,
);

assert.equal(
  leadNeedsHomeownerCheckin({
    email: "home@realmail.com",
    name: "Sam Rivera",
    createdAt: tooFresh,
    nowMs: now,
    windowHours: 60,
  }),
  false,
  "still inside follow-up window",
);

assert.equal(
  leadNeedsHomeownerCheckin({
    email: "home@realmail.com",
    name: "Sam Rivera",
    createdAt: oldEnough,
    nowMs: now,
    checkinSentAt: "2026-03-09T12:00:00Z",
  }),
  false,
  "already sent",
);

assert.equal(
  leadNeedsHomeownerCheckin({
    email: "home@realmail.com",
    name: "Sam Rivera",
    createdAt: oldEnough,
    nowMs: now,
    checkinResponse: "not_yet",
  }),
  false,
  "already responded",
);

assert.equal(
  leadNeedsHomeownerCheckin({
    email: "home@realmail.com",
    name: "Sam Rivera",
    createdAt: oldEnough,
    nowMs: now,
    checkinOptOut: true,
  }),
  false,
  "opted out",
);

assert.equal(
  leadNeedsHomeownerCheckin({
    email: null,
    name: "Sam Rivera",
    createdAt: oldEnough,
    nowMs: now,
  }),
  false,
  "no email",
);

assert.equal(
  leadNeedsHomeownerCheckin({
    email: "spam@example.com",
    name: "Sam Rivera",
    createdAt: oldEnough,
    nowMs: now,
  }),
  false,
  "test domain",
);

// --- decideHomeownerCheckinSend matrix ---
assert.equal(
  decideHomeownerCheckinSend({
    email: "home@realmail.com",
    name: "Sam Rivera",
    checkinSentAt: null,
    checkinResponse: null,
    checkinOptOut: false,
    createdAt: oldEnough,
    windowHours: 60,
    nowMs: now,
    resendConfigured: true,
    signingConfigured: true,
  }),
  "sent",
);

assert.equal(
  decideHomeownerCheckinSend({
    email: "home@realmail.com",
    name: "Sam Rivera",
    checkinSentAt: null,
    checkinResponse: null,
    checkinOptOut: false,
    createdAt: oldEnough,
    windowHours: 60,
    nowMs: now,
    resendConfigured: false,
    signingConfigured: true,
  }),
  "skipped-no-resend",
);

assert.equal(
  decideHomeownerCheckinSend({
    email: "home@realmail.com",
    name: "Sam Rivera",
    checkinSentAt: null,
    checkinResponse: null,
    checkinOptOut: false,
    createdAt: oldEnough,
    windowHours: 60,
    nowMs: now,
    resendConfigured: true,
    signingConfigured: false,
  }),
  "skipped-no-signing",
);

assert.equal(
  decideHomeownerCheckinSend({
    email: "home@realmail.com",
    name: "Sam Rivera",
    checkinSentAt: "2026-03-09T00:00:00Z",
    checkinResponse: null,
    checkinOptOut: false,
    createdAt: oldEnough,
    windowHours: 60,
    nowMs: now,
    resendConfigured: true,
    signingConfigured: true,
  }),
  "skipped-already-sent",
);

// --- Status labels ---
assert.deepEqual(
  formatCheckinStatus({}),
  { key: "not_sent", label: "Not sent" },
);
assert.deepEqual(
  formatCheckinStatus({ checkin_sent_at: "2026-03-09T00:00:00Z" }),
  { key: "sent", label: "Sent · no response" },
);
assert.deepEqual(
  formatCheckinStatus({
    checkin_sent_at: "2026-03-09T00:00:00Z",
    checkin_response: "yes",
    checkin_helped_company_slug: "acme-doors",
  }),
  { key: "yes", label: "Yes · acme-doors" },
);
assert.deepEqual(
  formatCheckinStatus({ checkin_response: "not_yet" }),
  { key: "not_yet", label: "Not yet" },
);
assert.deepEqual(
  formatCheckinStatus({ checkin_opt_out: 1 }),
  { key: "opt_out", label: "Opted out" },
);

// --- Email copy ---
const notify = formatHomeownerCheckinNotify({
  homeownerName: "Sam Rivera",
  yesUrl: "https://michigangaragepros.com/check-in/?t=yes-token",
  notYetUrl: "https://michigangaragepros.com/check-in/?t=not-token",
  unsubUrl: "https://michigangaragepros.com/check-in/?t=unsub-token",
});
assert.equal(notify.kind, "homeowner-checkin");
assert.match(notify.subject, /Did a garage door pro get in touch/i);
assert.match(notify.text, /Yes, I'm set/);
assert.match(notify.text, /Not yet/);
assert.match(notify.text, /unsub-token/);
assert.match(notify.html, /Yes, I'm set/);
assert.match(notify.html, /Not yet/);

assert.match(
  checkinActionUrl("abc.def"),
  /^https:\/\/michigangaragepros\.com\/check-in\/\?t=/,
);

// --- Signing secret resolve ---
assert.equal(resolveCheckinSigningSecret({}), "");
assert.equal(
  resolveCheckinSigningSecret({ ADMIN_TOKEN: "admin-secret" }),
  "admin-secret",
);
assert.equal(
  resolveCheckinSigningSecret({
    CHECKIN_SIGNING_SECRET: "checkin-secret",
    ADMIN_TOKEN: "admin-secret",
  }),
  "checkin-secret",
);

// --- HMAC sign / verify ---
const secret = "unit-test-checkin-secret";
const nowSec = Math.floor(Date.parse("2026-03-10T15:00:00Z") / 1000);

const yesToken = await signCheckinToken(secret, {
  leadId: 42,
  action: "yes",
  nowSec,
});
const notYetToken = await signCheckinToken(secret, {
  leadId: 42,
  action: "not_yet",
  nowSec,
});
const unsubToken = await signCheckinToken(secret, {
  leadId: 42,
  action: "unsub",
  nowSec,
});

assert.notEqual(yesToken, notYetToken);
assert.equal(yesToken.split(".").length, 2);

const yesOk = await verifyCheckinToken(secret, yesToken, { nowSec });
assert.equal(yesOk.ok, true);
if (yesOk.ok) {
  assert.equal(yesOk.payload.leadId, 42);
  assert.equal(yesOk.payload.action, "yes");
}

const wrongAction = await verifyCheckinToken(secret, yesToken, {
  nowSec,
  expectedAction: "not_yet",
});
assert.equal(wrongAction.ok, false);

const badSig = await verifyCheckinToken(secret, yesToken.slice(0, -2) + "aa", {
  nowSec,
});
assert.equal(badSig.ok, false);

const wrongSecret = await verifyCheckinToken("other-secret", yesToken, {
  nowSec,
});
assert.equal(wrongSecret.ok, false);

const expired = await signCheckinToken(secret, {
  leadId: 7,
  action: "yes",
  nowSec,
  exp: nowSec - 10,
});
const expiredCheck = await verifyCheckinToken(secret, expired, { nowSec });
assert.equal(expiredCheck.ok, false);

const notYetOk = await verifyCheckinToken(secret, notYetToken, {
  nowSec,
  expectedAction: "not_yet",
});
assert.equal(notYetOk.ok, true);

const unsubOk = await verifyCheckinToken(secret, unsubToken, {
  nowSec,
  expectedAction: "unsub",
});
assert.equal(unsubOk.ok, true);

// Idempotency of signing: same inputs → same token
const yesToken2 = await signCheckinToken(secret, {
  leadId: 42,
  action: "yes",
  nowSec,
  exp: yesOk.ok ? yesOk.payload.exp : undefined,
});
assert.equal(yesToken, yesToken2);

console.log("test-homeowner-checkin: ok");
