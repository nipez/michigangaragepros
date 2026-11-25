"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LeadRouting = {
  id: number;
  lead_id: number;
  company_slug: string;
  email: string;
  reason: string;
  emailed: number;
  created_at: string;
  company_status?: string;
  status_updated_at?: string | null;
  first_viewed_at?: string | null;
  first_acted_at?: string | null;
  nudge_sent_at?: string | null;
};

type FallbackStats = {
  windowDays: number;
  fallbackRoutings: number;
  leadsWithFallback: number;
  needsAdminAttention: number;
  openNeedsAdminAttention: number;
};

type CheckinStats = {
  windowDays: number;
  sent: number;
  yes: number;
  notYet: number;
  noResponse: number;
  optedOut: number;
};

type LeadRow = {
  id: number;
  service: string;
  issue: string;
  zip: string;
  name: string;
  phone: string | null;
  email: string | null;
  timing: string;
  company_slug: string | null;
  source_page: string | null;
  status: string;
  created_at: string;
  routed_at: string | null;
  routed_to: string | null;
  needs_admin_attention?: number;
  fallback_exhausted_at?: string | null;
  checkin_sent_at?: string | null;
  checkin_response?: string | null;
  checkin_responded_at?: string | null;
  checkin_helped_company_slug?: string | null;
  checkin_opt_out?: number;
  routings?: LeadRouting[];
};

export function AdminLeadsClient({
  initiallyAuthed,
}: {
  initiallyAuthed: boolean;
}) {
  const [authed, setAuthed] = useState(initiallyAuthed);
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [fallbackStats, setFallbackStats] = useState<FallbackStats | null>(
    null,
  );
  const [checkinStats, setCheckinStats] = useState<CheckinStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(initiallyAuthed);
  const [loginBusy, setLoginBusy] = useState(false);

  const applyLeadsPayload = (data: {
    leads?: LeadRow[];
    fallbackStats?: FallbackStats | null;
    checkinStats?: CheckinStats | null;
  }) => {
    setLeads(data.leads ?? []);
    setFallbackStats(data.fallbackStats ?? null);
    setCheckinStats(data.checkinStats ?? null);
  };

  const loadLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads");
      if (res.status === 401) {
        setAuthed(false);
        setLeads([]);
        setFallbackStats(null);
        setCheckinStats(null);
        return;
      }
      if (!res.ok) throw new Error("Unable to load leads");
      const data = (await res.json()) as {
        leads: LeadRow[];
        fallbackStats?: FallbackStats | null;
        checkinStats?: CheckinStats | null;
      };
      applyLeadsPayload(data);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initiallyAuthed) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/admin/leads");
        if (cancelled) return;
        if (res.status === 401) {
          setAuthed(false);
          setLeads([]);
          setFallbackStats(null);
          setCheckinStats(null);
          return;
        }
        if (!res.ok) throw new Error("Unable to load leads");
        const data = (await res.json()) as {
          leads: LeadRow[];
          fallbackStats?: FallbackStats | null;
          checkinStats?: CheckinStats | null;
        };
        if (cancelled) return;
        applyLeadsPayload(data);
        setAuthed(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load leads");
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
      await loadLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthed(false);
    setLeads([]);
    setFallbackStats(null);
    setCheckinStats(null);
  };

  const setStatus = async (id: number, status: string) => {
    setError("");
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      setError("Unable to update lead status");
      return;
    }
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
    );
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-[420px] px-6 py-16">
        <h1 className="mb-2 text-2xl font-extrabold text-navy">Admin login</h1>
        <p className="mb-6 text-sm text-muted">
          Enter the admin token to view and manage quote leads.
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
            Quote leads
          </h1>
          <p className="mt-2 m-0 text-sm text-muted">
            Newest first · {leads.length} shown
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/funnel/"
            className="btn-outline !py-2.5 !px-4 inline-flex items-center"
          >
            Quote funnel
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
          <Link
            href="/admin/listing-edits/"
            className="btn-outline !py-2.5 !px-4 inline-flex items-center"
          >
            Listing edits
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
            onClick={() => void loadLeads()}
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

      {fallbackStats || checkinStats ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fallbackStats ? (
            <>
              <div className="rounded-2xl border border-border bg-white px-5 py-4">
                <div className="text-[12px] font-extrabold uppercase tracking-[0.5px] text-faint">
                  Fallback routings ({fallbackStats.windowDays}d)
                </div>
                <div className="mt-1 text-[28px] font-extrabold tracking-[-0.5px] text-navy">
                  {fallbackStats.fallbackRoutings}
                </div>
                <div className="mt-0.5 text-[13px] text-muted">
                  {fallbackStats.leadsWithFallback} lead
                  {fallbackStats.leadsWithFallback === 1 ? "" : "s"}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-white px-5 py-4">
                <div className="text-[12px] font-extrabold uppercase tracking-[0.5px] text-faint">
                  Needs admin attention
                </div>
                <div className="mt-1 text-[28px] font-extrabold tracking-[-0.5px] text-navy">
                  {fallbackStats.openNeedsAdminAttention}
                </div>
                <div className="mt-0.5 text-[13px] text-muted">
                  open · {fallbackStats.needsAdminAttention} all-time flagged
                </div>
              </div>
            </>
          ) : null}
          {checkinStats ? (
            <div className="rounded-2xl border border-border bg-white px-5 py-4 sm:col-span-2">
              <div className="text-[12px] font-extrabold uppercase tracking-[0.5px] text-faint">
                Homeowner check-in ({checkinStats.windowDays}d)
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-body-secondary">
                <span>
                  <strong className="text-navy">{checkinStats.sent}</strong>{" "}
                  sent
                </span>
                <span>
                  <strong className="text-navy">{checkinStats.yes}</strong> yes
                </span>
                <span>
                  <strong className="text-navy">{checkinStats.notYet}</strong>{" "}
                  not yet
                </span>
                <span>
                  <strong className="text-navy">
                    {checkinStats.noResponse}
                  </strong>{" "}
                  no response
                </span>
                <span>
                  <strong className="text-navy">{checkinStats.optedOut}</strong>{" "}
                  opted out
                </span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="mb-4 text-sm font-semibold text-[#B42318]">{error}</p>
      ) : null}
      {loading ? (
        <p className="text-muted">Loading leads…</p>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-8 text-muted">
          No leads yet. Submit a test quote from{" "}
          <Link href="/get-a-quote/" className="font-bold text-michigan-blue">
            Get a Free Quote
          </Link>
          .
        </div>
      ) : (
        <div className="grid gap-3">
          {leads.map((lead) => (
            <article
              key={lead.id}
              className="rounded-2xl border border-border bg-white p-5 md:p-6"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold text-navy">
                    #{lead.id} · {lead.name}
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {lead.created_at} · ZIP {lead.zip} · Urgency: {lead.timing}
                    {lead.source_page ? ` · src ${lead.source_page}` : ""}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {lead.needs_admin_attention ? (
                    <span className="rounded-full bg-[#FFF1F0] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] text-[#B42318]">
                      Needs attention
                    </span>
                  ) : null}
                  <CheckinPill lead={lead} />
                  <StatusPill status={lead.status} />
                </div>
              </div>
              <div className="mb-4 grid gap-1.5 text-sm text-body-secondary md:grid-cols-2">
                <div>
                  <span className="text-faint">Service:</span> {lead.service}
                </div>
                <div>
                  <span className="text-faint">Issue:</span> {lead.issue}
                </div>
                <div>
                  <span className="text-faint">Urgency:</span> {lead.timing}
                </div>
                <div>
                  <span className="text-faint">Phone:</span>{" "}
                  {lead.phone ? (
                    <a
                      className="font-semibold text-michigan-blue"
                      href={`tel:${lead.phone}`}
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  <span className="text-faint">Email:</span>{" "}
                  {lead.email ? (
                    <a
                      className="font-semibold text-michigan-blue"
                      href={`mailto:${lead.email}`}
                    >
                      {lead.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                {lead.company_slug ? (
                  <div className="md:col-span-2">
                    <span className="text-faint">Requested company:</span>{" "}
                    <Link
                      href={`/companies/${lead.company_slug}/`}
                      className="font-semibold text-michigan-blue"
                    >
                      {lead.company_slug}
                    </Link>
                  </div>
                ) : null}
                <div className="md:col-span-2">
                  <span className="text-faint">Company notify:</span>{" "}
                  <RoutingSummary lead={lead} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["new", "contacted", "closed"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={lead.status === status}
                    onClick={() => void setStatus(lead.id, status)}
                    className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold capitalize text-navy disabled:opacity-40"
                  >
                    Mark {status}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function RoutingSummary({ lead }: { lead: LeadRow }) {
  const routings = lead.routings ?? [];
  if (routings.length > 0) {
    return (
      <span className="text-body-secondary">
        {routings.map((r, i) => (
          <span key={r.id}>
            {i > 0 ? ", " : null}
            <Link
              href={`/companies/${r.company_slug}/`}
              className="font-semibold text-michigan-blue"
            >
              {r.company_slug}
            </Link>
            <span className="text-faint">
              {" "}
              ({r.reason}
              {r.company_status ? ` · ${r.company_status}` : ""}
              {r.first_acted_at
                ? " · acted"
                : r.first_viewed_at
                  ? " · viewed"
                  : ""}
              {r.nudge_sent_at ? " · nudged" : ""}
              {r.emailed ? "" : ", send failed"})
            </span>
          </span>
        ))}
        {lead.routed_at ? (
          <span className="text-faint"> · {lead.routed_at}</span>
        ) : null}
      </span>
    );
  }

  if (lead.routed_to) {
    return (
      <span className="text-body-secondary">
        {lead.routed_to}
        {lead.routed_at ? (
          <span className="text-faint"> · {lead.routed_at}</span>
        ) : null}
      </span>
    );
  }

  if (lead.routed_at) {
    return (
      <span className="text-muted">
        None matched · {lead.routed_at}
      </span>
    );
  }

  return <span className="text-muted">Not routed</span>;
}

function CheckinPill({ lead }: { lead: LeadRow }) {
  if (lead.checkin_opt_out) {
    return (
      <span className="rounded-full bg-tag-bg px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] text-muted">
        Check-in opted out
      </span>
    );
  }
  const response = (lead.checkin_response ?? "").trim().toLowerCase();
  // Migration grandfather sentinel — hide (not "sent", not funnel noise).
  if (response === "skipped") {
    return null;
  }
  if (response === "yes") {
    const slug = lead.checkin_helped_company_slug?.trim();
    return (
      <span className="rounded-full bg-success-bg px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] text-success">
        Check-in yes{slug ? ` · ${slug}` : ""}
      </span>
    );
  }
  if (response === "not_yet") {
    return (
      <span className="rounded-full bg-[#FFF7E8] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] text-[#B54708]">
        Check-in not yet
      </span>
    );
  }
  if (lead.checkin_sent_at?.trim()) {
    return (
      <span className="rounded-full bg-[#EEF5FF] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] text-michigan-blue">
        Check-in sent
      </span>
    );
  }
  return null;
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "new"
      ? "bg-[#EEF5FF] text-michigan-blue"
      : status === "contacted"
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
