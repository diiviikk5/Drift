import { getToolBySlug, getAllTools } from '@/lib/labs/conversions';
import SpecialTool from '@/components/labs/SpecialTool';
import { notFound } from 'next/navigation';

/**
 * Generate static params for all special tool pages
 */
export async function generateStaticParams() {
    const tools = getAllTools();
    return tools.map((tool) => ({
        slug: tool.slug,
    }));
}

/**
 * Generate metadata for each tool page
 */
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const config = getToolBySlug(slug);

    if (!config) {
        return {
            title: 'Tool Not Found | Drift Labs',
        };
    }

    return {
        title: config.seoTitle,
        description: config.seoDescription,
        keywords: [
            slug.replace(/-/g, ' '),
            `${slug.replace(/-/g, ' ')} online`,
            `${slug.replace(/-/g, ' ')} free`,
            `${slug.replace(/-/g, ' ')} no upload`,
            'online tool',
            'free tool',
            'private tool',
            'browser tool',
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
            canonical: `https://drift.dvkk.dev/labs/tools/${slug}`,
        },
    };
}

/**
 * Dynamic tool page
 */
export default async function ToolPage({ params }) {
    const { slug } = await params;
    const config = getToolBySlug(slug);

    if (!config) {
        notFound();
    }

    // JSON-LD structured data
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

    // FAQ structured data
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
            <SpecialTool config={config} slug={slug} />
        </>
    );
}
