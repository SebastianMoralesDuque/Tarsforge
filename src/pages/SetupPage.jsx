import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ApiKeyInput from '../molecules/ApiKeyInput';
import Button from '../atoms/Button';

export default function SetupPage() {
    const { setApiKey, setPage } = useApp();
    const [draftKey, setDraftKey] = useState('');

    function handleSave() {
        if (!draftKey.trim() || draftKey.length < 10) return;
        setApiKey(draftKey.trim());
        setPage('config');
    }

    function handleSkip() {
        setPage('config');
    }

    return (
        <div className="min-h-screen bg-[var(--bg-base)] bg-mesh bg-dots flex flex-col items-center justify-center p-6">
            {/* Animated background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, var(--neon-green), transparent 70%)', filter: 'blur(60px)', animation: 'pulse-glow 4s ease infinite' }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, var(--neon-blue), transparent 70%)', filter: 'blur(60px)', animation: 'pulse-glow 5s ease infinite 1s' }} />
            </div>

            <div className="relative w-full max-w-md animate-fade-up">
                {/* Logo & title */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <img src="/logo.svg" alt="TarsForge" className="w-16 h-16 filter drop-shadow-[0_0_15px_rgba(0,255,157,0.4)]" />
                    </div>
                    <h1 className="text-4xl font-bold font-display gradient-text mb-2">TarsForge</h1>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        Construye landing pages con<br />
                        <span className="text-[var(--neon-green)]">modelos de código abierto (Ollama)</span>
                    </p>
                </div>

                {/* Card */}
                <div className="glass-strong rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-card)]">
                    <h2 className="text-lg font-bold font-display text-[var(--text-primary)] mb-2">Bienvenido a TarsForge</h2>
                    <p className="text-xs text-[var(--text-muted)] mb-1 leading-relaxed">
                        TarsForge utiliza <strong className="text-[var(--text-secondary)]">modelos de codigo abierto y gratuitos</strong> para orquestar los agentes.
                        Puedes configurar una Gemini API Key opcional como respaldo.
                    </p>
                    <a
                        href="https://aistudio.google.com/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--neon-green)] hover:underline"
                    >
                        → Obtener clave gratis en Google AI Studio
                    </a>

                    <div className="mt-5">
                        <ApiKeyInput
                            value={draftKey}
                            onChange={setDraftKey}
                            onSave={handleSave}
                        />
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                    >
                        Continuar sin API Key (modo demo)
                    </button>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center gap-2 mt-8">
                    {['🤖 Multi-agente', '⚡ Streaming real', '📊 Blueprint vivo', '🔀 Compara versiones'].map((f) => (
                        <span key={f} className="px-3 py-1 rounded-full text-[10px] text-[var(--text-muted)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                            {f}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
