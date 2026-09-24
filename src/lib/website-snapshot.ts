/**
 * Client-side website preview image via Microlink screenshot embed.
 * Loaded by the browser (not at build time) so static company pages stay fast.
 * Uses Microlink's public screenshot URL — no API key required.
 */
export function websiteSnapshotUrl(website: string): string {
  const params = new URLSearchParams({
    url: website,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
  });
  return `https://api.microlink.io/?${params.toString()}`;
}
