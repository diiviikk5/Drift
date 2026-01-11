import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export async function generateStaticParams() {
    const competitors = [
        "loom-alternative",
        "obs-alternative",
        "camtasia-alternative",
        "bandicam-alternative",
        "snagit-alternative",
    ];

    return competitors.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata(props) {
    const params = await props.params;
    const competitor = params.slug.replace("-alternative", "");
    const competitorName = competitor.charAt(0).toUpperCase() + competitor.slice(1);

    return {
        title: `Best Free ${competitorName} Alternative for Windows - Drift`,
        description: `Looking for a ${competitorName} alternative? Drift is a free, cinema-grade screen recorder with auto-zoom and no watermarks.`,
        alternates: {
            canonical: `https://drift.dvkk.dev/compare/${params.slug}`,
        },
    };
}

export default async function ComparePage(props) {
    const params = await props.params;
    const { slug } = params;
    if (!slug.endsWith("-alternative")) {
        notFound();
    }

    const competitor = slug.replace("-alternative", "");
    const competitorName = competitor.charAt(0).toUpperCase() + competitor.slice(1);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navbar />
            <main className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-mono text-4xl md:text-6xl font-bold uppercase mb-8 text-center">
                        Better than <span className="brutal-highlight-pink text-white px-2">{competitorName}</span>
                    </h1>

                    <div className="brutal-card bg-[var(--bg-secondary)] p-8 mb-12">
                        <h2 className="font-mono text-xl md:text-2xl font-bold uppercase mb-6">
                            Why switch to Drift?
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full font-mono text-left border-collapse">
                                <thead>
                                    <tr className="border-b-[4px] border-[var(--border-default)]">
                                        <th className="py-4 px-4 uppercase bg-[var(--bg-tertiary)]">Feature</th>
                                        <th className="py-4 px-4 uppercase bg-[var(--brutal-yellow)]">Drift</th>
                                        <th className="py-4 px-4 uppercase bg-[var(--bg-tertiary)] opacity-60">{competitorName}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b-[2px] border-[var(--border-default)]">
                                        <td className="py-4 px-4 font-bold">Cost</td>
                                        <td className="py-4 px-4 font-bold text-green-600">Free Forever</td>
                                        <td className="py-4 px-4">Likely Paid</td>
                                    </tr>
                                    <tr className="border-b-[2px] border-[var(--border-default)]">
                                        <td className="py-4 px-4 font-bold">Watermark</td>
                                        <td className="py-4 px-4 font-bold text-green-600">None</td>
                                        <td className="py-4 px-4">Often Yes (Free ver)</td>
                                    </tr>
                                    <tr className="border-b-[2px] border-[var(--border-default)]">
                                        <td className="py-4 px-4 font-bold">Auto Zoom</td>
                                        <td className="py-4 px-4 font-bold text-green-600">Cinematic AI</td>
                                        <td className="py-4 px-4">Manual / None</td>
                                    </tr>
                                    <tr className="border-b-[2px] border-[var(--border-default)]">
                                        <td className="py-4 px-4 font-bold">Privacy</td>
                                        <td className="py-4 px-4 font-bold text-green-600">100% Local</td>
                                        <td className="py-4 px-4">Cloud Uploads</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="text-center">
                        <a href="/" className="brutal-button inline-flex items-center gap-2 text-xl px-8 py-4">
                            <span>Get Drift for Free</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
