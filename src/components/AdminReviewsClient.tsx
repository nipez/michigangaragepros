"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ReviewRow = {
  id: number;
  company_slug: string;
  company_name: string | null;
  author_name: string;
  contact: string | null;
  rating: number;
  body: string;
  status: string;
  created_at: string;
  moderated_at: string | null;
};

type FilterTab = "open" | "done" | "all";

const OPEN_STATUSES = new Set(["pending"]);
const DONE_STATUSES = new Set(["visible", "hidden", "spam"]);

export function AdminReviewsClient({
  initiallyAuthed,
}: {
  initiallyAuthed: boolean;
}) {
  const [authed, setAuthed] = useState(initiallyAuthed);
  const [token, setToken] = useState("");
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(initiallyAuthed);
  const [loginBusy, setLoginBusy] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("open");
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.status === 401) {
        setAuthed(false);
        setReviews([]);
        return;
      }
      if (!res.ok) throw new Error("Unable to load reviews");
      const data = (await res.json()) as { reviews: ReviewRow[] };
      setReviews(data.reviews ?? []);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initiallyAuthed) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/admin/reviews");
        if (cancelled) return;
        if (res.status === 401) {
          setAuthed(false);
          setReviews([]);
          return;
        }
        if (!res.ok) throw new Error("Unable to load reviews");
        const data = (await res.json()) as { reviews: ReviewRow[] };
        if (cancelled) return;
        setReviews(data.reviews ?? []);
        setAuthed(true);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load reviews",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initiallyAuthed]);

  const login = async () => {
    setLoginBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!res.ok) throw new Error(data?.error || "Login failed");
      setAuthed(true);
      setToken("");
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthed(false);
    setReviews([]);
  };

  const setStatus = async (id: number, status: string) => {
    setError("");
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error || "Unable to update review status");
        return;
      }
      const moderatedAt =
        status === "visible" || status === "hidden" || status === "spam"
          ? new Date().toISOString().slice(0, 19).replace("T", " ")
          : null;
      setReviews((prev) =>
        prev.map((review) =>
          review.id === id
            ? { ...review, status, moderated_at: moderatedAt }
            : review,
        ),
      );
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    if (filter === "all") return reviews;
    if (filter === "open") {
      return reviews.filter((r) => OPEN_STATUSES.has(r.status));
    }
    return reviews.filter((r) => DONE_STATUSES.has(r.status));
  }, [reviews, filter]);

  const openCount = reviews.filter((r) => OPEN_STATUSES.has(r.status)).length;
  const doneCount = reviews.filter((r) => DONE_STATUSES.has(r.status)).length;

  if (!authed) {
    return (
      <div className="mx-auto max-w-[420px] px-6 py-16">
        <h1 className="mb-2 text-2xl font-extrabold text-navy">Admin login</h1>
        <p className="mb-6 text-sm text-muted">
          Enter the admin token to view and moderate company reviews.
        </p>
        <input
          className="field-input mb-3"
          type="password"
          placeholder="Admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void login();
          }}
        />
        <button
          type="button"
          className="btn-primary w-full !py-3"
          disabled={!token.trim() || loginBusy}
          onClick={() => void login()}
        >
          {loginBusy ? "Signing in…" : "Sign in"}
        </button>
        {error ? (
          <p className="mt-3 text-sm font-semibold text-[#B42318]">{error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="container-site py-10 pb-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-[1px] text-michigan-blue">
            Admin
          </div>
          <h1 className="m-0 text-[clamp(26px,3vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Reviews
          </h1>
          <p className="mt-2 m-0 text-sm text-muted">
            Newest first · {filtered.length} shown
            {filter !== "all" ? ` (${reviews.length} total)` : ""} · Only{" "}
            <span className="font-semibold text-navy">visible</span> reviews
            appear on public profiles
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/leads/"
            className="btn-outline !py-2.5 !px-4 inline-flex items-center"
          >
            Quote leads
          </Link>
          <Link
            href="/admin/claims/"
            className="btn-outline !py-2.5 !px-4 inline-flex items-center"
          >
            Claim requests
          </Link>
          <Link
            href="/admin/featured/"
            className="btn-outline !py-2.5 !px-4 inline-flex items-center"
          >
            Featured interest
          </Link>
          <button
            type="button"
            className="btn-outline !py-2.5 !px-4"
            onClick={() => void loadReviews()}
          >
            Refresh
          </button>
          <button
            type="button"
            className="btn-outline !py-2.5 !px-4"
            onClick={() => void logout()}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {(
          [
            { id: "open", label: `Open (${openCount})` },
            { id: "done", label: `Done (${doneCount})` },
            { id: "all", label: `All (${reviews.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`rounded-[10px] border px-3 py-2 text-xs font-bold ${
              filter === tab.id
                ? "border-michigan-blue bg-[#EEF5FF] text-michigan-blue"
                : "border-border bg-bg text-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mb-4 text-sm font-semibold text-[#B42318]">{error}</p>
      ) : null}
      {loading ? (
        <p className="text-muted">Loading reviews…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-8 text-muted">
          {reviews.length === 0
            ? "No reviews yet."
            : filter === "open"
              ? "No pending reviews. Switch to Done or All to see moderated ones."
              : "No reviews in this filter."}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((review) => {
            const companyLabel =
              review.company_name?.trim() || review.company_slug;
            return (
              <article
                key={review.id}
                className="rounded-2xl border border-border bg-white p-5 md:p-6"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-extrabold text-navy">
                      #{review.id} · {companyLabel}
                    </div>
                    <div className="mt-1 text-sm text-muted">
                      {review.created_at}
                      {" · "}
                      <Link
                        href={`/companies/${review.company_slug}/`}
                        className="font-semibold text-michigan-blue"
                      >
                        {review.company_slug}
                      </Link>
                      {" · "}
                      {review.rating}/5 stars
                    </div>
                  </div>
                  <StatusPill status={review.status} />
                </div>
                <div className="mb-4 grid gap-1.5 text-sm text-body-secondary md:grid-cols-2">
                  <div>
                    <span className="text-faint">Reviewer:</span>{" "}
                    {review.author_name}
                  </div>
                  <div>
                    <span className="text-faint">Contact:</span>{" "}
                    {review.contact || "—"}
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-faint">Review:</span> {review.body}
                  </div>
                  {review.moderated_at ? (
                    <div className="md:col-span-2">
                      <span className="text-faint">Moderated:</span>{" "}
                      {review.moderated_at}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {OPEN_STATUSES.has(review.status) ? (
                    <>
                      <button
                        type="button"
                        disabled={busyId === review.id}
                        onClick={() => void setStatus(review.id, "visible")}
                        className="rounded-[10px] border border-border bg-success-bg px-3 py-2 text-xs font-bold text-success disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busyId === review.id}
                        onClick={() => void setStatus(review.id, "hidden")}
                        className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-navy disabled:opacity-40"
                      >
                        Hide
                      </button>
                      <button
                        type="button"
                        disabled={busyId === review.id}
                        onClick={() => void setStatus(review.id, "spam")}
                        className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-navy disabled:opacity-40"
                      >
                        Spam
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={
                          review.status === "visible" || busyId === review.id
                        }
                        onClick={() => void setStatus(review.id, "visible")}
                        className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold capitalize text-navy disabled:opacity-40"
                      >
                        Mark visible
                      </button>
                      <button
                        type="button"
                        disabled={
                          review.status === "hidden" || busyId === review.id
                        }
                        onClick={() => void setStatus(review.id, "hidden")}
                        className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold capitalize text-navy disabled:opacity-40"
                      >
                        Mark hidden
                      </button>
                      <button
                        type="button"
                        disabled={
                          review.status === "spam" || busyId === review.id
                        }
                        onClick={() => void setStatus(review.id, "spam")}
                        className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold capitalize text-navy disabled:opacity-40"
                      >
                        Mark spam
                      </button>
                      <button
                        type="button"
                        disabled={busyId === review.id}
                        onClick={() => void setStatus(review.id, "pending")}
                        className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold capitalize text-navy disabled:opacity-40"
                      >
                        Reopen
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "pending"
      ? "bg-[#EEF5FF] text-michigan-blue"
      : status === "visible"
        ? "bg-success-bg text-success"
        : status === "spam"
          ? "bg-[#FEE4E2] text-[#B42318]"
          : "bg-tag-bg text-muted";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] ${color}`}
    >
      {status}
    </span>
  );
}
