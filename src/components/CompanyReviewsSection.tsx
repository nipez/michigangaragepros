"use client";

import { useEffect, useState } from "react";
import { Stars } from "@/components/Icons";
import {
  EMPTY_REVIEW,
  type PublicReview,
  type ReviewSubmit,
  type ReviewSummary,
} from "@/lib/review";

type CompanyReviewsSectionProps = {
  companySlug: string;
  companyName: string;
};

type ReviewsPayload = {
  summary: ReviewSummary;
  reviews: PublicReview[];
};

function formatReviewDate(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : `${iso}Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CompanyReviewsSection({
  companySlug,
  companyName,
}: CompanyReviewsSectionProps) {
  const [data, setData] = useState<ReviewsPayload | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const slug = companySlug.trim();
    if (!slug) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `/api/reviews/?slug=${encodeURIComponent(slug)}`,
          { signal: controller.signal },
        );
        const payload = (await res.json().catch(() => ({}))) as {
          summary?: ReviewSummary;
          reviews?: PublicReview[];
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          throw new Error(payload.error || "Unable to load reviews");
        }
        setData({
          summary: payload.summary ?? { average: 0, count: 0 },
          reviews: payload.reviews ?? [],
        });
        setLoadError("");
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : "Unable to load reviews",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [companySlug, reloadToken]);

  const summary = data?.summary ?? { average: 0, count: 0 };
  const reviews = data?.reviews ?? [];
  const hasReviews = summary.count > 0;

  return (
    <div className="rounded-2xl border border-border bg-white p-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="m-0 mb-1.5 text-xl font-extrabold text-navy">
            Reviews
          </h2>
          {loading ? (
            <p className="m-0 text-[14px] text-muted">Loading reviews…</p>
          ) : hasReviews ? (
            <div className="flex flex-wrap items-center gap-2 text-[15px]">
              <Stars rating={summary.average} className="text-[17px]" />
              <span className="font-extrabold text-navy">
                {summary.average.toFixed(1)}
              </span>
              <span className="text-muted">
                · {summary.count} review{summary.count === 1 ? "" : "s"}
              </span>
            </div>
          ) : (
            <p className="m-0 text-[14.5px] leading-[1.55] text-muted">
              No reviews yet — be the first to share your experience with{" "}
              {companyName}.
            </p>
          )}
        </div>
      </div>

      {loadError ? (
        <p className="mb-4 text-sm font-semibold text-[#B42318]">{loadError}</p>
      ) : null}

      {!loading && hasReviews ? (
        <ul className="mb-7 m-0 grid list-none gap-4 p-0">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="border-t border-border pt-4 first:border-t-0 first:pt-0"
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <Stars rating={r.rating} className="text-[14px]" />
                <span className="text-[14.5px] font-extrabold text-navy">
                  {r.authorName}
                </span>
                <span className="text-[12.5px] font-semibold text-faint">
                  {formatReviewDate(r.createdAt)}
                </span>
              </div>
              <p className="m-0 text-[14.5px] leading-[1.6] text-body-secondary text-pretty">
                {r.body}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <ReviewForm
        companySlug={companySlug}
        companyName={companyName}
        onSubmitted={() => {
          setLoading(true);
          setReloadToken((n) => n + 1);
        }}
      />
    </div>
  );
}

function ReviewForm({
  companySlug,
  companyName,
  onSubmitted,
}: {
  companySlug: string;
  companyName: string;
  onSubmitted: () => void;
}) {
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

  if (done) {
    return (
      <div className="rounded-[12px] border border-[#CBE5D6] bg-success-bg px-4 py-3.5">
        <div className="text-[15px] font-extrabold text-navy">
          Thanks for your review
        </div>
        <p className="m-0 mt-1 text-[13.5px] leading-[1.5] text-muted">
          It&apos;s live on {companyName}&apos;s profile.
        </p>
      </div>
    );
  }

  return (
    <form
      className="relative rounded-[12px] border border-border bg-bg p-4 sm:p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
          const res = await fetch("/api/reviews/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, companySlug }),
          });
          const payload = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          if (!res.ok) {
            throw new Error(payload.error || "Unable to submit review");
          }
          setDone(true);
          onSubmitted();
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Unable to submit review",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="mb-3.5 text-[15px] font-extrabold text-navy">
        Write a review
      </div>
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

        {/* Honeypot — hidden from people, filled by many bots */}
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
          Visible after basic spam checks — no fake seed ratings.
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
        <p className="mt-3 text-sm font-semibold text-[#B42318]">{error}</p>
      ) : null}
    </form>
  );
}
