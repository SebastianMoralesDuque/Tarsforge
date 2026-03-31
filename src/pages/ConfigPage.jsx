import PromptInput from '../organisms/PromptInput';
import Navbar from '../organisms/Navbar';


export default function ConfigPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-base)] bg-mesh bg-dots flex flex-col pt-20">
            <Navbar />

            {/* Hero section */}
            <div className="flex-1 flex flex-col items-center px-6 py-8">
                <div className="text-center mb-10 max-w-[1800px] animate-fade-up">
                    <h1 className="text-3xl sm:text-4xl font-bold font-display gradient-text mb-3 leading-tight">
                        Construye landing pages con<br />modelos de código abierto (Ollama)
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        Describe tu negocio. Un equipo de agentes IA diseñará, escribirá y construirá tu landing page en tiempo real usando modelos de código abierto y gratuitos.
                    </p>
                </div>



                {/* Main prompt input */}
                <div className="w-full animate-fade-up" style={{ animationDelay: '0.15s' }}>
                    <PromptInput />
                </div>
            </div>
        </div>
    );
}
