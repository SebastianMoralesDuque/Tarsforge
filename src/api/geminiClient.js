import { GEMINI_MODEL } from '../constants/agents';
import { fetchWithRetry, GEMINI_BASE_URL } from './apiHelpers';

/**
 * Calls Gemini API for content generation.
 * Supports JSON mode for structured responses.
 */
export async function callGemini(apiKey, systemPrompt, userMessage, isJSON = false) {
    const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const generationConfig = isJSON
        ? { temperature: 0.2, maxOutputTokens: 65536, responseMimeType: 'application/json' }
        : { temperature: 0.75, maxOutputTokens: 65536 };

    const body = {
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig,
    };

    const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        console.error(`Gemini API Error details:`, errorText);
        throw new Error(`Gemini API Error: ${res.status}`);
    }
    const data = await res.json();
    const rawResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const usageMetadata = data?.usageMetadata || null;

    console.log(`[CALL_GEMINI SUCCESS] Sistema: ${systemPrompt.split('\n')[0].substring(0, 50)}...`, {
        prompt_length: systemPrompt.length + userMessage.length,
        response_length: rawResponse.length,
        response_preview: rawResponse.substring(0, 200) + '...',
        full_response: rawResponse,
        usage_metadata: usageMetadata
    });

    return rawResponse;
}

/**
 * Streams content from Gemini API using SSE.
 * Calls onChunk for each piece of text received.
 * Returns { text, usageMetadata }
 */
export async function streamGemini(apiKey, systemPrompt, userMessage, onChunk, isJSON = false) {
    const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;
    const generationConfig = isJSON
        ? { temperature: 0.2, maxOutputTokens: 65536, responseMimeType: 'application/json' }
        : { temperature: 0.75, maxOutputTokens: 65536 };

    const body = {
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig,
    };

    const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Gemini Stream Error: ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';
    let usageMetadata = null;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const json = JSON.parse(line.slice(6));
                    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    if (text) {
                        fullText += text;
                        onChunk?.(text, fullText);
                    }
                    if (json.usageMetadata) {
                        usageMetadata = json.usageMetadata;
                    }
                } catch { /* ignore */ }
            }
        }
    }

    // Final buffer check
    if (buffer.startsWith('data: ')) {
        try {
            const json = JSON.parse(buffer.slice(6));
            const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (text) {
                fullText += text;
                onChunk?.(text, fullText);
            }
            if (json.usageMetadata) {
                usageMetadata = json.usageMetadata;
            }
        } catch { /* ignore */ }
    }

    console.log(`[STREAM_GEMINI FINISHED] Sistema: ${systemPrompt.split('\n')[0].substring(0, 50)}...`, {
        total_length: fullText.length,
        preview_end: fullText.slice(-100),
        full_response: fullText,
        usage_metadata: usageMetadata
    });

    return fullText;
}
