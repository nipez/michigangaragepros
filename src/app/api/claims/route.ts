import { NextResponse } from "next/server";
import { getDb, getEnv } from "@/lib/db";
import { sendClaimNotificationEmail } from "@/lib/notify";

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
    const env = await getEnv();
    const db = await getDb();
    const result = await db
      .prepare(
        `INSERT INTO claim_requests (company_name, city) VALUES (?, ?)`,
      )
      .bind(companyName, city)
      .run();

    const id = result.meta.last_row_id;
    const notify = await sendClaimNotificationEmail({
      apiKey: env.RESEND_API_KEY,
      to: env.LEAD_NOTIFY_TO,
      from: env.LEAD_NOTIFY_FROM,
      id: id ?? "unknown",
      companyName,
      city,
    });
    if (notify.status === "failed") {
      console.error("claim notify failed", notify.error);
    }

    return NextResponse.json({
      ok: true,
      id,
      notified: notify.status === "sent",
    });
  } catch (err) {
    console.error("claim insert failed", err);
    return NextResponse.json(
      { error: "Unable to save claim request right now" },
      { status: 500 },
    );
  }
}
