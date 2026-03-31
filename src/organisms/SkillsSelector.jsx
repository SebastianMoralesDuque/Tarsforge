import { useState } from 'react';
import { SKILLS } from '../constants/skills';
import { useApp } from '../context/AppContext';

export default function SkillsSelector() {
    const { activeSkills, toggleSkill } = useApp();
    const [isExpanded, setIsExpanded] = useState(true);

    // Grouping skills by category
    const groupedSkills = SKILLS.reduce((acc, skill) => {
        const category = skill.category || 'Otros';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
    }, {});

    return (
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-mid)] overflow-hidden shadow-lg shadow-black/20 animate-fade-up">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3 px-4 hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer group"
                type="button"
            >
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse"></span>
                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Skills</h3>
                </div>
                <div className="flex items-center gap-3">
                    {activeSkills.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--neon-green)] text-[var(--bg-base)]">
                            {activeSkills.length}
                        </span>
                    )}
                    <svg
                        className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            <div className={`space-y-4 overflow-hidden transition-all duration-300 bg-[var(--bg-surface)] ${isExpanded ? 'max-h-[2000px] opacity-100 p-4 border-t border-[var(--border-subtle)]' : 'max-h-0 opacity-0'}`}>
                {Object.entries(groupedSkills).map(([category, skills]) => (
                    <div key={category} className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                            <span className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[var(--border-mid)]"></span>
                            {category}
                            <span className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[var(--border-mid)]"></span>
                        </h4>

                        <div className="grid grid-cols-2 gap-1.5">
                            {skills.map((skill) => {
                                const isActive = activeSkills.includes(skill.id);
                                return (
                                    <button
                                        key={skill.id}
                                        onClick={() => toggleSkill(skill.id)}
                                        className={[
                                            'text-left px-2 py-1.5 rounded-md border text-[10px] transition-all duration-300 group flex flex-col gap-0.5 relative overflow-hidden',
                                            isActive
                                                ? 'bg-[var(--bg-secondary)] border-[var(--neon-green)] shadow-[0_0_10px_rgba(0,255,157,0.1)] ring-1 ring-[var(--neon-green)]/20'
                                                : 'bg-[var(--bg-base)] border-[var(--border-mid)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-card)]'
                                        ].join(' ')}
                                        type="button"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span className={[
                                                'text-xs transition-transform duration-300',
                                                isActive ? 'scale-110' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'
                                            ].join(' ')}>
                                                {skill.icon}
                                            </span>
                                            <span className={[
                                                'font-bold truncate tracking-tight',
                                                isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                                            ].join(' ')}>
                                                {skill.label}
                                            </span>
                                        </div>

                                        <span className={[
                                            'text-[8.5px] leading-tight line-clamp-1 transition-colors duration-300',
                                            isActive ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                                        ].join(' ')}>
                                            {skill.description}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
