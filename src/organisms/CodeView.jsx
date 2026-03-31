import { formatHTML, highlightHTML } from '../utils/exporters';
import { useState } from 'react';

export default function CodeView({ htmlOutput }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(htmlOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex-1 h-0 bg-[#0d0d12] font-mono selection:bg-[var(--neon-green)] selection:text-black transition-all duration-300 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0d0d12] z-10 shrink-0">
                <span className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">Source Code (index.html)</span>
                <button
                    onClick={handleCopy}
                    className={`text-[9px] px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1.5 font-bold uppercase tracking-wider ${copied
                        ? 'border-[var(--neon-green)] text-[var(--neon-green)] bg-[var(--neon-green)]/10'
                        : 'border-white/10 text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                        }`}
                >
                    {copied ? (
                        <>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            COPIADO!
                        </>
                    ) : (
                        <>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                            COPIAR
                        </>
                    )}
                </button>
            </div>
            <pre
                className="flex-1 overflow-auto p-6 text-[var(--text-primary)] opacity-95 whitespace-pre leading-relaxed font-mono transition-all duration-300 text-[12px] min-h-0"
                dangerouslySetInnerHTML={{ __html: highlightHTML(formatHTML(htmlOutput)) }}
            />
        </div>
    );
}
