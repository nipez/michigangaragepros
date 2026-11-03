/**
 * Lightweight assertions for owner review-reply helpers.
 * Covers sanitization, validation, company scoping, and moderation
 * state changes (edit of an approved reply returns to pending).
 *
 * Run: npx tsx scripts/test-review-replies.mjs
 */
import assert from "node:assert/strict";
import {
  MAX_OWNER_REPLY,
  MIN_OWNER_REPLY,
  OWNER_REPLY_STATUSES,
  canReplyToReview,
  isOwnerReplyStatus,
  nextReplyStatusOnWrite,
  parseOwnerReplyDelete,
  parseOwnerReplyModeration,
  parseOwnerReplyUpsert,
  publicOwnerReplyFromRow,
  reviewBelongsToCompany,
  sanitizeOwnerReply,
  scopeReviewsToCompany,
  validateOwnerReply,
} from "../src/lib/review-replies.ts";

// --- Status vocabulary ---
assert.equal(isOwnerReplyStatus("pending"), true);
assert.equal(isOwnerReplyStatus("visible"), true);
assert.equal(isOwnerReplyStatus("hidden"), true);
assert.equal(isOwnerReplyStatus("spam"), false);
assert.equal(isOwnerReplyStatus(""), false);
assert.deepEqual([...OWNER_REPLY_STATUSES], ["pending", "visible", "hidden"]);

// --- Sanitization / validation ---
assert.equal(sanitizeOwnerReply("  Thanks for the kind words!  "), "Thanks for the kind words!");
assert.equal(
  sanitizeOwnerReply('<script>alert("x")</script>Thanks'),
  'alert("x")Thanks',
);
assert.equal(sanitizeOwnerReply("Hello <b>world</b>"), "Hello world");
assert.equal(sanitizeOwnerReply("a < b > c"), "a  c");
assert.equal(validateOwnerReply("ok"), null);
assert.equal(validateOwnerReply("x"), `Reply must be at least ${MIN_OWNER_REPLY} characters`);
assert.equal(
  validateOwnerReply("a".repeat(MAX_OWNER_REPLY + 1)),
  `Reply must be ${MAX_OWNER_REPLY} characters or fewer`,
);
assert.equal(validateOwnerReply("<i></i>"), `Reply must be at least ${MIN_OWNER_REPLY} characters`);

// --- Parsers ---
assert.deepEqual(parseOwnerReplyUpsert({ reviewId: 9, body: "We appreciate it." }), {
  reviewId: 9,
  body: "We appreciate it.",
});
assert.deepEqual(parseOwnerReplyUpsert({ id: 3, reply: "Glad we could help." }), {
  reviewId: 3,
  body: "Glad we could help.",
});
assert.equal("error" in parseOwnerReplyUpsert({ body: "hi" }), true);
assert.equal("error" in parseOwnerReplyUpsert({ reviewId: 1, body: "x" }), true);
assert.equal("error" in parseOwnerReplyUpsert(null), true);

assert.deepEqual(parseOwnerReplyDelete({ reviewId: 4 }), { reviewId: 4 });
assert.deepEqual(parseOwnerReplyDelete({ id: 8 }), { reviewId: 8 });
assert.equal("error" in parseOwnerReplyDelete({}), true);

assert.deepEqual(parseOwnerReplyModeration({ id: 2, replyStatus: "visible" }), {
  id: 2,
  replyStatus: "visible",
});
assert.deepEqual(
  parseOwnerReplyModeration({ id: 2, owner_reply_status: "Hidden" }),
  { id: 2, replyStatus: "hidden" },
);
assert.equal(
  "error" in parseOwnerReplyModeration({ id: 1, replyStatus: "spam" }),
  true,
);

// --- Token / company scoping ---
const rows = [
  { id: 1, companySlug: "alpha-doors", status: "visible" },
  { id: 2, companySlug: "beta-garage", status: "visible" },
  { id: 3, companySlug: "alpha-doors", status: "pending" },
  { id: 4, companySlug: "beta-garage", status: "hidden" },
];

const alphaOnly = scopeReviewsToCompany(rows, "alpha-doors");
assert.deepEqual(
  alphaOnly.map((r) => r.id),
  [1, 3],
);
assert.ok(alphaOnly.every((r) => r.companySlug === "alpha-doors"));

assert.deepEqual(scopeReviewsToCompany(rows, ""), []);
assert.deepEqual(scopeReviewsToCompany(rows, "   "), []);

assert.equal(reviewBelongsToCompany(rows[1], "alpha-doors"), false);
assert.equal(reviewBelongsToCompany(rows[1], "beta-garage"), true);
assert.equal(reviewBelongsToCompany(null, "alpha-doors"), false);

// Company A cannot reply to company B; only approved (visible) reviews.
assert.equal(canReplyToReview(rows[0], "alpha-doors"), true);
assert.equal(canReplyToReview(rows[1], "alpha-doors"), false);
assert.equal(canReplyToReview(rows[2], "alpha-doors"), false);
assert.equal(canReplyToReview(rows[3], "beta-garage"), false);

// Status update simulation: only mutate when ownership + visible check passes.
function applyReplyWrite(all, requesterSlug, reviewId, body) {
  const target = all.find((r) => r.id === reviewId) ?? null;
  if (!canReplyToReview(target, requesterSlug)) return null;
  if (validateOwnerReply(body)) return null;
  return {
    ...target,
    ownerReply: sanitizeOwnerReply(body),
    ownerReplyStatus: nextReplyStatusOnWrite(target.ownerReplyStatus ?? null),
  };
}

assert.equal(
  applyReplyWrite(rows, "alpha-doors", 2, "Thanks from alpha"),
  null,
  "alpha must not reply to beta's review",
);
assert.equal(
  applyReplyWrite(rows, "alpha-doors", 3, "Too soon"),
  null,
  "cannot reply to pending review",
);

const written = applyReplyWrite(rows, "alpha-doors", 1, "Thanks for choosing us!");
assert.deepEqual(written, {
  id: 1,
  companySlug: "alpha-doors",
  status: "visible",
  ownerReply: "Thanks for choosing us!",
  ownerReplyStatus: "pending",
});

// Editing an approved (visible) reply sends it back to pending.
assert.equal(nextReplyStatusOnWrite("visible"), "pending");
assert.equal(nextReplyStatusOnWrite("pending"), "pending");
assert.equal(nextReplyStatusOnWrite("hidden"), "pending");
assert.equal(nextReplyStatusOnWrite(null), "pending");

const afterEdit = applyReplyWrite(
  [{ ...rows[0], ownerReplyStatus: "visible", ownerReply: "Old" }],
  "alpha-doors",
  1,
  "Updated response after a fix.",
);
assert.equal(afterEdit?.ownerReplyStatus, "pending");
assert.equal(afterEdit?.ownerReply, "Updated response after a fix.");

// --- Public visibility ---
assert.equal(
  publicOwnerReplyFromRow({
    owner_reply: "Live reply",
    owner_reply_status: "visible",
    owner_reply_at: "2026-11-01 12:00:00",
  })?.body,
  "Live reply",
);
assert.equal(
  publicOwnerReplyFromRow({
    owner_reply: "Pending reply",
    owner_reply_status: "pending",
    owner_reply_at: "2026-11-01 12:00:00",
  }),
  null,
);
assert.equal(
  publicOwnerReplyFromRow({
    owner_reply: "Hidden reply",
    owner_reply_status: "hidden",
    owner_reply_at: "2026-11-01 12:00:00",
  }),
  null,
);
assert.equal(
  publicOwnerReplyFromRow({
    owner_reply: null,
    owner_reply_status: null,
    owner_reply_at: null,
  }),
  null,
);

console.log("review-replies helpers: ok");
