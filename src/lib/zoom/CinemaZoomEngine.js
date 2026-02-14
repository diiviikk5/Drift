/**
 * Cinema Zoom Engine — 3-Layer Architecture
 * Modeled after Cap / Screen Studio / Cursorfull with "Camera Following Attention" UX.
 * 
 * THREE LAYERS:
 * 
 * 1. ZOOM STATE MACHINE
 *    IDLE → ZOOMING_IN → ACTIVE_TRACKING → ZOOMING_OUT → IDLE
 *    Zoom is a MODE, not an action. First click activates it.
 *    While active, subsequent clicks only update the focal point.
 * 
 * 2. ACTIVITY SCORE (continuous 0–1)
 *    Combines: clickBurstRate + movementIntensity + recentInteractionWeight
 *    Decays smoothly over time. Drives probabilistic zoom-out:
 *    - Score > ZOOM_IN_THRESHOLD → enter/stay in zoom
 *    - Score < ZOOM_OUT_THRESHOLD → begin zoom-out
 *    This replaces the old binary ZOOM_OUT_DELAY timer.
 * 
 * 3. CAMERA PHYSICS
 *    Spring-based position tracking with cursor-following inertia.
 *    Camera chases a weighted blend of (click anchor) ↔ (cursor).
 *    Uses the analytical spring solver from SpringPhysics.js.
 * 
 * SEGMENT GENERATION (for playback/export):
 *    Ported from Cap's `generate_zoom_segments_from_clicks_impl`:
 *    groups clicks by time+spatial proximity, pads with pre/post,
 *    processes cursor movement bursts, merges overlapping intervals.
 */

import {
    SpringMassDamperSimulation,
    Spring1D,
    SPRING_PRESETS,
    springEaseIn,
    springEaseOut,
} from './SpringPhysics.js';

// ============================================================
// CONSTANTS (from Cap's recording.rs / configuration.rs)
// ============================================================

// --- Activity score thresholds ---
const ZOOM_IN_THRESHOLD = 0.35;        // Activity score above this → enter zoom mode
const ZOOM_OUT_THRESHOLD = 0.12;       // Activity score below this → begin zoom-out
const ACTIVITY_DECAY_RATE = 0.15;      // per-second decay of activity score
const CLICK_SCORE_IMPULSE = 0.5;       // Added to activity per click
const MOVE_SCORE_PER_PX = 0.0003;      // Activity per pixel/frame of movement
const MOVE_SCORE_CAP = 0.3;            // Max movement contribution per tick
const INTERACTION_MEMORY_MS = 3000;    // How long past interactions linger in score

// --- Segment generation (Cap's constants) ---
const CLICK_GROUP_TIME_THRESHOLD = 2000;   // ms — clicks within this form a burst group
const CLICK_GROUP_SPATIAL_THRESHOLD = 0.15; // normalized — must be within this distance
const CLICK_PRE_PADDING = 300;             // ms before first click of group
const CLICK_POST_PADDING = 1000;           // ms after last click of group
const MOVEMENT_WINDOW_MS = 1500;           // sliding window for movement accumulation
const MOVEMENT_DISTANCE_THRESHOLD = 0.05;  // normalized distance to count as 'active movement'
const MOVEMENT_PRE_PADDING = 200;          // ms before movement burst
const MOVEMENT_POST_PADDING = 800;         // ms after movement burst
const MERGE_GAP_THRESHOLD = 400;           // ms — merge segments closer than this (was 800)
const MIN_SEGMENT_DURATION = 800;          // ms — segments shorter than this are dropped
const AUTO_ZOOM_AMOUNT = 1.5;             // default zoom level for auto-generated segments

// --- Camera behavior ---
const EDGE_PADDING = 0.08;
const ZOOM_IN_COOLDOWN = 300;              // ms after zoom-out before allowing re-zoom
const CURSOR_FOLLOW_RAMP_MS = 600;        // ms to ramp up cursor following after zoom-in
const CURSOR_FOLLOW_MAX = 0.45;           // max cursor influence weight
const CURSOR_VISIBILITY_MARGIN = 0.06;    // ensure cursor stays visible within zoomed viewport

// --- Shake detection (from Cap) ---
const SHAKE_DISTANCE_THRESHOLD = 0.015;
const SHAKE_WINDOW_MS = 100;
const SHAKE_DIRECTION_CHANGE_THRESHOLD = 0.33; // dot product threshold for reversal

// ============================================================
// ZOOM STATES
// ============================================================

const ZoomState = {
    IDLE: 'idle',
    ZOOMING_IN: 'zooming-in',
    ACTIVE_TRACKING: 'active-tracking',
    ZOOMING_OUT: 'zooming-out',
};

// ============================================================
// ACTIVITY SCORE
// ============================================================

class ActivityScorer {
    constructor() {
        this._clickTimes = [];        // Ring buffer of recent click timestamps
        this._moveDistances = [];     // Ring buffer of { time, distance }
        this._score = 0;
        this._lastUpdateTime = 0;
    }

    /**
     * Register a click event
     */
    addClick(timeMs) {
        this._clickTimes.push(timeMs);
        this._score = Math.min(1.0, this._score + CLICK_SCORE_IMPULSE);
    }

    /**
     * Register cursor movement
     * @param {number} timeMs
     * @param {number} distance - normalized 0-1 screen distance traveled this frame
     */
    addMovement(timeMs, distance) {
        this._moveDistances.push({ time: timeMs, distance });
        this._score = Math.min(1.0, this._score + Math.min(distance * MOVE_SCORE_PER_PX * 1000, MOVE_SCORE_CAP));
    }

    /**
     * Tick the scorer — decays score, prunes old events
     */
    update(timeMs, dtMs) {
        // Prune events outside memory window
        const cutoff = timeMs - INTERACTION_MEMORY_MS;
        while (this._clickTimes.length > 0 && this._clickTimes[0] < cutoff) {
            this._clickTimes.shift();
        }
        while (this._moveDistances.length > 0 && this._moveDistances[0].time < cutoff) {
            this._moveDistances.shift();
        }

        // Compute click burst rate (clicks per second in memory window)
        const clickRate = this._clickTimes.length / (INTERACTION_MEMORY_MS / 1000);

        // Compute movement intensity in recent window
        let recentMovement = 0;
        const moveWindow = timeMs - 500; // last 500ms
        for (const m of this._moveDistances) {
            if (m.time >= moveWindow) recentMovement += m.distance;
        }

        // Blended score with memory: high-pass of computed + decaying residue
        const computed = Math.min(1.0,
            clickRate * 0.6 +
            Math.min(recentMovement * 8, 0.5) +
            (this._clickTimes.length > 0 ? 0.1 : 0) // any recent interaction presence
        );

        // Decay existing score toward computed value
        const dtSec = Math.min(dtMs / 1000, 0.2);
        const decayTarget = Math.max(computed, this._score - ACTIVITY_DECAY_RATE * dtSec);
        this._score = Math.max(0, Math.min(1.0, decayTarget));

        this._lastUpdateTime = timeMs;
    }

    get score() {
        return this._score;
    }

    reset() {
        this._clickTimes = [];
        this._moveDistances = [];
        this._score = 0;
        this._lastUpdateTime = 0;
    }
}

// ============================================================
// CINEMA ZOOM ENGINE
// ============================================================

export class CinemaZoomEngine {
    constructor(options = {}) {
        // Canvas dimensions
        this.width = options.width || 1920;
        this.height = options.height || 1080;

        // Zoom level when zoomed in
        this.zoomLevel = options.zoomLevel || 2.0;
        this.minZoom = 1.0;
        this.maxZoom = options.maxZoom || 4.0;

        // ── LAYER 1: State Machine ──
        this._state = ZoomState.IDLE;
        this._stateEnteredAt = 0;           // timeMs when current state was entered
        this._zoomOutCompleteTime = 0;

        // ── LAYER 2: Activity Score ──
        this._activity = new ActivityScorer();

        // ── LAYER 3: Camera Physics ──
        // Position spring (camera XY)
        this.positionSpring = new SpringMassDamperSimulation(
            options.positionSpring || SPRING_PRESETS.screenMovement
        );
        this.positionSpring.setPosition(0.5, 0.5);
        this.positionSpring.setTarget(0.5, 0.5);

        // Zoom spring (scale 1D)
        this.zoomSpring = new Spring1D({
            ...(options.zoomSpring || SPRING_PRESETS.zoom),
            initial: 1.0,
        });

        // Cursor-following spring (lighter, for blending)
        this._cursorSpring = new SpringMassDamperSimulation(SPRING_PRESETS.gentleFollow);
        this._cursorSpring.setPosition(0.5, 0.5);
        this._cursorSpring.setTarget(0.5, 0.5);

        // ── Click & cursor tracking ──
        this._clicks = [];
        this._clickIndex = -1;
        this._lastClickTime = -Infinity;
        this._lastClickPos = { x: 0.5, y: 0.5 };
        this._anchorPos = { x: 0.5, y: 0.5 };  // stable anchor (snaps to click, then smoothed)
        this._cursorPos = { x: 0.5, y: 0.5 };
        this._prevCursorPos = { x: 0.5, y: 0.5 };
        this._lastUpdateTime = 0;

        // ── Playback segments (generated from clicks+movement) ──
        this._zoomSegments = [];
        this._activeSegmentIndex = -1;

        // ── Zoom transition timing (configurable via setZoomSpeed) ──
        this._zoomInDuration = 0.8;   // seconds — time for zoom-in transition
        this._zoomOutDuration = 0.8;  // seconds — time for zoom-out transition
        this._zoomSpringConfig = SPRING_PRESETS.zoom; // spring config for easing

        // ── Cursor movement data (for segment generation) ──
        this._cursorMoves = [];

        // Callbacks
        this.onStateChange = options.onStateChange || null;
        this.onZoomChange = options.onZoomChange || null;
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    /**
     * Get current camera state for rendering
     */
    getState() {
        return {
            x: this.positionSpring.position.x,
            y: this.positionSpring.position.y,
            scale: this.zoomSpring.value,
            state: this._state,
            isZoomed: this.zoomSpring.value > 1.05,
            activityScore: this._activity.score,
        };
    }

    /**
     * Set all clicks for playback mode
     */
    setClicks(clicks) {
        this._clicks = clicks.map(c => ({
            time: c.time,
            x: this._clampEdge(c.x),
            y: this._clampEdge(c.y),
        }));
        this._clickIndex = -1;
        this.reset();
    }

    /**
     * Set cursor movement data for segment generation
     */
    setCursorMoves(moves) {
        this._cursorMoves = moves; // [{ time, x, y }] normalized 0-1
    }

    /**
     * Add a live click (real-time recording)
     */
    addClick(timeMs, x, y) {
        const nx = this._clampEdge(x);
        const ny = this._clampEdge(y);
        const click = { time: timeMs, x: nx, y: ny };
        this._clicks.push(click);
        this._processClick(click, timeMs);
    }

    /**
     * Update cursor position (real-time, normalized 0-1)
     */
    updateCursor(x, y, timeMs) {
        this._prevCursorPos = { ...this._cursorPos };
        this._cursorPos = { x, y };

        // Feed movement into activity scorer
        if (timeMs !== undefined) {
            const dx = x - this._prevCursorPos.x;
            const dy = y - this._prevCursorPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0.0005) {
                this._activity.addMovement(timeMs, dist);
                this._cursorMoves.push({ time: timeMs, x, y });
            }
        }
    }

    /**
     * Core update — call every frame
     * @param {number} timeMs - playback/recording time in ms
     * @param {number} [now] - wall clock (performance.now())
     */
    update(timeMs, now = performance.now()) {
        const wallDelta = this._lastUpdateTime ? (now - this._lastUpdateTime) : 16.67;
        this._lastUpdateTime = now;
        const dt = Math.min(wallDelta, 100);

        // ── Process pending clicks (playback) ──
        this._processClicksUpTo(timeMs);

        // ── Update activity score ──
        this._activity.update(timeMs, dt);

        // ── State machine transitions ──
        this._updateStateMachine(timeMs, dt);

        // ── Camera physics ──
        this._updateCamera(timeMs, dt);

        // ── Notify ──
        if (this.onZoomChange) {
            this.onZoomChange(this.getState());
        }
    }

    /**
     * Evaluate zoom at a specific time using pre-generated segments (for playback/export).
     * Returns { x, y, scale } using spring-eased segment interpolation.
     */
    evaluateAtTime(timeMs) {
        if (this._zoomSegments.length === 0) {
            return { x: 0.5, y: 0.5, scale: 1.0 };
        }

        const timeSec = timeMs / 1000;
        let activeSegment = null;
        let segIndex = -1;

        // Find active segment
        for (let i = 0; i < this._zoomSegments.length; i++) {
            const seg = this._zoomSegments[i];
            if (timeSec >= seg.start && timeSec <= seg.end) {
                activeSegment = seg;
                segIndex = i;
                break;
            }
        }

        if (!activeSegment) {
            // Not in any segment — check transitions
            const ZOOM_IN_DUR = this._zoomInDuration;
            const ZOOM_OUT_DUR = this._zoomOutDuration;
            const springCfg = this._zoomSpringConfig;

            for (let i = 0; i < this._zoomSegments.length; i++) {
                const seg = this._zoomSegments[i];

                // Zoom-in transition (before segment start)
                if (timeSec >= seg.start - ZOOM_IN_DUR && timeSec < seg.start) {
                    const t = (timeSec - (seg.start - ZOOM_IN_DUR)) / ZOOM_IN_DUR;
                    const eased = springEaseIn(t, springCfg);
                    const focusPos = this._getSegmentFocus(seg, seg.start);

                    // If previous segment's zoom-out overlaps this zoom-in,
                    // cross-fade between the two focus positions (no dip to scale=1)
                    if (i > 0) {
                        const prevSeg = this._zoomSegments[i - 1];
                        if (timeSec <= prevSeg.end + ZOOM_OUT_DUR) {
                            const tOut = (timeSec - prevSeg.end) / ZOOM_OUT_DUR;
                            const outEased = springEaseOut(tOut, springCfg);
                            const prevFocus = this._getSegmentFocus(prevSeg, prevSeg.end);
                            // Cross-fade: as zoom-out fades down, zoom-in fades up
                            const blendScale = Math.max(
                                1.0 + (seg.amount - 1.0) * eased,
                                1.0 + (prevSeg.amount - 1.0) * outEased
                            );
                            const blend = eased / Math.max(0.001, eased + outEased);
                            return {
                                x: prevFocus.x + (focusPos.x - prevFocus.x) * blend,
                                y: prevFocus.y + (focusPos.y - prevFocus.y) * blend,
                                scale: blendScale,
                            };
                        }
                    }

                    return {
                        x: 0.5 + (focusPos.x - 0.5) * eased,
                        y: 0.5 + (focusPos.y - 0.5) * eased,
                        scale: 1.0 + (seg.amount - 1.0) * eased,
                    };
                }

                // Zoom-out transition (after segment end) — but NOT if next segment's zoom-in already started
                if (timeSec > seg.end && timeSec <= seg.end + ZOOM_OUT_DUR) {
                    // Check if next segment's zoom-in overlaps — if so, skip (handled above)
                    const nextSeg = this._zoomSegments[i + 1];
                    if (nextSeg && timeSec >= nextSeg.start - ZOOM_IN_DUR) {
                        continue; // let the next iteration handle the cross-fade
                    }

                    const t = (timeSec - seg.end) / ZOOM_OUT_DUR;
                    const eased = springEaseOut(t, springCfg);
                    const focusPos = this._getSegmentFocus(seg, seg.end);
                    return {
                        x: 0.5 + (focusPos.x - 0.5) * eased,
                        y: 0.5 + (focusPos.y - 0.5) * eased,
                        scale: 1.0 + (seg.amount - 1.0) * eased,
                    };
                }
            }

            return { x: 0.5, y: 0.5, scale: 1.0 };
        }

        // Inside an active segment — full zoom with spring-interpolated focus
        const focusPos = this._getSegmentFocus(activeSegment, timeSec);
        return {
            x: focusPos.x,
            y: focusPos.y,
            scale: activeSegment.amount,
        };
    }

    /**
     * Reset engine state
     */
    reset() {
        this.positionSpring.setPosition(0.5, 0.5);
        this.positionSpring.setTarget(0.5, 0.5);
        this.positionSpring.setVelocity(0, 0);
        this._cursorSpring.setPosition(0.5, 0.5);
        this._cursorSpring.setTarget(0.5, 0.5);
        this._cursorSpring.setVelocity(0, 0);
        this.zoomSpring.setValue(1.0);
        this.zoomSpring.setTarget(1.0);
        this._state = ZoomState.IDLE;
        this._stateEnteredAt = 0;
        this._lastClickTime = -Infinity;
        this._lastClickPos = { x: 0.5, y: 0.5 };
        this._anchorPos = { x: 0.5, y: 0.5 };
        this._clickIndex = -1;
        this._lastUpdateTime = 0;
        this._zoomOutCompleteTime = 0;
        this._activity.reset();
        this._activeSegmentIndex = -1;
    }

    /**
     * Seek to a specific time (reprocesses all clicks up to that point)
     */
    seekTo(timeMs) {
        this.reset();
        for (let i = 0; i < this._clicks.length; i++) {
            if (this._clicks[i].time <= timeMs) {
                this._clickIndex = i;
                this._processClick(this._clicks[i], timeMs);
            } else break;
        }
        // Settle springs
        this.zoomSpring.run(500);
        this.positionSpring.run(500);
    }

    // ============================================================
    // SEGMENT GENERATION (ported from Cap's generate_zoom_segments_from_clicks_impl)
    // ============================================================

    /**
     * Generate zoom segments from recorded clicks + cursor movement.
     * This is the Cap-style algorithm: groups clicks by time/spatial proximity,
     * pads with pre/post, adds movement bursts, merges overlapping intervals.
     * 
     * @param {object} [options] - Override defaults
     * @returns {Array<{start: number, end: number, amount: number, focusPoints: Array}>}
     */
    generateZoomSegments(options = {}) {
        const zoomAmount = options.zoomAmount ?? this.zoomLevel ?? AUTO_ZOOM_AMOUNT;
        const clicks = this._clicks;
        const moves = this._cursorMoves;

        if (clicks.length === 0) {
            console.log('[ZoomEngine] No clicks — no zoom segments generated');
            this._zoomSegments = [];
            return [];
        }

        console.log('[ZoomEngine] Generating segments from', clicks.length, 'clicks,', moves.length, 'moves');

        // ── Step 1: Group clicks by time + spatial proximity ──
        const clickGroups = this._groupClicks(clicks);
        console.log('[ZoomEngine] Click groups:', clickGroups.length,
            clickGroups.map(g => `[${g.length} clicks, t=${(g[0].time/1000).toFixed(1)}s-${(g[g.length-1].time/1000).toFixed(1)}s]`));

        // ── Step 2: Create padded intervals from click groups ──
        let intervals = clickGroups.map(group => {
            const first = group[0];
            const last = group[group.length - 1];
            return {
                start: first.time - CLICK_PRE_PADDING,
                end: last.time + CLICK_POST_PADDING,
                focusPoints: group.map(c => ({ time: c.time, x: c.x, y: c.y })),
            };
        });

        // ── Step 3: Enrich with cursor movement focus points ──
        // (DON'T create new segments from movement — only add focus points inside existing click segments)
        if (moves.length > 0) {
            for (const interval of intervals) {
                const segMoves = moves.filter(m => m.time >= interval.start && m.time <= interval.end);
                // Sample every ~200ms to avoid overwhelming focus points
                const sampleInterval = 200;
                let lastSampled = 0;
                for (const m of segMoves) {
                    if (m.time - lastSampled >= sampleInterval) {
                        interval.focusPoints.push({ time: m.time, x: m.x, y: m.y });
                        lastSampled = m.time;
                    }
                }
                // Sort focus points by time
                interval.focusPoints.sort((a, b) => a.time - b.time);
            }
        }

        // ── Step 4: Sort by start time ──
        intervals.sort((a, b) => a.start - b.start);

        // ── Step 5: Merge overlapping / close intervals ──
        intervals = this._mergeIntervals(intervals);

        // ── Step 6: Filter too-short segments ──
        intervals = intervals.filter(seg => (seg.end - seg.start) >= MIN_SEGMENT_DURATION);

        // ── Step 7: Build final segments ──
        const segments = intervals.map(interval => ({
            start: Math.max(0, interval.start) / 1000,  // to seconds
            end: interval.end / 1000,
            amount: zoomAmount,
            focusPoints: interval.focusPoints.map(fp => ({
                time: fp.time / 1000,
                x: fp.x,
                y: fp.y,
            })),
        }));

        this._zoomSegments = segments;
        console.log('[ZoomEngine] Generated', segments.length, 'zoom segments:',
            segments.map(s => `[${s.start.toFixed(1)}s-${s.end.toFixed(1)}s, ${s.focusPoints.length} fps, zoom=${s.amount}]`));
        return segments;
    }

    /**
     * Set pre-computed segments (e.g. from manual editing)
     */
    setZoomSegments(segments) {
        this._zoomSegments = segments;
    }

    // ============================================================
    // SETTINGS
    // ============================================================

    setZoomLevel(level) {
        this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, level));
        if (this._state === ZoomState.ACTIVE_TRACKING || this._state === ZoomState.ZOOMING_IN) {
            this.zoomSpring.setTarget(this.zoomLevel);
        }
    }

    setSpringConfig(type, config) {
        const target = type === 'position' ? this.positionSpring :
                       type === 'zoom' ? this.zoomSpring : null;
        if (target) {
            if (config.tension !== undefined) target.tension = config.tension;
            if (config.mass !== undefined) target.mass = config.mass;
            if (config.friction !== undefined) target.friction = config.friction;
        }
        // Also update segment evaluation spring config
        if (type === 'zoom') {
            this._zoomSpringConfig = {
                tension: config.tension ?? this._zoomSpringConfig.tension,
                mass: config.mass ?? this._zoomSpringConfig.mass,
                friction: config.friction ?? this._zoomSpringConfig.friction,
            };
        }
    }

    /**
     * Set zoom speed preset — configures transition duration and spring params
     * @param {'slow'|'normal'|'fast'} speed
     */
    setZoomSpeed(speed) {
        const presets = {
            slow:   { inDur: 1.2, outDur: 1.2, spring: { tension: 80,  mass: 1.0, friction: 25 } },
            normal: { inDur: 0.8, outDur: 0.8, spring: { tension: 120, mass: 1.0, friction: 18 } },
            fast:   { inDur: 0.4, outDur: 0.4, spring: { tension: 200, mass: 1.0, friction: 22 } },
        };
        const preset = presets[speed] || presets.normal;
        this._zoomInDuration = preset.inDur;
        this._zoomOutDuration = preset.outDur;
        this._zoomSpringConfig = preset.spring;
        // Also update the 1D spring for real-time use
        this.zoomSpring.tension = preset.spring.tension;
        this.zoomSpring.mass = preset.spring.mass;
        this.zoomSpring.friction = preset.spring.friction;
    }

    destroy() {
        this.reset();
        this._clicks = [];
        this._cursorMoves = [];
        this._zoomSegments = [];
        this.onStateChange = null;
        this.onZoomChange = null;
    }

    // ============================================================
    // INTERNAL: State Machine (Layer 1)
    // ============================================================

    _updateStateMachine(timeMs, dt) {
        const score = this._activity.score;

        switch (this._state) {
            case ZoomState.IDLE:
                // Transition → ZOOMING_IN happens in _processClick
                break;

            case ZoomState.ZOOMING_IN:
                // Transition → ACTIVE_TRACKING when zoom spring reaches ~95% of target
                if (this.zoomSpring.value > this.zoomLevel * 0.93) {
                    this._setState(ZoomState.ACTIVE_TRACKING, timeMs);
                }
                break;

            case ZoomState.ACTIVE_TRACKING:
                // Transition → ZOOMING_OUT when activity drops below threshold
                // But only if we've been in this state for at least the post-padding
                if (score < ZOOM_OUT_THRESHOLD &&
                    (timeMs - this._stateEnteredAt) > CLICK_POST_PADDING) {
                    this._beginZoomOut(timeMs);
                }
                break;

            case ZoomState.ZOOMING_OUT:
                // Transition → IDLE when zoom spring settles at 1.0
                if (this.zoomSpring.isSettled(0.005)) {
                    this.zoomSpring.setValue(1.0);
                    this._setState(ZoomState.IDLE, timeMs);
                    this._zoomOutCompleteTime = timeMs;
                }
                // If activity spikes again during zoom-out, re-enter zoom!
                if (score > ZOOM_IN_THRESHOLD) {
                    this._setState(ZoomState.ZOOMING_IN, timeMs);
                    this.zoomSpring.setTarget(this.zoomLevel);
                }
                break;
        }
    }

    // ============================================================
    // INTERNAL: Camera Physics (Layer 3)
    // ============================================================

    _updateCamera(timeMs, dt) {
        // Run zoom spring
        this.zoomSpring.run(dt);

        // Run position spring
        this.positionSpring.run(dt);

        // Cursor-following while zoomed
        if (this._state === ZoomState.ACTIVE_TRACKING || this._state === ZoomState.ZOOMING_IN) {
            this._cursorSpring.setTarget(this._cursorPos.x, this._cursorPos.y);
            this._cursorSpring.run(dt);

            // Ramp up cursor influence over CURSOR_FOLLOW_RAMP_MS
            const timeSinceZoom = timeMs - this._stateEnteredAt;
            const ramp = Math.min(1.0, timeSinceZoom / CURSOR_FOLLOW_RAMP_MS);

            // Cursor influence scales with zoom depth
            const zoomDepth = (this.zoomSpring.value - 1) / Math.max(0.01, this.zoomLevel - 1);
            const cursorInfluence = CURSOR_FOLLOW_MAX * ramp * zoomDepth;

            // Blend: anchor position (from clicks) ↔ smoothed cursor position
            const blendedX = this._anchorPos.x * (1 - cursorInfluence) +
                             this._cursorSpring.position.x * cursorInfluence;
            const blendedY = this._anchorPos.y * (1 - cursorInfluence) +
                             this._cursorSpring.position.y * cursorInfluence;

            // Ensure cursor stays visible within the zoomed viewport
            const visibleTarget = this._ensureCursorVisible(blendedX, blendedY);

            this.positionSpring.setTarget(visibleTarget.x, visibleTarget.y);
        }
    }

    /**
     * Ensure the cursor position is visible within the zoomed viewport.
     * If cursor is near the edge of the visible area, nudge the camera.
     * (From Cap's ensure_cursor_visible pattern)
     */
    _ensureCursorVisible(targetX, targetY) {
        const scale = this.zoomSpring.value;
        if (scale <= 1.05) return { x: targetX, y: targetY };

        const halfViewW = 0.5 / scale;
        const halfViewH = 0.5 / scale;
        const margin = CURSOR_VISIBILITY_MARGIN / scale;

        const cursorX = this._cursorPos.x;
        const cursorY = this._cursorPos.y;

        let nudgedX = targetX;
        let nudgedY = targetY;

        // If cursor is outside visible rect + margin, nudge camera
        const leftEdge = nudgedX - halfViewW + margin;
        const rightEdge = nudgedX + halfViewW - margin;
        const topEdge = nudgedY - halfViewH + margin;
        const bottomEdge = nudgedY + halfViewH - margin;

        if (cursorX < leftEdge) nudgedX -= (leftEdge - cursorX);
        if (cursorX > rightEdge) nudgedX += (cursorX - rightEdge);
        if (cursorY < topEdge) nudgedY -= (topEdge - cursorY);
        if (cursorY > bottomEdge) nudgedY += (cursorY - bottomEdge);

        return {
            x: this._clampEdge(nudgedX),
            y: this._clampEdge(nudgedY),
        };
    }

    // ============================================================
    // INTERNAL: Click processing
    // ============================================================

    _processClicksUpTo(timeMs) {
        for (let i = this._clickIndex + 1; i < this._clicks.length; i++) {
            if (this._clicks[i].time <= timeMs) {
                this._clickIndex = i;
                this._processClick(this._clicks[i], timeMs);
            } else break;
        }
    }

    _processClick(click, timeMs) {
        this._lastClickTime = click.time;
        this._lastClickPos = { x: click.x, y: click.y };

        // Feed into activity scorer
        this._activity.addClick(click.time);

        const isIdle = this._state === ZoomState.IDLE || this._state === ZoomState.ZOOMING_OUT;

        if (isIdle) {
            // Cooldown check
            if (click.time - this._zoomOutCompleteTime < ZOOM_IN_COOLDOWN &&
                this._zoomOutCompleteTime > 0) {
                return;
            }

            // ENTER ZOOM MODE: first click activates persistent zoom
            this._anchorPos = { x: click.x, y: click.y };
            this._setState(ZoomState.ZOOMING_IN, click.time);
            this.zoomSpring.setTarget(this.zoomLevel);
            this.positionSpring.setTarget(click.x, click.y);

            // Snap cursor spring to click position
            this._cursorSpring.setPosition(click.x, click.y);
            this._cursorSpring.setTarget(click.x, click.y);
        } else {
            // STAY ZOOMED: update anchor to new click position
            // Camera spring-pans to new target (zoom level unchanged)
            this._anchorPos = { x: click.x, y: click.y };
            this.positionSpring.setTarget(click.x, click.y);
        }
    }

    _beginZoomOut(timeMs) {
        this._setState(ZoomState.ZOOMING_OUT, timeMs);
        this.zoomSpring.setTarget(1.0);
        this.positionSpring.setTarget(0.5, 0.5);
    }

    _setState(newState, timeMs) {
        if (newState !== this._state) {
            const old = this._state;
            this._state = newState;
            this._stateEnteredAt = timeMs || 0;
            if (this.onStateChange) this.onStateChange(newState, old);
        }
    }

    // ============================================================
    // INTERNAL: Segment generation helpers
    // ============================================================

    /**
     * Group clicks by temporal + spatial proximity (Cap's algorithm).
     * Clicks within CLICK_GROUP_TIME_THRESHOLD ms AND CLICK_GROUP_SPATIAL_THRESHOLD
     * normalized distance are grouped together.
     */
    _groupClicks(clicks) {
        if (clicks.length === 0) return [];

        const groups = [];
        let currentGroup = [clicks[0]];

        for (let i = 1; i < clicks.length; i++) {
            const prev = clicks[i - 1];
            const curr = clicks[i];
            const timeDiff = curr.time - prev.time;
            const spatialDist = Math.sqrt(
                (curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2
            );

            if (timeDiff < CLICK_GROUP_TIME_THRESHOLD &&
                spatialDist < CLICK_GROUP_SPATIAL_THRESHOLD) {
                currentGroup.push(curr);
            } else {
                groups.push(currentGroup);
                currentGroup = [curr];
            }
        }
        groups.push(currentGroup);
        return groups;
    }

    /**
     * Detect movement bursts using a sliding window.
     * Accumulates cursor distance over MOVEMENT_WINDOW_MS. If distance exceeds
     * threshold, that window is a "burst". Shake/noise is filtered.
     */
    _detectMovementBursts(moves) {
        if (moves.length < 3) return [];

        const bursts = [];
        let burstStart = null;
        let burstFocusPoints = [];

        for (let i = 1; i < moves.length; i++) {
            const windowStart = moves[i].time - MOVEMENT_WINDOW_MS;
            let windowDist = 0;
            let directionChanges = 0;
            let lastDx = 0, lastDy = 0;

            // Accumulate distance in window
            for (let j = i; j >= 1; j--) {
                if (moves[j].time < windowStart) break;
                const dx = moves[j].x - moves[j - 1].x;
                const dy = moves[j].y - moves[j - 1].y;
                const segDist = Math.sqrt(dx * dx + dy * dy);
                windowDist += segDist;

                // Count direction changes (shake detection)
                if (lastDx !== 0 || lastDy !== 0) {
                    const dot = dx * lastDx + dy * lastDy;
                    const mag1 = Math.sqrt(lastDx * lastDx + lastDy * lastDy);
                    const mag2 = Math.sqrt(dx * dx + dy * dy);
                    if (mag1 > 0.001 && mag2 > 0.001) {
                        const cosAngle = dot / (mag1 * mag2);
                        if (cosAngle < -SHAKE_DIRECTION_CHANGE_THRESHOLD) {
                            directionChanges++;
                        }
                    }
                }
                lastDx = dx;
                lastDy = dy;
            }

            // Filter out shaky movement (too many direction changes relative to distance)
            const isShake = directionChanges > 3 && windowDist < SHAKE_DISTANCE_THRESHOLD * 3;

            if (windowDist > MOVEMENT_DISTANCE_THRESHOLD && !isShake) {
                if (!burstStart) {
                    burstStart = moves[i].time - MOVEMENT_WINDOW_MS;
                }
                burstFocusPoints.push({
                    time: moves[i].time,
                    x: moves[i].x,
                    y: moves[i].y,
                });
            } else if (burstStart !== null) {
                // End of burst
                bursts.push({
                    start: burstStart,
                    end: moves[i - 1].time,
                    focusPoints: burstFocusPoints,
                });
                burstStart = null;
                burstFocusPoints = [];
            }
        }

        // Close trailing burst
        if (burstStart !== null && burstFocusPoints.length > 0) {
            bursts.push({
                start: burstStart,
                end: moves[moves.length - 1].time,
                focusPoints: burstFocusPoints,
            });
        }

        return bursts;
    }

    /**
     * Merge overlapping or close intervals (gap < MERGE_GAP_THRESHOLD)
     */
    _mergeIntervals(intervals) {
        if (intervals.length <= 1) return intervals;

        const merged = [intervals[0]];

        for (let i = 1; i < intervals.length; i++) {
            const prev = merged[merged.length - 1];
            const curr = intervals[i];

            if (curr.start <= prev.end + MERGE_GAP_THRESHOLD) {
                // Merge
                prev.end = Math.max(prev.end, curr.end);
                prev.focusPoints = prev.focusPoints.concat(curr.focusPoints);
            } else {
                merged.push(curr);
            }
        }

        return merged;
    }

    /**
     * Get interpolated focus position within a segment at a given time.
     * Spring-smooths between focus points within the segment.
     */
    _getSegmentFocus(segment, timeSec) {
        const fps = segment.focusPoints;
        if (!fps || fps.length === 0) return { x: 0.5, y: 0.5 };
        if (fps.length === 1) return { x: fps[0].x, y: fps[0].y };

        // Find surrounding focus points
        if (timeSec <= fps[0].time) return { x: fps[0].x, y: fps[0].y };
        if (timeSec >= fps[fps.length - 1].time) {
            const last = fps[fps.length - 1];
            return { x: last.x, y: last.y };
        }

        // Linear interpolation between surrounding points (spring simulation
        // is too expensive to run per-sample in evaluateAtTime)
        let lo = 0;
        for (let i = 0; i < fps.length - 1; i++) {
            if (fps[i + 1].time > timeSec) { lo = i; break; }
        }
        const a = fps[lo];
        const b = fps[lo + 1];
        const t = (timeSec - a.time) / (b.time - a.time);

        // Smooth step instead of linear for more cinematic feel
        const smooth = t * t * (3 - 2 * t);

        return {
            x: this._clampEdge(a.x + (b.x - a.x) * smooth),
            y: this._clampEdge(a.y + (b.y - a.y) * smooth),
        };
    }

    // ============================================================
    // INTERNAL: Utilities
    // ============================================================

    _clampEdge(v) {
        return Math.max(EDGE_PADDING, Math.min(1 - EDGE_PADDING, v));
    }
}

export default CinemaZoomEngine;
