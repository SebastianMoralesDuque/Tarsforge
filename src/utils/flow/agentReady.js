/**
 * Finds agents that are ready to execute (all dependencies met).
 */
export function findReadyAgents(graph, executedAgents, pendingAgents) {
    const ready = [];
    
    for (const agentId of pendingAgents) {
        const node = graph.get(agentId);
        if (!node) continue;
        
        const allDepsMet = node.dependencies.every(dep => 
            dep === 'start' || executedAgents.has(dep)
        );
        
        if (allDepsMet) {
            ready.push(agentId);
        }
    }
    
    return ready;
}
