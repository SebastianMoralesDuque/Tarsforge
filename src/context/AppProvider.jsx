import { useState, useCallback } from 'react';
import { AppContext } from './AppContext';
import { INITIAL_STATE, createRunState } from './AppConstants';
import { SKILLS } from '../constants/skills';

export function AppProvider({ children }) {
    const [state, setState] = useState(INITIAL_STATE);

    const setPage = useCallback((page) => setState((s) => ({ ...s, page })), []);

    const setApiKey = useCallback((apiKey) => {
        localStorage.setItem('tarsforge_api_key', apiKey);
        setState((s) => ({ ...s, apiKey }));
    }, []);

    const setActiveApi = useCallback((activeApi) => setState((s) => ({ ...s, activeApi })), []);

    const setPrompt = useCallback((prompt) => setState((s) => ({ ...s, prompt })), []);
    const setRunCount = useCallback((runCount) => setState((s) => ({ ...s, runCount })), []);

    const toggleSkill = useCallback((skillId) => {
        setState((s) => {
            const skill = SKILLS.find(sk => sk.id === skillId);
            const isActive = s.activeSkills.includes(skillId);

            if (isActive) {
                return {
                    ...s,
                    activeSkills: s.activeSkills.filter((id) => id !== skillId)
                };
            }

            // Find other skills from same category
            const otherIds = SKILLS
                .filter(sk => sk.category === skill.category)
                .map(sk => sk.id);

            // Filter out existing skills from that category and add the new one
            const filtered = s.activeSkills.filter(id => !otherIds.includes(id));
            return {
                ...s,
                activeSkills: [...filtered, skillId]
            };
        });
    }, []);

    const setAssets = useCallback((assets) => setState((s) => ({ ...s, assets: { ...s.assets, ...assets } })), []);

    const initRuns = useCallback((plan) => {
        const runs = plan.runs.map(createRunState);
        setState((s) => ({ ...s, orchestrationPlan: plan, runs }));
    }, []);

    const updateAgent = useCallback((runIndex, agentId, patch) => {
        setState((s) => {
            const runs = s.runs.map((run, ri) => {
                if (ri !== runIndex) return run;
                return {
                    ...run,
                    agents: run.agents.map((a) => (a.id === agentId ? { ...a, ...patch } : a)),
                };
            });
            return { ...s, runs };
        });
    }, []);

    const updateRun = useCallback((runIndex, patch) => {
        setState((s) => {
            const runs = s.runs.map((run, ri) => {
                if (ri === runIndex) {
                    const appliedPatch = typeof patch === 'function' ? patch(run) : patch;
                    return { ...run, ...appliedPatch };
                }
                return run;
            });
            return { ...s, runs };
        });
    }, []);

    const toggleRunExpand = useCallback((runIndex) => {
        setState((s) => {
            const runs = s.runs.map((run, ri) =>
                ri === runIndex ? { ...run, expanded: !run.expanded } : run
            );
            return { ...s, runs };
        });
    }, []);

    const setSettingsOpen = useCallback((open) => setState((s) => ({ ...s, settingsOpen: open })), []);

    const toggleProMode = useCallback(() => {
        setState((s) => ({ ...s, isProMode: !s.isProMode }));
    }, []);

    const resetAll = useCallback(() => {
        setState({ ...INITIAL_STATE, apiKey: localStorage.getItem('tarsforge_api_key') || '', page: 'config' });
    }, []);

    return (
        <AppContext.Provider
            value={{
                ...state,
                setPage,
                setApiKey,
                setActiveApi,
                setPrompt,
                setRunCount,
                toggleSkill,
                setAssets,
                initRuns,
                updateAgent,
                updateRun,
                toggleRunExpand,
                setSettingsOpen,
                toggleProMode,
                resetAll,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
