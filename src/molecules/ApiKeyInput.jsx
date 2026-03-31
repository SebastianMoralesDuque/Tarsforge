import { useState } from 'react';
import Button from '../atoms/Button';

export default function ApiKeyInput({ value, onChange, onSave, onCancel, showCancel = false }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="space-y-4">
            <div className="relative">
                <input
                    type={visible ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="AIza..."
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-mid)] rounded-[var(--radius-md)] px-4 py-3 pr-12 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-green)] transition-colors font-mono"
                    spellCheck={false}
                    autoComplete="off"
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer text-sm"
                >
                    {visible ? '🙈' : '👁️'}
                </button>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="primary"
                    size="md"
                    onClick={onSave}
                    disabled={!value || value.length < 10}
                    className="flex-1"
                >
                    Guardar API Key
                </Button>
                {showCancel && (
                    <Button variant="ghost" size="md" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}
            </div>
        </div>
    );
}
