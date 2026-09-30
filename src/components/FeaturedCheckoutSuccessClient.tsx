"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CompactFooter } from "@/components/Footer";
import { Header } from "@/components/Header";

type VerifyState =
  | { kind: "loading" }
  | { kind: "ok"; status: string | null; featured: boolean; slug: string | null }
  | { kind: "pending" }
  | { kind: "error"; message: string };

function initialState(sessionId: string): VerifyState {
  if (!sessionId) {
    return {
      kind: "error",
      message:
        "Missing checkout session. If you paid, email us and we’ll activate Featured.",
    };
  }
  return { kind: "loading" };
}

export function FeaturedCheckoutSuccessClient({
  sessionId,
}: {
  sessionId: string;
}) {
  const [state, setState] = useState<VerifyState>(() =>
    initialState(sessionId),
  );

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/featured/checkout/verify/?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          status?: string | null;
          featured_updated?: boolean;
          company_slug?: string | null;
          payment_status?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setState({
            kind: "error",
            message:
              data.error ||
              "We couldn’t confirm payment yet. If you were charged, Featured will activate shortly.",
          });
          return;
        }
        if (
          data.payment_status &&
          data.payment_status !== "paid" &&
          data.payment_status !== "no_payment_required"
        ) {
          setState({ kind: "pending" });
          return;
        }
        setState({
          kind: "ok",
          status: data.status ?? null,
          featured: Boolean(data.featured_updated) || data.status === "won",
          slug: data.company_slug ?? null,
        });
      } catch {
        if (!cancelled) {
          setState({
            kind: "error",
            message:
              "Payment may still be processing. We’ll email you when Featured is live.",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <>
      <Header active="for-companies" claimHref="/for-companies/#claim" />
      <main className="container-site py-16 sm:py-20">
        <div className="mx-auto max-w-[560px] rounded-[20px] border border-border bg-white p-8 text-navy shadow-[0_12px_40px_rgba(15,40,70,0.06)]">
          <div className="mb-2 text-[13px] font-extrabold tracking-[1.5px] text-bright-blue uppercase">
            Featured Checkout
          </div>
          <h1 className="mb-3 text-[clamp(26px,3vw,34px)] font-extrabold tracking-[-0.6px]">
            {state.kind === "loading"
              ? "Confirming your payment…"
              : state.kind === "pending"
                ? "Payment still processing"
                : state.kind === "error"
                  ? "Thanks — we’re on it"
                  : state.featured
                    ? "You’re Featured"
                    : "Payment received"}
          </h1>
          <p className="m-0 text-[15.5px] leading-[1.6] text-muted">
            {state.kind === "loading"
              ? "Hang tight while we verify your Stripe Checkout session."
              : state.kind === "pending"
                ? "Stripe hasn’t marked this session paid yet. Featured will turn on automatically when payment clears."
                : state.kind === "error"
                  ? state.message
                  : state.featured
                    ? "Your Sponsored badge is active on Michigan Garage Pros. Keep an eye on your email for the Stripe receipt and subscription details."
                    : "Thanks for subscribing. If your listing slug wasn’t linked yet, we’ll finish activating Featured on your company page shortly."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {state.kind === "ok" && state.slug ? (
              <Link
                href={`/companies/${state.slug}/`}
                className="inline-flex rounded-[10px] bg-bright-blue px-5 py-3 text-[14px] font-extrabold text-white hover:bg-michigan-blue"
              >
                View your listing →
              </Link>
            ) : null}
            <Link
              href="/for-companies/"
              className="inline-flex rounded-[10px] border border-border bg-bg px-5 py-3 text-[14px] font-bold text-navy hover:border-bright-blue"
            >
              Back to For Companies
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-[10px] border border-transparent px-5 py-3 text-[14px] font-bold text-michigan-blue hover:underline"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
      <CompactFooter />
    </>
  );
}
