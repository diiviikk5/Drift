/// Spring-Mass-Damper Simulation — analytical solver
/// Matches Cap's spring_mass_damper.rs with all three damping regimes:
/// underdamped (oscillatory), critically damped, overdamped
/// Used for cursor smoothing, zoom transitions, and screen movement

use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct SpringConfig {
    pub tension: f32,
    pub mass: f32,
    pub friction: f32,
}

impl Default for SpringConfig {
    fn default() -> Self {
        Self {
            tension: 100.0,
            mass: 1.0,
            friction: 20.0,
        }
    }
}

/// Configurable presets for different use cases
impl SpringConfig {
    /// Smooth cursor following (default)
    pub fn cursor_default() -> Self {
        Self { tension: 100.0, mass: 1.0, friction: 20.0 }
    }

    /// Snappy response near click events  
    pub fn cursor_snappy() -> Self {
        Self { tension: 700.0, mass: 1.0, friction: 30.0 }
    }

    /// Slower response during drag operations
    pub fn cursor_drag() -> Self {
        Self { tension: 80.0, mass: 1.2, friction: 26.0 }
    }

    /// Screen-level zoom movement spring
    pub fn screen_movement() -> Self {
        Self { tension: 200.0, mass: 2.25, friction: 40.0 }
    }

    /// Scale this config by multipliers
    pub fn scaled(&self, tension_scale: f32, mass_scale: f32, friction_scale: f32) -> Self {
        Self {
            tension: self.tension * tension_scale,
            mass: (self.mass * mass_scale).max(0.001),
            friction: self.friction * friction_scale,
        }
    }
}

/// 2D Spring-Mass-Damper Simulation
/// Uses analytical solution (not iterative Euler!) for perfect stability
pub struct SpringSimulation {
    config: SpringConfig,
    pub position: [f32; 2],
    pub velocity: [f32; 2],
    pub target: [f32; 2],
}

const REST_DISPLACEMENT_THRESHOLD: f32 = 0.00001;
const REST_VELOCITY_THRESHOLD: f32 = 0.0001;
const CRITICAL_EPSILON: f32 = 0.01;

impl SpringSimulation {
    pub fn new(config: SpringConfig) -> Self {
        Self {
            config,
            position: [0.0; 2],
            velocity: [0.0; 2],
            target: [0.0; 2],
        }
    }

    pub fn set_config(&mut self, config: SpringConfig) {
        self.config = config;
    }

    pub fn set_position(&mut self, pos: [f32; 2]) {
        self.position = pos;
    }

    pub fn set_velocity(&mut self, vel: [f32; 2]) {
        self.velocity = vel;
    }

    pub fn set_target(&mut self, target: [f32; 2]) {
        self.target = target;
    }

    /// Advance the simulation by dt_ms milliseconds
    /// Returns the new position
    pub fn run(&mut self, dt_ms: f32) -> [f32; 2] {
        if dt_ms <= 0.0 {
            return self.position;
        }

        let t = dt_ms / 1000.0;
        let mass = self.config.mass.max(0.001);
        let stiffness = self.config.tension;
        let damping = self.config.friction;

        let omega0 = (stiffness / mass).sqrt();
        let zeta = damping / (2.0 * (stiffness * mass).sqrt());

        // Solve each axis independently
        let disp_x = self.position[0] - self.target[0];
        let disp_y = self.position[1] - self.target[1];

        let (new_disp_x, new_vel_x) = solve_spring_1d(disp_x, self.velocity[0], t, omega0, zeta);
        let (new_disp_y, new_vel_y) = solve_spring_1d(disp_y, self.velocity[1], t, omega0, zeta);

        self.position = [
            self.target[0] + new_disp_x,
            self.target[1] + new_disp_y,
        ];
        self.velocity = [new_vel_x, new_vel_y];

        // Rest detection
        let disp_mag = (new_disp_x * new_disp_x + new_disp_y * new_disp_y).sqrt();
        let vel_mag = (new_vel_x * new_vel_x + new_vel_y * new_vel_y).sqrt();

        if disp_mag < REST_DISPLACEMENT_THRESHOLD && vel_mag < REST_VELOCITY_THRESHOLD {
            self.position = self.target;
            self.velocity = [0.0; 2];
        }

        self.position
    }

    /// Check if the spring is at rest
    pub fn is_at_rest(&self) -> bool {
        let dx = self.position[0] - self.target[0];
        let dy = self.position[1] - self.target[1];
        let disp = (dx * dx + dy * dy).sqrt();
        let vel = (self.velocity[0] * self.velocity[0] + self.velocity[1] * self.velocity[1]).sqrt();
        disp < REST_DISPLACEMENT_THRESHOLD && vel < REST_VELOCITY_THRESHOLD
    }
}

/// Analytical 1D spring solver
/// Handles all three damping regimes exactly
fn solve_spring_1d(
    displacement: f32,
    velocity: f32,
    t: f32,
    omega0: f32,
    zeta: f32,
) -> (f32, f32) {
    if zeta < 1.0 - CRITICAL_EPSILON {
        // Underdamped — oscillatory decay
        let omega_d = omega0 * (1.0 - zeta * zeta).sqrt();
        let decay = (-zeta * omega0 * t).exp();
        let cos_term = (omega_d * t).cos();
        let sin_term = (omega_d * t).sin();

        let a = displacement;
        let b = (velocity + displacement * zeta * omega0) / omega_d.max(1e-4);

        let new_disp = decay * (a * cos_term + b * sin_term);
        let new_vel = decay
            * ((b * omega_d - a * zeta * omega0) * cos_term
                - (a * omega_d + b * zeta * omega0) * sin_term);

        (new_disp, new_vel)
    } else if zeta > 1.0 + CRITICAL_EPSILON {
        // Overdamped — exponential decay, no oscillation
        let sqrt_term = (zeta * zeta - 1.0).sqrt();
        let s1 = -omega0 * (zeta - sqrt_term);
        let s2 = -omega0 * (zeta + sqrt_term);
        let denom = s1 - s2;

        if denom.abs() < 1e-10 {
            // Near-critical fallback
            let s_avg = 0.5 * (s1 + s2);
            let decay = (s_avg * t).exp();
            let new_disp = decay * (displacement + (velocity - displacement * s_avg) * t);
            let new_vel = decay
                * ((velocity - displacement * s_avg)
                    + s_avg * (displacement + (velocity - displacement * s_avg) * t));
            (new_disp, new_vel)
        } else {
            let c1 = (velocity - displacement * s2) / denom;
            let c2 = displacement - c1;

            let e1 = (s1 * t).exp();
            let e2 = (s2 * t).exp();

            let new_disp = c1 * e1 + c2 * e2;
            let new_vel = c1 * s1 * e1 + c2 * s2 * e2;

            (new_disp, new_vel)
        }
    } else {
        // Critically damped — fastest non-oscillatory response
        let decay = (-omega0 * t).exp();
        let a = displacement;
        let b = velocity + displacement * omega0;

        let new_disp = decay * (a + b * t);
        let new_vel = decay * (b - omega0 * (a + b * t));

        (new_disp, new_vel)
    }
}

/// Spring-based easing function for zoom transitions
/// Used for zoom-in easing (slightly bouncy)
pub fn spring_ease(t: f32, stiffness: f64, damping: f64, mass: f64) -> f32 {
    if t <= 0.0 { return 0.0; }
    if t >= 1.0 { return 1.0; }

    let omega0 = (stiffness / mass).sqrt() as f32;
    let zeta = (damping / (2.0 * (stiffness * mass).sqrt())) as f32;

    if zeta < 1.0 {
        let omega_d = omega0 * (1.0 - zeta * zeta).sqrt();
        let decay = (-zeta * omega0 * t).exp();
        1.0 - decay * ((omega_d * t).cos() + (zeta * omega0 / omega_d) * (omega_d * t).sin())
    } else {
        let decay = (-omega0 * t).exp();
        1.0 - decay * (1.0 + omega0 * t)
    }
}

/// Spring-based easing for zoom-out (slower, more damped)
pub fn spring_ease_out(t: f32, stiffness: f64, damping: f64, mass: f64) -> f32 {
    if t <= 0.0 { return 0.0; }
    if t >= 1.0 { return 1.0; }

    let omega0 = (stiffness / mass).sqrt() as f32 * 0.9;
    let zeta = (damping / (2.0 * (stiffness * mass).sqrt())) as f32 * 1.15;

    if zeta < 1.0 {
        let omega_d = omega0 * (1.0 - zeta * zeta).sqrt();
        let decay = (-zeta * omega0 * t).exp();
        1.0 - decay * ((omega_d * t).cos() + (zeta * omega0 / omega_d) * (omega_d * t).sin())
    } else {
        let decay = (-omega0 * t).exp();
        1.0 - decay * (1.0 + omega0 * t)
    }
}

/// Instant (non-spring) easing
pub fn instant_ease(t: f32) -> f32 {
    if t <= 0.0 { return 0.0; }
    if t >= 1.0 { return 1.0; }
    // Smooth cubic hermite
    let t2 = t * t;
    t2 * (3.0 - 2.0 * t)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn spring_reaches_target() {
        let mut sim = SpringSimulation::new(SpringConfig::cursor_default());
        sim.set_position([0.0, 0.0]);
        sim.set_target([1.0, 1.0]);

        // Run for 2 seconds
        for _ in 0..120 {
            sim.run(16.67); // ~60fps
        }

        assert!((sim.position[0] - 1.0).abs() < 0.01);
        assert!((sim.position[1] - 1.0).abs() < 0.01);
    }

    #[test]
    fn spring_at_rest_when_target_equals_position() {
        let mut sim = SpringSimulation::new(SpringConfig::cursor_default());
        sim.set_position([0.5, 0.5]);
        sim.set_target([0.5, 0.5]);
        assert!(sim.is_at_rest());
    }

    #[test]
    fn spring_ease_reaches_one() {
        let result = spring_ease(1.0, 200.0, 40.0, 2.25);
        assert!((result - 1.0).abs() < 0.001);
    }

    #[test]
    fn overdamped_converges() {
        let mut sim = SpringSimulation::new(SpringConfig {
            tension: 50.0,
            mass: 1.0,
            friction: 30.0, // heavily overdamped
        });
        sim.set_position([0.0, 0.0]);
        sim.set_target([1.0, 0.0]);

        for _ in 0..200 {
            sim.run(16.67);
        }

        assert!((sim.position[0] - 1.0).abs() < 0.01);
    }
}
