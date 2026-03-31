/**
 * Checks for feedback loops that need re-execution.
 */
export function checkFeedbackLoops(flow, executedAgents, agentMap) {
    const feedbackAgents = [];
    
    flow.forEach(connection => {
        if (connection.type === 'feedback') {
            const fromAgents = Array.isArray(connection.from) ? connection.from : [connection.from];
            const toAgents = Array.isArray(connection.to) ? connection.to : [connection.to];
            
            const allFromExecuted = fromAgents.every(id => executedAgents.has(id));
            
            if (allFromExecuted) {
                toAgents.forEach(agentId => {
                    if (agentMap.has(agentId) && !feedbackAgents.includes(agentId)) {
                        feedbackAgents.push(agentId);
                    }
                });
            }
        }
    });
    
    return feedbackAgents;
}
