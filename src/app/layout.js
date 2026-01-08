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
  keywords: ["screen recording", "video capture", "browser recording", "cinematic zoom", "free screen recorder", "privacy first"],
  authors: [{ name: "Drift" }],
  openGraph: {
    title: "Drift - Cinema-grade Screen Recording",
    description: "Professional screen recording studio that runs entirely in your browser. Zero cost, privacy-first.",
    type: "website",
    locale: "en_US",
    siteName: "Drift",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drift - Cinema-grade Screen Recording",
    description: "Professional screen recording studio that runs entirely in your browser. Zero cost, privacy-first.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetBrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
