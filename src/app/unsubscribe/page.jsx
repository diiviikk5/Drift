"use client";

import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Unsubscribe() {
    return (
        <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[var(--brutal-pink)] selection:text-white flex flex-col">
            <Navbar />

            <section className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-20">
                {/* Grid Background */}
                <div className="absolute inset-0 brutal-grid-bg" />

                <div className="relative z-10 max-w-lg w-full">
                    <motion.div
                        className="brutal-card !bg-[var(--bg-secondary)] text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-16 h-16 mx-auto bg-[var(--brutal-yellow)] border-[3px] border-[var(--border-default)] flex items-center justify-center mb-6 shadow-[4px_4px_0px_var(--border-default)]">
                            <svg className="w-8 h-8 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <h1 className="font-mono font-bold text-3xl uppercase mb-4">Unsubscribe</h1>

                        <p className="font-mono text-[var(--text-secondary)] mb-8">
                            We're sorry to see you go. To unsubscribe from Drift updates, please click the button below to send us a request, or reply to the email you received.
                        </p>

                        <a
                            href="mailto:hello@dvkk.dev?subject=Unsubscribe Request&body=Please unsubscribe me from the Drift waitlist."
                            className="brutal-button block w-full text-center"
                        >
                            Send Unsubscribe Request
                        </a>

                        <p className="mt-6 text-xs font-mono text-[var(--text-muted)]">
                            We will process your request within 24 hours.
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
