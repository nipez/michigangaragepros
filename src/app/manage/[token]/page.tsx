import type { Metadata } from "next";
import {
  ManageLinkInvalid,
  ManageListingClient,
} from "@/components/ManageListingClient";
import { getCompanyBySlug } from "@/data/companies";
import { getDb } from "@/lib/db";
import {
  getCompanyByManageToken,
  isValidManageTokenFormat,
  listingFieldsFromCompany,
  type ListingFields,
} from "@/lib/listing-manage";
import {
  ensureReviewToken,
  reviewRequestUrl,
} from "@/lib/review-request";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ token: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;
  return buildPageMetadata({
    title: "Manage your listing",
    description: "Update your Michigan Garage Pros company listing.",
    path: `/manage/${token}/`,
    noIndex: true,
  });
}

type LoadedManage = {
  token: string;
  companyName: string;
  companySlug: string;
  fields: ListingFields;
  pendingEdit: { id: number; createdAt: string } | null;
  reviewUrl: string | null;
};

async function loadManagePage(token: string): Promise<LoadedManage | null> {
  if (!isValidManageTokenFormat(token)) return null;

  const db = await getDb();
  const company = await getCompanyByManageToken(db, token);
  if (!company) return null;

  const seed = getCompanyBySlug(company.slug);
  let fields = company.fields;
  if (seed) {
    const seedFields = listingFieldsFromCompany(seed);
    fields = {
      about: fields.about || seedFields.about,
      phone: fields.phone || seedFields.phone,
      phoneAlt: fields.phoneAlt || seedFields.phoneAlt,
      website: fields.website || seedFields.website,
      address: fields.address || seedFields.address,
      hours: fields.hours || seedFields.hours,
      emergencyHours: fields.emergencyHours || seedFields.emergencyHours,
      services: fields.services.length ? fields.services : seedFields.services,
      serviceArea: fields.serviceArea.length
        ? fields.serviceArea
        : seedFields.serviceArea,
    };
  }

  const pending = await db
    .prepare(
      `SELECT id, created_at FROM listing_edit_requests
       WHERE company_slug = ? AND status = 'pending'
       ORDER BY datetime(created_at) DESC LIMIT 1`,
    )
    .bind(company.slug)
    .first<{ id: number; created_at: string }>();

  const reviewToken = await ensureReviewToken(db, company.slug);

  return {
    token,
    companyName: company.name,
    companySlug: company.slug,
    fields,
    pendingEdit: pending
      ? { id: pending.id, createdAt: pending.created_at }
      : null,
    reviewUrl: reviewToken ? reviewRequestUrl(reviewToken) : null,
  };
}

export default async function ManageListingPage({ params }: PageProps) {
  const { token } = await params;

  let loaded: LoadedManage | null = null;
  try {
    loaded = await loadManagePage(token);
  } catch {
    loaded = null;
  }

  if (!loaded) {
    return <ManageLinkInvalid />;
  }

  return (
    <ManageListingClient
      token={loaded.token}
      companyName={loaded.companyName}
      companySlug={loaded.companySlug}
      initialFields={loaded.fields}
      pendingEdit={loaded.pendingEdit}
      initialReviewUrl={loaded.reviewUrl}
    />
  );
}
