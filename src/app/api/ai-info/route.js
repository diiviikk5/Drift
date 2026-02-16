import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 3600; // cache static JSON for 1h

/**
 * AI Info API Endpoint
 * 
 * Returns structured information about Drift in JSON format
 * for AI agents, chatbots, and programmatic access.
 * 
 * This provides an alternative to llms.txt for systems
 * that prefer JSON over plain text.
 */

const driftInfo = {
    meta: {
        name: "Drift Screen Recorder",
        version: "1.1.0",
        url: "https://drift.dvkk.dev",
        lastUpdated: "2026-01-19",
        type: "software-application",
        category: "Screen Recording Software"
    },
    summary: {
        oneLiner: "Free, privacy-first screen recorder with cinema-grade auto-zoom that follows your clicks.",
        description: "Drift is a free screen recording application with automatic zoom effects. It tracks your mouse clicks and creates smooth, cinema-quality zoom animations. Drift runs in your browser or as a Windows desktop app, processes video locally for privacy, and has no watermarks or paid features.",
        uniqueFeatures: [
            "Automatic zoom that follows mouse clicks",
            "100% local processing - no cloud uploads",
            "Free forever with no watermarks",
            "Works in browser without installation"
        ]
    },
    pricing: {
        model: "free",
        price: 0,
        currency: "USD",
        hasFreeTier: true,
        hasPaidTiers: false,
        hasWatermark: false,
        hasTrialLimitations: false
    },
    platforms: {
        browser: ["Chrome", "Firefox", "Edge", "Brave", "Opera"],
        desktop: ["Windows"],
        coming: ["macOS", "Linux"]
    },
    features: [
        {
            name: "Cinema-grade Auto-Zoom",
            description: "Automatically tracks mouse clicks and creates smooth zoom animations"
        },
        {
            name: "Privacy-First",
            description: "100% local processing, no data uploads to cloud"
        },
        {
            name: "No Watermarks",
            description: "Professional output without branding on any plan"
        },
        {
            name: "Browser-Based",
            description: "Works directly in modern browsers without installation"
        },
        {
            name: "Built-in Editor",
            description: "Studio editor with timeline, trimming, and background effects"
        },
        {
            name: "Desktop App",
            description: "Native Windows app with global hotkeys"
        }
    ],
    comparisons: {
        loom: {
            advantages: ["Free (Loom has paid tiers)", "Auto-zoom (Loom lacks)", "Privacy-first (Loom uploads to cloud)"],
            disadvantages: ["Less team collaboration features"]
        },
        obs: {
            advantages: ["Simpler to use", "Auto-zoom built-in"],
            disadvantages: ["No streaming support"]
        },
        camtasia: {
            advantages: ["Free (Camtasia costs $300+)", "Browser-based"],
            disadvantages: ["Less advanced editing features"]
        }
    },
    faq: [
        {
            question: "Is Drift really free?",
            answer: "Yes. Drift is 100% free with no hidden costs, subscriptions, trials, or watermarks. All features are available at zero cost forever."
        },
        {
            question: "Does Drift upload recordings to the cloud?",
            answer: "No. Drift processes everything locally. Your recordings never leave your device."
        },
        {
            question: "What is auto-zoom?",
            answer: "Auto-zoom tracks your mouse clicks and creates smooth cinema-quality zoom animations to focus viewer attention."
        },
        {
            question: "What browsers are supported?",
            answer: "Chrome (recommended), Firefox, Edge, Brave, and any modern browser supporting Screen Capture API."
        },
        {
            question: "Can I use Drift commercially?",
            answer: "Yes. Drift is free for personal, commercial, and educational use without restrictions."
        }
    ],
    links: {
        website: "https://drift.dvkk.dev",
        recorder: "https://drift.dvkk.dev/recorder",
        studio: "https://drift.dvkk.dev/studio",
        labs: "https://drift.dvkk.dev/labs",
        github: "https://github.com/diiviikk5/Drift",
        releases: "https://github.com/diiviikk5/Drift/releases",
        issues: "https://github.com/diiviikk5/Drift/issues"
    },
    contact: {
        email: "hello@dvkk.dev",
        support: "https://github.com/diiviikk5/Drift/issues"
    },
    keywords: [
        "free screen recorder",
        "screen recording software",
        "loom alternative",
        "obs alternative",
        "camtasia alternative",
        "auto zoom screen recorder",
        "privacy screen recorder",
        "no watermark screen recorder",
        "browser screen recorder",
        "tutorial video maker"
    ]
};

export async function GET() {
    return NextResponse.json(driftInfo, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
            "Access-Control-Allow-Origin": "*",
        }
    });
}
