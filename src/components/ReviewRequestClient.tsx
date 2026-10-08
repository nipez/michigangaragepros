"use client";

import { useState } from "react";
import { EMPTY_REVIEW, type ReviewSubmit } from "@/lib/review";
import { CompactFooter } from "./Footer";
import { Header } from "./Header";

type Props = {
  token: string;
  companyName: string;
  companySlug: string;
};

export function ReviewRequestClient({
  token,
  companyName,
  companySlug,
}: Props) {
  const [form, setForm] = useState<ReviewSubmit>({
    ...EMPTY_REVIEW,
    companySlug,
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const setField = <K extends keyof ReviewSubmit>(
    key: K,
    value: ReviewSubmit[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Header active="pros" />
      <div className="container-site py-10 pb-20">
        <div className="mx-auto max-w-[560px]">
          <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-[1px] text-michigan-blue">
            Leave a review
          </div>
          <h1 className="m-0 text-[clamp(26px,3vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            {companyName}
          </h1>
          <p className="mt-2 mb-0 text-sm text-muted">
            Share your experience with homeowners considering this company.{" "}
            <a
              href={`/companies/${companySlug}/`}
              className="font-semibold text-michigan-blue"
            >
              View full listing →
            </a>
          </p>

          {done ? (
            <div className="mt-8 rounded-[12px] border border-[#CBE5D6] bg-success-bg px-4 py-4">
              <div className="text-[15px] font-extrabold text-navy">
                Thanks for your review
              </div>
              <p className="m-0 mt-1 text-[13.5px] leading-[1.5] text-muted">
                We&apos;ll publish it on {companyName}&apos;s profile after a
                quick review.
              </p>
            </div>
          ) : (
            <form
              className="relative mt-8 rounded-[12px] border border-border bg-white p-5 sm:p-6"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setSubmitting(true);
                try {
                  const res = await fetch(`/api/review/${token}/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      authorName: form.authorName,
                      contact: form.contact,
                      rating: form.rating,
                      body: form.body,
                      website: form.website,
                    }),
                  });
                  const payload = (await res.json().catch(() => ({}))) as {
                    error?: string;
                  };
                  if (!res.ok) {
                    throw new Error(payload.error || "Unable to submit review");
                  }
                  setDone(true);
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Unable to submit review",
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div className="grid gap-3.5">
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">
                    Your name
                  </span>
                  <input
                    required
                    value={form.authorName}
                    onChange={(e) => setField("authorName", e.target.value)}
                    placeholder="First name or initials"
                    className="field-input !h-12"
                    autoComplete="name"
                    maxLength={80}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">
                    Email or phone{" "}
                    <span className="font-semibold text-faint">(optional)</span>
                  </span>
                  <input
                    value={form.contact}
                    onChange={(e) => setField("contact", e.target.value)}
                    placeholder="Not shown publicly"
                    className="field-input !h-12"
                    autoComplete="email"
                    maxLength={120}
                  />
                </label>

                <fieldset className="m-0 border-0 p-0">
                  <legend className="mb-1.5 block text-[13px] font-bold text-navy">
                    Rating
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {[5, 4, 3, 2, 1].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`chip !px-3.5 !py-2 ${form.rating === n ? "is-selected" : ""}`}
                        onClick={() => setField("rating", n)}
                        aria-pressed={form.rating === n}
                      >
                        {n} ★
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">
                    Your experience
                  </span>
                  <textarea
                    required
                    value={form.body}
                    onChange={(e) => setField("body", e.target.value)}
                    placeholder="What went well? Anything homeowners should know?"
                    className="field-input min-h-[96px] !h-auto resize-y py-3"
                    maxLength={600}
                  />
                </label>

                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                >
                  <label>
                    Website
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => setField("website", e.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="m-0 text-[12.5px] font-semibold text-faint">
                  Published after a quick review — no fake seed ratings.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary !rounded-[10px] !px-5 !py-2.5 !text-[14.5px]"
                >
                  {submitting ? "Submitting…" : "Submit review"}
                </button>
              </div>
              {error ? (
                <p className="mt-3 text-sm font-semibold text-[#B42318]">
                  {error}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
      <CompactFooter />
    </>
  );
}

export function ReviewLinkInvalid() {
  return (
    <>
      <Header />
      <div className="container-site py-20 pb-28">
        <div className="mx-auto max-w-[480px] text-center">
          <div className="mb-2 text-[12.5px] font-extrabold uppercase tracking-[1px] text-muted">
            Leave a review
          </div>
          <h1 className="m-0 text-[clamp(26px,3vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Link not found
          </h1>
          <p className="mt-3 text-[15px] leading-[1.6] text-muted">
            This review link is invalid or has been revoked. Ask the company for
            a new link, or find them in the directory.
          </p>
          <a href="/pros/" className="btn-primary mt-8 inline-flex !px-6 !py-3">
            Browse companies
          </a>
        </div>
      </div>
      <CompactFooter />
    </>
  );
}
