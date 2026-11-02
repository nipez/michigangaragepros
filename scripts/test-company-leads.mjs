/**
 * Lightweight assertions for company lead inbox helpers.
 * Covers status validation, totals, and token/slug scoping
 * (company A must not see or update company B's routings).
 *
 * Run: npx tsx scripts/test-company-leads.mjs
 */
import assert from "node:assert/strict";
import {
  COMPANY_LEAD_STATUSES,
  emptyCompanyLeadTotals,
  isCompanyLeadStatus,
  parseCompanyLeadStatusPatch,
  routingBelongsToCompany,
  scopeRoutingsToCompany,
  summarizeCompanyLeads,
} from "../src/lib/company-leads.ts";

// --- Status validation ---
assert.equal(isCompanyLeadStatus("new"), true);
assert.equal(isCompanyLeadStatus("contacted"), true);
assert.equal(isCompanyLeadStatus("quoted"), true);
assert.equal(isCompanyLeadStatus("won"), true);
assert.equal(isCompanyLeadStatus("lost"), true);
assert.equal(isCompanyLeadStatus("closed"), false);
assert.equal(isCompanyLeadStatus(""), false);
assert.deepEqual([...COMPANY_LEAD_STATUSES], [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
]);

// --- Patch parser ---
assert.deepEqual(parseCompanyLeadStatusPatch({ routingId: 12, status: "won" }), {
  routingId: 12,
  status: "won",
});
assert.deepEqual(parseCompanyLeadStatusPatch({ id: 7, status: "Quoted" }), {
  routingId: 7,
  status: "quoted",
});
assert.equal("error" in parseCompanyLeadStatusPatch({ status: "won" }), true);
assert.equal(
  "error" in parseCompanyLeadStatusPatch({ routingId: 1, status: "closed" }),
  true,
);
assert.equal("error" in parseCompanyLeadStatusPatch(null), true);

// --- Totals ---
const empty = emptyCompanyLeadTotals();
assert.equal(empty.total, 0);
assert.equal(empty.byStatus.new, 0);
empty.byStatus.new = 9;
assert.equal(emptyCompanyLeadTotals().byStatus.new, 0);

const totals = summarizeCompanyLeads([
  { companyStatus: "new" },
  { companyStatus: "new" },
  { companyStatus: "won" },
  { companyStatus: "lost" },
  { companyStatus: "contacted" },
]);
assert.equal(totals.total, 5);
assert.equal(totals.byStatus.new, 2);
assert.equal(totals.byStatus.won, 1);
assert.equal(totals.byStatus.lost, 1);
assert.equal(totals.byStatus.contacted, 1);
assert.equal(totals.byStatus.quoted, 0);

// --- Token / company scoping ---
// Simulate lead_routings rows from two companies. A manage token resolves to
// exactly one company slug; list + update always filter by that slug.
const rows = [
  { id: 1, companySlug: "alpha-doors", leadId: 101, companyStatus: "new" },
  { id: 2, companySlug: "beta-garage", leadId: 102, companyStatus: "contacted" },
  { id: 3, companySlug: "alpha-doors", leadId: 103, companyStatus: "quoted" },
  { id: 4, companySlug: "beta-garage", leadId: 104, companyStatus: "won" },
];

const alphaOnly = scopeRoutingsToCompany(rows, "alpha-doors");
assert.deepEqual(
  alphaOnly.map((r) => r.id),
  [1, 3],
);
assert.ok(alphaOnly.every((r) => r.companySlug === "alpha-doors"));

const betaOnly = scopeRoutingsToCompany(rows, "beta-garage");
assert.deepEqual(
  betaOnly.map((r) => r.id),
  [2, 4],
);

// Empty / blank slug → no rows (never leak).
assert.deepEqual(scopeRoutingsToCompany(rows, ""), []);
assert.deepEqual(scopeRoutingsToCompany(rows, "   "), []);

// Company A cannot update company B's routing.
const betaRouting = rows.find((r) => r.id === 2);
assert.equal(routingBelongsToCompany(betaRouting, "alpha-doors"), false);
assert.equal(routingBelongsToCompany(betaRouting, "beta-garage"), true);
assert.equal(routingBelongsToCompany(null, "alpha-doors"), false);
assert.equal(routingBelongsToCompany(undefined, "beta-garage"), false);

// Status update simulation: only mutate when ownership check passes.
function applyStatusUpdate(all, requesterSlug, routingId, status) {
  const target = all.find((r) => r.id === routingId) ?? null;
  if (!routingBelongsToCompany(target, requesterSlug)) return null;
  if (!isCompanyLeadStatus(status)) return null;
  return { ...target, companyStatus: status };
}

assert.equal(
  applyStatusUpdate(rows, "alpha-doors", 2, "won"),
  null,
  "alpha must not update beta's lead",
);
assert.deepEqual(applyStatusUpdate(rows, "alpha-doors", 1, "contacted"), {
  id: 1,
  companySlug: "alpha-doors",
  leadId: 101,
  companyStatus: "contacted",
});
assert.deepEqual(applyStatusUpdate(rows, "beta-garage", 4, "lost"), {
  id: 4,
  companySlug: "beta-garage",
  leadId: 104,
  companyStatus: "lost",
});

console.log("company-leads helpers: ok");
