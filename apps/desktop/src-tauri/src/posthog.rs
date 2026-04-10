use std::time::Duration;

#[allow(dead_code)]
#[derive(Debug)]
pub enum PostHogEvent {
    MultipartUploadComplete {
        duration: Duration,
        length: Duration,
        size: u64,
    },
    MultipartUploadFailed {
        duration: Duration,
        error: String,
    },
}

pub fn init() {}

pub fn set_server_url(_url: &str) {}

pub fn async_capture_event(_event: PostHogEvent) {}
