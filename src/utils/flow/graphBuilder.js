/**
 * Builds a dependency graph from the flow definition.
 */
export function buildDependencyGraph(flow, agents) {
    const graph = new Map();
    
    agents.forEach(agent => {
        graph.set(agent.id, {
            id: agent.id,
            dependencies: [],
            dependents: [],
            executed: false,
        });
    });
    
    flow.forEach(connection => {
        const { from, to } = connection;
        
        if (from === 'start') {
            if (Array.isArray(to)) {
                to.forEach(agentId => {
                    if (graph.has(agentId)) {
                        graph.get(agentId).dependencies.push('start');
                    }
                });
            } else if (to !== 'end' && graph.has(to)) {
                graph.get(to).dependencies.push('start');
            }
        } else if (to === 'end') {
            if (Array.isArray(from)) {
                from.forEach(agentId => {
                    if (graph.has(agentId)) {
                        graph.get(agentId).dependents.push('end');
                    }
                });
            } else if (from !== 'start' && graph.has(from)) {
                graph.get(from).dependents.push('end');
            }
        } else {
            const fromAgents = Array.isArray(from) ? from : [from];
            const toAgents = Array.isArray(to) ? to : [to];
            
            fromAgents.forEach(fromId => {
                if (graph.has(fromId)) {
                    toAgents.forEach(toId => {
                        if (graph.has(toId)) {
                            graph.get(toId).dependencies.push(fromId);
                            graph.get(fromId).dependents.push(toId);
                        }
                    });
                }
            });
        }
    });
    
    return graph;
}
