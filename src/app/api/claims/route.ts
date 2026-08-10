import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { companyName?: string; city?: string };
  try {
    body = (await request.json()) as { companyName?: string; city?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const companyName = body.companyName?.trim() ?? "";
  const city = body.city?.trim() ?? "";
  if (!companyName || !city) {
    return NextResponse.json(
      { error: "Company name and city are required" },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const result = await db
      .prepare(
        `INSERT INTO claim_requests (company_name, city) VALUES (?, ?)`,
      )
      .bind(companyName, city)
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
