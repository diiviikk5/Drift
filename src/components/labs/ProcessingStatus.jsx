'use client';

import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

/**
 * Processing Status Component - INDUSTRIAL EDITION
 * Shows progress during media conversion with aggressive industrial styling
 */
export default function ProcessingStatus({
    status = 'idle', // 'idle' | 'loading' | 'processing' | 'complete' | 'error'
    progress = 0, // 0-100
    message = '',
    estimatedTime = null, // in seconds
}) {
    const statusConfig = {
        idle: {
            icon: null,
            label: '',
            color: '#000',
            bgColor: '#fff',
        },
        loading: {
            icon: Loader2,
            label: 'INITIALIZING...',
            color: '#fff',
            bgColor: '#000',
            animate: true,
        },
        processing: {
            icon: Loader2,
            label: 'CONVERTING_MEDIA...',
            color: '#000',
            bgColor: '#00f0ff', // Cyan
            animate: true,
        },
        complete: {
            icon: CheckCircle2,
            label: 'COMPLETE_READY',
            color: '#000',
            bgColor: '#00ffc2', // Greenish-cyan
        },
        error: {
            icon: XCircle,
            label: 'PROCESS_FAILED',
            color: '#fff',
            bgColor: '#ff4444',
        },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    if (status === 'idle') {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full border-4 border-black bg-black"
        >
            <div className="p-8 bg-[var(--labs-white)] border-4 border-black m-1">
                {/* Status Header */}
                <div className="flex items-center gap-4 mb-8">
                    {IconComponent && (
                        <div
                            className={`w-14 h-14 flex items-center justify-center border-4 border-black`}
                            style={{ backgroundColor: config.bgColor }}
                        >
                            <IconComponent
                                className={`w-8 h-8 ${config.animate ? 'animate-spin' : ''}`}
                                style={{ color: config.color }}
                            />
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="font-mono font-black text-2xl uppercase tracking-tighter">
                            {config.label}
                        </p>
                        {message && (
                            <p className="font-mono text-xs font-bold bg-black text-white px-2 py-1 inline-block mt-2">
                                STATUS: {message}
                            </p>
                        )}
                    </div>
                    {/* Progress Percentage */}
                    {(status === 'processing' || status === 'loading') && (
                        <div className="text-right">
                            <p className="font-mono font-black text-4xl">
                                {progress}<span className="text-[var(--labs-cyan)]">%</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {(status === 'processing' || status === 'loading') && (
                    <div className="relative h-12 bg-[var(--labs-gray)] border-4 border-black overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            className="absolute inset-y-0 left-0"
                            style={{ backgroundColor: config.bgColor, borderRight: '4px solid black' }}
                        />
                        {/* Industrial Stripes */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `repeating-linear-gradient(45deg, #000, #000 10px, transparent 10px, transparent 20px)`,
                            }}
                        />
                    </div>
                )}

                {/* Estimated Time */}
                {estimatedTime && status === 'processing' && (
                    <div className="flex items-center gap-2 mt-4 font-mono text-[10px] font-black opacity-40">
                        <Clock className="w-4 h-4" />
                        <span>ESTIMATED_TIME: {Math.ceil(estimatedTime)}s</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
