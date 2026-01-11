import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "./components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Drift - Cinema-grade Screen Recording, Zero Cost",
  description: "Professional screen recording studio that runs entirely in your browser. Cinematic auto-zoom, privacy-first, no subscriptions. Join the waitlist.",
  keywords: [
    "screen recording",
    "video capture",
    "browser recording",
    "cinematic zoom",
    "free screen recorder",
    "privacy first",
    "loom alternative",
    "obs alternative",
    "camtasia alternative",
    "snagit alternative"
  ],
  authors: [{ name: "Drift" }],
  openGraph: {
    title: "Drift - Cinema-grade Screen Recording",
    description: "Professional screen recording studio that runs entirely in your browser. Zero cost, privacy-first.",
    type: "website",
    locale: "en_US",
    siteName: "Drift",
    images: [{
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "Drift - Cinema-grade Screen Recording",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drift - Cinema-grade Screen Recording",
    description: "Professional screen recording studio that runs entirely in your browser. Zero cost, privacy-first.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "-YuQ7kdFzs1xa8k10vtRRTs0hx5_1GFVSA6_FmTu_1k",
  },
  metadataBase: new URL("https://drift.dvkk.dev"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetBrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Drift",
              "operatingSystem": "Windows, Mac, Linux",
              "applicationCategory": "MultimediaApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
              "description": "Professional screen recording studio that runs entirely in your browser. Cinematic auto-zoom, privacy-first, no subscriptions.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "ratingCount": "1",
              },
            }),
          }}
        />
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
