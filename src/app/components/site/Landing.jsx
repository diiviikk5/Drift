'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import s from './site.module.css';
import LayersSection from './LayersSection';
import { ZoomArt, CursorArt, TypingArt, ScrollArt, SizeArt, PrivateArt } from './IsoArt';
import { useTheme } from '../ThemeProvider';
import ProductHuntBadge from '../ProductHuntBadge';

// Drift Recorder is the current app; the 2.0 installer stays up as Legacy Drift.
const DOWNLOAD_URL = '/downloads/Drift-Recorder_3.1.0_x64-setup.exe';
// macOS and Linux builds come from CI and live on the GitHub release.
const RELEASE_URL = 'https://github.com/diiviikk5/Drift/releases/download/v3.1.0';
const DOWNLOADS = {
    windows: { url: DOWNLOAD_URL, label: 'Windows', note: 'Windows 10 & 11 · 4.4 MB' },
    mac: { url: `${RELEASE_URL}/Drift-Recorder_3.1.0_mac-universal.dmg`, label: 'macOS', note: 'macOS 11+ · Apple Silicon & Intel · beta' },
    linux: { url: `${RELEASE_URL}/Drift-Recorder_3.1.0_linux-x86_64.AppImage`, label: 'Linux', note: 'Linux x86-64 · X11 session · beta' },
};
const DEB_URL = `${RELEASE_URL}/Drift-Recorder_3.1.0_linux-amd64.deb`;

/** The visitor's desktop OS; Windows until the browser says otherwise. */
function useVisitorOs() {
    const [os, setOs] = useState('windows');
    useEffect(() => {
        const p = `${navigator.userAgentData?.platform || ''} ${navigator.platform || ''} ${navigator.userAgent || ''}`;
        if (/Mac|iPhone|iPad/i.test(p)) setOs('mac');
        else if (/Linux|X11|CrOS/i.test(p) && !/Android/i.test(p)) setOs('linux');
    }, []);
    return os;
}
const LEGACY_URL = '/downloads/Drift_2.0.0_x64-setup.exe';
const REPO_URL = 'https://github.com/diiviikk5/Drift';
const PH_URL = 'https://www.producthunt.com/products/drift-6?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_campaign=badge-drift-6ef740e8-671a-4130-90b6-140b7784af27';
const DEMO = { src: '/demo/drift-demo.mp4', poster: '/demo/drift-demo.jpg' };

const FEATURES = [
    { art: <ZoomArt />, title: 'Zooms with taste', text: 'Drift zooms when you type or work in one spot, holds while it matters, then gets out of the way. No yo-yo.' },
    { art: <CursorArt />, title: 'A cursor that glides', text: 'Hand jitter becomes clean arcs that still land exactly on every click. Make it big so nobody loses it.' },
    { art: <TypingArt />, title: 'Typing, in focus', text: 'The camera follows the text caret while you type and tucks the pointer away so the words stay readable.' },
    { art: <ScrollArt />, title: 'Scroll-aware', text: 'Drift sees the page move, even on touchpads, and stays wide instead of chasing the scrollbar.' },
    { art: <SizeArt />, title: 'Tiny and native', text: 'Rust and Tauri, not a bundled browser. Small download, instant start, GPU capture.' },
    { art: <PrivateArt />, title: 'Private by default', text: 'No account, no upload, no watermark. Recording, editing and export all stay on your computer.' },
];

const MARQUEE = ['No watermark', '60 fps', 'Auto zoom', 'Open source', 'No account', 'Export to 4K', 'Runs offline'];

function GitHubIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
    );
}

function WindowsIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 5.1 10.4 4v7.2H3V5.1Zm0 13.8 7.4 1.1v-7.1H3v6Zm8.3 1.2L21 21.5v-8.6h-9.7v7.2Zm0-16.2v7.3H21V2.5l-9.7 1.4Z" />
        </svg>
    );
}

function AppleIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.37-3.69ZM14.1 5.85c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.66 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.05-.52 2.68-1.27Z" />
        </svg>
    );
}

function LinuxIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2c-2.2 0-3.6 1.9-3.6 4.6 0 1.3.3 2.3-.5 3.6-.9 1.4-2.6 3.3-2.6 6 0 .7.1 1.3.4 1.8-.8.3-1.7.8-1.7 1.6 0 1 1.5 1.2 3.1 1.6 1.2.3 2 .8 2.9.8.8 0 1.4-.5 2-.5s1.2.5 2 .5c.9 0 1.7-.5 2.9-.8 1.6-.4 3.1-.6 3.1-1.6 0-.8-.9-1.3-1.7-1.6.3-.5.4-1.1.4-1.8 0-2.7-1.7-4.6-2.6-6-.8-1.3-.5-2.3-.5-3.6C15.6 3.9 14.2 2 12 2Zm-1.6 4.2c.4 0 .7.5.7 1.1s-.3 1.1-.7 1.1-.7-.5-.7-1.1.3-1.1.7-1.1Zm3.2 0c.4 0 .7.5.7 1.1s-.3 1.1-.7 1.1-.7-.5-.7-1.1.3-1.1.7-1.1ZM12 9.3c.8 0 1.9.5 1.9 1s-1.1 1-1.9 1-1.9-.5-1.9-1 1.1-1 1.9-1Z" />
        </svg>
    );
}

const OS_ICONS = { windows: WindowsIcon, mac: AppleIcon, linux: LinuxIcon };

/** Links to the builds for the other two systems. */
function OtherDownloads({ os }) {
    const link = { textDecoration: 'underline', textUnderlineOffset: 3 };
    const others = Object.entries(DOWNLOADS).filter(([key]) => key !== os);
    return (
        <>
            Also for{' '}
            {others.map(([key, d], i) => (
                <span key={key}>
                    {i > 0 && ' and '}
                    <a href={d.url} download style={link}>{d.label}</a>
                    {key === 'linux' && <> (<a href={DEB_URL} download style={link}>.deb</a>)</>}
                </span>
            ))}
            {os === 'linux' && <> · <a href={DEB_URL} download style={link}>Ubuntu/Debian .deb</a></>}
        </>
    );
}

function ThemeIcon({ dark }) {
    return dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
        </svg>
    ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
        </svg>
    );
}

function Reveal({ children, delay = 0, y = 22 }) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

const wordUp = {
    hidden: { y: '110%', rotate: 4 },
    show: (i) => ({ y: '0%', rotate: 0, transition: { delay: 0.08 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Landing() {
    const reduce = useReducedMotion();
    const { theme, toggleTheme } = useTheme();
    const dark = theme === 'dark';
    const [scrolled, setScrolled] = useState(false);
    const [stars, setStars] = useState(null);
    const os = useVisitorOs();
    const download = DOWNLOADS[os];
    const OsIcon = OS_ICONS[os];
    const showcase = useRef(null);

    // Overscroll / page edges match the site, not the app's default page colour.
    useEffect(() => {
        const root = document.documentElement;
        const prev = [root.style.background, document.body.style.background];
        const bg = dark ? '#0d0e12' : '#f3eee2';
        root.style.background = bg;
        document.body.style.background = bg;
        return () => { root.style.background = prev[0]; document.body.style.background = prev[1]; };
    }, [dark]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        fetch('https://api.github.com/repos/diiviikk5/Drift')
            .then(r => r.json())
            .then(d => { if (typeof d.stargazers_count === 'number') setStars(d.stargazers_count); })
            .catch(() => {});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // The recording sits on an isometric slab and flattens into view as you scroll.
    const { scrollYProgress } = useScroll({ target: showcase, offset: ['start end', 'start 0.18'] });
    const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.5 });
    const rotX = useTransform(p, [0, 1], [42, 0]);
    const rotZ = useTransform(p, [0, 1], [-14, 0]);
    const scale = useTransform(p, [0, 1], [0.8, 1]);
    const lift = useTransform(p, [0, 1], [80, 0]);

    const headline = [['Screen', 'recordings'], ['that', 'look']];

    return (
        <div className={s.site}>
            <div className={s.grid} />

            {/* ---------- nav ---------- */}
            <header className={`${s.nav} ${scrolled ? s.navScrolled : ''}`}>
                <div className={`${s.container} ${s.navInner}`}>
                    <a href="/" className={s.brand} aria-label="Drift home">
                        <span className={s.brandMark}><img src="/brand/drift-mark.png" alt="" width="40" height="40" /></span>
                        <span>Drift</span>
                    </a>
                    <nav className={s.navLinks} aria-label="Main">
                        <a className={`${s.navLink} ${s.hideMd}`} href="#layers">How it looks</a>
                        <a className={`${s.navLink} ${s.hideMd}`} href="#features">Features</a>
                        <a className={`${s.navLink} ${s.hideMd}`} href="#start">Get started</a>
                        <button type="button" className={`${s.btn} ${s.btnPaper} ${s.btnSm} ${s.iconBtn}`} onClick={toggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
                            <ThemeIcon dark={dark} />
                        </button>
                        <a className={`${s.btn} ${s.btnPaper} ${s.btnSm} ${s.hideMd}`} href={REPO_URL} target="_blank" rel="noreferrer">
                            <GitHubIcon />
                            <span>{stars != null ? stars : 'Star'}</span>
                        </a>
                        <a className={`${s.btn} ${s.btnSm}`} href={download.url} download>Download</a>
                    </nav>
                </div>
            </header>

            <main>
                {/* ---------- hero ---------- */}
                <section className={`${s.container} ${s.hero}`}>
                    <Reveal y={10}>
                        <div className={s.chips}>
                            <span className={s.chip}><span className={s.chipDot} />Free for Windows</span>
                            <span className={s.chip}>Open source</span>
                            <span className={`${s.chip} ${s.hideMd}`}>No watermark</span>
                        </div>
                    </Reveal>

                    <h1 className={s.h1}>
                        {headline.map((line, li) => (
                            <span key={li} className={s.h1Line}>
                                {line.map((w, wi) => (
                                    <span key={w} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.06em' }}>
                                        <motion.span
                                            className={s.h1Word}
                                            custom={li * 2 + wi}
                                            variants={wordUp}
                                            initial={reduce ? false : 'hidden'}
                                            animate="show"
                                        >
                                            {w}
                                        </motion.span>
                                        {wi < line.length - 1 || li === 1 ? ' ' : ''}
                                    </span>
                                ))}
                                {li === 1 && (
                                    <motion.span
                                        className={s.edited}
                                        initial={reduce ? false : { y: -140, rotate: -24, opacity: 0 }}
                                        animate={{ y: 0, rotate: -3, opacity: 1 }}
                                        transition={{ delay: 0.55, type: 'spring', stiffness: 260, damping: 14 }}
                                    >
                                        edited.
                                    </motion.span>
                                )}
                            </span>
                        ))}
                    </h1>

                    <Reveal delay={0.35}>
                        <p className={s.lead}>
                            Hit record and Drift does the editing: calm zooms where you work, a crisp cursor
                            that glides, and a backdrop that frames it. Straight to MP4.
                        </p>
                    </Reveal>

                    <Reveal delay={0.45}>
                        <div className={s.ctaRow}>
                            <a className={`${s.btn} ${s.btnLg}`} href={download.url} download>
                                <OsIcon />
                                Download for {download.label}
                            </a>
                            <a className={`${s.btn} ${s.btnLg} ${s.btnPaper}`} href={REPO_URL} target="_blank" rel="noreferrer">
                                <GitHubIcon />
                                Star on GitHub{stars != null ? ` · ${stars}` : ''}
                            </a>
                            <a className={s.ph} href={PH_URL} target="_blank" rel="noreferrer" aria-label="Drift on Product Hunt">
                                <ProductHuntBadge width={296} height={64} />
                            </a>
                        </div>
                        <p className={s.ctaNote}>
                            Drift Recorder 3.1 · {download.note} · No account needed · <OtherDownloads os={os} />
                            {os === 'windows' && (
                                <>
                                    {' · '}
                                    <a href={LEGACY_URL} download style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>Legacy Drift 2.0</a>
                                </>
                            )}
                        </p>
                    </Reveal>

                    {/* ---------- recording on an isometric slab ---------- */}
                    <div ref={showcase} className={s.showcase}>
                        <motion.div
                            className={s.slab}
                            style={reduce ? undefined : { rotateX: rotX, rotateZ: rotZ, scale, y: lift }}
                        >
                            <div className={s.slabBar}>
                                <span className={s.slabDot} style={{ background: '#ff5f57' }} />
                                <span className={s.slabDot} style={{ background: '#febc2e' }} />
                                <span className={s.slabDot} style={{ background: '#28c840' }} />
                                <span className={s.slabTitle}>pixpal-demo.mp4</span>
                                <span className={s.slabBadge}>Made with Drift</span>
                            </div>
                            <video
                                className={s.video}
                                src={DEMO.src}
                                poster={DEMO.poster}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                aria-label="A real recording exported from Drift: the full page, then an automatic zoom onto the editor."
                            />
                        </motion.div>
                    </div>
                </section>

                {/* ---------- marquee ---------- */}
                <div className={s.marquee} aria-hidden="true">
                    <div className={s.marqueeTrack}>
                        {[0, 1].map(k => (
                            <div key={k} style={{ display: 'inline-flex' }}>
                                {MARQUEE.map(m => (
                                    <span key={m + k} className={s.marqueeItem}><span className={s.marqueeStar} />{m}</span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ---------- layers ---------- */}
                <LayersSection />

                {/* ---------- features ---------- */}
                <section id="features" className={s.section}>
                    <div className={s.container}>
                        <Reveal>
                            <span className={s.kicker}>Features</span>
                            <h2 className={s.h2}>Made for demos people actually finish watching.</h2>
                        </Reveal>
                        <div className={s.features}>
                            {FEATURES.map((f, i) => (
                                <Reveal key={f.title} delay={(i % 3) * 0.07}>
                                    <article className={s.feature}>
                                        <div className={s.featureArt}>{f.art}</div>
                                        <h3 className={s.featureTitle}>{f.title}</h3>
                                        <p className={s.featureText}>{f.text}</p>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ---------- steps ---------- */}
                <section id="start" className={s.section} style={{ paddingTop: 0 }}>
                    <div className={s.container}>
                        <Reveal>
                            <span className={s.kicker}>Get started</span>
                            <h2 className={s.h2}>Three steps up.</h2>
                        </Reveal>
                        <div className={s.steps}>
                            <Reveal>
                                <div className={s.step}>
                                    <span className={`${s.keycap} ${s.stepKey} ${s.mono}`}>1</span>
                                    <div className={s.stepTitle}>Record</div>
                                    <p className={s.stepText}>
                                        Pick a screen or a window, press <span className={`${s.kbd} ${s.mono}`}>Alt+Shift+R</span> and
                                        do your thing. Drift waits in the tray.
                                    </p>
                                </div>
                            </Reveal>
                            <Reveal delay={0.08}>
                                <div className={s.step}>
                                    <span className={`${s.keycap} ${s.stepKey} ${s.mono}`}>2</span>
                                    <div className={s.stepTitle}>Review</div>
                                    <p className={s.stepText}>
                                        The studio opens with zooms already planned. Keep them, nudge them,
                                        pick a wallpaper and a cursor size.
                                    </p>
                                </div>
                            </Reveal>
                            <Reveal delay={0.16}>
                                <div className={s.step}>
                                    <span className={`${s.keycap} ${s.stepKey} ${s.mono}`}>3</span>
                                    <div className={s.stepTitle}>Export</div>
                                    <p className={s.stepText}>
                                        MP4 up to 4K at 60 fps, rendered on your machine. Post it before your coffee cools.
                                    </p>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ---------- final cta ---------- */}
                <section className={s.section} style={{ paddingTop: 20 }}>
                    <div className={s.container}>
                        <Reveal>
                            <div className={s.final}>
                                <div className={s.finalGrid} />
                                <div className={s.finalInner}>
                                    <motion.div
                                        className={s.finalMark}
                                        whileHover={reduce ? undefined : { rotate: 6, scale: 1.06 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                                    >
                                        <img src="/brand/drift-mark.png" alt="" width="92" height="92" />
                                    </motion.div>
                                    <h2 className={s.h2}>Your next demo, already edited.</h2>
                                    <p className={s.sub}>Record a minute of your product and see what Drift makes of it.</p>
                                    <div className={s.ctaRow}>
                                        <a className={`${s.btn} ${s.finalBtn}`} href={download.url} download>
                                            <OsIcon />
                                            Download for {download.label}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>
            </main>

            <footer className={s.footer}>
                <div className={`${s.container} ${s.footerRow}`}>
                    <a href="/" className={s.brand} style={{ fontSize: 18 }}>
                        <span className={s.brandMark} style={{ width: 32, height: 32 }}><img src="/brand/drift-mark.png" alt="" width="32" height="32" /></span>
                        <span>Drift</span>
                    </a>
                    <div className={s.footerLinks}>
                        <a className={s.navLink} href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
                        <a className={s.navLink} href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">Report a bug</a>
                        <a className={s.navLink} href="https://x.com/divikkk1" target="_blank" rel="noreferrer">X / @divikkk1</a>
                        <a className={s.navLink} href={PH_URL} target="_blank" rel="noreferrer">Product Hunt</a>
                    </div>
                    <span className={s.footerNote}>Made by Divik. Recorded with Drift.</span>
                </div>
            </footer>
        </div>
    );
}
