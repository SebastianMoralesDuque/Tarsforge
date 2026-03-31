import { fetchWithRetry } from './apiHelpers';

/**
 * Calls OpenAI-compatible API (LOCAL ONLY).
 */
export async function callOpenAI(apiKey, systemPrompt, userMessage, isJSON = false, modelOverride = null) {
    const baseUrl = import.meta.env.VITE_MODAL_BASE_URL || 'http://localhost:11434/v1/';
    const model = modelOverride || import.meta.env.VITE_MODAL_MODEL || 'nemotron-3-super:cloud';
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

    console.log(`[CALL_OPENAI SUCCESS] Sistema: ${systemPrompt.split('\n')[0].substring(0, 50)}...`, {
        prompt_length: systemPrompt.length + userMessage.length,
        response_length: rawResponse.length,
        response_preview: rawResponse.substring(0, 200) + '...',
        full_response: rawResponse
    });
    return rawResponse;
}

/**
 * Streaming version (LOCAL ONLY).
 */
export async function streamOpenAI(apiKey, systemPrompt, userMessage, onChunk, isJSON = false, modelOverride = null) {
    const baseUrl = import.meta.env.VITE_MODAL_BASE_URL || 'http://localhost:11434/v1/';
    const model = modelOverride || import.meta.env.VITE_MODAL_MODEL || 'nemotron-3-super:cloud';
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

            if (cleanLine.startsWith('data: ')) {
                try {
                    const json = JSON.parse(cleanLine.slice(6));
                    const text = json?.choices?.[0]?.delta?.content || '';

                    if (text) {
                        fullText += text;
                        onChunk?.(text, fullText);
                    }
                } catch { /* ignore streaming parse errors */ }
            }
        }
    }

    console.log(`[STREAM_OPENAI FINISHED] Sistema: ${systemPrompt.split('\n')[0].substring(0, 50)}...`, {
        total_length: fullText.length,
        preview_end: fullText.slice(-100),
        full_response: fullText
    });

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