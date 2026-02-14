/// Zoom Engine Commands — Rust-powered zoom, cursor, and segment generation
/// Replaces all JS zoom engines (CinemaZoomEngine, CinemaCursorEngine, SpringPhysics)
/// Modeled after Cap's rendering crate architecture.

use serde::{Deserialize, Serialize};
use crate::rendering::spring_physics::{SpringConfig, SpringSimulation, spring_ease, spring_ease_out, instant_ease};

// ═══════════════════════════════════════════════════════════════
// Shared Data Types (serialized to/from JS)
// ═══════════════════════════════════════════════════════════════

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClickEvent {
    pub time: f64,     // ms
    pub x: f64,        // 0-1 normalized
    pub y: f64,        // 0-1 normalized
    #[serde(default = "default_true")]
    pub down: bool,
}

fn default_true() -> bool { true }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MoveEvent {
    pub time: f64,     // ms
    pub x: f64,        // 0-1 normalized
    pub y: f64,        // 0-1 normalized
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ZoomSegment {
    pub start: f64,    // seconds
    pub end: f64,      // seconds
    pub amount: f64,   // zoom level
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ZoomState {
    pub x: f64,        // camera center x (0-1)
    pub y: f64,        // camera center y (0-1)
    pub scale: f64,    // camera zoom scale (1.0 = no zoom)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CursorState {
    pub x: f64,
    pub y: f64,
    pub opacity: f64,
    pub click_progress: f64,
    pub motion: f64,
}

// ═══════════════════════════════════════════════════════════════
// Constants — tuned for aesthetic, cinematic zoom feel
// ═══════════════════════════════════════════════════════════════

const ZOOM_DURATION: f64 = 1.0;  // seconds for zoom in/out transition — slow & cinematic (matches Cap)

const CLICK_GROUP_TIME_THRESHOLD_SECS: f64 = 2.5;
const CLICK_GROUP_SPATIAL_THRESHOLD: f64 = 0.15;
const CLICK_PRE_PADDING: f64 = 0.4;   // start zooming in slightly earlier for anticipation
const CLICK_POST_PADDING: f64 = 2.0;  // hold zoom longer after click — gives viewer time to read
const MERGE_GAP_THRESHOLD: f64 = 0.8; // wider merge window to avoid jarring in-out-in
const MIN_SEGMENT_DURATION: f64 = 1.2; // longer minimum so short segments don't flash
const STOP_PADDING_SECONDS: f64 = 0.5;
const AUTO_ZOOM_AMOUNT: f64 = 1.8;    // slightly less aggressive zoom (1.8x vs 2.0x) — more subtle

// Cursor smoothing
const CURSOR_IDLE_DELAY_MS: f64 = 600.0;  // wait a bit longer before fading
const CURSOR_FADE_OUT_MS: f64 = 500.0;    // slower fade for elegance
const CLICK_REACTION_WINDOW_MS: f64 = 160.0;
const CLICK_VISUAL_DURATION_MS: f64 = 350.0;  // slightly longer click ripple
const SHAKE_THRESHOLD: f64 = 0.015;
const SHAKE_WINDOW_MS: f64 = 100.0;

// Screen spring constants — softer springs for smooth, cinematic movement
const SCREEN_SPRING_STIFFNESS: f64 = 120.0;  // softer than Cap's 200 — less snappy, more fluid
const SCREEN_SPRING_DAMPING: f64 = 32.0;     // lower damping — allows gentle overshoot for organic feel
const SCREEN_SPRING_MASS: f64 = 2.5;         // slightly heavier — slower to start, graceful deceleration

// ═══════════════════════════════════════════════════════════════
// Command: Generate Zoom Segments from Clicks
// ═══════════════════════════════════════════════════════════════

#[tauri::command]
pub fn generate_zoom_segments(
    clicks: Vec<ClickEvent>,
    moves: Vec<MoveEvent>,
    duration_ms: f64,
) -> Vec<ZoomSegment> {
    let max_duration = duration_ms / 1000.0;
    generate_segments_impl(clicks, moves, max_duration)
}

/// Core segment generation — ported from Cap's generate_zoom_segments_from_clicks_impl
fn generate_segments_impl(
    clicks: Vec<ClickEvent>,
    moves: Vec<MoveEvent>,
    max_duration: f64,
) -> Vec<ZoomSegment> {
    if max_duration <= 0.0 {
        return Vec::new();
    }

    let activity_end_limit = if max_duration > STOP_PADDING_SECONDS {
        max_duration - STOP_PADDING_SECONDS
    } else {
        max_duration
    };

    if activity_end_limit <= f64::EPSILON {
        return Vec::new();
    }

    // Filter to down-clicks within the valid time range
    let down_clicks: Vec<&ClickEvent> = clicks.iter()
        .filter(|c| c.down && c.time / 1000.0 < activity_end_limit)
        .collect();

    if down_clicks.is_empty() {
        return Vec::new();
    }

    // Build click position map (find nearest move for each click)
    let click_positions: Vec<(f64, f64, f64)> = down_clicks.iter()
        .map(|click| {
            let click_time = click.time;
            let pos = moves.iter()
                .rfind(|m| m.time <= click_time)
                .map(|m| (m.x, m.y))
                .unwrap_or((click.x, click.y));
            (click_time / 1000.0, pos.0, pos.1)
        })
        .collect();

    // Group clicks by temporal + spatial proximity
    let mut groups: Vec<Vec<usize>> = Vec::new();

    for (idx, &(click_time, click_x, click_y)) in click_positions.iter().enumerate() {
        let mut found_group = false;

        for group in groups.iter_mut() {
            let can_join = group.iter().any(|&gidx| {
                let (gt, gx, gy) = click_positions[gidx];
                let time_close = (click_time - gt).abs() < CLICK_GROUP_TIME_THRESHOLD_SECS;
                let dx = click_x - gx;
                let dy = click_y - gy;
                let spatial_close = (dx * dx + dy * dy).sqrt() < CLICK_GROUP_SPATIAL_THRESHOLD;
                time_close && spatial_close
            });

            if can_join {
                group.push(idx);
                found_group = true;
                break;
            }
        }

        if !found_group {
            groups.push(vec![idx]);
        }
    }

    // Convert groups to time intervals
    let mut intervals: Vec<(f64, f64)> = Vec::new();

    for group in &groups {
        if group.is_empty() { continue; }

        let times: Vec<f64> = group.iter().map(|&i| click_positions[i].0).collect();
        let group_start = times.iter().cloned().fold(f64::INFINITY, f64::min);
        let group_end = times.iter().cloned().fold(f64::NEG_INFINITY, f64::max);

        let start = (group_start - CLICK_PRE_PADDING).max(0.0);
        let end = (group_end + CLICK_POST_PADDING).min(activity_end_limit);

        if end > start {
            intervals.push((start, end));
        }
    }

    if intervals.is_empty() {
        return Vec::new();
    }

    // Sort and merge overlapping/close intervals
    intervals.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap_or(std::cmp::Ordering::Equal));

    let mut merged: Vec<(f64, f64)> = Vec::new();
    for interval in intervals {
        if let Some(last) = merged.last_mut() {
            if interval.0 <= last.1 + MERGE_GAP_THRESHOLD {
                last.1 = last.1.max(interval.1);
                continue;
            }
        }
        merged.push(interval);
    }

    // Convert to ZoomSegments, filtering out too-short ones
    merged.into_iter()
        .filter_map(|(start, end)| {
            let duration = end - start;
            if duration < MIN_SEGMENT_DURATION {
                return None;
            }
            Some(ZoomSegment {
                start,
                end,
                amount: AUTO_ZOOM_AMOUNT,
            })
        })
        .collect()
}

// ═══════════════════════════════════════════════════════════════
// Command: Evaluate Zoom at Time
// ═══════════════════════════════════════════════════════════════

#[tauri::command]
pub fn evaluate_zoom_at_time(
    segments: Vec<ZoomSegment>,
    time_ms: f64,
    cursor_x: f64,
    cursor_y: f64,
) -> ZoomState {
    if segments.is_empty() {
        return ZoomState { x: 0.5, y: 0.5, scale: 1.0 };
    }

    let time_secs = time_ms / 1000.0;

    // Find which segment we're in or transitioning from
    let (zoom_t, focus_x, focus_y) = evaluate_segments(&segments, time_secs, cursor_x, cursor_y);

    if zoom_t <= 0.001 {
        return ZoomState { x: 0.5, y: 0.5, scale: 1.0 };
    }

    // Compute zoomed camera position
    let amount = 1.0 + (AUTO_ZOOM_AMOUNT - 1.0) * zoom_t;
    let half = 0.5 / amount;

    // Center on focus, clamped to keep viewport in bounds
    let cx = focus_x.clamp(half, 1.0 - half);
    let cy = focus_y.clamp(half, 1.0 - half);

    ZoomState {
        x: cx,
        y: cy,
        scale: amount,
    }
}

/// Core zoom evaluation — ported from Cap's InterpolatedZoom::new_with_easing_and_cursor
fn evaluate_segments(
    segments: &[ZoomSegment],
    time_secs: f64,
    cursor_x: f64,
    cursor_y: f64,
) -> (f64, f64, f64) {
    // Find current and previous segment
    let mut current_seg: Option<&ZoomSegment> = None;
    let mut prev_seg: Option<&ZoomSegment> = None;

    for (i, seg) in segments.iter().enumerate() {
        if time_secs > seg.start && time_secs <= seg.end {
            current_seg = Some(seg);
            if i > 0 {
                prev_seg = Some(&segments[i - 1]);
            }
            break;
        }
    }

    // If not in a segment, check if we recently left one
    if current_seg.is_none() {
        for seg in segments.iter().rev() {
            if seg.end <= time_secs {
                prev_seg = Some(seg);
                break;
            }
        }
    }

    match (prev_seg, current_seg) {
        // Zooming out from previous segment
        (Some(prev), None) => {
            let elapsed = time_secs - prev.end;
            if elapsed >= ZOOM_DURATION {
                return (0.0, 0.5, 0.5); // Fully zoomed out
            }
            let raw_t = (elapsed / ZOOM_DURATION) as f32;
            let ease_t = spring_ease_out(
                raw_t,
                SCREEN_SPRING_STIFFNESS,
                SCREEN_SPRING_DAMPING,
                SCREEN_SPRING_MASS,
            ) as f64;
            let zoom_t = 1.0 - ease_t;
            (zoom_t, cursor_x, cursor_y)
        }

        // Zooming into current segment (no previous)
        (None, Some(seg)) => {
            let elapsed = time_secs - seg.start;
            let raw_t = (elapsed / ZOOM_DURATION).min(1.0) as f32;
            let ease_t = spring_ease(
                raw_t,
                SCREEN_SPRING_STIFFNESS,
                SCREEN_SPRING_DAMPING,
                SCREEN_SPRING_MASS,
            ) as f64;
            (ease_t, cursor_x, cursor_y)
        }

        // Transitioning between segments
        (Some(prev), Some(seg)) => {
            let elapsed = time_secs - seg.start;
            let raw_t = (elapsed / ZOOM_DURATION).min(1.0) as f32;
            let ease_t = spring_ease(
                raw_t,
                SCREEN_SPRING_STIFFNESS,
                SCREEN_SPRING_DAMPING,
                SCREEN_SPRING_MASS,
            ) as f64;

            if seg.start == prev.end {
                // Back-to-back segments — stay zoomed, just pan
                (1.0, cursor_x, cursor_y)
            } else if seg.start - prev.end < ZOOM_DURATION {
                // Small gap — partial zoom out then back in
                // At seg.start, compute how far we'd have zoomed out
                let gap = seg.start - prev.end;
                let out_t = spring_ease_out(
                    (gap / ZOOM_DURATION) as f32,
                    SCREEN_SPRING_STIFFNESS,
                    SCREEN_SPRING_DAMPING,
                    SCREEN_SPRING_MASS,
                ) as f64;
                let min_zoom = 1.0 - out_t;
                // Blend from min_zoom to 1.0
                let t = min_zoom * (1.0 - ease_t) + ease_t;
                (t, cursor_x, cursor_y)
            } else {
                // Large gap — normal zoom in
                (ease_t, cursor_x, cursor_y)
            }
        }

        _ => (0.0, 0.5, 0.5),
    }
}

// ═══════════════════════════════════════════════════════════════
// Command: Interpolate Cursor at Time
// ═══════════════════════════════════════════════════════════════

#[tauri::command]
pub fn interpolate_cursor_at_time(
    moves: Vec<MoveEvent>,
    clicks: Vec<ClickEvent>,
    time_ms: f64,
) -> CursorState {
    if moves.is_empty() {
        return CursorState { x: 0.5, y: 0.5, opacity: 0.0, click_progress: 0.0, motion: 0.0 };
    }

    let time_secs = time_ms / 1000.0;

    // --- Position interpolation with spring smoothing ---
    let (x, y, vx, vy) = interpolate_cursor_position(&moves, time_ms);

    // --- Click progress ---
    let click_progress = compute_click_progress(&clicks, time_ms);

    // --- Opacity (idle fade) ---
    let opacity = compute_opacity(&moves, time_ms);

    // --- Motion magnitude ---
    let motion = ((vx * vx + vy * vy) as f64).sqrt().min(1.0);

    CursorState { x, y, opacity, click_progress, motion }
}

/// Spring-smoothed cursor position interpolation
fn interpolate_cursor_position(moves: &[MoveEvent], time_ms: f64) -> (f64, f64, f32, f32) {
    if moves.is_empty() {
        return (0.5, 0.5, 0.0, 0.0);
    }

    // Before first move
    if time_ms <= moves[0].time {
        return (moves[0].x, moves[0].y, 0.0, 0.0);
    }

    // After last move
    if let Some(last) = moves.last() {
        if time_ms >= last.time {
            return (last.x, last.y, 0.0, 0.0);
        }
    }

    // Filter shake
    let filtered = filter_shake(moves);
    
    // Run spring simulation up to query time
    let config = SpringConfig::cursor_default();
    let mut sim = SpringSimulation::new(config);
    sim.set_position([filtered[0].x as f32, filtered[0].y as f32]);
    sim.set_velocity([0.0, 0.0]);
    sim.set_target(sim.position);

    let mut last_time: f32 = 0.0;

    for m in filtered.iter() {
        if m.time > time_ms {
            // This move is in the future — set it as target and run partial step
            sim.set_target([m.x as f32, m.y as f32]);
            let dt = time_ms as f32 - last_time;
            sim.run(dt);
            last_time = time_ms as f32;
            break;
        }

        sim.set_target([m.x as f32, m.y as f32]);
        let dt = m.time as f32 - last_time;
        if dt > 0.0 {
            sim.run(dt);
        }
        last_time = m.time as f32;
    }

    // If we passed all moves without breaking, run remaining time
    if last_time < time_ms as f32 {
        let dt = time_ms as f32 - last_time;
        sim.run(dt);
    }

    let x = (sim.position[0] as f64).clamp(0.0, 1.0);
    let y = (sim.position[1] as f64).clamp(0.0, 1.0);

    (x, y, sim.velocity[0], sim.velocity[1])
}

/// Simple shake filter — removes jittery micro-movements
fn filter_shake(moves: &[MoveEvent]) -> Vec<&MoveEvent> {
    if moves.len() < 3 {
        return moves.iter().collect();
    }

    let mut result = Vec::with_capacity(moves.len());
    result.push(&moves[0]);

    for i in 1..moves.len() - 1 {
        let prev = &moves[i - 1];
        let curr = &moves[i];
        let next = &moves[i + 1];

        let time_window = next.time - prev.time;
        if time_window > SHAKE_WINDOW_MS {
            result.push(curr);
            continue;
        }

        let dx1 = curr.x - prev.x;
        let dy1 = curr.y - prev.y;
        let dx2 = next.x - curr.x;
        let dy2 = next.y - curr.y;

        let dot = dx1 * dx2 + dy1 * dy2;
        let dist = ((dx1 * dx1 + dy1 * dy1).sqrt() + (dx2 * dx2 + dy2 * dy2).sqrt()) * 0.5;

        // Skip if direction reversed AND movement is tiny (shake)
        if dot < 0.0 && dist < SHAKE_THRESHOLD {
            continue;
        }

        result.push(curr);
    }

    if let Some(last) = moves.last() {
        result.push(last);
    }

    result
}

/// Compute click visual progress (0 = no click, 0→1 = click animation)
fn compute_click_progress(clicks: &[ClickEvent], time_ms: f64) -> f64 {
    let mut best_progress = 0.0;

    for click in clicks.iter() {
        if !click.down { continue; }
        let elapsed = time_ms - click.time;
        if elapsed >= 0.0 && elapsed < CLICK_VISUAL_DURATION_MS {
            let t = elapsed / CLICK_VISUAL_DURATION_MS;
            // Smoothstep for nice in/out
            let progress = t * t * (3.0 - 2.0 * t);
            if progress > best_progress {
                best_progress = progress;
            }
        }
    }

    best_progress
}

/// Compute cursor opacity (fades out after idle)
fn compute_opacity(moves: &[MoveEvent], time_ms: f64) -> f64 {
    if moves.is_empty() {
        return 0.0;
    }

    // Find the last move before query time
    let last_move_time = moves.iter()
        .rfind(|m| m.time <= time_ms)
        .map(|m| m.time)
        .unwrap_or(0.0);

    let idle_time = time_ms - last_move_time;

    if idle_time <= CURSOR_IDLE_DELAY_MS {
        1.0
    } else {
        let fade_progress = (idle_time - CURSOR_IDLE_DELAY_MS) / CURSOR_FADE_OUT_MS;
        (1.0 - fade_progress).max(0.0)
    }
}

// ═══════════════════════════════════════════════════════════════
// Command: Batch evaluation (reduces IPC overhead)
// Returns both zoom and cursor state in one call
// ═══════════════════════════════════════════════════════════════

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FrameState {
    pub zoom: ZoomState,
    pub cursor: CursorState,
}

#[tauri::command]
pub fn evaluate_frame(
    segments: Vec<ZoomSegment>,
    moves: Vec<MoveEvent>,
    clicks: Vec<ClickEvent>,
    time_ms: f64,
) -> FrameState {
    // Get cursor position first (needed for zoom focus)
    let cursor = interpolate_cursor_at_time(moves.clone(), clicks.clone(), time_ms);

    // Use cursor position as zoom focus
    let zoom = evaluate_zoom_at_time(segments, time_ms, cursor.x, cursor.y);

    FrameState { zoom, cursor }
}

// ═══════════════════════════════════════════════════════════════
// Command: Precompute all frames (for export)
// Computes every frame's state upfront for consistent export
// ═══════════════════════════════════════════════════════════════

#[tauri::command]
pub fn precompute_frames(
    segments: Vec<ZoomSegment>,
    moves: Vec<MoveEvent>,
    clicks: Vec<ClickEvent>,
    duration_ms: f64,
    fps: f64,
) -> Vec<FrameState> {
    let frame_count = (duration_ms / 1000.0 * fps).ceil() as usize;
    let frame_duration_ms = 1000.0 / fps;

    let mut frames = Vec::with_capacity(frame_count);

    // Pre-filter and prepare cursor data
    let filtered_moves: Vec<MoveEvent> = {
        if moves.len() < 3 {
            moves.clone()
        } else {
            // Basic shake filter inline for performance
            let mut result = Vec::with_capacity(moves.len());
            result.push(moves[0].clone());
            for i in 1..moves.len() - 1 {
                let prev = &moves[i - 1];
                let curr = &moves[i];
                let next = &moves[i + 1];
                let time_window = next.time - prev.time;
                if time_window > SHAKE_WINDOW_MS {
                    result.push(curr.clone());
                    continue;
                }
                let dx1 = curr.x - prev.x;
                let dy1 = curr.y - prev.y;
                let dx2 = next.x - curr.x;
                let dy2 = next.y - curr.y;
                let dot = dx1 * dx2 + dy1 * dy2;
                let dist = ((dx1 * dx1 + dy1 * dy1).sqrt() + (dx2 * dx2 + dy2 * dy2).sqrt()) * 0.5;
                if !(dot < 0.0 && dist < SHAKE_THRESHOLD) {
                    result.push(curr.clone());
                }
            }
            if let Some(last) = moves.last() {
                result.push(last.clone());
            }
            result
        }
    };

    // Run spring simulation once through all frames
    let config = SpringConfig::cursor_default();
    let mut sim = SpringSimulation::new(config);
    if !filtered_moves.is_empty() {
        sim.set_position([filtered_moves[0].x as f32, filtered_moves[0].y as f32]);
    } else {
        sim.set_position([0.5, 0.5]);
    }
    sim.set_velocity([0.0, 0.0]);
    sim.set_target(sim.position);

    let mut move_idx = 0;
    let mut last_sim_time: f32 = 0.0;

    for frame in 0..frame_count {
        let time_ms = frame as f64 * frame_duration_ms;

        // Advance spring simulation to this frame time
        while move_idx < filtered_moves.len() && filtered_moves[move_idx].time <= time_ms {
            let m = &filtered_moves[move_idx];
            sim.set_target([m.x as f32, m.y as f32]);
            let dt = m.time as f32 - last_sim_time;
            if dt > 0.0 { sim.run(dt); }
            last_sim_time = m.time as f32;
            move_idx += 1;
        }

        // Run remaining time to exact frame position
        let remaining = time_ms as f32 - last_sim_time;
        if remaining > 0.0 {
            sim.run(remaining);
            last_sim_time = time_ms as f32;
        }

        let cx = (sim.position[0] as f64).clamp(0.0, 1.0);
        let cy = (sim.position[1] as f64).clamp(0.0, 1.0);

        let cursor = CursorState {
            x: cx,
            y: cy,
            opacity: compute_opacity(&filtered_moves, time_ms),
            click_progress: compute_click_progress(&clicks, time_ms),
            motion: ((sim.velocity[0] * sim.velocity[0] + sim.velocity[1] * sim.velocity[1]) as f64).sqrt().min(1.0),
        };

        let zoom = evaluate_zoom_at_time(segments.clone(), time_ms, cursor.x, cursor.y);

        frames.push(FrameState { zoom, cursor });
    }

    frames
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn no_segments_returns_identity() {
        let state = evaluate_zoom_at_time(vec![], 1000.0, 0.5, 0.5);
        assert_eq!(state.scale, 1.0);
        assert_eq!(state.x, 0.5);
    }

    #[test]
    fn segment_zooms_in() {
        let segments = vec![ZoomSegment { start: 1.0, end: 5.0, amount: 2.0 }];
        // At t=2.0 (1 second into segment), should be partially zoomed
        let state = evaluate_zoom_at_time(segments, 2000.0, 0.5, 0.5);
        assert!(state.scale > 1.0);
    }

    #[test]
    fn segment_zooms_out_after() {
        let segments = vec![ZoomSegment { start: 1.0, end: 3.0, amount: 2.0 }];
        // At t=3.5 (0.5s after segment end), should be zooming out
        let state = evaluate_zoom_at_time(segments.clone(), 3500.0, 0.5, 0.5);
        assert!(state.scale > 1.0); // Still partially zoomed

        // At t=5.0 (2s after segment end), should be fully out
        let state2 = evaluate_zoom_at_time(segments, 5000.0, 0.5, 0.5);
        assert!((state2.scale - 1.0).abs() < 0.01);
    }

    #[test]
    fn click_generates_segments() {
        let clicks = vec![
            ClickEvent { time: 1000.0, x: 0.5, y: 0.5, down: true },
            ClickEvent { time: 2000.0, x: 0.5, y: 0.5, down: true },
        ];
        let segments = generate_zoom_segments(clicks, vec![], 10000.0);
        assert!(!segments.is_empty());
        assert!(segments[0].start < 2.0); // Should start before clicks
    }

    #[test]
    fn cursor_interpolation_works() {
        let moves = vec![
            MoveEvent { time: 0.0, x: 0.0, y: 0.0 },
            MoveEvent { time: 1000.0, x: 1.0, y: 1.0 },
        ];
        let state = interpolate_cursor_at_time(moves, vec![], 500.0);
        assert!(state.x > 0.0 && state.x < 1.0);
        assert!(state.opacity > 0.5);
    }

    #[test]
    fn precompute_consistency() {
        let segments = vec![ZoomSegment { start: 1.0, end: 3.0, amount: 2.0 }];
        let moves = vec![
            MoveEvent { time: 0.0, x: 0.5, y: 0.5 },
            MoveEvent { time: 5000.0, x: 0.5, y: 0.5 },
        ];
        let frames = precompute_frames(segments, moves, vec![], 5000.0, 30.0);
        assert_eq!(frames.len(), 150);
        // First frame should be unzoomed
        assert!((frames[0].zoom.scale - 1.0).abs() < 0.1);
    }

    #[test]
    fn starts_panned_out() {
        // Critical test: at t=0, camera should be at scale 1.0 (no zoom)
        let segments = vec![ZoomSegment { start: 2.0, end: 5.0, amount: 2.0 }];
        let state = evaluate_zoom_at_time(segments, 0.0, 0.5, 0.5);
        assert_eq!(state.scale, 1.0, "Must start fully panned out!");
        assert_eq!(state.x, 0.5);
        assert_eq!(state.y, 0.5);
    }
}
