import { NextResponse } from "next/server";
import {
  buildMediaKey,
  getCompanyMedia,
  isMediaKind,
  setCompanyMediaKey,
  validateMediaUpload,
  type MediaKind,
} from "@/lib/company-media";
import { getDb, getMediaBucket } from "@/lib/db";
import {
  getCompanyByManageToken,
  isValidManageTokenFormat,
} from "@/lib/listing-manage";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

/**
 * Claimed company media (logo + optional profile photo).
 *
 * GET  — current logo/photo URLs
 * POST — multipart upload: fields `kind` (logo|photo) + `file`
 * DELETE — JSON body `{ kind: "logo" | "photo" }`
 *
 * Applies live (no listing_edit_requests moderation) — binaries are
 * owner-scoped and MIME/size validated server-side.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const media = await getCompanyMedia(db, company.slug);
    return NextResponse.json(
      {
        slug: company.slug,
        logoUrl: media.logoUrl,
        photoUrl: media.photoUrl,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    console.error("manage media GET failed", err);
    return NextResponse.json({ error: "Unable to load media" }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart form data" },
      { status: 400 },
    );
  }

  const kindRaw = form.get("kind");
  const kind =
    typeof kindRaw === "string" ? kindRaw.trim().toLowerCase() : "";
  if (!isMediaKind(kind)) {
    return NextResponse.json(
      { error: 'kind must be "logo" or "photo"' },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = validateMediaUpload({
      kind,
      declaredMime: file.type || "",
      bytes,
    });
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const key = buildMediaKey(company.slug, kind, result.meta.ext);
    const bucket = await getMediaBucket();
    await bucket.put(key, bytes, {
      httpMetadata: {
        contentType: result.meta.mime,
        cacheControl: "public, max-age=31536000, immutable",
      },
      customMetadata: {
        companySlug: company.slug,
        kind,
      },
    });

    const updated = await setCompanyMediaKey(db, company.slug, kind, key);
    if (!updated.ok) {
      // Best-effort cleanup of the orphan we just wrote.
      try {
        await bucket.delete(key);
      } catch {
        /* ignore */
      }
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    if (updated.previousKey && updated.previousKey !== key) {
      try {
        await bucket.delete(updated.previousKey);
      } catch (err) {
        console.error("manage media old-object cleanup failed", err);
      }
    }

    const media = await getCompanyMedia(db, company.slug);

    return NextResponse.json({
      ok: true,
      kind,
      logoUrl: media.logoUrl,
      photoUrl: media.photoUrl,
      message:
        kind === "logo"
          ? "Logo updated — live on your public profile."
          : "Profile photo updated — live on your public profile.",
    });
  } catch (err) {
    console.error("manage media POST failed", err);
    return NextResponse.json(
      { error: "Unable to upload image" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!isValidManageTokenFormat(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: { kind?: string };
  try {
    body = (await request.json()) as { kind?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const kind = (body.kind ?? "").trim().toLowerCase();
  if (!isMediaKind(kind)) {
    return NextResponse.json(
      { error: 'kind must be "logo" or "photo"' },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const company = await getCompanyByManageToken(db, token);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await setCompanyMediaKey(db, company.slug, kind as MediaKind, null);
    if (!updated.ok) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    if (updated.previousKey) {
      try {
        const bucket = await getMediaBucket();
        await bucket.delete(updated.previousKey);
      } catch (err) {
        console.error("manage media delete R2 failed", err);
      }
    }

    const media = await getCompanyMedia(db, company.slug);
    return NextResponse.json({
      ok: true,
      kind,
      logoUrl: media.logoUrl,
      photoUrl: media.photoUrl,
      message:
        kind === "logo" ? "Logo removed." : "Profile photo removed.",
    });
  } catch (err) {
    console.error("manage media DELETE failed", err);
    return NextResponse.json(
      { error: "Unable to remove image" },
      { status: 500 },
    );
  }
}
