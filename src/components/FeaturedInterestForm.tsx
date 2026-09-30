"use client";

import { useMemo, useState } from "react";
import { FEATURED_PLANS, type FeaturedPlanId } from "@/data/growth";
import { trackGrowth } from "@/lib/analytics";
import { EMPTY_FEATURED, type FeaturedInterest } from "@/lib/featured";

type FeaturedInterestFormProps = {
  initialCompanyName?: string;
  initialCity?: string;
  initialCompanySlug?: string;
  initialPlan?: FeaturedPlanId;
  compact?: boolean;
};

type Mode = "checkout" | "interest";

export function FeaturedInterestForm({
  initialCompanyName = "",
  initialCity = "",
  initialCompanySlug = "",
  initialPlan = "city",
  compact = false,
}: FeaturedInterestFormProps) {
  const [data, setData] = useState<FeaturedInterest>({
    ...EMPTY_FEATURED,
    companyName: initialCompanyName,
    city: initialCity,
    companySlug: initialCompanySlug,
    plan: initialPlan,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneInterest, setDoneInterest] = useState(false);
  const [mode, setMode] = useState<Mode>("checkout");

  const selectedPlan = useMemo(
    () => FEATURED_PLANS.find((p) => p.id === data.plan) ?? FEATURED_PLANS[0],
    [data.plan],
  );

  const setField = <K extends keyof FeaturedInterest>(
    key: K,
    value: FeaturedInterest[K],
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  if (doneInterest) {
    return (
      <div className="rounded-[14px] bg-white p-6 text-left text-navy">
        <div className="mb-2 text-lg font-extrabold">Interest received</div>
        <p className="m-0 text-[15px] leading-[1.55] text-muted">
          Thanks — we&apos;ll reach out about{" "}
          <span className="font-semibold text-navy">{selectedPlan.name}</span>{" "}
          placement for{" "}
          <span className="font-semibold text-navy">{data.companyName}</span>.
          Typical follow-up is one business day.
        </p>
      </div>
    );
  }

  const submitInterest = async () => {
    const res = await fetch("/api/featured/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = (await res.json().catch(() => ({}))) as {
      error?: string;
    };
    if (!res.ok) {
      throw new Error(payload.error || "Unable to submit interest");
    }
    trackGrowth("featured_interest", {
      plan: data.plan,
      city: data.city,
      companySlug: data.companySlug || undefined,
    });
    setDoneInterest(true);
  };

  const startCheckout = async () => {
    const res = await fetch("/api/featured/checkout/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = (await res.json().catch(() => ({}))) as {
      error?: string;
      url?: string;
    };
    if (!res.ok || !payload.url) {
      throw new Error(payload.error || "Unable to start checkout");
    }
    trackGrowth("featured_checkout_started", {
      plan: data.plan,
      city: data.city,
      companySlug: data.companySlug || undefined,
    });
    window.location.assign(payload.url);
  };

  return (
    <form
      className={`rounded-[14px] bg-white text-left ${compact ? "p-4" : "p-5 sm:p-6"}`}
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
          if (mode === "checkout") {
            await startCheckout();
          } else {
            await submitInterest();
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : mode === "checkout"
                ? "Unable to start checkout"
                : "Unable to submit interest",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        {FEATURED_PLANS.map((plan) => {
          const active = data.plan === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setField("plan", plan.id)}
              className={`rounded-[12px] border px-3 py-3 text-left transition-colors ${
                active
                  ? "border-bright-blue bg-[rgba(47,128,237,0.08)]"
                  : "border-border bg-bg hover:border-bright-blue"
              }`}
            >
              <div className="text-[13px] font-extrabold text-navy">
                {plan.name}
              </div>
              <div className="mt-1 text-[18px] font-extrabold text-michigan-blue">
                ${plan.priceMonthly}
                <span className="text-[12px] font-bold text-muted">/mo</span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mb-4 text-[13.5px] leading-[1.5] text-muted">
        {selectedPlan.blurb}
      </p>

      <div className="grid gap-3.5">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            Company name
          </span>
          <input
            required
            value={data.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            className="field-input !h-12"
            autoComplete="organization"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            Primary city / market
          </span>
          <input
            required
            value={data.city}
            onChange={(e) => setField("city", e.target.value)}
            placeholder="e.g. Detroit or Metro Detroit"
            className="field-input !h-12"
          />
        </label>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-navy">
              Your name
            </span>
            <input
              required
              value={data.contactName}
              onChange={(e) => setField("contactName", e.target.value)}
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
              value={data.phone}
              onChange={(e) => setField("phone", e.target.value)}
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
            value={data.email}
            onChange={(e) => setField("email", e.target.value)}
            className="field-input !h-12"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-navy">
            Notes{" "}
            <span className="font-semibold text-faint">(optional)</span>
          </span>
          <textarea
            value={data.notes}
            onChange={(e) => setField("notes", e.target.value)}
            rows={2}
            placeholder="Locations, seasonality, budget…"
            className="field-input min-h-[72px] !h-auto resize-y py-3"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-3.5 mb-0 rounded-[10px] border border-[#F0C2C2] bg-[#FFF5F5] px-3.5 py-2.5 text-[13.5px] font-semibold text-[#B42318]">
          {error}
        </p>
      ) : null}

      {mode === "checkout" ? (
        <>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 h-12 w-full rounded-[10px] border-none bg-bright-blue text-[15px] font-extrabold text-white transition-colors hover:bg-michigan-blue disabled:cursor-default disabled:bg-[#B9CDDE]"
          >
            {submitting
              ? "Redirecting to Stripe…"
              : `Subscribe · $${selectedPlan.priceMonthly}/mo →`}
          </button>
          <p className="mt-3 mb-0 text-center text-[12.5px] leading-[1.5] text-faint">
            Secure monthly billing via Stripe Checkout. Cancel anytime from your
            receipt email.
          </p>
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setError(null);
              setMode("interest");
            }}
            className="mt-3 w-full border-none bg-transparent text-[13px] font-bold text-michigan-blue underline-offset-2 hover:underline disabled:opacity-60"
          >
            Prefer to talk first? Request a call instead
          </button>
        </>
      ) : (
        <>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 h-12 w-full rounded-[10px] border-none bg-bright-blue text-[15px] font-extrabold text-white transition-colors hover:bg-michigan-blue disabled:cursor-default disabled:bg-[#B9CDDE]"
          >
            {submitting
              ? "Submitting…"
              : `Request ${selectedPlan.name} →`}
          </button>
          <p className="mt-3 mb-0 text-center text-[12.5px] leading-[1.5] text-faint">
            No charge yet — we confirm inventory and follow up offline.
          </p>
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setError(null);
              setMode("checkout");
            }}
            className="mt-3 w-full border-none bg-transparent text-[13px] font-bold text-michigan-blue underline-offset-2 hover:underline disabled:opacity-60"
          >
            ← Back to pay online with Stripe
          </button>
        </>
      )}
    </form>
  );
}
