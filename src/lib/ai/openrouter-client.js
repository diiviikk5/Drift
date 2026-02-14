/**
 * OpenRouter AI Client for Drift
 * Handles all AI API calls using free OpenRouter models
 * Supports BYOK (Bring Your Own Key) with free tier models
 */

import { aiCompletion, isTauri } from '../tauri-bridge';

// ============================================================
// FREE MODEL REGISTRY
// ============================================================

export const FREE_MODELS = {
    // Best for structured JSON output, reasoning tasks (zoom analysis, scene detection)
    REASONING: 'stepfun/step-3.5-flash:free',

    // Best for agentic tasks, tool use, instruction following (NL editing)
    AGENTIC: 'arcee-ai/trinity-large-preview:free',

    // Good reasoning model, fast (caption cleanup, general tasks)
    FAST_REASONING: 'openrouter/aurora-alpha',

    // Lightweight model for simple tasks (label generation, quick parsing)
    LIGHTWEIGHT: 'liquid/lfm-2.5-1.2b-instruct:free',
};

// Model fallback chains — if primary is down, try alternatives
const FALLBACK_CHAINS = {
    reasoning: [FREE_MODELS.REASONING, FREE_MODELS.AGENTIC, FREE_MODELS.FAST_REASONING],
    creative: [FREE_MODELS.AGENTIC, FREE_MODELS.FAST_REASONING, FREE_MODELS.REASONING],
    fast: [FREE_MODELS.FAST_REASONING, FREE_MODELS.LIGHTWEIGHT, FREE_MODELS.REASONING],
    lightweight: [FREE_MODELS.LIGHTWEIGHT, FREE_MODELS.FAST_REASONING],
};

// ============================================================
// AI CLIENT CLASS
// ============================================================

export class OpenRouterClient {
    constructor(options = {}) {
        this.apiKey = options.apiKey || '';
        this.defaultModel = options.model || FREE_MODELS.REASONING;
        this.maxRetries = options.maxRetries || 3;
        this.retryDelay = options.retryDelay || 1000;

        // Rate limiting
        this._lastRequestTime = 0;
        this._minRequestInterval = 500; // ms between requests for free tier

        // Cache recent responses
        this._cache = new Map();
        this._cacheMaxSize = 50;
        this._cacheTTL = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Set the API key
     */
    setApiKey(key) {
        this.apiKey = key;
        this._cache.clear();
    }

    /**
     * Get the API key from storage
     */
    getApiKey() {
        if (this.apiKey) return this.apiKey;

        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('drift_openrouter_key') || '';
            if (stored) return stored;

            // Also check drift-ai-settings (used by AISettings panel)
            try {
                const settings = JSON.parse(localStorage.getItem('drift-ai-settings') || '{}');
                if (settings.apiKey) return settings.apiKey;
            } catch { /* ignore */ }
        }

        // Fallback to env var (set in .env.local)
        return process.env.NEXT_PUBLIC_OPENROUTER_KEY || '';
    }

    /**
     * Save API key to storage
     */
    saveApiKey(key) {
        this.apiKey = key;
        if (typeof window !== 'undefined') {
            localStorage.setItem('drift_openrouter_key', key);
        }
    }

    /**
     * Check if the client has a valid API key
     */
    hasApiKey() {
        return !!this.getApiKey();
    }

    /**
     * Core completion method with retry logic and fallback
     */
    async complete({ messages, model, taskType, maxTokens, temperature, useCache = true }) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('No OpenRouter API key configured. Add your free key in Settings → AI.');
        }

        // Determine model with fallback chain
        const modelChain = taskType
            ? (FALLBACK_CHAINS[taskType] || [model || this.defaultModel])
            : [model || this.defaultModel];

        // Check cache
        const cacheKey = JSON.stringify({ messages, model: modelChain[0] });
        if (useCache) {
            const cached = this._getFromCache(cacheKey);
            if (cached) return cached;
        }

        // Rate limit
        await this._rateLimit();

        // Try each model in the fallback chain
        let lastError = null;
        for (const tryModel of modelChain) {
            for (let attempt = 0; attempt < this.maxRetries; attempt++) {
                try {
                    const result = await aiCompletion({
                        apiKey,
                        model: tryModel,
                        messages,
                        maxTokens: maxTokens || 4096,
                        temperature: temperature ?? 0.7,
                    });

                    const content = result?.choices?.[0]?.message?.content;
                    if (!content) {
                        throw new Error('Empty response from AI model');
                    }

                    // Cache the result
                    if (useCache) {
                        this._addToCache(cacheKey, content);
                    }

                    return content;
                } catch (error) {
                    lastError = error;
                    const errorMsg = error.message || '';

                    // Rate limited — wait and retry
                    if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
                        await this._wait(this.retryDelay * (attempt + 1) * 2);
                        continue;
                    }

                    // Model unavailable — try next in chain
                    if (errorMsg.includes('503') || errorMsg.includes('502') || errorMsg.includes('unavailable')) {
                        break; // Move to next model
                    }

                    // Auth error — don't retry
                    if (errorMsg.includes('401') || errorMsg.includes('403')) {
                        throw new Error('Invalid API key. Check your OpenRouter key in Settings → AI.');
                    }

                    // Other error — retry with backoff
                    if (attempt < this.maxRetries - 1) {
                        await this._wait(this.retryDelay * (attempt + 1));
                    }
                }
            }
        }

        throw lastError || new Error('All AI models failed. Try again later.');
    }

    /**
     * Structured JSON completion — parses the response as JSON
     */
    async completeJSON({ messages, model, taskType, maxTokens, temperature }) {
        // Add JSON instruction to the system message
        const jsonMessages = [...messages];
        const lastMsg = jsonMessages[jsonMessages.length - 1];
        if (lastMsg) {
            jsonMessages[jsonMessages.length - 1] = {
                ...lastMsg,
                content: lastMsg.content + '\n\nRespond ONLY with valid JSON. No markdown, no explanation, no code fences.',
            };
        }

        const content = await this.complete({
            messages: jsonMessages,
            model,
            taskType: taskType || 'reasoning',
            maxTokens,
            temperature: temperature ?? 0.3, // Lower temp for structured output
            useCache: true,
        });

        // Parse JSON — handle common formatting issues
        try {
            // Try direct parse first
            return JSON.parse(content);
        } catch {
            // Try extracting JSON from markdown code block
            const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1].trim());
            }

            // Try finding JSON array or object
            const arrayMatch = content.match(/\[[\s\S]*\]/);
            const objMatch = content.match(/\{[\s\S]*\}/);
            const match = arrayMatch || objMatch;
            if (match) {
                return JSON.parse(match[0]);
            }

            throw new Error('Failed to parse AI response as JSON');
        }
    }

    /**
     * Rate limiting helper
     */
    async _rateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this._lastRequestTime;
        if (timeSinceLastRequest < this._minRequestInterval) {
            await this._wait(this._minRequestInterval - timeSinceLastRequest);
        }
        this._lastRequestTime = Date.now();
    }

    /**
     * Wait helper
     */
    _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Cache helpers
     */
    _getFromCache(key) {
        const entry = this._cache.get(key);
        if (!entry) return null;
        if (Date.now() - entry.time > this._cacheTTL) {
            this._cache.delete(key);
            return null;
        }
        return entry.value;
    }

    _addToCache(key, value) {
        if (this._cache.size >= this._cacheMaxSize) {
            // Remove oldest entry
            const firstKey = this._cache.keys().next().value;
            this._cache.delete(firstKey);
        }
        this._cache.set(key, { value, time: Date.now() });
    }
}

// Singleton instance
let clientInstance = null;

export function getAIClient() {
    if (!clientInstance) {
        clientInstance = new OpenRouterClient();
    }
    return clientInstance;
}

export default OpenRouterClient;
