const GENERIC_MESSAGES = {
    architect: 'Analizando estructura y arquitectura...',
    design: 'Diseñando paleta de colores y tipografía...',
    copy: 'Redactando contenido persuasivo...',
    seo: 'Optimizando contenido para IA y buscadores...',
    critic: 'Evaluando calidad y consistencia...',
    builder: 'Construyendo componentes HTML...',
    translator: 'Traduciendo contenido...',
    default: 'Procesando información...',
};

const ERROR_MESSAGES = {
    rateLimit: 'Límite de solicitudes alcanzado. Reintentando...',
    network: 'Error de conexión. Reintentando...',
    serverError: 'Servidor ocupado. Reintentando...',
    unknown: 'Procesando...',
};

export function sanitizeStreamText(text, agentRole = 'default') {
    if (!text) return '';

    if (text.startsWith('Error:') || text.includes('falló') || text.includes('Error')) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('429') || lowerText.includes('rate limit') || lowerText.includes('límite')) {
            return ERROR_MESSAGES.rateLimit;
        }
        if (lowerText.includes('network') || lowerText.includes('fetch') || lowerText.includes('conexión')) {
            return ERROR_MESSAGES.network;
        }
        if (lowerText.includes('500') || lowerText.includes('502') || lowerText.includes('503') || lowerText.includes('server')) {
            return ERROR_MESSAGES.serverError;
        }
        return ERROR_MESSAGES.unknown;
    }

    if (text.includes('```')) {
        return GENERIC_MESSAGES[agentRole] || GENERIC_MESSAGES.default;
    }

    const cleanText = text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\*[\s\S]*?\*\*/g, '')
        .replace(/__[\s\S]*?__/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/[-*+]\s/g, '')
        .replace(/\d+\.\s/g, '')
        .replace(/[|]/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\{[\s\S]*?\}/g, '')
        .trim();

    if (cleanText.length < 10) {
        return GENERIC_MESSAGES[agentRole] || GENERIC_MESSAGES.default;
    }

    if (cleanText.length > 120) {
        return cleanText.substring(0, 120).trim() + '...';
    }

    return cleanText;
}

export function getGenericStatusMessage(agentRole) {
    return GENERIC_MESSAGES[agentRole] || GENERIC_MESSAGES.default;
}