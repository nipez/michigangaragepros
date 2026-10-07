import { NextResponse } from "next/server";
import { getCompanyBySlug } from "@/data/companies";
import { getDb } from "@/lib/db";
import {
  getCompanyByManageToken,
  listingFieldsEqual,
  normalizeListingFields,
  validateListingFields,
  type ListingFields,
} from "@/lib/listing-manage";
import { formatListingEditNotify, notifyOperator } from "@/lib/notify";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Prefer D1 row; fill empty services/areas from static seed if D1 child
    // tables were never populated for this listing.
    const seed = getCompanyBySlug(company.slug);
    let fields = company.fields;
    if (seed) {
      if (fields.services.length === 0 && seed.services.length) {
        fields = { ...fields, services: [...seed.services] };
      }
      if (fields.serviceArea.length === 0 && seed.serviceArea.length) {
        fields = { ...fields, serviceArea: [...seed.serviceArea] };
      }
      if (!fields.about && seed.about) {
        fields = { ...fields, about: seed.about };
      }
      if (!fields.hours && seed.hours) {
        fields = { ...fields, hours: seed.hours };
      }
      if (!fields.phone && seed.phone) {
        fields = { ...fields, phone: seed.phone };
      }
      if (!fields.website && seed.website) {
        fields = { ...fields, website: seed.website };
      }
      if (!fields.address && seed.address) {
        fields = { ...fields, address: seed.address };
      }
      if (!fields.phoneAlt && seed.phoneAlt) {
        fields = { ...fields, phoneAlt: seed.phoneAlt };
      }
      if (!fields.emergencyHours && seed.emergencyHours) {
        fields = { ...fields, emergencyHours: seed.emergencyHours };
      }
    }

    const pending = await db
      .prepare(
        `SELECT id, created_at FROM listing_edit_requests
         WHERE company_slug = ? AND status = 'pending'
         ORDER BY datetime(created_at) DESC LIMIT 1`,
      )
      .bind(company.slug)
      .first<{ id: number; created_at: string }>();

    return NextResponse.json(
      {
        slug: company.slug,
        name: company.name,
        fields,
        pendingEdit: pending
          ? { id: pending.id, createdAt: pending.created_at }
          : null,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (err) {
    console.error("manage GET failed", err);
    return NextResponse.json({ error: "Unable to load listing" }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;

  let body: Partial<ListingFields>;
  try {
    body = (await request.json()) as Partial<ListingFields>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const seed = getCompanyBySlug(company.slug);
    let current = company.fields;
    if (seed) {
      // Same seed fill as GET so "current" snapshot matches what the form showed.
      if (current.services.length === 0 && seed.services.length) {
        current = { ...current, services: [...seed.services] };
      }
      if (current.serviceArea.length === 0 && seed.serviceArea.length) {
        current = { ...current, serviceArea: [...seed.serviceArea] };
      }
      if (!current.about && seed.about) current = { ...current, about: seed.about };
      if (!current.hours && seed.hours) current = { ...current, hours: seed.hours };
      if (!current.phone && seed.phone) current = { ...current, phone: seed.phone };
      if (!current.website && seed.website) {
        current = { ...current, website: seed.website };
      }
      if (!current.address && seed.address) {
        current = { ...current, address: seed.address };
      }
      if (!current.phoneAlt && seed.phoneAlt) {
        current = { ...current, phoneAlt: seed.phoneAlt };
      }
      if (!current.emergencyHours && seed.emergencyHours) {
        current = { ...current, emergencyHours: seed.emergencyHours };
      }
    }

    const proposed = normalizeListingFields(body);
    const error = validateListingFields(proposed);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    if (listingFieldsEqual(proposed, current)) {
      return NextResponse.json(
        { error: "No changes detected — update a field before submitting." },
        { status: 400 },
      );
    }

    // Replace any existing pending edit for this company (one open proposal).
    await db
      .prepare(
        `UPDATE listing_edit_requests
         SET status = 'rejected',
             reviewed_at = datetime('now'),
             review_notes = 'Superseded by a newer submission'
         WHERE company_slug = ? AND status = 'pending'`,
      )
      .bind(company.slug)
      .run();

    const result = await db
      .prepare(
        `INSERT INTO listing_edit_requests (
           company_slug, proposed_json, current_json, status
         ) VALUES (?, ?, ?, 'pending')`,
      )
      .bind(
        company.slug,
        JSON.stringify(proposed),
        JSON.stringify(current),
      )
      .run();

    const id = result.meta.last_row_id;
    await notifyOperator(
      formatListingEditNotify({
        id: id ?? "?",
        companyName: company.name,
        companySlug: company.slug,
      }),
    );

    return NextResponse.json({
      ok: true,
      id,
      message:
        "Updates submitted for review. Changes appear on your public page after approval.",
    });
  } catch (err) {
    console.error("manage POST failed", err);
    return NextResponse.json(
      { error: "Unable to submit listing updates" },
      { status: 500 },
    );
  }
}
