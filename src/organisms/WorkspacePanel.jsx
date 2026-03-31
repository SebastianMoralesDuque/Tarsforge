import { useApp } from '../context/AppContext';
import { useState } from 'react';
import AgentGraph from './AgentGraph';
import AgentCard from '../molecules/AgentCard';
import PreviewFrame from './PreviewFrame';
import DecisionTree from './DecisionTree';
import Badge from '../atoms/Badge';
import { AGENT_STATES } from '../constants/agents';

export default function WorkspacePanel({ run, runIndex, totalRuns }) {
    const { toggleRunExpand, updateRun } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [splitView, setSplitView] = useState(true);
    const isExpanded = run.expanded;

    const runColors = ['#00ff9d', '#4d9fff', '#c084fc'];
    const accentColor = runColors[runIndex % runColors.length];

    const anyWorking = run.agents.some((a) => a.state === AGENT_STATES.WORKING);
    const statusBadge = run.status === 'done' ? 'done' : run.status === 'running' ? 'working' : 'pending';

    return (
        <div
            className={[
                'flex flex-col rounded-[var(--radius-xl)] border overflow-hidden transition-all duration-500',
                isExpanded ? 'fixed top-[76px] inset-x-4 bottom-8 z-[90] bg-[var(--bg-base)]' : 'relative h-full min-h-[600px]',
            ].join(' ')}
            style={{
                background: 'var(--bg-surface)',
                borderColor: anyWorking ? `${accentColor}80` : 'var(--border-subtle)',
                boxShadow: anyWorking ? `0 0 60px ${accentColor}15` : 'var(--shadow-card)',
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] flex-shrink-0"
                style={{ background: `${accentColor}08` }}
            >
                <div className="flex items-center gap-4 min-w-0">
                    <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                            background: accentColor,
                            boxShadow: anyWorking ? `0 0 12px ${accentColor}` : 'none',
                            animation: anyWorking ? 'pulse-glow 1.5s ease infinite' : 'none',
                        }}
                    />
                    <div className="min-w-0">
                        <h2 className="text-base font-bold font-display truncate" style={{ color: accentColor }}>
                            {run.label}
                        </h2>
                        <p className="text-xs text-[var(--text-muted)] truncate">{run.rationale}</p>
                    </div>
                    <Badge status={statusBadge} label={run.status === 'done' ? 'Landing Lista' : run.status === 'running' ? 'Generando...' : 'En cola'} />
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1.5 bg-[var(--bg-base)]/40 p-1 rounded-full border border-[var(--border-subtle)]">
                        {/* Split/Single View Toggle - only show when preview exists */}
                        {run.htmlOutput && (
                            <button
                                type="button"
                                onClick={() => setSplitView(v => !v)}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${splitView
                                    ? 'bg-[var(--neon-green)] text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                                    : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)]'
                                    }`}
                                title={splitView ? 'Vista única (Grafo)' : 'Vista dual (Grafo + Preview)'}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                                    <path d="M12 3v18"/>
                                </svg>
                                <span>{splitView ? 'Dual' : 'Solo Grafo'}</span>
                            </button>
                        )}

                        {/* Expand/Collapse (Focus Mode) - only show if multiple runs exist */}
                        {totalRuns > 1 && (
                            <button
                                type="button"
                                onClick={() => toggleRunExpand(runIndex)}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${isExpanded
                                    ? 'bg-[var(--neon-purple)] text-white shadow-[0_0_15px_rgba(192,132,252,0.3)]'
                                    : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)]'
                                    }`}
                                title={isExpanded ? 'Reducir panel' : 'Maximizar a pantalla completa'}
                            >
                                {isExpanded ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="m14 10 7-7"/><path d="m3 21 7-7"/>
                                    </svg>
                                ) : (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m15 3 6 6"/><path d="m9 21-6-6"/><path d="M21 3v6h-6"/><path d="M3 21v-6h6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/>
                                    </svg>
                                )}
                                <span>{isExpanded ? 'Reducir' : 'Maximizar'}</span>
                            </button>
                        )}


                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[400px] flex flex-col md:flex-row overflow-hidden relative">
                {/* Left: Agent Graph or Full View */}
                <div
                    className={`bg-[var(--bg-base)] overflow-hidden relative transition-all duration-300 ${splitView && run.htmlOutput
                        ? 'w-1/2 border-r border-[var(--border-subtle)]'
                        : 'flex-1'
                        }`}
                >
                    <AgentGraph
                        agents={run.agents}
                        flow={run.flow}
                        width={isExpanded ? 1800 : (splitView && run.htmlOutput) ? 800 : 1600}
                        height={isExpanded ? 1200 : 800}
                        previewStage={run.previewStage}
                        status={run.status}
                    />

                    <div className="absolute top-4 left-6 pointer-events-none z-10">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-muted)] drop-shadow-md">
                            Agentes · Construyendo tu Landing Page
                        </h3>
                    </div>

                    {/* Decision tree - floating bottom center (closer to edge) */}
                    {!showModal && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                            <DecisionTree agents={run.agents} history={run.decisionHistory} blueprint={run.blueprint} previewStage={run.previewStage} status={run.status} />
                        </div>
                    )}
                </div>

                {/* Right: Live HTML Preview (split view) */}
                {splitView && (run.status === 'done' || (run.previewStage === 'building' && run.htmlOutput)) && (
                    <div className="w-1/2 overflow-hidden flex flex-col min-h-0">
                        <PreviewFrame
                            blueprint={run.blueprint}
                            htmlOutput={run.htmlOutput}
                            previewStage={(run.status === 'done' || run.htmlOutput) ? 'live' : run.previewStage}
                            isFullScreen={isExpanded}
                            isDone={run.status === 'done'}
                            onFullScreen={() => setShowModal(true)}
                            alreadyAnimated={run.hasAnimated}
                            onAnimated={() => updateRun(runIndex, { hasAnimated: true })}
                        />
                    </div>
                )}
            </div>

            {/* Preview Modal - Full Screen Style */}
            {showModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)} />
                    <div className="relative top-[76px] w-[calc(100%-2rem)] h-[calc(100%-76px-2rem)] mx-auto bg-[var(--bg-base)] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-fade-up rounded-t-[var(--radius-xl)] border border-[var(--border-subtle)] border-b-0">
                        <div className="flex-1 flex flex-col min-h-0">
                            <PreviewFrame
                                blueprint={run.blueprint}
                                htmlOutput={run.htmlOutput}
                                previewStage={run.status === 'done' ? 'live' : run.previewStage}
                                isFullScreen={true}
                                isDone={run.status === 'done'}
                                onClose={() => setShowModal(false)}
                                alreadyAnimated={run.hasAnimated}
                                onAnimated={() => updateRun(runIndex, { hasAnimated: true })}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
