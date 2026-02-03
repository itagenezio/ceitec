
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, Message } from './types';
import { EVENT_DETAILS, MOCK_ATTENDANCE, MOCK_JUSTIFICATIONS } from './constants';
import { sendMessageToAssistant } from './services/geminiService';
import { supabase } from './services/supabase';
import BottomSheet from './components/BottomSheet';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [parentName, setParentName] = useState('');
  const [justification, setJustification] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [adminTab, setAdminTab] = useState<'confirmed' | 'justified'>('confirmed');
  const [logoClicks, setLogoClicks] = useState(0);
  const [supabaseStatus, setSupabaseStatus] = useState<'testing' | 'ok' | 'error'>('testing');
  const [realAttendance, setRealAttendance] = useState<any[]>([]);
  const [realJustifications, setRealJustifications] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('presencas').select('id').limit(1);
        if (error && (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('not found'))) {
          setSupabaseStatus('Tabela "presencas" não encontrada');
        } else if (error) {
          setSupabaseStatus(error.message as any);
        } else {
          setSupabaseStatus('ok');
        }
      } catch (err: any) {
        setSupabaseStatus(err.message || 'Erro de Rede');
      }
    };
    testConnection();
  }, []);

  // Lógica de acesso secreto ao admin
  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    if (newClicks >= 5) {
      fetchAdminData();
      setView('admin');
      setLogoClicks(0);
    } else {
      setLogoClicks(newClicks);
      // Resetar cliques se o usuário demorar muito
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  const fetchAdminData = async () => {
    try {
      const { data, error } = await supabase
        .from('presencas')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;

      if (data) {
        setRealAttendance(data.filter(item => item.confirmado));
        setRealJustifications(data.filter(item => !item.confirmado));
      }
    } catch (err) {
      console.error('Erro ao buscar dados do admin:', err);
    }
  };

  const handleConfirmPresence = async () => {
    if (parentName.trim()) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('presencas')
          .insert([
            { nome_pai: parentName.trim(), confirmado: true }
          ]);

        if (error) throw error;
        setView('success');
      } catch (err: any) {
        console.error('Erro ao salvar no Supabase:', err);
        alert('Erro ao confirmar presença: ' + (err.message || 'Falha de conexão'));
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Por favor, informe seu nome antes de confirmar.");
    }
  };

  const handleJustifyAbsence = async () => {
    if (!parentName.trim()) {
      alert("Por favor, informe seu nome para identificar a justificativa.");
      return;
    }
    if (!justification.trim()) {
      alert("Por favor, descreva brevemente o motivo da ausência.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('presencas')
        .insert([
          {
            nome_pai: parentName.trim(),
            justificativa: justification.trim(),
            confirmado: false
          }
        ]);

      if (error) throw error;
      setView('justified');
    } catch (err: any) {
      console.error('Erro ao salvar justificativa:', err);
      alert('Erro ao enviar justificativa: ' + (err.message || 'Falha de conexão'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const history = chatMessages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const responseText = await sendMessageToAssistant(inputValue, history);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const renderLanding = () => (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Indicador de Conexão Supabase */}
      <div className={`text-[10px] font-bold text-center py-1 rounded-full uppercase tracking-widest ${supabaseStatus === 'ok' ? 'bg-green-100 text-green-700' :
        supabaseStatus === 'testing' ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-700'
        }`}>
        Supabase: {supabaseStatus === 'ok' ? 'Conectado' : (supabaseStatus === 'testing' ? 'Testando...' : supabaseStatus)}
      </div>

      <div className="flex flex-col items-center text-center pt-4">
        <div
          onClick={handleLogoClick}
          className={`relative group mb-8 cursor-default transition-transform active:scale-95 ${logoClicks > 0 ? 'scale-105' : ''}`}
        >
          <div className="absolute -inset-2 bg-gradient-to-tr from-primary/40 to-blue-300/40 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-full shadow-2xl overflow-hidden w-48 h-48 flex items-center justify-center border-[6px] border-white dark:border-gray-700 ring-1 ring-gray-100 dark:ring-gray-600">
            {!imageError ? (
              <img
                src="https://drive.google.com/uc?export=view&id=1vS8mB6uW7u6_V-f1N7y_N7-Y1X6u8u_S"
                alt="Logo CEITEC"
                className="w-full h-full object-contain p-2 select-none"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-primary text-5xl">school</span>
                <span className="font-black text-xl text-gray-900 dark:text-white mt-1">CEITEC</span>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight leading-tight">
          {EVENT_DETAILS.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {EVENT_DETAILS.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#101922] dark:bg-gray-800 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg border border-gray-700/50">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl">calendar_today</span>
          <div>
            <p className="text-[9px] opacity-60 uppercase font-black tracking-widest">DATA</p>
            <p className="text-sm font-bold">{EVENT_DETAILS.date}</p>
          </div>
        </div>
        <div className="bg-primary text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg ring-1 ring-white/20">
          <span className="material-symbols-outlined text-white bg-white/20 p-2 rounded-xl">schedule</span>
          <div>
            <p className="text-[9px] opacity-70 uppercase font-black tracking-widest">HORÁRIO</p>
            <p className="text-sm font-bold">{EVENT_DETAILS.time}h</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
        <div className="space-y-4">
          <div className="group relative">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block px-1">
              Nome do Responsável
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors">person</span>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Ex: Carlos Eduardo de Sousa"
                className="w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="group relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block px-1">
              Justificativa de Ausência <span className="text-[8px] opacity-50 font-normal tracking-normal">(Opcional se for confirmar)</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 top-4 text-gray-400 group-focus-within:text-orange-500 transition-colors">history_edu</span>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Caso não possa comparecer, conte-nos o motivo..."
                rows={2}
                className="w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleConfirmPresence}
            className="w-full bg-[#2a8d2a] hover:bg-[#237a23] text-white font-black py-4 rounded-2xl shadow-xl shadow-green-900/10 flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
          >
            <span className="material-symbols-outlined">check_circle</span>
            CONFIRMAR PRESENÇA
          </button>

          <button
            onClick={handleJustifyAbsence}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-900/10 flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
          >
            <span className="material-symbols-outlined">cancel</span>
            JUSTIFICAR FALTA
          </button>
        </div>
      </div>

      <div
        onClick={() => setView('chat')}
        className="bg-[#101922] dark:bg-gray-800 rounded-[2rem] p-6 text-white cursor-pointer hover:scale-[1.02] transition-all shadow-2xl relative overflow-hidden group border border-gray-700/30"
      >
        <div className="flex items-center gap-4 mb-3 relative z-10">
          <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
          </div>
          <h3 className="font-black text-sm tracking-tight">ASSISTENTE IA CEITEC</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">Dúvidas sobre o local ou o que levar? Nossa IA está pronta para responder.</p>
        <div className="bg-white/5 rounded-full px-4 py-3 flex justify-between items-center border border-white/5">
          <span className="text-xs text-gray-400">Toque para iniciar conversa</span>
          <span className="material-symbols-outlined text-primary text-sm">north_east</span>
        </div>
      </div>

      <footer className="text-center pt-4 pb-8">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">CEITEC ITAPIPOCA • 2026</p>
        <div className="flex justify-center gap-6 mt-6">
          <button onClick={() => setIsSheetOpen(true)} className="text-[10px] text-gray-400 hover:text-primary transition-colors font-black border-b border-gray-200 dark:border-gray-700 pb-1 uppercase">AGENNDAR</button>
        </div>
      </footer>
    </div>
  );

  const renderSuccess = () => (
    <div className="max-w-md mx-auto min-h-screen flex flex-col animate-in fade-in zoom-in-95 duration-500 overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="bg-[#2a8d2a] text-white w-24 h-24 rounded-[2rem] shadow-2xl relative z-10 flex items-center justify-center rotate-3">
            <span className="material-symbols-outlined text-5xl">verified</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Confirmado!</h2>
          <p className="text-green-600 dark:text-green-400 font-black text-sm uppercase tracking-widest">Sua vaga está garantida</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-[2.5rem] p-8 w-full shadow-2xl">
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">RESPONSÁVEL</p>
                <p className="font-bold text-gray-900 dark:text-white">{parentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">event</span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">REUNIÃO EM</p>
                <p className="font-bold text-gray-900 dark:text-white">{EVENT_DETAILS.date} às {EVENT_DETAILS.time}h</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setView('landing')}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all"
        >
          VOLTAR PARA O INÍCIO
        </button>
      </div>
    </div>
  );

  const renderJustified = () => (
    <div className="max-w-md mx-auto min-h-screen flex flex-col animate-in fade-in slide-in-from-top-4 duration-500 bg-background-light dark:bg-background-dark">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-150" />
          <div className="bg-orange-500 text-white w-24 h-24 rounded-[2rem] shadow-2xl relative z-10 flex items-center justify-center -rotate-3">
            <span className="material-symbols-outlined text-5xl">feedback</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Justificativa Recebida</h2>
          <p className="text-orange-500 font-black text-sm uppercase tracking-widest">Agradecemos o aviso</p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-800/30 rounded-3xl p-6 w-full italic text-orange-800 dark:text-orange-300 text-sm">
          "{justification}"
        </div>

        <button
          onClick={() => setView('landing')}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all"
        >
          VOLTAR PARA O INÍCIO
        </button>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-white dark:bg-[#101922] animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setView('landing')} className="text-primary p-2">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <div className="text-center">
            <h2 className="font-black text-gray-900 dark:text-white tracking-tight">IA CEITEC</h2>
            <p className="text-[9px] text-green-500 font-black uppercase tracking-widest">Conectado</p>
          </div>
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-400">info</span>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50 dark:bg-transparent">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tr-none' : 'bg-primary text-white rounded-tl-none'
                }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>
      <footer className="p-4 bg-white dark:bg-[#101922] border-t border-gray-100 dark:border-gray-800">
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-3 flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua dúvida..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm"
          />
          <button onClick={handleSendMessage} className="text-primary"><span className="material-symbols-outlined font-black">send</span></button>
        </div>
      </footer>
    </div>
  );

  const renderAdmin = () => (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-background-light dark:bg-background-dark animate-in fade-in duration-300">
      <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shadow-sm">
        <div className="flex flex-col">
          <h2 className="text-lg font-black tracking-tight">Painel Gestor</h2>
          <button onClick={fetchAdminData} className="text-[10px] text-primary font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">refresh</span> ATUALIZAR
          </button>
        </div>
        <button onClick={() => setView('landing')} className="text-red-500 font-black text-[10px] bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-xl uppercase tracking-widest">
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
        <div className="space-y-3">
          {adminTab === 'confirmed' ? (
            realAttendance.length > 0 ? (
              realAttendance.map(person => (
                <div key={person.id} className="bg-white dark:bg-gray-800 p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{person.nome_pai}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Confirmado em: {new Date(person.criado_em).toLocaleDateString()}</p>
                  </div>
                  <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-1 rounded">
                    {new Date(person.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-xs py-8">Nenhuma presença confirmada ainda.</p>
            )
          ) : (
            realJustifications.length > 0 ? (
              realJustifications.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl space-y-3 shadow-sm border border-orange-100 dark:border-orange-800/30 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase">{item.nome_pai}</h4>
                      <p className="text-[10px] text-orange-500 font-bold">Justificado em {new Date(item.criado_em).toLocaleDateString()}</p>
                    </div>
                    <span className="text-[8px] font-black opacity-30">
                      {new Date(item.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h
                    </span>
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

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white transition-colors">
      {view === 'landing' && renderLanding()}
      {view === 'success' && renderSuccess()}
      {view === 'justified' && renderJustified()}
      {view === 'chat' && renderChat()}
      {view === 'admin' && renderAdmin()}
      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </div>
  );
};

export default App;
