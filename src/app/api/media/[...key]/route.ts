import { NextResponse } from "next/server";
import { isValidMediaKey } from "@/lib/company-media";
import { getMediaBucket } from "@/lib/db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ key: string[] }> };

/**
 * Public read proxy for company media stored in private R2.
 * Keys must match companies/{slug}/{logo|photo}-{id}.{ext} — no listing,
 * no path traversal, no cross-bucket access.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { key: parts } = await context.params;
  const key = (parts ?? []).map((p) => decodeURIComponent(p)).join("/");

  if (!isValidMediaKey(key)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const bucket = await getMediaBucket();
    const object = await bucket.get(key);
    if (!object) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const headers = new Headers();
    headers.set(
      "Content-Type",
      object.httpMetadata?.contentType || "application/octet-stream",
    );
    headers.set(
      "Cache-Control",
      object.httpMetadata?.cacheControl ||
        "public, max-age=86400, stale-while-revalidate=604800",
    );
    headers.set("X-Content-Type-Options", "nosniff");
    if (object.httpEtag) headers.set("ETag", object.httpEtag);

    return new NextResponse(object.body, { status: 200, headers });
  } catch (err) {
    console.error("media GET failed", err);
    return NextResponse.json({ error: "Unable to load media" }, { status: 500 });
  }
}
