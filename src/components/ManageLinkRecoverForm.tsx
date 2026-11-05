"use client";

import { useState } from "react";
import {
  EMPTY_MANAGE_RECOVER,
  MANAGE_RECOVER_SUCCESS_MESSAGE,
  type ManageRecoverRequest,
} from "@/lib/manage-recover";

export function ManageLinkRecoverForm() {
  const [form, setForm] = useState<ManageRecoverRequest>({
    ...EMPTY_MANAGE_RECOVER,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const setField = <K extends keyof ManageRecoverRequest>(
    key: K,
    value: ManageRecoverRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (done) {
    return (
      <div className="mx-auto max-w-[560px] rounded-[14px] bg-white p-7 text-left text-navy">
        <div className="mb-2 text-lg font-extrabold">Check your email</div>
        <p className="m-0 text-[15px] leading-[1.55] text-muted">
          {MANAGE_RECOVER_SUCCESS_MESSAGE}
        </p>
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
          const res = await fetch("/api/manage/recover/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
            message?: string;
          };
          if (!res.ok) {
            throw new Error(data.error || "Unable to send recovery email");
          }
          setDone(true);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to send recovery email",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="grid gap-3.5">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            Email used when claiming
          </span>
          <input
            required
            type="email"
            inputMode="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="you@yourcompany.com"
            className="field-input !h-12"
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            Company name{" "}
            <span className="font-semibold text-faint">(optional)</span>
          </span>
          <input
            value={form.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            placeholder="Helps if you manage more than one listing"
            className="field-input !h-12"
            autoComplete="organization"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            Listing slug{" "}
            <span className="font-semibold text-faint">(optional)</span>
          </span>
          <input
            value={form.companySlug}
            onChange={(e) => setField("companySlug", e.target.value)}
            placeholder="e.g. acme-garage-doors"
            className="field-input !h-12"
            autoComplete="off"
          />
        </label>

        {/* Honeypot — hidden from people, filled by naive bots */}
        <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
          <span>Website</span>
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => setField("website", e.target.value)}
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
        {submitting ? "Sending…" : "Email me my manage link →"}
      </button>

      <p className="mt-3 mb-0 text-center text-[12.5px] leading-[1.5] text-faint">
        We only email the existing private link — we do not generate a new one
        here.
      </p>
    </form>
  );
}
