import { useEffect, useState } from 'react';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // Robust iOS Detection
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        // Check if running in standalone mode (PWA)
        const isStandalone = ('standalone' in window.navigator && (window.navigator as any).standalone) ||
            window.matchMedia('(display-mode: standalone)').matches;

        if (isIosDevice && !isStandalone) {
            setIsIOS(true);
            setIsInstallable(true);
        }

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSInstructions(true);
            return;
        }

        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    if (!isInstallable) return null;

    return (
        <>
            <button
                onClick={handleInstallClick}
                className="fixed bottom-6 right-6 z-50 flex flex-col items-center bg-white dark:bg-gray-800 text-primary p-3 rounded-2xl shadow-2xl border-2 border-primary/20 animate-bounce active:scale-95 transition-all"
                style={{ animationDuration: '3s' }}
            >
                <div className="bg-primary text-white p-2 rounded-xl mb-1">
                    <span className="material-symbols-outlined text-2xl">install_mobile</span>
                </div>
                <span className="font-black text-[10px] uppercase tracking-wider">Instalar App</span>
            </button>

            {showIOSInstructions && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setShowIOSInstructions(false)}>
                    <div
                        className="bg-white dark:bg-[#101922] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6 animate-in slide-in-from-bottom-8 duration-500 border border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        <header className="flex justify-between items-start">
                            <div>
                                <h3 className="font-black text-2xl text-gray-900 dark:text-white leading-none mb-2">Instalar no iPhone</h3>
                                <p className="text-gray-500 text-sm">Siga os 3 passos abaixo:</p>
                            </div>
                            <button onClick={() => setShowIOSInstructions(false)} className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </header>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                <span className="material-symbols-outlined text-primary text-2xl">ios_share</span>
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white block text-sm">1. Toque em Compartilhar</span>
                                    <span className="text-xs text-gray-500">Botão no centro inferior do Safari</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                <span className="material-symbols-outlined text-primary text-2xl">add_box</span>
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white block text-sm">2. Adicionar à Tela de Início</span>
                                    <span className="text-xs text-gray-500">Role o menu para baixo</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                <span className="font-bold text-primary text-sm bg-primary/10 px-3 py-1 rounded-lg">Adicionar</span>
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white block text-sm">3. Confirme em Adicionar</span>
                                    <span className="text-xs text-gray-500">No canto superior direito</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowIOSInstructions(false)}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">check_circle</span>
                            ENTENDI
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstallPWA;
