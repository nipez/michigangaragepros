import type { Metadata } from "next";
import { HomeownerCheckinClient } from "@/components/HomeownerCheckinClient";
import { getDb, getEnv } from "@/lib/db";
import {
  listRoutedCompaniesForCheckin,
  loadLeadForCheckin,
  recordCheckinNotYet,
  recordCheckinOptOut,
  recordCheckinYes,
} from "@/lib/homeowner-checkin";
import {
  resolveCheckinSigningSecret,
  verifyCheckinToken,
} from "@/lib/homeowner-checkin-sign";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ t?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Quote check-in",
    description: "Confirm whether a garage door pro got in touch.",
    path: "/check-in/",
    noIndex: true,
  });
}

function StaticMessage({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <HomeownerCheckinClient
      initial={{ kind: "done", title, body, reviewUrl: null }}
    />
  );
}

export default async function HomeownerCheckinPage({
  searchParams,
}: PageProps) {
  const query = await searchParams;
  const token = (query.t ?? "").trim();

  if (!token) {
    return (
      <StaticMessage
        title="Link required"
        body="Open the Yes / Not yet link from your check-in email to continue."
      />
    );
  }

  let env;
  try {
    env = await getEnv();
  } catch {
    return (
      <StaticMessage
        title="Temporarily unavailable"
        body="Please try again in a few minutes."
      />
    );
  }

  const secret = resolveCheckinSigningSecret(env);
  if (!secret) {
    return (
      <StaticMessage
        title="Temporarily unavailable"
        body="Check-in links are not configured right now."
      />
    );
  }

  const verified = await verifyCheckinToken(secret, token);
  if (!verified.ok) {
    return (
      <StaticMessage
        title="Invalid or expired link"
        body={verified.error}
      />
    );
  }

  const { leadId, action } = verified.payload;

  let db;
  try {
    db = await getDb();
  } catch {
    return (
      <StaticMessage
        title="Temporarily unavailable"
        body="Please try again in a few minutes."
      />
    );
  }

  const lead = await loadLeadForCheckin(db, leadId);
  if (!lead) {
    return (
      <StaticMessage
        title="Link not found"
        body="We could not find this quote request."
      />
    );
  }

  if (action === "unsub") {
    try {
      const result = await recordCheckinOptOut(db, leadId);
      return (
        <StaticMessage
          title={result.already ? "Already unsubscribed" : "Unsubscribed"}
          body="You will not receive further follow-up emails about this quote request."
        />
      );
    } catch (err) {
      console.error("check-in opt-out failed", err);
      return (
        <StaticMessage
          title="Unable to unsubscribe"
          body="Please try again in a few minutes."
        />
      );
    }
  }

  if (action === "not_yet") {
    try {
      const result = await recordCheckinNotYet(
        {
          DB: db,
          RESEND_API_KEY: env.RESEND_API_KEY,
          NOTIFY_FROM_EMAIL: env.NOTIFY_FROM_EMAIL,
          ADMIN_TOKEN: env.ADMIN_TOKEN,
          CHECKIN_SIGNING_SECRET: env.CHECKIN_SIGNING_SECRET,
        },
        leadId,
      );
      if (!result.ok) {
        return (
          <StaticMessage
            title="Already recorded"
            body={result.error || "You already responded to this check-in."}
          />
        );
      }
      if (result.routedSlug) {
        return (
          <StaticMessage
            title="We're on it"
            body="Thanks for letting us know. We just notified another local claimed pro about your request. They should reach out soon."
          />
        );
      }
      if (result.flaggedAdmin) {
        return (
          <StaticMessage
            title="We're on it"
            body="Thanks for letting us know. Our team has been flagged to help match you with a local pro."
          />
        );
      }
      return (
        <StaticMessage
          title="Thanks — noted"
          body="We recorded that you haven't heard from a pro yet. Our team will follow up."
        />
      );
    } catch (err) {
      console.error("check-in not_yet failed", err);
      return (
        <StaticMessage
          title="Unable to save"
          body="Please try again in a few minutes."
        />
      );
    }
  }

  // action === "yes"
  try {
    const existing = (lead.checkin_response ?? "").trim().toLowerCase();
    if (existing === "not_yet") {
      return (
        <StaticMessage
          title="Already recorded"
          body="You already told us a pro hadn't reached out. We've been working on a follow-up."
        />
      );
    }

    const companies = await listRoutedCompaniesForCheckin(db, leadId);

    if (companies.length === 0) {
      const result = await recordCheckinYes(db, leadId, null);
      return (
        <StaticMessage
          title={result.alreadyResponded ? "Already recorded" : "Glad you're set"}
          body="Thanks for confirming. We're glad a pro got in touch."
        />
      );
    }

    if (companies.length === 1) {
      const only = companies[0]!;
      const result = await recordCheckinYes(db, leadId, only.companySlug);
      if (!result.ok) {
        return (
          <StaticMessage
            title="Unable to save"
            body={result.error || "Something went wrong."}
          />
        );
      }
      return (
        <HomeownerCheckinClient
          initial={{
            kind: "done",
            title: result.alreadyResponded
              ? "Already recorded"
              : "Glad you're set",
            body: result.companyName
              ? `Thanks — we noted that ${result.companyName} helped you.`
              : "Thanks — we noted that a pro helped you.",
            reviewUrl: result.reviewUrl,
            companyName: result.companyName,
          }}
        />
      );
    }

    // Multiple companies — let the homeowner pick.
    if (
      existing === "yes" &&
      (lead.checkin_helped_company_slug ?? "").trim()
    ) {
      const result = await recordCheckinYes(
        db,
        leadId,
        lead.checkin_helped_company_slug,
      );
      return (
        <HomeownerCheckinClient
          initial={{
            kind: "done",
            title: "Already recorded",
            body: result.companyName
              ? `Thanks — we already noted that ${result.companyName} helped you.`
              : "Thanks — we already recorded your response.",
            reviewUrl: result.reviewUrl,
            companyName: result.companyName,
          }}
        />
      );
    }

    return (
      <HomeownerCheckinClient
        initial={{
          kind: "yes-pick",
          token,
          companies: companies.map((c) => ({
            companySlug: c.companySlug,
            companyName: c.companyName,
          })),
        }}
      />
    );
  } catch (err) {
    console.error("check-in yes failed", err);
    return (
      <StaticMessage
        title="Unable to save"
        body="Please try again in a few minutes."
      />
    );
  }
}
