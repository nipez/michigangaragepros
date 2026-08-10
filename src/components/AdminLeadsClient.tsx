"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  matched_company_name: string | null;
  status: string;
  notify_status: string | null;
  notified_at: string | null;
  created_at: string;
};

export function AdminLeadsClient({ initiallyAuthed }: { initiallyAuthed: boolean }) {
  const [authed, setAuthed] = useState(initiallyAuthed);
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(initiallyAuthed);
  const [loginBusy, setLoginBusy] = useState(false);

  const loadLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads");
      if (res.status === 401) {
        setAuthed(false);
        setLeads([]);
        return;
      }
      if (!res.ok) throw new Error("Unable to load leads");
      const data = (await res.json()) as { leads: LeadRow[] };
      setLeads(data.leads ?? []);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initiallyAuthed) void loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
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
        <div className="flex gap-2.5">
          <button type="button" className="btn-outline !py-2.5 !px-4" onClick={() => void loadLeads()}>
            Refresh
          </button>
          <button type="button" className="btn-outline !py-2.5 !px-4" onClick={() => void logout()}>
            Sign out
          </button>
        </div>
      </div>

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
                    {lead.created_at} · ZIP {lead.zip} · {lead.timing}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill status={lead.status} />
                  <NotifyPill status={lead.notify_status} />
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
                  <span className="text-faint">Phone:</span>{" "}
                  {lead.phone ? (
                    <a className="font-semibold text-michigan-blue" href={`tel:${lead.phone}`}>
                      {lead.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  <span className="text-faint">Email:</span>{" "}
                  {lead.email ? (
                    <a className="font-semibold text-michigan-blue" href={`mailto:${lead.email}`}>
                      {lead.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                {(lead.matched_company_name || lead.company_slug) && (
                  <div className="md:col-span-2">
                    <span className="text-faint">Requested company:</span>{" "}
                    {lead.company_slug ? (
                      <Link
                        href={`/companies/${lead.company_slug}/`}
                        className="font-semibold text-michigan-blue"
                      >
                        {lead.matched_company_name || lead.company_slug}
                      </Link>
                    ) : (
                      lead.matched_company_name
                    )}
                  </div>
                )}
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

function StatusPill({ status }: { status: string }) {
  const color =
    status === "new"
      ? "bg-[#EEF5FF] text-michigan-blue"
      : status === "contacted"
        ? "bg-success-bg text-success"
        : "bg-tag-bg text-muted";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] ${color}`}>
      {status}
    </span>
  );
}

function NotifyPill({ status }: { status: string | null }) {
  const label = status || "unknown";
  const color =
    status === "sent"
      ? "bg-success-bg text-success"
      : status === "failed"
        ? "bg-[#FDECEC] text-[#B42318]"
        : "bg-tag-bg text-muted";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] ${color}`}>
      notify: {label}
    </span>
  );
}
