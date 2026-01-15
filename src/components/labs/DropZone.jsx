'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Loader2, AlertCircle } from 'lucide-react';

/**
 * Drop Zone Component - INDUSTRIAL MAXIMALIST EDITION
 * Drag and drop or click to upload files for conversion
 */
export default function DropZone({
    onFileSelect,
    acceptedExtensions = [],
    maxSize = null,
    disabled = false,
    currentFile = null,
    error = null,
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [localError, setLocalError] = useState(null);
    const inputRef = useRef(null);
    const displayError = error || localError;

    const validateFile = useCallback((file) => {
        setLocalError(null);
        if (acceptedExtensions.length > 0) {
            const ext = file.name.split('.').pop().toLowerCase();
            if (!acceptedExtensions.includes(ext)) {
                setLocalError(`UNSUPPORTED_TYPE: ${acceptedExtensions.join(', ').toUpperCase()}_REQUIRED`);
                return false;
            }
        }
        if (maxSize && file.size > maxSize) {
            const maxMB = Math.round(maxSize / 1024 / 1024);
            setLocalError(`FILE_TOO_LARGE: ${maxMB}MB_MAXIMUM`);
            return false;
        }
        return true;
    }, [acceptedExtensions, maxSize]);

    const handleFile = useCallback((file) => {
        if (validateFile(file)) {
            onFileSelect(file);
        }
    }, [validateFile, onFileSelect]);

    const handleDragIn = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragOut = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (disabled) return;
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) handleFile(files[0]);
    }, [disabled, handleFile]);

    const handleClick = useCallback(() => {
        if (!disabled && inputRef.current) inputRef.current.click();
    }, [disabled]);

    const handleInputChange = useCallback((e) => {
        const files = e.target.files;
        if (files && files.length > 0) handleFile(files[0]);
        e.target.value = '';
    }, [handleFile]);

    const handleRemoveFile = useCallback((e) => {
        e.stopPropagation();
        onFileSelect(null);
        setLocalError(null);
    }, [onFileSelect]);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
    };

    return (
        <div className="w-full">
            <motion.div
                onClick={handleClick}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`
                    relative cursor-crosshair
                    min-h-[300px]
                    flex flex-col items-center justify-center gap-6
                    p-12
                    border-4 border-dashed border-black
                    transition-all duration-75
                    ${isDragging ? 'bg-[var(--labs-cyan)] border-solid !text-black' : 'bg-[var(--labs-gray)]'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--labs-white)]'}
                    ${currentFile ? 'bg-[var(--labs-white)] border-solid' : ''}
                    ${displayError ? 'bg-red-500/10 border-red-500' : ''}
                `}
            >
                <input ref={inputRef} type="file" onChange={handleInputChange} className="hidden" disabled={disabled} />

                <AnimatePresence mode="wait">
                    {currentFile ? (
                        <motion.div key="file" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 bg-black flex items-center justify-center border-4 border-black text-[var(--labs-cyan)] shadow-[8px_8px_0px_var(--labs-black)]">
                                    <File size={48} strokeWidth={3} />
                                </div>
                                <button onClick={handleRemoveFile} className="absolute -top-4 -right-4 w-10 h-10 bg-[var(--labs-orange)] border-4 border-black text-black flex items-center justify-center hover:scale-110 active:scale-90 transition-transform shadow-[4px_4px_0px_var(--labs-black)]">
                                    <X size={24} strokeWidth={4} />
                                </button>
                            </div>
                            <div className="text-center">
                                <p className="font-mono font-black text-xl uppercase tracking-tighter truncate max-w-[300px]">
                                    FILE_READY: {currentFile.name}
                                </p>
                                <p className="font-mono font-black text-xs opacity-50 mt-2">
                                    SIZE: {formatFileSize(currentFile.size)}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 text-center">
                            <div className="w-20 h-20 bg-black flex items-center justify-center text-white border-4 border-black group-hover:bg-[var(--labs-orange)] transition-colors">
                                <Upload size={40} strokeWidth={3} />
                            </div>
                            <div>
                                <p className="font-mono font-black text-2xl uppercase tracking-tighter">
                                    {isDragging ? 'RELEASE_TO_UPLOAD' : 'SELECT_MEDIA_FILE'}
                                </p>
                                <p className="font-mono font-black text-[10px] opacity-40 mt-2 uppercase tracking-widest">
                                    [ DRAG + DROP ] OR [ CLICK_TO_BROWSE ]
                                </p>
                                {acceptedExtensions.length > 0 && (
                                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                                        {acceptedExtensions.map(ext => (
                                            <span key={ext} className="border-2 border-black px-2 py-0.5 font-mono text-[10px] font-black bg-[var(--labs-white)]">
                                                .{ext.toUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {displayError && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-6 left-6 right-6 border-4 border-black bg-red-500 text-white p-4 font-mono font-black text-xs uppercase shadow-[6px_6px_0px_#000]">
                        ERROR: {displayError}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
