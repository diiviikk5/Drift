import { getAllConversions, getAllTools, getPopularConversions, getAllSlugs } from '@/lib/labs/conversions';
import { ToolCard, HeroSection, StatsSection, LabsMarquee } from './LabsComponents';
import Link from 'next/link';
import './labs.css';

export const metadata = {
    title: 'Free Browser-Based Media Converters | No Upload Required',
    description: 'Fast, secure, and private online tools to convert, compress, and edit video, audio, and images. 100% free with no file size limits.',
    openGraph: {
        title: 'Drift Labs | Free Browser-Based Media Converters',
        description: 'Convert, compress, and edit media 100% privately in your browser.',
        images: ['/og-labs.png'],
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/og-labs.png'],
    }
};

export default function LabsPage() {
    const popularConversions = getPopularConversions();
    const allConversions = getAllConversions();
    const allTools = getAllTools();
    const allSlugs = getAllSlugs();

    const videoConversions = allConversions.filter(c => c.category === 'video');
    const audioConversions = allConversions.filter(c => c.category === 'audio');
    const imageConversions = allConversions.filter(c => c.category === 'image');

    return (
        <div className="labs-page labs-bg-grid min-h-screen">
            <HeroSection />
            <LabsMarquee />

            <div className="max-w-7xl mx-auto px-4 pb-24">

                {/* POPULAR TOOLS */}
                <section className="mb-24">
                    <div className="labs-section-header">
                        <h2>TOP_CONVERTERS</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {popularConversions.map((tool, i) => (
                            <ToolCard
                                key={tool.slug}
                                tool={tool}
                                href={`/labs/convert/${tool.slug}`}
                                index={i}
                            />
                        ))}
                    </div>
                </section>

                {/* UTILITY TOOLS */}
                <section className="mb-24">
                    <div className="labs-section-header">
                        <h2>USEFUL_TOOLS</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allTools.map((tool, i) => (
                            <ToolCard
                                key={tool.slug}
                                tool={tool}
                                href={`/labs/tools/${tool.slug}`}
                                index={i + 20}
                            />
                        ))}
                    </div>
                </section>

                {/* BIG CATEGORY COLLECTIONS */}
                <div className="space-y-32 mb-32">
                    <section>
                        <div className="labs-section-header">
                            <h2>VIDEO_CONVERSIONS</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {videoConversions.map((tool, i) => (
                                <ToolCard
                                    key={tool.slug}
                                    tool={tool}
                                    href={`/labs/convert/${tool.slug}`}
                                    index={i + 40}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="labs-section-header">
                            <h2>AUDIO_CONVERSIONS</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {audioConversions.map((tool, i) => (
                                <ToolCard
                                    key={tool.slug}
                                    tool={tool}
                                    href={`/labs/convert/${tool.slug}`}
                                    index={i + 60}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="labs-section-header">
                            <h2>IMAGE_CONVERSIONS</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {imageConversions.map((tool, i) => (
                                <ToolCard
                                    key={tool.slug}
                                    tool={tool}
                                    href={`/labs/convert/${tool.slug}`}
                                    index={i + 80}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                {/* MASSIVE SEO SITEMAP CLOUD */}
                <section className="mb-32">
                    <div className="labs-section-header">
                        <h2>BROWSE_ALL_INDEX ({allSlugs.length}_PAGES)</h2>
                    </div>
                    <div className="border-4 border-black bg-[var(--labs-white)] p-8">
                        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] font-bold text-gray-400 uppercase">
                            {allSlugs.map((s, i) => (
                                <Link
                                    key={i}
                                    href={s.isTool ? `/labs/tools/${s.slug}` : `/labs/convert/${s.slug}`}
                                    className="hover:text-[var(--labs-cyan)] hover:underline"
                                >
                                    {s.slug.replace(/-/g, ' ')}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TECHNICAL SPECS */}
                <section className="mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-4 border-black bg-black text-white p-1">
                        <div className="p-8 border-4 border-black bg-black">
                            <h3 className="font-mono font-black text-2xl mb-4 text-[var(--labs-orange)]">FAST_PROCESSING</h3>
                            <ul className="font-mono text-sm space-y-2 opacity-80">
                                <li>{'>'} WEBASSEMBLY POWERED</li>
                                <li>{'>'} HARDWARE ACCELERATED</li>
                                <li>{'>'} NO SPEED LIMITS</li>
                                <li>{'>'} ZERO WAIT TIMES</li>
                            </ul>
                        </div>
                        <div className="p-8 border-4 border-black bg-black">
                            <h3 className="font-mono font-black text-2xl mb-4 text-[var(--labs-cyan)]">PRIVACY_FIRST</h3>
                            <ul className="font-mono text-sm space-y-2 opacity-80">
                                <li>{'>'} 100% SECURE CONVERSION</li>
                                <li>{'>'} NO FILE STORAGE</li>
                                <li>{'>'} LOCAL ONLY PROCESSING</li>
                                <li>{'>'} PRIVATE & ANONYMOUS</li>
                            </ul>
                        </div>
                        <div className="p-8 border-4 border-black bg-black">
                            <h3 className="font-mono font-black text-2xl mb-4 text-white">OPEN_SPEC</h3>
                            <ul className="font-mono text-sm space-y-2 opacity-80">
                                <li>{'>'} EVERY FORMAT SUPPORTED</li>
                                <li>{'>'} FREE FOREVER</li>
                                <li>{'>'} NO REGISTRATION</li>
                                <li>{'>'} NO WATERMARKS</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <StatsSection
                    conversionsCount={allSlugs.length}
                    toolsCount={allTools.length}
                />

                <div className="mt-12 pt-8 border-t-8 border-black font-mono text-xs font-black tracking-widest text-center">
                    DRIFT LABS // DESIGNED_FOR_MAXIMAL_PERFORMANCE // ©2026_DRYFT_MEDIA
                </div>
            </div>
        </div>
    );
}
