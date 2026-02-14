// Drift — Cursor Rendering Shader
// Multi-layer cursor with motion blur, rotation, click glow, idle fade
// Struct layout matches Rust CursorUniforms exactly

struct CursorUniforms {
    cursor_x: f32,
    cursor_y: f32,
    cursor_size: f32,
    cursor_opacity: f32,

    output_width: f32,
    output_height: f32,
    screen_width: f32,
    screen_height: f32,

    motion_blur_x: f32,
    motion_blur_y: f32,
    rotation: f32,
    click_progress: f32,
};

@group(0) @binding(0) var<uniform> uniforms: CursorUniforms;
@group(0) @binding(1) var t_cursor: texture_2d<f32>;
@group(0) @binding(2) var s_cursor: sampler;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

const MAX_ROTATION_RADIANS: f32 = 0.25;
const ROTATION_VELOCITY_SCALE: f32 = 0.003;
const MOTION_BLUR_SAMPLES: i32 = 24;

@vertex
fn vs_main(@builtin(vertex_index) vi: u32) -> VertexOutput {
    // Cursor size in clip space
    let click_scale = 1.0 - uniforms.click_progress * 0.3; // shrink on click
    let cursor_size_clip = vec2(
        uniforms.cursor_size / uniforms.output_width * 2.0,
        uniforms.cursor_size / uniforms.output_height * 2.0,
    ) * click_scale;
    
    // Cursor center in clip space (position is in normalized 0-1 screen coords)
    let pos_clip = vec2(
        uniforms.cursor_x / uniforms.output_width * 2.0 - 1.0,
        -(uniforms.cursor_y / uniforms.output_height * 2.0 - 1.0),
    );
    
    // Rotation from velocity
    let cos_r = cos(uniforms.rotation);
    let sin_r = sin(uniforms.rotation);
    
    // Quad corners
    var offsets = array<vec2<f32>, 6>(
        vec2(-0.5, -0.5), vec2(0.5, -0.5), vec2(-0.5, 0.5),
        vec2(-0.5, 0.5), vec2(0.5, -0.5), vec2(0.5, 0.5),
    );
    var tex_coords = array<vec2<f32>, 6>(
        vec2(0.0, 0.0), vec2(1.0, 0.0), vec2(0.0, 1.0),
        vec2(0.0, 1.0), vec2(1.0, 0.0), vec2(1.0, 1.0),
    );
    
    let off = offsets[vi];
    
    // Apply rotation
    let rotated = vec2(
        off.x * cos_r - off.y * sin_r,
        off.x * sin_r + off.y * cos_r,
    );
    
    var out: VertexOutput;
    out.position = vec4(
        pos_clip.x + rotated.x * cursor_size_clip.x,
        pos_clip.y + rotated.y * cursor_size_clip.y,
        0.0, 1.0,
    );
    out.uv = tex_coords[vi];
    return out;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let uv = input.uv;
    
    // Motion blur direction
    let blur_dir = vec2(uniforms.motion_blur_x, uniforms.motion_blur_y);
    let blur_strength = length(blur_dir);
    
    var color: vec4<f32>;
    
    if blur_strength > 0.01 {
        let norm_dir = blur_dir / max(blur_strength, 0.001);
        let velocity_cap = min(blur_strength, 320.0) / 320.0;
        
        var result = vec4(0.0);
        var total_weight = 0.0;
        
        for (var i: i32 = 0; i < MOTION_BLUR_SAMPLES; i++) {
            let t = (f32(i) / f32(MOTION_BLUR_SAMPLES - 1)) - 0.5;
            let offset = norm_dir * t * velocity_cap * 0.5;
            let sample_uv = clamp(uv + offset, vec2(0.0), vec2(1.0));
            
            // Gaussian kernel
            let weight = exp(-12.0 * t * t);
            result += textureSample(t_cursor, s_cursor, sample_uv) * weight;
            total_weight += weight;
        }
        
        color = result / total_weight;
    } else {
        color = textureSample(t_cursor, s_cursor, uv);
    }
    
    // Click glow effect
    if uniforms.click_progress > 0.01 {
        let center_dist = length(uv - vec2(0.5));
        let glow = (1.0 - smoothstep(0.0, 0.5, center_dist)) * uniforms.click_progress;
        color = mix(color, vec4(1.0, 1.0, 1.0, color.a), glow * 0.3);
    }
    
    // Apply opacity (idle fade)
    color.a *= uniforms.cursor_opacity;
    
    return color;
}
