import { useRef, useEffect, useState, useCallback } from 'react';
import { CONSTRUCTION_SCRIPT, WIREFRAME_HTML, EMPTY_HTML, LOCKED_STAGES } from '../constants/previewConfig';
import StatusBar from '../molecules/StatusBar';
import LockedPreview from '../organisms/LockedPreview';
import CodeView from '../organisms/CodeView';
import LivePreview from '../organisms/LivePreview';

const SCROLLBAR_CSS = `<style id="tarsforge-scrollbar">
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #07070d; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.24); }
html { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.12) #07070d; }
</style>`;

export default function PreviewFrame({ blueprint, htmlOutput, previewStage = 'empty', isFullScreen = false, isDone = false, onClose, onFullScreen, alreadyAnimated = false, onAnimated }) {

    const iframeRef = useRef(null);
    const hasAnimatedThisRef = useRef(false);
    const lastRenderRef = useRef({ stage: null, done: false, htmlRaw: null, blueprintRaw: null });
    const viewCodeRef = useRef(false);
    const [showPreview] = useState(true);
    const [viewCode, setViewCode] = useState(false);

    useEffect(() => {
        viewCodeRef.current = viewCode;
    }, [viewCode]);

    useEffect(() => {
        if (htmlOutput && lastRenderRef.current.htmlRaw !== htmlOutput) {
            hasAnimatedThisRef.current = false;
        }
    }, [htmlOutput]);

    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data?.type === 'TARSFORGE_CONSTRUCTION_COMPLETE') {
                if (onAnimated) onAnimated();
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onAnimated]);

    const writeToIframe = useCallback(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        const isFresh = !doc?.body || doc.body.innerHTML.trim() === '';

        if (
            !isFresh &&
            lastRenderRef.current.stage === previewStage &&
            lastRenderRef.current.done === isDone &&
            lastRenderRef.current.htmlRaw === htmlOutput &&
            lastRenderRef.current.blueprintRaw === blueprint
        ) {
            return;
        }

        let html = EMPTY_HTML;

        if ((previewStage === 'live' || previewStage === 'html') && htmlOutput) {
            html = htmlOutput;
            const shouldAnimate = isDone && !alreadyAnimated && !hasAnimatedThisRef.current;
            if (shouldAnimate) {
                hasAnimatedThisRef.current = true;
                const HIDE_STYLE = '<style id="construction-hide-style">body { opacity: 0 !important; background: #050505 !important; }</style>';
                if (html.toLowerCase().includes('<head>')) {
                    html = html.replace(/<head>/i, '<head>' + HIDE_STYLE);
                } else if (html.toLowerCase().includes('<html>')) {
                    html = html.replace(/<html>/i, '<html><head>' + HIDE_STYLE + '</head>');
                } else {
                    html = '<head>' + HIDE_STYLE + '</head>' + html;
                }

                if (html.toLowerCase().includes('</body>')) {
                    html = html.replace(/<\/body>/i, CONSTRUCTION_SCRIPT + '\n</body>');
                } else {
                    html += '\n' + CONSTRUCTION_SCRIPT;
                }
            }
        } else if (previewStage === 'wireframe' || previewStage === 'colored' || previewStage === 'content') {
            const sections = blueprint?.structural_contract?.sections_ordered || ['hero', 'features', 'cta'];
            const palette = blueprint?.design_spec?.palette || {};
            const content = blueprint?.content_spec || {};

            if (previewStage === 'wireframe' || !blueprint?.design_spec) {
                html = WIREFRAME_HTML(sections);
            } else {
                const bg = palette['--bg'] || '#0a0a0f';
                const accent = palette['--accent'] || '#00ff9d';
                const text = palette['--text'] || '#f0f0ff';
                const fontDisplay = blueprint?.design_spec?.typography?.['--font-display']?.split(',')[0]?.replace(/['"]/g, '') || 'sans-serif';
                const fontBody = blueprint?.design_spec?.typography?.['--font-body']?.split(',')[0]?.replace(/['"]/g, '') || 'sans-serif';

                html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter&family=Space+Grotesk:wght@600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { background: ${bg}; color: ${text}; font-family: ${fontBody}, sans-serif; }
  section { padding: 40px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  h1 { font-family: ${fontDisplay}, sans-serif; font-size: clamp(2rem,5vw,3.5rem); color: ${accent}; margin-bottom: 16px; }
  h2 { font-family: ${fontDisplay}, sans-serif; font-size: clamp(1.4rem,3vw,2rem); color: ${accent}; margin-bottom: 12px; }
  p { font-size: 1rem; opacity: 0.75; line-height: 1.6; }
  .btn { display: inline-block; padding: 12px 28px; background: ${accent}; color: ${bg}; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
  .card { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 20px; margin: 8px 0; border: 1px solid rgba(255,255,255,0.08); }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 12px; }
  footer { padding: 24px; text-align: center; opacity: 0.4; font-size: 12px; }
</style></head><body>
<section>${content?.hero ? `<h1>${content.hero.headline || ''}</h1><p>${content.hero.subheadline || ''}</p><a class="btn" href="#">${content.hero.cta_primary?.text || 'Ver más'}</a>` : '<h1 style="opacity:0.3">Hero</h1>'}</section>
<section>${content?.features ? `<h2>${content.features.section_title || ''}</h2><div class="grid">${(content.features.items || []).map(f => `<div class="card"><div style="font-size:1.5rem">${f.icon || ''}</div><strong>${f.title || ''}</strong><p>${f.description || ''}</p></div>`).join('')}</div>` : '<h2 style="opacity:0.3">Features</h2>'}</section>
<section>${content?.testimonials ? `<h2>${content.testimonials.section_title || ''}</h2>${(content.testimonials.items || []).map(t => `<div class="card"><p>"${t.quote || ''}"</p><strong>— ${t.author || ''}</strong></div>`).join('')}` : '<h2 style="opacity:0.3">Testimonials</h2>'}</section>
<section style="text-align:center">${content?.cta ? `<h2>${content.cta.headline || ''}</h2><p>${content.cta.description || ''}</p><a class="btn" href="#">${content.cta.button?.text || 'Comenzar'}</a>` : '<h2 style="opacity:0.3">CTA</h2>'}</section>
<footer>${content?.footer ? `© ${content.footer.copyright_year || 2025} ${content.footer.business_name || ''}` : 'Footer'}</footer>
</body></html>`;
            }
        }

        if (html.includes('</head>')) {
            html = html.replace(/<\/head>/i, SCROLLBAR_CSS + '\n</head>');
        } else if (html.includes('<html')) {
            html = html.replace(/<html[^>]*>/i, '$&<head>' + SCROLLBAR_CSS + '</head>');
        } else {
            html = SCROLLBAR_CSS + '\n' + html;
        }

        if (doc) {
            doc.open();
            doc.write(html);
            doc.close();

            lastRenderRef.current = {
                stage: previewStage,
                done: isDone,
                htmlRaw: htmlOutput,
                blueprintRaw: blueprint
            };
        }
    }, [blueprint, htmlOutput, isDone, previewStage, alreadyAnimated, onAnimated]);

    useEffect(() => {
        if (!showPreview || viewCodeRef.current) return;

        const timeout = setTimeout(() => {
            writeToIframe();
        }, 50);

        return () => clearTimeout(timeout);
    }, [previewStage, htmlOutput, blueprint, showPreview, isDone, writeToIframe, viewCode]);

    const handleViewCode = () => {
        setViewCode((v) => !v);
    };

    const isLocked = LOCKED_STAGES.includes(previewStage);

    return (
        <div className="flex flex-col h-full rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)]">
            <StatusBar
                htmlOutput={htmlOutput}
                viewCode={viewCode}
                onViewCode={handleViewCode}
                onClose={onClose}
                onFullScreen={onFullScreen}
                disabled={isDone && !alreadyAnimated}
            />

            {showPreview && isLocked && (
                <LockedPreview previewStage={previewStage} />
            )}

            {showPreview && !isLocked && (
                viewCode ? (
                    <CodeView htmlOutput={htmlOutput} isFullScreen={isFullScreen} />
                ) : (
                    <LivePreview iframeRef={iframeRef} />
                )
            )}

            {!showPreview && (
                <div className="flex-1 flex items-center justify-center bg-[#07070d]">
                    <p className="text-[var(--text-muted)] text-xs font-mono">Vista pausada</p>
                </div>
            )}
        </div>
    );
}
