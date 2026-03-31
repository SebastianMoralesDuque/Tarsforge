export default function ProgressBar({ value = 0, color = 'var(--neon-green)', className = '', animated = true }) {
    return (
        <div className={['h-[3px] rounded-full bg-white/5 overflow-hidden', className].join(' ')}>
            <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                    width: `${Math.min(100, Math.max(0, value))}%`,
                    background: `linear-gradient(90deg, ${color}88 0%, ${color} 100%)`,
                    boxShadow: animated && value > 0 ? `0 0 8px ${color}80` : 'none',
                }}
            />
        </div>
    );
}
