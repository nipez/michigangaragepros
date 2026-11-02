"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  COMPANY_LEAD_STATUSES,
  COMPANY_LEAD_STATUS_LABELS,
  summarizeCompanyLeads,
  type CompanyLead,
  type CompanyLeadStatus,
  type CompanyLeadTotals,
} from "@/lib/company-leads";

type Props = {
  token: string;
  companyName: string;
  companySlug: string;
  companyCity: string;
  featured: boolean;
  reviewUrl: string | null;
  initialLeads: CompanyLead[];
  initialTotals: CompanyLeadTotals;
};

function statusPillClass(status: CompanyLeadStatus): string {
  switch (status) {
    case "new":
      return "bg-[#EEF5FF] text-michigan-blue";
    case "contacted":
      return "bg-[#EEF8F1] text-success";
    case "quoted":
      return "bg-[#FFF6E8] text-[#9A6700]";
    case "won":
      return "bg-success-bg text-success";
    case "lost":
      return "bg-tag-bg text-muted";
    default:
      return "bg-tag-bg text-muted";
  }
}

export function CompanyLeadInbox({
  token,
  companyName,
  companySlug,
  companyCity,
  featured,
  reviewUrl,
  initialLeads,
  initialTotals,
}: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<CompanyLeadStatus | "all">("all");

  const totals = useMemo(
    () => (leads === initialLeads ? initialTotals : summarizeCompanyLeads(leads)),
    [leads, initialLeads, initialTotals],
  );

  const visible = useMemo(() => {
    if (filter === "all") return leads;
    return leads.filter((l) => l.companyStatus === filter);
  }, [leads, filter]);

  const featuredHref = `/for-companies/?company=${encodeURIComponent(companyName)}&city=${encodeURIComponent(companyCity)}&slug=${encodeURIComponent(companySlug)}#featured`;

  const setStatus = async (routingId: number, status: CompanyLeadStatus) => {
    setError("");
    setBusyId(routingId);
    try {
      const res = await fetch(`/api/manage/${token}/leads/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routingId, status }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        lead?: CompanyLead;
      } | null;
      if (!res.ok || !data?.lead) {
        setError(data?.error || "Unable to update lead status");
        return;
      }
      setLeads((prev) =>
        prev.map((lead) =>
          lead.routingId === routingId ? data.lead! : lead,
        ),
      );
    } finally {
      setBusyId(null);
    }
  };

  const copyReviewLink = async () => {
    if (!reviewUrl) return;
    try {
      await navigator.clipboard.writeText(reviewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy review link — copy it from the section below.");
    }
  };

  return (
    <div className="rounded-[12px] border border-border bg-bg px-4 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-[13px] font-extrabold uppercase tracking-[0.6px] text-navy">
          Lead inbox
        </div>
        <div className="text-[12px] text-muted">
          {totals.total} routed
          {totals.byStatus.new ? ` · ${totals.byStatus.new} new` : ""}
        </div>
      </div>
      <p className="mt-1.5 mb-3 text-[13px] leading-[1.5] text-muted">
        Homeowner requests routed to {companyName}. Only leads matched to your
        listing appear here — contact info is shared under the quote form
        consent.
      </p>

      {totals.total > 0 ? (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(
            [
              ["all", totals.total],
              ...COMPANY_LEAD_STATUSES.map(
                (s) => [s, totals.byStatus[s]] as const,
              ),
            ] as const
          ).map(([key, count]) => {
            const active = filter === key;
            const label =
              key === "all"
                ? "All"
                : COMPANY_LEAD_STATUS_LABELS[key as CompanyLeadStatus];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-[8px] border px-2.5 py-1 text-[12px] font-bold ${
                  active
                    ? "border-michigan-blue bg-[#EEF5FF] text-michigan-blue"
                    : "border-border bg-white text-navy"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      ) : null}

      {error ? (
        <p className="mb-3 text-[13px] font-semibold text-[#B42318]">{error}</p>
      ) : null}

      {visible.length === 0 ? (
        <div className="rounded-[10px] border border-border bg-white px-3.5 py-4 text-[13.5px] text-muted">
          {leads.length === 0
            ? "No leads routed yet. When a homeowner request matches your listing, it will show up here."
            : "No leads in this status."}
        </div>
      ) : (
        <div className="grid gap-2.5">
          {visible.map((lead) => (
            <article
              key={lead.routingId}
              className="rounded-[10px] border border-border bg-white px-3.5 py-3"
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-[15px] font-extrabold text-navy">
                    {lead.name}
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-muted">
                    {lead.createdAt}
                    {lead.city ? ` · ${lead.city}` : ""}
                    {lead.zip ? ` · ZIP ${lead.zip}` : ""}
                    {lead.timing ? ` · ${lead.timing}` : ""}
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.4px] ${statusPillClass(lead.companyStatus)}`}
                >
                  {COMPANY_LEAD_STATUS_LABELS[lead.companyStatus]}
                </span>
              </div>

              <div className="mb-2.5 grid gap-1 text-[13px] text-body-secondary">
                <div>
                  <span className="text-faint">Service:</span> {lead.service}
                </div>
                {lead.issue ? (
                  <div>
                    <span className="text-faint">Message:</span> {lead.issue}
                  </div>
                ) : null}
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
              </div>

              <div className="flex flex-wrap gap-1.5">
                {COMPANY_LEAD_STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={
                      busyId === lead.routingId ||
                      lead.companyStatus === status
                    }
                    onClick={() => void setStatus(lead.routingId, status)}
                    className="rounded-[8px] border border-border bg-bg px-2.5 py-1.5 text-[11.5px] font-bold capitalize text-navy disabled:opacity-40"
                  >
                    {COMPANY_LEAD_STATUS_LABELS[status]}
                  </button>
                ))}
              </div>

              {lead.companyStatus === "won" ? (
                <div className="mt-3 rounded-[10px] border border-[#B6D4FE] bg-[#EEF5FF] px-3 py-2.5">
                  <div className="text-[13px] font-extrabold text-navy">
                    Ask for a review
                  </div>
                  <p className="mt-1 mb-2 text-[12.5px] leading-[1.5] text-muted">
                    Nice win — send your review-request link so they can leave
                    feedback on your public profile.
                  </p>
                  {reviewUrl ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-outline !px-3 !py-1.5 !text-[12.5px]"
                        onClick={() => void copyReviewLink()}
                      >
                        {copied ? "Copied" : "Copy review link"}
                      </button>
                      <a
                        href={reviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline !px-3 !py-1.5 !text-[12.5px] inline-flex items-center"
                      >
                        Open link
                      </a>
                    </div>
                  ) : (
                    <p className="m-0 text-[12.5px] text-muted">
                      Issue a review link in the section below, then share it.
                    </p>
                  )}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}

      {!featured && totals.total > 0 ? (
        <div className="mt-4 rounded-[12px] border border-[#B6D4FE] bg-[#EEF5FF] px-3.5 py-3.5">
          <div className="text-[14px] font-extrabold text-navy">
            Turn these visits into more jobs
          </div>
          <p className="mt-1 mb-0 text-[13px] leading-[1.5] text-muted">
            Featured Pros sit at the top of city results with a Sponsored badge
            — checkout uses the same Stripe plans as{" "}
            <Link
              href={featuredHref}
              className="font-semibold text-michigan-blue hover:underline"
            >
              For companies
            </Link>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
