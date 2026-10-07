import type { Metadata } from "next";

/**
 * Metadata for missing dynamic entities and the global not-found page.
 * Intentionally omits alternates.canonical so 404s never inherit the
 * homepage canonical from a parent layout.
 */
export const notFoundMetadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};
