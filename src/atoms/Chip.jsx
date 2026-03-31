export default function Chip({ label, icon, active, onClick, color = 'var(--neon-green)', disabled = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={[
                'inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)]',
                'text-xs font-medium font-display select-none cursor-pointer',
                'border transition-all duration-200',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                active
                    ? 'text-[var(--bg-base)] border-transparent'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-mid)] hover:text-[var(--text-primary)]',
            ].join(' ')}
            style={
                active
                    ? { backgroundColor: color, boxShadow: `0 0 14px ${color}50` }
                    : {}
            }
        >
            <span className="text-sm">{icon}</span>
            {label}
        </button>
    );
}
