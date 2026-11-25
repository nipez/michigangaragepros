import { NextResponse } from "next/server";
import { getDb, getEnv } from "@/lib/db";
import { recordCheckinYes } from "@/lib/homeowner-checkin";
import {
  resolveCheckinSigningSecret,
  verifyCheckinToken,
} from "@/lib/homeowner-checkin-sign";

export const runtime = "nodejs";

/**
 * POST /api/check-in/
 * Body: { token, companySlug }
 * Completes a "Yes, I'm set" response when multiple companies were routed.
 */
export async function POST(request: Request) {
  let body: { token?: unknown; companySlug?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const companySlug =
    typeof body.companySlug === "string" ? body.companySlug.trim() : "";

  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }
  if (!companySlug) {
    return NextResponse.json(
      { error: "companySlug is required" },
      { status: 400 },
    );
  }

  const env = await getEnv();
  const secret = resolveCheckinSigningSecret(env);
  if (!secret) {
    return NextResponse.json(
      { error: "Check-in is not configured" },
      { status: 503 },
    );
  }

  const verified = await verifyCheckinToken(secret, token, {
    expectedAction: "yes",
  });
  if (!verified.ok) {
    return NextResponse.json({ error: verified.error }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await recordCheckinYes(
      db,
      verified.payload.leadId,
      companySlug,
    );
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || "Unable to save" },
        { status: result.alreadyResponded ? 409 : 400 },
      );
    }
    return NextResponse.json({
      ok: true,
      alreadyResponded: result.alreadyResponded,
      reviewUrl: result.reviewUrl,
      companyName: result.companyName,
    });
  } catch (err) {
    console.error("api check-in POST failed", err);
    return NextResponse.json(
      { error: "Unable to save right now" },
      { status: 500 },
    );
  }
}
