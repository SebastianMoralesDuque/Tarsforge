import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { ReactFlow, Background, MarkerType, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { computeGraphLayout } from '../utils/graphLayout';
import { AGENT_STATES } from '../constants/agents';
import AgentNode from './AgentNode';

function ZoomControls({ onZoomIn, onZoomOut, onFitView, zoom }) {
    return (
        <div className="flex flex-col gap-1 p-1.5 rounded-[var(--radius-lg)] bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-mid)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <button
                onClick={onZoomIn}
                className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--neon-green)] hover:bg-[var(--bg-elevated)] hover:shadow-[0_0_12px_rgba(0,255,157,0.3)] transition-all duration-200 active:scale-90"
                title="Zoom in"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
            <div className="w-full h-px bg-[var(--border-subtle)]" />
            <button
                onClick={onZoomOut}
                className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--neon-blue)] hover:bg-[var(--bg-elevated)] hover:shadow-[0_0_12px_rgba(77,159,255,0.3)] transition-all duration-200 active:scale-90"
                title="Zoom out"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
            <div className="w-full h-px bg-[var(--border-subtle)]" />
            <button
                onClick={onFitView}
                className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--neon-purple)] hover:bg-[var(--bg-elevated)] hover:shadow-[0_0_12px_rgba(192,132,252,0.3)] transition-all duration-200 active:scale-90"
                title="Fit view"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
            </button>
            <div className="mt-1 pt-1 border-t border-[var(--border-subtle)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block text-center">
                    {Math.round(zoom * 100)}%
                </span>
            </div>
        </div>
    );
}

const nodeTypes = {
    agent: AgentNode,
};

const ARCH_MESSAGES = [
    "Retroalimentando agentes",
    "Construyendo estructura",
    "Optimizando conexiones",
    "Validando estructura",
];

// Inner component that has access to the ReactFlow instance
function AgentGraphInner({ agents = [], flow = [], width = 1400, height = 800, previewStage, status }) {
    const { fitView, setCenter, getNode, zoomTo, getZoom } = useReactFlow();
    const hasFitOnce = useRef(false);
    const prevAgentIdsRef = useRef('');
    const lastWorkingRef = useRef('');
    const isCompleteRef = useRef(false);
    const [zoom, setZoom] = useState(1);
    const [messageIndex, setMessageIndex] = useState(0);

    // Rotating architectural messages during building phase
    useEffect(() => {
        if (previewStage === 'building' && status !== 'done') {
            const interval = setInterval(() => {
                setMessageIndex(i => (i + 1) % ARCH_MESSAGES.length);
            }, 10000);
            return () => clearInterval(interval);
        } else {
            setMessageIndex(0);
        }
    }, [previewStage, status]);

    // 1. Calculate static positions based on flow topology
    const { positions, edges: rawEdges } = useMemo(
        () => computeGraphLayout(agents, flow, Math.max(width, agents.length * 400), Math.max(height, 800)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [flow, width, height] // intentionally exclude `agents` to avoid rebuilding layout on every state update
    );

    // 2. Local state for React Flow
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // 3. Determine which nodes should be visible (accumulated - never hide once shown)
    const visibleIdsRef = useRef(new Set());

    const computeVisibleIds = useCallback((agentList, agentMap) => {
        const visible = visibleIdsRef.current;

        if (agentList.length > 0) visible.add(agentList[0].id);

        agentList.forEach(a => {
            if (a.state !== AGENT_STATES.PENDING) visible.add(a.id);
        });

        rawEdges.forEach(e => {
            if (visible.has(e.from)) {
                const fromAgent = agentMap[e.from];
                if (fromAgent && (fromAgent.state === AGENT_STATES.WORKING || fromAgent.state === AGENT_STATES.DONE)) {
                    visible.add(e.to);
                }
            }
        });

        return visible;
    }, [rawEdges]);

    // 4. Sync incoming agent data with React Flow nodes (incremental merge — no flash)
    useEffect(() => {
        if (!agents.length) return;

        const agentMap = {};
        agents.forEach(a => { agentMap[a.id] = a; });

        const visibleIds = computeVisibleIds(agents, agentMap);

        const allAgentsDone = agents.length > 0 && agents.every(a => a.state === AGENT_STATES.DONE || a.state === AGENT_STATES.ERROR);
        const isAssembling = allAgentsDone && status !== 'done' && (previewStage === 'assembling' || previewStage === 'building');

        // --- NODES: only update data, never recreate from scratch ---
        setNodes(currentNodes => {
            const currentMap = {};
            currentNodes.forEach(n => { currentMap[n.id] = n; });

            let changed = false;
            const nextNodes = agents.map(a => {
                const isVisible = visibleIds.has(a.id);
                const pos = currentMap[a.id]?.position || positions[a.id] || { x: 0, y: 0 };
                const existing = currentMap[a.id];

                const nextNode = {
                    id: a.id,
                    type: 'agent',
                    position: pos,
                    hidden: !isVisible,
                    data: { agent: a, isTarget: true, isSource: true, isAssembling },
                };

                // Only mark as changed if something meaningful actually changed
                if (
                    !existing ||
                    existing.hidden !== nextNode.hidden ||
                    existing.data.agent.state !== a.state ||
                    existing.data.agent.output !== a.output
                ) {
                    changed = true;
                }

                return nextNode;
            });

            return changed ? nextNodes : currentNodes;
        });

        // --- EDGES: stable ids, only update style/animated flag ---
        const isFlowing = isAssembling || rawEdges.some(e => agentMap[e.from]?.state === AGENT_STATES.WORKING);

        setEdges(() => {
            return rawEdges.map((edge) => {
                const fromAgent = agentMap[edge.from];
                const toAgent = agentMap[edge.to];
                const isActive = fromAgent?.state === AGENT_STATES.DONE || toAgent?.state === AGENT_STATES.WORKING;
                const edgeColor = fromAgent?.color || 'rgba(255,255,255,0.2)';
                const isVisible = visibleIds.has(edge.from) && visibleIds.has(edge.to);

                return {
                    id: `e-${edge.from}-${edge.to}`,  // stable id (no index)
                    source: edge.from,
                    target: edge.to,
                    animated: isFlowing,
                    hidden: !isVisible,
                    type: edge.isFeedback ? 'smoothstep' : 'default',
                    style: {
                        stroke: isActive ? edgeColor : 'rgba(255,255,255,0.1)',
                        strokeWidth: isActive ? 3 : 1.5,
                        filter: isActive ? `drop-shadow(0 0 6px ${edgeColor})` : 'none',
                        transition: 'stroke 0.5s ease, stroke-width 0.5s ease',
                    },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: isActive ? edgeColor : 'rgba(255,255,255,0.1)',
                    },
                    markerStart: {
                        type: MarkerType.ArrowClosed,
                        color: isActive ? edgeColor : 'rgba(255,255,255,0.1)',
                    },
                };
            });
        });

        // 5. fitView only once when graph is first populated
        const agentIdsKey = agents.map(a => a.id).join(',');
        if (!hasFitOnce.current || prevAgentIdsRef.current !== agentIdsKey) {
            prevAgentIdsRef.current = agentIdsKey;
            hasFitOnce.current = true;
            setTimeout(() => fitView({ padding: { top: 0.15, right: 0.05, bottom: 0.1, left: 0.05 }, duration: 400 }), 100);
        }

        // 6. Auto-pan/zoom to follow the flow as it progresses
        const allDone = agents.length > 0 && agents.every(a => a.state === AGENT_STATES.DONE || a.state === AGENT_STATES.ERROR);
        const currentWorkingAgent = agents.find(a => a.state === AGENT_STATES.WORKING);

        if (allDone && !isCompleteRef.current) {
            isCompleteRef.current = true;
            setTimeout(() => fitView({ padding: { top: 0.2, right: 0.05, bottom: 0.05, left: 0.05 }, duration: 800 }), 300);
        } else if (currentWorkingAgent && lastWorkingRef.current !== currentWorkingAgent.id) {
            lastWorkingRef.current = currentWorkingAgent.id;
            const targetNode = getNode(currentWorkingAgent.id);
            if (targetNode) {
                const nodeX = targetNode.position.x + 160;
                const nodeY = targetNode.position.y + 100;
                setTimeout(() => {
                    setCenter(nodeX, nodeY, { zoom: 1.0, duration: 1000 });
                }, 200);
            }
        }

    }, [agents, rawEdges, positions, computeVisibleIds, setNodes, setEdges, fitView, getNode, setCenter, previewStage, status]);

    // 7. Re-adjust view when container dimensions change (toggling dual view or expanding)
    useEffect(() => {
        const timeout = setTimeout(() => {
            fitView({ padding: { top: 0.15, right: 0.05, bottom: 0.1, left: 0.05 }, duration: 600 });
        }, 400); // Wait for CSS transitions in WorkspacePanel to finish
        return () => clearTimeout(timeout);
    }, [width, height, fitView]);

    const handleZoomIn = useCallback(() => {
        const currentZoom = getZoom();
        zoomTo(Math.min(currentZoom * 1.3, 2));
        setZoom(Math.min(currentZoom * 1.3, 2));
    }, [getZoom, zoomTo]);

    const handleZoomOut = useCallback(() => {
        const currentZoom = getZoom();
        zoomTo(Math.max(currentZoom / 1.3, 0.05));
        setZoom(Math.max(currentZoom / 1.3, 0.05));
    }, [getZoom, zoomTo]);

    const handleFitView = useCallback(() => {
        fitView({ padding: { top: 0.05, right: 0.05, bottom: 0.2, left: 0.05 }, duration: 400 });
    }, [fitView]);

    useEffect(() => {
        const interval = setInterval(() => {
            setZoom(getZoom());
        }, 100);
        return () => clearInterval(interval);
    }, [getZoom]);

    return (
        <div style={{ width: '100%', height: '100%' }} className="xyflow-wrapper">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                minZoom={0.05}
                maxZoom={2}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#ffffff" gap={20} size={1} opacity={0.03} />
            </ReactFlow>
            <div className="absolute bottom-4 left-4 z-50">
                <ZoomControls
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onFitView={handleFitView}
                    zoom={zoom}
                />
            </div>
            {previewStage === 'building' && status !== 'done' && (
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--bg-card)]/95 backdrop-blur-md border border-[var(--neon-green)]/30 shadow-[0_0_15px_rgba(0,255,157,0.15)]">
                    <div className="relative w-3.5 h-3.5">
                        <div className="absolute inset-0 rounded-full border-[1.5px] border-[var(--neon-green)]/20" />
                        <div className="absolute inset-0 rounded-full border-[1.5px] border-transparent border-t-[var(--neon-green)] animate-spin" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[var(--neon-green)] tracking-wider">
                        {ARCH_MESSAGES[messageIndex]}
                    </span>
                    <div className="flex gap-0.5 opacity-80">
                        <span className="w-[3px] h-3 rounded-full bg-[var(--neon-green)] animate-pulse" style={{ animationDelay: '0ms' }} />
                        <span className="w-[3px] h-3 rounded-full bg-[var(--neon-green)] animate-pulse" style={{ animationDelay: '150ms' }} />
                        <span className="w-[3px] h-3 rounded-full bg-[var(--neon-green)] animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}
        </div>
    );
}

// Wrap with ReactFlowProvider so useReactFlow() works
export default function AgentGraph(props) {
    return (
        <ReactFlowProvider>
            <AgentGraphInner {...props} />
        </ReactFlowProvider>
    );
}
