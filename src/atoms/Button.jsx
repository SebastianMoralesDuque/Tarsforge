const VARIANTS = {
    primary: 'bg-[var(--neon-green)] text-[var(--bg-base)] hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,255,157,0.4)]',
    secondary: 'border border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[rgba(0,255,157,0.08)]',
    ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
    danger: 'bg-red-500/90 text-white hover:bg-red-500',
    blue: 'bg-[var(--neon-blue)] text-white hover:brightness-110 hover:shadow-[0_0_20px_rgba(77,159,255,0.4)]',
};

const SIZES = {
    sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-[var(--radius-md)] gap-2',
    lg: 'px-7 py-3.5 text-base rounded-[var(--radius-lg)] gap-2.5',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    onClick,
    className = '',
    type = 'button',
    ...props
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={[
                'inline-flex items-center justify-center font-semibold font-display',
                'transition-all duration-200 cursor-pointer select-none',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                VARIANTS[variant],
                SIZES[size],
                className,
            ].join(' ')}
            {...props}
        >
            {loading && (
                <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            )}
            {children}
        </button>
    );
}
