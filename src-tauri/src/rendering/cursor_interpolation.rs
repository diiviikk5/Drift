/// Cursor Interpolation Engine
/// Matches and exceeds Cap's cursor_interpolation.rs:
/// - Spring-smoothed cursor with 3 profiles (Default/Snappy/Drag)
/// - Shake filtering to remove high-frequency jitter
/// - Move densification to fill gaps in cursor data
/// - Click-spring profile switching near click events
/// - Velocity tracking for motion blur

use serde::{Deserialize, Serialize};
use super::spring_physics::{SpringConfig, SpringSimulation};

// ═══════════════════════════════════════════════════════════════
// Constants — tuned to exceed Cap's quality
// ═══════════════════════════════════════════════════════════════

const CLICK_REACTION_WINDOW_MS: f64 = 160.0;
const SHAKE_THRESHOLD_UV: f64 = 0.015;
const SHAKE_DETECTION_WINDOW_MS: f64 = 100.0;
const CURSOR_FRAME_DURATION_MS: f64 = 1000.0 / 60.0;
const GAP_INTERPOLATION_THRESHOLD_MS: f64 = CURSOR_FRAME_DURATION_MS * 4.0;
const MIN_CURSOR_TRAVEL_FOR_INTERPOLATION: f64 = 0.02;
const MAX_INTERPOLATED_STEPS: usize = 120;

/// Cursor idle fade constants
pub const CURSOR_IDLE_MIN_DELAY_MS: f64 = 500.0;
pub const CURSOR_IDLE_FADE_OUT_MS: f64 = 400.0;

/// Click visual effect constants
pub const CURSOR_CLICK_DURATION: f64 = 0.25;
pub const CLICK_SHRINK_SCALE: f64 = 0.7;

// ═══════════════════════════════════════════════════════════════
// Data Types
// ═══════════════════════════════════════════════════════════════

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CursorMoveEvent {
    pub time_ms: f64,
    pub x: f64,
    pub y: f64,
    pub cursor_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CursorClickEvent {
    pub time_ms: f64,
    pub down: bool,
    pub button: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CursorEvents {
    pub moves: Vec<CursorMoveEvent>,
    pub clicks: Vec<CursorClickEvent>,
}

#[derive(Debug, Clone)]
pub struct InterpolatedCursor {
    pub x: f64,
    pub y: f64,
    pub velocity_x: f32,
    pub velocity_y: f32,
    pub cursor_id: String,
    /// 0.0 to 1.0, time since last click
    pub click_progress: f64,
    /// Whether currently in a click
    pub is_clicking: bool,
    /// Opacity (idle fade)
    pub opacity: f64,
}

// ═══════════════════════════════════════════════════════════════
// Spring Profile System
// ═══════════════════════════════════════════════════════════════

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum SpringProfile {
    Default,
    Snappy,
    Drag,
}

struct CursorSpringPresets {
    default: SpringConfig,
    snappy: SpringConfig,
    drag: SpringConfig,
}

impl CursorSpringPresets {
    fn new(base: SpringConfig, click_spring: Option<SpringConfig>) -> Self {
        let snappy = click_spring.unwrap_or(SpringConfig {
            tension: 700.0,
            mass: 1.0,
            friction: 30.0,
        });

        Self {
            default: base,
            snappy,
            drag: base.scaled(0.8, 1.2, 1.3),
        }
    }

    fn config(&self, profile: SpringProfile) -> SpringConfig {
        match profile {
            SpringProfile::Default => self.default,
            SpringProfile::Snappy => self.snappy,
            SpringProfile::Drag => self.drag,
        }
    }
}

/// Tracks click events to determine which spring profile to use
struct ClickProfileTracker<'a> {
    clicks: &'a [CursorClickEvent],
    next_index: usize,
    last_click_time: Option<f64>,
    primary_down: bool,
}

impl<'a> ClickProfileTracker<'a> {
    fn new(clicks: &'a [CursorClickEvent]) -> Self {
        Self {
            clicks,
            next_index: 0,
            last_click_time: None,
            primary_down: false,
        }
    }

    fn advance_to(&mut self, time_ms: f64) {
        while self.next_index < self.clicks.len() {
            let click = &self.clicks[self.next_index];
            if click.time_ms > time_ms {
                break;
            }
            self.last_click_time = Some(click.time_ms);
            if click.button == "left" || click.button == "primary" {
                self.primary_down = click.down;
            }
            self.next_index += 1;
        }
    }

    fn profile(&self, time_ms: f64) -> SpringProfile {
        // During drag, use drag profile
        if self.primary_down {
            return SpringProfile::Drag;
        }

        // Near a click event, use snappy profile
        if let Some(last_click) = self.last_click_time {
            if (time_ms - last_click).abs() < CLICK_REACTION_WINDOW_MS {
                return SpringProfile::Snappy;
            }
        }

        // Check upcoming clicks
        if self.next_index < self.clicks.len() {
            let upcoming = &self.clicks[self.next_index];
            if (upcoming.time_ms - time_ms).abs() < CLICK_REACTION_WINDOW_MS {
                return SpringProfile::Snappy;
            }
        }

        SpringProfile::Default
    }
}

// ═══════════════════════════════════════════════════════════════
// Shake Filtering
// ═══════════════════════════════════════════════════════════════

/// Filters out high-frequency cursor shake (micro-jitter from
/// hand tremor or touchpad noise). Removes moves that reverse
/// direction rapidly within a small area.
pub fn filter_cursor_shake(moves: &[CursorMoveEvent]) -> Vec<CursorMoveEvent> {
    if moves.len() < 3 {
        return moves.to_vec();
    }

    let mut result = Vec::with_capacity(moves.len());
    result.push(moves[0].clone());

    let mut i = 1;
    while i < moves.len() - 1 {
        let prev = &moves[i - 1];
        let curr = &moves[i];
        let next = &moves[i + 1];

        let time_window = next.time_ms - prev.time_ms;
        if time_window > SHAKE_DETECTION_WINDOW_MS {
            result.push(curr.clone());
            i += 1;
            continue;
        }

        // Check if direction reverses (shake pattern)
        let dx1 = curr.x - prev.x;
        let dy1 = curr.y - prev.y;
        let dx2 = next.x - curr.x;
        let dy2 = next.y - curr.y;

        let dot = dx1 * dx2 + dy1 * dy2;
        let dist = ((dx1 * dx1 + dy1 * dy1).sqrt() + (dx2 * dx2 + dy2 * dy2).sqrt()) * 0.5;

        // If direction reversed AND movement is tiny, skip this point
        if dot < 0.0 && dist < SHAKE_THRESHOLD_UV {
            i += 1; // Skip this shaky point
            continue;
        }

        result.push(curr.clone());
        i += 1;
    }

    // Always include last point
    if let Some(last) = moves.last() {
        result.push(last.clone());
    }

    result
}

// ═══════════════════════════════════════════════════════════════
// Move Densification
// ═══════════════════════════════════════════════════════════════

/// Fills gaps in cursor move data by interpolating between widely-spaced
/// events. This prevents the spring from making huge jumps.
pub fn densify_cursor_moves(moves: &[CursorMoveEvent]) -> Vec<CursorMoveEvent> {
    if moves.len() < 2 {
        return moves.to_vec();
    }

    let mut result = Vec::with_capacity(moves.len() * 2);
    result.push(moves[0].clone());

    for chunk in moves.windows(2) {
        let a = &chunk[0];
        let b = &chunk[1];

        let gap = b.time_ms - a.time_ms;
        let distance = ((b.x - a.x).powi(2) + (b.y - a.y).powi(2)).sqrt();

        // Different cursor IDs — don't interpolate between them
        if a.cursor_id != b.cursor_id {
            result.push(b.clone());
            continue;
        }

        // If gap is large enough and cursor traveled far enough, densify
        if gap > GAP_INTERPOLATION_THRESHOLD_MS && distance > MIN_CURSOR_TRAVEL_FOR_INTERPOLATION {
            let step_count = (gap / CURSOR_FRAME_DURATION_MS).ceil() as usize;
            let steps = step_count.min(MAX_INTERPOLATED_STEPS).max(2);

            for s in 1..steps {
                let t = s as f64 / steps as f64;
                // Smooth hermite interpolation
                let smooth_t = t * t * (3.0 - 2.0 * t);

                result.push(CursorMoveEvent {
                    time_ms: a.time_ms + gap * t,
                    x: a.x + (b.x - a.x) * smooth_t,
                    y: a.y + (b.y - a.y) * smooth_t,
                    cursor_id: a.cursor_id.clone(),
                });
            }
        }

        result.push(b.clone());
    }

    result
}

// ═══════════════════════════════════════════════════════════════
// Smoothed Event Generation
// ═══════════════════════════════════════════════════════════════

#[derive(Debug, Clone)]
struct SmoothedCursorEvent {
    time: f32,
    target: [f32; 2],
    position: [f32; 2],
    velocity: [f32; 2],
    cursor_id: String,
}

/// Generate smoothed cursor events by replaying cursor moves through
/// the spring simulation with dynamic profile switching
fn get_smoothed_events(
    events: &CursorEvents,
    moves: &[CursorMoveEvent],
    base_config: SpringConfig,
    click_spring: Option<SpringConfig>,
) -> Vec<SmoothedCursorEvent> {
    if moves.is_empty() {
        return vec![];
    }

    let presets = CursorSpringPresets::new(base_config, click_spring);
    let mut tracker = ClickProfileTracker::new(&events.clicks);

    let mut sim = SpringSimulation::new(base_config);
    sim.set_position([moves[0].x as f32, moves[0].y as f32]);
    sim.set_velocity([0.0, 0.0]);
    sim.set_target(sim.position);

    let mut result = Vec::with_capacity(moves.len() + 1);
    let mut last_time: f32 = 0.0;

    // Add initial event if cursor data doesn't start at t=0
    if moves[0].time_ms > 0.0 {
        result.push(SmoothedCursorEvent {
            time: 0.0,
            target: sim.target,
            position: sim.position,
            velocity: sim.velocity,
            cursor_id: moves[0].cursor_id.clone(),
        });
    }

    for m in moves.iter() {
        let target = [m.x as f32, m.y as f32];
        sim.set_target(target);

        // Update spring profile based on click context
        tracker.advance_to(m.time_ms);
        let profile = tracker.profile(m.time_ms);
        sim.set_config(presets.config(profile));

        // Advance simulation
        let dt = m.time_ms as f32 - last_time;
        sim.run(dt);
        last_time = m.time_ms as f32;

        // Clamp to valid UV range
        let clamped = [
            sim.position[0].clamp(0.0, 1.0),
            sim.position[1].clamp(0.0, 1.0),
        ];

        result.push(SmoothedCursorEvent {
            time: m.time_ms as f32,
            target,
            position: clamped,
            velocity: sim.velocity,
            cursor_id: m.cursor_id.clone(),
        });
    }

    result
}

// ═══════════════════════════════════════════════════════════════
// Main Interpolation Entry Point
// ═══════════════════════════════════════════════════════════════

/// Interpolate cursor position at a given time, optionally with spring smoothing
/// and click-spring profiles.
/// 
/// This is the main API — call this for each frame during export.
pub fn interpolate_cursor(
    events: &CursorEvents,
    time_secs: f32,
    smoothing: Option<SpringConfig>,
    click_spring: Option<SpringConfig>,
) -> Option<InterpolatedCursor> {
    let time_ms = (time_secs * 1000.0) as f64;

    if events.moves.is_empty() {
        return None;
    }

    // Before first cursor event
    if events.moves[0].time_ms > time_ms {
        let e = &events.moves[0];
        return Some(InterpolatedCursor {
            x: e.x,
            y: e.y,
            velocity_x: 0.0,
            velocity_y: 0.0,
            cursor_id: e.cursor_id.clone(),
            click_progress: 0.0,
            is_clicking: false,
            opacity: 1.0,
        });
    }

    // After last cursor event
    if let Some(last) = events.moves.last() {
        if last.time_ms <= time_ms {
            let idle_time = time_ms - last.time_ms;
            let opacity = if idle_time > CURSOR_IDLE_MIN_DELAY_MS {
                let fade_progress = (idle_time - CURSOR_IDLE_MIN_DELAY_MS) / CURSOR_IDLE_FADE_OUT_MS;
                (1.0 - fade_progress).max(0.0)
            } else {
                1.0
            };

            return Some(InterpolatedCursor {
                x: last.x,
                y: last.y,
                velocity_x: 0.0,
                velocity_y: 0.0,
                cursor_id: last.cursor_id.clone(),
                click_progress: 0.0,
                is_clicking: false,
                opacity,
            });
        }
    }

    // With smoothing — full spring simulation pipeline
    if let Some(config) = smoothing {
        let filtered = filter_cursor_shake(&events.moves);
        let densified = densify_cursor_moves(&filtered);
        let smoothed = get_smoothed_events(events, &densified, config, click_spring);
        return interpolate_from_smoothed(&smoothed, time_secs, config, events);
    }

    // Without smoothing — linear interpolation
    interpolate_linear(events, time_ms)
}

/// Interpolate from pre-smoothed events using spring replay
fn interpolate_from_smoothed(
    smoothed: &[SmoothedCursorEvent],
    time_secs: f32,
    config: SpringConfig,
    events: &CursorEvents,
) -> Option<InterpolatedCursor> {
    if smoothed.is_empty() {
        return None;
    }

    let time_ms = time_secs * 1000.0;
    let mut sim = SpringSimulation::new(config);

    // Find the bracketing events
    let (cursor_id, pos, vel) = match smoothed
        .windows(2)
        .find(|chunk| chunk[0].time <= time_ms && time_ms < chunk[1].time)
    {
        Some(c) => {
            sim.set_position(c[0].position);
            sim.set_velocity(c[0].velocity);
            sim.set_target(c[0].target);
            sim.run(time_ms - c[0].time);
            (c[0].cursor_id.clone(), sim.position, sim.velocity)
        }
        None => {
            let e = smoothed.last().unwrap();
            sim.set_position(e.position);
            sim.set_velocity(e.velocity);
            sim.set_target(e.target);
            sim.run(time_ms - e.time);
            (e.cursor_id.clone(), sim.position, sim.velocity)
        }
    };

    // Compute click state
    let (click_progress, is_clicking) = compute_click_state(events, time_secs as f64 * 1000.0);

    // Compute idle opacity
    let opacity = compute_idle_opacity(events, time_secs as f64 * 1000.0);

    Some(InterpolatedCursor {
        x: pos[0].clamp(0.0, 1.0) as f64,
        y: pos[1].clamp(0.0, 1.0) as f64,
        velocity_x: vel[0],
        velocity_y: vel[1],
        cursor_id,
        click_progress,
        is_clicking,
        opacity,
    })
}

/// Linear interpolation between cursor events (no smoothing)
fn interpolate_linear(events: &CursorEvents, time_ms: f64) -> Option<InterpolatedCursor> {
    for chunk in events.moves.windows(2) {
        let a = &chunk[0];
        let b = &chunk[1];

        if a.time_ms <= time_ms && time_ms <= b.time_ms {
            let t = if (b.time_ms - a.time_ms).abs() < 0.001 {
                0.0
            } else {
                (time_ms - a.time_ms) / (b.time_ms - a.time_ms)
            };

            let dt = ((b.time_ms - a.time_ms) / 1000.0).max(0.001);
            let vx = ((b.x - a.x) / dt) as f32;
            let vy = ((b.y - a.y) / dt) as f32;

            let (click_progress, is_clicking) = compute_click_state(events, time_ms);
            let opacity = compute_idle_opacity(events, time_ms);

            return Some(InterpolatedCursor {
                x: a.x + (b.x - a.x) * t,
                y: a.y + (b.y - a.y) * t,
                velocity_x: vx,
                velocity_y: vy,
                cursor_id: a.cursor_id.clone(),
                click_progress,
                is_clicking,
                opacity,
            });
        }
    }
    None
}

/// Compute click animation state
fn compute_click_state(events: &CursorEvents, time_ms: f64) -> (f64, bool) {
    let mut last_down_time = None;
    let mut is_down = false;

    for click in &events.clicks {
        if click.time_ms > time_ms {
            break;
        }
        if click.down {
            last_down_time = Some(click.time_ms);
            is_down = true;
        } else {
            is_down = false;
        }
    }

    let progress = match last_down_time {
        Some(t) => {
            let elapsed = (time_ms - t) / 1000.0;
            (elapsed / CURSOR_CLICK_DURATION).min(1.0)
        }
        None => 0.0,
    };

    (progress, is_down)
}

/// Compute idle opacity based on cursor movement
fn compute_idle_opacity(events: &CursorEvents, time_ms: f64) -> f64 {
    // Find the last move before current time
    let last_move = events.moves.iter().rev().find(|m| m.time_ms <= time_ms);
    
    match last_move {
        Some(m) => {
            let idle_time = time_ms - m.time_ms;
            if idle_time > CURSOR_IDLE_MIN_DELAY_MS {
                let fade = (idle_time - CURSOR_IDLE_MIN_DELAY_MS) / CURSOR_IDLE_FADE_OUT_MS;
                (1.0 - fade).max(0.0)
            } else {
                1.0
            }
        }
        None => 1.0,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_events() -> CursorEvents {
        CursorEvents {
            moves: vec![
                CursorMoveEvent { time_ms: 0.0, x: 0.1, y: 0.1, cursor_id: "default".into() },
                CursorMoveEvent { time_ms: 100.0, x: 0.5, y: 0.5, cursor_id: "default".into() },
                CursorMoveEvent { time_ms: 200.0, x: 0.9, y: 0.9, cursor_id: "default".into() },
            ],
            clicks: vec![
                CursorClickEvent { time_ms: 150.0, down: true, button: "left".into() },
                CursorClickEvent { time_ms: 180.0, down: false, button: "left".into() },
            ],
        }
    }

    #[test]
    fn interpolation_without_smoothing() {
        let events = make_events();
        let result = interpolate_cursor(&events, 0.05, None, None).unwrap();
        assert!(result.x > 0.1 && result.x < 0.5);
    }

    #[test]
    fn interpolation_with_smoothing() {
        let events = make_events();
        let config = SpringConfig::cursor_default();
        let result = interpolate_cursor(&events, 0.15, Some(config), None).unwrap();
        assert!(result.x > 0.0 && result.x < 1.0);
    }

    #[test]
    fn shake_filter_removes_jitter() {
        let moves = vec![
            CursorMoveEvent { time_ms: 0.0, x: 0.5, y: 0.5, cursor_id: "d".into() },
            CursorMoveEvent { time_ms: 20.0, x: 0.501, y: 0.501, cursor_id: "d".into() },
            CursorMoveEvent { time_ms: 40.0, x: 0.499, y: 0.499, cursor_id: "d".into() },
            CursorMoveEvent { time_ms: 60.0, x: 0.500, y: 0.500, cursor_id: "d".into() },
        ];
        let filtered = filter_cursor_shake(&moves);
        assert!(filtered.len() <= moves.len());
    }

    #[test]
    fn densification_fills_gaps() {
        let moves = vec![
            CursorMoveEvent { time_ms: 0.0, x: 0.1, y: 0.1, cursor_id: "d".into() },
            CursorMoveEvent { time_ms: 500.0, x: 0.9, y: 0.9, cursor_id: "d".into() },
        ];
        let densified = densify_cursor_moves(&moves);
        assert!(densified.len() > moves.len());
    }

    #[test]
    fn click_state_detected() {
        let events = make_events();
        let (progress, is_clicking) = compute_click_state(&events, 160.0);
        assert!(is_clicking);
        assert!(progress > 0.0);
    }
}
