export type LeadNotifyInput = {
  id: number | string;
  service: string;
  issue: string;
  zip: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  timing: string;
  companySlug?: string | null;
  companyName?: string | null;
  companyPhone?: string | null;
  companyAddress?: string | null;
};

export type NotifyResult =
  | { status: "sent"; providerId?: string }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

function buildLeadText(lead: LeadNotifyInput): string {
  const lines = [
    "New Michigan Garage Pros quote request",
    "",
    `Lead ID: ${lead.id}`,
    `Service: ${lead.service}`,
    `Issue: ${lead.issue}`,
    `Timing: ${lead.timing}`,
    `ZIP: ${lead.zip}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone || "—"}`,
    `Email: ${lead.email || "—"}`,
  ];
  if (lead.companySlug || lead.companyName) {
    lines.push(
      "",
      "Requested company:",
      `  ${lead.companyName || lead.companySlug}`,
      `  Phone: ${lead.companyPhone || "—"}`,
      `  Address: ${lead.companyAddress || "—"}`,
      `  Profile: https://michigangaragepros.com/companies/${lead.companySlug}/`,
    );
  }
  lines.push(
    "",
    "Admin inbox: https://michigangaragepros.com/admin/leads/",
    "",
    "Call or email the homeowner, then mark the lead in the admin inbox.",
  );
  return lines.join("\n");
}

export async function sendLeadNotificationEmail(options: {
  apiKey?: string;
  to?: string;
  from?: string;
  lead: LeadNotifyInput;
}): Promise<NotifyResult> {
  const to = options.to?.trim();
  const apiKey = options.apiKey?.trim();
  const from =
    options.from?.trim() ||
    "Michigan Garage Pros <onboarding@resend.dev>";

  if (!apiKey) {
    return {
      status: "skipped",
      reason: "RESEND_API_KEY is not configured",
    };
  }
  if (!to) {
    return {
      status: "skipped",
      reason: "LEAD_NOTIFY_TO is not configured",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New quote lead — ${options.lead.zip} — ${options.lead.service}`,
        text: buildLeadText(options.lead),
      }),
    });

    const data = (await res.json().catch(() => null)) as {
      id?: string;
      message?: string;
      name?: string;
    } | null;

    if (!res.ok) {
      return {
        status: "failed",
        error: data?.message || data?.name || `Resend HTTP ${res.status}`,
      };
    }

    return { status: "sent", providerId: data?.id };
  } catch (err) {
    return {
      status: "failed",
      error: err instanceof Error ? err.message : "Email send failed",
    };
  }
}

export async function sendClaimNotificationEmail(options: {
  apiKey?: string;
  to?: string;
  from?: string;
  id: number | string;
  companyName: string;
  city: string;
}): Promise<NotifyResult> {
  const to = options.to?.trim();
  const apiKey = options.apiKey?.trim();
  const from =
    options.from?.trim() ||
    "Michigan Garage Pros <onboarding@resend.dev>";

  if (!apiKey) {
    return { status: "skipped", reason: "RESEND_API_KEY is not configured" };
  }
  if (!to) {
    return { status: "skipped", reason: "LEAD_NOTIFY_TO is not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Profile claim request — ${options.companyName}`,
        text: [
          "New company profile claim request",
          "",
          `Claim ID: ${options.id}`,
          `Company: ${options.companyName}`,
          `City: ${options.city}`,
          "",
          "Follow up to verify ownership and unlock profile editing.",
        ].join("\n"),
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      return {
        status: "failed",
        error: data?.message || `Resend HTTP ${res.status}`,
      };
    }
    return { status: "sent" };
  } catch (err) {
    return {
      status: "failed",
      error: err instanceof Error ? err.message : "Email send failed",
    };
  }
}
