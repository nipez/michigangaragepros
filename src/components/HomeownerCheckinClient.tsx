"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";

export type CheckinCompanyOption = {
  companySlug: string;
  companyName: string;
};

type Mode =
  | { kind: "yes-pick"; token: string; companies: CheckinCompanyOption[] }
  | {
      kind: "done";
      title: string;
      body: string;
      reviewUrl?: string | null;
      companyName?: string | null;
    }
  | { kind: "error"; title: string; body: string };

export function HomeownerCheckinClient({ initial }: { initial: Mode }) {
  const [mode, setMode] = useState<Mode>(initial);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState(
    initial.kind === "yes-pick" && initial.companies.length === 1
      ? initial.companies[0]!.companySlug
      : "",
  );

  const submitYes = async () => {
    if (mode.kind !== "yes-pick") return;
    if (!selected.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/check-in/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: mode.token, companySlug: selected }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        reviewUrl?: string | null;
        companyName?: string | null;
        alreadyResponded?: boolean;
      } | null;
      if (!res.ok) {
        setMode({
          kind: "error",
          title: "Unable to save",
          body: data?.error || "Something went wrong. Please try again.",
        });
        return;
      }
      setMode({
        kind: "done",
        title: data?.alreadyResponded
          ? "Already recorded"
          : "Glad you're set",
        body: data?.companyName
          ? `Thanks — we noted that ${data.companyName} helped you.`
          : "Thanks — we noted that a pro helped you.",
        reviewUrl: data?.reviewUrl ?? null,
        companyName: data?.companyName ?? null,
      });
    } catch {
      setMode({
        kind: "error",
        title: "Unable to save",
        body: "Something went wrong. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  if (mode.kind === "error") {
    return (
      <CheckinShell title={mode.title}>
        <p className="m-0 text-[15px] leading-relaxed text-body-secondary">
          {mode.body}
        </p>
        <HomeLink />
      </CheckinShell>
    );
  }

  if (mode.kind === "done") {
    return (
      <CheckinShell title={mode.title}>
        <p className="m-0 text-[15px] leading-relaxed text-body-secondary">
          {mode.body}
        </p>
        {mode.reviewUrl ? (
          <p className="mt-5 mb-0">
            <a href={mode.reviewUrl} className="btn-primary inline-flex !py-3">
              Leave a quick review
              {mode.companyName ? ` for ${mode.companyName}` : ""}
            </a>
          </p>
        ) : null}
        <HomeLink />
      </CheckinShell>
    );
  }

  return (
    <CheckinShell title="Who helped you?">
      <p className="m-0 mb-5 text-[15px] leading-relaxed text-body-secondary">
        Pick the garage door company that got in touch. We&apos;ll invite you
        to leave a review for them.
      </p>
      <div className="grid gap-2.5">
        {mode.companies.map((c) => (
          <label
            key={c.companySlug}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
              selected === c.companySlug
                ? "border-michigan-blue bg-[#EEF5FF]"
                : "border-border bg-white"
            }`}
          >
            <input
              type="radio"
              name="company"
              value={c.companySlug}
              checked={selected === c.companySlug}
              onChange={() => setSelected(c.companySlug)}
            />
            <span className="font-bold text-navy">{c.companyName}</span>
          </label>
        ))}
      </div>
      <button
        type="button"
        className="btn-primary mt-5 w-full !py-3"
        disabled={!selected.trim() || busy}
        onClick={() => void submitYes()}
      >
        {busy ? "Saving…" : "Yes, I'm set"}
      </button>
      <HomeLink />
    </CheckinShell>
  );
}

function CheckinShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[440px] px-6 py-16">
      <div className="mb-2 text-[12.5px] font-extrabold uppercase tracking-[1px] text-michigan-blue">
        Michigan Garage Pros
      </div>
      <h1 className="m-0 mb-4 text-[clamp(24px,4vw,30px)] font-extrabold tracking-[-0.6px] text-navy">
        {title}
      </h1>
      {children}
    </div>
  );
}

function HomeLink() {
  return (
    <p className="mt-6 mb-0 text-sm text-muted">
      <Link href="/" className="font-bold text-michigan-blue">
        Back to Michigan Garage Pros
      </Link>
    </p>
  );
}
