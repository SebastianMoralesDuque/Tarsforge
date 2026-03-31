/**
 * Creates an empty blueprint shell for a given run.
 */
export function createBlueprint(runId, runLabel, promptOriginal) {
    return {
        blueprint_version: 2,
        prompt_original: promptOriginal,
        run_id: runId,
        run_label: runLabel,
        structural_contract: null,
        design_spec: null,
        content_spec: null,
        seo_spec: null,
        critic_review: null,
    };
}

/**
 * Merges a spec section into the blueprint.
 */
export function mergeSpec(blueprint, specKey, specValue) {
    return { ...blueprint, [specKey]: specValue };
}

/**
 * Creates a hybrid blueprint by picking sections from two blueprints.
 * @param {Object} selections - { hero: 'run-a', features: 'run-b', ... }
 * @param {Object[]} blueprints - Array of blueprint objects
 */
export function mergeBlueprints(selections, blueprints) {
    const blueprintByRunId = {};
    blueprints.forEach((bp) => {
        blueprintByRunId[bp.run_id] = bp;
    });

    const base = blueprints[0];
    const mergedContentSpec = {};

    Object.entries(selections).forEach(([section, runId]) => {
        const sourceBlueprint = blueprintByRunId[runId];
        if (sourceBlueprint?.content_spec?.[section]) {
            mergedContentSpec[section] = sourceBlueprint.content_spec[section];
        }
    });

    return {
        ...base,
        run_id: 'run-hybrid',
        run_label: 'Versión fusionada',
        content_spec: {
            ...base.content_spec,
            ...mergedContentSpec,
            authored_by: 'Hybrid (user merge)',
        },
    };
}

export function summarizeBlueprint(blueprint) {
    const { structural_contract, design_spec, content_spec, seo_spec, critic_review } = blueprint;

    const parts = [];
    if (structural_contract) parts.push(structural_contract);
    if (design_spec) parts.push(design_spec);
    if (content_spec) parts.push(content_spec);
    if (seo_spec) parts.push(seo_spec);
    if (critic_review) parts.push(critic_review);

    const planning_text = parts.join('\n\n');

    return {
        style_seed: blueprint.run_label,
        planning_text: planning_text || 'Sin planificación aún. Usa tu criterio.',
    };
}