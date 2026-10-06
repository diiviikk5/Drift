'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
    const reduce = useReducedMotion();
    const [open, setOpen] = useState(false);

    // Click (or tap) pulls the frame apart; click again to put it back together.
    const spring = reduce ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 15, mass: 0.9 };
    const lift = (n, i) => ({ z: open ? n : i * 2, transition: { ...spring, delay: reduce ? 0 : (open ? i * 0.09 : (3 - i) * 0.05) } });
    const cam = open
        ? { left: '40%', top: '32%', width: '52%', height: '40%' }
        : { left: '0%', top: '0%', width: '100%', height: '100%' };
    const toggle = () => setOpen(o => !o);

    return (
        <section id="layers" className={s.section}>
            <div className={`${s.container} ${s.layersGrid}`}>
                <div>
                    <span className={s.kicker}>How it looks</span>
                    <h2 className={s.h2}>Every frame is four layers.</h2>
                    <p className={s.sub}>
                        Drift keeps them apart until export, so each one gets done properly. Click the frame to pull it apart.
                    </p>
                    <div className={s.layerList}>
                        {LAYERS.map((l, i) => (
                            <div key={l.n} className={`${s.layerItem} ${s.layerOn}`}>
                                <div className={`${s.layerNum} ${s.mono}`}>{l.n}</div>
                                <div>
                                    <div className={s.layerTitle}>{l.title}</div>
                                    <p className={s.layerText}>{l.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" className={`${s.btn} ${s.btnPaper}`} style={{ marginTop: 26 }} onClick={toggle} aria-pressed={open}>
                        {open ? 'Put it back together' : 'Explode the frame'}
                    </button>
                </div>

                <div className={s.stage} onClick={toggle} role="button" tabIndex={0} aria-label={open ? 'Put the frame back together' : 'Pull the frame apart into its layers'}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}>
                    <div className={s.iso}>
                        <div className={s.isoShadow} />
                        <div className={`${s.isoLayer} ${s.isoWall}`} style={{ backgroundImage: 'url(/backgrounds/violet-peaks.jpg)' }}>
                            <motion.div className={s.isoLabel} animate={{ opacity: open ? 1 : 0 }}><b>01</b>Wallpaper</motion.div>
                        </div>
                        <motion.div className={`${s.isoLayer} ${s.isoRec}`} initial={false} animate={lift(58, 1)}>
                            <FakeApp />
                            <motion.div className={s.isoLabel} animate={{ opacity: open ? 1 : 0 }}><b>02</b>Recording</motion.div>
                        </motion.div>
                        <motion.div className={s.isoCamWrap} initial={false} animate={lift(122, 2)}>
                            <motion.div className={s.isoCam} initial={false} animate={cam} transition={reduce ? { duration: 0 } : { duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: open ? 0.35 : 0 }}>
                                <motion.div className={s.isoLabel} animate={{ opacity: open ? 1 : 0 }}><b>03</b>Camera 1.35×</motion.div>
                            </motion.div>
                        </motion.div>
                        <motion.div className={s.isoCursorWrap} initial={false} animate={lift(190, 3)}>
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
