import { useState, useRef, useEffect } from 'react';
import Button from '../atoms/Button';
import { downloadHTML, downloadJSON } from '../utils/exporters';

export default function ExportMenu({ htmlOutput, blueprint, runLabel = 'landing', disabled }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const items = [
        {
            label: 'Exportar HTML',
            icon: '📄',
            disabled: !htmlOutput,
            action: () => downloadHTML(htmlOutput, `${runLabel}.html`),
        },
        {
            label: 'Blueprint JSON',
            icon: '🗂️',
            disabled: !blueprint,
            action: () => downloadJSON(blueprint, `${runLabel}-blueprint.json`),
        },
        {
            label: 'Imprimir / PDF',
            icon: '🖨️',
            disabled: false,
            action: () => window.print(),
        },
    ];

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    disabled
                        ? 'text-[var(--text-muted)] opacity-50 cursor-not-allowed border border-transparent'
                        : 'text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:bg-[var(--bg-base)] border border-[var(--border-subtle)] shadow-[0_0_15px_rgba(0,255,157,0.1)]'
                }`}
                title="Opciones de descarga"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Exportar</span>
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1 w-48 glass-strong rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-card)] z-50 animate-fade-up">
                    {items.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => { item.action(); setOpen(false); }}
                            disabled={item.disabled}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
