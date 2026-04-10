import { fetchWithRetry } from './apiHelpers';

/**
 * Calls OpenAI-compatible API (LOCAL ONLY).
 */
export async function callOpenAI(apiKey, systemPrompt, userMessage, isJSON = false, modelOverride = null, model2 = false) {
    const baseUrl = import.meta.env.VITE_MODAL_BASE_URL || '/api/ollama/';
    const envModel = model2 ? import.meta.env.VITE_MODAL_MODEL2 : import.meta.env.VITE_MODAL_MODEL;
    const model = modelOverride || envModel || 'nemotron-3-super:cloud';
    const url = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}chat/completions`;

    const body = buildRequestBody(systemPrompt, userMessage, isJSON, model);

    const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(apiKey && apiKey !== 'ollama' ? { 'Authorization': `Bearer ${apiKey}` } : {})
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`OpenAI-compatible API Error: ${res.status}`);
    const data = await res.json();
    const rawResponse = data?.choices?.[0]?.message?.content || '';

    return rawResponse;
}

/**
 * Streaming version (LOCAL ONLY).
 */
export async function streamOpenAI(apiKey, systemPrompt, userMessage, onChunk, isJSON = false, modelOverride = null, model2 = false) {
    const baseUrl = import.meta.env.VITE_MODAL_BASE_URL || '/api/ollama/';
    const envModel = model2 ? import.meta.env.VITE_MODAL_MODEL2 : import.meta.env.VITE_MODAL_MODEL;
    const model = modelOverride || envModel || 'nemotron-3-super:cloud';
    const url = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}chat/completions`;

    const body = buildRequestBody(systemPrompt, userMessage, isJSON, model, true);

    const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(apiKey && apiKey !== 'ollama' ? { 'Authorization': `Bearer ${apiKey}` } : {})
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`OpenAI-compatible Stream Error: ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            const cleanLine = line.trim();
            if (!cleanLine || cleanLine === 'data: [DONE]') continue;

            let json = null;
            let text = '';

            if (cleanLine.startsWith('data: ')) {
                try {
                    json = JSON.parse(cleanLine.slice(6));
                } catch { /* ignore */ }
            } else {
                try {
                    json = JSON.parse(cleanLine);
                } catch { /* ignore */ }
            }

            if (json) {
                text = json?.choices?.[0]?.delta?.content || '';
                if (!text) text = json?.message?.content || '';
            }

            if (text) {
                fullText += text;
                onChunk?.(text, fullText);
            }
        }
    }

    return fullText;
}

/**
 * Builds request body
 */
function buildRequestBody(systemPrompt, userMessage, isJSON, model, stream = false) {
    const body = {
        model,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ],
        temperature: isJSON ? 0.2 : 0.75,
        max_tokens: getMaxTokens(systemPrompt),
    };

    if (isJSON) body.response_format = { type: 'json_object' };
    if (stream) body.stream = true;

    return body;
}

function getMaxTokens(systemPrompt) {
    return systemPrompt.includes('Agente Builder') ? 65536 : 4096;
}