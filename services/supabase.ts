import { createClient } from '@supabase/supabase-js';

// Usando fallback para string vazia para evitar quebras
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Se as chaves estiverem faltando, o cliente será null ou avisará no console
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
