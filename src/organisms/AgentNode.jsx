import { Handle, Position } from '@xyflow/react';
import AgentCard from '../molecules/AgentCard';

export default function AgentNode({ data }) {
    const { agent, isTarget, isSource, isAssembling } = data;

    return (
        <div className="relative group">
            {/* Target handle for incoming edges */}
            {isTarget && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!w-3 !h-3 !bg-[var(--border-subtle)] !border-none transition-all group-hover:!bg-white"
                />
            )}

            {/* The actual content (AgentCard) */}
            <div className="w-[280px]">
                <AgentCard agent={agent} isAssembling={isAssembling} />
            </div>

            {/* Source handle for outgoing edges */}
            {isSource && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!w-3 !h-3 !bg-[var(--border-subtle)] !border-none transition-all group-hover:!bg-white"
                />
            )}
        </div>
    );
}
