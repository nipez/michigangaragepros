"use client";

import { useMemo, useState } from "react";
import { Stars } from "@/components/Icons";
import {
  MAX_OWNER_REPLY,
  type ManageReview,
  type OwnerReplyStatus,
} from "@/lib/review-replies";

type Props = {
  token: string;
  companyName: string;
  initialReviews: ManageReview[];
};

function replyStatusLabel(status: OwnerReplyStatus | null): string {
  if (!status) return "No reply";
  switch (status) {
    case "pending":
      return "Reply pending approval";
    case "visible":
      return "Reply live";
    case "hidden":
      return "Reply hidden";
    default:
      return status;
  }
}

function replyPillClass(status: OwnerReplyStatus | null): string {
  if (!status) return "bg-tag-bg text-muted";
  switch (status) {
    case "pending":
      return "bg-[#EEF5FF] text-michigan-blue";
    case "visible":
      return "bg-success-bg text-success";
    case "hidden":
      return "bg-tag-bg text-muted";
    default:
      return "bg-tag-bg text-muted";
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : `${iso}Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CompanyReviewReplies({
  token,
  companyName,
  initialReviews,
}: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [drafts, setDrafts] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    for (const r of initialReviews) {
      init[r.id] = r.ownerReply ?? "";
    }
    return init;
  });
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const pendingCount = useMemo(
    () => reviews.filter((r) => r.ownerReplyStatus === "pending").length,
    [reviews],
  );

  const saveReply = async (reviewId: number) => {
    setError("");
    setNote("");
    setBusyId(reviewId);
    try {
      const res = await fetch(`/api/manage/${token}/reviews/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId,
          body: drafts[reviewId] ?? "",
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
        review?: ManageReview;
      } | null;
      if (!res.ok || !data?.review) {
        setError(data?.error || "Unable to save reply");
        return;
      }
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? data.review! : r)),
      );
      setDrafts((prev) => ({
        ...prev,
        [reviewId]: data.review!.ownerReply ?? "",
      }));
      setEditingId(null);
      setNote(
        data.message ||
          "Reply submitted for review. It appears after approval.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const removeReply = async (reviewId: number) => {
    setError("");
    setNote("");
    setBusyId(reviewId);
    try {
      const res = await fetch(`/api/manage/${token}/reviews/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        review?: ManageReview;
      } | null;
      if (!res.ok || !data?.review) {
        setError(data?.error || "Unable to remove reply");
        return;
      }
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? data.review! : r)),
      );
      setDrafts((prev) => ({ ...prev, [reviewId]: "" }));
      setEditingId(null);
      setNote("Reply removed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="rounded-[12px] border border-border bg-bg px-4 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-[13px] font-extrabold uppercase tracking-[0.6px] text-navy">
          Review replies
        </div>
        <div className="text-[12px] text-muted">
          {reviews.length} approved
          {pendingCount ? ` · ${pendingCount} reply pending` : ""}
        </div>
      </div>
      <p className="mt-1.5 mb-3 text-[13px] leading-[1.5] text-muted">
        Respond publicly to approved reviews of {companyName}. One reply per
        review — replies are moderated before they appear on your profile.
      </p>

      {error ? (
        <p className="mb-3 text-sm font-semibold text-[#B42318]">{error}</p>
      ) : null}
      {note ? (
        <p className="mb-3 text-[13px] font-semibold text-success">{note}</p>
      ) : null}

      {reviews.length === 0 ? (
        <p className="m-0 text-[13.5px] text-muted">
          No approved reviews yet. Share your review-request link so customers
          can leave feedback.
        </p>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0">
          {reviews.map((review) => {
            const isEditing =
              editingId === review.id || !review.ownerReplyStatus;
            const draft = drafts[review.id] ?? "";
            return (
              <li
                key={review.id}
                className="rounded-[10px] border border-border bg-white px-3.5 py-3.5"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Stars rating={review.rating} className="text-[13px]" />
                    <span className="text-[14px] font-extrabold text-navy">
                      {review.authorName}
                    </span>
                    <span className="text-[12px] font-semibold text-faint">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.3px] ${replyPillClass(review.ownerReplyStatus)}`}
                  >
                    {replyStatusLabel(review.ownerReplyStatus)}
                  </span>
                </div>
                <p className="m-0 mb-3 text-[13.5px] leading-[1.55] text-body-secondary text-pretty">
                  {review.body}
                </p>

                {isEditing ? (
                  <div>
                    <label className="block">
                      <span className="mb-1.5 block text-[12.5px] font-bold text-navy">
                        Your reply
                      </span>
                      <textarea
                        className="field-input min-h-[88px] !h-auto resize-y py-2.5 text-[13.5px]"
                        value={draft}
                        maxLength={MAX_OWNER_REPLY}
                        placeholder="Thank the reviewer and address their experience…"
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [review.id]: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11.5px] font-semibold text-faint">
                        {draft.trim().length}/{MAX_OWNER_REPLY} · edits go back
                        to pending
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {review.ownerReplyStatus ? (
                          <button
                            type="button"
                            className="btn-outline !px-3 !py-1.5 !text-[12.5px]"
                            disabled={busyId === review.id}
                            onClick={() => {
                              setDrafts((prev) => ({
                                ...prev,
                                [review.id]: review.ownerReply ?? "",
                              }));
                              setEditingId(null);
                            }}
                          >
                            Cancel
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="btn-primary !rounded-[10px] !px-3.5 !py-1.5 !text-[12.5px]"
                          disabled={
                            busyId === review.id || draft.trim().length < 2
                          }
                          onClick={() => void saveReply(review.id)}
                        >
                          {busyId === review.id
                            ? "Saving…"
                            : review.ownerReplyStatus
                              ? "Update reply"
                              : "Post reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[8px] border border-border bg-bg px-3 py-2.5">
                    <div className="mb-1 text-[11.5px] font-extrabold uppercase tracking-[0.4px] text-muted">
                      Your response
                      {review.ownerReplyAt
                        ? ` · ${formatDate(review.ownerReplyAt)}`
                        : ""}
                    </div>
                    <p className="m-0 text-[13.5px] leading-[1.55] text-navy text-pretty">
                      {review.ownerReply}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-outline !px-3 !py-1.5 !text-[12.5px]"
                        disabled={busyId === review.id}
                        onClick={() => {
                          setDrafts((prev) => ({
                            ...prev,
                            [review.id]: review.ownerReply ?? "",
                          }));
                          setEditingId(review.id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-outline !px-3 !py-1.5 !text-[12.5px]"
                        disabled={busyId === review.id}
                        onClick={() => void removeReply(review.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
