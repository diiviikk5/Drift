/// Zoom Engine Commands — Rust-powered zoom, cursor, and segment generation
/// Replaces all JS zoom engines (CinemaZoomEngine, CinemaCursorEngine, SpringPhysics)
/// Modeled after Cap's rendering crate architecture.

use serde::{Deserialize, Serialize};

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
    #[serde(default = "default_center")]
    pub target_x: f64, // 0-1 normalized
    #[serde(default = "default_center")]
    pub target_y: f64, // 0-1 normalized
}

fn default_center() -> f64 { 0.5 }

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
// Constants — tuned for aesthetic, cinematic zoom feel (single source of truth)
// ═══════════════════════════════════════════════════════════════

const RAMP_IN_DURATION: f64 = 0.80;   // seconds for calm anticipation ramp-in
const RAMP_OUT_DURATION: f64 = 1.05;  // seconds for silky overview landing with zero exit velocity
const CHAINED_PAN_GAP_SECS: f64 = 6.5;// gap threshold to chain consecutive interactions without zooming out
const CLICK_GROUP_TIME_THRESHOLD_SECS: f64 = 4.5;
const CLICK_GROUP_SPATIAL_THRESHOLD: f64 = 0.45;
const CLICK_PRE_PADDING: f64 = 0.40;  // start zooming in gently before click time
const CLICK_POST_PADDING: f64 = 2.2;  // hold zoom longer after click — gives viewer time to read
const MERGE_GAP_THRESHOLD: f64 = 5.0; // merge window to avoid jarring in-out-in
const MIN_SEGMENT_DURATION: f64 = 2.0;// longer minimum so short segments don't flash
const START_PADDING_SECONDS: f64 = 0.4; // filter out record button/window activation clicks
const STOP_PADDING_SECONDS: f64 = 0.5;
const AUTO_ZOOM_AMOUNT: f64 = 1.55;   // standard balanced 1.55x cinema zoom level
const DEADZONE_RADIUS: f64 = 0.18;    // generous deadzone: mouse moves freely without camera shake
const TRACK_DAMPING: f64 = 0.35;      // heavy studio damping when cursor approaches screen edges

// Cursor smoothing
const CURSOR_IDLE_DELAY_MS: f64 = 600.0;
const CURSOR_FADE_OUT_MS: f64 = 500.0;
const CLICK_VISUAL_DURATION_MS: f64 = 350.0;

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

    if activity_end_limit <= START_PADDING_SECONDS {
        return Vec::new();
    }

    // Filter to down-clicks within the valid time range (ignoring startup click)
    let down_clicks: Vec<&ClickEvent> = clicks.iter()
        .filter(|c| c.down && (c.time / 1000.0) >= START_PADDING_SECONDS && (c.time / 1000.0) < activity_end_limit)
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

    // Convert groups to raw ZoomSegments with centroid anchor
    let mut raw_segments: Vec<ZoomSegment> = Vec::new();

    for group in &groups {
        if group.is_empty() { continue; }

        let times: Vec<f64> = group.iter().map(|&i| click_positions[i].0).collect();
        let group_start = times.iter().cloned().fold(f64::INFINITY, f64::min);
        let group_end = times.iter().cloned().fold(f64::NEG_INFINITY, f64::max);

        let sum_x: f64 = group.iter().map(|&i| click_positions[i].1).sum();
        let sum_y: f64 = group.iter().map(|&i| click_positions[i].2).sum();
        let count = group.len() as f64;
        let target_x = (sum_x / count).clamp(0.0, 1.0);
        let target_y = (sum_y / count).clamp(0.0, 1.0);

        let start = (group_start - CLICK_PRE_PADDING).max(0.0);
        let end = (group_end + CLICK_POST_PADDING).min(activity_end_limit);

        if end > start {
            raw_segments.push(ZoomSegment {
                start,
                end,
                amount: AUTO_ZOOM_AMOUNT,
                target_x,
                target_y,
            });
        }
    }

    if raw_segments.is_empty() {
        return Vec::new();
    }

    // Sort and merge overlapping/close intervals
    raw_segments.sort_by(|a, b| a.start.partial_cmp(&b.start).unwrap_or(std::cmp::Ordering::Equal));

    let mut merged: Vec<ZoomSegment> = Vec::new();
    for seg in raw_segments {
        if let Some(last) = merged.last_mut() {
            let gap = seg.start - last.end;
            let dist = ((seg.target_x - last.target_x).powi(2) + (seg.target_y - last.target_y).powi(2)).sqrt();
            if (gap <= MERGE_GAP_THRESHOLD || gap <= 0.0) && dist <= 0.45 {
                // Merge nearby clicks into a single calm focus window
                last.end = last.end.max(seg.end);
                last.target_x = last.target_x * 0.40 + seg.target_x * 0.60;
                last.target_y = last.target_y * 0.40 + seg.target_y * 0.60;
                continue;
            } else if gap <= CHAINED_PAN_GAP_SECS {
                // Bridge gap so camera glides continuously between targets rather than dipping to overview
                last.end = seg.start;
            }
        }
        merged.push(seg);
    }

    // Guarantee strict non-overlapping sequence order
    for i in 0..merged.len().saturating_sub(1) {
        if merged[i].end > merged[i + 1].start {
            merged[i].end = merged[i + 1].start;
        }
    }

    // Convert to ZoomSegments, ensuring minimum duration so hold is calm and steady without overlapping next segment
    let len = merged.len();
    for i in 0..len {
        let max_end = if i + 1 < len {
            merged[i + 1].start
        } else {
            activity_end_limit
        };
        if merged[i].end - merged[i].start < MIN_SEGMENT_DURATION {
            let desired = (merged[i].start + MIN_SEGMENT_DURATION).min(activity_end_limit);
            merged[i].end = desired.min(max_end).max(merged[i].end);
        }
    }

    merged.into_iter()
        .filter(|s| s.end > s.start)
        .collect()
}

// ═══════════════════════════════════════════════════════════════
// Easing Curves — Cinema Grade
// ═══════════════════════════════════════════════════════════════

fn ease_cinema_ramp_in(t: f64) -> f64 {
    let clamped = t.clamp(0.0, 1.0);
    clamped * clamped * (3.0 - 2.0 * clamped)
}

fn ease_cinema_ramp_out(t: f64) -> f64 {
    let clamped = t.clamp(0.0, 1.0);
    let inv = 1.0 - clamped;
    1.0 - (inv * inv * (3.0 - 2.0 * inv))
}

fn ease_chained_pan(t: f64) -> f64 {
    let clamped = t.clamp(0.0, 1.0);
    clamped * clamped * clamped * (clamped * (clamped * 6.0 - 15.0) + 10.0)
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
    let (zoom_t, focus_x, focus_y, target_amount) = evaluate_segments(&segments, time_secs, cursor_x, cursor_y);

    if zoom_t <= 0.001 {
        return ZoomState { x: 0.5, y: 0.5, scale: 1.0 };
    }

    // Compute zoomed camera position
    let amount = 1.0 + (target_amount - 1.0) * zoom_t;
    let half = 0.5 / amount;

    // Center on focus, clamped to keep viewport strictly in bounds
    let cx = focus_x.clamp(half, 1.0 - half);
    let cy = focus_y.clamp(half, 1.0 - half);

    ZoomState {
        x: cx,
        y: cy,
        scale: amount,
    }
}

/// Real-time viewport adjustment to guarantee cursor is always inside the visible viewport.
/// Ported from proven reference architecture with 15% inner safety margin.
fn ensure_cursor_visible(
    focus_x: f64,
    focus_y: f64,
    scale: f64,
    cursor_x: f64,
    cursor_y: f64,
) -> (f64, f64, f64) {
    if scale <= 1.001 {
        return (0.5, 0.5, 1.0);
    }
    let v_size = 1.0 / scale;
    let margin = v_size * 0.15;

    let v_left = focus_x - v_size * 0.5;
    let v_top = focus_y - v_size * 0.5;

    let inner_left = v_left + margin;
    let inner_right = v_left + v_size - margin;
    let inner_top = v_top + margin;
    let inner_bottom = v_top + v_size - margin;

    if cursor_x >= inner_left && cursor_x <= inner_right && cursor_y >= inner_top && cursor_y <= inner_bottom {
        return (focus_x, focus_y, scale);
    }

    let mut new_left = v_left;
    let mut new_top = v_top;

    if cursor_x < inner_left {
        new_left = cursor_x - margin;
    } else if cursor_x > inner_right {
        new_left = cursor_x - v_size + margin;
    }

    if cursor_y < inner_top {
        new_top = cursor_y - margin;
    } else if cursor_y > inner_bottom {
        new_top = cursor_y - v_size + margin;
    }

    new_left = new_left.clamp(0.0, 1.0 - v_size);
    new_top = new_top.clamp(0.0, 1.0 - v_size);

    let cur_visible = cursor_x >= new_left && cursor_x <= new_left + v_size && cursor_y >= new_top && cursor_y <= new_top + v_size;
    if cur_visible {
        return (new_left + v_size * 0.5, new_top + v_size * 0.5, scale);
    }

    let dist_left = (cursor_x - 0.05).max(0.0);
    let dist_right = (1.0 - cursor_x - 0.05).max(0.0);
    let dist_top = (cursor_y - 0.05).max(0.0);
    let dist_bottom = (1.0 - cursor_y - 0.05).max(0.0);

    let max_zx = 0.5 / dist_left.min(dist_right).max(0.001);
    let max_zy = 0.5 / dist_top.min(dist_bottom).max(0.001);
    let effective_zoom = scale.min(max_zx.min(max_zy)).max(1.0);
    let new_v_size = 1.0 / effective_zoom;

    let final_left = (cursor_x - new_v_size * 0.5).clamp(0.0, 1.0 - new_v_size);
    let final_top = (cursor_y - new_v_size * 0.5).clamp(0.0, 1.0 - new_v_size);

    (final_left + new_v_size * 0.5, final_top + new_v_size * 0.5, effective_zoom)
}

/// Core zoom evaluation — smooth transitions, connected pans, and deadzone damping
fn evaluate_segments(
    segments: &[ZoomSegment],
    time_secs: f64,
    cursor_x: f64,
    cursor_y: f64,
) -> (f64, f64, f64, f64) {
    if segments.is_empty() {
        return (0.0, 0.5, 0.5, AUTO_ZOOM_AMOUNT);
    }

    // 1. Check chained pan transition between consecutive segments
    for i in 0..segments.len().saturating_sub(1) {
        let seg_a = &segments[i];
        let seg_b = &segments[i + 1];
        let gap = seg_b.start - seg_a.end;

        if gap <= CHAINED_PAN_GAP_SECS {
            let (tran_start, tran_end) = if gap > RAMP_IN_DURATION {
                (seg_a.end, seg_b.start)
            } else {
                let junction = (seg_a.end + seg_b.start) * 0.5;
                let pan_dur = 0.75_f64.min((seg_a.end - seg_a.start) * 0.7).min((seg_b.end - seg_b.start) * 0.7).max(0.2);
                (junction - pan_dur * 0.5, junction + pan_dur * 0.5)
            };

            // Hold calm focus on seg_a during pre-pan gap instead of dropping to overview
            if time_secs >= seg_a.end && time_secs < tran_start {
                let (fx, fy, sc) = if seg_a.amount > 1.05 {
                    ensure_cursor_visible(seg_a.target_x, seg_a.target_y, seg_a.amount, cursor_x, cursor_y)
                } else {
                    (seg_a.target_x, seg_a.target_y, seg_a.amount)
                };
                return (1.0, fx, fy, sc);
            }

            if time_secs >= tran_start && time_secs <= tran_end {
                let span = (tran_end - tran_start).max(0.001);
                let progress = ((time_secs - tran_start) / span).clamp(0.0, 1.0);
                let eased_pan = ease_chained_pan(progress);

                let scale_a = seg_a.amount;
                let scale_b = seg_b.amount;
                let connected_scale = scale_a + (scale_b - scale_a) * eased_pan;

                let pan_x = seg_a.target_x + (seg_b.target_x - seg_a.target_x) * eased_pan;
                let pan_y = seg_a.target_y + (seg_b.target_y - seg_a.target_y) * eased_pan;
                return (1.0, pan_x, pan_y, connected_scale);
            }
        }
    }

    // 2. Check if inside or transitioning into/out of a segment
    for (i, seg) in segments.iter().enumerate() {
        let prev_seg = if i > 0 { Some(&segments[i - 1]) } else { None };
        let next_seg = segments.get(i + 1);

        let has_chained_prev = prev_seg.map_or(false, |p| (seg.start - p.end) <= CHAINED_PAN_GAP_SECS);
        let has_chained_next = next_seg.map_or(false, |n| (n.start - seg.end) <= CHAINED_PAN_GAP_SECS);

        let ramp_up_dur = RAMP_IN_DURATION.min((seg.end - seg.start) * 0.5);
        let ramp_down_dur = RAMP_OUT_DURATION.min((seg.end - seg.start) * 0.5);

        let lead_in = seg.start;
        let ramp_up_end = seg.start + ramp_up_dur;
        let ramp_down_start = seg.end - ramp_down_dur;
        let lead_out = seg.end;

        if time_secs >= lead_in && time_secs <= lead_out {
            let blend_weight = if time_secs < ramp_up_end && !has_chained_prev {
                let progress = ((time_secs - lead_in) / ramp_up_dur).clamp(0.0, 1.0);
                ease_cinema_ramp_in(progress)
            } else if time_secs > ramp_down_start && !has_chained_next {
                let progress = ((time_secs - ramp_down_start) / ramp_down_dur).clamp(0.0, 1.0);
                1.0 - ease_cinema_ramp_out(progress)
            } else {
                1.0
            };

            // Deadzone and damping around focal target
            let mut focus_x = seg.target_x;
            let mut focus_y = seg.target_y;

            let dx = cursor_x - focus_x;
            let dy = cursor_y - focus_y;
            let dist = (dx * dx + dy * dy).sqrt();

            if dist > DEADZONE_RADIUS {
                let pull = ((dist - DEADZONE_RADIUS) / dist) * TRACK_DAMPING;
                focus_x += dx * pull;
                focus_y += dy * pull;
            }

            let (final_fx, final_fy, final_scale) = if seg.amount > 1.05 && blend_weight > 0.1 {
                ensure_cursor_visible(focus_x, focus_y, seg.amount, cursor_x, cursor_y)
            } else {
                (focus_x, focus_y, seg.amount)
            };

            return (blend_weight, final_fx, final_fy, final_scale);
        }
    }

    // 3. Zooming out after the very last segment
    if let Some(last) = segments.last() {
        if time_secs > last.end {
            let elapsed = time_secs - last.end;
            if elapsed < RAMP_OUT_DURATION {
                let progress = (elapsed / RAMP_OUT_DURATION).clamp(0.0, 1.0);
                let blend_weight = 1.0 - ease_cinema_ramp_out(progress);
                return (blend_weight, last.target_x, last.target_y, last.amount);
            }
        }
    }

    (0.0, 0.5, 0.5, AUTO_ZOOM_AMOUNT)
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

    // --- Position interpolation with smooth trajectory ---
    let (x, y, vx, vy) = interpolate_cursor_position(&moves, time_ms);

    // --- Click progress ---
    let click_progress = compute_click_progress(&clicks, time_ms);

    // --- Opacity (idle fade) ---
    let opacity = compute_opacity(&moves, time_ms);

    // --- Motion magnitude ---
    let motion = ((vx * vx + vy * vy) as f64).sqrt().min(1.0);

    CursorState { x, y, opacity, click_progress, motion }
}

/// Smooth cursor position interpolation between telemetry samples
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

    // Binary search for bracketing moves
    let idx = moves.partition_point(|m| m.time <= time_ms);
    if idx == 0 {
        return (moves[0].x, moves[0].y, 0.0, 0.0);
    }
    if idx >= moves.len() {
        let last = moves.last().unwrap();
        return (last.x, last.y, 0.0, 0.0);
    }

    let a = &moves[idx - 1];
    let b = &moves[idx];
    let duration = (b.time - a.time).max(0.001);
    let t = ((time_ms - a.time) / duration).clamp(0.0, 1.0);

    // Smooth hermite cubic interpolation
    let s = t * t * (3.0 - 2.0 * t);
    let x = (a.x + (b.x - a.x) * s).clamp(0.0, 1.0);
    let y = (a.y + (b.y - a.y) * s).clamp(0.0, 1.0);

    let dt_sec = duration / 1000.0;
    let vx = ((b.x - a.x) / dt_sec) as f32;
    let vy = ((b.y - a.y) / dt_sec) as f32;

    (x, y, vx, vy)
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

    for frame in 0..frame_count {
        let time_ms = frame as f64 * frame_duration_ms;
        let cursor = interpolate_cursor_at_time(moves.clone(), clicks.clone(), time_ms);
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
        let segments = vec![ZoomSegment { start: 1.0, end: 5.0, amount: 2.0, target_x: 0.5, target_y: 0.5 }];
        // At t=2.0 (1 second into segment), should be partially zoomed
        let state = evaluate_zoom_at_time(segments, 2000.0, 0.5, 0.5);
        assert!(state.scale > 1.0);
    }

    #[test]
    fn segment_zooms_out_after() {
        let segments = vec![ZoomSegment { start: 1.0, end: 3.0, amount: 2.0, target_x: 0.5, target_y: 0.5 }];
        // At t=3.5 (0.5s after segment end), should be zooming out (RAMP_OUT_DURATION is 1.05s)
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
        assert!((segments[0].target_x - 0.5).abs() < 0.01);
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
        let segments = vec![ZoomSegment { start: 1.0, end: 3.0, amount: 2.0, target_x: 0.5, target_y: 0.5 }];
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
        let segments = vec![ZoomSegment { start: 2.0, end: 5.0, amount: 2.0, target_x: 0.5, target_y: 0.5 }];
        let state = evaluate_zoom_at_time(segments, 0.0, 0.5, 0.5);
        assert_eq!(state.scale, 1.0, "Must start fully panned out!");
        assert_eq!(state.x, 0.5);
        assert_eq!(state.y, 0.5);
    }
}
