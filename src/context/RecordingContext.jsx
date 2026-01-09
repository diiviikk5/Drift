"use client";

import { createContext, useContext, useReducer, useCallback, useRef } from "react";

// Recording states
const RECORDING_STATE = {
    IDLE: "idle",
    COUNTDOWN: "countdown",
    RECORDING: "recording",
    PAUSED: "paused",
    STOPPED: "stopped",
    PROCESSING: "processing",
};

// Initial state
const initialState = {
    // Recording state
    recordingState: RECORDING_STATE.IDLE,
    recordingDuration: 0,
    countdownValue: 3,

    // Streams
    screenStream: null,
    webcamStream: null,
    audioStream: null,

    // Recorded data
    recordedBlob: null,
    recordedUrl: null,

    // Zoom keyframes for timeline editing
    zoomKeyframes: [],

    // Cursor events
    cursorEvents: [],

    // Settings
    settings: {
        // Video
        resolution: "1080p",
        frameRate: 60,

        // Webcam
        webcamEnabled: false,
        webcamShape: "circle", // circle, rounded, square
        webcamPosition: "bottom-right", // corners or custom
        webcamSize: 200,
        webcamMirrored: true,

        // Audio
        systemAudioEnabled: true,
        microphoneEnabled: true,
        microphoneGain: 1.0,

        // Drift Effect
        driftEnabled: true,
        autoZoomOnClick: true,
        zoomLevel: 2.0,
        zoomDuration: 500, // ms
        zoomEasing: "easeOutCubic",
        cursorHighlight: true,
        clickRipple: true,

        // Focus Mode
        focusModeEnabled: false,
        focusDimOpacity: 0.7,
        focusBackground: "blur", // blur, gradient, solid

        // Branding
        backgroundEnabled: false,
        backgroundColor: "#1a1a2e",
        backgroundGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingSize: 32,
        shadowEnabled: true,
        borderRadius: 12,

        // Export
        exportFormat: "mp4",
        exportQuality: "high",

        // Countdown
        countdownDuration: 3,
    },

    // Error state
    error: null,
};

// Action types
const ACTIONS = {
    SET_RECORDING_STATE: "SET_RECORDING_STATE",
    SET_SCREEN_STREAM: "SET_SCREEN_STREAM",
    SET_WEBCAM_STREAM: "SET_WEBCAM_STREAM",
    SET_AUDIO_STREAM: "SET_AUDIO_STREAM",
    SET_RECORDED_BLOB: "SET_RECORDED_BLOB",
    UPDATE_SETTINGS: "UPDATE_SETTINGS",
    ADD_ZOOM_KEYFRAME: "ADD_ZOOM_KEYFRAME",
    REMOVE_ZOOM_KEYFRAME: "REMOVE_ZOOM_KEYFRAME",
    UPDATE_ZOOM_KEYFRAME: "UPDATE_ZOOM_KEYFRAME",
    CLEAR_ZOOM_KEYFRAMES: "CLEAR_ZOOM_KEYFRAMES",
    ADD_CURSOR_EVENT: "ADD_CURSOR_EVENT",
    CLEAR_CURSOR_EVENTS: "CLEAR_CURSOR_EVENTS",
    SET_DURATION: "SET_DURATION",
    SET_COUNTDOWN: "SET_COUNTDOWN",
    SET_ERROR: "SET_ERROR",
    RESET: "RESET",
};

// Reducer
function recordingReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_RECORDING_STATE:
            return { ...state, recordingState: action.payload };

        case ACTIONS.SET_SCREEN_STREAM:
            return { ...state, screenStream: action.payload };

        case ACTIONS.SET_WEBCAM_STREAM:
            return { ...state, webcamStream: action.payload };

        case ACTIONS.SET_AUDIO_STREAM:
            return { ...state, audioStream: action.payload };

        case ACTIONS.SET_RECORDED_BLOB:
            const url = action.payload ? URL.createObjectURL(action.payload) : null;
            // Revoke old URL if exists
            if (state.recordedUrl) {
                URL.revokeObjectURL(state.recordedUrl);
            }
            return {
                ...state,
                recordedBlob: action.payload,
                recordedUrl: url,
            };

        case ACTIONS.UPDATE_SETTINGS:
            return {
                ...state,
                settings: { ...state.settings, ...action.payload }
            };

        case ACTIONS.ADD_ZOOM_KEYFRAME:
            return {
                ...state,
                zoomKeyframes: [...state.zoomKeyframes, action.payload].sort((a, b) => a.time - b.time)
            };

        case ACTIONS.REMOVE_ZOOM_KEYFRAME:
            return {
                ...state,
                zoomKeyframes: state.zoomKeyframes.filter((_, i) => i !== action.payload)
            };

        case ACTIONS.UPDATE_ZOOM_KEYFRAME:
            const keyframes = [...state.zoomKeyframes];
            keyframes[action.payload.index] = {
                ...keyframes[action.payload.index],
                ...action.payload.updates
            };
            return { ...state, zoomKeyframes: keyframes.sort((a, b) => a.time - b.time) };

        case ACTIONS.CLEAR_ZOOM_KEYFRAMES:
            return { ...state, zoomKeyframes: [] };

        case ACTIONS.ADD_CURSOR_EVENT:
            return {
                ...state,
                cursorEvents: [...state.cursorEvents, action.payload]
            };

        case ACTIONS.CLEAR_CURSOR_EVENTS:
            return { ...state, cursorEvents: [] };

        case ACTIONS.SET_DURATION:
            return { ...state, recordingDuration: action.payload };

        case ACTIONS.SET_COUNTDOWN:
            return { ...state, countdownValue: action.payload };

        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload };

        case ACTIONS.RESET:
            if (state.recordedUrl) {
                URL.revokeObjectURL(state.recordedUrl);
            }
            return { ...initialState, settings: state.settings };

        default:
            return state;
    }
}

// Context
const RecordingContext = createContext(null);

// Provider Component
export function RecordingProvider({ children }) {
    const [state, dispatch] = useReducer(recordingReducer, initialState);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const durationIntervalRef = useRef(null);
    const startTimeRef = useRef(null);

    // Stop all streams
    const stopAllStreams = useCallback(() => {
        [state.screenStream, state.webcamStream, state.audioStream].forEach(stream => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        });
        dispatch({ type: ACTIONS.SET_SCREEN_STREAM, payload: null });
        dispatch({ type: ACTIONS.SET_WEBCAM_STREAM, payload: null });
        dispatch({ type: ACTIONS.SET_AUDIO_STREAM, payload: null });
    }, [state.screenStream, state.webcamStream, state.audioStream]);

    // Start countdown
    const startCountdown = useCallback(async () => {
        const duration = state.settings.countdownDuration;

        // Skip countdown if duration is 0
        if (duration <= 0) {
            return;
        }

        dispatch({ type: ACTIONS.SET_RECORDING_STATE, payload: RECORDING_STATE.COUNTDOWN });

        for (let i = duration; i > 0; i--) {
            dispatch({ type: ACTIONS.SET_COUNTDOWN, payload: i });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }, [state.settings.countdownDuration]);

    // Start recording
    const startRecording = useCallback(async (compositeStream) => {
        if (!compositeStream) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: "No stream to record" });
            return;
        }

        try {
            // Start countdown first
            await startCountdown();

            // Clear previous recording
            recordedChunksRef.current = [];
            dispatch({ type: ACTIONS.CLEAR_CURSOR_EVENTS });
            dispatch({ type: ACTIONS.CLEAR_ZOOM_KEYFRAMES });

            // Create MediaRecorder
            const options = {
                mimeType: "video/webm;codecs=vp9",
                videoBitsPerSecond: state.settings.exportQuality === "high" ? 8000000 : 4000000,
            };

            // Fallback if VP9 not supported
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options.mimeType = "video/webm";
            }

            const mediaRecorder = new MediaRecorder(compositeStream, options);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
                dispatch({ type: ACTIONS.SET_RECORDED_BLOB, payload: blob });
                dispatch({ type: ACTIONS.SET_RECORDING_STATE, payload: RECORDING_STATE.STOPPED });

                // Clear interval
                if (durationIntervalRef.current) {
                    clearInterval(durationIntervalRef.current);
                }
            };

            // Start recording
            mediaRecorder.start(1000); // Collect data every second
            startTimeRef.current = Date.now();

            // Start duration timer
            durationIntervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                dispatch({ type: ACTIONS.SET_DURATION, payload: elapsed });
            }, 1000);

            dispatch({ type: ACTIONS.SET_RECORDING_STATE, payload: RECORDING_STATE.RECORDING });

        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            dispatch({ type: ACTIONS.SET_RECORDING_STATE, payload: RECORDING_STATE.IDLE });
        }
    }, [startCountdown, state.settings.exportQuality]);

    // Pause recording
    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.pause();
            dispatch({ type: ACTIONS.SET_RECORDING_STATE, payload: RECORDING_STATE.PAUSED });

            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
            }
        }
    }, []);

    // Resume recording
    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
            mediaRecorderRef.current.resume();
            dispatch({ type: ACTIONS.SET_RECORDING_STATE, payload: RECORDING_STATE.RECORDING });

            // Resume timer
            const pausedDuration = state.recordingDuration;
            const resumeTime = Date.now();

            durationIntervalRef.current = setInterval(() => {
                const elapsed = pausedDuration + Math.floor((Date.now() - resumeTime) / 1000);
                dispatch({ type: ACTIONS.SET_DURATION, payload: elapsed });
            }, 1000);
        }
    }, [state.recordingDuration]);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            stopAllStreams();
        }
    }, [stopAllStreams]);

    // Update settings
    const updateSettings = useCallback((updates) => {
        dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: updates });
    }, []);

    // Add cursor event
    const addCursorEvent = useCallback((event) => {
        if (state.recordingState === RECORDING_STATE.RECORDING) {
            dispatch({
                type: ACTIONS.ADD_CURSOR_EVENT,
                payload: {
                    ...event,
                    time: Date.now() - startTimeRef.current
                }
            });
        }
    }, [state.recordingState]);

    // Add zoom keyframe
    const addZoomKeyframe = useCallback((keyframe) => {
        dispatch({ type: ACTIONS.ADD_ZOOM_KEYFRAME, payload: keyframe });
    }, []);

    // Remove zoom keyframe
    const removeZoomKeyframe = useCallback((index) => {
        dispatch({ type: ACTIONS.REMOVE_ZOOM_KEYFRAME, payload: index });
    }, []);

    // Update zoom keyframe
    const updateZoomKeyframe = useCallback((index, updates) => {
        dispatch({ type: ACTIONS.UPDATE_ZOOM_KEYFRAME, payload: { index, updates } });
    }, []);

    // Reset to initial state
    const reset = useCallback(() => {
        stopAllStreams();
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
        }
        dispatch({ type: ACTIONS.RESET });
    }, [stopAllStreams]);

    // Set streams
    const setScreenStream = useCallback((stream) => {
        dispatch({ type: ACTIONS.SET_SCREEN_STREAM, payload: stream });
    }, []);

    const setWebcamStream = useCallback((stream) => {
        dispatch({ type: ACTIONS.SET_WEBCAM_STREAM, payload: stream });
    }, []);

    const setAudioStream = useCallback((stream) => {
        dispatch({ type: ACTIONS.SET_AUDIO_STREAM, payload: stream });
    }, []);

    const value = {
        // State
        ...state,
        RECORDING_STATE,

        // Actions
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        updateSettings,
        addCursorEvent,
        addZoomKeyframe,
        removeZoomKeyframe,
        updateZoomKeyframe,
        reset,
        setScreenStream,
        setWebcamStream,
        setAudioStream,
        stopAllStreams,
    };

    return (
        <RecordingContext.Provider value={value}>
            {children}
        </RecordingContext.Provider>
    );
}

// Hook
export function useRecording() {
    const context = useContext(RecordingContext);
    if (!context) {
        throw new Error("useRecording must be used within a RecordingProvider");
    }
    return context;
}

export { RECORDING_STATE };
