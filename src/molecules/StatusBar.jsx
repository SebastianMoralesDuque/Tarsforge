import { downloadHTML } from '../utils/exporters';

export default function StatusBar({ htmlOutput, viewCode, onViewCode, onClose, onFullScreen, disabled }) {
    return (
        <div className="flex items-center justify-end px-3 py-1.5 bg-[var(--bg-card)] border-b border-[var(--border-subtle)] flex-shrink-0">
            <div className="flex items-center gap-1.5">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--neon-pink)] hover:bg-[var(--neon-pink)]/10 transition-all cursor-pointer mr-2 border border-transparent hover:border-[var(--neon-pink)]/30 group"
                        title="Cerrar vista previa"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                {htmlOutput && (
                    <>
                        {onFullScreen && (
                            <button
                                type="button"
                                onClick={onFullScreen}
                                disabled={disabled}
                                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${disabled ? 'opacity-50 cursor-not-allowed text-[var(--text-muted)]' : 'text-[var(--neon-blue)] hover:bg-[var(--neon-blue)]/10 cursor-pointer'}`}
                                title="Ver en pantalla completa"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"/>
                                </svg>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onViewCode}
                            disabled={disabled}
                            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${disabled ? 'opacity-50 cursor-not-allowed text-[var(--text-muted)]' : (viewCode ? 'bg-[var(--neon-green)] text-black cursor-pointer' : 'text-[var(--text-muted)] hover:text-white hover:bg-white/10 cursor-pointer')}`}
                            title={viewCode ? 'Ver Render' : 'Ver Código HTML'}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => downloadHTML(htmlOutput, `tarsforge-landing-${Date.now()}.html`)}
                            disabled={disabled}
                            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${disabled ? 'opacity-50 cursor-not-allowed text-[var(--text-muted)]' : 'text-[var(--text-muted)] hover:text-white hover:bg-white/10 cursor-pointer'}`}
                            title="Descargar HTML"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
