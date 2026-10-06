"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FEATURED_PLANS } from "@/data/growth";

type FeaturedRow = {
  id: number;
  company_name: string;
  city: string;
  plan: string;
  contact_name: string;
  email: string;
  phone: string;
  company_slug: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  stripe_session_id?: string | null;
  paid_at?: string | null;
  company_featured: number | null;
  company_exists: number | null;
};

type FilterTab = "open" | "done" | "all";

const OPEN_STATUSES = new Set(["new", "contacted", "checkout_pending", "paid"]);
const DONE_STATUSES = new Set(["won", "closed"]);

const PLAN_LABEL: Record<string, string> = Object.fromEntries(
  FEATURED_PLANS.map((p) => [
    p.id,
    `${p.name} · $${p.priceMonthly}/mo`,
  ]),
);

function planLabel(plan: string): string {
  return PLAN_LABEL[plan] ?? plan;
}

function canActivate(row: FeaturedRow): boolean {
  return Boolean(row.company_slug?.trim()) && row.company_exists === 1;
}

export function AdminFeaturedClient({
  initiallyAuthed,
}: {
  initiallyAuthed: boolean;
}) {
  const [authed, setAuthed] = useState(initiallyAuthed);
  const [token, setToken] = useState("");
  const [requests, setRequests] = useState<FeaturedRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(initiallyAuthed);
  const [loginBusy, setLoginBusy] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("open");
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/featured");
      if (res.status === 401) {
        setAuthed(false);
        setRequests([]);
        return;
      }
      if (!res.ok) throw new Error("Unable to load Featured requests");
      const data = (await res.json()) as { requests: FeaturedRow[] };
      setRequests(data.requests ?? []);
      setAuthed(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load Featured requests",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initiallyAuthed) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/admin/featured");
        if (cancelled) return;
        if (res.status === 401) {
          setAuthed(false);
          setRequests([]);
          return;
        }
        if (!res.ok) throw new Error("Unable to load Featured requests");
        const data = (await res.json()) as { requests: FeaturedRow[] };
        if (cancelled) return;
        setRequests(data.requests ?? []);
        setAuthed(true);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Featured requests",
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
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthed(false);
    setRequests([]);
  };

  const setStatus = async (id: number, status: string) => {
    setError("");
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/featured", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error || "Unable to update Featured request");
        return;
      }
      const data = (await res.json()) as {
        featured_updated?: "activated" | "deactivated" | null;
      };
      setRequests((prev) =>
        prev.map((row) => {
          if (row.id !== id) return row;
          let company_featured = row.company_featured;
          if (data.featured_updated === "activated") company_featured = 1;
          if (data.featured_updated === "deactivated") company_featured = 0;
          return { ...row, status, company_featured };
        }),
      );
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    if (filter === "all") return requests;
    if (filter === "open") {
      return requests.filter((r) => OPEN_STATUSES.has(r.status));
    }
    return requests.filter((r) => DONE_STATUSES.has(r.status));
  }, [requests, filter]);

  const openCount = requests.filter((r) => OPEN_STATUSES.has(r.status)).length;
  const doneCount = requests.filter((r) => DONE_STATUSES.has(r.status)).length;

  if (!authed) {
    return (
      <div className="mx-auto max-w-[420px] px-6 py-16">
        <h1 className="mb-2 text-2xl font-extrabold text-navy">Admin login</h1>
        <p className="mb-6 text-sm text-muted">
          Enter the admin token to view and manage Featured interest requests.
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
            Featured interest
          </h1>
          <p className="mt-2 m-0 text-sm text-muted">
            Newest first · {filtered.length} shown
            {filter !== "all" ? ` (${requests.length} total)` : ""} · Stripe
            Checkout sets paid/won automatically; mark won offline when needed
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
            href="/admin/reviews/"
            className="btn-outline !py-2.5 !px-4 inline-flex items-center"
          >
            Reviews
          </Link>
          <button
            type="button"
            className="btn-outline !py-2.5 !px-4"
            onClick={() => void loadRequests()}
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
            { id: "all", label: `All (${requests.length})` },
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
        <p className="text-muted">Loading Featured requests…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-8 text-muted">
          {requests.length === 0
            ? "No Featured interest yet. Contractors submit from /for-companies/ or a company profile nudge."
            : filter === "open"
              ? "No open requests. Switch to Done or All to see won/closed."
              : "No requests in this filter."}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((row) => (
            <article
              key={row.id}
              className="rounded-2xl border border-border bg-white p-5 md:p-6"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold text-navy">
                    #{row.id} · {row.company_name}
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {row.created_at} · {row.city}
                    {row.company_slug ? (
                      <>
                        {" · "}
                        {row.company_exists === 1 ? (
                          <Link
                            href={`/companies/${row.company_slug}/`}
                            className="font-semibold text-michigan-blue"
                          >
                            {row.company_slug}
                          </Link>
                        ) : (
                          <span className="font-semibold text-[#B42318]">
                            {row.company_slug} (not found)
                          </span>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {row.company_featured === 1 ? (
                    <span className="rounded-full bg-success-bg px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] text-success">
                      Sponsored on
                    </span>
                  ) : null}
                  <StatusPill status={row.status} />
                </div>
              </div>
              <div className="mb-4 grid gap-1.5 text-sm text-body-secondary md:grid-cols-2">
                <div>
                  <span className="text-faint">Plan:</span>{" "}
                  <span className="font-semibold text-navy">
                    {planLabel(row.plan)}
                  </span>
                </div>
                <div>
                  <span className="text-faint">Contact:</span>{" "}
                  {row.contact_name || "—"}
                </div>
                <div>
                  <span className="text-faint">Phone:</span>{" "}
                  {row.phone ? (
                    <a
                      className="font-semibold text-michigan-blue"
                      href={`tel:${row.phone}`}
                    >
                      {row.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  <span className="text-faint">Email:</span>{" "}
                  {row.email ? (
                    <a
                      className="font-semibold text-michigan-blue"
                      href={`mailto:${row.email}`}
                    >
                      {row.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                {row.notes ? (
                  <div className="md:col-span-2">
                    <span className="text-faint">Notes:</span> {row.notes}
                  </div>
                ) : null}
                {row.paid_at ? (
                  <div className="md:col-span-2">
                    <span className="text-faint">Paid at:</span> {row.paid_at}
                    {row.stripe_session_id ? (
                      <>
                        {" · "}
                        <span className="font-mono text-[12px] text-navy">
                          {row.stripe_session_id}
                        </span>
                      </>
                    ) : null}
                  </div>
                ) : null}
                {!canActivate(row) ? (
                  <div className="md:col-span-2 text-[#B42318]">
                    <span className="font-semibold">
                      Featured cannot be activated:
                    </span>{" "}
                    {!row.company_slug?.trim()
                      ? "no company slug on this request."
                      : `slug "${row.company_slug}" does not match a listing.`}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {OPEN_STATUSES.has(row.status) ? (
                  <>
                    {row.status !== "contacted" ? (
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => void setStatus(row.id, "contacted")}
                        className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-navy disabled:opacity-40"
                      >
                        Mark contacted
                      </button>
                    ) : null}
                    <button
                      type="button"
                      disabled={busyId === row.id || !canActivate(row)}
                      title={
                        canActivate(row)
                          ? "Mark won and set companies.featured = 1"
                          : "Needs a resolvable company slug"
                      }
                      onClick={() => void setStatus(row.id, "won")}
                      className="rounded-[10px] border border-border bg-success-bg px-3 py-2 text-xs font-bold text-success disabled:opacity-40"
                    >
                      Mark won · Activate Featured
                    </button>
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => void setStatus(row.id, "closed")}
                      className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-navy disabled:opacity-40"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={
                        row.status === "won" ||
                        busyId === row.id ||
                        !canActivate(row)
                      }
                      onClick={() => void setStatus(row.id, "won")}
                      className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold capitalize text-navy disabled:opacity-40"
                    >
                      Mark won · Activate
                    </button>
                    <button
                      type="button"
                      disabled={row.status === "closed" || busyId === row.id}
                      onClick={() => void setStatus(row.id, "closed")}
                      className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold capitalize text-navy disabled:opacity-40"
                    >
                      Mark closed
                    </button>
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => void setStatus(row.id, "contacted")}
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
    status === "new"
      ? "bg-[#EEF5FF] text-michigan-blue"
      : status === "contacted"
        ? "bg-[#FFF4E5] text-[#B54708]"
        : status === "checkout_pending"
          ? "bg-[#F3EEFF] text-[#6941C6]"
          : status === "paid"
            ? "bg-[#E6F4EA] text-[#137333]"
            : status === "won"
              ? "bg-success-bg text-success"
              : "bg-tag-bg text-muted";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] ${color}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
