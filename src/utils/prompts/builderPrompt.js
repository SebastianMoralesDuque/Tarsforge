import { SKILLS_LIBRARY } from '../../data/skills-library';

export function getBuilderPrompt(blueprint, assets, activeSkills, promptOriginal) {
  const sectionsText = blueprint.sections 
    ? blueprint.sections.map(s => `- [${s.id}] ${s.name}: ${s.headline}`).join('\\n')
    : 'No se definieron secciones. Usa tu criterio.';

  const skillDetails = activeSkills && activeSkills.length > 0
    ? activeSkills.map(s => `=== ${s.toUpperCase()} ===\\n${SKILLS_LIBRARY[s] || 'Sin detalles'}`).join('\\n\\n')
    : 'Ninguna skill activa';

  let assetsInstructions = '';
  if (assets) {
    if (assets.logoUrl) assetsInstructions += `\\n- Integra el logo proporcionado en la barra de navegación usando esta URL: ${assets.logoUrl}`;
    if (assets.businessName) assetsInstructions += `\\n- El nombre del negocio es: ${assets.businessName}. Úsalo en el copy principal y footer.`;
    const validColors = assets.colors ? assets.colors.split(',').map(c => c.trim()).filter(Boolean).join(', ') : '';
    if (validColors) assetsInstructions += `\\n- Se proporcionaron los siguientes colores de marca: ${validColors}. Úsalos como base o acentos principales en tu CSS.`;
    if (assets.referenceText) assetsInstructions += `\\n- Usa este texto como contexto clave o intégralo visualmente si aplica: ${assets.referenceText}`;

    if (assets.hasUnsplash && assets.heroImage && !assets.heroImage.isFallback) {
      assetsInstructions += `\n\n🖼️ IMÁGENES DE UNSPLASH DISPONIBLES PARA ESTA LANDING:`;
      assetsInstructions += `\n- 🔥 HERO IMAGE (OBLIGATORIA PARA EL HERO SECTION):`;
      assetsInstructions += `\n  URL: "${assets.heroImage.url}"`;
      assetsInstructions += `\n  ALT: "${assets.heroImage.alt}"`;
      assetsInstructions += `\n  AUTOR: "${assets.heroImage.author}"`;
      assetsInstructions += `\n- CRITICO: El HERO SECTION debe usar esta imagen OBLIGATORIAMENTE.`;
      
      if (assets.unsplashImages && assets.unsplashImages.length > 0) {
        const validImages = assets.unsplashImages.filter(img => !img.isFallback);
        if (validImages.length > 0) {
          assetsInstructions += `\n- 📷 IMÁGENES SECUNDARIAS (usa en otras secciones):`;
          validImages.forEach((img, i) => {
            assetsInstructions += `\n  Imagen ${i + 2}: URL="${img.url}" ALT="${img.alt}"`;
          });
        }
        const fallbackImages = assets.unsplashImages.filter(img => img.isFallback);
        if (fallbackImages.length > 0) {
          assetsInstructions += `\n- ⚠️ ALGUNAS IMÁGENES NO ESTÁN DISPONIBLES. Genera placeholders visuales con CSS puro (gradientes, patrones, formas geométricas) para las secciones que necesiten imagen.`;
        }
      }
      
      assetsInstructions += `\n  Usa: <img src="URL" alt="DESCRIPCION" loading="lazy">`;
      assetsInstructions += `\n  La primera imagen (hero) debe tener loading="eager" y fetchpriority="high"`;
    } else if (assets.hasUnsplash && assets.heroImage && assets.heroImage.isFallback) {
      assetsInstructions += `\n\n⚠️ LAS IMÁGENES DE UNSPLASH NO ESTÁN DISPONIBLES. Debes generar placeholders visuales atractivos usando SOLO CSS puro (gradientes, patrones, formas geométricas, clip-path, pseudo-elementos ::before/::after) para todas las secciones que normalmente llevarían imágenes. NO uses URLs externas para imágenes.`;
    }
  }

  return `Eres el Agente Builder Maestro. Tu tarea es generar la Landing Page COMPLETA (Estructura, Diseño, Copy y SEO) en un solo paso devolviendo el código HTML final con CSS embebido.

PROMPT DEL USUARIO: "${promptOriginal}"

SECCIONES PLANIFICADAS (DEBES IMPLEMENTAR TODAS):
${sectionsText}

=== SKILLS ACTIVAS ===
${skillDetails}

REGLAS DE OUTPUT:
1. Devuelve EXCLUSIVAMENTE código HTML. Primera línea: <!DOCTYPE html>
2. CSS completo en un bloque <style> dentro del <head>. Genera un diseño de ALTO NIVEL, moderno y profesional, coherente con la solicitud del usuario (con espaciados generosos, animaciones sutiles, gradientes, etc.).
3. Genera contenido persuasivo para CADA sección de la lista "SECCIONES PLANIFICADAS", basándote en su "headline". Descripciones de 60-80 palabras, sub-headlines concisos y CTAs claros. Evita redundancia entre secciones.
4. Genera la PALETA DE COLORES y selecciona la TIPOGRAFÍA (vía Google Fonts) integrándola en tu CSS. Respeta los colores provistos en Assets si existen, de lo contrario créalos tú.
5. Incluye SEO básico en el <head> (title tag, meta description coherente con el negocio).
6. Haz la página Responsive mobile-first usando media queries, y da soporte nativo a DARK MODE mediante @media (prefers-color-scheme: dark).
7. NO incluyas ningún texto, explicación ni bloque de código (markdown). Empieza con la etiqueta <!DOCTYPE html> y termina con </html>.
8. PROHIBIDO usar SVG. NO generes NINGÚN elemento <svg>, ni <path>, ni inline SVG, ni data:image/svg+xml. Usa SOLO CSS puro para íconos, decoraciones, separadores y efectos visuales (bordes, gradients, box-shadow, pseudo-elementos ::before/::after, clip-path). Si necesitas un ícono, crea una versión CSS-only o usa emojis unicode.
${assetsInstructions}

Sin texto. Sin markdown. Solo HTML.`;
}