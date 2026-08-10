import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Michigan Garage Pros | Find Trusted Garage Door Pros",
    template: "%s | Michigan Garage Pros",
  },
  description:
    "Compare local Michigan garage-door companies, see services and coverage, and request a free quote. Free for homeowners.",
  metadataBase: new URL("https://michigangaragepros.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full font-sans text-text">{children}</body>
    </html>
  );
}
