"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SERVICE_OPTIONS } from "@/data/site";

type ProsSearchFormProps = {
  initialQuery?: string;
  initialService?: string;
  /** Compact variant for the results page header. */
  compact?: boolean;
};

export function ProsSearchForm({
  initialQuery = "",
  initialService = "",
  compact = false,
}: ProsSearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [service, setService] = useState(initialService);

  const canSearch = !!query.trim();

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSearch) return;
    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (service) params.set("service", service);
    router.push(`/pros/?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className={
        compact
          ? "flex flex-col gap-3 sm:flex-row sm:items-end"
          : "flex flex-col gap-3"
      }
    >
      <label className="block flex-[1.2]">
        <span className="mb-[7px] block text-[13px] font-bold text-navy">
          What do you need help with?
        </span>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="field-input cursor-pointer"
        >
          <option value="">Any service</option>
          {SERVICE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
      <label className="block flex-1">
        <span className="mb-[7px] block text-[13px] font-bold text-navy">
          ZIP code or city
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 49503 or Grand Rapids"
          className="field-input"
          autoComplete="postal-code"
          inputMode="text"
        />
      </label>
      <button
        type="submit"
        disabled={!canSearch}
        className="h-[50px] shrink-0 rounded-[10px] border-none px-[26px] text-[15px] font-extrabold text-white transition-colors"
        style={{
          background: canSearch ? "#2F80ED" : "#B9CDDE",
          cursor: canSearch ? "pointer" : "default",
        }}
      >
        Find Pros →
      </button>
    </form>
  );
}
