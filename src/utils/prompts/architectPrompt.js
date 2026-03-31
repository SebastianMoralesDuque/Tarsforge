export function getArchitectPrompt(prompt, assets, styleSeed) {
  return `Eres el Agente Arquitecto Senior. Define la estructura maestra.

ESTILO OBLIGATORIO PARA ESTE RUN: "${styleSeed}"
Todas tus decisiones estructurales deben reflejar este estilo de forma consistente.

PROMPT DEL USUARIO: "${prompt}"
${assets?.businessName ? `NOMBRE DEL NEGOCIO: "${assets.businessName}" (ÚSALO PARA NOMBRAR EL BLUEPRINT Y LAS SECCIONES)` : ''}
LOGO: ${assets?.logoUrl || 'ninguno'}
COLORES DE MARCA: ${assets?.colors || 'ninguno'}
TEXTO DE REFERENCIA / CONTEXTO: "${assets?.referenceText || 'ninguno'}"

===ARQUITECTO===
Planifica la estructura de la landing page en texto libre. Incluye:

1. SECCIONES (10-15): Lista cada sección con una descripción breve de qué contiene y cómo se ve visualmente
2. TOKENS CSS: Define colores (HEX), espaciado, radios de borde, fuentes y sombras que usarás
3. CLASES CSS ÚTILES: Menciona clases de Tailwind o CSS personalizado que recomiendas (glassmorphism, gradients, animations)
4. NOTAS TÉCNICAS: Cualquier restricción o consideración para que el builder mantenga coherencia

Sé específico y detallado. El Builder usará tu descripción directamente para generar el HTML.

Tu respuesta será pasada directamente al Builder sin procesamiento. Usa el formato:
===ARQUITECTO===
[Tu planificación aquí]`;
}