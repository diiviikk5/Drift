"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./WaitlistForm.module.css";

export default function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState("");

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setStatus("error");
            setErrorMessage("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            setStatus("error");
            setErrorMessage("Please enter a valid email address");
            return;
        }

        setStatus("loading");

        // Simulate API delay (replace with actual API call later)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Store in localStorage for now
        try {
            const existingEmails = JSON.parse(localStorage.getItem("drift_waitlist") || "[]");

            if (existingEmails.includes(email.toLowerCase())) {
                setStatus("error");
                setErrorMessage("You're already on the waitlist!");
                return;
            }

            existingEmails.push(email.toLowerCase());
            localStorage.setItem("drift_waitlist", JSON.stringify(existingEmails));

            setStatus("success");
            setEmail("");
        } catch (err) {
            setStatus("success"); // Still show success even if localStorage fails
        }
    };

    return (
        <section className={styles.waitlist} id="waitlist">
            <div className={styles.container}>
                {/* Glow background */}
                <div className={styles.glow} />

                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                >
                    <span className={styles.label}>Early Access</span>

                    <h2 className={styles.title}>
                        Be the first to <span className={styles.highlight}>Drift</span>
                    </h2>

                    <p className={styles.subtitle}>
                        Join the waitlist to get early access when we launch.
                        <br />
                        No spam, just one email when it's ready.
                    </p>

                    <AnimatePresence mode="wait">
                        {status !== "success" ? (
                            <motion.form
                                key="form"
                                className={styles.form}
                                onSubmit={handleSubmit}
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className={styles.inputGroup}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (status === "error") setStatus("idle");
                                        }}
                                        placeholder="name@email.com"
                                        className={`${styles.input} ${status === "error" ? styles.inputError : ""}`}
                                        disabled={status === "loading"}
                                        aria-label="Email address"
                                    />
                                    <button
                                        type="submit"
                                        className={styles.button}
                                        disabled={status === "loading"}
                                    >
                                        {status === "loading" ? (
                                            <span className={styles.spinner} />
                                        ) : (
                                            <>
                                                Join Waitlist
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                    <polyline points="12 5 19 12 12 19" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {status === "error" && (
                                        <motion.p
                                            className={styles.error}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            {errorMessage}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                <p className={styles.privacy}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    Your email is safe with us. No spam, ever.
                                </p>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                className={styles.success}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className={styles.successIcon}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <h3 className={styles.successTitle}>You're on the list!</h3>
                                <p className={styles.successText}>
                                    We'll send you an email when Drift is ready to launch.
                                    <br />
                                    Thanks for your interest!
                                </p>

                                <div className={styles.socialShare}>
                                    <p className={styles.shareText}>Spread the word</p>
                                    <div className={styles.shareButtons}>
                                        <a
                                            href={`https://twitter.com/intent/tweet?text=Just joined the waitlist for Drift - a cinema-grade screen recording studio that runs in the browser! Zero cost, privacy-first. Check it out:`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.shareButton}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className={styles.stats}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>$0</span>
                        <span className={styles.statLabel}>Forever Free</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>100%</span>
                        <span className={styles.statLabel}>Local Processing</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>0</span>
                        <span className={styles.statLabel}>Data Uploaded</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
