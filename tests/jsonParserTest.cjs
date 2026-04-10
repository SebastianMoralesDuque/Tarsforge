const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIG - matches .env
// ============================================================
const API_BASE_URL = process.env.VITE_MODAL_BASE_URL || 'http://localhost:11434/v1/';
const MODEL = process.env.VITE_MODAL_MODEL || 'minimax-m2.7:cloud';

// ============================================================
// JSON PARSER (copied from src/hooks/useGeminiAPI.js)
// ============================================================
function tryParse(text) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}


function fixArrayAsObject(text) {
    let fixed = text;
    let iterations = 0;
    while (iterations < 10) {
        let changed = false;
        const positions = [];
        const regex = /\[\s*"([^"]+)"\s*:/g;
        let m;
        while ((m = regex.exec(fixed)) !== null) {
            positions.push(m.index);
        }
        for (let p = positions.length - 1; p >= 0; p--) {
            const openIdx = positions[p];
            let depth = 0, inStr = false, escape = false;
            let closeIdx = -1;
            for (let i = openIdx; i < fixed.length; i++) {
                const c = fixed[i];
                if (escape) { escape = false; continue; }
                if (c === '\\') { escape = true; continue; }
                if (c === '"' && !escape) { inStr = !inStr; continue; }
                if (inStr) continue;
                if (c === '[' || c === '{') depth++;
                else if (c === ']' || c === '}') { depth--; if (depth === 0) { closeIdx = i; break; } }
            }
            if (closeIdx > 0) {
                const inner = fixed.substring(openIdx + 1, closeIdx);
                const kvCount = (inner.match(/"[^"]+"\s*:/g) || []).length;
                if (kvCount >= 2 && /^\s*"[^"]+"\s*:/.test(inner)) {
                    fixed = fixed.substring(0, openIdx) + '{' + inner + '}' + fixed.substring(closeIdx + 1);
                    changed = true;
                    break;
                }
            }
        }
        if (!changed) break;
        iterations++;
    }
    return fixed;
}

function fixMalformedJSON(text) {
    let fixed = text;
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
    fixed = fixed.replace(/\[\s*\{\s*"([^"]+)"\s*\}\s*\]/g, '["$1"]');
    fixed = fixed.replace(/\{\s*"(?!"[\w-]+":)([^"]+)"\s*\}/g, '"$1"');
    const flowArrayFix = (str) => str.replace(/\[(\s*)\{\s*"(\w+)":\s*\[/g, '[$1[');
    let prev = '';
    let iterations = 0;
    while (prev !== fixed && iterations < 10) {
        prev = fixed;
        fixed = flowArrayFix(fixed);
        iterations++;
    }
    // Fix arrays that should be objects ["key":value, "key2":value2] -> {"key":value, "key2":value2}
    // MUST run BEFORE bracket balancing so counts are correct
    fixed = fixArrayAsObject(fixed);
    iterations = 0;
    while (iterations < 15) {
        const before = fixed;
        const ob = (fixed.match(/\{/g) || []).length;
        const cb = (fixed.match(/\}/g) || []).length;
        if (cb > ob) fixed = fixed.replace(/}(?=[^}]*$)/, '');
        const obr = (fixed.match(/\[/g) || []).length;
        const cbr = (fixed.match(/\]/g) || []).length;
        if (cbr > obr) fixed = fixed.replace(/](?=[^\]]*$)/, '');
        if (fixed === before) break;
        iterations++;
    }
    const flowObjMatch = fixed.match(/"flow":\s*\{/);
    if (flowObjMatch) {
        try {
            const startIdx = fixed.indexOf('"flow":');
            const openBraceIdx = fixed.indexOf('{', startIdx);
            let depth = 0, inStr = false, escape = false;
            let endIdx = -1;
            for (let i = openBraceIdx; i < fixed.length; i++) {
                const c = fixed[i];
                if (escape) { escape = false; continue; }
                if (c === '\\') { escape = true; continue; }
                if (c === '"' && !escape) { inStr = !inStr; continue; }
                if (inStr) continue;
                if (c === '{') depth++;
                else if (c === '}') { depth--; if (depth === 0) { endIdx = i; break; } }
            }
            if (endIdx > 0) {
                const flowObjStr = fixed.substring(openBraceIdx, endIdx + 1);
                const flowParsed = JSON.parse(flowObjStr);
                if (typeof flowParsed === 'object' && !Array.isArray(flowParsed)) {
                    const flowArray = [];
                    const validTypes = ['sequential', 'parallel', 'merge', 'conditional', 'feedback'];
                    for (const [key, value] of Object.entries(flowParsed)) {
                        if (validTypes.includes(key)) {
                            if (Array.isArray(value)) {
                                flowArray.push(...value.map(v => ({ type: key, to: v })));
                            } else {
                                flowArray.push({ type: key, to: value });
                            }
                        }
                    }
                    if (flowArray.length > 0) {
                        fixed = fixed.substring(0, openBraceIdx) +
                            JSON.stringify(flowArray) +
                            fixed.substring(endIdx + 1);
                    }
                }
            }
        } catch (e) {}
    }
    return fixed;
}

function extractPartialJSON(text) {
    const result = {};
    const agentsMatch = text.match(/"agents":\s*\[(\[[\s\S]*?\]\])\]/);
    if (agentsMatch) {
        try {
            result.agents = JSON.parse('[' + agentsMatch[1] + ']');
        } catch {
            const singleAgentMatch = text.match(/"agents":\s*\[([\s\S]*?)\n\s*\]/);
            if (singleAgentMatch) {
                try { result.agents = JSON.parse('[' + singleAgentMatch[1] + ']'); } catch {}
            }
        }
    }
    const sectionsMatch = text.match(/"sections":\s*\[([\s\S]*?)\n\s*\]/);
    if (sectionsMatch) {
        try { result.sections = JSON.parse('[' + sectionsMatch[1] + ']'); } catch {}
    }
    return Object.keys(result).length > 0 ? result : null;
}

function parseJSON(text) {
    if (!text || typeof text !== 'string') return null;
    try {
        // Pre-fix: if text contains JSON keys but is missing opening {, wrap it
        // Pattern: "agents":[...],"flow":[...],"sections":[...]}  (no opening {)
        let preprocessed = text;
        if (/"agents"\s*:/.test(text) && !/^\s*\{/.test(text.trim()) && /\}\s*$/.test(text.trim())) {
            preprocessed = '{' + text.trim();
        }

        const fencedMatch = preprocessed.match(/```json\s*([\s\S]*?)```/);
        if (fencedMatch) {
            const parsed = tryParse(fencedMatch[1].trim());
            if (parsed) return parsed;
        }
        const bracketMatch = preprocessed.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (bracketMatch) {
            const parsed = tryParse(bracketMatch[1].trim());
            if (parsed) return parsed;
            const fixed = fixMalformedJSON(bracketMatch[1]);
            const fixedParsed = tryParse(fixed.trim());
            if (fixedParsed) return fixedParsed;
            const partial = extractPartialJSON(bracketMatch[1]);
            if (partial) return partial;
        }
        return tryParse(preprocessed.trim());
    } catch {
        return null;
    }
}

// ============================================================
// SUPER ORQUESTADOR PROMPT
// ============================================================
function getSuperOrquestadorPrompt(prompt, assets, styleSeed, activeSkills = []) {
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
    { 
      "id": "id-unico", 
      "role": "Rol descriptivo", 
      "name": "Nombre del Agente", 
      "specialty": "Una descripcion muy resumida de su tarea especifica.", 
      "color": "#hexadecimal_vibrante" 
    }
  ],
  "flow": [
    // - "sequential": flujo lineal normal
    // - "parallel": ejecuta multiples agentes a la vez
    // - "merge": une multiples ramas en una sola
    // - "conditional": bifurca segun condicion
    // - "feedback": retroalimentacion
  ],
  "sections": [
    { "id": "hero", "name": "Hero Principal", "headline": "Un headline impactante" }
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
6. TODOS los agentes DEBEN tener color '#hexadecimal' neon vibrante distinto.
7. Genera EXACTAMENTE 10 secciones en 'sections'.
8. El flujo DEBE incluir parallel, merge, y AL MENOS UNA condicion o feedback.
`;
}

// ============================================================
// API CALLER
// ============================================================
async function callModalAPI(systemPrompt, userMessage) {
    const url = `${API_BASE_URL.endsWith('/') ? API_BASE_URL : API_BASE_URL + '/'}chat/completions`;
    const body = {
        model: MODEL,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ],
        temperature: 0.2,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
    };
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(API_KEY && API_KEY !== 'local' ? { 'Authorization': `Bearer ${API_KEY}` } : {})
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error ${res.status}: ${errorText}`);
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || '';
}

// ============================================================
// TEST PROMPTS (25 diverse real-world scenarios)
// ============================================================
const TEST_PROMPTS = [
    { id: 1, name: "SaaS productividad", prompt: "Landing page para una app de productividad con IA que organiza tareas automaticamente", businessName: "TaskFlow AI", styleSeed: "minimalista oscuro tipografico" },
    { id: 2, name: "Restaurante italiano", prompt: "Pagina web para restaurante italiano de alta cocina en Buenos Aires con reservas online", businessName: "Trattoria Bella", styleSeed: "organico natural suturas" },
    { id: 3, name: "Agencia marketing", prompt: "Landing para agencia de marketing digital especializada en e-commerce y growth hacking", businessName: "GrowthLab", styleSeed: "startup energetico gradientes" },
    { id: 4, name: "Portfolio fotografo", prompt: "Sitio portfolio minimalista para fotografo de paisajes y naturaleza, con galeria fullscreen", businessName: "Lens and Light", styleSeed: "editorial limpio revista" },
    { id: 5, name: "Startup fintech", prompt: "Landing page para app fintech de inversiones automatizadas con IA, target millennials", businessName: "InvestBot", styleSeed: "tech futurista holo" },
    { id: 6, name: "Gimnasio boutique", prompt: "Pagina web para gimnasio boutique de crossfit y funcional en zona premium", businessName: "IronBox Studio", styleSeed: "gaming oscuro agresivo" },
    { id: 7, name: "Clinica dental", prompt: "Landing page para clinica dental moderna con tecnologia 3D y sedacion consciente", businessName: "SmileTech", styleSeed: "corporativo confiable azul" },
    { id: 8, name: "E-commerce moda", prompt: "Tienda online de moda sustentable y etica, ropa de algodon organico y materiales reciclados", businessName: "EcoThreads", styleSeed: "organico natural suturas" },
    { id: 9, name: "Consultora RRHH", prompt: "Landing para consultora de recursos humanos especializada en headhunting tech", businessName: "TalentBridge", styleSeed: "corporativo confiable azul" },
    { id: 10, name: "App meditacion", prompt: "Pagina para app de meditacion y mindfulness con sesiones guiadas en espanol", businessName: "InnerPeace", styleSeed: "wellness suave pasteles" },
    { id: 11, name: "Bootcamp programacion", prompt: "Landing page para bootcamp de programacion full-stack con modalidad intensiva 12 semanas", businessName: "CodeForge Academy", styleSeed: "dark luxury premium" },
    { id: 12, name: "Mudanzas premium", prompt: "Sitio web para empresa de mudanzas premium con embalaje especial y seguro total", businessName: "MoveMaster", styleSeed: "geometrico abstracto colorido" },
    { id: 13, name: "Barberia vintage", prompt: "Landing para barberia estilo vintage con servicios premium y reserva online", businessName: "The Gentlemans Cut", styleSeed: "retro-futurista neon" },
    { id: 14, name: "Plataforma UX", prompt: "Pagina web para plataforma de cursos online de diseno UX/UI con certificaciones", businessName: "UXlearn", styleSeed: "glassmorphism vibrante" },
    { id: 15, name: "Veterinaria 24h", prompt: "Landing page para veterinaria de emergencias 24 horas con quirofano equipado", businessName: "PetCare 24/7", styleSeed: "wellness suave pasteles" },
    { id: 16, name: "Coworking space", prompt: "Sitio web para espacio de coworking con oficinas privadas y salas de reuniones", businessName: "HiveWork", styleSeed: "minimalista oscuro tipografico" },
    { id: 17, name: "Cerveceria artesanal", prompt: "Landing para cerveceria artesanal con taproom y tours de la fabrica", businessName: "HopCraft Brewery", styleSeed: "artesanal calido texturas" },
    { id: 18, name: "App delivery comida", prompt: "Pagina para app de delivery de comida saludable con meal prep semanal", businessName: "GreenBite", styleSeed: "startup energetico gradientes" },
    { id: 19, name: "Arquitectura sustentable", prompt: "Landing page para estudio de arquitectura especializado en diseno sustentable y bioclimatico", businessName: "GreenArch Studio", styleSeed: "editorial limpio revista" },
    { id: 20, name: "Plataforma eventos", prompt: "Sitio web para plataforma de gestion de eventos corporativos con ticketing integrado", businessName: "EventHub", styleSeed: "neomorfismo suave monocromatico" },
    { id: 21, name: "Terapia online", prompt: "Landing para plataforma de terapia psicologica online con matching de terapeutas por IA", businessName: "MindBridge", styleSeed: "wellness suave pasteles" },
    { id: 22, name: "Taller mecanico", prompt: "Pagina web para taller mecanico especializado en autos alemanes con diagnostico computarizado", businessName: "GermanAuto Lab", styleSeed: "gaming oscuro agresivo" },
    { id: 23, name: "Tienda electronica", prompt: "E-commerce de componentes electronicos y Arduino con tutoriales integrados", businessName: "MakerParts", styleSeed: "tech futurista holo" },
    { id: 24, name: "Inmobiliaria lujo", prompt: "Landing page para inmobiliaria de propiedades de lujo en Punta del Este con tours virtuales 360", businessName: "Elite Properties", styleSeed: "dark luxury premium" },
    { id: 25, name: "Prompt contradictorio", prompt: "Haz una landing ultra minimalista pero tambien super colorida con muchos efectos y animaciones, que sea seria pero tambien divertida", businessName: "Chaos Design", styleSeed: "brutalismo grafico bold" },
];

// ============================================================
// STRUCTURE VALIDATION
// ============================================================
function validateStructure(parsed) {
    const issues = [];
    if (!parsed || typeof parsed !== 'object') return { valid: false, issues: ['Not an object'] };
    if (!Array.isArray(parsed.agents)) {
        issues.push('agents is not an array');
    } else {
        if (parsed.agents.length < 3) issues.push(`Too few agents (${parsed.agents.length}), need at least 3`);
        if (parsed.agents.length > 10) issues.push(`Too many agents (${parsed.agents.length}), max 10`);
        parsed.agents.forEach((a, i) => {
            if (!a.id) issues.push(`Agent ${i} missing id`);
            if (!a.role) issues.push(`Agent ${i} missing role`);
            if (!a.name) issues.push(`Agent ${i} missing name`);
            if (!a.color) issues.push(`Agent ${i} missing color`);
        });
    }
    if (!parsed.flow) {
        issues.push('flow is missing');
    } else if (!Array.isArray(parsed.flow)) {
        issues.push('flow is not an array (object returned instead)');
    } else {
        if (parsed.flow.length < 3) issues.push(`Too few flow entries (${parsed.flow.length})`);
    }
    if (!Array.isArray(parsed.sections)) {
        issues.push('sections is not an array');
    } else {
        if (parsed.sections.length < 5) issues.push(`Too few sections (${parsed.sections.length}), need at least 5`);
        if (parsed.sections.length > 15) issues.push(`Too many sections (${parsed.sections.length}), max 15`);
        parsed.sections.forEach((s, i) => {
            if (!s.id) issues.push(`Section ${i} missing id`);
            if (!s.name) issues.push(`Section ${i} missing name`);
        });
    }
    return { valid: issues.length === 0, issues };
}

function analyzeResponse(text) {
    if (!text) return null;
    return {
        hasFencedJSON: /```json\s*[\s\S]*?```/.test(text),
        hasExtraText: (() => {
            const stripped = text.replace(/```json\s*[\s\S]*?```/g, '').trim();
            return stripped.length > 0 && !stripped.startsWith('{') && !stripped.startsWith('[');
        })(),
        flowIsObject: /"flow"\s*:\s*\{/.test(text),
        hasTrailingCommas: /,\s*[}\]]/.test(text),
        length: text.length,
    };
}

// ============================================================
// MAIN
// ============================================================
async function main() {
    console.log('=== JSON Parser Test Suite - Real API Calls ===\n');
    console.log(`API: ${API_BASE_URL}`);
    console.log(`Model: ${MODEL}`);
    console.log(`Tests: ${TEST_PROMPTS.length}\n`);

    const failedDir = path.join(__dirname, 'failed-responses');
    if (!fs.existsSync(failedDir)) fs.mkdirSync(failedDir, { recursive: true });

    const results = [];
    let passCount = 0, failCount = 0, errorCount = 0;

    for (const test of TEST_PROMPTS) {
        const num = `[${String(test.id).padStart(2,'0')}/${TEST_PROMPTS.length}]`;
        process.stdout.write(`${num} ${test.name.padEnd(30)} ... `);

        const systemPrompt = getSuperOrquestadorPrompt(test.prompt, { businessName: test.businessName }, test.styleSeed, []);
        const startTime = Date.now();

        try {
            const rawResponse = await callModalAPI(systemPrompt, test.prompt);
            const elapsed = Date.now() - startTime;
            const analysis = analyzeResponse(rawResponse);
            const parsed = parseJSON(rawResponse);
            const parseSuccess = parsed !== null;

            let structureValid = false;
            let structureIssues = [];
            if (parseSuccess) {
                const v = validateStructure(parsed);
                structureValid = v.valid;
                structureIssues = v.issues;
            }

            if (parseSuccess && structureValid) {
                console.log(`PASS  (${elapsed}ms, ${rawResponse.length} chars)`);
                passCount++;
            } else if (parseSuccess && !structureValid) {
                console.log(`PARSED but invalid (${elapsed}ms)`);
                console.log(`   Issues: ${structureIssues.join(', ')}`);
                failCount++;
            } else {
                console.log(`FAIL  (${elapsed}ms, ${rawResponse.length} chars)`);
                console.log(`   Preview: ${rawResponse.substring(0, 120).replace(/\n/g, ' ')}...`);
                failCount++;
            }

            if (!parseSuccess || !structureValid) {
                const failFile = path.join(failedDir, `test-${test.id}-${test.name.replace(/\s+/g, '-')}.txt`);
                fs.writeFileSync(failFile,
                    `TEST ${test.id}: ${test.name}\n` +
                    `Prompt: ${test.prompt}\nStyle: ${test.styleSeed}\n` +
                    `Length: ${rawResponse.length} | Parse: ${parseSuccess} | Valid: ${structureValid}\n` +
                    `Issues: ${structureIssues.join(', ')}\n\n` +
                    `--- RAW RESPONSE ---\n${rawResponse}\n`
                );
            }

            results.push({ id: test.id, name: test.name, parseSuccess, structureValid, elapsed, responseLength: rawResponse.length, analysis, structureIssues, parsed: parseSuccess ? parsed : null });
        } catch (err) {
            const elapsed = Date.now() - startTime;
            console.log(`ERROR (${elapsed}ms): ${err.message}`);
            errorCount++;
            results.push({ id: test.id, name: test.name, parseSuccess: false, structureValid: false, elapsed, responseLength: 0, error: err.message });
        }
    }

    // SUMMARY
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY REPORT');
    console.log('='.repeat(60));
    console.log(`Total tests: ${TEST_PROMPTS.length}`);
    console.log(`PASS (parsed + valid): ${passCount}`);
    console.log(`FAIL (parse/structure): ${failCount}`);
    console.log(`ERROR (API): ${errorCount}`);
    console.log(`Success rate: ${((passCount / TEST_PROMPTS.length) * 100).toFixed(1)}%`);

    const validResults = results.filter(r => !r.error);
    if (validResults.length > 0) {
        const avgTime = validResults.reduce((s, r) => s + r.elapsed, 0) / validResults.length;
        const avgLen = validResults.reduce((s, r) => s + r.responseLength, 0) / validResults.length;
        console.log(`Avg response time: ${avgTime.toFixed(0)}ms`);
        console.log(`Avg response length: ${avgLen.toFixed(0)} chars`);
    }

    console.log('\n--- Response Pattern Analysis ---');
    const fencedCount = results.filter(r => r.analysis?.hasFencedJSON).length;
    const extraTextCount = results.filter(r => r.analysis?.hasExtraText).length;
    const flowObjCount = results.filter(r => r.analysis?.flowIsObject).length;
    console.log(`Markdown fences: ${fencedCount}/${validResults.length}`);
    console.log(`Extra text: ${extraTextCount}/${validResults.length}`);
    console.log(`Flow as object: ${flowObjCount}/${validResults.length}`);

    if (failCount > 0) {
        console.log('\n--- Failed Tests ---');
        results.filter(r => !r.parseSuccess || !r.structureValid).forEach(r => {
            console.log(`  #${r.id} ${r.name}: ${r.error || (r.parseSuccess ? 'invalid structure' : 'parse failed')}`);
            if (r.structureIssues?.length) console.log(`    Issues: ${r.structureIssues.join(', ')}`);
        });
        console.log(`\nFailed responses saved to: ${failedDir}`);
    }

    console.log('\n=== Test Complete ===');
}

// Handle --test flag for manual testing
const args = process.argv.slice(2);
if (args[0] === '--test' && args[1]) {
    const testInput = args.slice(1).join(' ');
    console.log('Testing input length:', testInput.length);
    const result = parseJSON(testInput);
    if (result) {
        console.log('PASS: JSON parsed successfully');
        console.log('Parsed result keys:', Object.keys(result));
    } else {
        console.log('FAIL: Could not parse JSON');
    }
} else {
    main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
}
