import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ApiKeyInput from '../molecules/ApiKeyInput';

export default function SettingsModal() {
    const { apiKey, setApiKey, setSettingsOpen } = useApp();
    const [draftKey, setDraftKey] = useState(apiKey);


    function handleSave() {
        setApiKey(draftKey.trim());
        setSettingsOpen(false);
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setSettingsOpen(false)}
            />
            <div className="relative glass-strong rounded-[var(--radius-xl)] p-8 w-full max-w-md animate-fade-up shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold font-display gradient-text">Configuración</h2>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Gestión de IA y Orquestación</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSettingsOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">
                        TarsForge utiliza Modelos de Código Abierto (Ollama) de forma local y gratuita. 
                        Puedes configurar una Gemini API Key opcional como respaldo de seguridad.
                    </p>
                </div>

                <ApiKeyInput
                    value={draftKey}
                    onChange={setDraftKey}
                    onSave={handleSave}
                    onCancel={() => setSettingsOpen(false)}
                    showCancel
                />
            </div>
        </div>
    );
}
