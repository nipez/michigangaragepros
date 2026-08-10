import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { validateClaim, type ClaimRequest } from "@/lib/claim";
import { assertClaimAllowed, getCompanyClaimStatus } from "@/lib/claimStatus";
import { formatClaimNotify, notifyOperator } from "@/lib/notify";

export const runtime = "nodejs";

/** Lightweight claim-state lookup for company profile badges/CTAs. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = (searchParams.get("slug") ?? "").trim();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const status = await getCompanyClaimStatus(slug);
  return NextResponse.json(
    { slug, status },
    {
      headers: {
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    },
  );
}

export async function POST(request: Request) {
  let body: Partial<ClaimRequest>;
  try {
    body = (await request.json()) as Partial<ClaimRequest>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const claim: ClaimRequest = {
    companyName: body.companyName?.trim() ?? "",
    city: body.city?.trim() ?? "",
    contactName: body.contactName?.trim() ?? "",
    email: body.email?.trim() ?? "",
    phone: body.phone?.trim() ?? "",
    website: body.website?.trim() ?? "",
    companySlug: body.companySlug?.trim() ?? "",
    notes: body.notes?.trim() ?? "",
  };

  const error = validateClaim(claim);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (claim.companySlug) {
    const blocked = await assertClaimAllowed(claim.companySlug);
    if (blocked) {
      return NextResponse.json({ error: blocked }, { status: 409 });
    }
  }

  try {
    const db = await getDb();
    const result = await db
      .prepare(
        `INSERT INTO claim_requests (
           company_name, city, contact_name, email, phone, website, company_slug, notes, status
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      )
      .bind(
        claim.companyName,
        claim.city,
        claim.contactName,
        claim.email,
        claim.phone,
        claim.website || null,
        claim.companySlug || null,
        claim.notes || null,
      )
      .run();

    const id = result.meta.last_row_id;
    await notifyOperator(
      formatClaimNotify({
        id: id ?? "unknown",
        companyName: claim.companyName,
        city: claim.city,
        contactName: claim.contactName,
        email: claim.email,
        phone: claim.phone,
        website: claim.website,
        companySlug: claim.companySlug,
        notes: claim.notes,
      }),
    );

    return NextResponse.json({
      ok: true,
      id,
      status: "pending",
    });
  } catch (err) {
    console.error("claim insert failed", err);
    return NextResponse.json(
      { error: "Unable to save claim request right now" },
      { status: 500 },
    );
  }
}
