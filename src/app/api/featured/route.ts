import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  validateFeaturedInterest,
  type FeaturedInterest,
} from "@/lib/featured";
import { formatFeaturedNotify, notifyOperator } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Partial<FeaturedInterest>;
  try {
    body = (await request.json()) as Partial<FeaturedInterest>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const interest: FeaturedInterest = {
    companyName: body.companyName?.trim() ?? "",
    city: body.city?.trim() ?? "",
    plan: body.plan?.trim() ?? "",
    contactName: body.contactName?.trim() ?? "",
    email: body.email?.trim() ?? "",
    phone: body.phone?.trim() ?? "",
    companySlug: body.companySlug?.trim() ?? "",
    notes: body.notes?.trim() ?? "",
  };

  const error = validateFeaturedInterest(interest);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db
      .prepare(
        `INSERT INTO featured_requests (
           company_name, city, plan, contact_name, email, phone, company_slug, notes, status
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      )
      .bind(
        interest.companyName,
        interest.city,
        interest.plan,
        interest.contactName,
        interest.email,
        interest.phone,
        interest.companySlug || null,
        interest.notes || null,
      )
      .run();

    const id = result.meta.last_row_id;
    await notifyOperator(
      formatFeaturedNotify({
        id: id ?? "unknown",
        ...interest,
      }),
    );

    return NextResponse.json({ ok: true, id, status: "new" });
  } catch (err) {
    console.error("featured interest insert failed", err);
    return NextResponse.json(
      { error: "Unable to save Featured interest right now" },
      { status: 500 },
    );
  }
}
