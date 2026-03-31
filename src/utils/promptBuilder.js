import { SKILLS_LIBRARY } from '../data/skills-library';

const AGENT_SKILL_MAP = {
    'arquitecto': ['web-design-guidelines', 'responsive-design', 'page-cro', 'seo-audit', 'ai-image-generation'],
    'diseño': ['frontend-design', 'ui-ux-pro-max', 'responsive-design', 'ai-image-generation'],
    'copy': ['copywriting', 'marketing-psychology', 'page-cro', 'form-cro'],
    'seo': ['seo-audit'],
    'critic': ['web-design-guidelines', 'ui-ux-pro-max', 'copywriting', 'marketing-psychology', 'page-cro'],
    'builder': ['web-design-guidelines', 'frontend-design', 'ui-ux-pro-max', 'responsive-design', 'ai-image-generation', 'form-cro'],
    'other': ['web-design-guidelines'],
};

export function generateFinalPrompt(userRequest, selectedSkills, agentRole = null, skipSkills = false) {
    let finalPrompt = `PROMPT DEL USUARIO:\n"${userRequest}"\n\n`;

    if (skipSkills) return finalPrompt;

    const role = agentRole || 'other';
    const relevantSkills = selectedSkills.filter(s => (AGENT_SKILL_MAP[role] || AGENT_SKILL_MAP['other']).includes(s));

    if (relevantSkills && relevantSkills.length > 0) {
        finalPrompt += `INSTRUCCIONES DE SKILLS:\n`;
        relevantSkills.forEach(skillId => {
            const skillText = SKILLS_LIBRARY[skillId];
            if (skillText) finalPrompt += `--- ${skillId.toUpperCase()} ---\n${skillText}\n\n`;
        });
    }

    finalPrompt += `\nREGLA CRÍTICA Y OBLIGATORIA:
Genera el resultado en HTML, CSS y JS, pero usa este HTML/CSS final como base para crear la solución.
Nota que TarsForge utiliza React y TailwindCSS v4 en el proceso real, pero al ensamblar la landing final debes basarte en el blueprint construido basándose en estas reglas de skills puras.
Tu principal objetivo es adoptar todas estas reglas metodológicas de los skills durante la construcción del Blueprint, estructura y copy de la página.

Cuando generes el código HTML de construcción final (en la fase Builder), genera el resultado ESTRICTAMENTE en Vanilla HTML, CSS (en bloque <style> o Tailwind inline si tienes soporte) y JS, sin usar React ni librerías externas.`;

    return finalPrompt;
}

export function generateRunVariationNote(styleSeed, runIndex) {
    return `\nNOTA DE VARIACIÓN (Run ${runIndex}): Este run debe aplicar el estilo "${styleSeed}" de forma radical. Todas las decisiones de diseño, estructura y copy deben reflejar este estilo de manera coherente y diferenciada respecto a otros runs.\n`;
}
