import { getAllSlugs, getPopularConversions, getAllTools } from '@/lib/labs/conversions';

export default function sitemap() {
    const baseUrl = 'https://drift.dvkk.dev';
    const now = new Date();

    // Core pages
    const corePages = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/studio`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/recorder`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/labs`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.95,
        },
    ];

    // Comparison pages (existing)
    const comparisonPages = [
        'loom-alternative',
        'obs-alternative',
        'camtasia-alternative',
        'bandicam-alternative',
        'snagit-alternative',
    ].map((slug) => ({
        url: `${baseUrl}/compare/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // Labs pages from the dynamic generator (850+)
    const allSlugs = getAllSlugs();
    const popularConversions = getPopularConversions().map(c => c.slug);
    const popularTools = getAllTools().filter(t => t.popular).map(t => t.slug);
    const popularSet = new Set([...popularConversions, ...popularTools]);

    const labsPages = allSlugs.map((s) => ({
        url: s.isTool
            ? `${baseUrl}/labs/tools/${s.slug}`
            : `${baseUrl}/labs/convert/${s.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: popularSet.has(s.slug) ? 0.9 : 0.7,
    }));

    return [
        ...corePages,
        ...comparisonPages,
        ...labsPages,
    ];
}
