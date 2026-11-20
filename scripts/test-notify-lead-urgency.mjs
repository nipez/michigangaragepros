/**
 * Ensure lead notification copy surfaces urgency (timing) clearly.
 * Run: npx tsx scripts/test-notify-lead-urgency.mjs
 */
import assert from "node:assert/strict";
import {
  formatCompanyLeadNotify,
  formatLeadNotify,
} from "../src/lib/notify-lead.ts";

const admin = formatLeadNotify({
  id: 42,
  service: "Broken Spring",
  issue: "Door won't open",
  zip: "48201",
  name: "Pat Homeowner",
  phone: "555-0100",
  email: "pat@example.com",
  timing: "Today / Emergency",
  companySlug: "acme-doors",
  sourcePage: "city",
});

assert.match(admin.subject, /Today \/ Emergency/);
assert.match(admin.text, /Urgency: Today \/ Emergency/);
assert.match(admin.text, /Source page: city/);
assert.doesNotMatch(admin.text, /^Timing:/m);

const company = formatCompanyLeadNotify({
  id: 42,
  companyName: "Acme Doors",
  service: "Broken Spring",
  issue: "Door won't open",
  zip: "48201",
  name: "Pat Homeowner",
  phone: "555-0100",
  email: "pat@example.com",
  timing: "Today / Emergency",
  reason: "direct",
});

assert.match(company.subject, /Today \/ Emergency/);
assert.match(company.text, /Urgency: Today \/ Emergency/);
assert.match(company.text, /urgent/i);
assert.match(company.html ?? "", /Urgency/);
assert.match(company.html ?? "", /urgent/i);

const flexible = formatCompanyLeadNotify({
  id: 43,
  companyName: "Acme Doors",
  service: "Maintenance",
  issue: "Routine maintenance",
  zip: "49503",
  name: "Sam",
  email: "sam@example.com",
  timing: "Flexible",
  reason: "area",
});
assert.match(flexible.text, /Urgency: Flexible/);
assert.doesNotMatch(flexible.text, /marked the job as urgent/);

console.log("test-notify-lead-urgency: ok");
