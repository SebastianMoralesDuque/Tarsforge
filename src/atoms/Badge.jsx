const BADGE_STYLES = {
    pending: 'bg-white/5  text-[var(--text-muted)]    border-white/10',
    idle: 'bg-white/5  text-[var(--text-secondary)] border-white/10',
    working: 'bg-[rgba(0,255,157,0.12)] text-[var(--neon-green)]  border-[rgba(0,255,157,0.3)] shadow-[0_0_8px_rgba(0,255,157,0.2)]',
    done: 'bg-[rgba(77,159,255,0.12)] text-[var(--neon-blue)]  border-[rgba(77,159,255,0.3)]',
    error: 'bg-red-500/10 text-red-400 border-red-500/30',
    approved: 'bg-[rgba(0,255,157,0.12)] text-[var(--neon-green)]  border-[rgba(0,255,157,0.3)]',
    warning: 'bg-[rgba(250,204,21,0.12)] text-[var(--neon-yellow)] border-[rgba(250,204,21,0.3)]',
};

const STATUS_DOTS = {
    pending: 'bg-[var(--text-muted)]',
    idle: 'bg-[var(--text-secondary)]',
    working: 'bg-[var(--neon-green)] animate-pulse',
    done: 'bg-[var(--neon-blue)]',
    error: 'bg-red-400',
};

export default function Badge({ status = 'idle', label, showDot = true, className = '' }) {
    const style = BADGE_STYLES[status] || BADGE_STYLES.idle;
    const dot = STATUS_DOTS[status] || STATUS_DOTS.idle;

    return (
        <span
            className={[
                'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
                'transition-all duration-300',
                style,
                className,
            ].join(' ')}
        >
            {showDot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />}
            {label}
        </span>
    );
}
