/**
 * InteractionAnalyzer — Semantic Attention & Focus Track Generator
 * 
 * Inspired by Screen Studio & OpenScreen's interaction model.
 * Instead of chasing every raw cursor jitter, this analyzer clusters user
 * intent (clicks, dwell time, active form fields) into calm, semantic
 * FocusSegments with deadzone margins.
 */

export class InteractionAnalyzer {
    constructor(options = {}) {
        this.options = {
            clickPaddingPre: options.clickPaddingPre ?? 0.4,     // seconds before click to begin anticipation zoom
            clickPaddingPost: options.clickPaddingPost ?? 1.8,   // seconds after click to hold view
            clusterTimeGap: options.clusterTimeGap ?? 2.5,       // seconds threshold to group related clicks
            clusterDistance: options.clusterDistance ?? 0.18,    // normalized screen distance for clustering
            dwellMinDuration: options.dwellMinDuration ?? 0.45,  // seconds mouse must remain still to trigger dwell focus
            dwellRadius: options.dwellRadius ?? 0.04,            // normalized radius for dwell detection
            mergeGapThreshold: options.mergeGapThreshold ?? 0.8, // seconds between segments to merge
            minSegmentDuration: options.minSegmentDuration ?? 1.2,
            defaultZoomScale: options.defaultZoomScale ?? 1.85,
            deadzoneRadius: options.deadzoneRadius ?? 0.22,      // radius where cursor moves freely without camera panning
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
        // Normalize click timestamps to seconds and coordinates to 0-1
        const normalizedClicks = (clicks || []).map(c => ({
            time: c.time / 1000,
            x: Math.max(0, Math.min(1, c.x > 1 ? c.x / (typeof window !== 'undefined' ? window.screen.width : 1920) : c.x)),
            y: Math.max(0, Math.min(1, c.y > 1 ? c.y / (typeof window !== 'undefined' ? window.screen.height : 1080) : c.y)),
        })).sort((a, b) => a.time - b.time);

        // Step 1: Cluster clicks into focal regions
        const clickSegments = this._clusterClicks(normalizedClicks, totalDurationSec);

        // Step 2: Detect dwell / attention anchors from cursor samples (if available)
        const dwellSegments = this._detectDwells(mouseSamples, totalDurationSec, clickSegments);

        // Step 3: Combine and sort all focus events
        const combined = [...clickSegments, ...dwellSegments].sort((a, b) => a.startTime - b.startTime);

        // Step 4: Merge adjacent or overlapping segments to prevent jarring zoom pumping
        const merged = this._mergeSegments(combined, totalDurationSec);

        // Step 5: Sanitize viewport bounds and deadzones
        return merged.map((seg, idx) => this._finalizeSegment(seg, idx, totalDurationSec));
    }

    /**
     * Group nearby clicks in space and time
     */
    _clusterClicks(clicks, totalDurationSec) {
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

        return clusters.map(cluster => {
            const first = cluster[0];
            const last = cluster[cluster.length - 1];

            // Centroid weighted by latest clicks in the sequence
            let sumX = 0;
            let sumY = 0;
            cluster.forEach(c => {
                sumX += c.x;
                sumY += c.y;
            });
            const targetX = sumX / cluster.length;
            const targetY = sumY / cluster.length;

            const startTime = Math.max(0, first.time - this.options.clickPaddingPre);
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
    _detectDwells(samples, totalDurationSec, existingSegments) {
        if (!samples || samples.length < 10) return [];

        const dwells = [];
        let windowStart = 0;

        for (let i = 1; i < samples.length; i++) {
            const startSample = samples[windowStart];
            const currSample = samples[i];

            const tStart = (startSample.time ?? startSample.t) / 1000;
            const tCurr = (currSample.time ?? currSample.t) / 1000;
            const dt = tCurr - tStart;

            const dist = Math.hypot(currSample.x - startSample.x, currSample.y - startSample.y);

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
                            targetX: startSample.x,
                            targetY: startSample.y,
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
     * Merge segments with small gaps between them
     */
    _mergeSegments(segments, totalDurationSec) {
        if (!segments.length) return [];

        const merged = [segments[0]];

        for (let i = 1; i < segments.length; i++) {
            const prev = merged[merged.length - 1];
            const curr = segments[i];

            const gap = curr.startTime - prev.endTime;

            if (gap <= this.options.mergeGapThreshold) {
                prev.endTime = Math.max(prev.endTime, curr.endTime);
                prev.targetX = (prev.targetX + curr.targetX) / 2;
                prev.targetY = (prev.targetY + curr.targetY) / 2;
                prev.zoomScale = Math.max(prev.zoomScale, curr.zoomScale);
            } else {
                merged.push(curr);
            }
        }

        return merged;
    }

    /**
     * Clamp coordinates so camera doesn't show black margins
     */
    _finalizeSegment(seg, index, totalDurationSec) {
        const scale = seg.zoomScale || this.options.defaultZoomScale;
        const halfVisibleW = 0.5 / scale;
        const halfVisibleH = 0.5 / scale;

        const targetX = Math.max(halfVisibleW, Math.min(1 - halfVisibleW, seg.targetX));
        const targetY = Math.max(halfVisibleH, Math.min(1 - halfVisibleH, seg.targetY));

        return {
            id: `focus_seg_${index}_${Math.round(seg.startTime * 10)}`,
            startTime: Math.max(0, seg.startTime),
            endTime: Math.min(totalDurationSec, Math.max(seg.startTime + this.options.minSegmentDuration, seg.endTime)),
            targetX,
            targetY,
            zoomScale: scale,
            reason: seg.reason,
            sceneMode: 'zoom',
            deadzoneRadius: this.options.deadzoneRadius,
        };
    }
}
