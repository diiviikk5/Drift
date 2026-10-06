//! Scroll detection from the captured frames.
//!
//! Precision touchpads scroll through DirectManipulation, which never reaches
//! a low-level mouse hook, so wheel events alone miss most scrolling on
//! laptops. Instead, a narrow strip down the middle of the picture is reduced
//! to one brightness value per row; when consecutive profiles match best at a
//! vertical offset, the page scrolled.

use std::time::Instant;

/// Rows are sampled every `ROW_STEP` pixels, columns every `COL_STEP`.
const ROW_STEP: usize = 2;
const COL_STEP: usize = 4;

/// Brightness per sampled row of a strip of an RGBA/BGRA buffer.
pub fn row_profile(buf: &[u8], row_pitch: usize, width: usize, height: usize) -> Vec<f32> {
    let mut out = Vec::with_capacity(height / ROW_STEP + 1);
    let mut y = 0;
    while y < height {
        let row = &buf[y * row_pitch..];
        let mut sum = 0u32;
        let mut n = 0u32;
        let mut x = 0;
        while x < width {
            let p = &row[x * 4..x * 4 + 3];
            sum += p[0] as u32 + 2 * p[1] as u32 + p[2] as u32;
            n += 4;
            x += COL_STEP;
        }
        out.push(if n > 0 { sum as f32 / n as f32 } else { 0.0 });
        y += ROW_STEP;
    }
    out
}

fn mean_abs_diff(a: &[f32], b: &[f32], shift: isize) -> f32 {
    let n = a.len() as isize;
    let (start, end) = if shift >= 0 { (0, n - shift) } else { (-shift, n) };
    if end - start < 8 {
        return f32::INFINITY;
    }
    let mut sum = 0.0;
    for i in start..end {
        sum += (a[(i + shift) as usize] - b[i as usize]).abs();
    }
    sum / (end - start) as f32
}

/// Vertical content shift in pixels between two profiles (positive: content
/// moved up, i.e. scrolled down), or None when the change isn't a scroll.
pub fn detect_shift(prev: &[f32], cur: &[f32]) -> Option<f32> {
    if prev.len() != cur.len() || prev.len() < 32 {
        return None;
    }
    // A flat strip (empty background) can't show a scroll.
    let mean = cur.iter().sum::<f32>() / cur.len() as f32;
    let var = cur.iter().map(|v| (v - mean) * (v - mean)).sum::<f32>() / cur.len() as f32;
    if var < 9.0 {
        return None;
    }
    let still = mean_abs_diff(prev, cur, 0);
    if still < 1.0 {
        return None; // nothing moved
    }
    let max_shift = (cur.len() / 3) as isize;
    let mut best = (0isize, still);
    for s in -max_shift..=max_shift {
        if s == 0 {
            continue;
        }
        let e = mean_abs_diff(prev, cur, s);
        if e < best.1 {
            best = (s, e);
        }
    }
    // The shifted match must explain the change far better than "no motion".
    if best.0 != 0 && best.0.abs() >= 2 && best.1 < still * 0.3 && best.1 < 6.0 {
        Some((best.0 * ROW_STEP as isize) as f32)
    } else {
        None
    }
}

/// Runs inside the capture handler; samples at most every `INTERVAL_MS`.
pub struct ScrollDetector {
    prev: Option<Vec<f32>>,
    last_at: Option<Instant>,
    pub track: Vec<(Instant, f32)>,
}

const INTERVAL_MS: u128 = 50;

impl ScrollDetector {
    pub fn new() -> Self {
        Self { prev: None, last_at: None, track: Vec::new() }
    }

    pub fn due(&self) -> bool {
        self.last_at.map(|t| t.elapsed().as_millis() >= INTERVAL_MS).unwrap_or(true)
    }

    /// Feed the strip of the newest frame.
    pub fn push(&mut self, buf: &[u8], row_pitch: usize, width: usize, height: usize) {
        let now = Instant::now();
        self.last_at = Some(now);
        let profile = row_profile(buf, row_pitch, width, height);
        if let Some(prev) = &self.prev {
            if let Some(shift) = detect_shift(prev, &profile) {
                self.track.push((now, shift));
            }
        }
        self.prev = Some(profile);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn page(offset: usize, height: usize) -> Vec<f32> {
        (0..height / ROW_STEP)
            .map(|i| {
                let y = i * ROW_STEP + offset;
                ((y as f32 * 0.37).sin() * 60.0 + (y as f32 * 0.051).cos() * 40.0 + 128.0).round()
            })
            .collect()
    }

    #[test]
    fn finds_a_scroll() {
        let a = page(0, 1080);
        let b = page(40, 1080);
        let shift = detect_shift(&a, &b).expect("scroll detected");
        assert!((shift - 40.0).abs() <= 2.0, "shift {shift}");
    }

    #[test]
    fn ignores_still_and_flat_frames() {
        let a = page(0, 1080);
        assert!(detect_shift(&a, &a).is_none());
        let flat = vec![200.0; 540];
        assert!(detect_shift(&flat, &flat).is_none());
    }
}
