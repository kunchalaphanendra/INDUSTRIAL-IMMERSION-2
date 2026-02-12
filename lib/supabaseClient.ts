import { createClient } from '@supabase/supabase-js';

// Fix: Cast import.meta to any to access environment variables in Vite
const supabaseUrl = (import.meta as any).env.VITE_BACKEND_API_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_BACKEND_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase configuration missing. Ensure VITE_BACKEND_API_URL and VITE_BACKEND_API_KEY are set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
