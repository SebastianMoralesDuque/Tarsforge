export const CONSTRUCTION_SCRIPT = `
<script>
  (function() {
    const startConstruction = () => {
      if (window.__tarsforge_constructing) return;
      window.__tarsforge_constructing = true;

      const elements = (() => {
        const sequence = [];
        const atomicTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'img', 'button', 'a', 'li', 'blockquote', 'pre', 'code', 'label', 'input', 'textarea', 'select', 'svg', 'canvas'];
        
        const walk = (node) => {
          if (!node || node.nodeType !== 1) return;
          try {
            const tag = node.tagName.toLowerCase();
            if (['script', 'style', 'link', 'meta', 'noscript', 'template'].includes(tag)) return;
            const style = window.getComputedStyle(node);
            const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
            if (!isVisible) return;
            const hasVisuals = style.backgroundColor !== 'rgba(0, 0, 0, 0)' || style.borderWidth !== '0px' || style.boxShadow !== 'none';
            const isStructural = ['header', 'nav', 'section', 'footer', 'main', 'aside', 'article'].includes(tag);
            if (hasVisuals || isStructural || atomicTags.includes(tag)) {
              sequence.push(node);
            }
            if (!atomicTags.includes(tag)) {
              Array.from(node.children).forEach(child => walk(child));
            }
          } catch(e) { /* ignore */ }
        };

        walk(document.body);
        return [...new Set(sequence)];
      })();

      if (elements.length === 0) {
        const hideStyle = document.getElementById('construction-hide-style');
        if (hideStyle) hideStyle.remove();
        document.body.style.opacity = '1';
        return;
      }

      const originalBg = document.body.style.backgroundColor;
      const originalBgImage = document.body.style.backgroundImage;
      const originalMinHeight = document.body.style.minHeight;
      const originalMargin = document.body.style.margin;

      elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.filter = 'blur(10px)';
        el.style.transition = 'all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
        el.style.pointerEvents = 'none';
      });

      document.body.style.backgroundImage = 'linear-gradient(rgba(0, 255, 136, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.05) 1px, transparent 1px)';
      document.body.style.backgroundSize = '20px 20px';
      document.body.style.backgroundColor = '#050505';
      document.body.style.minHeight = '100vh';
      document.body.style.margin = '0';
      document.documentElement.style.scrollBehavior = 'smooth';
      document.body.style.overflowX = 'hidden';

      const hideStyle = document.getElementById('construction-hide-style');
      if (hideStyle) hideStyle.remove();
      document.body.style.opacity = '1';


      let index = 0;
      function revealNext() {
        if (index >= elements.length) {
          document.body.style.backgroundImage = originalBgImage;
          document.body.style.backgroundColor = originalBg;
          document.body.style.minHeight = originalMinHeight;
          document.body.style.margin = originalMargin;
          setTimeout(() => { 
            window.parent.postMessage({ type: 'TARSFORGE_CONSTRUCTION_COMPLETE' }, '*');
          }, 500);
          return;
        }

        const el = elements[index];
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.filter = 'blur(0)';
        el.style.pointerEvents = 'auto';
        
        try {
          const rect = el.getBoundingClientRect();
          const absoluteTop = rect.top + window.scrollY;
          
          const targetScroll = absoluteTop - (window.innerHeight / 3);
          window.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
        } catch(e) {}

        index++;
        setTimeout(revealNext, 250); 
      }

      setTimeout(revealNext, 500);
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      startConstruction();
    } else {
      window.addEventListener('DOMContentLoaded', startConstruction);
    }

    setTimeout(() => {
      const hideStyle = document.getElementById('construction-hide-style');
      if (hideStyle) {
        hideStyle.remove();
        document.body.style.opacity = '1';
      }
    }, 3000);
  })();
</script>`;

export const WIREFRAME_HTML = (sections = ['hero', 'features', 'about', 'testimonials', 'cta', 'footer']) => `
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body { margin: 0; background: #0a0a0f; font-family: sans-serif; }
  .section { border: 1px dashed rgba(255,255,255,0.15); margin: 12px; border-radius: 8px; padding: 20px; display: flex; align-items: center; justify-content: center; }
  .section-label { color: rgba(255,255,255,0.25); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
  .hero { height: 160px; background: rgba(0,255,157,0.03); }
  .features { height: 100px; background: rgba(77,159,255,0.03); }
  .about { height: 80px; }
  .testimonials { height: 80px; }
  .cta { height: 80px; background: rgba(0,255,157,0.03); }
  .footer { height: 50px; }
</style></head><body>
${sections.map((s) => `<div class="section ${s}"><span class="section-label">${s}</span></div>`).join('')}
</body></html>
`;

export const EMPTY_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{margin:0;background:#07070d;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;}
.msg{color:rgba(255,255,255,0.2);font-size:12px;text-align:center;}
.loader { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(0,255,157,0.2); border-radius: 50%; border-top-color: #00ff9d; animation: spin 1s ease-in-out infinite; margin-bottom: 12px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style></head>
<body><div style="display:flex; flex-direction:column; align-items:center;"><div class="loader"></div><div class="msg">Orquestando agentes...<br/>Construyendo preview</div></div></body></html>`;

export const STAGE_MESSAGES = {
  architect: '🧠 Definiendo estructura neuronal...',
  design: '🎨 Pintando la paleta de colores...',
  copy: '✍️ Escribiendo copy persuasivo...',
  seo: '🔍 Optimizando para buscadores...',
  critic: '👁️ Auditoría de calidad...',
  assembling: '⚙️ Finalizando conexiones...',
  building: '🔨 Construyendo HTML pixel por pixel...',
};

export const STAGE_LABELS = {
  empty: 'Esperando diseño...',
  architect: '🏗️ Arquitectura',
  design: '🎨 Diseño & Copy',
  critic: '👁️ Revisión Final',
  assembling: '⚙️ Finalizando',
  building: '🔨 Construyendo',
  wireframe: '🏗️ Estructura base',
  colored: '🎨 Aplicando estilos',
  content: '✍️ Añadiendo contenido',
  live: '✨ Renderización Final',
  html: '⚡ Renderizando HTML'
};

export const LOCKED_STAGES = ['architect', 'design', 'critic', 'assembling', 'building'];
