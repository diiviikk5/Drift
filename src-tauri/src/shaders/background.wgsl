// Drift — Background Layer Shader
// Supports solid color, gradient, and image backgrounds
// with optional blur overlay

struct BackgroundUniforms {
    // Mode: 0 = solid, 1 = linear gradient, 2 = radial gradient, 3 = image
    mode: f32,
    output_width: f32,
    output_height: f32,
    time_seconds: f32,

    // Color 1 (solid / gradient start)
    color1_r: f32,
    color1_g: f32,
    color1_b: f32,
    color1_a: f32,

    // Color 2 (gradient end)
    color2_r: f32,
    color2_g: f32,
    color2_b: f32,
    color2_a: f32,

    // Gradient params
    gradient_angle: f32,     // radians for linear
    gradient_center_x: f32,  // center for radial
    gradient_center_y: f32,
    gradient_radius: f32,

    // Wallpaper/image params
    image_scale: f32,
    image_offset_x: f32,
    image_offset_y: f32,
    blur_amount: f32,
};

@group(0) @binding(0) var<uniform> uniforms: BackgroundUniforms;
@group(0) @binding(1) var t_background: texture_2d<f32>;
@group(0) @binding(2) var s_background: sampler;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

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

// 13-tap Gaussian blur approximation
fn blur_sample(uv: vec2<f32>, direction: vec2<f32>, sigma: f32) -> vec4<f32> {
    var result = textureSample(t_background, s_background, uv) * 0.227027;
    let step1 = direction * 1.3846153846 * sigma;
    let step2 = direction * 3.2307692308 * sigma;
    
    result += textureSample(t_background, s_background, uv + step1) * 0.3162162162;
    result += textureSample(t_background, s_background, uv - step1) * 0.3162162162;
    result += textureSample(t_background, s_background, uv + step2) * 0.0702702703;
    result += textureSample(t_background, s_background, uv - step2) * 0.0702702703;
    
    return result;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let uv = input.uv;
    let mode = i32(uniforms.mode);
    
    let c1 = vec4(uniforms.color1_r, uniforms.color1_g, uniforms.color1_b, uniforms.color1_a);
    let c2 = vec4(uniforms.color2_r, uniforms.color2_g, uniforms.color2_b, uniforms.color2_a);
    
    // Solid color
    if mode == 0 {
        return c1;
    }
    
    // Linear gradient
    if mode == 1 {
        let angle = uniforms.gradient_angle;
        let dir = vec2(cos(angle), sin(angle));
        let centered = uv - vec2(0.5);
        let t = dot(centered, dir) + 0.5;
        return mix(c1, c2, clamp(t, 0.0, 1.0));
    }
    
    // Radial gradient
    if mode == 2 {
        let center = vec2(uniforms.gradient_center_x, uniforms.gradient_center_y);
        let dist = length(uv - center) / max(uniforms.gradient_radius, 0.001);
        return mix(c1, c2, clamp(dist, 0.0, 1.0));
    }
    
    // Image background
    if mode == 3 {
        let scaled_uv = (uv - vec2(0.5)) / uniforms.image_scale + vec2(0.5) 
                        + vec2(uniforms.image_offset_x, uniforms.image_offset_y);
        
        if uniforms.blur_amount > 0.01 {
            // Two-pass Gaussian blur approximation
            let sigma = uniforms.blur_amount / uniforms.output_width;
            let blur_h = blur_sample(scaled_uv, vec2(1.0, 0.0), sigma);
            let blur_v = blur_sample(scaled_uv, vec2(0.0, 1.0), sigma);
            return (blur_h + blur_v) * 0.5;
        }
        
        return textureSample(t_background, s_background, scaled_uv);
    }
    
    return c1;
}
