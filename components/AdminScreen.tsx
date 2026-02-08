
import React from 'react';
<<<<<<< HEAD
=======
import { supabase } from '../services/supabase';
>>>>>>> fa5d1125bf8d1413d79539a9512f2452965f6739

interface AdminScreenProps {
    realAttendance: any[];
    realJustifications: any[];
    adminTab: 'confirmed' | 'justified';
    setAdminTab: (tab: 'confirmed' | 'justified') => void;
    onRefresh: () => void;
    onBack: () => void;
<<<<<<< HEAD
    onDelete: (id: string) => void;
=======
>>>>>>> fa5d1125bf8d1413d79539a9512f2452965f6739
}

const AdminScreen: React.FC<AdminScreenProps> = ({
    realAttendance,
    realJustifications,
    adminTab,
    setAdminTab,
    onRefresh,
<<<<<<< HEAD
    onBack,
    onDelete
=======
    onBack
>>>>>>> fa5d1125bf8d1413d79539a9512f2452965f6739
}) => {
    return (
        <div className="max-w-md mx-auto h-screen flex flex-col bg-background-light dark:bg-background-dark animate-in fade-in duration-300">
            <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shadow-sm">
                <div className="flex flex-col">
                    <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Painel Gestor</h2>
                    <button onClick={onRefresh} className="text-[10px] text-primary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">refresh</span> ATUALIZAR
                    </button>
                </div>
                <button onClick={onBack} className="text-red-500 font-black text-[10px] bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-xl uppercase tracking-widest">
                    Sair
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#2a8d2a] text-white p-5 rounded-3xl shadow-xl shadow-green-900/10 relative overflow-hidden">
                        <p className="text-[9px] opacity-70 font-black uppercase tracking-widest">Confirmados</p>
                        <h3 className="text-3xl font-black mt-1">{realAttendance.length}</h3>
                        <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl opacity-10">check_circle</span>
                    </div>
                    <div className="bg-orange-500 text-white p-5 rounded-3xl shadow-xl shadow-orange-900/10 relative overflow-hidden">
                        <p className="text-[9px] opacity-70 font-black uppercase tracking-widest">Justificados</p>
                        <h3 className="text-3xl font-black mt-1">{realJustifications.length}</h3>
                        <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl opacity-10">feedback</span>
                    </div>
                </div>

                {/* Tabs Control */}
                <div className="bg-white dark:bg-gray-800 p-1.5 rounded-2xl flex border border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => setAdminTab('confirmed')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${adminTab === 'confirmed' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'}`}
                    >
                        Presenças
                    </button>
                    <button
                        onClick={() => setAdminTab('justified')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${adminTab === 'justified' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400'}`}
                    >
                        Justificativas
                    </button>
                </div>

                {/* Dynamic List */}
                <div className="space-y-3 pb-8">
                    {adminTab === 'confirmed' ? (
                        realAttendance.length > 0 ? (
                            realAttendance.map(person => (
<<<<<<< HEAD
                                <div key={person.id} className="bg-white dark:bg-gray-800 p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-right-4 duration-300 group relative">
=======
                                <div key={person.id} className="bg-white dark:bg-gray-800 p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-right-4 duration-300">
>>>>>>> fa5d1125bf8d1413d79539a9512f2452965f6739
                                    <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{person.nome_pai}</h4>
                                        <p className="text-[10px] text-gray-400 font-medium">Confirmado em: {new Date(person.criado_em).toLocaleDateString()}</p>
                                    </div>
<<<<<<< HEAD
                                    <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-1 rounded mr-8">
                                        {new Date(person.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h
                                    </span>
                                    <button
                                        onClick={() => onDelete(person.id)}
                                        className="absolute right-4 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
=======
                                    <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-1 rounded">
                                        {new Date(person.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h
                                    </span>
>>>>>>> fa5d1125bf8d1413d79539a9512f2452965f6739
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 text-xs py-8">Nenhuma presença confirmada ainda.</p>
                        )
                    ) : (
                        realJustifications.length > 0 ? (
                            realJustifications.map(item => (
<<<<<<< HEAD
                                <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl space-y-3 shadow-sm border border-orange-100 dark:border-orange-800/30 animate-in fade-in slide-in-from-left-4 duration-300 relative">
=======
                                <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl space-y-3 shadow-sm border border-orange-100 dark:border-orange-800/30 animate-in fade-in slide-in-from-left-4 duration-300">
>>>>>>> fa5d1125bf8d1413d79539a9512f2452965f6739
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase">{item.nome_pai}</h4>
                                            <p className="text-[10px] text-orange-500 font-bold">Justificado em {new Date(item.criado_em).toLocaleDateString()}</p>
                                        </div>
<<<<<<< HEAD
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black opacity-30">
                                                {new Date(item.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h
                                            </span>
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
=======
                                        <span className="text-[8px] font-black opacity-30">
                                            {new Date(item.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h
                                        </span>
>>>>>>> fa5d1125bf8d1413d79539a9512f2452965f6739
                                    </div>
                                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl">
                                        <p className="text-xs text-orange-800 dark:text-orange-200 italic leading-relaxed">"{item.justificativa}"</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 text-xs py-8">Nenhuma justificativa recebida ainda.</p>
                        )
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminScreen;
