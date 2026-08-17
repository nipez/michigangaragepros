"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ISSUE_OPTIONS,
  SERVICE_OPTIONS,
  STEP_SUBS,
  STEP_TITLES,
  TIMING_OPTIONS,
} from "@/data/site";
import { emptyLead, isStepValid, type Lead } from "@/lib/lead";
import { trackGrowth } from "@/lib/analytics";

type LeadFormProps = {
  initialLead?: Partial<Lead>;
  initialStep?: number;
  variant?: "page" | "modal";
  onDoneClose?: () => void;
  onExitHref?: string;
};

export function LeadForm({
  initialLead,
  initialStep = 1,
  variant = "page",
  onDoneClose,
  onExitHref = "/",
}: LeadFormProps) {
  const [step, setStep] = useState(initialStep);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [lead, setLead] = useState<Lead>({ ...emptyLead(), ...initialLead });

  const valid = isStepValid(step, lead);
  const setField = <K extends keyof Lead>(key: K, value: Lead[K]) => {
    setLead((prev) => ({ ...prev, [key]: value }));
  };

  const submitLead = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/leads/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to submit request");
      }
      trackGrowth("quote_submitted", {
        service: lead.service,
        zip: lead.zip,
        timing: lead.timing,
      });
      setDone(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to submit request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (!valid || submitting) return;
    if (step === 1) {
      trackGrowth("quote_started", { service: lead.service || "unknown" });
    }
    if (step === 5) void submitLead();
    else setStep((s) => s + 1);
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  if (done) {
    return (
      <div className="px-0 py-6 text-center">
        <div
          className="mx-auto mb-[18px] grid place-items-center rounded-full bg-success-bg font-extrabold text-success"
          style={{
            width: variant === "page" ? 64 : 60,
            height: variant === "page" ? 64 : 60,
            fontSize: variant === "page" ? 28 : 26,
          }}
        >
          ✓
        </div>
        <h2
          className="mb-2.5 font-extrabold text-navy"
          style={{ fontSize: variant === "page" ? 26 : 24 }}
        >
          Request received
        </h2>
        <p
          className="mx-auto mb-6 max-w-[40ch] leading-[1.6] text-muted"
          style={{ fontSize: variant === "page" ? 15.5 : 15 }}
        >
          We&apos;ll match your request with garage-door professionals serving
          your area. Expect to hear from local pros soon.
        </p>
        {variant === "modal" && onDoneClose ? (
          <button type="button" onClick={onDoneClose} className="btn-navy !py-3 !px-6 !text-[15px] !font-bold">
            Done
          </button>
        ) : (
          <Link
            href={onExitHref}
            className="btn-navy inline-block !rounded-[11px] !px-[26px] !py-[13px] !text-[15px] !font-bold"
          >
            Back to Home
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 text-[12.5px] font-extrabold uppercase tracking-[1px] text-michigan-blue">
        Get a Free Quote · Step {step} of 5
      </div>
      <h2
        className="mb-1.5 font-extrabold tracking-[-0.5px] text-navy"
        style={{ fontSize: variant === "page" ? 26 : 22 }}
      >
        {STEP_TITLES[step]}
      </h2>
      <p
        className="mb-5 text-muted"
        style={{ fontSize: variant === "page" ? 14.5 : 14, marginBottom: variant === "page" ? 22 : 20 }}
      >
        {STEP_SUBS[step]}
      </p>

      <div className="mb-6 flex gap-1.5" style={{ marginBottom: variant === "page" ? 26 : 22 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className="h-1 flex-1 rounded-sm"
            style={{ background: n <= step ? "#2F80ED" : "#E4E9F0" }}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="flex flex-wrap gap-[9px]">
          {SERVICE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`chip ${lead.service === opt ? "is-selected" : ""}`}
              style={variant === "page" ? { padding: "11px 18px", fontSize: 14.5 } : undefined}
              onClick={() => setField("service", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-wrap gap-[9px]">
          {ISSUE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`chip ${lead.issue === opt ? "is-selected" : ""}`}
              style={variant === "page" ? { padding: "11px 18px", fontSize: 14.5 } : undefined}
              onClick={() => setField("issue", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <input
          className="field-input !h-[52px] !text-base"
          placeholder="ZIP code"
          inputMode="numeric"
          value={lead.zip}
          onChange={(e) => setField("zip", e.target.value)}
        />
      )}

      {step === 4 && (
        <div className="grid gap-3">
          <input
            className="field-input"
            placeholder="Name"
            value={lead.name}
            onChange={(e) => setField("name", e.target.value)}
          />
          <input
            className="field-input"
            placeholder="Phone"
            inputMode="tel"
            value={lead.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
          <input
            className="field-input"
            placeholder="Email"
            inputMode="email"
            value={lead.email}
            onChange={(e) => setField("email", e.target.value)}
          />
        </div>
      )}

      {step === 5 && (
        <div className="flex flex-wrap gap-[9px]">
          {TIMING_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`chip ${lead.timing === opt ? "is-selected" : ""}`}
              style={variant === "page" ? { padding: "11px 18px", fontSize: 14.5 } : undefined}
              onClick={() => setField("timing", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      <div
        className="flex items-center justify-between"
        style={{ marginTop: variant === "page" ? 30 : 28 }}
      >
        <button
          type="button"
          onClick={back}
          className="border-none bg-transparent text-sm font-bold"
          style={{
            padding: "11px 18px",
            borderRadius: 10,
            color: step === 1 ? "#C4CFDA" : "#667085",
            cursor: step === 1 ? "default" : "pointer",
            visibility: step === 1 ? "hidden" : "visible",
          }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!valid || submitting}
          className="border-none font-extrabold text-white"
          style={{
            padding: variant === "page" ? "13px 26px" : "12px 24px",
            borderRadius: 10,
            background: valid && !submitting ? "#2F80ED" : "#B9CDDE",
            fontSize: 15,
            cursor: valid && !submitting ? "pointer" : "default",
          }}
        >
          {step === 5
            ? submitting
              ? "Submitting…"
              : "Submit Request"
            : "Continue →"}
        </button>
      </div>
      {submitError ? (
        <p className="mt-3 text-sm font-semibold text-[#B42318]">{submitError}</p>
      ) : null}
    </div>
  );
}
