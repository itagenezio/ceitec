
import React from 'react';
import { EVENT_DETAILS } from '../constants';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Sheet Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto bg-white dark:bg-[#1c1c1e] rounded-t-[2rem] shadow-2xl overflow-hidden flex flex-col animate-[slideUp_0.3s_ease-out]">
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        
        {/* Handle */}
        <div className="flex flex-col items-center pt-3 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-[#dbe0e6] dark:bg-[#48484a]"></div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center bg-white dark:bg-[#1c1c1e] px-4 py-2 justify-between border-b border-gray-100 dark:border-gray-800">
          <button onClick={onClose} className="w-20 text-primary text-base font-normal text-left">Cancelar</button>
          <h2 className="text-[#111418] dark:text-white text-lg font-bold flex-1 text-center">Novo Evento</h2>
          <div className="flex w-20 items-center justify-end">
            <button onClick={onClose} className="text-primary text-base font-bold">Salvar</button>
          </div>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto hide-scrollbar">
          <div className="bg-[#f0f2f4] dark:bg-[#2c2c2e] rounded-xl px-4 py-3">
            <input 
              readOnly
              className="w-full bg-transparent border-none focus:ring-0 text-[#111418] dark:text-white text-lg font-medium p-0" 
              value={`${EVENT_DETAILS.title} - CEITEC`}
            />
          </div>

          <div className="bg-[#f0f2f4] dark:bg-[#2c2c2e] rounded-xl flex items-center px-4 py-3 gap-3">
            <span className="material-symbols-outlined text-[#617589] dark:text-gray-400">location_on</span>
            <input 
              readOnly
              className="flex-1 bg-transparent border-none focus:ring-0 text-[#111418] dark:text-white text-base p-0" 
              value={EVENT_DETAILS.location}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-[#617589] dark:text-gray-400 text-xs font-semibold uppercase tracking-wider px-1">Data e Hora</h3>
            <div className="bg-[#f0f2f4] dark:bg-[#2c2c2e] rounded-xl divide-y dark:divide-gray-700">
              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-[#111418] dark:text-white">Início</span>
                <div className="flex gap-2">
                  <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm">{EVENT_DETAILS.date}</span>
                  <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm">{EVENT_DETAILS.time}</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-[#111418] dark:text-white">Fim</span>
                <div className="flex gap-2">
                  <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm">{EVENT_DETAILS.date}</span>
                  <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm">18:30</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 mt-4 active:scale-95 transition-transform"
          >
            Adicionar ao Calendário
          </button>
        </div>

        {/* Footer spacer */}
        <div className="pb-8 flex justify-center mt-auto">
            <div className="w-32 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
