export default function LivePreview({ iframeRef }) {
    return (
        <div className="flex-1 flex flex-col bg-[#07070d] overflow-hidden p-2 md:p-3">
            <div className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 relative group">
                <iframe
                    key="live-preview-iframe"
                    ref={iframeRef}
                    title="Live Preview"
                    className="w-full flex-1 border-0 bg-white block min-h-0"
                />
            </div>
        </div>
    );
}
