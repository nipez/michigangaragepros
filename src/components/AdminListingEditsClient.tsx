"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ListingFields } from "@/lib/listing-manage";

type EditRow = {
  id: number;
  company_slug: string;
  company_name: string | null;
  proposed: ListingFields;
  current: ListingFields;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
};

type FilterTab = "open" | "done" | "all";

const OPEN_STATUSES = new Set(["pending"]);
const DONE_STATUSES = new Set(["approved", "rejected"]);

const FIELD_LABELS: { key: keyof ListingFields; label: string }[] = [
  { key: "about", label: "About" },
  { key: "phone", label: "Phone" },
  { key: "phoneAlt", label: "Alt phone" },
  { key: "website", label: "Website" },
  { key: "address", label: "Address" },
  { key: "hours", label: "Hours" },
  { key: "emergencyHours", label: "Emergency hours" },
  { key: "services", label: "Services" },
  { key: "serviceArea", label: "Service areas" },
];

function formatValue(value: string | string[]): string {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return value.trim() || "—";
}

function valuesEqual(a: string | string[], b: string | string[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function AdminListingEditsClient({
  initiallyAuthed,
}: {
  initiallyAuthed: boolean;
}) {
  const [authed, setAuthed] = useState(initiallyAuthed);
  const [token, setToken] = useState("");
  const [edits, setEdits] = useState<EditRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(initiallyAuthed);
  const [loginBusy, setLoginBusy] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("open");
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadEdits = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/listing-edits");
      if (res.status === 401) {
        setAuthed(false);
        setEdits([]);
        return;
      }
      if (!res.ok) throw new Error("Unable to load listing edits");
      const data = (await res.json()) as { edits: EditRow[] };
      setEdits(data.edits ?? []);
      setAuthed(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load listing edits",
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
        const res = await fetch("/api/admin/listing-edits");
        if (cancelled) return;
        if (res.status === 401) {
          setAuthed(false);
          setEdits([]);
          return;
        }
        if (!res.ok) throw new Error("Unable to load listing edits");
        const data = (await res.json()) as { edits: EditRow[] };
        if (cancelled) return;
        setEdits(data.edits ?? []);
        setAuthed(true);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load listing edits",
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
      await loadEdits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthed(false);
    setEdits([]);
  };

  const setStatus = async (id: number, status: string) => {
    setError("");
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/listing-edits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error || "Unable to update edit status");
        return;
      }
      const reviewedAt =
        status === "approved" || status === "rejected"
          ? new Date().toISOString().slice(0, 19).replace("T", " ")
          : null;
      setEdits((prev) =>
        prev.map((edit) =>
          edit.id === id
            ? { ...edit, status, reviewed_at: reviewedAt }
            : edit,
        ),
      );
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    if (filter === "all") return edits;
    if (filter === "open") {
      return edits.filter((e) => OPEN_STATUSES.has(e.status));
    }
    return edits.filter((e) => DONE_STATUSES.has(e.status));
  }, [edits, filter]);

  const openCount = edits.filter((e) => OPEN_STATUSES.has(e.status)).length;
  const doneCount = edits.filter((e) => DONE_STATUSES.has(e.status)).length;

  if (!authed) {
    return (
      <div className="mx-auto max-w-[420px] px-6 py-16">
        <h1 className="mb-2 text-2xl font-extrabold text-navy">Admin login</h1>
        <p className="mb-6 text-sm text-muted">
          Enter the admin token to review company listing update requests.
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
            Listing edits
          </h1>
          <p className="mt-2 m-0 text-sm text-muted">
            Newest first · {filtered.length} shown
            {filter !== "all" ? ` (${edits.length} total)` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/claims/"
            className="btn-outline !py-2.5 !px-4 inline-flex items-center"
          >
            Claims
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
            onClick={() => void loadEdits()}
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
            { id: "all", label: `All (${edits.length})` },
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
        <p className="text-muted">Loading listing edits…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-8 text-muted">
          {edits.length === 0
            ? "No listing edit requests yet."
            : filter === "open"
              ? "No open edits. Switch to Done or All to see reviewed requests."
              : "No edits in this filter."}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((edit) => (
            <article
              key={edit.id}
              className="rounded-2xl border border-border bg-white p-5 md:p-6"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold text-navy">
                    #{edit.id} · {edit.company_name || edit.company_slug}
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {edit.created_at} ·{" "}
                    <Link
                      href={`/companies/${edit.company_slug}/`}
                      className="font-semibold text-michigan-blue"
                    >
                      {edit.company_slug}
                    </Link>
                  </div>
                </div>
                <StatusPill status={edit.status} />
              </div>

              <div className="mb-4 overflow-x-auto rounded-[12px] border border-border">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-bg text-[12px] font-extrabold uppercase tracking-[0.4px] text-faint">
                      <th className="px-3 py-2.5">Field</th>
                      <th className="px-3 py-2.5">Current</th>
                      <th className="px-3 py-2.5">Proposed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FIELD_LABELS.map(({ key, label }) => {
                      const cur = edit.current[key];
                      const prop = edit.proposed[key];
                      const changed = !valuesEqual(cur, prop);
                      return (
                        <tr
                          key={key}
                          className={
                            changed
                              ? "border-t border-border bg-[#FFFBEB]"
                              : "border-t border-border"
                          }
                        >
                          <td className="px-3 py-2.5 align-top font-bold text-navy">
                            {label}
                            {changed ? (
                              <span className="ml-1.5 text-[10px] font-extrabold uppercase text-[#B54708]">
                                changed
                              </span>
                            ) : null}
                          </td>
                          <td className="px-3 py-2.5 align-top text-body-secondary whitespace-pre-wrap">
                            {formatValue(cur)}
                          </td>
                          <td className="px-3 py-2.5 align-top font-semibold text-navy whitespace-pre-wrap">
                            {formatValue(prop)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {edit.reviewed_at ? (
                <div className="mb-3 text-sm text-muted">
                  Reviewed: {edit.reviewed_at}
                  {edit.review_notes ? ` · ${edit.review_notes}` : ""}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {OPEN_STATUSES.has(edit.status) ? (
                  <>
                    <button
                      type="button"
                      disabled={busyId === edit.id}
                      onClick={() => void setStatus(edit.id, "approved")}
                      className="rounded-[10px] border border-border bg-success-bg px-3 py-2 text-xs font-bold text-success disabled:opacity-40"
                    >
                      Approve &amp; apply
                    </button>
                    <button
                      type="button"
                      disabled={busyId === edit.id}
                      onClick={() => void setStatus(edit.id, "rejected")}
                      className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold text-navy disabled:opacity-40"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={busyId === edit.id}
                    onClick={() => void setStatus(edit.id, "pending")}
                    className="rounded-[10px] border border-border bg-bg px-3 py-2 text-xs font-bold capitalize text-navy disabled:opacity-40"
                  >
                    Reopen
                  </button>
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
    status === "pending"
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
