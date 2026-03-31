import { generateFinalPrompt } from '../promptBuilder';
import { getArchitectPrompt } from '../prompts/architectPrompt';
import {
    getDesignPrompt,
    getCopyPrompt,
    getCriticPrompt,
    getSEOPrompt,
} from '../prompts/agentPrompts';

export async function executeSingleAgent({
    agentId,
    agentMap,
    runIndex,
    runPlan,
    currentBlueprint,
    activeSkills,
    assets,
    prompt,
    runAgent,
    updateRun,
    executedAgents,
    pendingAgents,
}) {
    const agent = agentMap.get(agentId);
    if (!agent) return null;
    
    const role = (agent.role || '').toLowerCase();
    let systemPrompt, userMessage;
    let blueprintKey;
    
    switch (true) {
        case role.includes('arquitecto') || role.includes('architect'): {
            const architectMegaPrompt = generateFinalPrompt(prompt, activeSkills, 'arquitecto');
            systemPrompt = getArchitectPrompt(architectMegaPrompt, assets, runPlan.style_seed || 'diseño creativo único');
            userMessage = `Crea el contrato estructural para este Mega Prompt:\n\n${architectMegaPrompt}`;
            blueprintKey = 'structural_contract';
            break;
        }
            
        case role.includes('diseño') || role.includes('design'): {
            const designMegaPrompt = generateFinalPrompt(prompt, activeSkills, 'diseño');
            systemPrompt = getDesignPrompt(designMegaPrompt, currentBlueprint.structural_contract, assets, runPlan.style_seed || 'diseño creativo único');
            userMessage = `Crea la especificación de diseño para este Mega Prompt:\n\n${designMegaPrompt}`;
            blueprintKey = 'design_spec';
            break;
        }
            
        case role.includes('copy') || role.includes('contenido') || role.includes('redact'): {
            const copyMegaPrompt = generateFinalPrompt(prompt, activeSkills, 'copy');
            systemPrompt = getCopyPrompt(copyMegaPrompt, currentBlueprint.structural_contract, assets, runPlan.style_seed || 'diseño creativo único');
            userMessage = `Crea todos los textos y contenidos para este Mega Prompt:\n\n${copyMegaPrompt}`;
            blueprintKey = 'content_spec';
            break;
        }
            
        case role.includes('seo'): {
            const seoMegaPrompt = generateFinalPrompt(prompt, activeSkills, 'seo');
            systemPrompt = getSEOPrompt(seoMegaPrompt, currentBlueprint.structural_contract, currentBlueprint.content_spec, runPlan.style_seed || 'diseño creativo único');
            userMessage = `Crea la especificación SEO para este Mega Prompt:\n\n${seoMegaPrompt}`;
            blueprintKey = 'seo_spec';
            break;
        }
            
        case role.includes('crít') || role.includes('critic'): {
            const criticMegaPrompt = generateFinalPrompt(prompt, activeSkills, 'critic');
            systemPrompt = getCriticPrompt(currentBlueprint);
            userMessage = `Evalúa el Blueprint acumulado y determina si aprobarlo o solicitar correcciones:\n\n${criticMegaPrompt}`;
            blueprintKey = 'critic_review';
            break;
        }
            
        default: {
            const genericMegaPrompt = generateFinalPrompt(prompt, activeSkills, null);
            systemPrompt = `Eres un agente especializado: ${agent.role}. Descripción: ${agent.specialty}. Genera una especificación JSON relevante para el prompt del usuario.`;
            userMessage = `Genera el output usando este Mega Prompt:\n\n${genericMegaPrompt}`;
            blueprintKey = `spec_${agent.id}`;
        }
    }
    
    let updatedBlueprint = currentBlueprint;

    await runAgent(runIndex, agent, systemPrompt, userMessage, (result) => {
        updatedBlueprint = { ...updatedBlueprint, [blueprintKey]: result };
        updateRun(runIndex, { blueprint: updatedBlueprint });
    });
    
    executedAgents.set(agentId, true);
    pendingAgents.delete(agentId);
    
    return updatedBlueprint;
}
