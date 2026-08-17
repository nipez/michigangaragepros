"use client";

import Link from "next/link";
import { useState } from "react";
import { trackGrowth } from "@/lib/analytics";
import { EMPTY_CLAIM, type ClaimRequest } from "@/lib/claim";

type ClaimFormProps = {
  initialCompanyName?: string;
  initialCity?: string;
  initialCompanySlug?: string;
};

export function ClaimForm({
  initialCompanyName = "",
  initialCity = "",
  initialCompanySlug = "",
}: ClaimFormProps) {
  const [claim, setClaim] = useState<ClaimRequest>({
    ...EMPTY_CLAIM,
    companyName: initialCompanyName,
    city: initialCity,
    companySlug: initialCompanySlug,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const setField = <K extends keyof ClaimRequest>(key: K, value: ClaimRequest[K]) => {
    setClaim((prev) => ({ ...prev, [key]: value }));
  };

  if (submittedEmail) {
    const featuredHref = `/for-companies/?company=${encodeURIComponent(claim.companyName)}&city=${encodeURIComponent(claim.city)}&slug=${encodeURIComponent(claim.companySlug)}#featured`;
    return (
      <div className="mx-auto max-w-[560px] rounded-[14px] bg-white p-7 text-left text-navy">
        <div className="mb-2 text-lg font-extrabold">Request received</div>
        <p className="m-0 text-[15px] leading-[1.55] text-muted">
          Thanks — your claim is{" "}
          <span className="font-semibold text-navy">in review</span>. We&apos;ll
          email{" "}
          <span className="font-semibold text-navy">{submittedEmail}</span> to
          verify ownership before the page is marked claimed. Usually within one
          business day.
        </p>
        <div className="mt-5 rounded-[12px] border border-border bg-bg p-4">
          <div className="mb-1 text-[15px] font-extrabold text-navy">
            Want to stand out while we verify?
          </div>
          <p className="mb-3.5 text-[13.5px] leading-[1.5] text-muted">
            Featured placement puts a Sponsored badge at the top of your city
            results — from $149/mo. No charge until we confirm.
          </p>
          <Link
            href={featuredHref}
            className="inline-flex rounded-[10px] bg-bright-blue px-4 py-2.5 text-[14px] font-extrabold text-white hover:bg-michigan-blue"
          >
            See Featured plans →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className="mx-auto max-w-[560px] rounded-[14px] bg-white p-5 text-left sm:p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
          const res = await fetch("/api/claims/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(claim),
          });
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          if (!res.ok) {
            throw new Error(data.error || "Unable to submit claim request");
          }
          trackGrowth("claim_submitted", {
            city: claim.city,
            companySlug: claim.companySlug || undefined,
          });
          setSubmittedEmail(claim.email.trim());
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to submit claim request",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="grid gap-3.5">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            Company name
          </span>
          <input
            required
            value={claim.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            placeholder="Your garage door company"
            className="field-input !h-12"
            autoComplete="organization"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            City
          </span>
          <input
            required
            value={claim.city}
            onChange={(e) => setField("city", e.target.value)}
            placeholder="Primary city"
            className="field-input !h-12"
            autoComplete="address-level2"
          />
        </label>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-navy">
              Your name
            </span>
            <input
              required
              value={claim.contactName}
              onChange={(e) => setField("contactName", e.target.value)}
              placeholder="Full name"
              className="field-input !h-12"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-navy">
              Phone
            </span>
            <input
              required
              type="tel"
              inputMode="tel"
              value={claim.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="(555) 555-5555"
              className="field-input !h-12"
              autoComplete="tel"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            Work email
          </span>
          <input
            required
            type="email"
            inputMode="email"
            value={claim.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="you@yourcompany.com"
            className="field-input !h-12"
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            Website{" "}
            <span className="font-semibold text-faint">(optional)</span>
          </span>
          <input
            type="url"
            value={claim.website}
            onChange={(e) => setField("website", e.target.value)}
            placeholder="https://"
            className="field-input !h-12"
            autoComplete="url"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            Anything we should know?{" "}
            <span className="font-semibold text-faint">(optional)</span>
          </span>
          <textarea
            value={claim.notes}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="Role, multiple locations, listing corrections…"
            rows={3}
            className="field-input min-h-[88px] !h-auto resize-y py-3"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-3.5 mb-0 rounded-[10px] border border-[#F0C2C2] bg-[#FFF5F5] px-3.5 py-2.5 text-[13.5px] font-semibold text-[#B42318]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 h-12 w-full rounded-[10px] border-none bg-bright-blue text-[15px] font-extrabold text-white transition-colors hover:bg-michigan-blue disabled:cursor-default disabled:bg-[#B9CDDE]"
      >
        {submitting ? "Submitting…" : "Submit Claim Request →"}
      </button>

      <p className="mt-3 mb-0 text-center text-[12.5px] leading-[1.5] text-faint">
        We use your contact info only to verify you represent this company and
        set up your page.
      </p>
    </form>
  );
}
