import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { waitForDelay, updateLastRequestTime } from '../api/apiHelpers';
import { callGemini, streamGemini } from '../api/geminiClient';
import { callOpenAI, streamOpenAI } from '../api/openaiClient';

function tryParse(text) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function extractPartialJSON(text) {
    const result = {};

    const agentsMatch = text.match(/"agents":\s*\[(\[[\s\S]*?\]\])\]/);
    if (agentsMatch) {
        try {
            result.agents = JSON.parse('[' + agentsMatch[1] + ']');
        } catch {
            const singleAgentMatch = text.match(/"agents":\s*\[([\s\S]*?)\n\s*\]/);
            if (singleAgentMatch) {
                try {
                    result.agents = JSON.parse('[' + singleAgentMatch[1] + ']');
                } catch { /* ignore */ }
            }
        }
    }

    const sectionsMatch = text.match(/"sections":\s*\[([\s\S]*?)\n\s*\]/);
    if (sectionsMatch) {
        try {
            result.sections = JSON.parse('[' + sectionsMatch[1] + ']');
        } catch { /* ignore */ }
    }

    return Object.keys(result).length > 0 ? result : null;
}


function fixArrayAsObject(text) {
    let fixed = text;
    let iterations = 0;
    while (iterations < 10) {
        let changed = false;
        const positions = [];
        const regex = /\[\s*"([^"]+)"\s*:/g;
        let m;
        while ((m = regex.exec(fixed)) !== null) {
            positions.push(m.index);
        }
        for (let p = positions.length - 1; p >= 0; p--) {
            const openIdx = positions[p];
            let depth = 0, inStr = false, escape = false;
            let closeIdx = -1;
            for (let i = openIdx; i < fixed.length; i++) {
                const c = fixed[i];
                if (escape) { escape = false; continue; }
                if (c === '\\') { escape = true; continue; }
                if (c === '"' && !escape) { inStr = !inStr; continue; }
                if (inStr) continue;
                if (c === '[' || c === '{') depth++;
                else if (c === ']' || c === '}') { depth--; if (depth === 0) { closeIdx = i; break; } }
            }
            if (closeIdx > 0) {
                const inner = fixed.substring(openIdx + 1, closeIdx);
                const kvCount = (inner.match(/"[^"]+"\s*:/g) || []).length;
                if (kvCount >= 2 && /^\s*"[^"]+"\s*:/.test(inner)) {
                    fixed = fixed.substring(0, openIdx) + '{' + inner + '}' + fixed.substring(closeIdx + 1);
                    changed = true;
                    break;
                }
            }
        }
        if (!changed) break;
        iterations++;
    }
    return fixed;
}

function fixMalformedJSON(text) {
    let fixed = text;

    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

    fixed = fixed.replace(/\[\s*\{\s*"([^"]+)"\s*\}\s*\]/g, '["$1"]');

    fixed = fixed.replace(/\{\s*"(?!"[\w-]+":)([^"]+)"\s*\}/g, '"$1"');

    const flowArrayFix = (str) => str.replace(/\[(\s*)\{\s*"(\w+)":\s*\[/g, '[$1[');

    let prev = '';
    let iterations = 0;
    while (prev !== fixed && iterations < 10) {
        prev = fixed;
        fixed = flowArrayFix(fixed);
        iterations++;
    }

    // Fix arrays that should be objects ["key":value, "key2":value2] -> {"key":value, "key2":value2}
    // MUST run BEFORE bracket balancing so counts are correct
    fixed = fixArrayAsObject(fixed);

    iterations = 0;
    while (iterations < 15) {
        const before = fixed;
        const ob = (fixed.match(/\{/g) || []).length;
        const cb = (fixed.match(/\}/g) || []).length;
        if (cb > ob) fixed = fixed.replace(/}(?=[^}]*$)/, '');
        const obr = (fixed.match(/\[/g) || []).length;
        const cbr = (fixed.match(/\]/g) || []).length;
        if (cbr > obr) fixed = fixed.replace(/](?=[^\]]*$)/, '');
        if (fixed === before) break;
        iterations++;
    }

    const flowObjMatch = fixed.match(/"flow":\s*\{/);
    if (flowObjMatch) {
        try {
            const startIdx = fixed.indexOf('"flow":');
            const openBraceIdx = fixed.indexOf('{', startIdx);
            let depth = 0, inStr = false, escape = false;
            let endIdx = -1;

            for (let i = openBraceIdx; i < fixed.length; i++) {
                const c = fixed[i];
                if (escape) { escape = false; continue; }
                if (c === '\\') { escape = true; continue; }
                if (c === '"' && !escape) { inStr = !inStr; continue; }
                if (inStr) continue;
                if (c === '{') depth++;
                else if (c === '}') { depth--; if (depth === 0) { endIdx = i; break; } }
            }

            if (endIdx > 0) {
                const flowObjStr = fixed.substring(openBraceIdx, endIdx + 1);
                const flowParsed = JSON.parse(flowObjStr);

                if (typeof flowParsed === 'object' && !Array.isArray(flowParsed)) {
                    const flowArray = [];
                    const validTypes = ['sequential', 'parallel', 'merge', 'conditional', 'feedback'];

                    for (const [key, value] of Object.entries(flowParsed)) {
                        if (validTypes.includes(key)) {
                            if (Array.isArray(value)) {
                                flowArray.push(...value.map(v => ({ type: key, to: v })));
                            } else {
                                flowArray.push({ type: key, to: value });
                            }
                        }
                    }

                    if (flowArray.length > 0) {
                        fixed = fixed.substring(0, openBraceIdx) +
                            JSON.stringify(flowArray) +
                            fixed.substring(endIdx + 1);
                    }
                }
            }
        } catch {
            // Flow conversion failed
        }
    }

    return fixed;
}

function parseJSON(text) {
    if (!text || typeof text !== 'string') {
        console.error('[parseJSON] Invalid input:', { type: typeof text, length: text?.length });
        return null;
    }

    try {
        // Pre-fix: if text contains JSON keys but is missing opening {, wrap it
        let preprocessed = text;
        if (/"agents"\s*:/.test(text) && !/^\s*\{/.test(text.trim()) && /\}\s*$/.test(text.trim())) {
            preprocessed = '{' + text.trim();
        }

        const fencedMatch = preprocessed.match(/```json\s*([\s\S]*?)```/);
        if (fencedMatch) {
            const parsed = tryParse(fencedMatch[1].trim());
            if (parsed) return parsed;
        }

        const bracketMatch = preprocessed.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (bracketMatch) {
            const parsed = tryParse(bracketMatch[1].trim());
            if (parsed) return parsed;

            const fixed = fixMalformedJSON(bracketMatch[1]);
            const fixedParsed = tryParse(fixed.trim());
            if (fixedParsed) return fixedParsed;

            const partial = extractPartialJSON(bracketMatch[1]);
            if (partial) return partial;
        }

        return tryParse(preprocessed.trim());
    } catch (err) {
        console.error('[parseJSON] Parse error:', err.message);
        return null;
    }
}

export function useGeminiAPI() {
    const { activeApi, apiKey: storageApiKey } = useApp();

    const getApiKey = useCallback(() => {
        if (activeApi === 'modal') {
            const envKey = import.meta.env.VITE_MODAL_API_KEY;
            return (envKey && envKey !== 'your_key_here') ? envKey : storageApiKey;
        } else {
            const envKey = import.meta.env.VITE_GEMINI_API_KEY;
            return (envKey && envKey !== 'your_key_here') ? envKey : storageApiKey;
        }
    }, [activeApi, storageApiKey]);

    const callAgent = useCallback(
        async (systemPrompt, userMessage, model = null) => {
            await waitForDelay();
            console.log(`${activeApi.toUpperCase()} API MODE: callAgent`, systemPrompt.slice(0, 50));
            const apiKey = getApiKey();
            const isMetaAgent = systemPrompt.toLowerCase().includes('arquitecto supremo') ||
                systemPrompt.toLowerCase().includes('meta-agent');

            let result;
            if (activeApi === 'modal') {
                result = await callOpenAI(apiKey, systemPrompt, userMessage, isMetaAgent, model);
            } else {
                result = await callGemini(apiKey, systemPrompt, userMessage, isMetaAgent);
            }
            updateLastRequestTime();
            return result;
        },
        [getApiKey, activeApi]
    );

    const callAgentJSON = useCallback(
        async (systemPrompt, userMessage, model = null) => {
            const text = await callAgent(systemPrompt, userMessage, model);
            return parseJSON(text);
        },
        [callAgent]
    );

    const streamAgent = useCallback(
        async (systemPrompt, userMessage, onChunk, isJSON = true, model = null) => {
            await waitForDelay();
            console.log(`${activeApi.toUpperCase()} API MODE: streamAgent`, systemPrompt.slice(0, 50));
            const apiKey = getApiKey();
            let result;
            if (activeApi === 'modal') {
                result = await streamOpenAI(apiKey, systemPrompt, userMessage, onChunk, isJSON, model);
            } else {
                result = await streamGemini(apiKey, systemPrompt, userMessage, onChunk, isJSON);
            }
            updateLastRequestTime();
            return result;
        },
        [getApiKey, activeApi]
    );

    return { callAgent, callAgentJSON, streamAgent };
}