import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  getCompanyByManageToken,
  isValidManageTokenFormat,
  manageUrl,
} from "@/lib/listing-manage";
import {
  getWeeklyDigestOptOut,
  setWeeklyDigestOptOut,
} from "@/lib/weekly-digest";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

function htmlPage(title: string, body: string): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${title}</title>
  <style>
    body{font-family:system-ui,-apple-system,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1.25rem;color:#0f172a;line-height:1.5}
    a{color:#1d4ed8}
    .card{border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem 1.35rem;background:#f8fafc}
    h1{font-size:1.25rem;margin:0 0 .75rem}
    p{margin:.5rem 0}
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    ${body}
  </div>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}

/**
 * Weekly digest preference for a claimed company.
 *
 * GET  — JSON { optedOut } or HTML unsubscribe/subscribe via ?action=
 * PUT  — JSON { optedOut: boolean } applies live
 *
 * Auth: manage token only (same as other /api/manage/<token>/ routes).
 */
export async function GET(request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const action = new URL(request.url).searchParams.get("action")?.trim() ?? "";

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (action === "unsubscribe" || action === "subscribe") {
      const optOut = action === "unsubscribe";
      let saved = false;
      try {
        saved = await setWeeklyDigestOptOut(db, company.slug, optOut);
      } catch (err) {
        console.error("manage digest opt-out write failed", err);
        return htmlPage(
          "Not available yet",
          `<p>Weekly digest preferences are not available yet. Ask the operator to run migration <code>0023_weekly_digest.sql</code>.</p>
           <p><a href="${manageUrl(token)}">Back to manage page</a></p>`,
        );
      }
      if (!saved) {
        return htmlPage(
          "Unable to update",
          `<p>We could not update digest preferences for this listing.</p>
           <p><a href="${manageUrl(token)}">Back to manage page</a></p>`,
        );
      }

      if (optOut) {
        return htmlPage(
          "Unsubscribed",
          `<p>You will no longer receive weekly performance emails for <strong>${escapeHtml(company.name)}</strong>.</p>
           <p>You can turn them back on anytime from your <a href="${manageUrl(token)}">manage page</a>, or <a href="/api/manage/${token}/digest/?action=subscribe">resubscribe here</a>.</p>`,
        );
      }
      return htmlPage(
        "Subscribed",
        `<p>Weekly performance emails are on again for <strong>${escapeHtml(company.name)}</strong>.</p>
         <p><a href="${manageUrl(token)}">Back to manage page</a></p>`,
      );
    }

    let optedOut = false;
    try {
      optedOut = await getWeeklyDigestOptOut(db, company.slug);
    } catch (err) {
      console.error("manage digest GET failed", err);
      return NextResponse.json(
        {
          error:
            "Weekly digest preferences are not available yet. Ask the operator to run migration 0023.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { slug: company.slug, optedOut },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    console.error("manage digest GET failed", err);
    return NextResponse.json(
      { error: "Unable to load digest preference" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: { optedOut?: unknown };
  try {
    body = (await request.json()) as { optedOut?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.optedOut !== "boolean") {
    return NextResponse.json(
      { error: "optedOut must be a boolean" },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let saved = false;
    try {
      saved = await setWeeklyDigestOptOut(db, company.slug, body.optedOut);
    } catch (err) {
      console.error("manage digest PUT migration missing?", err);
      return NextResponse.json(
        {
          error:
            "Weekly digest preferences are not available yet. Ask the operator to run migration 0023.",
        },
        { status: 503 },
      );
    }

    if (!saved) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      slug: company.slug,
      optedOut: body.optedOut,
      message: body.optedOut
        ? "Weekly performance emails turned off."
        : "Weekly performance emails turned on.",
    });
  } catch (err) {
    console.error("manage digest PUT failed", err);
    return NextResponse.json(
      { error: "Unable to save digest preference" },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
