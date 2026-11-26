import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  getCompanyLeadPreferences,
  LEAD_PREF_SERVICE_OPTIONS,
  normalizeLeadPreferencesInput,
  setCompanyLeadPreferences,
  validateLeadPreferences,
  type CompanyLeadPreferences,
} from "@/lib/lead-preferences";
import {
  getCompanyByManageToken,
  isValidManageTokenFormat,
} from "@/lib/listing-manage";
import { CITIES, getCitiesByRegion } from "@/data/cities";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

/**
 * Lead preferences for a claimed company (cities, services, pause).
 *
 * GET  — current preferences + option lists for the manage form
 * PUT  — replace preferences (JSON body); applies live to routing
 *
 * Auth: manage token only. Migration 0032 required.
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

    let preferences;
    try {
      preferences = await getCompanyLeadPreferences(db, company.slug);
    } catch (err) {
      console.error("manage lead-preferences GET migration missing?", err);
      return NextResponse.json(
        {
          error:
            "Lead preferences are not available yet. Ask the operator to run migration 0032.",
        },
        { status: 503 },
      );
    }

    if (!preferences) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        slug: company.slug,
        preferences,
        options: {
          services: LEAD_PREF_SERVICE_OPTIONS,
          cities: CITIES.map((c) => ({
            slug: c.slug,
            name: c.name,
            region: c.region ?? "Michigan",
          })),
          citiesByRegion: Object.fromEntries(
            Object.entries(getCitiesByRegion()).map(([region, cities]) => [
              region,
              cities.map((c) => ({ slug: c.slug, name: c.name })),
            ]),
          ),
        },
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    console.error("manage lead-preferences GET failed", err);
    return NextResponse.json(
      { error: "Unable to load lead preferences" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: {
    paused?: unknown;
    resumeAt?: unknown;
    citySlugs?: unknown;
    services?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input: Partial<CompanyLeadPreferences> = {
    paused: Boolean(body.paused),
    resumeAt:
      typeof body.resumeAt === "string"
        ? body.resumeAt
        : body.resumeAt === null
          ? null
          : undefined,
    citySlugs: Array.isArray(body.citySlugs)
      ? body.citySlugs.filter((s): s is string => typeof s === "string")
      : [],
    services: Array.isArray(body.services)
      ? body.services.filter((s): s is string => typeof s === "string")
      : [],
  };

  const normalized = normalizeLeadPreferencesInput(input);
  const validationError = validateLeadPreferences(normalized);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let saved: CompanyLeadPreferences | null = null;
    try {
      saved = await setCompanyLeadPreferences(db, company.slug, normalized);
    } catch (err) {
      console.error("manage lead-preferences PUT migration missing?", err);
      return NextResponse.json(
        {
          error:
            "Lead preferences are not available yet. Ask the operator to run migration 0032.",
        },
        { status: 503 },
      );
    }

    if (!saved) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const message = saved.paused
      ? saved.resumeAt
        ? `New leads paused until ${saved.resumeAt}.`
        : "New leads paused. Turn pause off when you are ready again."
      : saved.citySlugs.length > 0 || saved.services.length > 0
        ? "Lead preferences saved. Matching leads will follow these filters."
        : "Lead preferences cleared. You will receive matching leads as before.";

    return NextResponse.json({
      slug: company.slug,
      preferences: saved,
      message,
    });
  } catch (err) {
    console.error("manage lead-preferences PUT failed", err);
    return NextResponse.json(
      { error: "Unable to save lead preferences" },
      { status: 500 },
    );
  }
}
