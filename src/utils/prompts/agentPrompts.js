export function getDesignPrompt(prompt, structuralContract, assets, styleSeed) {
  return `Eres el Agente de Diseño Visual. Crea una identidad visual impactante.

ESTILO OBLIGATORIO PARA ESTE RUN: "${styleSeed}"
IMPORTANTE: El estilo "${styleSeed}" tiene PRIORIDAD ABSOLUTA sobre cualquier indicación de la estructura del arquitecto. Si hay conflicto, obedece al estilo.
Todas tus decisiones deben reflejar este estilo de forma consistente.

PROMPT: "${prompt}"
COLORES DE MARCA: ${assets?.colors || 'ninguno'}
ESTRUCTURA: ${structuralContract || 'sin estructura definida aún'}

===DISEÑO===
Planifica el diseño visual en texto libre. Incluye:

1. RESUMEN VISUAL: Describe la estética general (ej: "Neon Cyberpunk Minimalista con acentos de cristal")
2. PALETA DE COLORES: Especifica colores exactos HEX para primario, secundario, acento, fondo, texto
3. TIPOGRAFÍA: Fuentes de Google Fonts recomendadas y escala (tamaños para h1, h2, body, etc)
4. LAYOUT Y ESPACIADO: Describe gaps, padding, márgenes y bordes redondeados
5. ESTILOS DE COMPONENTES: Cómo se ven botones, cards, navegación, footers
6. ANIMACIONES: Micro-interacciones recomendadas (hover, transiciones, efectos)

Sé específico con los valores HEX. El Builder necesita datos concretos para implementar.

Tu respuesta será pasada directamente al Builder sin procesamiento. Usa el formato:
===DISEÑO===
[Tu planificación aquí]`;
}

export function getCopyPrompt(prompt, structuralContract, assets, styleSeed) {
  return `Eres el Agente Copywriter Persuasivo. Escribe textos que conviertan.

ESTILO OBLIGATORIO PARA ESTE RUN: "${styleSeed}"
IMPORTANTE: El estilo "${styleSeed}" tiene PRIORIDAD ABSOLUTA sobre cualquier indicación de la estructura del arquitecto. Si el tono sugerido difiere, obedece radicalmente al estilo.
Todas tus decisiones deben reflejar este estilo de forma consistente.

PROMPT: "${prompt}"
${assets?.businessName ? `NOMBRE DEL NEGOCIO (OBLIGATORIO): "${assets.businessName}". Todos los textos deben mencionar la marca de forma natural.` : ''}
TEXTO DE REFERENCIA / GUÍA DE TONO: "${assets?.referenceText || 'ninguno'}"
ESTRUCTURA: ${structuralContract || 'sin estructura definida aún'}

===COPY===
Planifica todo el contenido textual en texto libre. Para cada sección incluye:

1. HEADLINE: Título principal con gancho emocional (mínimo 8-10 palabras)
2. SUBHEADLINE: Expansión de la promesa (15-20 palabras)
3. DESCRIPTION: Copy persuasivo de 120-150 palabras (storytelling, solución, autoridad)
4. CTA: Texto del botón de llamada a la acción (3-4 palabras, urgente)

Evita listas cortas o textos genéricos. El contenido debe sentirse premium, no placeholder.
El nombre del negocio "${assets?.businessName || 'N/A'}" debe aparecer naturalmente en al menos 3-4 secciones.

Tu respuesta será pasada directamente al Builder sin procesamiento. Usa el formato:
===COPY===
[Tu planificación aquí]`;
}

export function getCriticPrompt(blueprint) {
  const hasStructural = blueprint?.structural_contract;
  const hasDesign = blueprint?.design_spec;
  const hasContent = blueprint?.content_spec;
  const hasSEO = blueprint?.seo_spec;

  const status = [
    hasStructural ? '✓ Estructura' : '✗ Sin estructura',
    hasDesign ? '✓ Diseño' : '✗ Sin diseño',
    hasContent ? '✓ Contenido' : '✗ Sin contenido',
    hasSEO ? '✓ SEO' : '✗ Sin SEO',
  ].join(' | ');

  const blueprintData = hasStructural || hasDesign || hasContent || hasSEO
    ? JSON.stringify(blueprint, null, 2)
    : 'Sin datos disponibles aún';

  return `Eres el Agente Crítico de Calidad. Evalúa el Blueprint acumulado.

ESTADO DEL BLUEPRINT: ${status}

BLUEPRINT ACTUAL:
${blueprintData}

===CRÍTICO===
Evalúa en texto libre. Incluye:

1. RESUMEN: Resultado breve de tu evaluación (ej: "Aprobado con ajustes menores")
2. APROBADO: ¿Sí o no?
3. COHERENCIA: Score del 0 al 1 indicando qué tan coherente es el conjunto
4. PROBLEMAS ENCONTRADOS: Lista de issues específicos que el Builder debe resolver
5. SUGERENCIAS: Cómo arreglar cada problema encontrado

Sé honesto en tu evaluación. El Builder usará tu feedback directamente.

Tu respuesta será pasada directamente al Builder sin procesamiento. Usa el formato:
===CRÍTICO===
[Tu evaluación aquí]`;
}

export function getSEOPrompt(prompt, structuralContract, contentSpec, styleSeed) {
  return `Eres el Agente Estratega SEO. Optimiza para visibilidad.

ESTILO OBLIGATORIO PARA ESTE RUN: "${styleSeed}"
IMPORTANTE: El estilo "${styleSeed}" tiene PRIORIDAD y dicta la dirección semántica.
Todas tus decisiones deben reflejar este estilo de forma consistente.

PROMPT: "${prompt}"
CONTENIDO: ${contentSpec || 'sin contenido definido aún'}

===SEO===
Planifica la estrategia SEO en texto libre. Incluye:

1. TITLE TAG: El título exacto para la etiqueta <title> (50-60 caracteres)
2. META DESCRIPTION: Descripción meta exacta (150-160 caracteres)
3. KEYWORDS: Lista de keywords principales separadas por comas
4. ESTRUCTURA SEMÁNTICA: Recomendaciones de H1, H2, H3 para las secciones

Sé concreto con los valores. El Builder necesita los textos exactos para implementar.

Tu respuesta será pasada directamente al Builder sin procesamiento. Usa el formato:
===SEO===
[Tu planificación aquí]`;
}