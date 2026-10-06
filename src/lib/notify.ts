import { getCloudflareContext } from "@opennextjs/cloudflare";

export type NotifyPayload = {
  kind: "claim" | "lead" | "featured" | "company-lead" | "review";
  subject: string;
  text: string;
  html?: string;
};

type NotifyEnv = {
  RESEND_API_KEY?: string;
  NOTIFY_EMAIL?: string;
  NOTIFY_WEBHOOK_URL?: string;
  NOTIFY_FROM_EMAIL?: string;
};

async function getNotifyEnv(): Promise<NotifyEnv> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env as unknown as NotifyEnv;
  } catch {
    return {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      NOTIFY_EMAIL: process.env.NOTIFY_EMAIL,
      NOTIFY_WEBHOOK_URL: process.env.NOTIFY_WEBHOOK_URL,
      NOTIFY_FROM_EMAIL: process.env.NOTIFY_FROM_EMAIL,
    };
  }
}

async function sendResendEmail(
  env: NotifyEnv,
  to: string,
  payload: NotifyPayload,
): Promise<boolean> {
  const from =
    env.NOTIFY_FROM_EMAIL?.trim() ||
    "Michigan Garage Pros <onboarding@resend.dev>";

  if (!env.RESEND_API_KEY) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: payload.subject,
        text: payload.text,
        html: payload.html ?? `<pre>${escapeHtml(payload.text)}</pre>`,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("Resend notify failed", res.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend notify error", err);
    return false;
  }
}

/**
 * Best-effort operator alert for new claims/leads.
 * Prefer Resend email; fall back to webhook. Never throws to callers.
 */
export async function notifyOperator(payload: NotifyPayload): Promise<void> {
  try {
    const env = await getNotifyEnv();
    const to = env.NOTIFY_EMAIL?.trim() || "nickperez@gmail.com";

    let emailed = false;
    if (env.RESEND_API_KEY) {
      emailed = await sendResendEmail(env, to, payload);
    }

    if (env.NOTIFY_WEBHOOK_URL) {
      try {
        const res = await fetch(env.NOTIFY_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: payload.kind,
            subject: payload.subject,
            text: payload.text,
            emailed,
            to,
          }),
        });
        if (!res.ok) {
          console.error("Webhook notify failed", res.status, await res.text());
        }
      } catch (err) {
        console.error("Webhook notify error", err);
      }
    }

    if (!env.RESEND_API_KEY && !env.NOTIFY_WEBHOOK_URL) {
      console.warn(
        "notifyOperator: no RESEND_API_KEY or NOTIFY_WEBHOOK_URL configured",
        payload.subject,
      );
    }

    // Always leave a trail in logs for Workers observability.
    console.log("notifyOperator", {
      kind: payload.kind,
      subject: payload.subject,
      emailed,
      hasWebhook: Boolean(env.NOTIFY_WEBHOOK_URL),
    });
  } catch (err) {
    console.error("notifyOperator unexpected error", err);
  }
}

/**
 * Best-effort company alert for a routed homeowner lead.
 * Returns whether Resend accepted the send. Never throws.
 */
export async function notifyCompany(
  to: string,
  payload: NotifyPayload,
): Promise<boolean> {
  try {
    const email = to.trim();
    if (!email) return false;

    const env = await getNotifyEnv();
    if (!env.RESEND_API_KEY) {
      console.warn(
        "notifyCompany: no RESEND_API_KEY configured",
        payload.subject,
        email,
      );
      console.log("notifyCompany", {
        kind: payload.kind,
        subject: payload.subject,
        to: email,
        emailed: false,
      });
      return false;
    }

    const emailed = await sendResendEmail(env, email, payload);
    console.log("notifyCompany", {
      kind: payload.kind,
      subject: payload.subject,
      to: email,
      emailed,
    });
    return emailed;
  } catch (err) {
    console.error("notifyCompany unexpected error", err);
    return false;
  }
}

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

export function formatClaimNotify(claim: {
  id: number | string;
  companyName: string;
  city: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  companySlug?: string;
  notes?: string;
}) {
  const lines = keepLines([
    "New company page claim request",
    "",
    `ID: ${claim.id}`,
    `Company: ${claim.companyName}`,
    `City: ${claim.city}`,
    `Contact: ${claim.contactName}`,
    `Email: ${claim.email}`,
    `Phone: ${claim.phone}`,
    claim.website ? `Website: ${claim.website}` : null,
    claim.companySlug ? `Listing slug: ${claim.companySlug}` : null,
    claim.notes ? `Notes: ${claim.notes}` : null,
    "",
    "Review with: npm run db:claims",
    claim.companySlug
      ? `Approve with: npm run db:approve-claim -- --slug=${claim.companySlug}`
      : null,
  ]);

  return {
    kind: "claim" as const,
    subject: `Claim request: ${claim.companyName} (${claim.city})`,
    text: lines.join("\n"),
  };
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
    `Timing: ${lead.timing}`,
    lead.companySlug ? `Company slug: ${lead.companySlug}` : null,
    "",
    "Review in /admin/leads/ or: npm run db:leads",
  ]);

  return {
    kind: "lead" as const,
    subject: `Lead: ${lead.service} near ${lead.zip}`,
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
  reason: "direct" | "area";
}) {
  const why =
    lead.reason === "direct"
      ? "A homeowner requested a quote from your listing on Michigan Garage Pros."
      : "A homeowner near your service area requested a quote on Michigan Garage Pros.";

  const lines = keepLines([
    `Hi ${lead.companyName},`,
    "",
    why,
    "",
    `Service: ${lead.service}`,
    `Issue: ${lead.issue}`,
    `ZIP: ${lead.zip}`,
    `Timing: ${lead.timing}`,
    "",
    "Homeowner contact:",
    `  Name: ${lead.name}`,
    lead.phone ? `  Phone: ${lead.phone}` : null,
    lead.email ? `  Email: ${lead.email}` : null,
    "",
    "Please reach out promptly — homeowners often request multiple quotes.",
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
    `<strong>Timing:</strong> ${escapeHtml(lead.timing)}</p>`,
    `<p><strong>Homeowner contact:</strong><br/>${contactRows.join("<br/>")}</p>`,
    `<p>Please reach out promptly — homeowners often request multiple quotes.</p>`,
    `<p>— Michigan Garage Pros<br/><a href="https://michigangaragepros.com">https://michigangaragepros.com</a></p>`,
  ].join("\n");

  return {
    kind: "company-lead" as const,
    subject: `New quote lead: ${lead.service} near ${lead.zip}`,
    text: lines.join("\n"),
    html,
  };
}

export function formatFeaturedNotify(interest: {
  id: number | string;
  companyName: string;
  city: string;
  plan: string;
  contactName: string;
  email: string;
  phone: string;
  companySlug?: string;
  notes?: string;
}) {
  const lines = keepLines([
    "New Featured placement interest",
    "",
    `ID: ${interest.id}`,
    `Company: ${interest.companyName}`,
    `City / market: ${interest.city}`,
    `Plan: ${interest.plan}`,
    `Contact: ${interest.contactName}`,
    `Email: ${interest.email}`,
    `Phone: ${interest.phone}`,
    interest.companySlug ? `Listing slug: ${interest.companySlug}` : null,
    interest.notes ? `Notes: ${interest.notes}` : null,
    "",
    "Review with: npm run db:featured",
  ]);

  return {
    kind: "featured" as const,
    subject: `Featured interest: ${interest.companyName} (${interest.plan})`,
    text: lines.join("\n"),
  };
}

export function formatReviewNotify(review: {
  id: number | string;
  companyName: string;
  companySlug: string;
  authorName: string;
  rating: number;
  body: string;
}) {
  const preview =
    review.body.length > 200
      ? `${review.body.slice(0, 197)}…`
      : review.body;

  const lines = keepLines([
    "New company review awaiting moderation",
    "",
    `ID: ${review.id}`,
    `Company: ${review.companyName}`,
    `Listing slug: ${review.companySlug}`,
    `Reviewer: ${review.authorName}`,
    `Rating: ${review.rating}/5`,
    `Review: ${preview}`,
    "",
    "Moderate in /admin/reviews/ or: npm run db:reviews",
  ]);

  return {
    kind: "review" as const,
    subject: `Review pending: ${review.companyName} (${review.rating}/5)`,
    text: lines.join("\n"),
  };
}
