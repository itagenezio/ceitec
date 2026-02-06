
import React from 'react';
import { Event } from '../types';
import EventCard from './EventCard';

interface HomeScreenProps {
    events: Event[];
    onSelectEvent: (event: Event) => void;
    onCreateEvent: () => void;
    onAdminClick: (event?: Event) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ events, onSelectEvent, onCreateEvent, onAdminClick }) => {
    return (
        <div className="max-w-md mx-auto min-h-screen flex flex-col p-6 space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Ceitec Eventos</h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">CEITEC ITAPIPOCA</p>
                </div>
                <button
                    onClick={() => onAdminClick()}
                    className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary transition-colors active:scale-90"
                >
                    <span className="material-symbols-outlined">settings_suggest</span>
                </button>
            </header>

            {/* Hero Section / Banner */}
            <div className="relative h-48 bg-[#101922] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-700/30 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 mix-blend-overlay" />
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full">
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">Bem-vindo</span>
                    <h2 className="text-white text-xl font-bold leading-tight">Escolha uma situação para acessar os detalhes e confirmar sua presença.</h2>
                </div>
                <div className="absolute top-6 right-8">
                    <span className="material-symbols-outlined text-primary text-4xl animate-pulse">auto_awesome</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Próximos Eventos</h3>
                    <span className="text-[10px] font-bold text-primary">{events.length} Situações</span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={onSelectEvent}
                            onAdminClick={onAdminClick}
                        />
                    ))}

                    <button
                        onClick={onCreateEvent}
                        className="w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-all group active:scale-[0.98]"
                    >
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full group-hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">add_circle</span>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Novo Evento</span>
                    </button>
                </div>
            </div>

            <footer className="text-center py-8">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">CEITEC • DESENVOLVIDO COM IA</p>
            </footer>
        </div>
    );
};

export default HomeScreen;
