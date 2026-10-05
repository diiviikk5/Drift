/**
 * InteractionAnalyzer — automatic zoom planner (the "editor").
 *
 * Decides *when* to zoom, *how much* and *where*, instead of zooming on
 * every click:
 *
 *  1. Collect intent signals: clicks, keyboard shortcuts / navigation keys,
 *     typing bursts and moments where the cursor settles after a deliberate
 *     move (dwell). Actions off the recorded screen are ignored.
 *  2. Group signals into work sessions. A session continues while signals keep
 *     arriving (gap below `idleGap`) and stay in an area that still fits a
 *     zoomed viewport.
 *  3. Each session gets a depth (the preset for ordinary work, deeper for
 *     sustained detail work, shallower when spread out) and a focus at the
 *     weighted centre of that activity.
 *  4. Shot economy: quick neighbours merge into a wider shot, bursts of quick
 *     hops across the screen stay on the full frame, and shots that couldn't
 *     be watched for a moment are skipped.
 *
 * Segments are emitted in the studio's focus-segment format with the time of
 * their first and last action. The camera (cameraTrack.js) plans the actual
 * moves: it lands on the first action, holds, and reframes only when needed.
 */

import { DEFAULT_ZOOM_SCALE } from './ZoomConstruct.js';

export const AUTO_ZOOM_DEFAULTS = Object.freeze({
    preRoll: 0.55,          // start zooming this long before the first action so we arrive on time
    holdAfter: 1.6,         // keep the zoom this long after the last action so viewers can read the result
    idleGap: 2.6,           // a pause longer than this ends a session
    bridgeGap: 1.6,         // sessions closer than this are joined by a pan instead of a zoom-out
    minSegmentDuration: 2.4, // a shot must be worth the trip: move in plus time to read
    minZoom: 1.25,          // never bother with a zoom shallower than this
    maxZoomBoost: 1.12,     // tight work may zoom up to preset * boost
    hopGap: 1.4,            // actions closer than this in time belong to one burst
    minRunZoom: 1.15,       // a burst that doesn't fit at this zoom stays on the full frame
    minShotHold: 1.0,       // a shot must be watchable this long before the next action elsewhere
    fitMargin: 0.14,        // breathing room (normalized) around the session's activity box
    maxSessionSpan: 0.45,   // activity spread (normalized) above which a session is split (fits at ~1.5x)
    minActionTime: 0.35,    // ignore the click that starts the recording
    endGuard: 0.35,         // stop planning this close to the end of the recording
    dwellMinDuration: 0.7,  // cursor must settle this long to count as attention
    dwellMaxDuration: 4.0,
    dwellRadius: 0.012,
    dwellMinTravel: 0.08,   // ...and only after it actually travelled somewhere
});

const NAV_KEY = /^(Enter|Tab|Esc|Backspace|Del|Space|↑|↓|←|→|PgUp|PgDn|Home|End)$/;

function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
}

function quantile(sorted, q) {
    if (!sorted.length) return 0;
    const pos = (sorted.length - 1) * q;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export class InteractionAnalyzer {
    constructor(options = {}) {
        this.options = {
            ...AUTO_ZOOM_DEFAULTS,
            defaultZoomScale: DEFAULT_ZOOM_SCALE,
            enableDwellZooms: true,
            sourceWidth: 1920,
            sourceHeight: 1080,
            ...options,
        };
        // Legacy option names
        if (options.minClickTime != null) this.options.minActionTime = options.minClickTime;
    }

    /**
     * @param {Array<{x:number,y:number,time:number}>} clicks time in ms (or seconds for short legacy inputs)
     * @param {Array<{x:number,y:number,time:number}>} mouseSamples time in ms
     * @param {number} totalDurationSec
     * @param {Array<{time:number,text:string}>} keystrokes time in seconds
     * @returns {Array<Object>} focus segments
     */
    analyze(clicks = [], mouseSamples = [], totalDurationSec = 10, keystrokes = []) {
        const o = this.options;
        const duration = Number.isFinite(totalDurationSec) && totalDurationSec > 0 ? totalDurationSec : 10;
        const moves = this._normalizeMoves(mouseSamples);
        const signals = [
            ...this._clickSignals(clicks, duration),
            ...this._keySignals(keystrokes, moves),
            ...(o.enableDwellZooms ? this._dwellSignals(moves) : []),
        ]
            .filter(s => s.time >= o.minActionTime && s.time <= duration - o.endGuard)
            .sort((a, b) => a.time - b.time);

        if (!signals.length) return [];

        const sessions = this._buildSessions(signals);
        const planned = sessions
            .filter(sess => sess.signals.some(s => s.strong))
            .map(sess => this._planSession(sess, moves, duration));

        return this._finalize(this._economize(planned), duration);
    }

    _normalizeX(v) {
        return clamp(v > 1 ? v / (this.options.sourceWidth || 1920) : v, 0, 1);
    }

    _normalizeY(v) {
        return clamp(v > 1 ? v / (this.options.sourceHeight || 1080) : v, 0, 1);
    }

    _normalizeMoves(samples) {
        return (samples || [])
            .map(s => ({
                t: (s.timeMs ?? s.time ?? s.t ?? 0) / 1000,
                x: this._normalizeX(s.cx ?? s.x ?? 0.5),
                y: this._normalizeY(s.cy ?? s.y ?? 0.5),
                hidden: Boolean(s.hidden),
            }))
            .filter(s => Number.isFinite(s.t) && Number.isFinite(s.x) && Number.isFinite(s.y))
            .sort((a, b) => a.t - b.t);
    }

    _clickSignals(clicks, duration) {
        // Clicks outside the recorded screen (another monitor) aren't in the video.
        const list = (clicks || []).filter(c => !c.hidden);
        if (!list.length) return [];
        // Recorder clicks are in ms; tolerate legacy second-based inputs.
        const maxRaw = list.reduce((m, c) => Math.max(m, c.time ?? c.t ?? 0), 0);
        const isMs = maxRaw > duration + 1 || maxRaw >= 20 || list.some(c => (c.time ?? c.t ?? 0) > 10);
        return list.map(c => {
            const raw = c.time ?? c.t ?? 0;
            return {
                time: isMs ? raw / 1000 : raw,
                x: this._normalizeX(c.x ?? c.cx ?? 0.5),
                y: this._normalizeY(c.y ?? c.cy ?? 0.5),
                weight: c.button === 'right' ? 0.8 : 1,
                strong: true,
                kind: 'click',
            };
        });
    }

    _cursorAt(moves, t) {
        if (!moves.length) return null;
        let lo = 0;
        let hi = moves.length - 1;
        while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (moves[mid].t <= t) lo = mid; else hi = mid - 1;
        }
        return moves[lo];
    }

    _keySignals(keystrokes, moves) {
        if (!keystrokes || !keystrokes.length || !moves.length) return [];
        const keys = keystrokes
            .filter(k => k && (typeof k.text === 'string' || k.typed))
            .map(k => ({ ...k, timeSec: (k.time ?? 0) > 1000 ? k.time / 1000 : (k.time ?? 0) }))
            .sort((a, b) => a.timeSec - b.timeSec);
        const typedTimes = keys.filter(k => k.typed).map(k => k.timeSec);
        const typingBurst = (t) => typedTimes.some(o => o !== t && Math.abs(o - t) <= 1.5);

        return keys
            .map(k => {
                const time = k.timeSec;
                const c = this._cursorAt(moves, time);
                if (!c || c.hidden) return null;
                if (k.typed) {
                    // Typing is the classic "zoom in here" moment; a lone stray key is not.
                    return { time, x: c.x, y: c.y, weight: 0.7, strong: typingBurst(time), kind: 'type' };
                }
                const key = (k.text || '').split('+').pop();
                const isNav = NAV_KEY.test(key);
                // Shortcuts are deliberate actions; bare navigation keys only extend sessions.
                return { time, x: c.x, y: c.y, weight: 0.6, strong: !isNav, kind: 'key' };
            })
            .filter(Boolean);
    }

    _dwellSignals(moves) {
        const o = this.options;
        if (moves.length < 8) return [];
        moves = moves.filter(m => !m.hidden);
        if (moves.length < 8) return [];
        const out = [];
        let anchor = 0;
        let travel = 0; // path length since the last accepted dwell

        // The recorder only emits samples while the mouse moves, so a dwell
        // ends at the timestamp of the first sample that leaves the bubble.
        const consider = (leaveTime) => {
            const a = moves[anchor];
            const dur = leaveTime - a.t;
            if (dur >= o.dwellMinDuration && dur <= o.dwellMaxDuration && travel >= o.dwellMinTravel) {
                out.push({ time: a.t + Math.min(0.25, dur / 2), x: a.x, y: a.y, weight: 0.45, strong: false, kind: 'dwell' });
                travel = 0;
            }
        };

        for (let i = 1; i < moves.length; i++) {
            const a = moves[anchor];
            const m = moves[i];
            if (Math.hypot(m.x - a.x, m.y - a.y) > o.dwellRadius) {
                consider(m.t);
                travel += Math.hypot(m.x - moves[i - 1].x, m.y - moves[i - 1].y);
                anchor = i;
            }
        }
        consider(moves[moves.length - 1].t);
        return out;
    }

    _buildSessions(signals) {
        const o = this.options;
        const sessions = [];
        let cur = null;

        for (const sig of signals) {
            if (cur) {
                const gap = sig.time - cur.lastTime;
                const minX = Math.min(cur.minX, sig.x);
                const maxX = Math.max(cur.maxX, sig.x);
                const minY = Math.min(cur.minY, sig.y);
                const maxY = Math.max(cur.maxY, sig.y);
                const span = Math.max(maxX - minX, maxY - minY);
                if (gap <= o.idleGap && span <= o.maxSessionSpan) {
                    cur.signals.push(sig);
                    cur.lastTime = sig.time;
                    Object.assign(cur, { minX, maxX, minY, maxY });
                    continue;
                }
                sessions.push(cur);
            }
            cur = {
                signals: [sig],
                firstTime: sig.time,
                lastTime: sig.time,
                minX: sig.x, maxX: sig.x, minY: sig.y, maxY: sig.y,
            };
        }
        if (cur) sessions.push(cur);
        return sessions;
    }

    _planSession(sess, moves, duration) {
        const o = this.options;
        const strong = sess.signals.filter(s => s.strong);
        const anchors = strong.length ? strong : sess.signals;

        const startTime = Math.max(0, anchors[0].time - o.preRoll);
        const lastAction = sess.signals[sess.signals.length - 1].time;
        const endTime = Math.min(duration - o.endGuard * 0.5, lastAction + o.holdAfter);

        // Activity box: action points plus where the cursor actually spent the
        // session (robust 10-90% range so a stray flick doesn't widen the zoom).
        const xs = sess.signals.map(s => s.x);
        const ys = sess.signals.map(s => s.y);
        const during = moves.filter(m => !m.hidden && m.t >= anchors[0].time && m.t <= lastAction);
        if (during.length >= 6) {
            const mx = during.map(m => m.x).sort((a, b) => a - b);
            const my = during.map(m => m.y).sort((a, b) => a - b);
            xs.push(quantile(mx, 0.1), quantile(mx, 0.9));
            ys.push(quantile(my, 0.1), quantile(my, 0.9));
        }
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const wSum = sess.signals.reduce((a, s) => a + s.weight, 0) || 1;
        const cx = sess.signals.reduce((a, s) => a + s.x * s.weight, 0) / wSum;
        const cy = sess.signals.reduce((a, s) => a + s.y * s.weight, 0) / wSum;
        // Blend weighted centre with the box centre so the whole box stays framed.
        const targetX = clamp(cx * 0.5 + (minX + maxX) * 0.25, 0, 1);
        const targetY = clamp(cy * 0.5 + (minY + maxY) * 0.25, 0, 1);

        const span = Math.max(maxX - minX, maxY - minY) + o.fitMargin * 2;
        const fitZoom = span > 0 ? 1 / span : Infinity;
        const zoomScale = this._depth(fitZoom, sess.signals.length);

        return {
            startTime,
            endTime,
            actionTime: anchors[0].time,
            actions: sess.signals.length,
            lastAction,
            box: { minX, maxX, minY, maxY },
            weightedX: cx,
            weightedY: cy,
            targetX,
            targetY,
            zoomScale,
            reason: anchors[0].kind === 'click' ? 'click' : (anchors[0].kind === 'type' ? 'key' : anchors[0].kind),
            clickCount: sess.signals.filter(s => s.kind === 'click').length,
        };
    }

    /**
     * Zoom depth: the preset for ordinary work, a little deeper only for
     * sustained detail work (3+ actions in a tight spot), shallower when the
     * work is spread out.
     */
    _depth(fitZoom, actions) {
        const o = this.options;
        const cap = actions >= 3 ? o.defaultZoomScale * (o.maxZoomBoost ?? 1) : o.defaultZoomScale;
        return Math.round(clamp(fitZoom, o.minZoom, Math.max(o.minZoom, cap)) * 100) / 100;
    }

    /**
     * Shot economy. A camera that hops after every quick action is exhausting
     * to watch, so bursts of actions in quick succession are framed together:
     * neighbours that fit one comfortable zoom merge into a wider shot, and a
     * burst of three or more hops that spans too much of the screen stays on
     * the full frame.
     */
    _economize(planned) {
        const o = this.options;
        const shots = planned.slice().sort((a, b) => a.actionTime - b.actionTime);
        const fitOf = (box) => {
            const span = Math.max(box.maxX - box.minX, box.maxY - box.minY) + o.fitMargin * 2;
            return span > 0 ? 1 / span : Infinity;
        };
        const union = (a, b) => ({
            minX: Math.min(a.minX, b.minX), maxX: Math.max(a.maxX, b.maxX),
            minY: Math.min(a.minY, b.minY), maxY: Math.max(a.maxY, b.maxY),
        });
        const merge = (a, b) => {
            const box = union(a.box, b.box);
            const fitZoom = fitOf(box);
            const wa = a.clickCount + 1;
            const wb = b.clickCount + 1;
            const cx = (a.weightedX * wa + b.weightedX * wb) / (wa + wb);
            const cy = (a.weightedY * wa + b.weightedY * wb) / (wa + wb);
            return {
                ...a,
                endTime: Math.max(a.endTime, b.endTime),
                lastAction: Math.max(a.lastAction, b.lastAction),
                box,
                weightedX: cx,
                weightedY: cy,
                targetX: clamp(cx * 0.5 + (box.minX + box.maxX) * 0.25, 0, 1),
                targetY: clamp(cy * 0.5 + (box.minY + box.maxY) * 0.25, 0, 1),
                zoomScale: Math.min(this._depth(fitZoom, a.actions + b.actions), Math.round(fitZoom * 100) / 100),
                clickCount: a.clickCount + b.clickCount,
                actions: a.actions + b.actions,
            };
        };

        // 1. Merge quick neighbours: there is no time to pan between them, so
        // a wider shot that holds both reads better than a rushed move.
        const merged = [];
        for (const shot of shots) {
            const prev = merged[merged.length - 1];
            if (prev && shot.actionTime - prev.lastAction < o.hopGap && fitOf(union(prev.box, shot.box)) >= o.minRunZoom) {
                merged[merged.length - 1] = merge(prev, shot);
            } else {
                merged.push(shot);
            }
        }

        // 2. Runs of quick hops: one wide shot if it fits, otherwise none.
        const out = [];
        let i = 0;
        while (i < merged.length) {
            let j = i;
            while (j + 1 < merged.length && merged[j + 1].actionTime - merged[j].lastAction < o.hopGap) j++;
            const run = merged.slice(i, j + 1);
            if (run.length >= 3) {
                const all = run.reduce((acc, r) => merge(acc, r));
                if (fitOf(all.box) >= o.minRunZoom) out.push(all);
            } else {
                out.push(...run);
            }
            i = j + 1;
        }

        // 3. A shot that can't be held for a moment before the next one takes
        // over isn't worth the trip: go straight to the next shot.
        return out.filter((shot, k) => {
            const next = out[k + 1];
            return !next || next.actionTime - shot.lastAction >= o.minShotHold;
        });
    }

    _finalize(planned, duration) {
        const o = this.options;
        const out = [];
        for (const seg of planned.sort((a, b) => a.startTime - b.startTime)) {
            const prev = out[out.length - 1];
            if (prev) {
                if (seg.startTime < prev.endTime) {
                    // Overlap: hand over at the midpoint so both keep their lead-in/hold.
                    const mid = Math.max(prev.startTime + 0.5, (prev.endTime + seg.startTime) / 2);
                    prev.endTime = mid;
                    seg.startTime = mid;
                } else if (seg.startTime - prev.endTime < o.bridgeGap) {
                    // Short gap: hold the previous framing until the camera pans over.
                    prev.endTime = seg.startTime;
                }
            }
            out.push(seg);
        }

        return out
            .filter(seg => seg.clickCount > 0 || seg.endTime - seg.startTime >= 0.8)
            .map(seg => {
                if (seg.endTime - seg.startTime < o.minSegmentDuration) {
                    seg.endTime = Math.min(duration, seg.startTime + o.minSegmentDuration);
                }
                return seg;
            })
            .map((seg, i, arr) => {
                const next = arr[i + 1];
                const endTime = next ? Math.min(seg.endTime, next.startTime) : seg.endTime;
                return {
                    id: `focus_seg_${i}_${Math.round(seg.startTime * 10)}`,
                    actionTime: Math.round(seg.actionTime * 1000) / 1000,
                    lastActionTime: Math.round(seg.lastAction * 1000) / 1000,
                    startTime: Math.round(seg.startTime * 1000) / 1000,
                    endTime: Math.round(Math.max(seg.startTime + 0.2, endTime) * 1000) / 1000,
                    targetX: seg.targetX,
                    targetY: seg.targetY,
                    zoomScale: seg.zoomScale,
                    reason: seg.reason,
                    sceneMode: 'focus',
                    followCursor: true,
                    auto: true,
                };
            });
    }
}
