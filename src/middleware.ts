import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APEX_HOST = "michigangaragepros.com";

/**
 * Canonical host + HTTPS redirects for the production custom domain.
 * Skips workers.dev / preview hosts so OpenNext custom domains and
 * Cloudflare preview URLs keep working.
 *
 * Uses x-forwarded-proto (set by Cloudflare) so we do not loop when
 * the Worker already sees an https:// URL for HTTP origin traffic.
 */
export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host") ?? "";
  const host = hostHeader.split(":")[0]?.toLowerCase() ?? "";

  // Leave non-production / platform hosts alone.
  if (
    !host ||
    host === "localhost" ||
    host.endsWith(".workers.dev") ||
    host.endsWith(".pages.dev") ||
    host.endsWith(".cloudflare.com") ||
    host.includes("127.0.0.1")
  ) {
    return NextResponse.next();
  }

  const isOurDomain =
    host === APEX_HOST ||
    host === `www.${APEX_HOST}` ||
    host.endsWith(`.${APEX_HOST}`);

  if (!isOurDomain) {
    return NextResponse.next();
  }

  const forwardedProto = (
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "")
  ).toLowerCase();

  const needsHttps = forwardedProto === "http";
  const needsApex = host === `www.${APEX_HOST}`;

  if (needsHttps || needsApex) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = APEX_HOST;
    url.port = "";
    const redirect = NextResponse.redirect(url, 301);
    // HSTS on the redirect response so browsers remember HTTPS.
    redirect.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
    return redirect;
  }

  // Document responses: short CDN cache so SEO deploys are not trapped for a year.
  // Static assets under /_next/ and public files are not matched below.
  const response = NextResponse.next();
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );
  if (request.method === "GET" || request.method === "HEAD") {
    response.headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
    );
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Run on HTML routes + sitemap/robots. Skip Next internals and
     * common static file extensions so asset caching stays aggressive.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
