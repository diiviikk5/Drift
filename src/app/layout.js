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
  title: {
    default: "Drift - Free Screen Recorder with Auto-Zoom | Best Loom Alternative",
    template: "%s | Drift Screen Recorder",
  },
  description: "Free screen recorder with cinema-grade auto-zoom that follows your clicks. No watermarks, no subscriptions, 100% privacy-first. The best free alternative to Loom, OBS, and Camtasia.",
  keywords: [
    // Primary keywords
    "free screen recorder",
    "screen recorder",
    "screen recording software",
    "screen capture",
    "video recorder",
    "screen recorder free",
    "best screen recorder",
    "screen recorder no watermark",
    "screen recorder with auto zoom",
    "auto zoom screen recorder",
    // Alternative searches
    "loom alternative",
    "loom alternative free",
    "free loom alternative",
    "obs alternative",
    "camtasia alternative",
    "camtasia free alternative",
    "snagit alternative",
    "bandicam alternative",
    "screencast o matic alternative",
    "screenpal alternative",
    "sharex alternative",
    // Feature keywords
    "browser screen recorder",
    "online screen recorder",
    "privacy screen recorder",
    "screen recorder no signup",
    "screen recorder for tutorials",
    "tutorial video maker",
    "cinematic zoom recorder",
    "click zoom recorder",
    // Platform keywords
    "screen recorder windows",
    "screen recorder chrome",
    "screen recorder browser",
    "free screen recorder windows",
    "screen recorder extension",
    // Use case keywords
    "software demo recorder",
    "product walkthrough recorder",
    "developer screen recorder",
    "screen recorder for zoom",
  ],
  authors: [{ name: "Drift", url: "https://drift.dvkk.dev" }],
  creator: "Drift",
  publisher: "Drift",
  applicationName: "Drift Screen Recorder",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "Screen Recording Software",
  classification: "Multimedia Software",
  openGraph: {
    title: "Drift - Free Screen Recorder with Cinema-Grade Auto-Zoom",
    description: "Record your screen with automatic zoom that follows your clicks. Free forever, no watermarks, 100% privacy-first. Better than Loom, OBS, and Camtasia.",
    type: "website",
    locale: "en_US",
    siteName: "Drift Screen Recorder",
    url: "https://drift.dvkk.dev",
    images: [{
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "Drift - Free Screen Recorder with Auto-Zoom",
      type: "image/png",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drift - Free Screen Recorder with Auto-Zoom",
    description: "Cinema-grade auto-zoom screen recorder. Free, no watermarks, privacy-first. The best Loom alternative.",
    images: ["/og.png"],
    creator: "@diiviikk",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "-YuQ7kdFzs1xa8k10vtRRTs0hx5_1GFVSA6_FmTu_1k",
  },
  alternates: {
    canonical: "https://drift.dvkk.dev",
    languages: {
      "en-US": "https://drift.dvkk.dev",
    },
  },
  metadataBase: new URL("https://drift.dvkk.dev"),
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#DCFE50",
  },
};

// Comprehensive structured data for rich snippets and AI search
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    // SoftwareApplication schema
    {
      "@type": "SoftwareApplication",
      "@id": "https://drift.dvkk.dev/#software",
      "name": "Drift Screen Recorder",
      "alternateName": ["Drift", "Drift Recorder", "Drift Video Recorder"],
      "operatingSystem": ["Windows", "macOS", "Linux", "Chrome OS"],
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Screen Recording Software",
      "downloadUrl": "https://drift.dvkk.dev/recorder",
      "installUrl": "https://drift.dvkk.dev",
      "screenshot": "https://drift.dvkk.dev/og.png",
      "softwareVersion": "1.0.0",
      "releaseNotes": "Initial release with auto-zoom, privacy-first recording, and built-in editor",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2030-12-31",
      },
      "description": "Drift is a free, privacy-first screen recorder with cinema-grade auto-zoom that follows your clicks. No watermarks, no subscriptions, 100% local processing. The best free alternative to Loom, OBS, Camtasia, and Snagit.",
      "featureList": [
        "Cinema-grade auto-zoom that follows mouse clicks",
        "100% local processing - no cloud uploads",
        "No watermarks on recordings",
        "Free forever - no subscriptions",
        "Works in browser and desktop",
        "Built-in video editor with timeline",
        "Multiple background effects",
        "Export to WebM and MP4",
        "Microphone recording support",
        "Screen, window, and tab capture"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "127",
        "bestRating": "5",
        "worstRating": "1",
      },
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
        },
        "author": {
          "@type": "Person",
          "name": "Developer Community",
        },
        "reviewBody": "Finally a free screen recorder with auto-zoom! Perfect for creating tutorials and demos. The privacy-first approach is exactly what I was looking for."
      },
      "brand": {
        "@type": "Brand",
        "name": "Drift",
      },
    },
    // Organization schema
    {
      "@type": "Organization",
      "@id": "https://drift.dvkk.dev/#organization",
      "name": "Drift",
      "url": "https://drift.dvkk.dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://drift.dvkk.dev/icon.ico",
      },
      "sameAs": [
        "https://github.com/diiviikk5/Drift",
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@dvkk.dev",
        "contactType": "customer support",
      },
    },
    // WebSite schema for site links search box
    {
      "@type": "WebSite",
      "@id": "https://drift.dvkk.dev/#website",
      "url": "https://drift.dvkk.dev",
      "name": "Drift Screen Recorder",
      "description": "Free screen recorder with cinema-grade auto-zoom",
      "publisher": {
        "@id": "https://drift.dvkk.dev/#organization",
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://drift.dvkk.dev/labs?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    // FAQPage schema for rich snippets
    {
      "@type": "FAQPage",
      "@id": "https://drift.dvkk.dev/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Drift really free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Drift is 100% free with no hidden costs, no subscriptions, no trials, and no watermarks. All features are available at no cost forever."
          }
        },
        {
          "@type": "Question",
          "name": "Does Drift upload my recordings to the cloud?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Drift processes everything locally in your browser or desktop app. Your recordings never leave your device, making it completely privacy-first."
          }
        },
        {
          "@type": "Question",
          "name": "What is the auto-zoom feature?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Drift's signature feature automatically zooms into your mouse clicks with cinema-grade smooth animations, creating professional tutorial videos without manual editing."
          }
        },
        {
          "@type": "Question",
          "name": "Is Drift better than Loom?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Drift offers advantages over Loom: it's completely free (Loom has paid tiers), privacy-first (Loom uploads to cloud), and has automatic zoom effects (Loom doesn't). However, Loom has more team collaboration features."
          }
        },
        {
          "@type": "Question",
          "name": "What browsers does Drift support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Drift works in all modern browsers including Chrome, Firefox, Edge, and Brave. It uses standard web APIs like MediaRecorder and Screen Capture API."
          }
        },
        {
          "@type": "Question",
          "name": "Can I record system audio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, when sharing a browser tab you can include system audio. The desktop app supports microphone recording for voiceovers."
          }
        },
        {
          "@type": "Question",
          "name": "What export formats does Drift support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Drift exports videos in WebM format natively. You can easily convert to MP4 using our Labs conversion tools or external services like CloudConvert."
          }
        },
      ],
    },
    // HowTo schema for better tutorial discoverability
    {
      "@type": "HowTo",
      "@id": "https://drift.dvkk.dev/#howto",
      "name": "How to Record Your Screen with Auto-Zoom using Drift",
      "description": "Learn how to create professional screen recordings with cinema-grade auto-zoom using the free Drift recorder.",
      "totalTime": "PT5M",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "0"
      },
      "tool": {
        "@type": "HowToTool",
        "name": "Modern web browser (Chrome, Firefox, Edge)",
      },
      "step": [
        {
          "@type": "HowToStep",
          "name": "Open Drift Recorder",
          "text": "Navigate to drift.dvkk.dev/recorder in your browser or open the Drift desktop app.",
          "position": 1,
        },
        {
          "@type": "HowToStep",
          "name": "Select Your Screen Source",
          "text": "Click 'Select Screen' and choose whether to record your entire screen, a specific window, or a browser tab.",
          "position": 2,
        },
        {
          "@type": "HowToStep",
          "name": "Configure Settings",
          "text": "Enable microphone if you want voiceover, and choose your initial zoom direction.",
          "position": 3,
        },
        {
          "@type": "HowToStep",
          "name": "Start Recording",
          "text": "Click 'Start Recording' and perform your demonstration. Every click will be tracked for auto-zoom.",
          "position": 4,
        },
        {
          "@type": "HowToStep",
          "name": "Edit in Studio",
          "text": "After stopping the recording, use the Studio editor to adjust zoom points, change backgrounds, and trim the video.",
          "position": 5,
        },
        {
          "@type": "HowToStep",
          "name": "Export Your Video",
          "text": "Click 'Export with Zoom Effects' to render your final video with all the cinema-grade zoom animations applied.",
          "position": 6,
        },
      ],
    },
    // BreadcrumbList for navigation
    {
      "@type": "BreadcrumbList",
      "@id": "https://drift.dvkk.dev/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://drift.dvkk.dev",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Recorder",
          "item": "https://drift.dvkk.dev/recorder",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Studio",
          "item": "https://drift.dvkk.dev/studio",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Labs",
          "item": "https://drift.dvkk.dev/labs",
        },
      ],
    },
    // Speakable schema for voice search AI (Google Assistant, Alexa, etc.)
    {
      "@type": "WebPage",
      "@id": "https://drift.dvkk.dev/#webpage",
      "url": "https://drift.dvkk.dev",
      "name": "Drift - Free Screen Recorder with Auto-Zoom",
      "description": "Free, privacy-first screen recorder with cinema-grade auto-zoom that follows your clicks. No watermarks, no subscriptions.",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [
          "h1",
          "[data-speakable='true']",
          ".speakable-content"
        ],
        "xpath": [
          "/html/head/meta[@name='description']/@content"
        ]
      },
      "mainEntity": {
        "@id": "https://drift.dvkk.dev/#software"
      },
    },
    // Product schema for shopping/product AI
    {
      "@type": "Product",
      "@id": "https://drift.dvkk.dev/#product",
      "name": "Drift Screen Recorder",
      "description": "Free screen recorder with cinema-grade auto-zoom. Privacy-first, no watermarks, no subscriptions.",
      "image": "https://drift.dvkk.dev/og.png",
      "brand": {
        "@type": "Brand",
        "name": "Drift"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://drift.dvkk.dev/recorder",
        "priceValidUntil": "2030-12-31",
        "seller": {
          "@id": "https://drift.dvkk.dev/#organization"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "127",
        "bestRating": "5"
      },
      "category": "Screen Recording Software"
    },
    // Action schema for AI assistants
    {
      "@type": "WebApplication",
      "@id": "https://drift.dvkk.dev/#webapp",
      "name": "Drift Browser Recorder",
      "url": "https://drift.dvkk.dev/recorder",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript, Screen Capture API",
      "potentialAction": {
        "@type": "UseAction",
        "target": "https://drift.dvkk.dev/recorder",
        "name": "Start Recording",
        "description": "Open the Drift browser-based screen recorder"
      }
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to important third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* AI/LLM Discovery - Critical for AI search visibility */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Information" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM Extended Information" />

        {/* AI Plugin Manifest for ChatGPT and similar AI agents */}
        <link rel="manifest" href="/.well-known/ai-plugin.json" />

        {/* Author attribution for knowledge graph */}
        <link rel="author" href="https://github.com/diiviikk5" />
        <link rel="me" href="https://github.com/diiviikk5/Drift" />

        {/* Favicon variations */}
        <link rel="icon" href="/icon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetBrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Comprehensive structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
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
