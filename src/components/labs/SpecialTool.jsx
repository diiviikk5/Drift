'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, Zap, HardDrive, Settings, Activity } from 'lucide-react';

import DropZone from '@/components/labs/DropZone';
import ProcessingStatus from '@/components/labs/ProcessingStatus';
import DownloadButton from '@/components/labs/DownloadButton';

/**
 * Special Tool Component - INDUSTRIAL MAXIMALIST EDITION
 */
export default function SpecialTool({ config, slug }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [outputBlob, setOutputBlob] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [conversionTime, setConversionTime] = useState(null);

    // Tool-specific options
    const [quality, setQuality] = useState('medium');
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(30);

    const handleFileSelect = useCallback((selectedFile) => {
        setFile(selectedFile);
        setStatus('idle');
        setProgress(0);
        setOutputBlob(null);
        setErrorMessage('');
        setConversionTime(null);
    }, []);

    const handleProcess = useCallback(async () => {
        if (!file || !config) return;
        const startPerfTime = performance.now();
        try {
            setStatus('processing');
            setProgress(0);
            const { extractAudio, compressVideo, trimVideo, convertFileWithFFmpeg } = await import('@/lib/labs/ffmpeg');
            let result;
            const progressCallback = (p) => setProgress(Math.min(p, 99));

            switch (config.type) {
                case 'extract': result = await extractAudio(file, progressCallback); break;
                case 'compress': result = await compressVideo(file, quality, progressCallback); break;
                case 'trim': result = await trimVideo(file, startTime, endTime, progressCallback); break;
                default: result = await convertFileWithFFmpeg(file, config.output.ext, config.ffmpegArgs, progressCallback);
            }

            const endPerfTime = performance.now();
            setConversionTime(Math.round(endPerfTime - startPerfTime));
            setProgress(100);
            setOutputBlob(result);
            setStatus('complete');
        } catch (error) {
            setErrorMessage(error.message || 'ENGINE_FAILURE');
            setStatus('error');
        }
    }, [file, config, quality, startTime, endTime]);

    const getOutputFilename = useCallback(() => {
        if (!file || !config) return 'output';
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        return `${baseName}_${config.type}.${config.output.ext}`;
    }, [file, config]);

    if (!config) return null;

    return (
        <div className="labs-page labs-bg-grid min-h-screen pb-24">
            <div className="max-w-6xl mx-auto px-4 py-12">

                {/* Back Nav */}
                <Link href="/labs" className="inline-block mb-12">
                    <div className="flex items-center gap-3 font-mono font-black border-4 border-black p-4 bg-white hover:bg-[var(--labs-cyan)] transition-all">
                        <ArrowLeft size={24} strokeWidth={3} />
                        <span className="uppercase text-lg">RETURN_TO_CORE</span>
                    </div>
                </Link>

                {/* Header */}
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="labs-hero-badge uppercase">{config.type.toUpperCase()}_TOOL</div>
                        <div className="border-4 border-black bg-black text-white px-4 py-1 font-mono font-bold text-xs">
                            FREE_ONLINE_TOOL
                        </div>
                    </div>

                    <h1 className="font-mono font-black text-5xl md:text-7xl uppercase leading-none mb-6">
                        {config.title.replace(' ', '_')}
                    </h1>

                    <p className="font-mono text-xl font-bold max-w-2xl bg-black text-white p-6 leading-tight border-l-[12px] border-[var(--labs-orange)]">
                        {config.description}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Main Interaction */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="labs-tool-card !p-0 overflow-hidden">
                            <div className="bg-black p-6 flex justify-between items-center text-white border-b-4 border-black">
                                <span className="font-mono font-black">FAST_SECURE_MEDIA_TOOL</span>
                                <div className="flex gap-2 text-[var(--labs-cyan)]">
                                    <Activity size={16} />
                                    <span className="font-mono text-[10px] font-black uppercase">READY</span>
                                </div>
                            </div>

                            <div className="p-8">
                                <DropZone
                                    onFileSelect={handleFileSelect}
                                    acceptedExtensions={config.accepts}
                                    currentFile={file}
                                    disabled={status === 'processing' || status === 'loading'}
                                />

                                {/* Options Panel */}
                                {file && status !== 'complete' && (
                                    <div className="mt-12 space-y-8">
                                        {/* Compress options */}
                                        {config.type === 'compress' && (
                                            <div className="border-4 border-black p-6 bg-[var(--labs-white)] shadow-[6px_6px_0px_var(--labs-black)]">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <Settings size={20} className="text-[var(--labs-orange)]" />
                                                    <span className="font-mono font-black uppercase underline">Compression_Quality</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    {['low', 'medium', 'high'].map((q) => (
                                                        <button
                                                            key={q}
                                                            onClick={() => setQuality(q)}
                                                            className={`border-4 border-black p-4 font-mono font-black uppercase transition-all ${quality === q ? 'bg-[var(--labs-cyan)] !text-black translate-y-[-4px] shadow-[4px_4px_0px_var(--labs-black)]' : 'bg-[var(--labs-gray)] hover:bg-[var(--labs-white)]'}`}
                                                        >
                                                            {q}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Trim options */}
                                        {config.type === 'trim' && (
                                            <div className="border-4 border-black p-6 bg-[var(--labs-white)] shadow-[6px_6px_0px_var(--labs-black)]">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <Settings size={20} className="text-[var(--labs-orange)]" />
                                                    <span className="font-mono font-black uppercase underline">Trim_Settings</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                    <div>
                                                        <label className="font-mono font-black text-[10px] uppercase block mb-2 opacity-40">START_TIME (SEC)</label>
                                                        <input type="number" value={startTime} onChange={(e) => setStartTime(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full border-4 border-black p-4 font-mono font-black text-xl bg-[var(--labs-gray)]" />
                                                    </div>
                                                    <div>
                                                        <label className="font-mono font-black text-[10px] uppercase block mb-2 opacity-40">END_TIME (SEC)</label>
                                                        <input type="number" value={endTime} onChange={(e) => setEndTime(Math.max(startTime + 1, parseFloat(e.target.value) || startTime + 1))} className="w-full border-4 border-black p-4 font-mono font-black text-xl bg-[var(--labs-gray)]" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <button onClick={handleProcess} disabled={status === 'processing'} className="labs-btn-massive w-full">
                                            {status === 'processing' ? 'PROCESSING...' : `PROCESS_NOW`}
                                        </button>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {(status === 'processing' || status === 'error') && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 border-4 border-black p-1 bg-black">
                                            <ProcessingStatus status={status} progress={progress} message={errorMessage} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {status === 'complete' && outputBlob && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-12">
                                        <div className="border-4 border-black bg-[var(--labs-cyan)] p-12 text-center shadow-[10px_10px_0px_#000]">
                                            <div className="font-mono font-black text-3xl mb-6">DOWNLOAD_READY</div>
                                            <DownloadButton blob={outputBlob} filename={getOutputFilename()} size="large" />
                                            {conversionTime && (
                                                <div className="mt-4 font-mono font-bold opacity-60 uppercase text-xs">
                                                    TIME: {conversionTime}ms
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Technical Specs / Format Cloud */}
                    <div className="space-y-12">
                        <div className="bg-black text-white p-8 border-4 border-black shadow-[8px_8px_0px_var(--labs-cyan)]">
                            <h3 className="font-mono font-black text-lg mb-6 text-[var(--labs-cyan)]">FAST_SECURE</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: Shield, label: 'PRIVACY', val: 'LOCAL_ONLY' },
                                    { icon: Zap, label: 'COMPUTE', val: 'HW_ACCELERATED' },
                                    { icon: HardDrive, label: 'STORAGE', val: 'RAM_BUFFER_ONLY' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <item.icon size={24} className="text-[var(--labs-orange)]" />
                                        <div>
                                            <div className="font-mono text-[10px] opacity-40">{item.label}</div>
                                            <div className="font-mono font-black text-sm">{item.val}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-4 border-black p-6 bg-[var(--labs-white)]">
                            <h3 className="font-mono font-black text-lg uppercase mb-6">SUPPORTED_EXT</h3>
                            <div className="flex flex-wrap gap-2">
                                {config.accepts.map(ext => (
                                    <span key={ext} className="border-2 border-black px-2 py-1 font-mono text-[10px] font-black bg-[var(--labs-gray)] italic">
                                        *.{ext.toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Block */}
                        <div className="space-y-4">
                            <h3 className="font-mono font-black text-xl uppercase mb-6">HOW_IT_WORKS</h3>
                            {config.faq && config.faq.map((item, i) => (
                                <div key={i} className="border-4 border-black p-4 bg-[var(--labs-white)] hover:bg-[var(--labs-cyan)] dark:hover:text-black transition-colors cursor-help">
                                    <div className="font-mono font-black text-sm uppercase mb-2">Q: {item.q}</div>
                                    <div className="font-mono text-xs opacity-60">A: {item.a}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
