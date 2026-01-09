# Drift Chrome Extension

Track clicks across all tabs for the Drift zoom effect.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder from this project

## Usage

1. Install the extension
2. Open Drift Studio at `http://localhost:3000/studio`
3. Select a screen source to record
4. Click "Record" to start
5. Switch to any tab and click around - each click will trigger a smooth zoom in your recording!
6. Stop recording to see the final video with all zooms applied

## How it works

- The content script runs on every webpage
- When recording starts, it tracks all mousedown events
- Click positions are sent to the Drift Studio via postMessage
- The studio applies smooth zoom animations in real-time
- The zoomed output is recorded to the final video

## Features

- ⚡ Real-time click tracking across all tabs
- 🎯 Professional smooth zoom animations  
- 📍 Click ripple effects
- 🎥 High-quality 1080p @ 60fps recording
- 🎤 System audio + microphone support
- 📷 Webcam overlay
