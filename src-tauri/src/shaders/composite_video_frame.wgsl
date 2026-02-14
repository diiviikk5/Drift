// Drift — Composite Video Frame Shader
// Multi-layer compositor: background + display with zoom, motion blur, shadow, rounded corners
// Struct layout matches Rust CompositeUniforms exactly (16-byte aligned)

struct CompositeUniforms {
    // Camera/zoom — 16 bytes
    camera_x: f32,
    camera_y: f32,
    camera_scale: f32,
    _pad0: f32,

    // Output dimensions — 16 bytes
    output_width: f32,
    output_height: f32,
    source_width: f32,
    source_height: f32,

    // Visual params — 16 bytes
    corner_radius: f32,
    padding: f32,
    shadow_blur: f32,
    shadow_offset_y: f32,

    // Shadow advanced — 16 bytes
    shadow_color_r: f32,
    shadow_color_g: f32,
    shadow_color_b: f32,
    shadow_color_a: f32,

    // Shadow spread + background mode — 16 bytes
    shadow_spread: f32,
    bg_mode: f32,
    _res0: f32,
    _res1: f32,

    // Background colors — 32 bytes
    bg_color_a: vec4<f32>,
    bg_color_b: vec4<f32>,

    // Background gradient — 16 bytes
    bg_gradient_angle: f32,
    bg_gradient_center_x: f32,
    bg_gradient_center_y: f32,
    bg_gradient_radius: f32,

    // Background image — 16 bytes
    bg_image_blur: f32,
    bg_image_scale: f32,
    bg_image_offset_x: f32,
    bg_image_offset_y: f32,

    // Motion blur — 16 bytes
    motion_vector_x: f32,
    motion_vector_y: f32,
    motion_blur_samples: f32,
    motion_blur_intensity: f32,
};

@group(0) @binding(0) var<uniform> uniforms: CompositeUniforms;
@group(0) @binding(1) var t_source: texture_2d<f32>;
@group(0) @binding(2) var s_source: sampler;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

// Full-screen quad — 2 triangles
@vertex
fn vs_main(@builtin(vertex_index) vi: u32) -> VertexOutput {
    var positions = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0),
        vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0),
    );
    var uvs = array<vec2<f32>, 6>(
        vec2(0.0, 1.0), vec2(1.0, 1.0), vec2(0.0, 0.0),
        vec2(0.0, 0.0), vec2(1.0, 1.0), vec2(1.0, 0.0),
    );
    var out: VertexOutput;
    out.position = vec4(positions[vi], 0.0, 1.0);
    out.uv = uvs[vi];
    return out;
}

// SDF rounded rectangle — high quality
fn sd_rounded_rect(p: vec2<f32>, half_size: vec2<f32>, radius: f32) -> f32 {
    let q = abs(p) - half_size + vec2(radius);
    return min(max(q.x, q.y), 0.0) + length(max(q, vec2(0.0))) - radius;
}

// Advanced shadow with gaussian-approximation blur
fn compute_shadow(
    uv: vec2<f32>,
    video_rect: vec4<f32>,  // xy = top-left, zw = size
    corner_r: f32,
) -> f32 {
    // Shift UV by shadow offset
    let shadow_offset = vec2(0.0, uniforms.shadow_offset_y / uniforms.output_height);
    let shadow_uv = uv - shadow_offset;
    
    // Local coords relative to video center
    let center = video_rect.xy + video_rect.zw * 0.5;
    let local = shadow_uv - center;
    let half = video_rect.zw * 0.5;
    
    let dist = sd_rounded_rect(local, half, corner_r);
    
    // Gaussian-like shadow falloff
    let sigma = uniforms.shadow_blur / uniforms.output_width;
    let alpha = 1.0 - smoothstep(-sigma * 0.5, sigma * 2.0, dist);
    
    return alpha * uniforms.shadow_color_a;
}

// Directional motion blur — multi-sample
fn sample_with_motion_blur(
    base_uv: vec2<f32>,
    blur_vector: vec2<f32>,
) -> vec4<f32> {
    let dir_strength = length(blur_vector);
    
    // If no motion blur needed, single sample
    if dir_strength < 0.001 {
        return textureSample(t_source, s_source, base_uv);
    }
    
    // Multi-sample motion blur (24 samples)
    let SAMPLES: i32 = 24;
    var color = vec4(0.0);
    var total_weight = 0.0;
    
    for (var i: i32 = 0; i < SAMPLES; i++) {
        let t = (f32(i) / f32(SAMPLES - 1)) - 0.5; // -0.5 to 0.5
        
        // Directional offset
        let dir_offset = blur_vector * t;
        let sample_uv = clamp(base_uv + dir_offset, vec2(0.0), vec2(1.0));
        
        // Gaussian weight — center samples weighted more
        let weight = exp(-8.0 * t * t);
        color += textureSample(t_source, s_source, sample_uv) * weight;
        total_weight += weight;
    }
    
    return color / total_weight;
}

// Anti-aliased downscaling for zoom-out
fn sample_with_lod(uv: vec2<f32>, zoom: f32) -> vec4<f32> {
    if zoom >= 1.0 {
        return textureSample(t_source, s_source, uv);
    }
    
    // When zoomed out, average neighbors to prevent aliasing
    let texel_size = vec2(1.0 / uniforms.source_width, 1.0 / uniforms.source_height);
    let spread = (1.0 / zoom - 1.0) * 0.5;
    
    var color = textureSample(t_source, s_source, uv) * 4.0;
    color += textureSample(t_source, s_source, uv + texel_size * vec2(-spread, 0.0));
    color += textureSample(t_source, s_source, uv + texel_size * vec2(spread, 0.0));
    color += textureSample(t_source, s_source, uv + texel_size * vec2(0.0, -spread));
    color += textureSample(t_source, s_source, uv + texel_size * vec2(0.0, spread));
    
    return color / 8.0;
}

// Compute background color based on mode
fn compute_background(uv: vec2<f32>) -> vec4<f32> {
    let mode = i32(uniforms.bg_mode);
    
    if mode == 1 {
        // Linear gradient
        let angle = uniforms.bg_gradient_angle;
        let dir = vec2(cos(angle), sin(angle));
        let t = dot(uv - vec2(0.5), dir) + 0.5;
        let tc = clamp(t, 0.0, 1.0);
        return mix(uniforms.bg_color_a, uniforms.bg_color_b, tc);
    } else if mode == 2 {
        // Radial gradient
        let center = vec2(uniforms.bg_gradient_center_x, uniforms.bg_gradient_center_y);
        let dist = length(uv - center) / uniforms.bg_gradient_radius;
        let t = clamp(dist, 0.0, 1.0);
        return mix(uniforms.bg_color_a, uniforms.bg_color_b, t);
    }
    
    // Default: solid color
    return uniforms.bg_color_a;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let uv = input.uv;
    let bg = compute_background(uv);
    
    // Calculate padded video rect
    let padding = uniforms.padding;
    let src_aspect = uniforms.source_width / uniforms.source_height;
    let out_aspect = uniforms.output_width / uniforms.output_height;
    
    let avail_w = 1.0 - padding * 2.0;
    let avail_h = 1.0 - padding * 2.0;
    
    var vid_w = avail_w;
    var vid_h = vid_w / src_aspect * out_aspect;
    if vid_h > avail_h {
        vid_h = avail_h;
        vid_w = vid_h * src_aspect / out_aspect;
    }
    
    let vid_x = 0.5 - vid_w * 0.5;
    let vid_y = 0.5 - vid_h * 0.5;
    let video_rect = vec4(vid_x, vid_y, vid_w, vid_h);
    
    // Corner radius in UV space
    let cr = uniforms.corner_radius / uniforms.output_width;
    
    // Shadow (computed before video for proper layering)
    let shadow_alpha = compute_shadow(uv, video_rect, cr);
    let shadow_color = vec4(uniforms.shadow_color_r, uniforms.shadow_color_g, uniforms.shadow_color_b, 1.0);
    var result = mix(bg, shadow_color, shadow_alpha);
    
    // Video region SDF
    let local = uv - video_rect.xy - video_rect.zw * 0.5;
    let half = video_rect.zw * 0.5;
    let dist = sd_rounded_rect(local, half, cr);
    
    if dist > 1.0 / uniforms.output_width {
        return result;
    }
    
    // Map to video UV
    var video_uv = (uv - video_rect.xy) / video_rect.zw;
    
    // Apply zoom: transform around camera center
    let zoom = uniforms.camera_scale;
    let cam = vec2(uniforms.camera_x, uniforms.camera_y);
    video_uv = (video_uv - cam) / zoom + cam;
    
    // Clamp to valid range 
    video_uv = clamp(video_uv, vec2(0.0), vec2(1.0));
    
    // Sample with motion blur or plain
    var color: vec4<f32>;
    let blur_vec = vec2(uniforms.motion_vector_x, uniforms.motion_vector_y) * uniforms.motion_blur_intensity;
    
    if uniforms.motion_blur_intensity > 0.001 {
        color = sample_with_motion_blur(video_uv, blur_vec);
    } else {
        color = sample_with_lod(video_uv, zoom);
    }
    
    // Anti-aliased rounded corners
    let aa = 1.0 - smoothstep(-1.5 / uniforms.output_width, 0.5 / uniforms.output_width, dist);
    
    return mix(result, color, aa);
}
