'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, Zap, HardDrive, ChevronDown, ChevronUp, Clock, AlertTriangle } from 'lucide-react';

import DropZone from '@/components/labs/DropZone';
import ProcessingStatus from '@/components/labs/ProcessingStatus';
import DownloadButton from '@/components/labs/DownloadButton';
import { convertMedia, getConversionSpeedTier, estimateConversionTime } from '@/lib/labs/media-engine';

/**
 * 
 */
export default function ConversionTool({ config, slug }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [outputBlob, setOutputBlob] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const [conversionTime, setConversionTime] = useState(null);

    const speedInfo = useMemo(() => {
        if (!file || !config) return null;
        const tier = getConversionSpeedTier(config.from.ext, config.to.ext, config.category);
        const estimatedSeconds = estimateConversionTime(file.size, config.from.ext, config.to.ext, config.category);

        return {
            tier,
            estimatedSeconds,
            label: tier === 'instant' ? 'INSTANT_ACCEL' :
                tier === 'fast' ? 'ULTRA_FAST' :
                    tier === 'medium' ? 'OPTIMIZED' : 'TRANSCODING',
        };
    }, [file, config]);

    const handleFileSelect = useCallback((selectedFile) => {
        setFile(selectedFile);
        setStatus('idle');
        setProgress(0);
        setOutputBlob(null);
        setErrorMessage('');
        setConversionTime(null);
    }, []);

    const handleConvert = useCallback(async () => {
        if (!file || !config) return;
        const startTime = performance.now();
        try {
            setStatus('processing');
            setProgress(0);
            const result = await convertMedia(file, config, (p) => setProgress(Math.min(p, 99)));
            const endTime = performance.now();
            setConversionTime(Math.round(endTime - startTime));
            setProgress(100);
            setOutputBlob(result);
            setStatus('complete');
        } catch (error) {
            setErrorMessage(error.message || 'ENGINE_FAILURE');
            setStatus('error');
        }
    }, [file, config]);

    const getOutputFilename = useCallback(() => {
        if (!file || !config) return 'drift_output';
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        return `${baseName}.${config.to.ext}`;
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
                        <div className="labs-hero-badge uppercase">{config.category.toUpperCase()}_CONVERTER</div>
                        {speedInfo && (
                            <div className="border-4 border-black bg-black text-[var(--labs-cyan)] px-4 py-1 font-mono font-bold text-xs">
                                {speedInfo.label} :: {Math.round(speedInfo.estimatedSeconds)}s_EST
                            </div>
                        )}
                    </div>

                    <h1 className="font-mono font-black text-5xl md:text-7xl uppercase leading-none mb-6">
                        {config.from.ext}<span className="labs-hero-title-stroke">2</span>{config.to.ext}
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
                                <span className="font-mono font-black">FAST_ONLINE_CONVERTER</span>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
                                    <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white"></div>
                                    <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                                </div>
                            </div>

                            <div className="p-8">
                                <DropZone
                                    onFileSelect={handleFileSelect}
                                    acceptedExtensions={[config.from.ext]}
                                    currentFile={file}
                                    disabled={status === 'processing' || status === 'loading'}
                                />

                                {file && status !== 'complete' && (
                                    <div className="mt-12">
                                        <button
                                            onClick={handleConvert}
                                            disabled={status === 'processing'}
                                            className="labs-btn-massive w-full"
                                        >
                                            {status === 'processing' ? 'PROCESSING...' : `CONVERT_NOW`}
                                        </button>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {(status === 'processing' || status === 'error') && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 border-4 border-black p-8 bg-[var(--labs-gray)]">
                                            <ProcessingStatus status={status} progress={progress} message={errorMessage} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {status === 'complete' && outputBlob && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-12">
                                        <div className="border-4 border-black bg-[var(--labs-cyan)] p-12 text-center">
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

                        {/* SEO / Info Block */}
                        <div className="border-4 border-black p-8 bg-[var(--labs-white)]">
                            <h3 className="font-mono font-black text-2xl uppercase mb-6">FAST_SECURE_FREE</h3>
                            <div className="space-y-4 font-mono text-sm leading-relaxed opacity-80">
                                <p>This tool uses high-performance <span className="text-[var(--labs-orange)] font-bold">WebAssembly</span> technology to process {config.from.name} data into high-quality {config.to.name} files.</p>
                                <p>Privacy: <span className="text-green-600 font-bold">100% PRIVATE</span>. No data ever leaves your browser. All processing happens locally on your device.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Technical Specs / FAQ */}
                    <div className="space-y-12">
                        {/* Status Panel */}
                        <div className="bg-black text-white p-8 border-4 border-black">
                            <h3 className="font-mono font-black text-lg mb-6 text-[var(--labs-cyan)]">SECURE_CONVERSION</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: Shield, label: 'PRIVATE_MODE', val: 'ALWAYS_ON' },
                                    { icon: Zap, label: 'COMPRESSION', val: 'LOSSLESS_READY' },
                                    { icon: HardDrive, label: 'CLOUD_STORAGE', val: 'NEVER_STORED' },
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
