import Link from 'next/link';

export default function LabsNotFound() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
            <div className="fixed inset-0 brutal-dots-bg pointer-events-none" />

            <div className="relative z-10 text-center">
                <div className="inline-block mb-6">
                    <span className="brutal-badge-pink">404</span>
                </div>

                <h1 className="font-mono font-bold text-4xl md:text-5xl text-[var(--text-primary)] uppercase mb-4">
                    Tool Not Found
                </h1>

                <p className="font-mono text-[var(--text-muted)] text-lg max-w-md mx-auto mb-8">
                    The conversion or tool you're looking for doesn't exist.
                    Check out our available tools below.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/labs"
                        className="brutal-button"
                    >
                        Browse All Tools
                    </Link>
                    <Link
                        href="/"
                        className="brutal-button brutal-button-outline"
                    >
                        Back to Drift
                    </Link>
                </div>
            </div>
        </div>
    );
}
