/**
 * Pure lead notification formatters (no Cloudflare imports — safe for unit tests).
 */

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** Keep intentional blank lines; only drop null optional fields. */
function keepLines(lines: Array<string | null>): string[] {
  return lines.filter((l): l is string => l !== null);
}

function isUrgentTiming(timing: string): boolean {
  const t = timing.toLowerCase();
  return t.includes("emergency") || t.includes("asap") || t.includes("today");
}

export function formatLeadNotify(lead: {
  id: number | string;
  service: string;
  issue: string;
  zip: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  timing: string;
  companySlug?: string | null;
  sourcePage?: string | null;
}) {
  const lines = keepLines([
    "New homeowner lead",
    "",
    `ID: ${lead.id}`,
    `Service: ${lead.service}`,
    `Issue: ${lead.issue}`,
    `ZIP: ${lead.zip}`,
    `Name: ${lead.name}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.email ? `Email: ${lead.email}` : null,
    `Urgency: ${lead.timing}`,
    lead.companySlug ? `Company slug: ${lead.companySlug}` : null,
    lead.sourcePage ? `Source page: ${lead.sourcePage}` : null,
    "",
    "Review in /admin/leads/ or: npm run db:leads",
  ]);

  return {
    kind: "lead" as const,
    subject: `Lead: ${lead.service} near ${lead.zip} (${lead.timing})`,
    text: lines.join("\n"),
  };
}

export function formatCompanyLeadNotify(lead: {
  id: number | string;
  companyName: string;
  service: string;
  issue: string;
  zip: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  timing: string;
  reason: "direct" | "area" | "retained" | "fallback";
  sourcePage?: string | null;
}) {
  const why =
    lead.reason === "direct" || lead.reason === "retained"
      ? "A homeowner requested a quote from your listing on Michigan Garage Pros."
      : lead.reason === "fallback"
        ? "A nearby homeowner lead is still waiting for a quote — we're sharing it with you as the next available local pro on Michigan Garage Pros."
        : "A homeowner near your service area requested a quote on Michigan Garage Pros.";

  const urgencyNote = isUrgentTiming(lead.timing)
    ? "This homeowner marked the job as urgent — please reach out quickly."
    : lead.reason === "fallback"
      ? "Please reach out promptly — this lead was waiting without a response."
      : "Please reach out promptly — homeowners often request multiple quotes.";

  const lines = keepLines([
    `Hi ${lead.companyName},`,
    "",
    why,
    "",
    `Service: ${lead.service}`,
    `Issue: ${lead.issue}`,
    `ZIP: ${lead.zip}`,
    `Urgency: ${lead.timing}`,
    "",
    "Homeowner contact:",
    `  Name: ${lead.name}`,
    lead.phone ? `  Phone: ${lead.phone}` : null,
    lead.email ? `  Email: ${lead.email}` : null,
    "",
    urgencyNote,
    "",
    "— Michigan Garage Pros",
    "https://michigangaragepros.com",
  ]);

  const contactRows = keepLines([
    `<strong>Name:</strong> ${escapeHtml(lead.name)}`,
    lead.phone ? `<strong>Phone:</strong> ${escapeHtml(lead.phone)}` : null,
    lead.email ? `<strong>Email:</strong> ${escapeHtml(lead.email)}` : null,
  ]);

  const html = [
    `<p>Hi ${escapeHtml(lead.companyName)},</p>`,
    `<p>${escapeHtml(why)}</p>`,
    `<p><strong>Service:</strong> ${escapeHtml(lead.service)}<br/>`,
    `<strong>Issue:</strong> ${escapeHtml(lead.issue)}<br/>`,
    `<strong>ZIP:</strong> ${escapeHtml(lead.zip)}<br/>`,
    `<strong>Urgency:</strong> ${escapeHtml(lead.timing)}</p>`,
    `<p><strong>Homeowner contact:</strong><br/>${contactRows.join("<br/>")}</p>`,
    `<p>${escapeHtml(urgencyNote)}</p>`,
    `<p>— Michigan Garage Pros<br/><a href="https://michigangaragepros.com">https://michigangaragepros.com</a></p>`,
  ].join("\n");

  return {
    kind: "company-lead" as const,
    subject:
      lead.reason === "fallback"
        ? `Open quote lead (fallback): ${lead.service} near ${lead.zip} · ${lead.timing}`
        : `New quote lead: ${lead.service} near ${lead.zip} · ${lead.timing}`,
    text: lines.join("\n"),
    html,
  };
}

/** One-time reminder when a routed lead sits unanswered. */
export function formatCompanyLeadNudge(lead: {
  id: number | string;
  companyName: string;
  service: string;
  issue: string;
  zip: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  timing: string;
}) {
  const lines = keepLines([
    `Hi ${lead.companyName},`,
    "",
    "Friendly reminder: a homeowner quote lead in your inbox on Michigan Garage Pros is still waiting for a response.",
    "",
    `Service: ${lead.service}`,
    `Issue: ${lead.issue}`,
    `ZIP: ${lead.zip}`,
    `Urgency: ${lead.timing}`,
    "",
    "Homeowner contact:",
    `  Name: ${lead.name}`,
    lead.phone ? `  Phone: ${lead.phone}` : null,
    lead.email ? `  Email: ${lead.email}` : null,
    "",
    "Please reach out soon — after a waiting period we may share the lead with another local pro so the homeowner still gets help.",
    "",
    "— Michigan Garage Pros",
    "https://michigangaragepros.com",
  ]);

  const contactRows = keepLines([
    `<strong>Name:</strong> ${escapeHtml(lead.name)}`,
    lead.phone ? `<strong>Phone:</strong> ${escapeHtml(lead.phone)}` : null,
    lead.email ? `<strong>Email:</strong> ${escapeHtml(lead.email)}` : null,
  ]);

  const html = [
    `<p>Hi ${escapeHtml(lead.companyName)},</p>`,
    `<p>Friendly reminder: a homeowner quote lead in your inbox on Michigan Garage Pros is still waiting for a response.</p>`,
    `<p><strong>Service:</strong> ${escapeHtml(lead.service)}<br/>`,
    `<strong>Issue:</strong> ${escapeHtml(lead.issue)}<br/>`,
    `<strong>ZIP:</strong> ${escapeHtml(lead.zip)}<br/>`,
    `<strong>Urgency:</strong> ${escapeHtml(lead.timing)}</p>`,
    `<p><strong>Homeowner contact:</strong><br/>${contactRows.join("<br/>")}</p>`,
    `<p>Please reach out soon — after a waiting period we may share the lead with another local pro so the homeowner still gets help.</p>`,
    `<p>— Michigan Garage Pros<br/><a href="https://michigangaragepros.com">https://michigangaragepros.com</a></p>`,
  ].join("\n");

  return {
    kind: "company-lead-nudge" as const,
    subject: `Reminder: unanswered quote lead near ${lead.zip} · ${lead.timing}`,
    text: lines.join("\n"),
    html,
  };
}
