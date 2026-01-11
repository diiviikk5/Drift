export default function sitemap() {
    return [
        {
            url: "https://drift.dvkk.dev",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: "https://drift.dvkk.dev/studio",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        ...[
            "loom-alternative",
            "obs-alternative",
            "camtasia-alternative",
            "bandicam-alternative",
            "snagit-alternative",
        ].map((slug) => ({
            url: `https://drift.dvkk.dev/compare/${slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        })),
    ];
}
