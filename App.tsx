
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, Message, Event } from './types';
import { EVENT_DETAILS } from './constants';
import { sendMessageToAssistant } from './services/geminiService';
import { supabase } from './services/supabase';
import BottomSheet from './components/BottomSheet';
import HomeScreen from './components/HomeScreen';
import CreateEventScreen from './components/CreateEventScreen';
import AdminScreen from './components/AdminScreen';
import LoginScreen from './components/LoginScreen';


const App: React.FC = () => {
  // v1.1.0 - Multi-event system update
  const [view, setView] = useState<ViewState | 'auth' | 'create-event' | 'home'>('home');

  const [events, setEvents] = useState<Event[]>([
    {
      id: 'default',
      ...EVENT_DETAILS
    }
  ]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
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
    if (logoClicks > 0) {
      const timer = setTimeout(() => setLogoClicks(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [logoClicks]);

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
          fetchEvents();
        }
      } catch (err: any) {
        setSupabaseStatus(err.message || 'Erro de Rede');
      }
    };
    testConnection();
  }, []);


  const fetchEvents = async () => {
    try {
      // Primeiro tenta carregar do localStorage (mais rápido)
      const savedEvents = localStorage.getItem('ceitec_events');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }

      // Depois tenta sincronizar com o Supabase
      const { data, error } = await supabase.from('eventos').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setEvents(data);
        localStorage.setItem('ceitec_events', JSON.stringify(data));
      }
    } catch (err) {
      console.log('Tabela eventos não disponível ou sem internet, usando local.');
    }
  };



  const handleLogoClick = (event?: Event) => {
    const newClicks = logoClicks + 1;

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (newClicks >= 5 || event) {
      if (event) setCurrentEvent(event);
      fetchAdminData();
      setView('admin');
      setLogoClicks(0);
    } else {
      setLogoClicks(newClicks);
      // Reset clicks after 3 seconds of inactivity
    }
  };


  const fetchAdminData = async () => {
    try {
      let query = supabase.from('presencas').select('*').order('criado_em', { ascending: false });

      // Se tivermos um evento selecionado, filtramos por ele
      if (currentEvent && currentEvent.id !== 'default') {
        query = query.eq('event_id', currentEvent.id);
      } else if (currentEvent?.id === 'default') {
        // Para o evento padrão, podemos filtrar por nulo ou manter todos se for o único
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data) {
        setRealAttendance(data.filter(item => item.confirmado));
        setRealJustifications(data.filter(item => !item.confirmado));
      }
    } catch (err) {
      console.error('Erro ao buscar dados do admin:', err);
    }
  };

  const handleSelectEvent = async (event: Event) => {
    setCurrentEvent(event);

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setView('auth');
    } else {
      setView('landing');
    }
  };

  const handleCreateEvent = (newEvent: Omit<Event, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const eventWithId = { ...newEvent, id, created_at: new Date().toISOString() };

    const updatedEvents = [eventWithId, ...events];
    setEvents(updatedEvents);
    localStorage.setItem('ceitec_events', JSON.stringify(updatedEvents));

    // Tenta salvar no Supabase em segundo plano
    const saveToSupabase = async () => {
      try {
        const { error } = await supabase.from('eventos').insert([eventWithId]);
        if (error) console.error('Erro ao salvar no Supabase (eventos pode não existir):', error);
      } catch (e) {
        console.error('Falha de rede ao salvar evento');
      }
    };

    saveToSupabase();
    setView('home');
  };



  const handleConfirmPresence = async () => {
    if (!parentName.trim()) {
      alert("Por favor, informe seu nome antes de confirmar.");
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        nome_pai: parentName.trim(),
        confirmado: true
      };

      // Tenta com event_id primeiro
      if (currentEvent && currentEvent.id !== 'default') {
        payload.event_id = currentEvent.id;
      }

      const { error } = await supabase.from('presencas').insert([payload]);

      // Se der erro de coluna (PGRST204 ou similar), tenta sem o event_id
      if (error) {
        console.warn('Tentando salvar sem event_id devido a erro:', error.message);
        const { nome_pai, confirmado } = payload;
        const { error: error2 } = await supabase.from('presencas').insert([{ nome_pai, confirmado }]);
        if (error2) throw error2;
      }

      setView('success');
    } catch (err: any) {
      console.error('Erro ao salvar no Supabase:', err);
      alert('Erro ao confirmar presença: ' + (err.message || 'Falha de conexão'));
    } finally {
      setIsLoading(false);
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
      const payload: any = {
        nome_pai: parentName.trim(),
        justificativa: justification.trim(),
        confirmado: false
      };

      if (currentEvent && currentEvent.id !== 'default') {
        payload.event_id = currentEvent.id;
      }

      const { error } = await supabase.from('presencas').insert([payload]);

      // Tenta fallback se a coluna event_id não existir
      if (error) {
        console.warn('Tentando salvar justificativa sem event_id:', error.message);
        const { nome_pai, justificativa, confirmado } = payload;
        const { error: error2 } = await supabase.from('presencas').insert([{ nome_pai, justificativa, confirmado }]);
        if (error2) throw error2;
      }

      setView('justified');
    } catch (err: any) {
      console.error('Erro ao salvar justificativa:', err);
      alert('Erro ao enviar justificativa: ' + (err.message || 'Falha de conexão'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        const { error } = await supabase.from('presencas').delete().eq('id', id);
        if (error) throw error;
        fetchAdminData();
      } catch (err) {
        console.error('Erro ao deletar:', err);
        alert('Erro ao excluir registro');
      }
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

    const context = currentEvent ? `O evento atual é: ${currentEvent.title}, dia ${currentEvent.date} às ${currentEvent.time} em ${currentEvent.location}. ` : '';
    const responseText = await sendMessageToAssistant(context + inputValue, history);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const renderLanding = () => {
    const event = currentEvent || events[0];
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('home')} className="text-primary bg-primary/10 p-2 rounded-xl">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className={`flex-1 text-[10px] font-bold text-center py-2 rounded-full uppercase tracking-widest ${supabaseStatus === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            Status: {supabaseStatus === 'ok' ? 'Conectado' : 'Offline'}
          </div>
        </header>

        <div className="flex flex-col items-center text-center pt-2">
          <div onClick={() => handleLogoClick()} className={`relative group mb-8 cursor-default transition-all duration-300 active:scale-95 ${logoClicks > 0 ? 'animate-pulse' : ''}`} style={{ transform: `scale(${1 + (logoClicks * 0.02)})` }}>
            <div className={`absolute -inset-2 bg-gradient-to-tr from-primary/40 to-blue-300/40 rounded-full blur-xl transition-opacity duration-500 ${logoClicks > 0 ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-full shadow-2xl overflow-hidden w-40 h-40 flex items-center justify-center border-[6px] border-white dark:border-gray-700">
              {!imageError && event.image_url ? (
                <img src={event.image_url} alt="Logo" className="w-full h-full object-cover" onError={() => setImageError(true)} />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-5xl">school</span>
                  <span className="font-black text-xl text-gray-900 dark:text-white mt-1">CEITEC</span>
                </div>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight leading-tight">
            {event.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {event.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#101922] dark:bg-gray-800 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl">calendar_today</span>
            <div>
              <p className="text-[9px] opacity-60 uppercase font-black tracking-widest">DATA</p>
              <p className="text-sm font-bold">{event.date}</p>
            </div>
          </div>
          <div className="bg-primary text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg">
            <span className="material-symbols-outlined text-white bg-white/20 p-2 rounded-xl">schedule</span>
            <div>
              <p className="text-[9px] opacity-70 uppercase font-black tracking-widest">HORÁRIO</p>
              <p className="text-sm font-bold">{event.time}h</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="space-y-4">
            <div className="group relative">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block px-1">Seu Nome Completo</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors">person</span>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo"
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="group relative">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block px-1">Justificativa <span className="text-[8px] opacity-50 font-normal">(Se não puder ir)</span></label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 top-4 text-gray-400 group-focus-within:text-orange-500 transition-colors">history_edu</span>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Descreva brevemente..."
                  rows={2}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleConfirmPresence}
              className="w-full bg-[#2a8d2a] hover:bg-[#237a23] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
            >
              <span className="material-symbols-outlined">check_circle</span>
              CONFIRMAR PRESENÇA
            </button>

            <button
              onClick={handleJustifyAbsence}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
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
            <h3 className="font-black text-sm tracking-tight">ASSISTENTE IA</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">Dúvidas sobre o local ou o que levar? Nossa IA está pronta para responder.</p>
          <div className="bg-white/5 rounded-full px-4 py-3 flex justify-between items-center border border-white/5">
            <span className="text-xs text-gray-400">Toque para iniciar conversa</span>
            <span className="material-symbols-outlined text-primary text-sm">north_east</span>
          </div>
        </div>

        <footer className="text-center pt-4 pb-8">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">CEITEC ITAPIPOCA • 2026</p>
        </footer>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="max-w-md mx-auto min-h-screen flex flex-col animate-in fade-in zoom-in-95 duration-500 bg-background-light dark:bg-background-dark">
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
          </div>
        </div>
        <button
          onClick={() => setView('home')}
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
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Justificativa Recebida</h2>
        <div className="bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-800/30 rounded-3xl p-6 w-full italic text-orange-800 dark:text-orange-300 text-sm">
          "{justification}"
        </div>
        <button
          onClick={() => setView('home')}
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
            <h2 className="font-black text-gray-900 dark:text-white tracking-tight">ASSISTENTE</h2>
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
              <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tr-none' : 'bg-primary text-white rounded-tl-none'}`}>
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
            className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-white"
          />
          <button onClick={handleSendMessage} className="text-primary"><span className="material-symbols-outlined font-black">send</span></button>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white transition-colors min-h-screen">
      {view === 'home' && (
        <HomeScreen
          events={events}
          onSelectEvent={handleSelectEvent}
          onCreateEvent={() => setView('create-event')}
          onAdminClick={handleLogoClick}
        />
      )}
      {view === 'create-event' && (
        <CreateEventScreen onBack={() => setView('home')} onSave={handleCreateEvent} />
      )}
      {view === 'landing' && renderLanding()}
      {view === 'success' && renderSuccess()}
      {view === 'justified' && renderJustified()}
      {view === 'chat' && renderChat()}
      {view === 'admin' && (
        <AdminScreen
          realAttendance={realAttendance}
          realJustifications={realJustifications}
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          onRefresh={fetchAdminData}
          onBack={() => setView('home')}
          onDelete={handleDeleteParticipant}
        />
      )}
      {view === 'auth' && (
        <LoginScreen
          onLoginSuccess={() => setView('landing')}
          onBack={() => setView('home')}
        />
      )}
      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </div>
  );
};

export default App;
