import { AGENT_STATES } from '../constants/agents';

const storageApiKey = localStorage.getItem('tarsforge_api_key') || '';

export const INITIAL_STATE = {
    // Navigation
    page: 'config', // setup | config | run | compare

    // API
    apiKey: storageApiKey,
    activeApi: 'modal',
    availableApis: ['modal', 'gemini'],

    // Config
    prompt: '',
    runCount: 2,
    activeSkills: [],
    assets: {
        businessName: '',
        colors: '',
        logoUrl: '',
        referenceText: '',
    },

    // Orchestration plan from meta-agent
    orchestrationPlan: null,

    // Runs: array of run state objects
    runs: [],

    // Settings modal open
    settingsOpen: false,

    // Execution mode toggle
    useMockMode: false,
    isProMode: false,
};

export function createRunState(runPlan) {
    return {
        run_id: runPlan.run_id,
        label: runPlan.label,
        rationale: runPlan.rationale,
        agents: runPlan.agents.map((a) => ({ ...a, state: AGENT_STATES.PENDING, streamText: '', progress: 0 })),
        flow: runPlan.flow,
        blueprint: null,
        htmlOutput: null,
        previewStage: 'empty', // empty | wireframe | colored | content | live
        decisionHistory: [],
        expanded: false,
        status: 'pending', // pending | running | done | error
        hasAnimated: false,
    };
}
