use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct AIConfig {
    pub api_key: String,
    pub preferred_model: String,
    pub enabled: bool,
}

/// Proxy AI requests through Rust to avoid CORS issues in the webview
/// This calls OpenRouter's API from the Rust backend
#[command]
pub async fn ai_completion(
    api_key: String,
    model: String,
    messages: Vec<serde_json::Value>,
    max_tokens: Option<u32>,
    temperature: Option<f64>,
) -> Result<String, String> {
    let client = reqwest::Client::new();

    let mut body = serde_json::json!({
        "model": model,
        "messages": messages,
    });

    if let Some(mt) = max_tokens {
        body["max_tokens"] = serde_json::json!(mt);
    }
    if let Some(temp) = temperature {
        body["temperature"] = serde_json::json!(temp);
    }

    let response = client
        .post("https://openrouter.ai/api/v1/chat/completions")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .header("HTTP-Referer", "https://getdrift.app")
        .header("X-Title", "Drift Screen Recorder")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let status = response.status();
    let text = response
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    if !status.is_success() {
        return Err(format!("API error ({}): {}", status, text));
    }

    Ok(text)
}
