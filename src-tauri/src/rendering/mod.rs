/// Drift Rendering Pipeline — Module Root
/// Matches Cap's multi-crate rendering architecture in a single module tree.
///
/// Modules:
///   spring_physics       — Analytical spring solver (underdamped/overdamped/critical)
///   cursor_interpolation — Full cursor pipeline: shake filter → densify → spring → click
///   zoom_interpolation   — Segment-based zoom with spring easing + focus precomputation
///
/// WGSL shaders live in ../shaders/ and are loaded via include_str! by the compositor.

pub mod spring_physics;
pub mod cursor_interpolation;
pub mod zoom_interpolation;
