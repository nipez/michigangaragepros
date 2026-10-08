"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ClaimRow = {
  id: number;
  company_name: string;
  city: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  company_slug: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
  manage_token: string | null;
  manage_url: string | null;
  review_token: string | null;
  review_url: string | null;
};

type FilterTab = "open" | "done" | "all";

const OPEN_STATUSES = new Set(["new", "pending"]);
const DONE_STATUSES = new Set(["approved", "rejected"]);

export function AdminClaimsClient({
  initiallyAuthed,
}: {
  initiallyAuthed: boolean;
}) {
  const [authed, setAuthed] = useState(initiallyAuthed);
  const [token, setToken] = useState("");
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(initiallyAuthed);
  const [loginBusy, setLoginBusy] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("open");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [tokenBusySlug, setTokenBusySlug] = useState<string | null>(null);
  const [reviewTokenBusySlug, setReviewTokenBusySlug] = useState<string | null>(
    null,
  );
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedReviewSlug, setCopiedReviewSlug] = useState<string | null>(null);

  const loadClaims = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/claims");
      if (res.status === 401) {
        setAuthed(false);
        setClaims([]);
        return;
      }
      if (!res.ok) throw new Error("Unable to load claims");
      const data = (await res.json()) as { claims: ClaimRow[] };
      setClaims(data.claims ?? []);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initiallyAuthed) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/admin/claims");
        if (cancelled) return;
        if (res.status === 401) {
          setAuthed(false);
          setClaims([]);
          return;
        }
        if (!res.ok) throw new Error("Unable to load claims");
        const data = (await res.json()) as { claims: ClaimRow[] };
        if (cancelled) return;
        setClaims(data.claims ?? []);
        setAuthed(true);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load claims",
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
      await loadClaims();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthed(false);
    setClaims([]);
  };

  const setStatus = async (id: number, status: string) => {
    setError("");
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        manage_token?: string | null;
        manage_url?: string | null;
        review_token?: string | null;
        review_url?: string | null;
      } | null;
      if (!res.ok) {
        setError(data?.error || "Unable to update claim status");
        return;
      }
      const reviewedAt =
        status === "approved" || status === "rejected"
          ? new Date().toISOString().slice(0, 19).replace("T", " ")
          : null;
      setClaims((prev) =>
        prev.map((claim) => {
          if (claim.id !== id) return claim;
          const next: ClaimRow = {
            ...claim,
            status,
            reviewed_at: reviewedAt,
          };
          if (status === "approved") {
            if (data?.manage_url) {
              next.manage_token = data.manage_token ?? null;
              next.manage_url = data.manage_url;
            }
            if (data?.review_url) {
              next.review_token = data.review_token ?? null;
              next.review_url = data.review_url;
            }
          }
          return next;
        }),
      );
    } finally {
      setBusyId(null);
    }
  };

  const copyManageLink = async (slug: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      setError("Unable to copy link — select and copy manually");
    }
  };

  const copyReviewLink = async (slug: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedReviewSlug(slug);
      setTimeout(() => setCopiedReviewSlug(null), 2000);
    } catch {
      setError("Unable to copy link — select and copy manually");
    }
  };

  const manageTokenAction = async (
    slug: string,
    action: "regenerate" | "revoke",
  ) => {
    setError("");
    setTokenBusySlug(slug);
    try {
      const res = await fetch("/api/admin/manage-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        manage_token?: string | null;
        manage_url?: string | null;
      } | null;
      if (!res.ok) {
        setError(data?.error || `Unable to ${action} manage link`);
        return;
      }
      setClaims((prev) =>
        prev.map((claim) =>
          claim.company_slug === slug
            ? {
                ...claim,
                manage_token: data?.manage_token ?? null,
                manage_url: data?.manage_url ?? null,
              }
            : claim,
        ),
      );
    } finally {
      setTokenBusySlug(null);
    }
  };

  const reviewTokenAction = async (
    slug: string,
    action: "regenerate" | "revoke",
  ) => {
    setError("");
    setReviewTokenBusySlug(slug);
    try {
      const res = await fetch("/api/admin/review-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        review_token?: string | null;
        review_url?: string | null;
      } | null;
      if (!res.ok) {
        setError(data?.error || `Unable to ${action} review link`);
        return;
      }
      setClaims((prev) =>
        prev.map((claim) =>
          claim.company_slug === slug
            ? {
                ...claim,
                review_token: data?.review_token ?? null,
                review_url: data?.review_url ?? null,
              }
            : claim,
        ),
      );
    } finally {
      setReviewTokenBusySlug(null);
    }
  };

  const filtered = useMemo(() => {
    if (filter === "all") return claims;
    if (filter === "open") {
      return claims.filter((c) => OPEN_STATUSES.has(c.status));
    }
    return claims.filter((c) => DONE_STATUSES.has(c.status));
  }, [claims, filter]);

  const openCount = claims.filter((c) => OPEN_STATUSES.has(c.status)).length;
  const doneCount = claims.filter((c) => DONE_STATUSES.has(c.status)).length;

  if (!authed) {
    return (
      <div className="mx-auto max-w-[420px] px-6 py-16">
        <h1 className="mb-2 text-2xl font-extrabold text-navy">Admin login</h1>
        <p className="mb-6 text-sm text-muted">
          Enter the admin token to view and manage company claim requests.
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
            Claim requests
          </h1>
          <p className="mt-2 m-0 text-sm text-muted">
            Newest first · {filtered.length} shown
            {filter !== "all" ? ` (${claims.length} total)` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/listing-edits/"
            className="btn-outline !py-2.5 !px-4 inline-flex items-center"
          >
            Listing edits
          </Link>
          <Link
            href="/admin/leads/"
            className="btn-outline !py-2.5 !px-4 inline-flex items-center"
          >
            Quote leads
          </Link>
          <Link
            href="/admin/featured/"
            className="btn-outline !py-2.5 !px-4 inline-flex items-center"
          >
            Featured interest
          </Link>
          <Link
            href="/admin/reviews/"
            className="btn-outline !py-2.5 !px-4 inline-flex items-center"
          >
            Reviews
          </Link>
          <button
            type="button"
            className="btn-outline !py-2.5 !px-4"
            onClick={() => void loadClaims()}
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
            { id: "all", label: `All (${claims.length})` },
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
        <p className="text-muted">Loading claims…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-8 text-muted">
          {claims.length === 0
            ? "No claim requests yet."
            : filter === "open"
              ? "No open claims. Switch to Done or All to see reviewed requests."
              : "No claims in this filter."}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((claim) => (
            <article
              key={claim.id}
              className="rounded-2xl border border-border bg-white p-5 md:p-6"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold text-navy">
                    #{claim.id} · {claim.company_name}
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {claim.created_at} · {claim.city}
                    {claim.company_slug ? (
                      <>
                        {" · "}
                        <Link
                          href={`/companies/${claim.company_slug}/`}
                          className="font-semibold text-michigan-blue"
                        >
                          {claim.company_slug}
                        </Link>
                      </>
                    ) : null}
                  </div>
                </div>
                <StatusPill status={claim.status} />
              </div>
              <div className="mb-4 grid gap-1.5 text-sm text-body-secondary md:grid-cols-2">
                <div>
                  <span className="text-faint">Contact:</span>{" "}
                  {claim.contact_name || "—"}
                </div>
                <div>
                  <span className="text-faint">Phone:</span>{" "}
                  {claim.phone ? (
                    <a
                      className="font-semibold text-michigan-blue"
                      href={`tel:${claim.phone}`}
                    >
                      {claim.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  <span className="text-faint">Email:</span>{" "}
                  {claim.email ? (
                    <a
                      className="font-semibold text-michigan-blue"
                      href={`mailto:${claim.email}`}
                    >
                      {claim.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  <span className="text-faint">Website:</span>{" "}
                  {claim.website ? (
                    <a
                      className="font-semibold text-michigan-blue"
                      href={claim.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {claim.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                {claim.notes ? (
                  <div className="md:col-span-2">
                    <span className="text-faint">Notes:</span> {claim.notes}
                  </div>
                ) : null}
                {claim.reviewed_at ? (
                  <div className="md:col-span-2">
                    <span className="text-faint">Reviewed:</span>{" "}
                    {claim.reviewed_at}
                  </div>
                ) : null}
                {claim.status === "approved" && claim.company_slug ? (
                  <div className="md:col-span-2">
                    <div className="mb-1.5">
                      <span className="text-faint">Manage link:</span>{" "}
                      {claim.manage_url ? (
                        <span className="break-all font-semibold text-navy">
                          {claim.manage_url}
                        </span>
                      ) : (
                        <span className="text-muted">
                          None — regenerate to issue a link
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {claim.manage_url ? (
                        <button
                          type="button"
                          onClick={() =>
                            void copyManageLink(
                              claim.company_slug!,
                              claim.manage_url!,
                            )
                          }
                          className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-navy"
                        >
                          {copiedSlug === claim.company_slug
                            ? "Copied"
                            : "Copy link"}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        disabled={tokenBusySlug === claim.company_slug}
                        onClick={() =>
                          void manageTokenAction(
                            claim.company_slug!,
                            "regenerate",
                          )
                        }
                        className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-navy disabled:opacity-40"
                      >
                        {claim.manage_url ? "Regenerate" : "Issue link"}
                      </button>
                      {claim.manage_url ? (
                        <button
                          type="button"
                          disabled={tokenBusySlug === claim.company_slug}
                          onClick={() =>
                            void manageTokenAction(
                              claim.company_slug!,
                              "revoke",
                            )
                          }
                          className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-[#B42318] disabled:opacity-40"
                        >
                          Revoke
                        </button>
                      ) : null}
                    </div>
                    <div className="mt-4 mb-1.5">
                      <span className="text-faint">Review request link:</span>{" "}
                      {claim.review_url ? (
                        <span className="break-all font-semibold text-navy">
                          {claim.review_url}
                        </span>
                      ) : (
                        <span className="text-muted">
                          None — regenerate to issue a link
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {claim.review_url ? (
                        <button
                          type="button"
                          onClick={() =>
                            void copyReviewLink(
                              claim.company_slug!,
                              claim.review_url!,
                            )
                          }
                          className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-navy"
                        >
                          {copiedReviewSlug === claim.company_slug
                            ? "Copied"
                            : "Copy review link"}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        disabled={reviewTokenBusySlug === claim.company_slug}
                        onClick={() =>
                          void reviewTokenAction(
                            claim.company_slug!,
                            "regenerate",
                          )
                        }
                        className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-navy disabled:opacity-40"
                      >
                        {claim.review_url
                          ? "Regenerate review link"
                          : "Issue review link"}
                      </button>
                      {claim.review_url ? (
                        <button
                          type="button"
                          disabled={reviewTokenBusySlug === claim.company_slug}
                          onClick={() =>
                            void reviewTokenAction(
                              claim.company_slug!,
                              "revoke",
                            )
                          }
                          className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-[#B42318] disabled:opacity-40"
                        >
                          Revoke review link
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {OPEN_STATUSES.has(claim.status) ? (
                  <>
                    <button
                      type="button"
                      disabled={busyId === claim.id}
                      onClick={() => void setStatus(claim.id, "approved")}
                      className="rounded-[10px] border border-border bg-success-bg px-3 py-2 text-xs font-bold text-success disabled:opacity-40"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busyId === claim.id}
                      onClick={() => void setStatus(claim.id, "rejected")}
                      className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-navy disabled:opacity-40"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={
                        claim.status === "approved" || busyId === claim.id
                      }
                      onClick={() => void setStatus(claim.id, "approved")}
                      className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold capitalize text-navy disabled:opacity-40"
                    >
                      Mark approved
                    </button>
                    <button
                      type="button"
                      disabled={
                        claim.status === "rejected" || busyId === claim.id
                      }
                      onClick={() => void setStatus(claim.id, "rejected")}
                      className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold capitalize text-navy disabled:opacity-40"
                    >
                      Mark rejected
                    </button>
                    <button
                      type="button"
                      disabled={busyId === claim.id}
                      onClick={() => void setStatus(claim.id, "pending")}
                      className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold capitalize text-navy disabled:opacity-40"
                    >
                      Reopen
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "new" || status === "pending"
      ? "bg-[#EEF5FF] text-michigan-blue"
      : status === "approved"
        ? "bg-success-bg text-success"
        : "bg-tag-bg text-muted";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] ${color}`}
    >
      {status}
    </span>
  );
}
