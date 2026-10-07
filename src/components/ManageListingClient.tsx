"use client";

import { useState, type ReactNode } from "react";
import {
  MANAGE_SERVICE_OPTIONS,
  type ListingFields,
} from "@/lib/listing-manage";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";

type Props = {
  token: string;
  companyName: string;
  companySlug: string;
  initialFields: ListingFields;
  pendingEdit: { id: number; createdAt: string } | null;
};

export function ManageListingClient({
  token,
  companyName,
  companySlug,
  initialFields,
  pendingEdit,
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
            recently claimed your company page, ask the Michigan Garage Pros
            team to send you a new link.
          </p>
          <a
            href="/for-companies/"
            className="btn-primary mt-8 inline-flex !px-6 !py-3"
          >
            For companies
          </a>
        </div>
      </div>
      <CompactFooter />
    </>
  );
}
