import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  getCompanyByManageToken,
  isValidManageTokenFormat,
} from "@/lib/listing-manage";
import {
  clientIpFromRequest,
  getCompanyNotifyEmail,
  hashNotifyIp,
  isNotifyEmailChangeRateLimited,
  normalizeNotifyEmail,
  recordNotifyEmailChangeAttempt,
  setCompanyNotifyEmail,
  validateNotifyEmail,
} from "@/lib/notify-email";
import {
  formatNotifyEmailChangedNotify,
  notifyCompany,
} from "@/lib/notify";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

/**
 * Claimed company notification email (companies.notify_email).
 *
 * GET  — current address
 * PUT  — replace address (JSON { email }); applies live; best-effort notice
 *        to the previous address when it changes.
 *
 * Auth: manage token only. Rate-limited per company + IP (migration 0022).
 */
export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const email = await getCompanyNotifyEmail(db, company.slug);
    return NextResponse.json(
      { slug: company.slug, email },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    console.error("manage notify-email GET failed", err);
    return NextResponse.json(
      { error: "Unable to load notification email" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: { email?: unknown };
  try {
    body = (await request.json()) as { email?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawEmail = typeof body.email === "string" ? body.email : "";
  const validationError = validateNotifyEmail(rawEmail);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }
  const nextEmail = normalizeNotifyEmail(rawEmail);

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const current = await getCompanyNotifyEmail(db, company.slug);
    const currentNormalized = current ? normalizeNotifyEmail(current) : null;

    if (currentNormalized === nextEmail) {
      return NextResponse.json({
        slug: company.slug,
        email: currentNormalized,
        message: "No changes to save.",
      });
    }

    const ip = clientIpFromRequest(request);
    const ipHash = await hashNotifyIp(ip);

    let rateLimited = false;
    try {
      rateLimited = await isNotifyEmailChangeRateLimited(
        db,
        company.slug,
        ipHash,
      );
    } catch (err) {
      // Migration may not be applied yet — fail closed on write path so we
      // do not silently skip abuse guards when the table is missing mid-deploy.
      console.error("manage notify-email rate-limit check failed", err);
      return NextResponse.json(
        {
          error:
            "Notification email updates are not available yet. Ask the operator to run migration 0022.",
        },
        { status: 503 },
      );
    }

    if (rateLimited) {
      try {
        await recordNotifyEmailChangeAttempt(db, {
          companySlug: company.slug,
          ipHash,
          previousEmail: currentNormalized,
          newEmail: nextEmail,
          changed: false,
        });
      } catch (err) {
        console.error("manage notify-email rate-limit record failed", err);
      }
      return NextResponse.json(
        {
          error:
            "Too many notification email changes. Try again in about an hour.",
        },
        { status: 429 },
      );
    }

    const saved = await setCompanyNotifyEmail(db, company.slug, nextEmail);
    if (!saved.ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
      await recordNotifyEmailChangeAttempt(db, {
        companySlug: company.slug,
        ipHash,
        previousEmail: currentNormalized,
        newEmail: saved.email,
        changed: true,
      });
    } catch (err) {
      console.error("manage notify-email attempt record failed", err);
    }

    // Best-effort notice to the previous address. notifyCompany degrades to a
    // log no-op when RESEND_API_KEY / send fails — never block the update.
    if (currentNormalized && currentNormalized !== saved.email) {
      await notifyCompany(
        currentNormalized,
        formatNotifyEmailChangedNotify({
          companyName: company.name,
          previousEmail: currentNormalized,
          newEmail: saved.email,
        }),
      );
    }

    return NextResponse.json({
      slug: company.slug,
      email: saved.email,
      message:
        "Notification email updated. New leads will go to this address.",
    });
  } catch (err) {
    console.error("manage notify-email PUT failed", err);
    return NextResponse.json(
      { error: "Unable to save notification email" },
      { status: 500 },
    );
  }
}
