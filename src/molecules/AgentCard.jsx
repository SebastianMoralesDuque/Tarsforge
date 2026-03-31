import { AGENT_STATES } from '../constants/agents';
import Badge from '../atoms/Badge';
import ProgressBar from '../atoms/ProgressBar';
import StreamText from '../atoms/StreamText';
import Spinner from '../atoms/Spinner';

const STATE_LABELS = {
    [AGENT_STATES.PENDING]: 'Esperando',
    [AGENT_STATES.IDLE]: 'Listo',
    [AGENT_STATES.WORKING]: 'Trabajando',
    [AGENT_STATES.DONE]: 'Completado',
    [AGENT_STATES.ERROR]: 'Error',
};

function getContrastColor(hexColor) {
    if (!hexColor) return '#ffffff';
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? hexColor : '#ffffff';
}

export default function AgentCard({ agent, isAssembling }) {
    const { role, specialty, color, state = AGENT_STATES.PENDING, streamText = '', progress = 0 } = agent;
    const isWorking = state === AGENT_STATES.WORKING;
    const isDone = state === AGENT_STATES.DONE;
    const isPending = state === AGENT_STATES.PENDING;
    const isFinalizing = isAssembling && isDone;
    const textColor = getContrastColor(color);

    return (
        <div
            className={[
                'rounded-[var(--radius-md)] border transition-all duration-500 overflow-hidden',
                isWorking
                    ? 'border-current shadow-[0_0_20px_var(--agent-glow)]'
                    : isFinalizing
                        ? 'border-current animate-pulse'
                        : isDone
                            ? 'border-white/15'
                            : 'border-[var(--border-subtle)]',
            ].join(' ')}
            style={{
                background: isWorking
                    ? `linear-gradient(135deg, ${color}10 0%, var(--bg-card) 100%)`
                    : isFinalizing
                        ? `linear-gradient(135deg, ${color}08 0%, var(--bg-card) 100%)`
                        : 'var(--bg-card)',
                '--agent-glow': `${color}40`,
                minWidth: '130px',
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2">
                <span
                    className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300"
                    style={{
                        backgroundColor: isPending ? 'var(--text-muted)' : color,
                        boxShadow: (isWorking || isFinalizing) ? `0 0 8px ${color}` : 'none',
                        animation: isFinalizing ? 'pulse-glow 1.5s ease infinite' : 'none',
                    }}
                />
                <span
                    className="text-xs font-semibold font-display truncate"
                    style={{ color: isDone || isWorking ? textColor : 'var(--text-secondary)' }}
                >
                    {role}
                </span>
                {isWorking && <Spinner color={textColor} size={12} />}
                {isFinalizing && <span className="text-xs animate-pulse" style={{ color: textColor }}>⚡</span>}
                {isDone && !isFinalizing && <span className="ml-auto text-xs">✓</span>}
            </div>

            {/* Role */}
            <div className="px-3 pb-1">
                <Badge status={state} label={isFinalizing ? 'Finalizando' : STATE_LABELS[state] || state} />
            </div>

            {/* Expanded content when working or done */}
            {(isWorking || isDone) && (
                <div className="px-3 pb-3 space-y-2">
                    <p className="text-[10px] text-[var(--text-muted)]">{specialty}</p>
                    {streamText && (
                        <div
                            className="rounded p-2 max-h-[80px] overflow-hidden text-[10px] leading-relaxed"
                            style={{ background: 'rgba(0,0,0,0.3)', color: textColor }}
                        >
                            <StreamText text={streamText} speed={12} skip={isDone} />
                        </div>
                    )}
                    <ProgressBar value={progress} color={color} />
                </div>
            )}

            {/* Finalizing state: show "sharing data" effect */}
            {isFinalizing && (
                <div className="px-3 pb-3 space-y-2">
                    <div className="flex items-center justify-center gap-1 py-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{
                                    backgroundColor: color,
                                    animationDelay: `${i * 200}ms`,
                                }}
                            />
                        ))}
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${color}20` }}>
                        <div
                            className="h-full rounded-full animate-pulse"
                            style={{
                                width: '60%',
                                backgroundColor: color,
                                animationDelay: '300ms',
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Idle/pending: just spec */}
            {isPending && (
                <div className="px-3 pb-2">
                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{specialty}</p>
                </div>
            )}
        </div>
    );
}
