/**
 * Company logo + profile photo helpers.
 * Objects live in R2 (binding MEDIA); D1 stores object keys on companies.
 * Public URLs are Worker-proxied via /api/media/<key> (bucket stays private).
 */

import type { getDb } from "@/lib/db";

export type MediaKind = "logo" | "photo";

export type CompanyMedia = {
  logoKey: string | null;
  photoKey: string | null;
  logoUrl: string | null;
  photoUrl: string | null;
};

export type ImageMeta = {
  mime: "image/jpeg" | "image/png" | "image/webp";
  ext: "jpg" | "png" | "webp";
  width: number;
  height: number;
};

export const ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MEDIA_LIMITS = {
  logo: {
    maxBytes: 512 * 1024,
    minWidth: 64,
    minHeight: 64,
    maxWidth: 2048,
    maxHeight: 2048,
    /** Logos should be roughly square. */
    minAspect: 0.75,
    maxAspect: 1.35,
  },
  photo: {
    maxBytes: 1536 * 1024, // 1.5 MB
    minWidth: 200,
    minHeight: 100,
    maxWidth: 4096,
    maxHeight: 4096,
    minAspect: 0.4,
    maxAspect: 3.5,
  },
} as const;

const KEY_RE =
  /^companies\/[a-z0-9][a-z0-9-]{0,80}\/(logo|photo)-[a-f0-9]{16}\.(jpg|png|webp)$/;

/** Relative public path for an R2 object key (served by the Worker). */
export function mediaPublicPath(key: string): string {
  return `/api/media/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export function emptyCompanyMedia(): CompanyMedia {
  return {
    logoKey: null,
    photoKey: null,
    logoUrl: null,
    photoUrl: null,
  };
}

export function companyMediaFromKeys(
  logoKey: string | null | undefined,
  photoKey: string | null | undefined,
): CompanyMedia {
  const logo = logoKey?.trim() || null;
  const photo = photoKey?.trim() || null;
  return {
    logoKey: logo,
    photoKey: photo,
    logoUrl: logo && isValidMediaKey(logo) ? mediaPublicPath(logo) : null,
    photoUrl: photo && isValidMediaKey(photo) ? mediaPublicPath(photo) : null,
  };
}

/** Reject path traversal / unexpected shapes before R2 get. */
export function isValidMediaKey(key: string): boolean {
  if (!key || key.includes("..") || key.startsWith("/") || key.includes("\\")) {
    return false;
  }
  return KEY_RE.test(key);
}

export function isMediaKind(value: unknown): value is MediaKind {
  return value === "logo" || value === "photo";
}

/** Random object key scoped to company slug + kind (not enumerable from slug alone). */
export function buildMediaKey(
  slug: string,
  kind: MediaKind,
  ext: ImageMeta["ext"],
): string {
  const safeSlug = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const id = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `companies/${safeSlug}/${kind}-${id}.${ext}`;
}

function readU32BE(view: DataView, offset: number): number {
  return view.getUint32(offset, false);
}

function readU16BE(view: DataView, offset: number): number {
  return view.getUint16(offset, false);
}

function readU24LE(view: DataView, offset: number): number {
  return (
    view.getUint8(offset) |
    (view.getUint8(offset + 1) << 8) |
    (view.getUint8(offset + 2) << 16)
  );
}

/**
 * Detect MIME from magic bytes and parse width/height from headers.
 * Returns null when the buffer is not a supported image.
 */
export function inspectImageBytes(bytes: Uint8Array): ImageMeta | null {
  if (bytes.length < 12) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  // PNG: 89 50 4E 47 … IHDR at byte 8
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    if (bytes.length < 24) return null;
    const width = readU32BE(view, 16);
    const height = readU32BE(view, 20);
    if (!width || !height) return null;
    return { mime: "image/png", ext: "png", width, height };
  }

  // JPEG: FF D8 … scan for SOF0/SOF2
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = bytes[offset + 1];
      if (marker === 0xd9 || marker === 0xda) break;
      const size = readU16BE(view, offset + 2);
      if (size < 2) break;
      // Baseline / progressive DCT
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        const height = readU16BE(view, offset + 5);
        const width = readU16BE(view, offset + 7);
        if (!width || !height) return null;
        return { mime: "image/jpeg", ext: "jpg", width, height };
      }
      offset += 2 + size;
    }
    return null;
  }

  // WebP: RIFF....WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    const fourcc =
      String.fromCharCode(bytes[12] ?? 0) +
      String.fromCharCode(bytes[13] ?? 0) +
      String.fromCharCode(bytes[14] ?? 0) +
      String.fromCharCode(bytes[15] ?? 0);

    if (fourcc === "VP8 " && bytes.length >= 30) {
      // Lossy: width/height are 14-bit little-endian at offset 26/28
      const width = view.getUint16(26, true) & 0x3fff;
      const height = view.getUint16(28, true) & 0x3fff;
      if (!width || !height) return null;
      return { mime: "image/webp", ext: "webp", width, height };
    }

    if (fourcc === "VP8L" && bytes.length >= 25) {
      // Lossless: 14-bit width-1 / height-1 packed after signature byte
      const bits = readU32BE(view, 21);
      const width = (bits & 0x3fff) + 1;
      const height = ((bits >> 14) & 0x3fff) + 1;
      if (!width || !height) return null;
      return { mime: "image/webp", ext: "webp", width, height };
    }

    if (fourcc === "VP8X" && bytes.length >= 30) {
      // Extended: 24-bit width-1 / height-1 little-endian
      const width = readU24LE(view, 24) + 1;
      const height = readU24LE(view, 27) + 1;
      if (!width || !height) return null;
      return { mime: "image/webp", ext: "webp", width, height };
    }

    return null;
  }

  return null;
}

/**
 * Validate declared MIME + bytes for a media kind.
 * Returns a user-facing error string, or null when OK.
 */
export function validateMediaUpload(options: {
  kind: MediaKind;
  declaredMime: string;
  bytes: Uint8Array;
}): { error: string } | { meta: ImageMeta } {
  const { kind, declaredMime, bytes } = options;
  const limits = MEDIA_LIMITS[kind];

  if (bytes.byteLength === 0) {
    return { error: "Empty file" };
  }
  if (bytes.byteLength > limits.maxBytes) {
    const mb =
      limits.maxBytes >= 1024 * 1024
        ? `${(limits.maxBytes / (1024 * 1024)).toFixed(1)}MB`
        : `${Math.round(limits.maxBytes / 1024)}KB`;
    return {
      error:
        kind === "logo"
          ? `Logo must be ${mb} or smaller`
          : `Photo must be ${mb} or smaller`,
    };
  }

  const normalizedMime = declaredMime.trim().toLowerCase();
  if (
    !(ALLOWED_IMAGE_MIMES as readonly string[]).includes(normalizedMime) &&
    normalizedMime !== "image/jpg"
  ) {
    return { error: "Only JPEG, PNG, or WebP images are allowed" };
  }

  const meta = inspectImageBytes(bytes);
  if (!meta) {
    return { error: "File is not a valid JPEG, PNG, or WebP image" };
  }

  // Declared MIME must match detected type (allow image/jpg → jpeg).
  const declared =
    normalizedMime === "image/jpg" ? "image/jpeg" : normalizedMime;
  if (declared !== meta.mime) {
    return { error: "File content does not match the declared image type" };
  }

  if (
    meta.width < limits.minWidth ||
    meta.height < limits.minHeight ||
    meta.width > limits.maxWidth ||
    meta.height > limits.maxHeight
  ) {
    return {
      error:
        kind === "logo"
          ? `Logo dimensions must be between ${limits.minWidth}×${limits.minHeight} and ${limits.maxWidth}×${limits.maxHeight}`
          : `Photo dimensions must be between ${limits.minWidth}×${limits.minHeight} and ${limits.maxWidth}×${limits.maxHeight}`,
    };
  }

  const aspect = meta.width / meta.height;
  if (aspect < limits.minAspect || aspect > limits.maxAspect) {
    return {
      error:
        kind === "logo"
          ? "Logo should be roughly square"
          : "Photo aspect ratio is out of range",
    };
  }

  return { meta };
}

type MediaDb = Awaited<ReturnType<typeof getDb>>;

/** Load logo/photo keys for a company slug (public). */
export async function getCompanyMedia(
  db: MediaDb,
  slug: string,
): Promise<CompanyMedia> {
  const row = await db
    .prepare(
      `SELECT logo_key, photo_key FROM companies WHERE slug = ? LIMIT 1`,
    )
    .bind(slug)
    .first<{ logo_key: string | null; photo_key: string | null }>();

  if (!row) return emptyCompanyMedia();
  return companyMediaFromKeys(row.logo_key, row.photo_key);
}

/** Batch load media for listing cards. Caps slug list at 100. */
export async function getCompanyMediaBySlugs(
  db: MediaDb,
  slugs: string[],
): Promise<Record<string, CompanyMedia>> {
  const unique = [
    ...new Set(
      slugs
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 100),
    ),
  ];
  if (unique.length === 0) return {};

  const placeholders = unique.map(() => "?").join(",");
  const res = await db
    .prepare(
      `SELECT slug, logo_key, photo_key FROM companies
       WHERE slug IN (${placeholders})
         AND (logo_key IS NOT NULL OR photo_key IS NOT NULL)`,
    )
    .bind(...unique)
    .all<{
      slug: string;
      logo_key: string | null;
      photo_key: string | null;
    }>();

  const out: Record<string, CompanyMedia> = {};
  for (const row of res.results ?? []) {
    out[row.slug] = companyMediaFromKeys(row.logo_key, row.photo_key);
  }
  return out;
}

/**
 * Set logo or photo key; returns the previous key (for R2 cleanup) or null
 * if the company row was missing.
 */
export async function setCompanyMediaKey(
  db: MediaDb,
  slug: string,
  kind: MediaKind,
  key: string | null,
): Promise<{ ok: true; previousKey: string | null } | { ok: false }> {
  const row = await db
    .prepare(
      `SELECT logo_key, photo_key FROM companies WHERE slug = ? LIMIT 1`,
    )
    .bind(slug)
    .first<{ logo_key: string | null; photo_key: string | null }>();
  if (!row) return { ok: false };

  if (kind === "logo") {
    await db
      .prepare(`UPDATE companies SET logo_key = ? WHERE slug = ?`)
      .bind(key, slug)
      .run();
    return { ok: true, previousKey: row.logo_key };
  }

  await db
    .prepare(`UPDATE companies SET photo_key = ? WHERE slug = ?`)
    .bind(key, slug)
    .run();
  return { ok: true, previousKey: row.photo_key };
}
