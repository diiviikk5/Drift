import { getConversionBySlug, getAllSlugs } from '@/lib/labs/conversions';
import ConversionTool from '@/components/labs/ConversionTool';
import { notFound } from 'next/navigation';


export async function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.filter(s => !s.isTool).map((s) => ({
        slug: s.slug,
    }));
}


/**
 * Generate metadata for each conversion page
 * This is critical for programmatic SEO
 */
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const config = getConversionBySlug(slug);

    if (!config) {
        return {
            title: 'Conversion Not Found | Drift Labs',
        };
    }

    return {
        title: config.seoTitle,
        description: config.seoDescription,
        keywords: [
            `${config.from.ext} to ${config.to.ext}`,
            `convert ${config.from.ext} to ${config.to.ext}`,
            `${config.from.ext} to ${config.to.ext} converter`,
            `${config.from.ext} to ${config.to.ext} online`,
            `${config.from.ext} to ${config.to.ext} free`,
            `${config.from.ext} to ${config.to.ext} no upload`,
            `${config.from.ext} converter`,
            'online converter',
            'free converter',
            'private converter',
            'browser converter',
        ],
        openGraph: {
            title: config.seoTitle,
            description: config.seoDescription,
            type: 'website',
            siteName: 'Drift Labs',
            images: [{
                url: '/og-labs.png',
                width: 1200,
                height: 630,
                alt: config.title,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: config.seoTitle,
            description: config.seoDescription,
            images: ['/og-labs.png'],
        },
        alternates: {
            canonical: `https://drift.dvkk.dev/labs/convert/${slug}`,
        },
    };
}

/**
 * Dynamic conversion page
 * Renders the conversion tool based on URL slug
 */
export default async function ConversionPage({ params }) {
    const { slug } = await params;
    const config = getConversionBySlug(slug);

    if (!config) {
        notFound();
    }

    // Add JSON-LD structured data for rich results
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: config.title,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: config.description,
        featureList: [
            'No file upload required',
            'Runs entirely in browser',
            '100% private and secure',
            'No file size limits',
            'Free forever',
        ],
    };

    // FAQ structured data for rich snippets
    const faqJsonLd = config.faq && config.faq.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: config.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
            },
        })),
    } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <ConversionTool config={config} slug={slug} />
        </>
    );
}
