import { useApp } from '../context/AppContext';

export default function RunSelector() {
    const { runCount, setRunCount } = useApp();

    return (
        <div className="flex flex-col items-center gap-3">
            <span className="text-sm text-[var(--text-secondary)] font-medium">Resultados</span>
            <div className="flex gap-2">
                {[1, 2].map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => setRunCount(n)}
                        className={[
                            'w-10 h-10 rounded-[var(--radius-md)] font-bold text-sm font-display',
                            'border transition-all duration-200 cursor-pointer',
                            runCount === n
                                ? 'text-[var(--bg-base)] border-transparent shadow-[0_0_14px_rgba(0,255,157,0.4)]'
                                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-mid)] hover:text-white',
                        ].join(' ')}
                        style={runCount === n ? { backgroundColor: 'var(--neon-green)' } : {}}
                    >
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
}
