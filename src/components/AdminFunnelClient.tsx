"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ClaimFunnelReport } from "@/lib/claim-funnel";
import type { QuoteFunnelReport } from "@/lib/quote-funnel";

type FunnelPayload = QuoteFunnelReport & {
  claimFunnel?: ClaimFunnelReport | null;
};

function pct(rate: number | null): string {
  if (rate == null) return "—";
  return `${(rate * 100).toFixed(1)}%`;
}

function sourceLabel(source: string): string {
  switch (source) {
    case "city":
      return "City hubs";
    case "city_service":
      return "City × service";
    case "company":
      return "Company listings";
    case "cost":
      return "Cost guides";
    case "service":
      return "Service pages";
    case "pros":
      return "Find Pros";
    case "home":
      return "Homepage";
    default:
      return source || "Other";
  }
}

export function AdminFunnelClient({
  initiallyAuthed,
}: {
  initiallyAuthed: boolean;
}) {
  const [authed, setAuthed] = useState(initiallyAuthed);
  const [token, setToken] = useState("");
  const [report, setReport] = useState<FunnelPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(initiallyAuthed);
  const [loginBusy, setLoginBusy] = useState(false);
  const [days, setDays] = useState(30);

  const load = async (windowDays = days) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/funnel/?days=${windowDays}`);
      if (res.status === 401) {
        setAuthed(false);
        setReport(null);
        return;
      }
      if (!res.ok) throw new Error("Unable to load funnel stats");
      const data = (await res.json()) as FunnelPayload;
      setReport(data);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load funnel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initiallyAuthed) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`/api/admin/funnel/?days=${days}`);
        if (cancelled) return;
        if (res.status === 401) {
          setAuthed(false);
          setReport(null);
          return;
        }
        if (!res.ok) throw new Error("Unable to load funnel stats");
        const data = (await res.json()) as FunnelPayload;
        if (cancelled) return;
        setReport(data);
        setAuthed(true);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load funnel",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial auth load only
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
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthed(false);
    setReport(null);
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-[420px] px-6 py-16">
        <h1 className="mb-2 text-2xl font-extrabold text-navy">Admin login</h1>
        <p className="mb-6 text-sm text-muted">
          Enter the admin token to view quote funnel conversion.
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

  const totals = report?.totals;
  const claim = report?.claimFunnel;

  return (
    <div className="container-site py-10 pb-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-[1px] text-michigan-blue">
            Admin
          </div>
          <h1 className="m-0 text-[clamp(26px,3vw,34px)] font-extrabold tracking-[-0.7px] text-navy">
            Growth funnels
          </h1>
          <p className="mt-2 m-0 text-sm text-muted">
            Privacy-light first-party counters · quote + claim acquisition
            {report
              ? ` · ${report.startDay} → ${report.endDay} (${report.windowDays}d)`
              : ""}
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
            Claims
          </Link>
          <select
            className="rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm font-bold text-navy"
            value={days}
            onChange={(e) => {
              const next = Number(e.target.value) || 30;
              setDays(next);
              void load(next);
            }}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            type="button"
            className="btn-outline !py-2.5 !px-4"
            onClick={() => void load()}
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

      {error ? (
        <p className="mb-4 text-sm font-semibold text-[#B42318]">{error}</p>
      ) : null}
      {loading ? (
        <p className="text-muted">Loading funnel…</p>
      ) : !totals ? (
        <p className="text-muted">No funnel data yet.</p>
      ) : (
        <>
          <h2 className="mb-3 text-lg font-extrabold text-navy">
            Claim acquisition (/for-companies/)
          </h2>
          {claim ? (
            <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Page views" value={claim.totals.views} />
              <StatCard
                label="Searches"
                value={claim.totals.searches}
                hint={pct(claim.viewToSearchRate)}
              />
              <StatCard
                label="Claim starts"
                value={claim.totals.starts}
                hint={pct(claim.viewToStartRate)}
              />
              <StatCard
                label="Claim submits"
                value={claim.totals.submits}
                hint={pct(claim.startToSubmitRate)}
              />
            </div>
          ) : (
            <p className="mb-8 text-sm text-muted">
              Claim funnel table not available yet — apply migration 0033.
            </p>
          )}

          <h2 className="mb-3 text-lg font-extrabold text-navy">
            Quote funnel
          </h2>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Form views" value={totals.views} />
            <StatCard
              label="Starts"
              value={totals.starts}
              hint={pct(
                totals.views > 0 ? totals.starts / totals.views : null,
              )}
            />
            <StatCard
              label="Submits"
              value={totals.submits}
              hint={pct(
                totals.views > 0 ? totals.submits / totals.views : null,
              )}
            />
          </div>

          {report?.leadRouting ? (
            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <StatCard
                label={`Fallback routings (${report.leadRouting.leadsWithFallback} leads)`}
                value={report.leadRouting.fallbackRoutings}
              />
              <StatCard
                label="Needs admin (open)"
                value={report.leadRouting.openNeedsAdminAttention}
              />
              <StatCard
                label="Needs admin (all)"
                value={report.leadRouting.needsAdminAttention}
              />
            </div>
          ) : null}

          <div className="overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="px-4 py-3 font-extrabold text-navy">Source</th>
                  <th className="px-4 py-3 font-extrabold text-navy">Views</th>
                  <th className="px-4 py-3 font-extrabold text-navy">Starts</th>
                  <th className="px-4 py-3 font-extrabold text-navy">Submits</th>
                  <th className="px-4 py-3 font-extrabold text-navy">
                    View → submit
                  </th>
                </tr>
              </thead>
              <tbody>
                {(report?.bySource ?? []).length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-muted"
                    >
                      No events in this window yet. Open contextual quote CTAs
                      and complete a test submit to populate rows.
                    </td>
                  </tr>
                ) : (
                  (report?.bySource ?? []).map((row) => (
                    <tr
                      key={row.sourcePage}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 font-semibold text-navy">
                        {sourceLabel(row.sourcePage)}
                      </td>
                      <td className="px-4 py-3 text-body-secondary">
                        {row.views}
                      </td>
                      <td className="px-4 py-3 text-body-secondary">
                        {row.starts}
                        <span className="ml-1.5 text-faint">
                          ({pct(row.viewToStartRate)})
                        </span>
                      </td>
                      <td className="px-4 py-3 text-body-secondary">
                        {row.submits}
                      </td>
                      <td className="px-4 py-3 font-bold text-navy">
                        {pct(row.viewToSubmitRate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[13px] text-muted">
            Counters ignore known bots, store no PII, and do not use third-party
            trackers. Quote submits also set{" "}
            <code className="text-[12px]">leads.source_page</code>. Claim
            counters come from{" "}
            <code className="text-[12px]">claim_funnel_daily</code>.
          </p>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-4">
      <div className="text-[12px] font-extrabold uppercase tracking-[0.5px] text-faint">
        {label}
      </div>
      <div className="mt-1 text-[28px] font-extrabold tracking-[-0.5px] text-navy">
        {value}
      </div>
      {hint && hint !== "—" ? (
        <div className="mt-0.5 text-[13px] text-muted">{hint} of views</div>
      ) : null}
    </div>
  );
}
