import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Button from '../atoms/Button';

export default function AssetPanel() {
    const { assets, setAssets } = useApp();
    const [open, setOpen] = useState(true);

    const handleColorChange = (index, value) => {
        let colors = assets.colors ? assets.colors.split(',').map(c => c.trim()) : [];
        if (colors.length < 3) colors = [...colors, ...Array(3 - colors.length).fill('')];
        colors[index] = value;
        setAssets({ colors: colors.join(', ') });
    };

    const colorArray = assets.colors ? assets.colors.split(',').map(c => c.trim()) : ['', '', ''];

    return (
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-mid)] overflow-hidden shadow-lg shadow-black/20 animate-fade-up">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between p-3 px-4 hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer group"
            >
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse"></span>
                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Recursos</h3>
                </div>
                <div className="flex items-center gap-3">
                    {Object.values(assets).filter(val => val && String(val).replace(/,/g, '').trim() !== '').length > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--neon-green)] text-[var(--bg-base)]">
                            {Object.values(assets).filter(val => val && String(val).replace(/,/g, '').trim() !== '').length}
                        </span>
                    )}
                    <svg
                        className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {open && (
                <div className="p-3 space-y-3 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] animate-fade-up">
                    <div className="space-y-1">
                        <label className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                            <span>🏢</span> Nombre del negocio
                        </label>
                        <input
                            type="text"
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[11px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-green)] transition-all"
                            placeholder="Vacuna app"
                            value={assets.businessName || ''}
                            onChange={(e) => setAssets({ businessName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="flex flex-col gap-0.5 text-[10px] text-[var(--text-secondary)]">
                            <div className="flex items-center gap-1.5">
                                <span>🎨</span> Colores de marca
                            </div>
                        </label>
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map(index => (
                                <div key={index} className="flex-1 relative">
                                    <input
                                        type="color"
                                        className="w-full h-7 opacity-0 absolute inset-0 cursor-pointer"
                                        value={colorArray[index] || '#000000'}
                                        onChange={(e) => handleColorChange(index, e.target.value)}
                                        title="Seleccionar color"
                                    />
                                    <div
                                        className="w-full h-7 rounded border border-[var(--border-subtle)] flex items-center justify-center pointer-events-none text-[10px]"
                                        style={{ backgroundColor: colorArray[index] || 'transparent' }}
                                    >
                                        {!colorArray[index] && <span className="text-[10px] text-[var(--text-muted)]">+</span>}
                                    </div>
                                    {colorArray[index] && (
                                        <button
                                            type="button"
                                            className="absolute -top-1 -right-1 bg-[var(--bg-card)] rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] border border-[var(--border-subtle)] z-10 hover:text-[var(--neon-green)]"
                                            onClick={() => handleColorChange(index, '')}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                            <span>🖼️</span> URL del logo
                        </label>
                        <input
                            type="text"
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[11px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-green)] transition-all"
                            placeholder="https://..."
                            value={assets.logoUrl || ''}
                            onChange={(e) => setAssets({ logoUrl: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                            <span>📄</span> Texto de referencia
                        </label>
                        <textarea
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[11px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-green)] resize-none h-12 transition-all"
                            placeholder="Descripción del negocio..."
                            value={assets.referenceText || ''}
                            onChange={(e) => setAssets({ referenceText: e.target.value })}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
