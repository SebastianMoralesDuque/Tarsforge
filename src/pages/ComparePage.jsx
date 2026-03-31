import { useApp } from '../context/AppContext';
import { useState } from 'react';
import PreviewFrame from '../organisms/PreviewFrame';
import Navbar from '../organisms/Navbar';

export default function ComparePage() {
    const { runs, resetAll, setPage, updateRun } = useApp();
    const [fullScreenRun, setFullScreenRun] = useState(null);
    const donRuns = runs.filter((r) => r.status === 'done' && r.htmlOutput);

    const runColors = ['#00ff9d', '#4d9fff'];

    return (
        <div className="h-screen flex flex-col bg-[var(--bg-base)] overflow-hidden pt-20">
            <Navbar>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setPage('run')}
                        className="flex items-center gap-2 text-[10px] px-4 py-1.5 rounded-full bg-[var(--neon-blue)] text-white font-bold shadow-[0_0_15px_rgba(77,159,255,0.4)] transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        <span>Volver al Flujo</span>
                    </button>
                    <span className="w-px h-3 bg-[var(--border-mid)] mx-2" />
                    <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest">Comparador</span>
                    <div className="flex items-center gap-2 ml-4">
                        <button
                            onClick={resetAll}
                            className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-[var(--text-muted)] border border-white/10 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        >
                            Nueva generación
                        </button>
                    </div>
                </div>
            </Navbar>


            {donRuns.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
                    No hay versiones completadas para comparar
                </div>
            ) : (
                <div className="flex-1 min-h-0 p-6 overflow-hidden">
                    <div className={`grid gap-6 h-full ${donRuns.length === 1 ? 'grid-cols-1 max-w-7xl mx-auto' : 'grid-cols-2'}`}>
                        {donRuns.map((run, i) => (
                            <div key={run.run_id} className="flex flex-col gap-3 min-h-0">
                                <div className="shrink-0">
                                    <h3 className="text-sm font-bold font-display" style={{ color: runColors[i] }}>
                                        {run.label}
                                    </h3>
                                    <p className="text-[10px] text-[var(--text-muted)]">{run.rationale}</p>
                                </div>
                                <div className="flex-1 min-h-0 flex flex-col">
                                    <PreviewFrame
                                        blueprint={run.blueprint}
                                        htmlOutput={run.htmlOutput}
                                        previewStage="live"
                                        alreadyAnimated={run.hasAnimated}
                                        onAnimated={() => updateRun(runs.indexOf(run), { hasAnimated: true })}
                                        onFullScreen={() => setFullScreenRun(run)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {fullScreenRun && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setFullScreenRun(null)} />
                    <div className="relative top-[76px] w-[calc(100%-2rem)] h-[calc(100%-76px-32px)] mx-auto bg-[var(--bg-base)] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-fade-up rounded-t-[var(--radius-xl)] border border-[var(--border-subtle)] border-b-0">
                        <PreviewFrame
                            blueprint={fullScreenRun.blueprint}
                            htmlOutput={fullScreenRun.htmlOutput}
                            previewStage="live"
                            isFullScreen={true}
                            isDone={true}
                            alreadyAnimated={fullScreenRun.hasAnimated}
                            onAnimated={() => updateRun(runs.indexOf(fullScreenRun), { hasAnimated: true })}
                            onClose={() => setFullScreenRun(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
