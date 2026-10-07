import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME } from "@/data/site";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import {
  DEFAULT_OG_IMAGE,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * Root defaults intentionally omit alternates.canonical.
 * Homepage canonical lives on app/page.tsx; 404/not-found must not inherit
 * a homepage canonical (GSC "Alternate page with proper canonical tag").
 */
export const metadata: Metadata = {
  title: {
    default: "Michigan Garage Pros | Find Trusted Garage Door Pros",
    template: "%s | Michigan Garage Pros",
  },
  description:
    "Compare local Michigan garage-door companies, see services and coverage, and request a free quote. Free for homeowners.",
  metadataBase: new URL("https://michigangaragepros.com"),
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full font-sans text-text">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
