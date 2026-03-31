/**
 * Converts a Meta-Agent flow array into positioned graph nodes and edges.
 * @param {Array} agents - Array of agent objects from the run JSON
 * @param {Array} flow - Array of flow edge objects {from, to, type}
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 */
export function computeGraphLayout(agents, flow, width = 800, height = 320) {
    // Spacing config
    const NODE_W = 340;
    const NODE_H = 220;
    const PADDING_X = 140;
    const PADDING_Y = 70;

    // Use Bellman-Ford to find highest depth (longest path) from 'start'
    // This allows graphs with diamond shapes and prevents infinite loops on cycles.
    const levelMap = {};
    agents.forEach(a => { levelMap[a.id] = 0; });

    const numAgents = agents.length;
    for (let i = 0; i < numAgents; i++) {
        let changed = false;
        flow.forEach((edge) => {
            if (edge.type === 'feedback' || edge.isFeedback) return; // Prevent cycle propagation

            const froms = Array.isArray(edge.from) ? edge.from : [edge.from];
            const tos = Array.isArray(edge.to) ? edge.to : [edge.to];

            froms.forEach(f => {
                const sourceLevel = f === 'start' ? -1 : (levelMap[f] ?? 0);
                tos.forEach(t => {
                    if (t === 'end' || levelMap[t] === undefined) return;
                    if (levelMap[t] < sourceLevel + 1) {
                        levelMap[t] = sourceLevel + 1;
                        changed = true;
                    }
                });
            });
        });
        if (!changed) break; // Terminate early if stabilized
    }

    // Group by level
    const byLevel = {};
    agents.forEach((agent) => {
        const level = levelMap[agent.id] ?? 0;
        if (!byLevel[level]) byLevel[level] = [];
        byLevel[level].push(agent.id);
    });

    const levels = Object.keys(byLevel)
        .map(Number)
        .sort((a, b) => a - b);
    
    // Auto-calculate required dimensions to avoid overlap
    const numLevels = levels.length;
    const maxNodesInLevel = Math.max(...levels.map(l => byLevel[l].length), 1);
    
    const requiredWidth = PADDING_X * 2 + numLevels * (NODE_W + 150);
    const requiredHeight = PADDING_Y * 2 + maxNodesInLevel * (NODE_H + 100);
    
    const actualWidth = Math.max(width, requiredWidth);
    const actualHeight = Math.max(height, requiredHeight);

    const colWidth = (actualWidth - PADDING_X * 2) / Math.max(numLevels, 1);

    const positions = {};

    levels.forEach((level, colIdx) => {
        const nodesInLevel = byLevel[level];
        const numNodes = nodesInLevel.length;
        nodesInLevel.forEach((agentId, rowIdx) => {
            const x = PADDING_X + colIdx * colWidth + colWidth / 2 - NODE_W / 2;
            // Space nodes evenly within the actualHeight
            const rowSpacing = (actualHeight - PADDING_Y * 2) / Math.max(numNodes, 1);
            const y = PADDING_Y + rowIdx * rowSpacing + rowSpacing / 2 - NODE_H / 2;
            positions[agentId] = { x, y, w: NODE_W, h: NODE_H };
        });
    });

    // Build edges
    const edges = [];
    flow.forEach((edge) => {
        if (edge.from === 'start' || edge.to === 'end') return;
        const froms = Array.isArray(edge.from) ? edge.from : [edge.from];
        const tos = Array.isArray(edge.to) ? edge.to : [edge.to];
        froms.forEach((f) => {
            tos.forEach((t) => {
                if (positions[f] && positions[t]) {
                    edges.push({
                        from: f,
                        to: t,
                        type: edge.type,
                        isFeedback: edge.type === 'feedback' || edge.isFeedback || (levelMap[f] >= levelMap[t]),
                    });
                }
            });
        });
    });

    return { positions, edges, nodeSize: { w: NODE_W, h: NODE_H } };
}

export function getEdgePath(fromPos, toPos, isFeedback = false) {
    const fx = fromPos.x + fromPos.w;
    const fy = fromPos.y + fromPos.h / 2;
    const tx = toPos.x;
    const ty = toPos.y + toPos.h / 2;

    if (isFeedback) {
        // Curve going backwards (left)
        const cx1 = fx + 40;
        const cy1 = fy - 60;
        const cx2 = tx - 40;
        const cy2 = ty - 60;
        return `M ${fx} ${fy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`;
    }

    const midX = (fx + tx) / 2;
    return `M ${fx} ${fy} C ${midX} ${fy}, ${midX} ${ty}, ${tx} ${ty}`;
}
