use serde::{Deserialize, Serialize};
use std::fs::{File, OpenOptions};
use std::io::{BufReader, BufWriter, Read, Seek, SeekFrom, Write};
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::mpsc::{sync_channel, Receiver, SyncSender};
use std::sync::Arc;
use parking_lot::Mutex;
use tauri::{command, AppHandle, Emitter, Manager};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaptureConfig {
    pub monitor_index: usize,
    pub fps: u32,
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NativeSessionInfo {
    pub session_id: String,
    pub directory: String,
    pub data_path: String,
    pub index_path: String,
    pub width: u32,
    pub height: u32,
    pub fps: u32,
    pub total_frames: u64,
    pub duration_ms: f64,
}

#[derive(Debug, Clone, Serialize)]
pub struct RecordingStats {
    pub frames_captured: u64,
    pub frames_dropped: u64,
    pub avg_fps: f64,
    pub duration_ms: f64,
    pub session_dir: String,
}

#[derive(Clone)]
pub struct RawFrameItem {
    pub frame_number: u64,
    pub timestamp_ms: f64,
    pub width: u32,
    pub height: u32,
    pub data: Vec<u8>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FrameIndexEntry {
    pub frame_number: u64,
    pub timestamp_ms: f64,
    pub width: u32,
    pub height: u32,
    pub file_offset: u64,
    pub byte_length: u64,
}

pub struct NativeRecorderState {
    pub is_recording: Arc<AtomicBool>,
    pub frame_count: Arc<AtomicU64>,
    pub frames_dropped: Arc<AtomicU64>,
    pub start_time: Arc<Mutex<Option<std::time::Instant>>>,
    pub active_session: Arc<Mutex<Option<NativeSessionInfo>>>,
    pub current_dimensions: Arc<Mutex<(u32, u32)>>,
}

impl Default for NativeRecorderState {
    fn default() -> Self {
        Self {
            is_recording: Arc::new(AtomicBool::new(false)),
            frame_count: Arc::new(AtomicU64::new(0)),
            frames_dropped: Arc::new(AtomicU64::new(0)),
            start_time: Arc::new(Mutex::new(None)),
            active_session: Arc::new(Mutex::new(None)),
            current_dimensions: Arc::new(Mutex::new((1920, 1080))),
        }
    }
}

#[command]
pub async fn start_native_capture(
    app: AppHandle,
    config: CaptureConfig,
) -> Result<String, String> {
    let state = app.state::<NativeRecorderState>();

    if state.is_recording.load(Ordering::Relaxed) {
        return Err("Already recording".to_string());
    }

    let monitors = xcap::Monitor::all()
        .map_err(|e| format!("Failed to enumerate monitors: {}", e))?;
    if config.monitor_index >= monitors.len() {
        return Err("Monitor not found".to_string());
    }
    let monitor_index = config.monitor_index;

    let session_id = format!("drift_rec_{}_{}", chrono::Local::now().format("%Y%m%d_%H%M%S"), uuid::Uuid::new_v4().simple());
    let temp_dir = std::env::temp_dir().join("drift_captures").join(&session_id);
    std::fs::create_dir_all(&temp_dir)
        .map_err(|e| format!("Failed to create capture session directory: {}", e))?;

    let data_path = temp_dir.join("frames.raw");
    let index_path = temp_dir.join("frames.idx");

    let session_info = NativeSessionInfo {
        session_id: session_id.clone(),
        directory: temp_dir.to_string_lossy().to_string(),
        data_path: data_path.to_string_lossy().to_string(),
        index_path: index_path.to_string_lossy().to_string(),
        width: config.width,
        height: config.height,
        fps: config.fps.max(1).min(120),
        total_frames: 0,
        duration_ms: 0.0,
    };

    {
        let mut active = state.active_session.lock();
        *active = Some(session_info);
    }

    state.is_recording.store(true, Ordering::Relaxed);
    state.frame_count.store(0, Ordering::Relaxed);
    state.frames_dropped.store(0, Ordering::Relaxed);
    {
        let mut start = state.start_time.lock();
        *start = Some(std::time::Instant::now());
    }

    let (tx, rx): (SyncSender<RawFrameItem>, Receiver<RawFrameItem>) = sync_channel(16);

    let writer_data_path = data_path.clone();
    let writer_index_path = index_path.clone();
    let writer_is_recording = state.is_recording.clone();

    std::thread::spawn(move || {
        let file_res = OpenOptions::new()
            .create(true)
            .write(true)
            .truncate(true)
            .open(&writer_data_path);

        let idx_file_res = OpenOptions::new()
            .create(true)
            .write(true)
            .truncate(true)
            .open(&writer_index_path);

        if let (Ok(file), Ok(idx_file)) = (file_res, idx_file_res) {
            let mut writer = BufWriter::with_capacity(4 * 1024 * 1024, file);
            let mut idx_writer = BufWriter::new(idx_file);
            let mut current_offset: u64 = 0;

            while let Ok(item) = rx.recv() {
                let byte_len = item.data.len() as u64;
                if let Ok(_) = writer.write_all(&item.data) {
                    let entry = FrameIndexEntry {
                        frame_number: item.frame_number,
                        timestamp_ms: item.timestamp_ms,
                        width: item.width,
                        height: item.height,
                        file_offset: current_offset,
                        byte_length: byte_len,
                    };
                    if let Ok(entry_json) = serde_json::to_string(&entry) {
                        let _ = writeln!(idx_writer, "{}", entry_json);
                    }
                    current_offset += byte_len;
                }
            }
            let _ = writer.flush();
            let _ = idx_writer.flush();
        } else {
            log::error!("Failed to initialize streaming disk files for capture");
            while let Ok(_) = rx.recv() {}
        }
        log::info!("Capture disk writer thread finished cleanly");
    });

    let is_recording = state.is_recording.clone();
    let frame_count = state.frame_count.clone();
    let frames_dropped = state.frames_dropped.clone();
    let start_time = state.start_time.clone();
    let current_dims = state.current_dimensions.clone();
    let target_fps = config.fps.max(1).min(120);
    let frame_interval = std::time::Duration::from_micros(1_000_000 / target_fps as u64);

    std::thread::spawn(move || {
        let monitor = match xcap::Monitor::all() {
            Ok(m) => match m.into_iter().nth(monitor_index) {
                Some(mon) => mon,
                None => {
                    log::error!("Monitor {} not found in capture thread", monitor_index);
                    is_recording.store(false, Ordering::Relaxed);
                    return;
                }
            },
            Err(e) => {
                log::error!("Failed to enumerate monitors in capture thread: {}", e);
                is_recording.store(false, Ordering::Relaxed);
                return;
            }
        };

        let mut first_frame = true;

        while is_recording.load(Ordering::Relaxed) {
            let capture_start = std::time::Instant::now();

            match monitor.capture_image() {
                Ok(img) => {
                    let elapsed_ms = {
                        let st = start_time.lock();
                        st.as_ref().map(|s| s.elapsed().as_secs_f64() * 1000.0).unwrap_or(0.0)
                    };

                    let frame_num = frame_count.fetch_add(1, Ordering::Relaxed);
                    let w = img.width();
                    let h = img.height();

                    if first_frame {
                        let mut dims = current_dims.lock();
                        *dims = (w, h);
                        first_frame = false;
                    }

                    let raw_bytes = img.into_raw();
                    let item = RawFrameItem {
                        frame_number: frame_num,
                        timestamp_ms: elapsed_ms,
                        width: w,
                        height: h,
                        data: raw_bytes,
                    };

                    if let Err(_) = tx.try_send(item) {
                        frames_dropped.fetch_add(1, Ordering::Relaxed);
                    }

                    let _ = app.emit("native-frame", serde_json::json!({
                        "frame_number": frame_num,
                        "timestamp_ms": elapsed_ms,
                        "width": w,
                        "height": h,
                    }));
                }
                Err(e) => {
                    frames_dropped.fetch_add(1, Ordering::Relaxed);
                    log::warn!("Screen frame capture tick failed: {}", e);
                }
            }

            let capture_duration = capture_start.elapsed();
            if capture_duration < frame_interval {
                std::thread::sleep(frame_interval - capture_duration);
            }
        }

        log::info!("Native capture loop exited");
    });

    Ok(session_id)
}

#[command]
pub async fn stop_native_capture(app: AppHandle) -> Result<RecordingStats, String> {
    let state = app.state::<NativeRecorderState>();
    state.is_recording.store(false, Ordering::Relaxed);

    tokio::time::sleep(std::time::Duration::from_millis(200)).await;

    let frames = state.frame_count.load(Ordering::Relaxed);
    let dropped = state.frames_dropped.load(Ordering::Relaxed);
    let duration_ms = {
        let st = state.start_time.lock();
        st.as_ref().map(|s| s.elapsed().as_secs_f64() * 1000.0).unwrap_or(0.0)
    };

    let avg_fps = if duration_ms > 0.0 {
        frames as f64 / (duration_ms / 1000.0)
    } else {
        0.0
    };

    let session_dir = {
        let mut active = state.active_session.lock();
        if let Some(ref mut info) = *active {
            info.total_frames = frames;
            info.duration_ms = duration_ms;
            let (w, h) = *state.current_dimensions.lock();
            info.width = w;
            info.height = h;
            info.directory.clone()
        } else {
            String::new()
        }
    };

    Ok(RecordingStats {
        frames_captured: frames,
        frames_dropped: dropped,
        avg_fps,
        duration_ms,
        session_dir,
    })
}

#[command]
pub async fn get_recording_stats(app: AppHandle) -> Result<RecordingStats, String> {
    let state = app.state::<NativeRecorderState>();

    let frames = state.frame_count.load(Ordering::Relaxed);
    let dropped = state.frames_dropped.load(Ordering::Relaxed);
    let duration_ms = {
        let st = state.start_time.lock();
        st.as_ref().map(|s| s.elapsed().as_secs_f64() * 1000.0).unwrap_or(0.0)
    };

    let avg_fps = if duration_ms > 0.0 {
        frames as f64 / (duration_ms / 1000.0)
    } else {
        0.0
    };

    let session_dir = {
        let active = state.active_session.lock();
        active.as_ref().map(|s| s.directory.clone()).unwrap_or_default()
    };

    Ok(RecordingStats {
        frames_captured: frames,
        frames_dropped: dropped,
        avg_fps,
        duration_ms,
        session_dir,
    })
}

#[command]
pub async fn get_frame_count(app: AppHandle) -> Result<u64, String> {
    let state = app.state::<NativeRecorderState>();
    Ok(state.frame_count.load(Ordering::Relaxed))
}

#[command]
pub async fn get_native_session_info(app: AppHandle) -> Result<Option<NativeSessionInfo>, String> {
    let state = app.state::<NativeRecorderState>();
    let active = state.active_session.lock().clone();
    Ok(active)
}

#[command]
pub async fn discard_native_session(app: AppHandle) -> Result<(), String> {
    let state = app.state::<NativeRecorderState>();
    let active = {
        let mut session = state.active_session.lock();
        session.take()
    };

    if let Some(info) = active {
        let dir = PathBuf::from(info.directory);
        if dir.exists() {
            let _ = std::fs::remove_dir_all(dir);
        }
    }

    Ok(())
}

pub struct DiskFrameReader {
    file: BufReader<File>,
    index_entries: Vec<FrameIndexEntry>,
}

impl DiskFrameReader {
    pub fn open(info: &NativeSessionInfo) -> Result<Self, String> {
        let data_file = File::open(&info.data_path)
            .map_err(|e| format!("Failed to open frame data file: {}", e))?;
        let idx_file = File::open(&info.index_path)
            .map_err(|e| format!("Failed to open index file: {}", e))?;

        let mut reader = BufReader::new(data_file);
        let idx_reader = BufReader::new(idx_file);
        use std::io::BufRead;

        let mut entries = Vec::new();
        for line in idx_reader.lines() {
            if let Ok(l) = line {
                if let Ok(entry) = serde_json::from_str::<FrameIndexEntry>(&l) {
                    entries.push(entry);
                }
            }
        }

        Ok(Self {
            file: reader,
            index_entries: entries,
        })
    }

    pub fn total_frames(&self) -> usize {
        self.index_entries.len()
    }

    pub fn get_entry(&self, index: usize) -> Option<&FrameIndexEntry> {
        self.index_entries.get(index)
    }

    pub fn read_frame(&mut self, index: usize) -> Result<(Vec<u8>, u32, u32, f64), String> {
        let entry = self.index_entries.get(index)
            .ok_or_else(|| format!("Frame index {} out of range", index))?;

        self.file.seek(SeekFrom::Start(entry.file_offset))
            .map_err(|e| format!("Failed to seek frame: {}", e))?;

        let mut buffer = vec![0u8; entry.byte_length as usize];
        self.file.read_exact(&mut buffer)
            .map_err(|e| format!("Failed to read frame data: {}", e))?;

        Ok((buffer, entry.width, entry.height, entry.timestamp_ms))
    }
}

