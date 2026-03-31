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
                    console.log(`[AGENT STREAM CHUNK] ${agent.name}:`, { chunk, fullLength: full.length });
                    const role = agent.role || agent.specialty || 'default';
                    updateAgent(runIndex, agent.id, {
                        streamText: sanitizeStreamText(full, role),
                        progress: Math.min(95, 10 + (attempt * 10) + full.length / 50),
                    });
                }
            );

            const fullText = typeof result === 'string' ? result : result.text;
            const usageMetadata = typeof result === 'object' ? result.usageMetadata : null;
            console.log(`[AGENT FINAL RESPONSE] ${agent.name} (${agent.role}):`, fullText);
            console.log(`[AGENT TOKEN USAGE] ${agent.name}:`, usageMetadata);

            updateAgent(runIndex, agent.id, {
                state: 'done',
                progress: 100,
                streamText: sanitizeStreamText(fullText.slice(0, 120), agent.role || agent.specialty || 'default'),
            });

            downloadAIResponseLog(agent, userMessage, fullText, usageMetadata);

            return onComplete(result);
        } catch (err) {
            lastError = err;
            console.warn(`Agent ${agent.name} attempt ${attempt + 1} failed:`, err.message);

            if (attempt < retries) {
                updateAgent(runIndex, agent.id, {
                    streamText: 'Reintentando conexión...',
                });
                console.log(`[ORCHESTRATOR] Reintentando para ${agent.name}... (Intento ${attempt + 1}/${retries})`);
            }
        }
    }

    console.error(`Agent ${agent.name} finally failed:`, lastError);
    updateAgent(runIndex, agent.id, {
        state: 'error',
        streamText: 'Error temporal. Por favor intenta de nuevo.',
        progress: 0,
    });
    throw lastError;
}

function downloadAIResponseLog(agent, userMessage, fullResponse, usageMetadata) {
    try {
        console.log('[DOWNLOAD] Attempting to download log for agent:', agent?.name, agent?.role);
        
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
        
        console.log('[DOWNLOAD] Log content length:', log.length);
        
        const filename = `tarsforge-${(agent?.role || agent?.id || 'agent').replace(/\s+/g, '-')}-${getTimestamp()}.txt`;
        console.log('[DOWNLOAD] Filename:', filename);
        
        downloadTextFile(log, filename);
        console.log('[DOWNLOAD] Success - file should download');
    } catch (err) {
        console.error('[DOWNLOAD] Failed to download response log:', err);
        console.error('[DOWNLOAD] Stack:', err.stack);
    }
}