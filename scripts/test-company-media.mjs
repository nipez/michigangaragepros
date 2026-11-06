/**
 * Lightweight assertions for company logo/photo helpers.
 * Covers key naming, MIME/size/dimension validation, and auth-related
 * key format guards (invalid tokens / path traversal rejected).
 *
 * Run: npx tsx scripts/test-company-media.mjs
 */
import assert from "node:assert/strict";
import {
  ALLOWED_IMAGE_MIMES,
  MEDIA_LIMITS,
  buildMediaKey,
  companyMediaFromKeys,
  emptyCompanyMedia,
  inspectImageBytes,
  isMediaKind,
  isValidMediaKey,
  mediaPublicPath,
  validateMediaUpload,
} from "../src/lib/company-media.ts";
import { isValidManageTokenFormat } from "../src/lib/listing-manage.ts";

// --- Constants ---
assert.deepEqual([...ALLOWED_IMAGE_MIMES], [
  "image/jpeg",
  "image/png",
  "image/webp",
]);
assert.equal(MEDIA_LIMITS.logo.maxBytes, 512 * 1024);
assert.equal(MEDIA_LIMITS.photo.maxBytes, 1536 * 1024);
assert.equal(isMediaKind("logo"), true);
assert.equal(isMediaKind("photo"), true);
assert.equal(isMediaKind("gallery"), false);

// --- Key naming / public path ---
const key = buildMediaKey("Acme Doors!", "logo", "png");
assert.match(key, /^companies\/acme-doors\/logo-[a-f0-9]{16}\.png$/);
assert.equal(
  mediaPublicPath(key),
  `/api/media/companies/acme-doors/${key.split("/").pop()}`,
);
assert.equal(isValidMediaKey(key), true);
assert.equal(isValidMediaKey("companies/../etc/passwd"), false);
assert.equal(isValidMediaKey("/companies/x/logo-aaaaaaaaaaaaaaaa.png"), false);
assert.equal(isValidMediaKey("companies/x/logo-short.png"), false);
assert.equal(isValidMediaKey("other/x/logo-aaaaaaaaaaaaaaaa.png"), false);

const media = companyMediaFromKeys(key, null);
assert.equal(media.logoKey, key);
assert.ok(media.logoUrl?.startsWith("/api/media/companies/"));
assert.equal(media.photoUrl, null);
assert.deepEqual(emptyCompanyMedia(), {
  logoKey: null,
  photoKey: null,
  logoUrl: null,
  photoUrl: null,
});

// --- Auth failure path (token format mirrors manage APIs) ---
assert.equal(isValidManageTokenFormat("not-a-token"), false);
assert.equal(isValidManageTokenFormat("a".repeat(64)), true);
assert.equal(isValidManageTokenFormat("g".repeat(64)), false);

// --- Tiny valid PNG 64×64 (solid black) via minimal IHDR ---
function pngWithSize(width, height) {
  // Minimal structurally-valid PNG header + IHDR + IEND (no IDAT — inspect
  // only reads IHDR dimensions; validation accepts that for header sanity).
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const ihdrLen = [0, 0, 0, 13];
  const ihdrType = [0x49, 0x48, 0x44, 0x52];
  const dims = new Uint8Array(8);
  const view = new DataView(dims.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  const ihdrData = [
    ...dims,
    8, // bit depth
    2, // color type RGB
    0,
    0,
    0,
  ];
  // CRC not validated by inspectImageBytes
  const crc = [0, 0, 0, 0];
  const iend = [0, 0, 0, 0, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82];
  return new Uint8Array([
    ...signature,
    ...ihdrLen,
    ...ihdrType,
    ...ihdrData,
    ...crc,
    ...iend,
  ]);
}

const png64 = pngWithSize(64, 64);
const meta = inspectImageBytes(png64);
assert.ok(meta);
assert.equal(meta.mime, "image/png");
assert.equal(meta.width, 64);
assert.equal(meta.height, 64);

const okLogo = validateMediaUpload({
  kind: "logo",
  declaredMime: "image/png",
  bytes: png64,
});
assert.ok("meta" in okLogo);
assert.equal(okLogo.meta.ext, "png");

// Reject non-image
const bad = validateMediaUpload({
  kind: "logo",
  declaredMime: "image/png",
  bytes: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
});
assert.ok("error" in bad);
assert.match(bad.error, /not a valid/i);

// Reject wrong declared MIME
const mismatch = validateMediaUpload({
  kind: "logo",
  declaredMime: "image/jpeg",
  bytes: png64,
});
assert.ok("error" in mismatch);

// Reject oversized (cap check before parse)
const tooBig = validateMediaUpload({
  kind: "logo",
  declaredMime: "image/png",
  bytes: new Uint8Array(MEDIA_LIMITS.logo.maxBytes + 1),
});
assert.ok("error" in tooBig);
assert.match(tooBig.error, /512KB/i);

// Reject non-square-ish logo
const wide = pngWithSize(400, 100);
const wideReject = validateMediaUpload({
  kind: "logo",
  declaredMime: "image/png",
  bytes: wide,
});
assert.ok("error" in wideReject);
assert.match(wideReject.error, /square/i);

// Wide photo is OK
const photoOk = validateMediaUpload({
  kind: "photo",
  declaredMime: "image/png",
  bytes: pngWithSize(800, 320),
});
assert.ok("meta" in photoOk);

// Reject disallowed MIME declaration
const gif = validateMediaUpload({
  kind: "logo",
  declaredMime: "image/gif",
  bytes: png64,
});
assert.ok("error" in gif);

// --- Minimal JPEG with SOF0 (8×8) ---
function jpegWithSize(width, height) {
  // FF D8 SOI, APP0-ish skipped, SOF0 segment, EOI
  const sof = [
    0xff,
    0xc0,
    0x00,
    0x0b, // length
    0x08, // precision
    (height >> 8) & 0xff,
    height & 0xff,
    (width >> 8) & 0xff,
    width & 0xff,
    0x01, // components
    0x01,
    0x11,
    0x00,
  ];
  return new Uint8Array([0xff, 0xd8, ...sof, 0xff, 0xd9]);
}

const jpg = jpegWithSize(128, 128);
const jpgMeta = inspectImageBytes(jpg);
assert.ok(jpgMeta);
assert.equal(jpgMeta.mime, "image/jpeg");
assert.equal(jpgMeta.width, 128);
assert.equal(jpgMeta.height, 128);

const jpgOk = validateMediaUpload({
  kind: "logo",
  declaredMime: "image/jpeg",
  bytes: jpg,
});
assert.ok("meta" in jpgOk);
assert.equal(jpgOk.meta.ext, "jpg");

// Too-small logo dimensions
const tiny = validateMediaUpload({
  kind: "logo",
  declaredMime: "image/jpeg",
  bytes: jpegWithSize(32, 32),
});
assert.ok("error" in tiny);
assert.match(tiny.error, /dimensions/i);

console.log("test-company-media: all assertions passed");
