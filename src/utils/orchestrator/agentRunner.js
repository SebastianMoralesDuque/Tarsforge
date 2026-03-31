import { sanitizeStreamText } from './streamSanitizer';
import { downloadTextFile, getTimestamp, formatAIResponseLog } from '../../utils/downloadLog';

export async function runAgentWithRetry({
    agent,
    runIndex,
    streamAgent,
    updateAgent,
    retries = 3
}, onComplete, userMessage) {
    let lastError = new Error('Agente falló sin error conocido');

    for (let attempt = 0; attempt <= retries; attempt++) {
        updateAgent(runIndex, agent.id, { state: 'working', progress: 5 + (attempt * 5) });

        try {
            const result = await streamAgent(
                agent.systemPrompt,
                userMessage,
                (chunk, full) => {
                    const role = agent.role || agent.specialty || 'default';
                    updateAgent(runIndex, agent.id, {
                        streamText: sanitizeStreamText(full, role),
                        progress: Math.min(95, 10 + (attempt * 10) + full.length / 50),
                    });
                }
            );

            const fullText = typeof result === 'string' ? result : result.text;
            const usageMetadata = typeof result === 'object' ? result.usageMetadata : null;

            updateAgent(runIndex, agent.id, {
                state: 'done',
                progress: 100,
                streamText: sanitizeStreamText(fullText.slice(0, 120), agent.role || agent.specialty || 'default'),
            });

            downloadAIResponseLog(agent, userMessage, fullText, usageMetadata);

            return onComplete(result);
        } catch (err) {
            lastError = err;

            if (attempt < retries) {
                updateAgent(runIndex, agent.id, {
                    streamText: 'Reintentando conexión...',
                });
            }
        }
    }

    updateAgent(runIndex, agent.id, {
        state: 'error',
        streamText: 'Error temporal. Por favor intenta de nuevo.',
        progress: 0,
    });
    throw lastError;
}

function downloadAIResponseLog(agent, userMessage, fullResponse, usageMetadata) {
    try {
        const log = formatAIResponseLog({
            agentName: agent?.name || 'unknown',
            agentRole: agent?.role || agent?.specialty || 'unknown',
            systemPrompt: agent?.systemPrompt || '',
            userMessage: userMessage || '',
            fullResponse: typeof fullResponse === 'object' ? JSON.stringify(fullResponse, null, 2) : (fullResponse || ''),
            usageMetadata,
            model: agent?.model || 'unknown',
            apiProvider: agent?.apiProvider || 'unknown',
            timestamp: getTimestamp()
        });
        
        const filename = `tarsforge-${(agent?.role || agent?.id || 'agent').replace(/\s+/g, '-')}-${getTimestamp()}.txt`;
        
        downloadTextFile(log, filename);
    } catch {
        // Download failed silently
    }
}