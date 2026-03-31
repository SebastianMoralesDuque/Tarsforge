import { buildDependencyGraph } from './graphBuilder';
import { findReadyAgents } from './agentReady';
import { groupByExecutionType } from './agentGrouper';
import { checkFeedbackLoops } from './feedbackLoop';
import { executeSingleAgent } from './agentExecutor';

export async function executeFlowGraph({
    runIndex,
    runPlan,
    blueprint,
    activeSkills,
    assets,
    prompt,
    runAgent,
    updateRun,
}) {
    const { agents, flow } = runPlan;
    const agentMap = new Map(agents.map(a => [a.id, a]));
    
    const executedAgents = new Map();
    const pendingAgents = new Set(agents.map(a => a.id));
    
    const graph = buildDependencyGraph(flow, agents);
    
    let currentBlueprint = blueprint;
    let iteration = 0;
    const maxIterations = agents.length * 2;
    
    while (pendingAgents.size > 0 && iteration < maxIterations) {
        iteration++;
        
        const readyAgents = findReadyAgents(graph, executedAgents, pendingAgents);
        
        if (readyAgents.length === 0) {
            break;
        }
        
        const executionGroups = groupByExecutionType(readyAgents, flow);
        
        for (const group of executionGroups) {
            if (group.type === 'parallel') {
                for (const agentId of group.agents) {
                    const result = await executeSingleAgent({
                        agentId,
                        agentMap,
                        runIndex,
                        runPlan,
                        currentBlueprint,
                        activeSkills,
                        assets,
                        prompt,
                        runAgent,
                        updateRun,
                        executedAgents,
                        pendingAgents,
                    });
                    
                    if (result) {
                        currentBlueprint = result;
                    }
                }
            } else {
                for (const agentId of group.agents) {
                    const result = await executeSingleAgent({
                        agentId,
                        agentMap,
                        runIndex,
                        runPlan,
                        currentBlueprint,
                        activeSkills,
                        assets,
                        prompt,
                        runAgent,
                        updateRun,
                        executedAgents,
                        pendingAgents,
                    });
                    
                    if (result) {
                        currentBlueprint = result;
                    }
                }
            }
        }
        
        const feedbackAgents = checkFeedbackLoops(flow, executedAgents, agentMap);
        if (feedbackAgents.length > 0) {
            for (const agentId of feedbackAgents) {
                pendingAgents.add(agentId);
                executedAgents.delete(agentId);
            }
        }
    }
    
    return currentBlueprint;
}
