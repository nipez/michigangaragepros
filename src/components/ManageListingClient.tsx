"use client";

import {
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type {
  CompanyLead,
  CompanyLeadTotals,
} from "@/lib/company-leads";
import type { MediaKind } from "@/lib/company-media";
import {
  emptyCompanyTrust,
  type CompanyTrust,
} from "@/lib/company-trust";
import {
  MANAGE_SERVICE_OPTIONS,
  type ListingFields,
} from "@/lib/listing-manage";
import type { ListingPerformance } from "@/lib/listing-stats";
import type { ManageReview } from "@/lib/review-replies";
import { CompanyLeadInbox } from "./CompanyLeadInbox";
import { CompanyReviewReplies } from "./CompanyReviewReplies";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";
import { ListingPerformancePanel } from "./ListingPerformancePanel";

type Props = {
  token: string;
  companyName: string;
  companySlug: string;
  companyCity: string;
  featured: boolean;
  performance: ListingPerformance | null;
  initialFields: ListingFields;
  pendingEdit: { id: number; createdAt: string } | null;
  initialReviewUrl: string | null;
  initialLeads: CompanyLead[];
  initialLeadTotals: CompanyLeadTotals;
  initialReviews: ManageReview[];
  initialLogoUrl: string | null;
  initialPhotoUrl: string | null;
  initialTrust: CompanyTrust;
  initialNotifyEmail: string | null;
  initialWeeklyDigestOptOut: boolean;
};

export function ManageListingClient({
  token,
  companyName,
  companySlug,
  companyCity,
  featured,
  performance,
  initialFields,
  pendingEdit,
  initialReviewUrl,
  initialLeads,
  initialLeadTotals,
  initialReviews,
  initialLogoUrl,
  initialPhotoUrl,
  initialTrust,
  initialNotifyEmail,
  initialWeeklyDigestOptOut,
}: Props) {
  const [fields, setFields] = useState<ListingFields>(initialFields);
  const [customService, setCustomService] = useState("");
  const [areasText, setAreasText] = useState(
    initialFields.serviceArea.join("\n"),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(pendingEdit);
  const [reviewUrl, setReviewUrl] = useState(initialReviewUrl);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewCopied, setReviewCopied] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl);
  const [mediaBusy, setMediaBusy] = useState<MediaKind | null>(null);
  const [mediaNote, setMediaNote] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [trust, setTrust] = useState<CompanyTrust>(
    initialTrust ?? emptyCompanyTrust(),
  );
  const [yearsText, setYearsText] = useState(
    initialTrust?.yearsInBusiness !== null &&
      initialTrust?.yearsInBusiness !== undefined
      ? String(initialTrust.yearsInBusiness)
      : "",
  );
  const [trustBusy, setTrustBusy] = useState(false);
  const [trustNote, setTrustNote] = useState("");
  const [trustError, setTrustError] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(initialNotifyEmail ?? "");
  const [notifyEmailBusy, setNotifyEmailBusy] = useState(false);
  const [notifyEmailNote, setNotifyEmailNote] = useState("");
  const [notifyEmailError, setNotifyEmailError] = useState("");
  const [digestOptOut, setDigestOptOut] = useState(
    Boolean(initialWeeklyDigestOptOut),
  );
  const [digestBusy, setDigestBusy] = useState(false);
  const [digestNote, setDigestNote] = useState("");
  const [digestError, setDigestError] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof ListingFields>(
    key: K,
    value: ListingFields[K],
  ) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const toggleService = (service: string) => {
    setFields((prev) => {
      const has = prev.services.includes(service);
      return {
        ...prev,
        services: has
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const addCustomService = () => {
    const v = customService.trim();
    if (!v) return;
    setFields((prev) =>
      prev.services.includes(v)
        ? prev
        : { ...prev, services: [...prev.services, v] },
    );
    setCustomService("");
  };

  const extraServices = fields.services.filter(
    (s) =>
      !(MANAGE_SERVICE_OPTIONS as readonly string[]).includes(s),
  );

  const copyReviewLink = async () => {
    if (!reviewUrl) return;
    try {
      await navigator.clipboard.writeText(reviewUrl);
      setReviewCopied(true);
      setTimeout(() => setReviewCopied(false), 2000);
    } catch {
      setReviewNote("Unable to copy — select the link and copy manually.");
    }
  };

  const regenerateReviewLink = async () => {
    setReviewBusy(true);
    setReviewNote("");
    try {
      const res = await fetch(`/api/manage/${token}/review-token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "regenerate" }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        review_url?: string | null;
      } | null;
      if (!res.ok) {
        setReviewNote(data?.error || "Unable to regenerate review link");
        return;
      }
      setReviewUrl(data?.review_url ?? null);
      setReviewNote(
        "New review link issued. The previous link no longer works.",
      );
    } finally {
      setReviewBusy(false);
    }
  };

  const uploadMedia = async (kind: MediaKind, file: File) => {
    setMediaBusy(kind);
    setMediaError("");
    setMediaNote("");
    try {
      const body = new FormData();
      body.set("kind", kind);
      body.set("file", file);
      const res = await fetch(`/api/manage/${token}/media/`, {
        method: "POST",
        body,
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
        logoUrl?: string | null;
        photoUrl?: string | null;
      } | null;
      if (!res.ok) {
        setMediaError(data?.error || "Unable to upload image");
        return;
      }
      setLogoUrl(data?.logoUrl ?? null);
      setPhotoUrl(data?.photoUrl ?? null);
      setMediaNote(
        data?.message ||
          (kind === "logo" ? "Logo updated." : "Profile photo updated."),
      );
    } finally {
      setMediaBusy(null);
    }
  };

  const removeMedia = async (kind: MediaKind) => {
    setMediaBusy(kind);
    setMediaError("");
    setMediaNote("");
    try {
      const res = await fetch(`/api/manage/${token}/media/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
        logoUrl?: string | null;
        photoUrl?: string | null;
      } | null;
      if (!res.ok) {
        setMediaError(data?.error || "Unable to remove image");
        return;
      }
      setLogoUrl(data?.logoUrl ?? null);
      setPhotoUrl(data?.photoUrl ?? null);
      setMediaNote(
        data?.message ||
          (kind === "logo" ? "Logo removed." : "Profile photo removed."),
      );
    } finally {
      setMediaBusy(null);
    }
  };

  const saveTrust = async () => {
    setTrustBusy(true);
    setTrustError("");
    setTrustNote("");
    try {
      const yearsTrimmed = yearsText.trim();
      const payload = {
        licensed: trust.licensed,
        licenseNumber: trust.licensed ? trust.licenseNumber : null,
        insured: trust.insured,
        bonded: trust.bonded,
        familyOwned: trust.familyOwned,
        yearsInBusiness: yearsTrimmed === "" ? null : yearsTrimmed,
      };
      const res = await fetch(`/api/manage/${token}/trust/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
        trust?: CompanyTrust;
      } | null;
      if (!res.ok) {
        setTrustError(data?.error || "Unable to save trust credentials");
        return;
      }
      if (data?.trust) {
        setTrust(data.trust);
        setYearsText(
          data.trust.yearsInBusiness !== null
            ? String(data.trust.yearsInBusiness)
            : "",
        );
      }
      setTrustNote(data?.message || "Trust credentials updated.");
    } finally {
      setTrustBusy(false);
    }
  };

  const saveNotifyEmail = async () => {
    setNotifyEmailBusy(true);
    setNotifyEmailError("");
    setNotifyEmailNote("");
    try {
      const res = await fetch(`/api/manage/${token}/notify-email/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: notifyEmail }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
        email?: string | null;
      } | null;
      if (!res.ok) {
        setNotifyEmailError(
          data?.error || "Unable to save notification email",
        );
        return;
      }
      if (typeof data?.email === "string") {
        setNotifyEmail(data.email);
      }
      setNotifyEmailNote(
        data?.message || "Notification email updated.",
      );
    } finally {
      setNotifyEmailBusy(false);
    }
  };

  const saveDigestPreference = async (nextOptOut: boolean) => {
    setDigestBusy(true);
    setDigestError("");
    setDigestNote("");
    try {
      const res = await fetch(`/api/manage/${token}/digest/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optedOut: nextOptOut }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
        optedOut?: boolean;
      } | null;
      if (!res.ok) {
        setDigestError(data?.error || "Unable to save email preference");
        return;
      }
      if (typeof data?.optedOut === "boolean") {
        setDigestOptOut(data.optedOut);
      } else {
        setDigestOptOut(nextOptOut);
      }
      setDigestNote(
        data?.message ||
          (nextOptOut
            ? "Weekly performance emails turned off."
            : "Weekly performance emails turned on."),
      );
    } finally {
      setDigestBusy(false);
    }
  };

  const submit = async () => {
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const serviceArea = areasText
        .split(/[\n,]+/)
        .map((a) => a.trim())
        .filter(Boolean);
      const payload: ListingFields = { ...fields, serviceArea };

      const res = await fetch(`/api/manage/${token}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
        id?: number;
      } | null;
      if (!res.ok) {
        setError(data?.error || "Unable to submit updates");
        return;
      }
      setSuccess(
        data?.message ||
          "Updates submitted for review. Changes appear after approval.",
      );
      setPending({
        id: data?.id ?? 0,
        createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      });
      setFields(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header active="pros" />
      <div className="container-site py-10 pb-20">
        <div className="mx-auto max-w-[640px]">
          <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-[1px] text-michigan-blue">
            Manage your listing
          </div>
          <h1 className="m-0 text-[clamp(26px,3vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            {companyName}
          </h1>
          <p className="mt-2 mb-0 text-sm text-muted">
            Propose updates to your public profile. Changes are reviewed before
            they go live.{" "}
            <a
              href={`/companies/${companySlug}/`}
              className="font-semibold text-michigan-blue"
            >
              View public page →
            </a>
          </p>

          {pending ? (
            <div className="mt-5 rounded-[12px] border border-[#B6D4FE] bg-[#EEF5FF] px-4 py-3 text-sm text-navy">
              You have an update pending review
              {pending.createdAt ? ` (submitted ${pending.createdAt})` : ""}.
              Submitting again replaces the previous pending request.
            </div>
          ) : null}

          {performance ? (
            <div className="mt-5">
              <ListingPerformancePanel
                performance={performance}
                featured={featured}
                companyName={companyName}
                companySlug={companySlug}
                companyCity={companyCity}
                variant="manage"
                showUpsell
              />
            </div>
          ) : null}

          <div className="mt-5">
            <CompanyLeadInbox
              token={token}
              companyName={companyName}
              companySlug={companySlug}
              companyCity={companyCity}
              featured={featured}
              reviewUrl={reviewUrl}
              initialLeads={initialLeads}
              initialTotals={initialLeadTotals}
            />
          </div>

          <div className="mt-5 rounded-[12px] border border-border bg-bg px-4 py-4">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.6px] text-navy">
              Notification email
            </div>
            <p className="mt-1.5 mb-4 text-[13.5px] leading-[1.5] text-muted">
              New quote leads and related notices go to this address. Changing
              it does not change your private manage link. The previous address
              gets a heads-up when email sending is configured.
            </p>
            <label className="mb-1.5 block text-[13px] font-bold text-navy">
              Email
            </label>
            <input
              className="field-input"
              type="email"
              autoComplete="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              maxLength={254}
              placeholder="office@example.com"
            />
            <div className="mt-4">
              <button
                type="button"
                className="btn-outline !px-3 !py-2 !text-[13px]"
                disabled={notifyEmailBusy}
                onClick={() => void saveNotifyEmail()}
              >
                {notifyEmailBusy ? "Saving…" : "Save notification email"}
              </button>
            </div>
            {notifyEmailNote ? (
              <p className="mt-3 mb-0 text-[12.5px] font-semibold text-success">
                {notifyEmailNote}
              </p>
            ) : null}
            {notifyEmailError ? (
              <p className="mt-3 mb-0 text-[12.5px] font-semibold text-[#B42318]">
                {notifyEmailError}
              </p>
            ) : null}

            <div className="mt-5 border-t border-border pt-4">
              <div className="text-[13px] font-extrabold uppercase tracking-[0.6px] text-navy">
                Weekly performance email
              </div>
              <p className="mt-1.5 mb-3 text-[13.5px] leading-[1.5] text-muted">
                Once a week we summarize your recent profile views, leads, and
                reviews when there is something to report. Sent to the
                notification email above.
              </p>
              <label className="flex cursor-pointer items-start gap-2.5 text-[13.5px] text-navy">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={!digestOptOut}
                  disabled={digestBusy}
                  onChange={(e) => {
                    void saveDigestPreference(!e.target.checked);
                  }}
                />
                <span>
                  Send me a weekly performance email
                  {digestBusy ? " (saving…)" : ""}
                </span>
              </label>
              {digestNote ? (
                <p className="mt-3 mb-0 text-[12.5px] font-semibold text-success">
                  {digestNote}
                </p>
              ) : null}
              {digestError ? (
                <p className="mt-3 mb-0 text-[12.5px] font-semibold text-[#B42318]">
                  {digestError}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-5">
            <CompanyReviewReplies
              token={token}
              companyName={companyName}
              initialReviews={initialReviews}
            />
          </div>

          <div className="mt-5 rounded-[12px] border border-border bg-bg px-4 py-4">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.6px] text-navy">
              Review request link
            </div>
            <p className="mt-1.5 mb-3 text-[13.5px] leading-[1.5] text-muted">
              Share this link with customers so they can leave a review on your
              public profile. Reviews are moderated before they appear.
            </p>
            {reviewUrl ? (
              <p className="mb-3 break-all text-[13px] font-semibold text-navy">
                {reviewUrl}
              </p>
            ) : (
              <p className="mb-3 text-[13px] text-muted">
                No link yet — regenerate to issue one.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {reviewUrl ? (
                <button
                  type="button"
                  className="btn-outline !px-3 !py-2 !text-[13px]"
                  onClick={() => void copyReviewLink()}
                >
                  {reviewCopied ? "Copied" : "Copy link"}
                </button>
              ) : null}
              <button
                type="button"
                className="btn-outline !px-3 !py-2 !text-[13px]"
                disabled={reviewBusy}
                onClick={() => void regenerateReviewLink()}
              >
                {reviewBusy
                  ? "Working…"
                  : reviewUrl
                    ? "Regenerate"
                    : "Issue link"}
              </button>
            </div>
            {reviewNote ? (
              <p className="mt-2.5 mb-0 text-[12.5px] text-muted">{reviewNote}</p>
            ) : null}
          </div>

          <div className="mt-5 rounded-[12px] border border-border bg-bg px-4 py-4">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.6px] text-navy">
              Logo &amp; photo
            </div>
            <p className="mt-1.5 mb-4 text-[13.5px] leading-[1.5] text-muted">
              Upload a square logo (required for brand recognition) and
              optionally one wide profile photo. Changes go live immediately —
              no review wait.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <MediaSlot
                label="Logo"
                hint="Square JPEG, PNG, or WebP · max 512KB"
                previewUrl={logoUrl}
                previewClassName="size-[88px] rounded-[14px] object-cover"
                busy={mediaBusy === "logo"}
                inputRef={logoInputRef}
                onPick={() => logoInputRef.current?.click()}
                onFile={(file) => void uploadMedia("logo", file)}
                onRemove={
                  logoUrl ? () => void removeMedia("logo") : undefined
                }
              />
              <MediaSlot
                label="Profile photo"
                hint="Wide JPEG, PNG, or WebP · max 1.5MB · optional"
                previewUrl={photoUrl}
                previewClassName="aspect-[5/2] w-full rounded-[12px] object-cover"
                busy={mediaBusy === "photo"}
                inputRef={photoInputRef}
                onPick={() => photoInputRef.current?.click()}
                onFile={(file) => void uploadMedia("photo", file)}
                onRemove={
                  photoUrl ? () => void removeMedia("photo") : undefined
                }
              />
            </div>
            {mediaNote ? (
              <p className="mt-3 mb-0 text-[12.5px] font-semibold text-success">
                {mediaNote}
              </p>
            ) : null}
            {mediaError ? (
              <p className="mt-3 mb-0 text-[12.5px] font-semibold text-[#B42318]">
                {mediaError}
              </p>
            ) : null}
          </div>

          <div className="mt-5 rounded-[12px] border border-border bg-bg px-4 py-4">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.6px] text-navy">
              Trust credentials
            </div>
            <p className="mt-1.5 mb-4 text-[13.5px] leading-[1.5] text-muted">
              Self-report licensed, insured, and related trust signals. These
              show on your public profile and listing cards, clearly labeled as
              self-reported — Michigan Garage Pros does not verify them.
              Changes go live immediately.
            </p>
            <div className="grid gap-3">
              <label className="flex items-start gap-2.5 text-[14px] font-semibold text-navy">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-[var(--michigan-blue)]"
                  checked={trust.licensed}
                  onChange={(e) =>
                    setTrust((prev) => ({
                      ...prev,
                      licensed: e.target.checked,
                      licenseNumber: e.target.checked
                        ? prev.licenseNumber
                        : null,
                    }))
                  }
                />
                <span>
                  Licensed
                  <span className="mt-0.5 block text-[12.5px] font-medium text-muted">
                    Optional license number shows next to the badge.
                  </span>
                </span>
              </label>
              {trust.licensed ? (
                <div className="ml-6">
                  <input
                    className="field-input"
                    value={trust.licenseNumber ?? ""}
                    onChange={(e) =>
                      setTrust((prev) => ({
                        ...prev,
                        licenseNumber: e.target.value || null,
                      }))
                    }
                    maxLength={40}
                    placeholder="License # (optional)"
                  />
                </div>
              ) : null}
              <label className="flex items-start gap-2.5 text-[14px] font-semibold text-navy">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-[var(--michigan-blue)]"
                  checked={trust.insured}
                  onChange={(e) =>
                    setTrust((prev) => ({
                      ...prev,
                      insured: e.target.checked,
                    }))
                  }
                />
                <span>Insured</span>
              </label>
              <label className="flex items-start gap-2.5 text-[14px] font-semibold text-navy">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-[var(--michigan-blue)]"
                  checked={trust.bonded}
                  onChange={(e) =>
                    setTrust((prev) => ({
                      ...prev,
                      bonded: e.target.checked,
                    }))
                  }
                />
                <span>
                  Bonded
                  <span className="mt-0.5 block text-[12.5px] font-medium text-muted">
                    Optional
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2.5 text-[14px] font-semibold text-navy">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-[var(--michigan-blue)]"
                  checked={trust.familyOwned}
                  onChange={(e) =>
                    setTrust((prev) => ({
                      ...prev,
                      familyOwned: e.target.checked,
                    }))
                  }
                />
                <span>
                  Family-owned
                  <span className="mt-0.5 block text-[12.5px] font-medium text-muted">
                    Optional
                  </span>
                </span>
              </label>
              <div className="pt-1">
                <label className="mb-1.5 block text-[13px] font-bold text-navy">
                  Years in business
                </label>
                <input
                  className="field-input max-w-[140px]"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={yearsText}
                  onChange={(e) =>
                    setYearsText(e.target.value.replace(/[^\d]/g, "").slice(0, 3))
                  }
                  maxLength={3}
                  placeholder="e.g. 12"
                />
                <p className="mt-1.5 mb-0 text-[12px] text-muted">
                  Leave blank to hide. Whole numbers 0–150.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="btn-outline !px-3 !py-2 !text-[13px]"
                disabled={trustBusy}
                onClick={() => void saveTrust()}
              >
                {trustBusy ? "Saving…" : "Save trust credentials"}
              </button>
            </div>
            {trustNote ? (
              <p className="mt-3 mb-0 text-[12.5px] font-semibold text-success">
                {trustNote}
              </p>
            ) : null}
            {trustError ? (
              <p className="mt-3 mb-0 text-[12.5px] font-semibold text-[#B42318]">
                {trustError}
              </p>
            ) : null}
          </div>

          {success ? (
            <div className="mt-5 rounded-[12px] border border-border bg-success-bg px-4 py-3 text-sm font-semibold text-success">
              {success}
            </div>
          ) : null}
          {error ? (
            <p className="mt-5 text-sm font-semibold text-[#B42318]">{error}</p>
          ) : null}

          <div className="mt-8 grid gap-5">
            <Field label="About">
              <textarea
                className="field-input min-h-[120px]"
                value={fields.about}
                onChange={(e) => setField("about", e.target.value)}
                maxLength={1200}
                placeholder="Tell homeowners about your company…"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone">
                <input
                  className="field-input"
                  value={fields.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  maxLength={40}
                  placeholder="(616) 555-0100"
                />
              </Field>
              <Field label="Alt phone">
                <input
                  className="field-input"
                  value={fields.phoneAlt}
                  onChange={(e) => setField("phoneAlt", e.target.value)}
                  maxLength={40}
                  placeholder="Optional"
                />
              </Field>
            </div>

            <Field label="Website">
              <input
                className="field-input"
                value={fields.website}
                onChange={(e) => setField("website", e.target.value)}
                maxLength={200}
                placeholder="https://example.com"
              />
            </Field>

            <Field label="Address">
              <input
                className="field-input"
                value={fields.address}
                onChange={(e) => setField("address", e.target.value)}
                maxLength={200}
                placeholder="Street address (optional)"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Hours">
                <input
                  className="field-input"
                  value={fields.hours}
                  onChange={(e) => setField("hours", e.target.value)}
                  maxLength={120}
                  placeholder="Mon–Sat, 7am–8pm"
                />
              </Field>
              <Field label="Emergency hours">
                <input
                  className="field-input"
                  value={fields.emergencyHours}
                  onChange={(e) => setField("emergencyHours", e.target.value)}
                  maxLength={120}
                  placeholder="24/7 response"
                />
              </Field>
            </div>

            <Field label="Services offered">
              <div className="grid gap-2">
                {MANAGE_SERVICE_OPTIONS.map((service) => (
                  <label
                    key={service}
                    className="flex items-center gap-2.5 text-sm font-semibold text-navy"
                  >
                    <input
                      type="checkbox"
                      checked={fields.services.includes(service)}
                      onChange={() => toggleService(service)}
                    />
                    {service}
                  </label>
                ))}
                {extraServices.map((service) => (
                  <label
                    key={service}
                    className="flex items-center gap-2.5 text-sm font-semibold text-navy"
                  >
                    <input
                      type="checkbox"
                      checked
                      onChange={() => toggleService(service)}
                    />
                    {service}
                  </label>
                ))}
                <div className="mt-1 flex gap-2">
                  <input
                    className="field-input"
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    placeholder="Add another service"
                    maxLength={80}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomService();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-outline !px-3 !py-2 shrink-0"
                    onClick={addCustomService}
                  >
                    Add
                  </button>
                </div>
              </div>
            </Field>

            <Field label="Service areas / cities">
              <textarea
                className="field-input min-h-[110px]"
                value={areasText}
                onChange={(e) => setAreasText(e.target.value)}
                placeholder={"One city per line\nGrand Rapids\nHolland\nWyoming"}
              />
              <p className="mt-1.5 mb-0 text-[12.5px] text-muted">
                One city per line (or comma-separated).
              </p>
            </Field>

            <button
              type="button"
              className="btn-primary !py-3.5 !text-[15px]"
              disabled={submitting}
              onClick={() => void submit()}
            >
              {submitting ? "Submitting…" : "Submit for review"}
            </button>
            <p className="m-0 text-center text-[12.5px] text-muted">
              Keep this page link private. Anyone with it can propose updates to
              your listing.
            </p>
          </div>
        </div>
      </div>
      <CompactFooter />
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[13px] font-bold text-navy">{label}</span>
      {children}
    </label>
  );
}

function MediaSlot({
  label,
  hint,
  previewUrl,
  previewClassName,
  busy,
  inputRef,
  onPick,
  onFile,
  onRemove,
}: {
  label: string;
  hint: string;
  previewUrl: string | null;
  previewClassName: string;
  busy: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onPick: () => void;
  onFile: (file: File) => void;
  onRemove?: () => void;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[13px] font-bold text-navy">{label}</div>
      <div className="mb-2.5 min-h-[88px]">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- R2-proxied owner upload
          <img
            src={previewUrl}
            alt=""
            className={`bg-white border border-border ${previewClassName}`}
          />
        ) : (
          <div
            className={`grid place-items-center border border-dashed border-border bg-white text-[12px] font-semibold text-faint ${previewClassName.includes("aspect") ? previewClassName : "size-[88px] rounded-[14px]"}`}
          >
            No image
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onFile(file);
        }}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-outline !px-3 !py-2 !text-[13px]"
          disabled={busy}
          onClick={onPick}
        >
          {busy ? "Uploading…" : previewUrl ? "Replace" : "Upload"}
        </button>
        {onRemove ? (
          <button
            type="button"
            className="btn-outline !px-3 !py-2 !text-[13px]"
            disabled={busy}
            onClick={onRemove}
          >
            Remove
          </button>
        ) : null}
      </div>
      <p className="mt-1.5 mb-0 text-[12px] text-muted">{hint}</p>
    </div>
  );
}

export function ManageLinkInvalid() {
  return (
    <>
      <Header />
      <div className="container-site py-20 pb-28">
        <div className="mx-auto max-w-[480px] text-center">
          <div className="mb-2 text-[12.5px] font-extrabold uppercase tracking-[1px] text-muted">
            Manage listing
          </div>
          <h1 className="m-0 text-[clamp(26px,3vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Link not found
          </h1>
          <p className="mt-3 text-[15px] leading-[1.6] text-muted">
            This manage link is invalid, expired, or has been revoked. If you
            recently claimed your company page, recover the link with the email
            you used when claiming.
          </p>
          <a
            href="/for-companies/#recover"
            className="btn-primary mt-8 inline-flex !px-6 !py-3"
          >
            Recover manage link
          </a>
        </div>
      </div>
      <CompactFooter />
    </>
  );
}
