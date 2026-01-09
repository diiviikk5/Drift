"use client";

import { useState, useCallback, useRef } from "react";

/**
 * Custom hook for capturing media streams
 * Uses native browser APIs - completely free, no server costs
 */
export function useMediaCapture() {
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState(null);
    const screenStreamRef = useRef(null);
    const webcamStreamRef = useRef(null);
    const audioStreamRef = useRef(null);

    /**
     * Capture screen/window/tab using getDisplayMedia
     * @param {Object} options - Capture options
     * @returns {MediaStream|null}
     */
    const captureScreen = useCallback(async (options = {}) => {
        try {
            setIsCapturing(true);
            setError(null);

            const constraints = {
                video: {
                    cursor: "always",
                    displaySurface: options.displaySurface || "monitor", // monitor, window, browser
                    ...options.video,
                },
                audio: options.systemAudio !== false ? {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                } : false,
            };

            // Request screen capture
            const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

            // Handle stream ending (user clicks "Stop sharing")
            stream.getVideoTracks()[0].onended = () => {
                screenStreamRef.current = null;
            };

            screenStreamRef.current = stream;
            return stream;

        } catch (err) {
            // User cancelled or permission denied
            if (err.name === "NotAllowedError") {
                setError("Screen capture permission denied");
            } else if (err.name === "NotFoundError") {
                setError("No screen available for capture");
            } else {
                setError(err.message);
            }
            return null;
        } finally {
            setIsCapturing(false);
        }
    }, []);

    /**
     * Capture webcam using getUserMedia
     * @param {Object} options - Webcam options
     * @returns {MediaStream|null}
     */
    const captureWebcam = useCallback(async (options = {}) => {
        try {
            setIsCapturing(true);
            setError(null);

            const constraints = {
                video: {
                    width: { ideal: options.width || 640 },
                    height: { ideal: options.height || 480 },
                    frameRate: { ideal: options.frameRate || 30 },
                    facingMode: options.facingMode || "user",
                    ...options.video,
                },
                audio: false, // Audio captured separately
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            stream.getVideoTracks()[0].onended = () => {
                webcamStreamRef.current = null;
            };

            webcamStreamRef.current = stream;
            return stream;

        } catch (err) {
            if (err.name === "NotAllowedError") {
                setError("Webcam permission denied");
            } else if (err.name === "NotFoundError") {
                setError("No webcam found");
            } else {
                setError(err.message);
            }
            return null;
        } finally {
            setIsCapturing(false);
        }
    }, []);

    /**
     * Capture microphone audio
     * @param {Object} options - Audio options
     * @returns {MediaStream|null}
     */
    const captureMicrophone = useCallback(async (options = {}) => {
        try {
            setIsCapturing(true);
            setError(null);

            const constraints = {
                audio: {
                    echoCancellation: options.echoCancellation ?? true,
                    noiseSuppression: options.noiseSuppression ?? true,
                    autoGainControl: options.autoGainControl ?? false,
                    ...options.audio,
                },
                video: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            stream.getAudioTracks()[0].onended = () => {
                audioStreamRef.current = null;
            };

            audioStreamRef.current = stream;
            return stream;

        } catch (err) {
            if (err.name === "NotAllowedError") {
                setError("Microphone permission denied");
            } else if (err.name === "NotFoundError") {
                setError("No microphone found");
            } else {
                setError(err.message);
            }
            return null;
        } finally {
            setIsCapturing(false);
        }
    }, []);

    /**
     * Get list of available devices
     * @returns {Object} - Object with videoInputs and audioInputs arrays
     */
    const getDevices = useCallback(async () => {
        try {
            // Need to request permission first to get device labels
            const devices = await navigator.mediaDevices.enumerateDevices();

            return {
                videoInputs: devices.filter(d => d.kind === "videoinput"),
                audioInputs: devices.filter(d => d.kind === "audioinput"),
                audioOutputs: devices.filter(d => d.kind === "audiooutput"),
            };
        } catch (err) {
            setError(err.message);
            return { videoInputs: [], audioInputs: [], audioOutputs: [] };
        }
    }, []);

    /**
     * Stop a specific stream
     * @param {MediaStream} stream
     */
    const stopStream = useCallback((stream) => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }, []);

    /**
     * Stop all captured streams
     */
    const stopAllStreams = useCallback(() => {
        stopStream(screenStreamRef.current);
        stopStream(webcamStreamRef.current);
        stopStream(audioStreamRef.current);

        screenStreamRef.current = null;
        webcamStreamRef.current = null;
        audioStreamRef.current = null;
    }, [stopStream]);

    /**
     * Check browser support for required APIs
     * @returns {Object} - Support status for each API
     */
    const checkBrowserSupport = useCallback(() => {
        return {
            getDisplayMedia: !!navigator.mediaDevices?.getDisplayMedia,
            getUserMedia: !!navigator.mediaDevices?.getUserMedia,
            mediaRecorder: !!window.MediaRecorder,
            webCodecs: !!window.VideoEncoder,
            offscreenCanvas: !!window.OffscreenCanvas,
        };
    }, []);

    return {
        // State
        isCapturing,
        error,

        // Capture functions
        captureScreen,
        captureWebcam,
        captureMicrophone,

        // Utility functions
        getDevices,
        stopStream,
        stopAllStreams,
        checkBrowserSupport,

        // Refs for direct access
        screenStreamRef,
        webcamStreamRef,
        audioStreamRef,
    };
}
