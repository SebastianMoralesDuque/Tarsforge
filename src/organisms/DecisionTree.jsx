import { useMemo } from 'react';
import { AGENT_STATES } from '../constants/agents';

export default function DecisionTree({ history = [], blueprint, agents = [], previewStage, status }) {

    const nodes = useMemo(() => {
        const results = [];

        const executingAgents = agents.filter(a => a.state !== AGENT_STATES.PENDING && !['builder', 'builder-implicit'].includes(a.id));

        executingAgents.forEach(agent => {
            const isDone = agent.state === AGENT_STATES.DONE;
            results.push({
                label: agent.name,
                role: agent.role,
                color: agent.color || '#ffffff',
                icon: isDone ? '✅' : '⚙️',
                preview: agent.specialty?.slice(0, 40) || 'Procesando...',
                status: agent.state
            });
        });

        if (blueprint?.structural_contract && !results.some(n => n.label === 'Contrato Estructural')) {
            results.push({ label: 'Contrato Estructural', role: 'Architect', color: '#00ff9d', icon: '🏗️', preview: `Secciones: ${blueprint.structural_contract.sections_ordered?.join(', ')}`, status: 'done' });
        }
        if (blueprint?.design_spec && !results.some(n => n.label === 'Spec. Visual')) {
            results.push({ label: 'Spec. Visual', role: 'Design', color: '#4d9fff', icon: '🎨', preview: '...', status: 'done' });
        }

        history.forEach((h) => {
            results.push({ label: `Loop #${h.version}`, role: 'Critic', color: '#f97316', icon: '🔁', preview: h.summary?.slice(0, 40) || '', status: 'done' });
        });

        return results;
    }, [agents, blueprint, history]);

    // Calculate progress percentage
    const progress = useMemo(() => {
        if (status === 'done') return 100;
        if (!agents.length) return 0;

        const nonBuilderAgents = agents.filter(a => !['builder', 'builder-implicit'].includes(a.id));
        if (nonBuilderAgents.length === 0) return 0;

        const doneCount = nonBuilderAgents.filter(a => a.state === AGENT_STATES.DONE).length;
        const workingCount = nonBuilderAgents.filter(a => a.state === AGENT_STATES.WORKING).length;

        // 80% when all agents done, preview stage takes it to 100%
        const agentProgress = (doneCount / nonBuilderAgents.length) * 80;
        const workingBonus = workingCount > 0 ? (workingCount / nonBuilderAgents.length) * 5 : 0;

        // If preview is building/assembling, add extra progress beyond 80%
        if (previewStage === 'building' || previewStage === 'assembling') {
            return Math.min(Math.round(agentProgress + workingBonus + 15), 95);
        }

        return Math.round(agentProgress + workingBonus);
    }, [agents, status, previewStage]);

    if (nodes.length === 0) {
        return (
            <div className="flex items-center justify-center py-3 text-[var(--text-muted)] text-[9px] font-mono opacity-40 select-none pointer-events-none">
                <span className="animate-pulse">_INICIALIZANDO</span>
            </div>
        );
    }

    const activeNode = nodes.find(n => n.status === AGENT_STATES.WORKING);
    const progressColor = activeNode?.color || nodes.find(n => n.status === AGENT_STATES.DONE)?.color || 'var(--neon-green)';

    return (
        <div className="relative flex flex-col items-center select-none pointer-events-none gap-2">
            {/* Progress bar + percentage */}
            <div className="flex items-center gap-2">
                <div className="relative h-[2px] overflow-hidden rounded-full" style={{ width: `${Math.min(nodes.length * 50 + 30, 400)}px`, background: 'rgba(255,255,255,0.08)' }}>
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, ${progressColor}, ${progressColor}cc)`,
                            boxShadow: `0 0 8px ${progressColor}60`,
                        }}
                    />
                </div>
                <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: progressColor, textShadow: `0 0 6px ${progressColor}40` }}>
                    {progress}%
                </span>
            </div>

            {/* Agent orbs on a line */}
            <div
                className="relative h-[2px] flex items-center justify-center"
                style={{
                    width: `${Math.min(nodes.length * 50 + 30, 400)}px`,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, transparent)'
                }}
            >
                <div className="absolute inset-x-0 bottom-[-6px] flex items-center justify-around px-2">
                    {nodes.map((node, i) => {
                        const isWorking = node.status === AGENT_STATES.WORKING;
                        const isDone = node.status === AGENT_STATES.DONE;

                        return (
                            <div key={i} className="relative flex items-center justify-center w-0">
                                <div
                                    className={`rounded-full transition-all duration-500 pointer-events-auto cursor-help border border-white/15 ${isWorking ? 'w-4 h-4 scale-125 z-10' : 'w-[10px] h-[10px]'}`}
                                    style={{
                                        background: isDone ? node.color : isWorking ? '#fff' : 'rgba(255,255,255,0.06)',
                                        boxShadow: isDone ? `0 0 10px ${node.color}` : isWorking ? '0 0 16px #fff' : 'none',
                                        opacity: isDone || isWorking ? 1 : 0.25
                                    }}
                                    title={`${node.role || node.label}: ${node.preview}`}
                                />

                                {/* Tiny label below orb for working agent */}
                                {isWorking && (
                                    <div className="absolute -bottom-5 whitespace-nowrap">
                                        <span className="text-[7px] font-mono font-bold tracking-wider" style={{ color: node.color, textShadow: `0 0 4px ${node.color}60` }}>
                                            {node.role || node.label}
                                        </span>
                                    </div>
                                )}

                                {/* Small dot label for done agents */}
                                {isDone && !isWorking && (
                                    <div className="absolute -bottom-4 opacity-0 group-hover/dt:opacity-60 transition-opacity whitespace-nowrap">
                                        <span className="text-[6px] font-mono tracking-wider uppercase" style={{ color: node.color }}>
                                            {(node.role || node.label).split(' ')[0]}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
