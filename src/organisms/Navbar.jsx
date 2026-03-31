import { useApp } from '../context/AppContext';

export default function Navbar({ children, showLogo = true }) {
    const { setSettingsOpen, apiKey, setPage, runs, page, isProMode, toggleProMode } = useApp();
    const hasRuns = runs.length > 0;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-[100] px-6 py-2.5 rounded-full glass border border-[var(--border-subtle)] shadow-2xl flex items-center justify-between animate-fade-in group hover:border-[rgba(255,255,255,0.15)] transition-all duration-500">
            <div className="flex items-center gap-4">
                {showLogo && (
                    <div
                        className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setPage('config')}
                    >
                        <img src="/logo.svg" alt="TarsForge" className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(0,255,157,0.4)]" />
                        <span className="text-base font-bold font-display gradient-text tracking-tight">TarsForge</span>
                        <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[9px] border border-[var(--border-subtle)] text-[var(--text-muted)] font-mono">v2</span>
                    </div>
                )}

                {/* Slot for custom left-side content (like breadcrumbs in RunPage) */}
                {children && <div className="flex items-center gap-3 border-l border-[var(--border-mid)] pl-4 ml-1">{children}</div>}
            </div>

            <div className="flex items-center gap-4">
                {/* PRO Switcher */}
                <div className="flex items-center gap-2 mr-2">
                    <span className={`text-[10px] font-bold tracking-widest ${isProMode ? 'text-[var(--neon-green)]' : 'text-[var(--text-muted)]'} transition-colors`}>PRO</span>
                    <button
                        type="button"
                        onClick={toggleProMode}
                        className={`w-9 h-5 rounded-full p-1 transition-all duration-300 flex items-center cursor-pointer ${isProMode ? 'bg-[var(--neon-green)]/20 shadow-[0_0_10px_rgba(0,255,157,0.3)]' : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)]'}`}
                    >
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isProMode ? 'translate-x-4 bg-[var(--neon-green)] shadow-[0_0_8px_var(--neon-green)]' : 'translate-x-0 bg-[var(--text-muted)]'}`} />
                    </button>
                </div>

                {hasRuns && page === 'config' && (
                    <button
                        type="button"
                        onClick={() => setPage('run')}
                        className="text-xs text-[var(--neon-blue)] hover:text-white transition-all cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[var(--neon-blue)]"
                    >
                        <span>🚀</span> Ver ejecución
                    </button>
                )}
            </div>
        </div>
    );
}
