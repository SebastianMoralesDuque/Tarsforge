import { useApp } from '../context/AppContext';
import WorkspacePanel from '../organisms/WorkspacePanel';
import Button from '../atoms/Button';
import Navbar from '../organisms/Navbar';
import { AGENT_STATES } from '../constants/agents';


export default function RunPage() {
    const { runs, orchestrationPlan, setPage, resetAll } = useApp();

    const allDone = runs.length > 0 && runs.every((r) => r.status === 'done' || r.status === 'error');
    const anyRunning = runs.some((r) => r.status === 'running');
    const complexity = orchestrationPlan?.complexity || 'medium';

    const complexityConfig = {
        low: 'bg-[rgba(0,255,157,0.1)] text-[var(--neon-green)] border-[rgba(0,255,157,0.3)]',
        medium: 'bg-[rgba(250,204,21,0.1)] text-[var(--neon-yellow)] border-[rgba(250,204,21,0.3)]',
        high: 'bg-[rgba(249,115,22,0.1)] text-[var(--neon-orange)] border-[rgba(249,115,22,0.3)]',
    };

    return (
        <div className="h-screen flex flex-col bg-[var(--bg-base)] overflow-hidden pt-20">
            <Navbar>
                <div className="flex items-center gap-3">
                    {anyRunning && (
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse" />
                            <span className="text-[10px] text-[var(--neon-green)] font-mono uppercase tracking-wider">Orquestando…</span>
                        </div>
                    )}
                    {allDone && (
                        <span className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">✓ Completado</span>
                    )}

                    {orchestrationPlan && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] border font-medium ${complexityConfig[complexity]}`}>
                            {complexity.toUpperCase()}
                        </span>
                    )}

                    <div className="flex items-center gap-2 ml-2">
                        {allDone && (
                            <button
                                onClick={() => setPage('compare')}
                                className="text-[10px] px-3 py-1 rounded-full bg-[var(--neon-blue)]/10 text-[var(--neon-blue)] border border-[var(--neon-blue)]/20 hover:bg-[var(--neon-blue)] hover:text-white transition-all cursor-pointer"
                            >
                                Comparar
                            </button>
                        )}
                        <button
                            onClick={resetAll}
                            className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-[var(--text-muted)] border border-white/10 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        >
                            Reiniciar
                        </button>
                    </div>
                </div>
            </Navbar>


            {/* Workspaces */}
            <div
                className={[
                    'flex-1 min-h-0 p-3 gap-3',
                    'grid',
                    runs.length === 1 ? 'grid-cols-1' : runs.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
                ].join(' ')}
            >
                {runs.length === 0 ? (
                    <div className="col-span-3 flex items-center justify-center text-[var(--text-muted)] text-sm">
                        Iniciando orquestación…
                    </div>
                ) : (
                    runs.map((run, i) => (
                        <WorkspacePanel key={run.run_id} run={run} runIndex={i} totalRuns={runs.length} />
                    ))
                )}
            </div>
        </div>
    );
}
