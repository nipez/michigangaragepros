import { getCloudflareContext } from "@opennextjs/cloudflare";

export type NotifyPayload = {
  kind: "claim" | "lead";
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

/**
 * Best-effort operator alert for new claims/leads.
 * Prefer Resend email; fall back to webhook. Never throws to callers.
 */
export async function notifyOperator(payload: NotifyPayload): Promise<void> {
  const env = await getNotifyEnv();
  const to = env.NOTIFY_EMAIL?.trim() || "nickperez@gmail.com";
  const from =
    env.NOTIFY_FROM_EMAIL?.trim() || "Michigan Garage Pros <onboarding@resend.dev>";

  let emailed = false;
  if (env.RESEND_API_KEY) {
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
      } else {
        emailed = true;
      }
    } catch (err) {
      console.error("Resend notify error", err);
    }
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
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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
  const lines = [
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
  ].filter(Boolean);

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
  const lines = [
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
    "Review with: npm run db:leads",
  ].filter(Boolean);

  return {
    kind: "lead" as const,
    subject: `Lead: ${lead.service} near ${lead.zip}`,
    text: lines.join("\n"),
  };
}
