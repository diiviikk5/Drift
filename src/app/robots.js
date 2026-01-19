export default function robots() {
    return {
        rules: [
            // Default rule for all crawlers
            {
                userAgent: "*",
                allow: "/",
            },
            // AI/LLM specific crawlers - explicitly allowed
            {
                userAgent: "GPTBot",
                allow: "/",
            },
            {
                userAgent: "ChatGPT-User",
                allow: "/",
            },
            {
                userAgent: "Google-Extended",
                allow: "/",
            },
            {
                userAgent: "PerplexityBot",
                allow: "/",
            },
            {
                userAgent: "Anthropic-AI",
                allow: "/",
            },
            {
                userAgent: "Claude-Web",
                allow: "/",
            },
            {
                userAgent: "Applebot-Extended",
                allow: "/",
            },
            {
                userAgent: "Bytespider",
                allow: "/",
            },
            {
                userAgent: "CCBot",
                allow: "/",
            },
            {
                userAgent: "cohere-ai",
                allow: "/",
            },
        ],
        sitemap: "https://drift.dvkk.dev/sitemap.xml",
        // Additional directives for AI discovery
        host: "https://drift.dvkk.dev",
    };
}
