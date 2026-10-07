import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb, getEnv } from "@/lib/db";
import {
  manageUrl,
  regenerateManageToken,
  revokeManageToken,
} from "@/lib/listing-manage";

export const runtime = "nodejs";

/**
 * Regenerate or revoke a claimed company's manage link.
 * Body: { slug, action: "regenerate" | "revoke" }
 */
export async function POST(request: Request) {
  const env = await getEnv();
  if (!(await requireAdmin(env))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { slug?: string; action?: string };
  try {
    body = (await request.json()) as { slug?: string; action?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = body.slug?.trim() ?? "";
  const action = body.action?.trim();
  if (!slug || (action !== "regenerate" && action !== "revoke")) {
    return NextResponse.json(
      { error: "slug and action (regenerate|revoke) are required" },
      { status: 400 },
    );
  }

  const db = await getDb();

  if (action === "revoke") {
    const ok = await revokeManageToken(db, slug);
    if (!ok) {
      return NextResponse.json(
        { error: "Company not found or token already revoked" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, slug, manage_token: null, manage_url: null });
  }

  const token = await regenerateManageToken(db, slug);
  if (!token) {
    return NextResponse.json(
      { error: "Company not found or not claimed — approve a claim first" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    slug,
    manage_token: token,
    manage_url: manageUrl(token),
  });
}
