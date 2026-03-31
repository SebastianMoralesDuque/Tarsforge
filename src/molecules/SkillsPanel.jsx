import { SKILLS } from '../constants/skills';
import Chip from '../atoms/Chip';
import { useApp } from '../context/AppContext';

export default function SkillsPanel() {
    const { activeSkills, toggleSkill } = useApp();

    return (
        <div className="space-y-2">
            <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Skills activos</p>
            <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                    <Chip
                        key={skill.id}
                        label={skill.label}
                        icon={skill.icon}
                        active={activeSkills.includes(skill.id)}
                        color={skill.color}
                        onClick={() => toggleSkill(skill.id)}
                    />
                ))}
            </div>
            {activeSkills.length > 0 && (
                <p className="text-[10px] text-[var(--text-muted)]">
                    {activeSkills.map((id) => SKILLS.find((s) => s.id === id)?.description).filter(Boolean).join(' · ')}
                </p>
            )}
        </div>
    );
}
