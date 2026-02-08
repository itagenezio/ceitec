import { useEffect, useState } from 'react';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        const isStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;

        if (isIosDevice && !isStandalone) {
            setIsIOS(true);
            setIsInstallable(true);
        }

        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
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

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    if (!isInstallable) return null;

    return (
        <>
            <button
                onClick={handleInstallClick}
                className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 animate-bounce"
                aria-label="Instalar Aplicativo"
            >
                <span className="material-symbols-outlined">download</span>
                <span className="font-medium">Instalar App</span>
            </button>

            {showIOSInstructions && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-4 animate-in fade-in duration-300" onClick={() => setShowIOSInstructions(false)}>
                    <div
                        className="bg-white dark:bg-[#101922] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-4 duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <header className="flex justify-between items-center">
                            <h3 className="font-black text-lg text-gray-900 dark:text-white">Instalar no iPhone</h3>
                            <button onClick={() => setShowIOSInstructions(false)} className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-500">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </header>

                        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                            <p>O iOS não permite instalação automática. Siga os passos:</p>

                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                                <span className="material-symbols-outlined text-primary text-xl">ios_share</span>
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white block">1. Toque em Compartilhar</span>
                                    <span className="text-xs">Botão no centro inferior da tela</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                                <span className="material-symbols-outlined text-primary text-xl">add_box</span>
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white block">2. Adicionar à Tela de Início</span>
                                    <span className="text-xs">Role para baixo para encontrar</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                                <span className="text-primary font-bold text-xl px-2">Adicionar</span>
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white block">3. Toque em Adicionar</span>
                                    <span className="text-xs">No canto superior direito</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowIOSInstructions(false)}
                            className="w-full bg-primary text-white font-bold py-3 rounded-xl"
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstallPWA;
