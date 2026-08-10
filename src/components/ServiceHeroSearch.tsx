"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type ServiceHeroSearchProps = {
  serviceName: string;
  findLabel: string;
};

export function ServiceHeroSearch({
  serviceName,
  findLabel,
}: ServiceHeroSearchProps) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const canSearch = !!location.trim();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSearch) return;
    const params = new URLSearchParams();
    params.set("q", location.trim());
    params.set("service", serviceName);
    router.push(`/pros/?${params.toString()}`);
  };

  return (
    <div className="max-w-[640px] rounded-[14px] bg-white p-4 shadow-[0_24px_60px_rgba(4,16,28,0.45)]">
      <form data-form-row="1" className="flex gap-2.5" onSubmit={submit}>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="ZIP code or city"
          className="field-input flex-1"
          autoComplete="postal-code"
        />
        <button
          type="submit"
          disabled={!canSearch}
          className="flex h-[50px] shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] border-none px-[26px] text-[15px] font-extrabold text-white transition-colors"
          style={{
            background: canSearch ? "#2F80ED" : "#B9CDDE",
            cursor: canSearch ? "pointer" : "default",
          }}
        >
          {findLabel}
        </button>
      </form>
      <p className="mt-3 mb-0 text-[13px] font-semibold text-muted">
        See local companies near you — no quote form required.{" "}
        <a
          href={`/get-a-quote/?service=${encodeURIComponent(serviceName)}`}
          className="font-bold text-michigan-blue hover:underline"
        >
          Or get matched quotes →
        </a>
      </p>
    </div>
  );
}
