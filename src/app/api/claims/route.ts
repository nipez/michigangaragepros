import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { validateClaim, type ClaimRequest } from "@/lib/claim";

export const runtime = "nodejs";

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

  try {
    const db = await getDb();
    const result = await db
      .prepare(
        `INSERT INTO claim_requests (
           company_name, city, contact_name, email, phone, website, company_slug, notes
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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

    return NextResponse.json({
      ok: true,
      id: result.meta.last_row_id,
    });
  } catch (err) {
    console.error("claim insert failed", err);
    return NextResponse.json(
      { error: "Unable to save claim request right now" },
      { status: 500 },
    );
  }
}
