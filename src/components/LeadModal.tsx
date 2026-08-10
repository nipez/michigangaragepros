"use client";

import { LeadForm } from "./LeadForm";
import type { Lead } from "@/lib/lead";

type LeadModalProps = {
  open: boolean;
  onClose: () => void;
  initialLead?: Partial<Lead>;
  initialStep?: number;
};

export function LeadModal({
  open,
  onClose,
  initialLead,
  initialStep = 1,
}: LeadModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[rgba(12,33,53,0.55)] p-5 backdrop-blur-[3px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Get a free quote"
    >
      <div className="relative max-h-[90vh] w-full max-w-[520px] overflow-auto rounded-[18px] bg-white p-8">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-[34px] place-items-center rounded-[10px] border-none bg-tag-bg text-base text-muted transition-colors hover:bg-border"
        >
          ✕
        </button>
        <LeadForm
          key={`${initialStep}-${initialLead?.service ?? ""}-${initialLead?.zip ?? ""}`}
          variant="modal"
          initialLead={initialLead}
          initialStep={initialStep}
          onDoneClose={onClose}
        />
      </div>
    </div>
  );
}
