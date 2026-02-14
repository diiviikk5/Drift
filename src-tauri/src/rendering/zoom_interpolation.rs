/// Zoom Interpolation Engine
/// Matches and exceeds Cap's zoom.rs + zoom_focus_interpolation.rs:
/// - Segment-based zoom with spring easing
/// - Cursor visibility guarantee during zoom
/// - Edge snapping
/// - Focus precomputation using ScreenMovementSpring
/// - Gap interpolation between segments

use serde::{Deserialize, Serialize};
use super::spring_physics::{SpringConfig, SpringSimulation, spring_ease, spring_ease_out, instant_ease};
use super::cursor_interpolation::{CursorEvents, interpolate_cursor};

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

pub const ZOOM_DURATION: f64 = 1.0;  // Seconds for zoom-in/out transition

const SCREEN_SPRING_STIFFNESS: f64 = 200.0;
const SCREEN_SPRING_DAMPING: f64 = 40.0;
const SCREEN_SPRING_MASS: f64 = 2.25;

const FOCUS_SAMPLE_INTERVAL_MS: f64 = 8.0; // 125 Hz precomputation

// ═══════════════════════════════════════════════════════════════
// Data Types
// ═══════════════════════════════════════════════════════════════

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ZoomSegment {
    pub start: f64,        // seconds
    pub end: f64,          // seconds
    pub amount: f64,       // zoom level (1.5 = 150% zoom)
    pub mode: ZoomMode,
    pub instant_animation: bool,
    pub edge_snap_ratio: f64,   // 0.0 to 1.0
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub enum ZoomMode {
    Auto,       // Follow cursor
    Manual,     // Fixed position
}

#[derive(Debug, Clone, Copy)]
pub struct ZoomBounds {
    pub top_left: [f64; 2],
    pub bottom_right: [f64; 2],
}

impl ZoomBounds {
    pub fn identity() -> Self {
        Self {
            top_left: [0.0, 0.0],
            bottom_right: [1.0, 1.0],
        }
    }

    pub fn scale(&self) -> f64 {
        (self.bottom_right[0] - self.top_left[0]).max(0.001)
    }

    pub fn center(&self) -> [f64; 2] {
        [
            (self.top_left[0] + self.bottom_right[0]) * 0.5,
            (self.top_left[1] + self.bottom_right[1]) * 0.5,
        ]
    }
}

#[derive(Debug, Clone)]
pub struct InterpolatedZoom {
    pub bounds: ZoomBounds,
    pub is_active: bool,
    pub transition_progress: f64,
}

impl InterpolatedZoom {
    pub fn identity() -> Self {
        Self {
            bounds: ZoomBounds::identity(),
            is_active: false,
            transition_progress: 0.0,
        }
    }

    /// Get camera center and scale for the compositor
    pub fn camera_center(&self) -> [f32; 2] {
        let c = self.bounds.center();
        [c[0] as f32, c[1] as f32]
    }

    pub fn camera_scale(&self) -> f32 {
        (1.0 / self.bounds.scale()) as f32
    }
}

// ═══════════════════════════════════════════════════════════════
// Segment Cursor — finds active segment at a given time
// ═══════════════════════════════════════════════════════════════

#[derive(Debug, Clone)]
pub struct SegmentsCursor {
    pub segment: Option<ZoomSegment>,
    pub time_in_segment: f64,    // 0.0 to 1.0 within transition
    pub time_since_end: f64,     // for zoom-out transition
    pub prev_segment: Option<ZoomSegment>,
}

impl SegmentsCursor {
    /// Find the active zoom segment at a given time
    pub fn at_time(segments: &[ZoomSegment], time_secs: f64) -> Self {
        // Find segment we're inside
        for (i, seg) in segments.iter().enumerate() {
            if time_secs >= seg.start && time_secs <= seg.end {
                let elapsed = time_secs - seg.start;
                let progress = (elapsed / ZOOM_DURATION).min(1.0);

                let prev = if i > 0 { Some(segments[i - 1].clone()) } else { None };

                return Self {
                    segment: Some(seg.clone()),
                    time_in_segment: progress,
                    time_since_end: 0.0,
                    prev_segment: prev,
                };
            }
        }

        // Check if we're in the zoom-out transition after a segment
        for (i, seg) in segments.iter().enumerate() {
            if time_secs > seg.end && time_secs < seg.end + ZOOM_DURATION {
                let time_since_end = time_secs - seg.end;
                let next = segments.get(i + 1).cloned();

                return Self {
                    segment: next,
                    time_in_segment: 0.0,
                    time_since_end,
                    prev_segment: Some(seg.clone()),
                };
            }
        }

        // No active segment — check for approaching segments
        Self {
            segment: None,
            time_in_segment: 0.0,
            time_since_end: 0.0,
            prev_segment: segments.last().filter(|s| time_secs > s.end).cloned(),
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// Zoom Focus Interpolator
// Precomputes spring-smoothed focus points at 125 Hz
// ═══════════════════════════════════════════════════════════════

#[derive(Clone)]
struct FocusEvent {
    time_ms: f64,
    position: [f32; 2],
}

pub struct ZoomFocusInterpolator {
    events: Option<Vec<FocusEvent>>,
    cursor_events: CursorEvents,
    cursor_smoothing: Option<SpringConfig>,
    screen_spring: SpringConfig,
    duration_secs: f64,
}

impl ZoomFocusInterpolator {
    pub fn new(
        cursor_events: &CursorEvents,
        cursor_smoothing: Option<SpringConfig>,
        screen_spring: SpringConfig,
        duration_secs: f64,
    ) -> Self {
        Self {
            events: None,
            cursor_events: cursor_events.clone(),
            cursor_smoothing,
            screen_spring,
            duration_secs,
        }
    }

    /// Precompute focus positions at FOCUS_SAMPLE_INTERVAL_MS intervals
    /// This is called once before rendering begins
    pub fn precompute(&mut self) {
        if self.events.is_some() {
            return;
        }

        if self.cursor_events.moves.is_empty() {
            self.events = Some(vec![]);
            return;
        }

        let mut sim = SpringSimulation::new(self.screen_spring);

        // Initialize at first cursor position
        let first = interpolate_cursor(
            &self.cursor_events,
            0.0,
            self.cursor_smoothing,
            None,
        );
        let initial = match first {
            Some(c) => [c.x as f32, c.y as f32],
            None => [0.5, 0.5],
        };

        sim.set_position(initial);
        sim.set_velocity([0.0, 0.0]);
        sim.set_target(initial);

        let total_ms = self.duration_secs * 1000.0;
        let sample_count = (total_ms / FOCUS_SAMPLE_INTERVAL_MS).ceil() as usize + 1;
        let mut events = Vec::with_capacity(sample_count);
        let mut current_time_ms = 0.0;

        while current_time_ms <= total_ms {
            let time_secs = current_time_ms / 1000.0;

            // Get cursor position at this time
            let cursor = interpolate_cursor(
                &self.cursor_events,
                time_secs as f32,
                self.cursor_smoothing,
                None,
            );

            if let Some(c) = cursor {
                sim.set_target([c.x as f32, c.y as f32]);
            }

            sim.run(FOCUS_SAMPLE_INTERVAL_MS as f32);

            events.push(FocusEvent {
                time_ms: current_time_ms,
                position: sim.position,
            });

            current_time_ms += FOCUS_SAMPLE_INTERVAL_MS;
        }

        self.events = Some(events);
    }

    /// Get interpolated focus position at a given time
    pub fn interpolate(&self, time_secs: f32) -> [f64; 2] {
        match &self.events {
            Some(events) if !events.is_empty() => {
                self.interpolate_from_events(events, time_secs)
            }
            _ => {
                // Fallback: direct cursor interpolation
                let cursor = interpolate_cursor(
                    &self.cursor_events,
                    time_secs,
                    self.cursor_smoothing,
                    None,
                );
                match cursor {
                    Some(c) => [c.x, c.y],
                    None => [0.5, 0.5],
                }
            }
        }
    }

    fn interpolate_from_events(&self, events: &[FocusEvent], time_secs: f32) -> [f64; 2] {
        let time_ms = (time_secs * 1000.0) as f64;

        // Binary search for the bracketing events
        let idx = events.partition_point(|e| e.time_ms <= time_ms);

        if idx == 0 {
            let p = events[0].position;
            return [p[0] as f64, p[1] as f64];
        }

        if idx >= events.len() {
            let p = events.last().unwrap().position;
            return [p[0] as f64, p[1] as f64];
        }

        // Linear interpolation between two precomputed events
        let a = &events[idx - 1];
        let b = &events[idx];
        let t = ((time_ms - a.time_ms) / (b.time_ms - a.time_ms)) as f32;

        let x = a.position[0] + (b.position[0] - a.position[0]) * t;
        let y = a.position[1] + (b.position[1] - a.position[1]) * t;

        [x as f64, y as f64]
    }
}

// ═══════════════════════════════════════════════════════════════
// Main Zoom Interpolation
// ═══════════════════════════════════════════════════════════════

/// Compute zoom bounds at a given time
pub fn interpolate_zoom(
    segments: &[ZoomSegment],
    time_secs: f64,
    focus_interpolator: &ZoomFocusInterpolator,
    actual_cursor: Option<[f64; 2]>,
) -> InterpolatedZoom {
    if segments.is_empty() {
        return InterpolatedZoom::identity();
    }

    let cursor = SegmentsCursor::at_time(segments, time_secs);

    match (&cursor.segment, &cursor.prev_segment) {
        (Some(seg), _) => {
            // Inside a zoom segment — easing in
            let ease_t = if seg.instant_animation {
                instant_ease(cursor.time_in_segment as f32) as f64
            } else {
                spring_ease(
                    cursor.time_in_segment as f32,
                    SCREEN_SPRING_STIFFNESS,
                    SCREEN_SPRING_DAMPING,
                    SCREEN_SPRING_MASS,
                ) as f64
            };

            let amount = 1.0 + (seg.amount - 1.0) * ease_t;
            let focus = focus_interpolator.interpolate(time_secs as f32);
            let bounds = compute_zoom_bounds(focus, amount, seg.edge_snap_ratio, actual_cursor);

            InterpolatedZoom {
                bounds,
                is_active: true,
                transition_progress: ease_t,
            }
        }
        (None, Some(prev)) if cursor.time_since_end > 0.0 && cursor.time_since_end < ZOOM_DURATION => {
            // Zooming out from previous segment
            let out_t = (cursor.time_since_end / ZOOM_DURATION) as f32;
            let ease_t = if prev.instant_animation {
                instant_ease(out_t) as f64
            } else {
                spring_ease_out(
                    out_t,
                    SCREEN_SPRING_STIFFNESS,
                    SCREEN_SPRING_DAMPING,
                    SCREEN_SPRING_MASS,
                ) as f64
            };

            let amount = prev.amount + (1.0 - prev.amount) * ease_t;
            let focus = focus_interpolator.interpolate(time_secs as f32);
            let bounds = compute_zoom_bounds(focus, amount, prev.edge_snap_ratio, actual_cursor);

            InterpolatedZoom {
                bounds,
                is_active: true,
                transition_progress: 1.0 - ease_t,
            }
        }
        _ => InterpolatedZoom::identity(),
    }
}

/// Compute zoom bounds centered on focus, with cursor visibility guarantee and edge snap
fn compute_zoom_bounds(
    focus: [f64; 2],
    amount: f64,
    edge_snap: f64,
    actual_cursor: Option<[f64; 2]>,
) -> ZoomBounds {
    if amount <= 1.001 {
        return ZoomBounds::identity();
    }

    let half_size = 0.5 / amount;

    // Start centered on focus
    let mut cx = focus[0];
    let mut cy = focus[1];

    // Ensure cursor is visible (Cap's ensure_cursor_visible)
    if let Some(cursor) = actual_cursor {
        let margin = half_size * 0.15; // 15% margin from edges

        let left = cx - half_size + margin;
        let right = cx + half_size - margin;
        let top = cy - half_size + margin;
        let bottom = cy + half_size - margin;

        if cursor[0] < left {
            cx -= left - cursor[0];
        } else if cursor[0] > right {
            cx += cursor[0] - right;
        }

        if cursor[1] < top {
            cy -= top - cursor[1];
        } else if cursor[1] > bottom {
            cy += cursor[1] - bottom;
        }
    }

    // Edge snapping — push viewport away from edges
    if edge_snap > 0.0 {
        let snap = edge_snap * half_size;

        if cx - half_size < snap {
            cx = half_size + snap;
        }
        if cx + half_size > 1.0 - snap {
            cx = 1.0 - half_size - snap;
        }
        if cy - half_size < snap {
            cy = half_size + snap;
        }
        if cy + half_size > 1.0 - snap {
            cy = 1.0 - half_size - snap;
        }
    }

    // Clamp so viewport stays within display
    cx = cx.clamp(half_size, 1.0 - half_size);
    cy = cy.clamp(half_size, 1.0 - half_size);

    ZoomBounds {
        top_left: [cx - half_size, cy - half_size],
        bottom_right: [cx + half_size, cy + half_size],
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_segment() -> ZoomSegment {
        ZoomSegment {
            start: 1.0,
            end: 5.0,
            amount: 2.0,
            mode: ZoomMode::Auto,
            instant_animation: false,
            edge_snap_ratio: 0.1,
        }
    }

    #[test]
    fn no_zoom_without_segments() {
        let events = CursorEvents { moves: vec![], clicks: vec![] };
        let mut interpolator = ZoomFocusInterpolator::new(&events, None, SpringConfig::screen_movement(), 10.0);
        interpolator.precompute();

        let zoom = interpolate_zoom(&[], 2.0, &interpolator, None);
        assert!(!zoom.is_active);
    }

    #[test]
    fn zoom_active_during_segment() {
        let events = CursorEvents {
            moves: vec![
                super::super::cursor_interpolation::CursorMoveEvent {
                    time_ms: 0.0, x: 0.5, y: 0.5, cursor_id: "d".into(),
                },
            ],
            clicks: vec![],
        };
        let mut interpolator = ZoomFocusInterpolator::new(&events, None, SpringConfig::screen_movement(), 10.0);
        interpolator.precompute();

        let seg = make_segment();
        let zoom = interpolate_zoom(&[seg], 3.0, &interpolator, Some([0.5, 0.5]));
        assert!(zoom.is_active);
        assert!(zoom.camera_scale() > 1.0);
    }

    #[test]
    fn cursor_stays_visible() {
        let bounds = compute_zoom_bounds([0.5, 0.5], 3.0, 0.0, Some([0.8, 0.8]));
        // Cursor at 0.8 should be inside the bounds
        assert!(bounds.top_left[0] <= 0.8);
        assert!(bounds.bottom_right[0] >= 0.8);
    }

    #[test]
    fn edge_snap_keeps_margin() {
        let bounds = compute_zoom_bounds([0.1, 0.1], 2.0, 0.2, None);
        assert!(bounds.top_left[0] >= 0.0);
        assert!(bounds.top_left[1] >= 0.0);
    }
}
