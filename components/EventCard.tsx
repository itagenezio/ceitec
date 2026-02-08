
import React, { useState } from 'react';
import { Event } from '../types';

interface EventCardProps {
    event: Event;
    onClick: (event: Event) => void;
    onAdminClick: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, onAdminClick }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div
            className="group relative bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 active:scale-[0.98]"
        >
            {/* Imagem/Banner do Card */}
            <div
                onClick={() => onClick(event)}
                className="h-40 bg-gradient-to-br from-primary to-blue-600 relative overflow-hidden cursor-pointer"
            >
                {event.image_url ? (
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <span className="material-symbols-outlined text-7xl text-white">event</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-5 right-12">
                    <h3 className="text-white font-black text-xl leading-tight line-clamp-1 tracking-tight">{event.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Situação Ativa</span>
                    </div>
                </div>
            </div>

            {/* Menu Flutuante (Substituindo a seta) */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showMenu ? 'bg-primary text-white scale-110 rotate-90' : 'bg-black/20 backdrop-blur-md text-white hover:bg-black/40'}`}
                >
                    <span className="material-symbols-outlined">{showMenu ? 'close' : 'more_vert'}</span>
                </button>

                {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick(event);
                                setShowMenu(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                        >
                            <span className="material-symbols-outlined text-primary">login</span>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Acessar Evento</span>
                        </button>
<<<<<<< HEAD
=======
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAdminClick(event);
                                setShowMenu(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                        >
                            <span className="material-symbols-outlined text-orange-500">analytics</span>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Relatório (Admin)</span>
                        </button>
>>>>>>> fa5d1125bf8d1413d79539a9512f2452965f6739
                        <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-1 mx-2" />
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                        >
                            <span className="material-symbols-outlined text-red-500">share</span>
                            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Compartilhar</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Detalhes do Card */}
            <div className="p-5 space-y-4 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-5">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Data</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{event.date}</span>
                    </div>
                    <div className="flex flex-col border-l border-gray-100 dark:border-gray-700 pl-5">
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Horário</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{event.time}h</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate tracking-tight">{event.location}</span>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
