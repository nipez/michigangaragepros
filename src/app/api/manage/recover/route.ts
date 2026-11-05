import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { manageUrl } from "@/lib/listing-manage";
import {
  clientIpFromRequest,
  findManageRecoverMatches,
  hashRecoverEmail,
  hashRecoverIp,
  isRecoverRateLimited,
  manageRecoverSuccessResponse,
  normalizeRecoverEmail,
  recordRecoverAttempt,
  selectRecoverMatch,
  validateManageRecover,
  type ManageRecoverRequest,
} from "@/lib/manage-recover";
import {
  formatManageRecoverNotify,
  notifyCompany,
} from "@/lib/notify";

export const runtime = "nodejs";

/**
 * Self-serve recovery of an existing manage link.
 * Always returns the same success shape (anti-enumeration). Does not rotate tokens.
 */
export async function POST(request: Request) {
  let body: Partial<ManageRecoverRequest>;
  try {
    body = (await request.json()) as Partial<ManageRecoverRequest>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input: ManageRecoverRequest = {
    email: body.email?.trim() ?? "",
    companyName: body.companyName?.trim() ?? "",
    companySlug: body.companySlug?.trim() ?? "",
    website: body.website?.trim() ?? "",
  };

  // Honeypot: bots that fill the hidden field get a silent success.
  if (input.website) {
    return NextResponse.json(manageRecoverSuccessResponse());
  }

  const validationError = validateManageRecover(input);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const normalizedEmail = normalizeRecoverEmail(input.email);
  const ip = clientIpFromRequest(request);
  const [ipHash, emailHash] = await Promise.all([
    hashRecoverIp(ip),
    hashRecoverEmail(normalizedEmail),
  ]);

  try {
    const db = await getDb();

    if (await isRecoverRateLimited(db, ipHash, emailHash)) {
      return NextResponse.json(
        {
          error:
            "Too many recovery requests. Please wait a bit and try again.",
        },
        { status: 429 },
      );
    }

    const candidates = await findManageRecoverMatches(db, normalizedEmail);
    const match = selectRecoverMatch(candidates, {
      companySlug: input.companySlug,
      companyName: input.companyName,
    });

    await recordRecoverAttempt(db, {
      ipHash,
      emailHash,
      matched: Boolean(match),
      companySlug: match?.slug ?? null,
    });

    if (match) {
      // Best-effort Resend; never throws. Same public response either way.
      await notifyCompany(
        normalizedEmail,
        formatManageRecoverNotify({
          companyName: match.companyName,
          manageUrl: manageUrl(match.manageToken),
        }),
      );
    } else {
      console.log("manage-recover: no match", {
        emailHash,
        companySlug: input.companySlug || undefined,
      });
    }

    return NextResponse.json(manageRecoverSuccessResponse());
  } catch (err) {
    console.error("manage-recover failed", err);
    // Still return generic success so DB blips cannot be used to probe.
    return NextResponse.json(manageRecoverSuccessResponse());
  }
}
