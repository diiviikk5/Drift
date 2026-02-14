'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Key, Zap, Eye, MessageSquare, Scissors, Image, Type,
    ChevronDown, ChevronRight, Check, AlertCircle, Sparkles, Settings2
} from 'lucide-react';

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
        if (raw) return { ...getDefaults(), ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return getDefaults();
}

function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
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
                                <h2 className="text-lg font-bold text-white">AI Settings</h2>
                                <p className="text-xs text-zinc-500">Configure AI features & models</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-xl">✕</button>
                    </div>

                    <div className="p-5 space-y-6">
                        {/* API Key */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                                <Key className="w-4 h-4 text-amber-400" />
                                OpenRouter API Key
                                <span className="text-xs text-zinc-600">(optional — free models work without)</span>
                            </label>
                            <input
                                type="password"
                                value={settings.apiKey}
                                onChange={e => update('apiKey', e.target.value)}
                                placeholder="sk-or-v1-..."
                                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 text-sm font-mono"
                            />
                            <p className="mt-1.5 text-xs text-zinc-600">
                                Bring your own key for faster responses & more models. Free models have rate limits.
                            </p>
                        </div>

                        {/* Model Selection */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                Preferred Model
                            </label>
                            <div className="space-y-2">
                                {FREE_MODELS.map(model => (
                                    <button
                                        key={model.id}
                                        onClick={() => update('preferredModel', model.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                                            settings.preferredModel === model.id
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'
                                        }`}
                                    >
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-white">{model.name}</div>
                                            <div className="text-xs text-zinc-500">{model.ctx} context • Best for {model.best}</div>
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

                        {/* Feature Toggles */}
                        <div>
                            <button
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
                                                onClick={() => toggleFeature(key)}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all"
                                            >
                                                <Icon className={`w-4 h-4 ${settings.features[key] ? 'text-purple-400' : 'text-zinc-600'}`} />
                                                <div className="flex-1 text-left">
                                                    <div className="text-sm font-medium text-white">{label}</div>
                                                    <div className="text-xs text-zinc-500">{desc}</div>
                                                </div>
                                                <div className={`w-10 h-6 rounded-full flex items-center transition-all ${
                                                    settings.features[key] ? 'bg-purple-500 justify-end' : 'bg-zinc-700 justify-start'
                                                }`}>
                                                    <div className="w-5 h-5 rounded-full bg-white mx-0.5 shadow-sm" />
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Save */}
                        <button
                            onClick={handleSave}
                            className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2"
                        >
                            {saved ? (
                                <><Check className="w-4 h-4" /> Saved!</>
                            ) : (
                                <><Sparkles className="w-4 h-4" /> Save Settings</>
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
