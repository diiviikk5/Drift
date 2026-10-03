'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Key, Zap, Eye, MessageSquare, Scissors, Image, Type,
    ChevronDown, ChevronRight, Check, AlertCircle, Sparkles, Settings2
} from 'lucide-react';

const CEREBRAS_MODELS = [
    { id: 'qwen-3.8-27b', name: 'Qwen 3.8 27B (Showcase)', speed: '~2,400 tok/s', ctx: '131K', best: 'Ultra-Fast NL Video Editing & Reasoning', badge: 'RECOMMENDED' },
    { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', speed: '~2,000 tok/s', ctx: '128K', best: 'Deep Reasoning & Logic', badge: 'FLAGSHIP' },
    { id: 'llama3.1-8b', name: 'Llama 3.1 8B (Instant)', speed: '~2,200 tok/s', ctx: '128K', best: 'Ultra-low latency (~120ms)', badge: 'TURBO' },
];

const FREE_MODELS = [
    { id: 'stepfun/step-3.5-flash:free', name: 'Step 3.5 Flash', ctx: '256K', best: 'Reasoning' },
    { id: 'arcee-ai/trinity-large-preview:free', name: 'Trinity Large', ctx: '131K', best: 'Agentic' },
    { id: 'openrouter/aurora-alpha', name: 'Aurora Alpha', ctx: '128K', best: 'Fast' },
    { id: 'liquid/lfm-2.5-1.2b-instruct:free', name: 'LFM 2.5', ctx: '33K', best: 'Lightweight' },
];

const AI_FEATURES = [
    { key: 'autoZoom', label: 'Auto Zoom', desc: 'AI-powered click importance scoring', icon: Eye },
    { key: 'smartCrop', label: 'Smart Crop', desc: 'Detect active regions & auto-frame', icon: Scissors },
    { key: 'captions', label: 'Auto Captions', desc: 'Transcribe & add captions to recordings', icon: MessageSquare },
    { key: 'sceneDetection', label: 'Scene Detection', desc: 'Auto-detect scene changes & chapters', icon: Zap },
    { key: 'metadata', label: 'Title & Thumbnail', desc: 'Generate titles and thumbnail timestamps', icon: Image },
    { key: 'nlEditor', label: 'Natural Language Edit', desc: 'Edit recordings with text commands', icon: Type },
];

const STORAGE_KEY = 'drift-ai-settings';

function getDefaults() {
    return {
        provider: 'cerebras',
        cerebrasApiKey: '',
        cerebrasModel: 'qwen-3.8-27b',
        apiKey: '',
        preferredModel: FREE_MODELS[0].id,
        features: {
            autoZoom: true,
            smartCrop: true,
            captions: true,
            sceneDetection: true,
            metadata: true,
            nlEditor: true,
        },
    };
}

function loadSettings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const cerebrasKey = localStorage.getItem('drift_cerebras_key') || '';
        const provider = localStorage.getItem('drift_ai_provider') || (cerebrasKey ? 'cerebras' : 'cerebras');
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                ...getDefaults(),
                ...parsed,
                provider: parsed.provider || provider,
                cerebrasApiKey: parsed.cerebrasApiKey || cerebrasKey,
            };
        }
        return {
            ...getDefaults(),
            cerebrasApiKey: cerebrasKey,
            provider,
        };
    } catch { /* ignore */ }
    return getDefaults();
}

function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        if (settings.cerebrasApiKey) {
            localStorage.setItem('drift_cerebras_key', settings.cerebrasApiKey);
        }
        if (settings.provider) {
            localStorage.setItem('drift_ai_provider', settings.provider);
        }
        if (settings.apiKey) {
            localStorage.setItem('drift_openrouter_key', settings.apiKey);
        }
    } catch { /* ignore */ }
}

export default function AISettings({ isOpen, onClose }) {
    const [settings, setSettings] = useState(getDefaults);
    const [expanded, setExpanded] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSettings(loadSettings());
    }, [isOpen]);

    const update = (key, value) => {
        setSettings(prev => {
            const next = { ...prev, [key]: value };
            saveSettings(next);
            return next;
        });
    };

    const toggleFeature = (key) => {
        setSettings(prev => {
            const next = {
                ...prev,
                features: { ...prev.features, [key]: !prev.features[key] }
            };
            saveSettings(next);
            return next;
        });
    };

    const handleSave = () => {
        saveSettings(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!isOpen) return null;

    const isCerebras = settings.provider === 'cerebras';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-purple-500/20">
                                <Brain className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    AI Engine & Settings
                                    {isCerebras && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                            ⚡ 2,000 tok/s
                                        </span>
                                    )}
                                </h2>
                                <p className="text-xs text-zinc-500">Configure AI inference provider & video editing models</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-xl">✕</button>
                    </div>

                    <div className="p-5 space-y-6">
                        {/* Provider Selection Tabs */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block font-mono">
                                AI Provider
                            </label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => update('provider', 'cerebras')}
                                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                                        isCerebras
                                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                            : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    <Zap className="w-4 h-4 fill-current" />
                                    <span>⚡ Cerebras (Ultra-Fast)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => update('provider', 'openrouter')}
                                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                                        !isCerebras
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                            : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>OpenRouter (Free)</span>
                                </button>
                            </div>
                        </div>

                        {/* Cerebras Showcase Section */}
                        {isCerebras ? (
                            <div className="space-y-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-400" />
                                        <span className="text-sm font-bold text-amber-300">Cerebras Cloud API Key</span>
                                    </div>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-bold border border-amber-400/20">
                                        SHOWCASE READY
                                    </span>
                                </div>

                                <input
                                    type="password"
                                    value={settings.cerebrasApiKey}
                                    onChange={e => update('cerebrasApiKey', e.target.value)}
                                    placeholder="csk-..."
                                    className="w-full px-4 py-2.5 bg-zinc-950 border border-amber-500/30 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-sm font-mono"
                                />

                                <div className="flex items-center justify-between text-xs text-zinc-400">
                                    <span>Fastest AI on earth: ~2,000 tokens/sec</span>
                                    <a
                                        href="https://cloud.cerebras.ai"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-amber-400 hover:underline font-mono"
                                    >
                                        cloud.cerebras.ai ↗
                                    </a>
                                </div>

                                {/* Cerebras Model Selection */}
                                <div>
                                    <label className="text-xs font-medium text-zinc-300 mb-2 block">
                                        Cerebras Model
                                    </label>
                                    <div className="space-y-2">
                                        {CEREBRAS_MODELS.map(model => (
                                            <button
                                                key={model.id}
                                                type="button"
                                                onClick={() => update('cerebrasModel', model.id)}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                                                    settings.cerebrasModel === model.id
                                                        ? 'border-amber-500 bg-amber-500/15'
                                                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                                                }`}
                                            >
                                                <div className="text-left">
                                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                                        {model.name}
                                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                                            {model.badge}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-zinc-400">
                                                        {model.speed} • {model.best}
                                                    </div>
                                                </div>
                                                {settings.cerebrasModel === model.id && (
                                                    <Check className="w-4 h-4 text-amber-400" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* OpenRouter Section */
                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                                        <Key className="w-4 h-4 text-purple-400" />
                                        OpenRouter API Key
                                        <span className="text-xs text-zinc-600">(optional)</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={settings.apiKey}
                                        onChange={e => update('apiKey', e.target.value)}
                                        placeholder="sk-or-v1-..."
                                        className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 text-sm font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                                        <Sparkles className="w-4 h-4 text-cyan-400" />
                                        Free Tier Model
                                    </label>
                                    <div className="space-y-2">
                                        {FREE_MODELS.map(model => (
                                            <button
                                                key={model.id}
                                                type="button"
                                                onClick={() => update('preferredModel', model.id)}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                                                    settings.preferredModel === model.id
                                                        ? 'border-purple-500 bg-purple-500/10'
                                                        : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'
                                                }`}
                                            >
                                                <div className="text-left">
                                                    <div className="text-sm font-medium text-white">{model.name}</div>
                                                    <div className="text-xs text-zinc-500">{model.ctx} context • {model.best}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-500/20 text-green-400">FREE</span>
                                                    {settings.preferredModel === model.id && (
                                                        <Check className="w-4 h-4 text-purple-400" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Feature Toggles */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setExpanded(!expanded)}
                                className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3"
                            >
                                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                <Settings2 className="w-4 h-4 text-zinc-400" />
                                AI Features
                            </button>

                            <AnimatePresence>
                                {expanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        {AI_FEATURES.map(({ key, label, desc, icon: Icon }) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => toggleFeature(key)}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all"
                                            >
                                                <Icon className={`w-4 h-4 ${settings.features[key] ? (isCerebras ? 'text-amber-400' : 'text-purple-400') : 'text-zinc-600'}`} />
                                                <div className="flex-1 text-left">
                                                    <div className="text-sm font-medium text-white">{label}</div>
                                                    <div className="text-xs text-zinc-500">{desc}</div>
                                                </div>
                                                <div className={`w-10 h-6 rounded-full flex items-center transition-all ${
                                                    settings.features[key] ? (isCerebras ? 'bg-amber-500 justify-end' : 'bg-purple-500 justify-end') : 'bg-zinc-700 justify-start'
                                                }`}>
                                                    <div className="w-5 h-5 rounded-full bg-white mx-0.5 shadow-sm" />
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Save Button */}
                        <button
                            type="button"
                            onClick={handleSave}
                            className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                isCerebras
                                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                            }`}
                        >
                            {saved ? (
                                <><Check className="w-4 h-4" /> Saved & Activated!</>
                            ) : (
                                <><Zap className="w-4 h-4 fill-current" /> Save & Activate {isCerebras ? 'Cerebras' : 'AI'}</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Helper to load AI settings anywhere
export function getAISettings() {
    return loadSettings();
}
