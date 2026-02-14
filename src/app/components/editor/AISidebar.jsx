'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Eye, Scissors, MessageSquare, Zap, Image, Type,
    ChevronLeft, ChevronRight, Loader2, Check, AlertCircle, Send
} from 'lucide-react';
import { generateAutoZoom } from '@/lib/ai/auto-zoom';
import { generateSmartCrop } from '@/lib/ai/smart-crop';
import { generateCaptions, toSRT } from '@/lib/ai/captions';
import { detectScenes } from '@/lib/ai/scene-detection';
import { generateTitleAndThumbnail } from '@/lib/ai/metadata';
import { parseEditInstruction, executeCommands } from '@/lib/ai/nl-editor';
import { getAISettings } from '../settings/AISettings';

const AI_TOOLS = [
    {
        id: 'autoZoom',
        label: 'Auto Zoom',
        desc: 'AI scores clicks by importance and generates zoom keyframes',
        icon: Eye,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
    },
    {
        id: 'smartCrop',
        label: 'Smart Crop',
        desc: 'Detects active screen regions to auto-frame your recording',
        icon: Scissors,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
    },
    {
        id: 'captions',
        label: 'Captions',
        desc: 'Transcribe audio and add captions (Web Speech API)',
        icon: MessageSquare,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
    },
    {
        id: 'sceneDetection',
        label: 'Scenes',
        desc: 'Detect scene boundaries and create chapters',
        icon: Zap,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
    },
    {
        id: 'metadata',
        label: 'Title & Thumb',
        desc: 'Generate titles and pick the best thumbnail frame',
        icon: Image,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
    },
];

export default function AISidebar({
    isOpen,
    onToggle,
    studioEngine,
    videoBlob,
    clicks,
    duration,
}) {
    const [status, setStatus] = useState({}); // { [toolId]: 'idle' | 'loading' | 'done' | 'error' }
    const [results, setResults] = useState({});
    const [nlInput, setNlInput] = useState('');
    const [nlStatus, setNlStatus] = useState('idle');
    const [nlLog, setNlLog] = useState([]);

    const settings = getAISettings();

    const runTool = useCallback(async (toolId) => {
        if (!studioEngine) return;
        setStatus(prev => ({ ...prev, [toolId]: 'loading' }));

        try {
            let result;

            switch (toolId) {
                case 'autoZoom': {
                    const keyframes = await generateAutoZoom(clicks, duration, studioEngine.canvas.width, studioEngine.canvas.height);
                    // Apply to studio engine
                    studioEngine.zoomEngine.clearKeyframes();
                    studioEngine.zoomEngine.setKeyframes(keyframes);
                    studioEngine.clicks = keyframes.map(kf => ({
                        time: kf.time,
                        x: kf.x,
                        y: kf.y,
                        scale: kf.scale,
                        speed: kf.speed || 'normal',
                    }));
                    result = { keyframes: keyframes.length, message: `Generated ${keyframes.length} smart zoom keyframes` };
                    break;
                }
                case 'smartCrop': {
                    const crop = await generateSmartCrop(clicks, studioEngine.canvas.width, studioEngine.canvas.height, duration);
                    result = { crop, message: `Suggested crop: ${crop.width}×${crop.height} at (${crop.x}, ${crop.y})` };
                    break;
                }
                case 'captions': {
                    const captions = await generateCaptions(videoBlob);
                    const srt = toSRT(captions);
                    result = { captions, srt, message: `Transcribed ${captions.length} caption segments` };
                    break;
                }
                case 'sceneDetection': {
                    const tempVideo = document.createElement('video');
                    tempVideo.src = URL.createObjectURL(videoBlob);
                    await new Promise(r => { tempVideo.onloadedmetadata = r; });
                    const scenes = await detectScenes(tempVideo);
                    URL.revokeObjectURL(tempVideo.src);
                    result = { scenes, message: `Detected ${scenes.chapters?.length || 0} scenes` };
                    break;
                }
                case 'metadata': {
                    const tempVideo2 = document.createElement('video');
                    tempVideo2.src = URL.createObjectURL(videoBlob);
                    await new Promise(r => { tempVideo2.onloadedmetadata = r; });
                    const meta = await generateTitleAndThumbnail(tempVideo2, clicks, duration);
                    URL.revokeObjectURL(tempVideo2.src);
                    result = { ...meta, message: `Generated ${meta.titles?.length || 0} title options` };
                    break;
                }
            }

            setResults(prev => ({ ...prev, [toolId]: result }));
            setStatus(prev => ({ ...prev, [toolId]: 'done' }));
        } catch (err) {
            console.error(`[AI Sidebar] ${toolId} failed:`, err);
            setResults(prev => ({ ...prev, [toolId]: { message: err.message } }));
            setStatus(prev => ({ ...prev, [toolId]: 'error' }));
        }
    }, [studioEngine, videoBlob, clicks, duration]);

    const handleNlEdit = useCallback(async () => {
        if (!nlInput.trim() || !studioEngine) return;
        setNlStatus('loading');
        setNlLog(prev => [...prev, { role: 'user', text: nlInput }]);

        try {
            const parsed = await parseEditInstruction(nlInput);
            const applied = executeCommands(parsed.commands, studioEngine, studioEngine.zoomEngine);
            setNlLog(prev => [...prev, { role: 'ai', text: `Applied: ${applied.map(a => a.action).join(', ')}` }]);
            setNlStatus('idle');
        } catch (err) {
            setNlLog(prev => [...prev, { role: 'ai', text: `Error: ${err.message}`, error: true }]);
            setNlStatus('error');
            setTimeout(() => setNlStatus('idle'), 2000);
        }

        setNlInput('');
    }, [nlInput, studioEngine]);

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={onToggle}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-zinc-900 border border-zinc-800 border-r-0 rounded-l-xl p-2 hover:bg-zinc-800 transition-colors"
                title="AI Tools"
            >
                {isOpen ? <ChevronRight className="w-4 h-4 text-purple-400" /> : (
                    <div className="flex flex-col items-center gap-1">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <ChevronLeft className="w-3 h-3 text-zinc-500" />
                    </div>
                )}
            </button>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-80 z-30 bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            <h3 className="text-sm font-bold text-white">AI Studio</h3>
                            <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-500/20 text-green-400">FREE</span>
                        </div>

                        {/* Tool buttons */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {AI_TOOLS.filter(t => settings.features[t.id] !== false).map(tool => {
                                const Icon = tool.icon;
                                const st = status[tool.id] || 'idle';
                                const res = results[tool.id];

                                return (
                                    <div key={tool.id} className="rounded-xl border border-zinc-800 overflow-hidden">
                                        <button
                                            onClick={() => runTool(tool.id)}
                                            disabled={st === 'loading'}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-zinc-900/50 transition-colors disabled:opacity-50"
                                        >
                                            <div className={`p-2 rounded-lg ${tool.bg}`}>
                                                {st === 'loading' ? (
                                                    <Loader2 className={`w-4 h-4 ${tool.color} animate-spin`} />
                                                ) : st === 'done' ? (
                                                    <Check className="w-4 h-4 text-green-400" />
                                                ) : st === 'error' ? (
                                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                                ) : (
                                                    <Icon className={`w-4 h-4 ${tool.color}`} />
                                                )}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="text-sm font-medium text-white">{tool.label}</div>
                                                <div className="text-[11px] text-zinc-500">{tool.desc}</div>
                                            </div>
                                        </button>

                                        {/* Result message */}
                                        {res && (
                                            <div className={`px-3 pb-3 text-xs ${st === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                                {res.message}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Natural Language Editor */}
                        {settings.features.nlEditor !== false && (
                            <div className="border-t border-zinc-800 p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Type className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs font-semibold text-zinc-400">Natural Language Edit</span>
                                </div>

                                {/* Chat log */}
                                {nlLog.length > 0 && (
                                    <div className="max-h-32 overflow-y-auto mb-2 space-y-1">
                                        {nlLog.slice(-6).map((msg, i) => (
                                            <div key={i} className={`text-xs rounded-lg px-2 py-1 ${
                                                msg.role === 'user'
                                                    ? 'bg-zinc-800 text-zinc-300 ml-4'
                                                    : msg.error
                                                        ? 'bg-red-500/10 text-red-400 mr-4'
                                                        : 'bg-purple-500/10 text-purple-300 mr-4'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={nlInput}
                                        onChange={e => setNlInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleNlEdit()}
                                        placeholder="e.g. slow down the zooms..."
                                        className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500"
                                    />
                                    <button
                                        onClick={handleNlEdit}
                                        disabled={nlStatus === 'loading' || !nlInput.trim()}
                                        className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-colors"
                                    >
                                        {nlStatus === 'loading' ? (
                                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4 text-white" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
