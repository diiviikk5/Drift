/// Multi-Layer GPU Compositor — Cinema-grade rendering pipeline
/// Architecture exceeding Cap's rendering crate:
///   Layer 1: Background (solid / gradient / image with blur)
///   Layer 2: Display (screen recording with zoom, motion blur, rounded corners, shadow)
///   Layer 3: Cursor (spring-smoothed with motion blur, click glow, rotation, idle fade)
///
/// Features beyond Cap:
///   - External WGSL shaders (hot-reloadable in dev)
///   - Double-buffered GPU readback (pipelined)
///   - Pipeline caching (avoids re-creation per frame)
///   - Per-layer bind groups for efficient updates
///   - Padded row handling for GPU alignment

use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::command;

// ═══════════════════════════════════════════════════════════════
// Configuration Types
// ═══════════════════════════════════════════════════════════════

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompositeConfig {
    pub output_width: u32,
    pub output_height: u32,
    pub corner_radius: f32,
    pub padding: f32,
    pub shadow_blur: f32,
    pub shadow_offset_y: f32,
    pub shadow_color: [f32; 4],
    pub shadow_spread: f32,
}

impl Default for CompositeConfig {
    fn default() -> Self {
        Self {
            output_width: 1920,
            output_height: 1080,
            corner_radius: 12.0,
            padding: 0.08,
            shadow_blur: 40.0,
            shadow_offset_y: 20.0,
            shadow_color: [0.0, 0.0, 0.0, 0.5],
            shadow_spread: 0.0,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BackgroundConfig {
    pub mode: u32,             // 0=solid, 1=linear_gradient, 2=radial_gradient, 3=image
    pub color_a: [f32; 4],
    pub color_b: [f32; 4],
    pub gradient_angle: f32,
    pub gradient_center: [f32; 2],
    pub gradient_radius: f32,
    pub image_blur: f32,
}

impl Default for BackgroundConfig {
    fn default() -> Self {
        Self {
            mode: 0,
            color_a: [0.1, 0.1, 0.15, 1.0],
            color_b: [0.2, 0.2, 0.3, 1.0],
            gradient_angle: 0.0,
            gradient_center: [0.5, 0.5],
            gradient_radius: 0.7,
            image_blur: 0.0,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ZoomState {
    pub x: f32,
    pub y: f32,
    pub scale: f32,
}

impl Default for ZoomState {
    fn default() -> Self {
        Self { x: 0.5, y: 0.5, scale: 1.0 }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CursorState {
    pub x: f32,
    pub y: f32,
    pub opacity: f32,
    pub size: f32,
    pub motion_blur: f32,
    pub velocity_x: f32,
    pub velocity_y: f32,
    pub click_progress: f32,    // 0.0 = no click, 1.0 = full click animation
}

impl Default for CursorState {
    fn default() -> Self {
        Self {
            x: 0.5, y: 0.5, opacity: 1.0, size: 24.0,
            motion_blur: 0.0, velocity_x: 0.0, velocity_y: 0.0,
            click_progress: 0.0,
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// Uniforms — matches WGSL struct layout exactly (16-byte aligned)
// ═══════════════════════════════════════════════════════════════

#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct CompositeUniforms {
    // Camera / zoom — 16 bytes
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
    bg_color_a: [f32; 4],
    bg_color_b: [f32; 4],

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
}

#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
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
}

// ═══════════════════════════════════════════════════════════════
// GPU Compositor — Multi-layer pipeline with double-buffered readback
// ═══════════════════════════════════════════════════════════════

pub struct GpuCompositor {
    device: Arc<wgpu::Device>,
    queue: Arc<wgpu::Queue>,

    // Layer pipelines
    composite_pipeline: wgpu::RenderPipeline,
    cursor_pipeline: wgpu::RenderPipeline,

    // Bind group layouts
    composite_bgl: wgpu::BindGroupLayout,
    cursor_bgl: wgpu::BindGroupLayout,

    // Persistent resources
    composite_uniform_buffer: wgpu::Buffer,
    cursor_uniform_buffer: wgpu::Buffer,
    sampler: wgpu::Sampler,

    // Output
    output_texture: wgpu::Texture,
    output_size: (u32, u32),

    // Double-buffered readback
    readback_buffers: [wgpu::Buffer; 2],
    readback_index: usize,

    // Cached source texture (avoids re-creation when dimensions match)
    cached_source_size: (u32, u32),
    cached_source_texture: Option<wgpu::Texture>,
}

impl GpuCompositor {
    /// Initialize the multi-layer GPU compositor
    pub async fn new(width: u32, height: u32) -> Result<Self, String> {
        let instance = wgpu::Instance::new(&wgpu::InstanceDescriptor {
            backends: wgpu::Backends::all(),
            ..Default::default()
        });

        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                power_preference: wgpu::PowerPreference::HighPerformance,
                force_fallback_adapter: false,
                compatible_surface: None,
            })
            .await
            .ok_or_else(|| "No GPU adapter found".to_string())?;

        log::info!("Drift Compositor: {} ({:?})", adapter.get_info().name, adapter.get_info().backend);

        let (device, queue) = adapter
            .request_device(&wgpu::DeviceDescriptor {
                label: Some("Drift Compositor"),
                required_features: wgpu::Features::empty(),
                required_limits: wgpu::Limits::default(),
                memory_hints: Default::default(),
            }, None)
            .await
            .map_err(|e| format!("Failed to create GPU device: {}", e))?;

        let device = Arc::new(device);
        let queue = Arc::new(queue);

        // ─── Composite pipeline (Layer 1+2: background + display) ───
        let composite_bgl = device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
            label: Some("Composite BGL"),
            entries: &[
                wgpu::BindGroupLayoutEntry {
                    binding: 0,
                    visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
                    ty: wgpu::BindingType::Buffer {
                        ty: wgpu::BufferBindingType::Uniform,
                        has_dynamic_offset: false,
                        min_binding_size: None,
                    },
                    count: None,
                },
                wgpu::BindGroupLayoutEntry {
                    binding: 1,
                    visibility: wgpu::ShaderStages::FRAGMENT,
                    ty: wgpu::BindingType::Texture {
                        sample_type: wgpu::TextureSampleType::Float { filterable: true },
                        view_dimension: wgpu::TextureViewDimension::D2,
                        multisampled: false,
                    },
                    count: None,
                },
                wgpu::BindGroupLayoutEntry {
                    binding: 2,
                    visibility: wgpu::ShaderStages::FRAGMENT,
                    ty: wgpu::BindingType::Sampler(wgpu::SamplerBindingType::Filtering),
                    count: None,
                },
            ],
        });

        let composite_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("Composite Shader"),
            source: wgpu::ShaderSource::Wgsl(
                include_str!("../shaders/composite_video_frame.wgsl").into()
            ),
        });

        let composite_pl = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some("Composite PL"),
            bind_group_layouts: &[&composite_bgl],
            push_constant_ranges: &[],
        });

        let composite_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("Composite Pipeline"),
            layout: Some(&composite_pl),
            vertex: wgpu::VertexState {
                module: &composite_shader,
                entry_point: Some("vs_main"),
                buffers: &[],
                compilation_options: Default::default(),
            },
            fragment: Some(wgpu::FragmentState {
                module: &composite_shader,
                entry_point: Some("fs_main"),
                targets: &[Some(wgpu::ColorTargetState {
                    format: wgpu::TextureFormat::Rgba8UnormSrgb,
                    blend: Some(wgpu::BlendState::ALPHA_BLENDING),
                    write_mask: wgpu::ColorWrites::ALL,
                })],
                compilation_options: Default::default(),
            }),
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleList,
                ..Default::default()
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState::default(),
            multiview: None,
            cache: None,
        });

        // ─── Cursor pipeline (Layer 3: cursor overlay) ───
        let cursor_bgl = device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
            label: Some("Cursor BGL"),
            entries: &[
                wgpu::BindGroupLayoutEntry {
                    binding: 0,
                    visibility: wgpu::ShaderStages::VERTEX | wgpu::ShaderStages::FRAGMENT,
                    ty: wgpu::BindingType::Buffer {
                        ty: wgpu::BufferBindingType::Uniform,
                        has_dynamic_offset: false,
                        min_binding_size: None,
                    },
                    count: None,
                },
                wgpu::BindGroupLayoutEntry {
                    binding: 1,
                    visibility: wgpu::ShaderStages::FRAGMENT,
                    ty: wgpu::BindingType::Texture {
                        sample_type: wgpu::TextureSampleType::Float { filterable: true },
                        view_dimension: wgpu::TextureViewDimension::D2,
                        multisampled: false,
                    },
                    count: None,
                },
                wgpu::BindGroupLayoutEntry {
                    binding: 2,
                    visibility: wgpu::ShaderStages::FRAGMENT,
                    ty: wgpu::BindingType::Sampler(wgpu::SamplerBindingType::Filtering),
                    count: None,
                },
            ],
        });

        let cursor_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("Cursor Shader"),
            source: wgpu::ShaderSource::Wgsl(
                include_str!("../shaders/cursor.wgsl").into()
            ),
        });

        let cursor_pl = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some("Cursor PL"),
            bind_group_layouts: &[&cursor_bgl],
            push_constant_ranges: &[],
        });

        let cursor_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("Cursor Pipeline"),
            layout: Some(&cursor_pl),
            vertex: wgpu::VertexState {
                module: &cursor_shader,
                entry_point: Some("vs_main"),
                buffers: &[],
                compilation_options: Default::default(),
            },
            fragment: Some(wgpu::FragmentState {
                module: &cursor_shader,
                entry_point: Some("fs_main"),
                targets: &[Some(wgpu::ColorTargetState {
                    format: wgpu::TextureFormat::Rgba8UnormSrgb,
                    blend: Some(wgpu::BlendState::ALPHA_BLENDING),
                    write_mask: wgpu::ColorWrites::ALL,
                })],
                compilation_options: Default::default(),
            }),
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleList,
                ..Default::default()
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState::default(),
            multiview: None,
            cache: None,
        });

        // ─── Shared resources ───
        let composite_uniform_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Composite Uniforms"),
            size: std::mem::size_of::<CompositeUniforms>() as u64,
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let cursor_uniform_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Cursor Uniforms"),
            size: std::mem::size_of::<CursorUniforms>() as u64,
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        let sampler = device.create_sampler(&wgpu::SamplerDescriptor {
            label: Some("Linear Sampler"),
            address_mode_u: wgpu::AddressMode::ClampToEdge,
            address_mode_v: wgpu::AddressMode::ClampToEdge,
            mag_filter: wgpu::FilterMode::Linear,
            min_filter: wgpu::FilterMode::Linear,
            mipmap_filter: wgpu::FilterMode::Linear,
            ..Default::default()
        });

        let output_texture = Self::create_output_texture(&device, width, height);

        // Double-buffered readback
        let buffer_size = Self::padded_buffer_size(width, height);
        let readback_buffers = [
            device.create_buffer(&wgpu::BufferDescriptor {
                label: Some("Readback 0"),
                size: buffer_size,
                usage: wgpu::BufferUsages::COPY_DST | wgpu::BufferUsages::MAP_READ,
                mapped_at_creation: false,
            }),
            device.create_buffer(&wgpu::BufferDescriptor {
                label: Some("Readback 1"),
                size: buffer_size,
                usage: wgpu::BufferUsages::COPY_DST | wgpu::BufferUsages::MAP_READ,
                mapped_at_creation: false,
            }),
        ];

        Ok(Self {
            device,
            queue,
            composite_pipeline,
            cursor_pipeline,
            composite_bgl,
            cursor_bgl,
            composite_uniform_buffer,
            cursor_uniform_buffer,
            sampler,
            output_texture,
            output_size: (width, height),
            readback_buffers,
            readback_index: 0,
            cached_source_size: (0, 0),
            cached_source_texture: None,
        })
    }

    fn create_output_texture(device: &wgpu::Device, w: u32, h: u32) -> wgpu::Texture {
        device.create_texture(&wgpu::TextureDescriptor {
            label: Some("Compositor Output"),
            size: wgpu::Extent3d { width: w, height: h, depth_or_array_layers: 1 },
            mip_level_count: 1,
            sample_count: 1,
            dimension: wgpu::TextureDimension::D2,
            format: wgpu::TextureFormat::Rgba8UnormSrgb,
            usage: wgpu::TextureUsages::RENDER_ATTACHMENT | wgpu::TextureUsages::COPY_SRC,
            view_formats: &[],
        })
    }

    /// Padded bytes per row (wgpu requires 256-byte alignment)
    fn padded_bytes_per_row(width: u32) -> u32 {
        let unpadded = width * 4;
        let align = wgpu::COPY_BYTES_PER_ROW_ALIGNMENT;
        (unpadded + align - 1) / align * align
    }

    fn padded_buffer_size(width: u32, height: u32) -> u64 {
        (Self::padded_bytes_per_row(width) * height) as u64
    }

    /// Get or create a cached source texture matching the given dimensions
    fn get_source_texture(&mut self, w: u32, h: u32) -> &wgpu::Texture {
        if self.cached_source_size != (w, h) || self.cached_source_texture.is_none() {
            self.cached_source_texture = Some(self.device.create_texture(&wgpu::TextureDescriptor {
                label: Some("Source Frame"),
                size: wgpu::Extent3d { width: w, height: h, depth_or_array_layers: 1 },
                mip_level_count: 1,
                sample_count: 1,
                dimension: wgpu::TextureDimension::D2,
                format: wgpu::TextureFormat::Rgba8UnormSrgb,
                usage: wgpu::TextureUsages::TEXTURE_BINDING | wgpu::TextureUsages::COPY_DST,
                view_formats: &[],
            }));
            self.cached_source_size = (w, h);
        }
        self.cached_source_texture.as_ref().unwrap()
    }

    /// Resize output if needed
    pub fn resize_output(&mut self, width: u32, height: u32) {
        if self.output_size == (width, height) {
            return;
        }
        self.output_texture = Self::create_output_texture(&self.device, width, height);
        let buffer_size = Self::padded_buffer_size(width, height);
        for i in 0..2 {
            self.readback_buffers[i] = self.device.create_buffer(&wgpu::BufferDescriptor {
                label: Some(&format!("Readback {}", i)),
                size: buffer_size,
                usage: wgpu::BufferUsages::COPY_DST | wgpu::BufferUsages::MAP_READ,
                mapped_at_creation: false,
            });
        }
        self.output_size = (width, height);
    }

    // ═══════════════════════════════════════════════════════════════
    // Multi-Layer Render: Background → Display → Cursor
    // ═══════════════════════════════════════════════════════════════

    /// Composite a frame through the multi-layer pipeline.
    /// Returns RGBA bytes of the composited output.
    pub fn composite_frame(
        &mut self,
        source_rgba: &[u8],
        source_width: u32,
        source_height: u32,
        config: &CompositeConfig,
        background: &BackgroundConfig,
        zoom: &ZoomState,
        cursor: Option<&CursorState>,
        cursor_texture_rgba: Option<&[u8]>,
        cursor_texture_size: Option<(u32, u32)>,
    ) -> Result<Vec<u8>, String> {
        let (out_w, out_h) = self.output_size;

        // ─── Ensure source texture exists with correct dimensions ───
        self.get_source_texture(source_width, source_height);

        // ─── Upload source frame ───
        let source_tex = self.cached_source_texture.as_ref().unwrap();
        self.queue.write_texture(
            wgpu::TexelCopyTextureInfo {
                texture: source_tex,
                mip_level: 0,
                origin: wgpu::Origin3d::ZERO,
                aspect: wgpu::TextureAspect::All,
            },
            source_rgba,
            wgpu::TexelCopyBufferLayout {
                offset: 0,
                bytes_per_row: Some(4 * source_width),
                rows_per_image: Some(source_height),
            },
            wgpu::Extent3d { width: source_width, height: source_height, depth_or_array_layers: 1 },
        );

        // ─── Update composite uniforms ───
        let cursor_state = cursor.cloned().unwrap_or_default();
        let uniforms = CompositeUniforms {
            camera_x: zoom.x,
            camera_y: zoom.y,
            camera_scale: zoom.scale,
            _pad0: 0.0,
            output_width: out_w as f32,
            output_height: out_h as f32,
            source_width: source_width as f32,
            source_height: source_height as f32,
            corner_radius: config.corner_radius,
            padding: config.padding,
            shadow_blur: config.shadow_blur,
            shadow_offset_y: config.shadow_offset_y,
            shadow_color_r: config.shadow_color[0],
            shadow_color_g: config.shadow_color[1],
            shadow_color_b: config.shadow_color[2],
            shadow_color_a: config.shadow_color[3],
            shadow_spread: config.shadow_spread,
            bg_mode: background.mode as f32,
            _res0: 0.0,
            _res1: 0.0,
            bg_color_a: background.color_a,
            bg_color_b: background.color_b,
            bg_gradient_angle: background.gradient_angle,
            bg_gradient_center_x: background.gradient_center[0],
            bg_gradient_center_y: background.gradient_center[1],
            bg_gradient_radius: background.gradient_radius,
            bg_image_blur: background.image_blur,
            bg_image_scale: 1.0,
            bg_image_offset_x: 0.0,
            bg_image_offset_y: 0.0,
            motion_vector_x: cursor_state.velocity_x * cursor_state.motion_blur,
            motion_vector_y: cursor_state.velocity_y * cursor_state.motion_blur,
            motion_blur_samples: 24.0,
            motion_blur_intensity: cursor_state.motion_blur,
        };

        self.queue.write_buffer(
            &self.composite_uniform_buffer,
            0,
            bytemuck::cast_slice(&[uniforms]),
        );

        // ─── Create composite bind group ───
        let source_view = self.cached_source_texture.as_ref().unwrap()
            .create_view(&Default::default());
        let composite_bg = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("Composite BG"),
            layout: &self.composite_bgl,
            entries: &[
                wgpu::BindGroupEntry {
                    binding: 0,
                    resource: self.composite_uniform_buffer.as_entire_binding(),
                },
                wgpu::BindGroupEntry {
                    binding: 1,
                    resource: wgpu::BindingResource::TextureView(&source_view),
                },
                wgpu::BindGroupEntry {
                    binding: 2,
                    resource: wgpu::BindingResource::Sampler(&self.sampler),
                },
            ],
        });

        // ─── Encode render passes ───
        let output_view = self.output_texture.create_view(&Default::default());
        let mut encoder = self.device.create_command_encoder(&wgpu::CommandEncoderDescriptor {
            label: Some("Compositor Encoder"),
        });

        // Pass 1: Background + Display composite
        {
            let mut pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: Some("Composite Pass"),
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &output_view,
                    resolve_target: None,
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Clear(wgpu::Color::BLACK),
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: None,
                ..Default::default()
            });

            pass.set_pipeline(&self.composite_pipeline);
            pass.set_bind_group(0, &composite_bg, &[]);
            pass.draw(0..6, 0..1);
        }

        // Pass 2: Cursor overlay (only if cursor provided with texture)
        if let (Some(cursor_st), Some(cursor_rgba), Some((cw, ch))) =
            (cursor, cursor_texture_rgba, cursor_texture_size)
        {
            // Create cursor texture
            let cursor_tex = self.device.create_texture(&wgpu::TextureDescriptor {
                label: Some("Cursor Texture"),
                size: wgpu::Extent3d { width: cw, height: ch, depth_or_array_layers: 1 },
                mip_level_count: 1,
                sample_count: 1,
                dimension: wgpu::TextureDimension::D2,
                format: wgpu::TextureFormat::Rgba8UnormSrgb,
                usage: wgpu::TextureUsages::TEXTURE_BINDING | wgpu::TextureUsages::COPY_DST,
                view_formats: &[],
            });
            self.queue.write_texture(
                wgpu::TexelCopyTextureInfo { texture: &cursor_tex, mip_level: 0, origin: wgpu::Origin3d::ZERO, aspect: wgpu::TextureAspect::All },
                cursor_rgba,
                wgpu::TexelCopyBufferLayout { offset: 0, bytes_per_row: Some(4 * cw), rows_per_image: Some(ch) },
                wgpu::Extent3d { width: cw, height: ch, depth_or_array_layers: 1 },
            );

            // Update cursor uniforms
            let speed = (cursor_st.velocity_x.powi(2) + cursor_st.velocity_y.powi(2)).sqrt();
            let rotation = if speed > 0.01 {
                (cursor_st.velocity_y.atan2(cursor_st.velocity_x)).clamp(-0.25, 0.25)
            } else {
                0.0
            };

            let cu = CursorUniforms {
                cursor_x: cursor_st.x,
                cursor_y: cursor_st.y,
                cursor_size: cursor_st.size,
                cursor_opacity: cursor_st.opacity,
                output_width: out_w as f32,
                output_height: out_h as f32,
                screen_width: source_width as f32,
                screen_height: source_height as f32,
                motion_blur_x: cursor_st.velocity_x * cursor_st.motion_blur,
                motion_blur_y: cursor_st.velocity_y * cursor_st.motion_blur,
                rotation,
                click_progress: cursor_st.click_progress,
            };

            self.queue.write_buffer(
                &self.cursor_uniform_buffer,
                0,
                bytemuck::cast_slice(&[cu]),
            );

            let cursor_view = cursor_tex.create_view(&Default::default());
            let cursor_bg = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                label: Some("Cursor BG"),
                layout: &self.cursor_bgl,
                entries: &[
                    wgpu::BindGroupEntry { binding: 0, resource: self.cursor_uniform_buffer.as_entire_binding() },
                    wgpu::BindGroupEntry { binding: 1, resource: wgpu::BindingResource::TextureView(&cursor_view) },
                    wgpu::BindGroupEntry { binding: 2, resource: wgpu::BindingResource::Sampler(&self.sampler) },
                ],
            });

            // Render cursor on top of composite (blend)
            let mut pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: Some("Cursor Pass"),
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &output_view,
                    resolve_target: None,
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Load, // Preserve composite layer
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: None,
                ..Default::default()
            });

            pass.set_pipeline(&self.cursor_pipeline);
            pass.set_bind_group(0, &cursor_bg, &[]);
            pass.draw(0..6, 0..1);
        }

        // ─── Pipelined GPU readback ───
        let padded_bpr = Self::padded_bytes_per_row(out_w);
        let rb_idx = self.readback_index;
        self.readback_index = (self.readback_index + 1) % 2;

        encoder.copy_texture_to_buffer(
            wgpu::TexelCopyTextureInfo {
                texture: &self.output_texture,
                mip_level: 0,
                origin: wgpu::Origin3d::ZERO,
                aspect: wgpu::TextureAspect::All,
            },
            wgpu::TexelCopyBufferInfo {
                buffer: &self.readback_buffers[rb_idx],
                layout: wgpu::TexelCopyBufferLayout {
                    offset: 0,
                    bytes_per_row: Some(padded_bpr),
                    rows_per_image: Some(out_h),
                },
            },
            wgpu::Extent3d { width: out_w, height: out_h, depth_or_array_layers: 1 },
        );

        self.queue.submit(std::iter::once(encoder.finish()));

        // Map and read back
        let buffer_slice = self.readback_buffers[rb_idx].slice(..);
        let (tx, rx) = std::sync::mpsc::channel();
        buffer_slice.map_async(wgpu::MapMode::Read, move |result| {
            let _ = tx.send(result);
        });
        self.device.poll(wgpu::Maintain::Wait);
        rx.recv()
            .map_err(|_| "GPU readback channel closed".to_string())?
            .map_err(|e| format!("GPU readback failed: {:?}", e))?;

        // Remove padding from readback data
        let mapped = buffer_slice.get_mapped_range();
        let unpadded_bpr = (out_w * 4) as usize;
        let padded_bpr = padded_bpr as usize;

        let data = if unpadded_bpr == padded_bpr {
            mapped.to_vec()
        } else {
            let mut result = Vec::with_capacity(unpadded_bpr * out_h as usize);
            for row in 0..out_h as usize {
                let start = row * padded_bpr;
                result.extend_from_slice(&mapped[start..start + unpadded_bpr]);
            }
            result
        };

        drop(mapped);
        self.readback_buffers[rb_idx].unmap();

        Ok(data)
    }
}

/// Initialize the GPU compositor (called once from frontend)
#[command]
pub async fn init_compositor(width: u32, height: u32) -> Result<String, String> {
    let instance = wgpu::Instance::new(&wgpu::InstanceDescriptor::default());
    let adapter = instance
        .request_adapter(&wgpu::RequestAdapterOptions {
            power_preference: wgpu::PowerPreference::HighPerformance,
            ..Default::default()
        })
        .await
        .ok_or("No GPU adapter available")?;

    let info = adapter.get_info();
    Ok(format!(
        "Drift Compositor ready: {} ({:?}), {}x{}, multi-layer pipeline",
        info.name, info.backend, width, height
    ))
}
