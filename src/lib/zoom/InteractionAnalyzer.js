/**
 * InteractionAnalyzer — Semantic Attention & Focus Track Generator
 * 
 * Inspired by Screen Studio & OpenScreen's interaction model.
 * Instead of chasing every raw cursor jitter, this analyzer clusters user
 * intent (clicks, dwell time, active form fields) into calm, semantic
 * FocusSegments with deadzone margins.
 */

import { clampFocusToScale } from './focusUtils.js';
import { DEFAULT_ZOOM_SCALE, ZOOM_DYNAMICS } from './ZoomConstruct.js';

export class InteractionAnalyzer {
    constructor(options = {}) {
        this.options = {
            clickPaddingPre: options.clickPaddingPre ?? ZOOM_DYNAMICS.clickPaddingPre,    // seconds before click to begin anticipation zoom
            clickPaddingPost: options.clickPaddingPost ?? ZOOM_DYNAMICS.clickPaddingPost,  // hold view long enough for viewer to read
            clusterTimeGap: options.clusterTimeGap ?? ZOOM_DYNAMICS.clusterTimeGap,      // seconds threshold to group related clicks (3.5s)
            clusterDistance: options.clusterDistance ?? ZOOM_DYNAMICS.clusterDistance,   // normalized screen distance for clustering
            enableDwellZooms: options.enableDwellZooms ?? false, // only intentional clicks trigger auto-zoom by default
            dwellMinDuration: options.dwellMinDuration ?? 1.2,   // mouse must be stationary for at least 1.2s
            dwellRadius: options.dwellRadius ?? 0.03,            // tight radius for dwell
            mergeGapThreshold: options.mergeGapThreshold ?? ZOOM_DYNAMICS.mergeGapThreshold, // seconds between segments to merge
            minSegmentDuration: options.minSegmentDuration ?? ZOOM_DYNAMICS.minSegmentDuration, // minimum hold to prevent yo-yo zooming
            defaultZoomScale: options.defaultZoomScale ?? DEFAULT_ZOOM_SCALE,             // 1.55x cinema balanced standard
            deadzoneRadius: options.deadzoneRadius ?? ZOOM_DYNAMICS.deadzoneRadius,       // subtle margin to filter hand tremors while smoothly tracking cursor motion
            sourceWidth: options.sourceWidth || 1920,
            sourceHeight: options.sourceHeight || 1080,
            minClickTime: options.minClickTime ?? 0.35,           // filter initial startup clicks (< 350ms)
            ...options,
        };
    }

    /**
     * Generate complete FocusTrack from recorded session telemetry
     * @param {Array<{x: number, y: number, time: number}>} clicks - Raw click events (time in sec or ms)
     * @param {Array<{x: number, y: number, t: number}>} mouseSamples - Continuous cursor telemetry
     * @param {number} totalDurationSec - Total duration of the recording in seconds
     * @returns {Array<Object>}
     */
    analyze(clicks = [], mouseSamples = [], totalDurationSec = 10) {
        const srcW = this.options.sourceWidth || (typeof window !== 'undefined' ? (window.screen.width * (window.devicePixelRatio || 1)) : 1920);
        const srcH = this.options.sourceHeight || (typeof window !== 'undefined' ? (window.screen.height * (window.devicePixelRatio || 1)) : 1080);

        // Normalize click timestamps to seconds and coordinates to 0-1
        const minClickTime = this.options.minClickTime ?? 0.35;
        const clickList = clicks || [];
        const maxClickRawTime = clickList.reduce((max, c) => Math.max(max, c.time ?? c.t ?? 0), 0);
        const isMs = maxClickRawTime > totalDurationSec || maxClickRawTime >= 20 || clickList.some(c => (c.time ?? c.t ?? 0) > 10);

        const normalizedClicks = clickList
            .map(c => {
                const rawTime = c.time ?? c.t ?? 0;
                const timeSec = isMs ? rawTime / 1000 : rawTime;
                const rawX = c.x ?? c.cx ?? 0.5;
                const rawY = c.y ?? c.cy ?? 0.5;
                return {
                    time: timeSec,
                    x: Math.max(0, Math.min(1, rawX > 1 ? rawX / srcW : rawX)),
                    y: Math.max(0, Math.min(1, rawY > 1 ? rawY / srcH : rawY)),
                };
            })
            .filter(c => c.time >= minClickTime)
            .sort((a, b) => a.time - b.time);

        // Step 1: Cluster clicks into focal regions
        const clickSegments = this._clusterClicks(normalizedClicks, totalDurationSec, minClickTime);

        // Step 2: Detect dwell / attention anchors only if explicitly enabled
        const dwellSegments = this.options.enableDwellZooms
            ? this._detectDwells(mouseSamples, totalDurationSec, clickSegments, srcW, srcH)
            : [];

        // Step 3: Combine and sort all focus events
        const combined = [...clickSegments, ...dwellSegments].sort((a, b) => a.startTime - b.startTime);

        // Step 4: Merge adjacent or overlapping segments to prevent jarring zoom pumping
        const merged = this._mergeSegments(combined, totalDurationSec);

        // Step 5: Sanitize viewport bounds and deadzones without overlapping next segments
        return merged.map((seg, idx, arr) => this._finalizeSegment(seg, idx, arr, totalDurationSec));
    }

    /**
     * Group nearby clicks in space and time
     */
    _clusterClicks(clicks, totalDurationSec, minClickTime = 1.5) {
        if (!clicks.length) return [];

        const clusters = [];
        let currentCluster = [clicks[0]];

        for (let i = 1; i < clicks.length; i++) {
            const prev = currentCluster[currentCluster.length - 1];
            const curr = clicks[i];

            const dt = curr.time - prev.time;
            const dist = Math.hypot(curr.x - prev.x, curr.y - prev.y);

            if (dt <= this.options.clusterTimeGap && dist <= this.options.clusterDistance) {
                currentCluster.push(curr);
            } else {
                clusters.push(currentCluster);
                currentCluster = [curr];
            }
        }
        if (currentCluster.length) {
            clusters.push(currentCluster);
        }

        const minZoomStart = Math.max(0, minClickTime - 0.35);

        return clusters.map(cluster => {
            const first = cluster[0];
            const last = cluster[cluster.length - 1];

            // Centroid target for cluster: weighted anchor for multi-click interactions
            let targetX = first.x;
            let targetY = first.y;
            if (cluster.length > 1) {
                targetX = cluster.reduce((sum, c) => sum + c.x, 0) / cluster.length;
                targetY = cluster.reduce((sum, c) => sum + c.y, 0) / cluster.length;
            }

            const startTime = Math.max(minZoomStart, first.time - this.options.clickPaddingPre);
            const endTime = Math.min(totalDurationSec, last.time + this.options.clickPaddingPost);

            return {
                startTime,
                endTime,
                targetX,
                targetY,
                zoomScale: this.options.defaultZoomScale,
                reason: 'click',
                clickCount: cluster.length,
            };
        });
    }

    /**
     * Detect dwell regions where user is paused reading or hovering
     */
    _detectDwells(samples, totalDurationSec, existingSegments, srcW = 1920, srcH = 1080) {
        if (!samples || samples.length < 10) return [];

        const dwells = [];
        let windowStart = 0;
        const minDwellTime = this.options.minDwellTime ?? 1.0;

        for (let i = 1; i < samples.length; i++) {
            const startSample = samples[windowStart];
            const currSample = samples[i];

            const tStart = (startSample.time ?? startSample.t) / 1000;
            const tCurr = (currSample.time ?? currSample.t) / 1000;
            const dt = tCurr - tStart;

            // Never create dwell anchors during initial recording startup (< minDwellTime)
            if (tStart < minDwellTime) {
                windowStart = i;
                continue;
            }

            const rawStartX = startSample.x > 1 ? startSample.x / srcW : (startSample.cx ?? startSample.x ?? 0.5);
            const rawStartY = startSample.y > 1 ? startSample.y / srcH : (startSample.cy ?? startSample.y ?? 0.5);
            const rawCurrX = currSample.x > 1 ? currSample.x / srcW : (currSample.cx ?? currSample.x ?? 0.5);
            const rawCurrY = currSample.y > 1 ? currSample.y / srcH : (currSample.cy ?? currSample.y ?? 0.5);

            const dist = Math.hypot(rawCurrX - rawStartX, rawCurrY - rawStartY);

            if (dist > this.options.dwellRadius) {
                // Cursor moved out of dwell bubble
                if (dt >= this.options.dwellMinDuration) {
                    const midTime = (tStart + tCurr) / 2;
                    // Check if already covered by an existing click segment
                    const isCovered = existingSegments.some(
                        s => midTime >= s.startTime - 0.5 && midTime <= s.endTime + 0.5
                    );

                    if (!isCovered) {
                        dwells.push({
                            startTime: Math.max(0, tStart - 0.2),
                            endTime: Math.min(totalDurationSec, tCurr + 0.8),
                            targetX: rawStartX,
                            targetY: rawStartY,
                            zoomScale: Math.min(this.options.defaultZoomScale, 1.5), // gentler zoom for dwell
                            reason: 'dwell',
                        });
                    }
                }
                windowStart = i;
            }
        }

        return dwells;
    }

    /**
     * Merge segments with small gaps between them to ensure calm sustained framing
     */
    _mergeSegments(segments, totalDurationSec) {
        if (!segments.length) return [];

        const merged = [segments[0]];
        const chainedHorizon = ZOOM_DYNAMICS.chainedPanGapSec || 6.5;

        for (let i = 1; i < segments.length; i++) {
            const prev = merged[merged.length - 1];
            const curr = segments[i];

            const gap = curr.startTime - prev.endTime;
            const dist = Math.hypot(curr.targetX - prev.targetX, curr.targetY - prev.targetY);

            if ((gap <= this.options.mergeGapThreshold || gap <= 0) && dist <= 0.45) {
                // Nearby clicks on related UI elements: extend hold time so camera stays calm
                prev.endTime = Math.max(prev.endTime, curr.endTime);
                prev.zoomScale = Math.max(prev.zoomScale, curr.zoomScale);
                prev.targetX = prev.targetX * 0.40 + curr.targetX * 0.60;
                prev.targetY = prev.targetY * 0.40 + curr.targetY * 0.60;
            } else if (gap <= chainedHorizon) {
                // Clicks within conversational horizon: bridge gap so camera glides continuously
                // rather than dipping to overview
                if (curr.startTime > prev.endTime) {
                    prev.endTime = curr.startTime;
                } else {
                    // Resolve overlap: set prev.endTime strictly to curr.startTime
                    prev.endTime = curr.startTime;
                }
                merged.push(curr);
            } else {
                merged.push(curr);
            }
        }

        // Strict guarantee: no segment end exceeds next segment start (zero overlap)
        for (let i = 0; i < merged.length - 1; i++) {
            if (merged[i].endTime > merged[i + 1].startTime) {
                merged[i].endTime = merged[i + 1].startTime;
            }
        }

        return merged;
    }

    /**
     * Clamp coordinates so camera doesn't show black margins
     */
    _finalizeSegment(seg, index, segments, totalDurationSec) {
        const scale = seg.zoomScale || this.options.defaultZoomScale;
        const clamped = clampFocusToScale({ cx: seg.targetX, cy: seg.targetY }, scale);

        const nextSeg = segments && segments[index + 1];
        const isChainedNext = nextSeg && (nextSeg.startTime - seg.endTime <= 0.05);

        let finalEnd = seg.endTime;
        if (isChainedNext) {
            finalEnd = nextSeg.startTime;
        } else {
            const desiredEnd = Math.max(seg.startTime + this.options.minSegmentDuration, seg.endTime);
            finalEnd = Math.min(totalDurationSec, desiredEnd);
            if (nextSeg) finalEnd = Math.min(nextSeg.startTime, finalEnd);
        }
        finalEnd = Math.max(seg.startTime + 0.1, finalEnd);

        return {
            id: `focus_seg_${index}_${Math.round(seg.startTime * 10)}`,
            startTime: Math.max(0, seg.startTime),
            endTime: finalEnd,
            targetX: clamped.cx,
            targetY: clamped.cy,
            zoomScale: scale,
            reason: seg.reason,
            sceneMode: seg.sceneMode || 'zoom',
            deadzoneRadius: this.options.deadzoneRadius,
        };
    }
}
