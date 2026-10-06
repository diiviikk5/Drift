'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import s from './site.module.css';

const LAYERS = [
    { n: '01', title: 'Wallpaper', text: 'Hand-made backdrops, rounded corners and a soft shadow, so every clip looks deliberate.' },
    { n: '02', title: 'Your recording', text: 'Native 60 fps capture of a screen or one window, recorded without the system cursor.' },
    { n: '03', title: 'Camera', text: 'Calm, minimal zooms where you work. Scrolling and single clicks stay on the full frame.' },
    { n: '04', title: 'Cursor', text: 'Redrawn on top: bigger, crisp, gliding on smooth arcs, and still an I-beam over text.' },
];

function FakeApp() {
    return (
        <div className={s.app}>
            <div className={s.appBar}><i /><i /><i /></div>
            <div className={s.appBody}>
                <div className={s.appSide}>
                    <div className={`${s.bar} ${s.barLime}`} style={{ width: '70%' }} />
                    <div className={s.bar} style={{ width: '90%' }} />
                    <div className={s.bar} style={{ width: '60%' }} />
                    <div className={s.bar} style={{ width: '80%' }} />
                    <div className={s.bar} style={{ width: '50%' }} />
                </div>
                <div className={s.appMain}>
                    <div className={s.bar} style={{ width: '45%', height: 10, background: '#323a4d' }} />
                    <div className={s.bar} style={{ width: '75%' }} />
                    <div className={s.card} style={{ marginLeft: '30%' }}>
                        <div className={s.bar} style={{ width: '40%', height: 5 }} />
                        <div className={s.field}>
                            <div className={s.bar} style={{ width: 26, height: 4, background: '#e8ecf4' }} />
                            <div className={s.caret} />
                        </div>
                        <div className={s.field} style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                        <div className={`${s.bar} ${s.barLime}`} style={{ width: 40, height: 9, alignSelf: 'flex-end', borderRadius: 4 }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Arrow() {
    return (
        <svg width="40" height="54" viewBox="0 0 17 23" aria-hidden="true" style={{ display: 'block', filter: 'drop-shadow(3px 3px 0 #0b0b0d)' }}>
            <path d="M1 1 L1 18.2 L5.1 14.4 L7.9 20.9 Q8.3 21.8 9.2 21.4 L11.1 20.6 Q12 20.2 11.6 19.3 L8.9 13.1 L14.4 13.1 Z"
                fill="#ffffff" stroke="#0b0b0d" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
    );
}

export default function LayersSection() {
    const track = useRef(null);
    const reduce = useReducedMotion();
    const [narrow, setNarrow] = useState(false);
    const [active, setActive] = useState(-1);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)');
        const on = () => setNarrow(mq.matches);
        on();
        mq.addEventListener('change', on);
        return () => mq.removeEventListener('change', on);
    }, []);

    const { scrollYProgress } = useScroll({
        target: track,
        offset: narrow ? ['start 0.85', 'end 0.4'] : ['start start', 'end end'],
    });
    const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

    // Layers lift one after another.
    const zRec = useTransform(p, [0.05, 0.3], [2, 58]);
    const zCam = useTransform(p, [0.25, 0.5], [4, 122]);
    const zCur = useTransform(p, [0.45, 0.7], [6, 190]);
    // The camera then pulls in onto the text field.
    const camL = useTransform(p, [0.6, 0.85], ['0%', '40%']);
    const camT = useTransform(p, [0.6, 0.85], ['0%', '32%']);
    const camW = useTransform(p, [0.6, 0.85], ['100%', '52%']);
    const camH = useTransform(p, [0.6, 0.85], ['100%', '40%']);
    const labels = useTransform(p, [0.08, 0.2], [0, 1]);

    useMotionValueEvent(p, 'change', (v) => {
        const i = v < 0.08 ? -1 : v < 0.3 ? 0 : v < 0.5 ? 1 : v < 0.7 ? 2 : 3;
        setActive(i);
    });

    const still = reduce;
    return (
        <section id="layers" ref={track} className={s.layersTrack}>
            <div className={`${s.container} ${s.layersSticky}`}>
                <div>
                    <span className={s.kicker}>How it looks</span>
                    <h2 className={s.h2}>Every frame is four layers.</h2>
                    <p className={s.sub}>
                        Drift keeps them apart until export, so each one gets done properly. Keep scrolling.
                    </p>
                    <div className={s.layerList}>
                        {LAYERS.map((l, i) => (
                            <div key={l.n} className={`${s.layerItem} ${(still || i <= active) ? s.layerOn : ''}`}>
                                <div className={`${s.layerNum} ${s.mono}`}>{l.n}</div>
                                <div>
                                    <div className={s.layerTitle}>{l.title}</div>
                                    <p className={s.layerText}>{l.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={s.stage} aria-hidden="true">
                    <div className={s.iso}>
                        <div className={s.isoShadow} />
                        <div className={`${s.isoLayer} ${s.isoWall}`} style={{ backgroundImage: 'url(/backgrounds/violet-peaks.jpg)' }}>
                            <motion.div className={s.isoLabel} style={{ opacity: still ? 1 : labels }}><b>01</b>Wallpaper</motion.div>
                        </div>
                        <motion.div className={`${s.isoLayer} ${s.isoRec}`} style={{ z: still ? 58 : zRec }}>
                            <FakeApp />
                            <motion.div className={s.isoLabel} style={{ opacity: still ? 1 : labels }}><b>02</b>Recording</motion.div>
                        </motion.div>
                        <motion.div className={s.isoCamWrap} style={{ z: still ? 122 : zCam }}>
                            <motion.div
                                className={s.isoCam}
                                style={still
                                    ? { left: '40%', top: '32%', width: '52%', height: '40%' }
                                    : { left: camL, top: camT, width: camW, height: camH }}
                            >
                                <motion.div className={s.isoLabel} style={{ opacity: still ? 1 : labels }}><b>03</b>Camera 1.35×</motion.div>
                            </motion.div>
                        </motion.div>
                        <motion.div className={s.isoCursorWrap} style={{ z: still ? 190 : zCur }}>
                            <div className={s.isoCursor}>
                                {/* billboard: face the viewer */}
                                <div style={{ transform: 'rotateZ(40deg) rotateX(-56deg)', transformOrigin: '0 0' }}>
                                    <Arrow />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
