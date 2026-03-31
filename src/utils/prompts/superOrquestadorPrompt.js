export function getSuperOrquestadorPrompt(prompt, assets, styleSeed, activeSkills = []) {
  const skilledNames = activeSkills.map(s => s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  
  return `Eres el Planificador Estrategico de TarsForge. Genera un plan inicial para
una landing page en formato JSON. Decide que agentes expertos son necesarios.

INPUT:
- Prompt del usuario: "${prompt}"
- Estilo base: "${styleSeed}"
- Negocio: "${assets?.businessName || 'ninguno'}"
- Skills Disponibles (USA ESTOS NOMBRES SI APLICAN): [${skilledNames.join(', ')}]

OUTPUT - JSON valido con esta estructura exacta:
{
  "agents": [
    // Define entre 4 a 7 agentes creativos especializados. NUNCA el mismo equipo generico.
    { 
      "id": "id-unico", 
      "role": "Rol descriptivo", 
      "name": "Nombre del Agente", 
      "specialty": "Una descripcion muy resumida de su tarea especifica.", 
      "color": "#hexadecimal_vibrante" 
    }
  ],
  "flow": [
    // Crea un flujo COMPLEJO con multiples ramas, nodos de fusion y decisiones.
    // USA ESTOS TIPOS DE CONEXION:
    // - "sequential": flujo lineal normal
    // - "parallel": ejecuta multiples agentes a la vez
    // - "merge": une multiples ramas en una sola
    // - "conditional": bifurca segun condicion
    // - "feedback": retroalimentacion (ej: critic audit loop)
    // El flujo DEBE incluir AL MENOS:
    //   - Una rama paralela con 2+ agentes ejecutandose simultaneamente
    //   - Un nodo de fusion (merge) que una resultados
    //   - Una decision condicional o loop de feedback
  ],
  "sections": [
    { "id": "hero", "name": "Hero Principal", "headline": "Un headline impactante" }
    // ... hasta 10 secciones
  ]
}

REGLAS OBLIGATORIAS:
1. Responde SOLO con JSON valido - sin markdown, sin texto antes ni despues.
2. Tu respuesta DEBE empezar con { y terminar con }. NUNCA empieces con "agents" sin la llave de apertura.
3. CRITICO - SINTAXIS JSON EN CAMPOS "branches":
   - Cuando "branches" contiene claves nombradas como "branch-visual", "desktop", "mobile" etc, USA { } NO [ ].
   - INCORRECTO: "branches":["branch-a":["1","2"],"branch-b":["3","4"]]
   - CORRECTO:   "branches":{"branch-a":["1","2"],"branch-b":["3","4"]}
   - Para "branches" con arrays simples como ["agent-1","agent-2"], USA [ ] normalmente.
4. FLOW: Debe ser un ARRAY de objetos, cada uno con "type", "from", "to". Ejemplo:
   "flow": [{"type":"sequential","from":"start","to":"agent-1"},{"type":"parallel","from":"agent-1","to":["agent-2","agent-3"]}]
5. FLOW COMPLEJO: El grafo debe tener forma de DIAMANTE o ZIG-ZAG, nunca lineal.
   - Evita: start -> A -> B -> C -> D -> end (LINEAL = ABURRIDO)
   - USA: start -> A -> [B, C en paralelo] -> D merge -> E feedback -> end
6. NOMBRES DE AGENTES: 
   - SI UNA SKILL DE LAS DISPONIBLES APLICA, DEBES USAR ESE NOMBRE EXACTO.
   - SI NO, INVENTA UN NOMBRE PROFESIONAL COHERENTE.
7. TODOS los agentes DEBEN tener color '#hexadecimal' neon vibrante distinto.
8. Genera EXACTAMENTE 10 secciones en 'sections'.
9. El flujo DEBE incluir parallel, merge, y AL MENAS UNA condicion o feedback.
10. CRITICO - TODOS LOS AGENTES DEBEN ESTAR CONECTADOS:
    - CADA agente definido en "agents" DEBE aparecer en AL MENOS UNA conexion del "flow" (como "from" o como "to").
    - NO se permiten agentes huérfanos o desconectados.
    - El flujo SIEMPRE debe empezar con "from": "start" y terminar con "to": "end".
    - Si defines N agentes, todos deben tener al menos una entrada y una salida en el grafo.
    - Verifica ANTES de responder que no quede ningun agente sin conexion.
`;
}