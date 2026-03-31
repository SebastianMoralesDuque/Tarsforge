import { useApp } from '../context/AppContext';
import { useOrchestrator } from '../hooks/useOrchestrator';
import { useState, useEffect } from 'react';
import RunSelector from '../molecules/RunSelector';
import SkillsSelector from './SkillsSelector';
import AssetPanel from '../molecules/AssetPanel';
import Button from '../atoms/Button';
import Spinner from '../atoms/Spinner';

const LOADING_MESSAGES = [
    'Analizando prompt...',
    'Creando plan de ejecución...',
    'Iniciando agentes de trabajo...',
    'Preparando arquitectura...',
];

export default function PromptInput() {
    const { prompt, setPrompt, isProMode } = useApp();
    const { startOrchestration } = useOrchestrator();
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    useEffect(() => {
        if (!loading) {
            setLoadingMessage('');
            return;
        }
        let index = 0;
        setLoadingMessage(LOADING_MESSAGES[0]);
        const interval = setInterval(() => {
            index = (index + 1) % LOADING_MESSAGES.length;
            setLoadingMessage(LOADING_MESSAGES[index]);
        }, 3000);
        return () => clearInterval(interval);
    }, [loading]);

    async function handleGenerate() {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        try {
            await startOrchestration();
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] border border-[var(--border-mid)] p-12 flex flex-col items-center justify-center gap-6 shadow-[0_0_60px_rgba(0,255,157,0.08)]">
                    <div className="relative">
                        <span className="absolute inset-0 rounded-full bg-[var(--neon-green)] opacity-20 blur-xl animate-pulse" />
                        <Spinner size={48} />
                    </div>
                    <p className="text-lg font-semibold text-[var(--text-primary)] font-display">
                        {loadingMessage}
                    </p>
                </div>
            </div>
        );
    }

    if (!isProMode) {
        return (
            <div className="w-full max-w-2xl mx-auto space-y-6 py-4">
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value.slice(0, 10000))}
                        placeholder="Describe tu negocio o producto…"
                        rows={6}
                        maxLength={10000}
                        className={[
                            'w-full bg-[var(--bg-card)] rounded-[var(--radius-lg)] px-6 py-6',
                            'text-base text-[var(--text-primary)] placeholder-[var(--text-muted)]',
                            'border border-[var(--border-mid)] focus:outline-none focus:border-[var(--neon-green)]',
                            'resize-none leading-relaxed transition-all duration-300 shadow-xl',
                        ].join(' ')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.metaKey) handleGenerate();
                        }}
                    />
                    <div className="absolute right-4 bottom-4 flex items-center gap-3">
                        <span className={`text-[10px] font-mono uppercase tracking-wider ${prompt.length >= 10000 ? 'text-[var(--neon-pink)]' : 'text-[var(--text-muted)]'}`}>
                            {prompt.length}/10000 {prompt.length > 0 && '· ⌘+Enter'}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <RunSelector />
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        loading={loading}
                        className="w-full py-5 text-base font-bold glow-green"
                    >
                        {loading ? 'Orquestando agentes…' : '⚡ Generar Landing Pages'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1800px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    <SkillsSelector />
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value.slice(0, 10000))}
                            placeholder="Describe tu negocio…"
                            rows={8}
                            maxLength={10000}
                            className={[
                                'w-full bg-[var(--bg-card)] rounded-[var(--radius-lg)] px-6 py-5',
                                'text-base text-[var(--text-primary)] placeholder-[var(--text-muted)]',
                                'border border-[var(--border-mid)] focus:outline-none focus:border-[var(--neon-green)]',
                                'resize-none leading-relaxed transition-all duration-300 shadow-inner',
                            ].join(' ')}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.metaKey) handleGenerate();
                            }}
                        />
                        <div className="absolute right-4 bottom-4 flex items-center gap-3">
                            <span className={`text-[10px] font-mono uppercase tracking-wider ${prompt.length >= 10000 ? 'text-[var(--neon-pink)]' : 'text-[var(--text-muted)]'}`}>
                                {prompt.length}/10000 {prompt.length > 0 && '· ⌘+Enter'}
                            </span>
                        </div>
                    </div>

                    <RunSelector />

                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        loading={loading}
                        className="w-full py-4 text-base font-bold glow-green"
                    >
                        {loading ? 'Orquestando agentes…' : '⚡ Generar Landing Pages'}
                    </Button>
                </div>

                <div className="lg:col-span-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <AssetPanel />
                </div>
            </div>
        </div>
    );
}
