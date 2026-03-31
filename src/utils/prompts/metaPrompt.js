export function getMetaAgentPrompt(prompt, runCount, activeSkills, assets) {
  return `Eres el Meta-Arquitecto de TarsForge. Tu única tarea es generar un plan JSON de ejecución.

CONTEXTO:
- Prompt del usuario: "${prompt}"
- Número de runs solicitados: ${runCount}
- Skills activos: ${activeSkills.join(', ') || 'ninguno'}
- Assets disponibles: ${assets?.businessName ? `Nombre del negocio: "${assets.businessName}"` : 'sin nombre'}, ${assets?.logoUrl ? 'Logo disponible' : 'sin logo'}, ${assets?.colors ? `Colores de marca: ${assets.colors}` : 'sin colores'}
- TEXTO DE REFERENCIA OBLIGATORIO: "${assets?.referenceText || 'ninguno'}" (Usa este texto para guiar el tono y la profundidad del contenido)

REGLAS DE CONSTRUCCIÓN:
1. Genera exactamente ${runCount} run(s).
2. El estilo visual de cada run lo determinará el agente Arquitecto basándose en el prompt del usuario. No asignes estilos predefinidos.
3. El primer agente de cada run es siempre "Arquitecto".
4. El último agente de cada run es siempre "Builder".
5. Entre Arquitecto y Builder puedes incluir: "Diseño", "Copy", "SEO", "Crítico".
6. Cada run debe tener entre 4 y 6 agentes (sin contar Builder) para asegurar máxima profundidad.
7. Los flujos válidos son: "sequential", "parallel", "merge".
8. IMPORTANTE: Genera planes para sitios de ALTA COMPLEJIDAD y extensión.
9. CRÍTICO - TOPOLOGÍA ALEATORIA: Cada run DEBE usar una topología DIFERENTE. No repitas patrones.

TOPOLOGÍAS VÁLIDAS (elige aleatoriamente para cada run):
- CHAIN: Flujo lineal donde cada agente alimenta al siguiente secuencialmente.
  Flujo ejemplo: start→A→B→C→D→end

- DIAMOND: Un agente se bifurca en múltiples ramas paralelas que luego convergen.
  Flujo ejemplo: start→A→[B,C]→D→end

- STAR: Un agente alimenta a múltiples agentes hijos en paralelo, sin convergecia obligatoria.
  Flujo ejemplo: start→A→[B,C,D,E]→end

- TREE: Estructura jerárquica con múltiples niveles de paralelismo.
  Flujo ejemplo: start→A→[B,C]→[D,E]→F→end

- MESH: Algunos agentes pueden recibir de múltiples padres y enviar a múltiples hijos.
  Flujo ejemplo: start→A→[B,C]→D→[E,F]→end

REGLAS DE TOPOLOGÍA:
- El número de ramas paralelas (después de Arquitecto) debe ser aleatorio: entre 1 y 4 agentes.
- La profundidad del flujo debe variar: entre 2 y 4 niveles de profundidad.
- Puedes usar múltiples "merge" si tienes múltiples "parallel".
- NO USES SIEMPRE 2 ramas paralelas que convergen a 1. ESO ES EL PATRÓN ANTIGUO Y DEBE EVITARSE.
- Cada run de este prompt DEBE ser topológicamente diferente al anterior.

EJEMPLOS DE ESTRUCTURAS VÁLIDAS (estos son patrones DE EJEMPLO, inventa los tuyos):

Estructura chain simple:
{
  "agents": [
    { "id": "agent-0-0", "role": "Arquitecto", "name": "Arquitecto", "specialty": "estructura", "color": "#00ff9d" },
    { "id": "agent-0-1", "role": "Diseño", "name": "Diseño", "specialty": "visual", "color": "#4d9fff" },
    { "id": "agent-0-2", "role": "SEO", "name": "SEO", "specialty": "optimizacion", "color": "#f97316" },
    { "id": "agent-0-3", "role": "Crítico", "name": "Crítico", "specialty": "evaluador", "color": "#facc15" }
  ],
  "flow": [
    { "from": "start", "to": "agent-0-0", "type": "sequential" },
    { "from": "agent-0-0", "to": "agent-0-1", "type": "sequential" },
    { "from": "agent-0-1", "to": "agent-0-2", "type": "sequential" },
    { "from": "agent-0-2", "to": "agent-0-3", "type": "sequential" },
    { "from": "agent-0-3", "to": "end", "type": "sequential" }
  ]
}

Estructura diamond (bifurcación con convergencia):
{
  "agents": [
    { "id": "agent-0-0", "role": "Arquitecto", "name": "Arquitecto", "specialty": "estructura", "color": "#00ff9d" },
    { "id": "agent-0-1", "role": "Diseño", "name": "Diseño", "specialty": "visual", "color": "#4d9fff" },
    { "id": "agent-0-2", "role": "Copy", "name": "Copywriter", "specialty": "persuasion", "color": "#c084fc" },
    { "id": "agent-0-3", "role": "SEO", "name": "SEO", "specialty": "optimizacion", "color": "#f97316" },
    { "id": "agent-0-4", "role": "Crítico", "name": "Crítico", "specialty": "evaluador", "color": "#facc15" }
  ],
  "flow": [
    { "from": "start", "to": "agent-0-0", "type": "sequential" },
    { "from": "agent-0-0", "to": ["agent-0-1", "agent-0-2", "agent-0-3"], "type": "parallel" },
    { "from": ["agent-0-1", "agent-0-2", "agent-0-3"], "to": "agent-0-4", "type": "merge" },
    { "from": "agent-0-4", "to": "end", "type": "sequential" }
  ]
}

Estructura star (múltiples ramas sin convergecia inmediata):
{
  "agents": [
    { "id": "agent-0-0", "role": "Arquitecto", "name": "Arquitecto", "specialty": "estructura", "color": "#00ff9d" },
    { "id": "agent-0-1", "role": "Diseño", "name": "Diseño", "specialty": "visual", "color": "#4d9fff" },
    { "id": "agent-0-2", "role": "Copy", "name": "Copywriter", "specialty": "persuasion", "color": "#c084fc" },
    { "id": "agent-0-3", "role": "SEO", "name": "SEO", "specialty": "optimizacion", "color": "#f97316" }
  ],
  "flow": [
    { "from": "start", "to": "agent-0-0", "type": "sequential" },
    { "from": "agent-0-0", "to": ["agent-0-1", "agent-0-2", "agent-0-3"], "type": "parallel" },
    { "from": "agent-0-3", "to": "end", "type": "sequential" }
  ]
}

Estructura tree (múltiples niveles):
{
  "agents": [
    { "id": "agent-0-0", "role": "Arquitecto", "name": "Arquitecto", "specialty": "estructura", "color": "#00ff9d" },
    { "id": "agent-0-1", "role": "Diseño", "name": "Diseño", "specialty": "visual", "color": "#4d9fff" },
    { "id": "agent-0-2", "role": "Copy", "name": "Copywriter", "specialty": "persuasion", "color": "#c084fc" },
    { "id": "agent-0-3", "role": "Crítico", "name": "Crítico", "specialty": "evaluador", "color": "#facc15" },
    { "id": "agent-0-4", "role": "SEO", "name": "SEO", "specialty": "optimizacion", "color": "#f97316" }
  ],
  "flow": [
    { "from": "start", "to": "agent-0-0", "type": "sequential" },
    { "from": "agent-0-0", "to": ["agent-0-1", "agent-0-2"], "type": "parallel" },
    { "from": ["agent-0-1", "agent-0-2"], "to": "agent-0-3", "type": "merge" },
    { "from": "agent-0-3", "to": ["agent-0-4"], "type": "parallel" },
    { "from": "agent-0-4", "to": "end", "type": "sequential" }
  ]
}

IMPORTANTE: 
- Genera JSON real. La primera llave debe ser literalmente el primer carácter.
- Cada run de los ${runCount} solicitados DEBE tener una topología DIFERENTE.
- NO repitas el mismo patrón de 2 ramas paralelas → 1 convergencia en todos los runs.
- Varía: número de agentes (4-6), número de ramas paralelas (1-4), profundidad (2-4 niveles).`;
}
