/**
 * Groups ready agents by execution type based on flow.
 */
export function groupByExecutionType(readyAgents, flow) {
    const groups = [];
    const processed = new Set();
    
    for (const agentId of readyAgents) {
        if (processed.has(agentId)) continue;
        
        const incomingConnections = flow.filter(conn => {
            const targets = Array.isArray(conn.to) ? conn.to : [conn.to];
            return targets.includes(agentId);
        });
        
        const parallelSiblings = [];
        for (const conn of incomingConnections) {
            if (conn.type === 'parallel' && Array.isArray(conn.to)) {
                conn.to.forEach(targetId => {
                    if (readyAgents.includes(targetId) && !processed.has(targetId)) {
                        parallelSiblings.push(targetId);
                    }
                });
            }
        }
        
        if (parallelSiblings.length > 1) {
            groups.push({
                type: 'parallel',
                agents: parallelSiblings,
            });
            parallelSiblings.forEach(id => processed.add(id));
        } else {
            groups.push({
                type: 'sequential',
                agents: [agentId],
            });
            processed.add(agentId);
        }
    }
    
    return groups;
}
