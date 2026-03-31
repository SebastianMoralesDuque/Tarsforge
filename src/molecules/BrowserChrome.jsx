export default function BrowserChrome() {
    return (
        <div className="h-10 bg-[#121214] border-b border-white/5 flex items-center px-6 gap-3 flex-shrink-0">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/5" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/5" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/5" />
            </div>

            <div className="flex gap-3 text-white/10">
                <span className="text-[10px]">↻</span>
                <span className="text-[10px]">⋮</span>
            </div>
        </div>
    );
}
