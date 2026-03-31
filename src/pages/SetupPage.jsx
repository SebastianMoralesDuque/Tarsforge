import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function SetupPage() {
    const { setPage } = useApp();

    useEffect(() => {
        setPage('config');
    }, [setPage]);

    return (
        <div className="min-h-screen bg-[var(--bg-base)] bg-mesh bg-dots flex flex-col items-center justify-center p-6">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, var(--neon-green), transparent 70%)', filter: 'blur(60px)', animation: 'pulse-glow 4s ease infinite' }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, var(--neon-blue), transparent 70%)', filter: 'blur(60px)', animation: 'pulse-glow 5s ease infinite 1s' }} />
            </div>

            <div className="relative w-full max-w-md animate-fade-up text-center">
                <div className="inline-flex items-center gap-2 mb-4">
                    <img src="/logo.svg" alt="TarsForge" className="w-16 h-16 filter drop-shadow-[0_0_15px_rgba(0,255,157,0.4)]" />
                </div>
                <h1 className="text-4xl font-bold font-display gradient-text mb-2">TarsForge</h1>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    Cargando...
                </p>
            </div>
        </div>
    );
}
