import { NextResponse } from "next/server";
import {
  emptyCompanyTrust,
  getCompanyTrust,
  normalizeTrustInput,
  setCompanyTrust,
  trustEqual,
  type CompanyTrustInput,
} from "@/lib/company-trust";
import { getDb } from "@/lib/db";
import {
  getCompanyByManageToken,
  isValidManageTokenFormat,
} from "@/lib/listing-manage";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

/**
 * Claimed company self-reported trust credentials.
 *
 * GET  — current credentials
 * PUT  — replace credentials (JSON body); applies live (no listing_edit_requests)
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

    let trust = emptyCompanyTrust();
    try {
      trust = await getCompanyTrust(db, company.slug);
    } catch (err) {
      // Migration may not be applied yet — return empty rather than 500.
      console.error("manage trust GET query failed", err);
      trust = emptyCompanyTrust();
    }

    return NextResponse.json(
      { slug: company.slug, trust },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    console.error("manage trust GET failed", err);
    return NextResponse.json(
      { error: "Unable to load trust credentials" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: CompanyTrustInput;
  try {
    body = (await request.json()) as CompanyTrustInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let current = emptyCompanyTrust();
    try {
      current = await getCompanyTrust(db, company.slug);
    } catch (err) {
      console.error("manage trust PUT load failed", err);
      return NextResponse.json(
        {
          error:
            "Trust credentials are not available yet. Ask the operator to run migration 0021.",
        },
        { status: 503 },
      );
    }

    const normalized = normalizeTrustInput(body, current);
    if (!normalized.ok) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }

    if (trustEqual(normalized.trust, current)) {
      return NextResponse.json({
        slug: company.slug,
        trust: current,
        message: "No changes to save.",
      });
    }

    const saved = await setCompanyTrust(db, company.slug, normalized.trust);
    if (!saved.ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      slug: company.slug,
      trust: saved.trust,
      message: "Trust credentials updated. Changes are live.",
    });
  } catch (err) {
    console.error("manage trust PUT failed", err);
    return NextResponse.json(
      { error: "Unable to save trust credentials" },
      { status: 500 },
    );
  }
}
