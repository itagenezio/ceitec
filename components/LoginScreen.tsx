
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface LoginScreenProps {
    onLoginSuccess: () => void;
    onBack?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                // Se o Supabase estiver configurado para auto-confirmar, ele retorna uma sessão
                if (data.session) {
                    onLoginSuccess();
                } else {
                    alert('Cadastro realizado! Verifique seu email para confirmar (se necessário) ou tente fazer login direto se o seu Supabase estiver com auto-confirm habilitado.');
                    setIsSignUp(false); // Alterna para login para facilitar
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onLoginSuccess();
            }
        } catch (error: any) {
            alert(error.message || 'Erro de autenticação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                        <span className="material-symbols-outlined text-3xl">lock</span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                        {isSignUp ? 'Criar Conta' : 'Fazer Login'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                        Identifique-se para acessar os eventos
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-widest"
                    >
                        {loading ? 'Processando...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
                    </button>

                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            disabled={loading}
                            className="w-full bg-transparent text-gray-400 font-bold py-2 rounded-xl hover:text-gray-600 transition-all uppercase text-xs tracking-widest"
                        >
                            Voltar
                        </button>
                    )}
                </form>

                <div className="mt-6 flex flex-col gap-4 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-xs font-bold text-primary hover:underline"
                    >
                        {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
                    </button>

                    <div className="h-[1px] bg-gray-100 dark:bg-gray-700 my-2" />

                    <button
                        onClick={onLoginSuccess}
                        className="text-[10px] font-black uppercase tracking-tighter text-gray-400 hover:text-primary transition-colors"
                    >
                        Pular Login (Modo Demonstração)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
