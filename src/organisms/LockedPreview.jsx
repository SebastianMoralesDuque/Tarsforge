import { STAGE_MESSAGES, STAGE_LABELS } from '../constants/previewConfig';

export default function LockedPreview({ previewStage }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#07070d] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--neon-green)]/10 blur-[120px] rounded-full animate-pulse" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-12 transform-gpu">
                    <div className="w-24 h-24 border border-dashed border-[var(--neon-green)]/30 rounded-full animate-[spin_8s_linear_infinite]" />
                    <div className="absolute inset-2 border border-dotted border-[var(--neon-green)]/50 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl animate-bounce">⚡</span>
                    </div>
                </div>
                
                <div className="text-center px-8">
                    <h2 className="text-[var(--neon-green)] font-display text-xl font-black mb-1.5 tracking-tighter uppercase whitespace-nowrap">
                        ASAMBLANDO ASSETS DIGITALES
                    </h2>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-8 bg-white/10" />
                        <span className="text-[var(--text-muted)] text-[9px] font-mono tracking-[0.4em] uppercase">
                            {STAGE_LABELS[previewStage] || 'Procesando...'}
                        </span>
                        <div className="h-px w-8 bg-white/10" />
                    </div>
                    
                    <div className="flex flex-col gap-1.5 items-start max-w-[280px] mx-auto opacity-70">
                        <div className="flex gap-2 items-center text-[8px] font-mono text-[var(--text-muted)]">
                            <span className="text-[var(--neon-green)]">{">>"}</span> {STAGE_MESSAGES[previewStage] || 'Validando orquestación...'}
                        </div>
                        <div className="flex gap-2 items-center text-[8px] font-mono text-[var(--text-muted)] animate-pulse">
                            <span className="text-[var(--neon-green)]">{">>"}</span> Inyectando capas neuronales...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
