import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
export const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be defined in the .env file. Client could not be initialized correctly.');
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
);
