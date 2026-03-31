/**
 * Downloads a text file automatically in the browser.
 */
export function downloadTextFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Formats a timestamp for filenames.
 */
export function getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

/**
 * Formats token usage information.
 */
export function formatTokenInfo(usageMetadata) {
    if (!usageMetadata) return 'Token info not available';
    
    return `
Token Usage:
- Prompt Tokens: ${usageMetadata.promptTokenCount || 'N/A'}
- Response Tokens: ${usageMetadata.candidatesTokenCount || usageMetadata.completionTokens || 'N/A'}
- Total Tokens: ${usageMetadata.totalTokenCount || 'N/A'}
`.trim();
}

/**
 * Formats a complete AI response log.
 */
export function formatAIResponseLog({
    agentName,
    agentRole,
    systemPrompt,
    userMessage,
    fullResponse,
    usageMetadata,
    model,
    apiProvider,
    timestamp
}) {
    return `
================================================================================
TARSFORGE - AI RESPONSE LOG
================================================================================
Timestamp: ${timestamp}
Agent: ${agentName} (${agentRole})
API Provider: ${apiProvider}
Model: ${model}

--------------------------------------------------------------------------------
SYSTEM PROMPT:
--------------------------------------------------------------------------------
${systemPrompt}

--------------------------------------------------------------------------------
USER MESSAGE:
--------------------------------------------------------------------------------
${userMessage}

--------------------------------------------------------------------------------
COMPLETE RESPONSE:
--------------------------------------------------------------------------------
${fullResponse}

--------------------------------------------------------------------------------
TOKEN USAGE:
--------------------------------------------------------------------------------
${formatTokenInfo(usageMetadata)}

================================================================================
END OF LOG
================================================================================
`;
}