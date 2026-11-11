import type { Metadata } from "next";
import {
  ManageLinkInvalid,
  ManageListingClient,
} from "@/components/ManageListingClient";
import { getCompanyBySlug } from "@/data/companies";
import {
  emptyCompanyLeadTotals,
  listCompanyLeads,
  summarizeCompanyLeads,
  type CompanyLead,
  type CompanyLeadTotals,
} from "@/lib/company-leads";
import { getDb } from "@/lib/db";
import {
  emptyCompanyMedia,
  getCompanyMedia,
  type CompanyMedia,
} from "@/lib/company-media";
import {
  emptyCompanyTrust,
  getCompanyTrust,
  type CompanyTrust,
} from "@/lib/company-trust";
import {
  getCompanyByManageToken,
  isValidManageTokenFormat,
  listingFieldsFromCompany,
  type ListingFields,
} from "@/lib/listing-manage";
import { getCompanyNotifyEmail } from "@/lib/notify-email";
import {
  getListingPerformance,
  type ListingPerformance,
} from "@/lib/listing-stats";
import {
  listCompanyApprovedReviews,
  type ManageReview,
} from "@/lib/review-replies";
import {
  ensureReviewToken,
  reviewRequestUrl,
} from "@/lib/review-request";
import { buildPageMetadata } from "@/lib/seo";
import { getWeeklyDigestOptOut } from "@/lib/weekly-digest";

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
  companyCity: string;
  featured: boolean;
  performance: ListingPerformance | null;
  fields: ListingFields;
  pendingEdit: { id: number; createdAt: string } | null;
  reviewUrl: string | null;
  leads: CompanyLead[];
  leadTotals: CompanyLeadTotals;
  reviews: ManageReview[];
  media: CompanyMedia;
  trust: CompanyTrust;
  notifyEmail: string | null;
  weeklyDigestOptOut: boolean;
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

  const meta = await db
    .prepare(`SELECT featured, city FROM companies WHERE slug = ? LIMIT 1`)
    .bind(company.slug)
    .first<{ featured: number; city: string }>();

  const reviewToken = await ensureReviewToken(db, company.slug);

  let performance: ListingPerformance | null = null;
  try {
    performance = await getListingPerformance(db, company.slug);
  } catch (err) {
    // Stats are additive — never block the manage form if the table is missing.
    console.error("manage performance load failed", err);
    performance = null;
  }

  let leads: CompanyLead[] = [];
  let leadTotals: CompanyLeadTotals = emptyCompanyLeadTotals();
  try {
    leads = await listCompanyLeads(db, company.slug);
    leadTotals = summarizeCompanyLeads(leads);
  } catch (err) {
    // Inbox is additive — never block the manage form if migration is pending.
    console.error("manage leads load failed", err);
    leads = [];
    leadTotals = emptyCompanyLeadTotals();
  }

  let reviews: ManageReview[] = [];
  try {
    reviews = await listCompanyApprovedReviews(db, company.slug);
  } catch (err) {
    // Replies are additive — never block the manage form if migration is pending.
    console.error("manage reviews load failed", err);
    reviews = [];
  }

  let media: CompanyMedia = emptyCompanyMedia();
  try {
    media = await getCompanyMedia(db, company.slug);
  } catch (err) {
    // Media is additive — never block the manage form if migration is pending.
    console.error("manage media load failed", err);
    media = emptyCompanyMedia();
  }

  let trust: CompanyTrust = emptyCompanyTrust();
  try {
    trust = await getCompanyTrust(db, company.slug);
  } catch (err) {
    // Trust is additive — never block the manage form if migration is pending.
    console.error("manage trust load failed", err);
    trust = emptyCompanyTrust();
  }

  let notifyEmail: string | null = null;
  try {
    notifyEmail = await getCompanyNotifyEmail(db, company.slug);
  } catch (err) {
    // notify_email has existed since migration 0012 — still never block the form.
    console.error("manage notify email load failed", err);
    notifyEmail = null;
  }

  let weeklyDigestOptOut = false;
  try {
    weeklyDigestOptOut = await getWeeklyDigestOptOut(db, company.slug);
  } catch (err) {
    // Digest prefs are additive (migration 0023) — never block the form.
    console.error("manage weekly digest preference load failed", err);
    weeklyDigestOptOut = false;
  }

  return {
    token,
    companyName: company.name,
    companySlug: company.slug,
    companyCity: meta?.city || seed?.city || "",
    featured: Boolean(meta?.featured),
    performance,
    fields,
    pendingEdit: pending
      ? { id: pending.id, createdAt: pending.created_at }
      : null,
    reviewUrl: reviewToken ? reviewRequestUrl(reviewToken) : null,
    leads,
    leadTotals,
    reviews,
    media,
    trust,
    notifyEmail,
    weeklyDigestOptOut,
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
      companyCity={loaded.companyCity}
      featured={loaded.featured}
      performance={loaded.performance}
      initialFields={loaded.fields}
      pendingEdit={loaded.pendingEdit}
      initialReviewUrl={loaded.reviewUrl}
      initialLeads={loaded.leads}
      initialLeadTotals={loaded.leadTotals}
      initialReviews={loaded.reviews}
      initialLogoUrl={loaded.media.logoUrl}
      initialPhotoUrl={loaded.media.photoUrl}
      initialTrust={loaded.trust}
      initialNotifyEmail={loaded.notifyEmail}
      initialWeeklyDigestOptOut={loaded.weeklyDigestOptOut}
    />
  );
}
