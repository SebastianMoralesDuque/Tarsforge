import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useGeminiAPI } from './useGeminiAPI';
import { AGENT_STATES, STYLE_SEEDS } from '../constants/agents';
import { getSuperOrquestadorPrompt, getBuilderPrompt } from '../utils/prompts';
import { extractValidHTML } from '../utils/htmlExtractor';
import { sleep } from '../utils/retryHelpers';
import { getMultipleImages } from '../utils/imageService';
import { extractKeywordsFromPrompt } from '../utils/orchestrator';


export function useOrchestrator() {
    const { prompt, runCount, activeSkills, assets, setPage, initRuns, updateAgent, updateRun } = useApp();
    const { callAgentJSON, streamAgent } = useGeminiAPI();

    const simulateAgentWork = useCallback(async (runIndex, agent, messages, delayMs = 800, checkCancel = () => false) => {
        updateAgent(runIndex, agent.id, { state: AGENT_STATES.WORKING, progress: 0 });

        for (let i = 0; i < messages.length; i++) {
            if (checkCancel()) break;
            await sleep(delayMs);
            if (checkCancel()) break;
            updateAgent(runIndex, agent.id, {
                streamText: messages[i],
                progress: Math.round(((i + 1) / messages.length) * 100)
            });
        }

        updateAgent(runIndex, agent.id, {
            state: AGENT_STATES.DONE,
            progress: 100,
            streamText: checkCancel() ? 'Completado.' : messages[messages.length - 1]
        });
    }, [updateAgent]);

    const executeRun = useCallback(
        async (runIndex, runPlan, rawOrquestadorResponse, imagePromise) => {
            try {
                updateRun(runIndex, { status: 'running', previewStage: 'architect' });

                const context = { streamDone: false };

                // 1. ARRANCAR GENERACION REAL EN PARALELO INMEDIATAMENTE
                const buildRealHtml = async () => {
                    let imageAssets = { hasUnsplash: false };
                    if (imagePromise) {
                        updateRun(runIndex, { previewStage: 'fetching-images' });
                        imageAssets = await imagePromise;
                    }
                    const mergedAssets = { ...assets, ...imageAssets };
                    const builderSystem = getBuilderPrompt(runPlan.blueprint, mergedAssets, activeSkills, prompt);

                    let html = '';
                    const builderModel = import.meta.env.VITE_MODAL_MODEL2;
                    html = await streamAgent(
                        builderSystem,
                        `Genera el HTML completo de la landing page según el Blueprint proporcionado.`,
                        (chunk, full) => {
                            html = full;
                            const progress = Math.min(99, 10 + (full.length / 500));
                            updateAgent(runIndex, 'builder-implicit', { progress });
                        },
                        false,
                        builderModel
                    );
                    context.streamDone = true;



                    return html;
                };

                const realBuildPromise = buildRealHtml();

                // 2. SIMULAR EL GRAFO GRAFICO
                await sleep(500);

                for (const agent of runPlan.agents) {
                    if (context.streamDone) {
                        updateAgent(runIndex, agent.id, { state: AGENT_STATES.DONE, progress: 100 });
                        continue;
                    }
                    const r = (agent.role || agent.role || '').toLowerCase();
                    let finishVerb = 'completado su fase';

                    if (r.includes('arch') || r.includes('arqui')) finishVerb = 'estructurado la base neuronal';
                    else if (r.includes('design') || r.includes('disen')) finishVerb = 'diseñado el entorno visual';
                    else if (r.includes('copy') || r.includes('escrit')) finishVerb = 'redactado el contenido persuasivo';
                    else if (r.includes('seo') || r.includes('optim')) finishVerb = 'optimizado el posicionamiento';
                    else if (r.includes('critic') || r.includes('revis')) finishVerb = 'auditado la calidad del flujo';
                    else if (r.includes('build') || r.includes('constr')) finishVerb = 'construido los componentes';
                    else if (r.includes('translate') || r.includes('traduc')) finishVerb = 'traducido los activos';
                    else if (r.includes('ux') || r.includes('user')) finishVerb = 'pulido la experiencia de usuario';
                    else {
                        const fallbacks = ['sintetizado su lógica estratégica', 'finalizado su análisis de datos', 'procesado sus requerimientos', 'concluido su operación técnica'];
                        finishVerb = fallbacks[Math.abs(agent.id?.length || 0) % fallbacks.length];
                    }

                    const messages = [
                        `Configurando entorno del ${agent.role || 'agente'}...`,
                        `Analizando ${agent.specialty?.toLowerCase() || 'requerimientos'}...`,
                        `Procesando lógica de ${agent.role || 'sistema'}...`,
                        `Sintetizando activos de ${agent.role || 'módulo'}...`,
                        `¡${agent.role} ha ${finishVerb}!`
                    ];
                    // 5 mensajes a 3000ms = 15 segundos por agente (+5s que antes)
                    await simulateAgentWork(runIndex, agent, messages, 3000, () => context.streamDone);
                    if (!context.streamDone) await sleep(500);
                }

                if (!context.streamDone) {
                    updateRun(runIndex, { previewStage: 'assembling' });
                    const compilerAgentId = 'fake-compiler-agent';
                    updateRun(runIndex, (currentRun) => {
                        const lastAgentIds = currentRun.agents
                            .filter(a => !['builder', 'builder-implicit'].includes(a.id))
                            .map(a => a.id);
                        const lastAgentId = lastAgentIds[lastAgentIds.length - 1];

                        const compilerAgent = {
                            id: compilerAgentId,
                            role: 'compiler',
                            name: 'Compilador UI',
                            specialty: 'Ensamblaje Visual',
                            description: 'Generando entorno virtualizado...',
                            state: AGENT_STATES.PENDING,
                            progress: 0,
                            streamText: '',
                            color: '#c084fc',
                        };

                        const newEdge = lastAgentId ? {
                            from: lastAgentId,
                            to: compilerAgentId,
                            type: 'sequential'
                        } : null;

                        return {
                            agents: [...currentRun.agents, compilerAgent],
                            flow: newEdge ? [...currentRun.flow, newEdge] : currentRun.flow
                        };
                    });

                    updateAgent(runIndex, compilerAgentId, { state: AGENT_STATES.WORKING, progress: 20 });

                    const compileMsgs = ['Ensamblando...', 'Optimizando...', 'Renderizando estado en vivo...'];
                    for (let i = 0; i < compileMsgs.length; i++) {
                        if (context.streamDone) break;
                        updateAgent(runIndex, compilerAgentId, { streamText: compileMsgs[i], progress: 40 + (i * 20) });
                        // 22 segundos entre 3 mensajes = ~7333ms
                        await sleep(7333);
                    }
                    updateAgent(runIndex, compilerAgentId, { state: AGENT_STATES.DONE, progress: 100, streamText: 'Completado.' });
                    await sleep(500);
                }

                if (!context.streamDone) {
                    updateRun(runIndex, { previewStage: 'building' });
                    updateAgent(runIndex, 'builder-implicit', { state: AGENT_STATES.WORKING, progress: 10 });
                }

                // Esperamos que se resuelva si aún le falta
                const htmlOutput = await realBuildPromise;

                const cleanHtml = extractValidHTML(htmlOutput);
                if (!cleanHtml) {
                    throw new Error('Builder no generó HTML válido');
                }

                updateRun(runIndex, {
                    htmlOutput: cleanHtml,
                    blueprint: runPlan.blueprint,
                    status: 'done',
                    previewStage: 'live',
                });

                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("¡El código está listo!", {
                        body: "El HTML final se ha generado. Vuelve a Tarsforge para ver la construcción en vivo.",
                        icon: "/favicon.ico"
                    });
                }
            } catch (err) {
                updateRun(runIndex, { status: 'error' });
                throw err;
            }
        },
        [prompt, assets, activeSkills, simulateAgentWork, streamAgent, updateAgent, updateRun]
    );

    const startOrchestration = useCallback(async () => {
        if (!prompt.trim()) return;

        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }

        try {
            // Disparar promesa de imágenes en paralelo a la llamada 1
            const hasUnsplash = Boolean(import.meta.env.VITE_UNSPLASH);
            const useUnsplash = activeSkills?.includes('ai-image-generation') && hasUnsplash;
            let imagePromise = null;

            if (useUnsplash) {
                const keywords = extractKeywordsFromPrompt(prompt);
                imagePromise = getMultipleImages(keywords, 5).then(([heroImage, ...otherImages]) => ({
                    heroImage,
                    unsplashImages: otherImages,
                    hasUnsplash: true,
                    businessKeywords: keywords.slice(0, 3)
                })).catch(() => {
                    return {};
                });
            }

            // Call superOrquestador once per run IN PARALLEL so each run gets a unique plan
            const styleSeeds = [];
            const usedIndices = new Set();
            while (styleSeeds.length < runCount && styleSeeds.length < STYLE_SEEDS.length) {
                const idx = Math.floor(Math.random() * STYLE_SEEDS.length);
                if (!usedIndices.has(idx)) {
                    usedIndices.add(idx);
                    styleSeeds.push(STYLE_SEEDS[idx]);
                }
            }

            const superOrquestadorModel = import.meta.env.VITE_MODAL_MODEL;

            const superPlans = await Promise.all(
                Array.from({ length: runCount }, (_, i) => {
                    const seed = styleSeeds[i % styleSeeds.length];
                    const systemPrompt = getSuperOrquestadorPrompt(prompt, assets, seed, activeSkills);
                    return callAgentJSON(
                        systemPrompt + `\n\nNOTA: Este es el run #${i + 1} de ${runCount}. Genera un enfoque DIFERENTE a los demás runs. Varía topología, agentes y estilo.`,
                        `Genera la planificación completa para esta landing page.`,
                        superOrquestadorModel
                    ).catch(() => {
                        return null;
                    });
                })
            );

            const runs = [];
            for (let i = 0; i < runCount; i++) {
                const superPlan = superPlans[i];
                if (!superPlan) {
                    continue;
                }

                const runId = `run-${Date.now()}-${i}`;
                const runLabel = `Run ${i + 1}`;

                const blueprint = {
                    blueprint_version: 2,
                    prompt_original: prompt,
                    run_id: runId,
                    run_label: runLabel,
                    sections: superPlan.sections || null
                };

                const agents = superPlan.agents || [
                    { id: 'arquiteto', role: 'Arquitecto', name: 'Arquitecto', specialty: 'estructura', color: '#00ff9d' },
                    { id: 'diseno', role: 'Diseño', name: 'Diseño', specialty: 'visual', color: '#4d9fff' },
                    { id: 'copy', role: 'Copy', name: 'Copywriter', specialty: 'persuasion', color: '#c084fc' },
                    { id: 'seo', role: 'SEO', name: 'SEO', specialty: 'optimizacion', color: '#f97316' },
                ];

                const flow = superPlan.flow || [
                    { from: 'start', to: 'arquiteto', type: 'sequential' },
                    { from: 'arquiteto', to: ['diseno', 'copy', 'seo'], type: 'parallel' },
                    { from: ['diseno', 'copy', 'seo'], to: 'end', type: 'merge' }
                ];

                runs.push({
                    run_id: runId,
                    label: runLabel,
                    style_seed: styleSeeds[i % styleSeeds.length],
                    agents,
                    flow,
                    blueprint,
                    rawResponse: JSON.stringify(superPlan),
                });
            }

            const plan = { runs };
            if (runs.length === 0) {
                throw new Error('Ningún Super-Orquestador generó un plan válido');
            }
            initRuns(plan);
            setPage('run');

            // Execute all runs in parallel
            await Promise.all(
                plan.runs.map((runPlan, i) => executeRun(i, runPlan, runPlan.rawResponse, imagePromise))
            );
        } catch {
            // Orchestration error
        }
    }, [prompt, runCount, assets, callAgentJSON, initRuns, setPage, executeRun, activeSkills]);

    return { startOrchestration };
}