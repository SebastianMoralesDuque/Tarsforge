export const AGENT_ROLES = {
    architect: { label: 'Arquitecto', color: '#00ff9d', icon: '🏗️' },
    design: { label: 'Diseño', color: '#4d9fff', icon: '🎨' },
    copy: { label: 'Copywriter', color: '#c084fc', icon: '✍️' },
    seo: { label: 'SEO', color: '#4d9fff', icon: '🔍' },
    critic: { label: 'Crítico', color: '#facc15', icon: '🔎' },
    builder: { label: 'Builder', color: '#f97316', icon: '⚙️' },
    translator: { label: 'Traducción', color: '#ec4899', icon: '🌐' },
};

export const AGENT_STATES = {
    PENDING: 'pending',
    IDLE: 'idle',
    WORKING: 'working',
    DONE: 'done',
    ERROR: 'error',
};

export const GEMINI_MODEL = 'gemini-3.1-pro-preview';

export const STYLE_SEEDS = [
    'minimalista oscuro tipográfico', 'glassmorphism vibrante',
    'brutalismo gráfico bold', 'editorial limpio revista',
    'neomorfismo suave monocromático', 'retro-futurista neón',
    'corporativo confiable azul', 'orgánico natural suturas',
    'geométrico abstracto colorido', 'dark luxury premium',
    'startup energético gradientes', 'gobierno institucional serio',
    'gaming oscuro agresivo', 'wellness suave pasteles',
    'tech futurista holo', 'artesanal cálido texturas',
];

export const GLOBAL_API_DELAY = 0; // ms between each AI request
