import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

/**
 * Robust helper to fetch environment variables from common sources.
 * In production/environments without Vite, import.meta.env might be undefined.
 */
const getEnvVar = (key: string): string => {
  // 1. Try Vite's import.meta.env
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const val = (import.meta as any).env[key];
      if (val) return val;
    }
  } catch (e) {}

  // 2. Try Node-style process.env (common in CI and some preview runtimes)
  try {
    if (typeof process !== 'undefined' && process.env) {
      const val = process.env[key];
      if (val) return val;
    }
  } catch (e) {}

  return '';
};

const supabaseUrl = getEnvVar('VITE_BACKEND_API_URL');
const supabaseAnonKey = getEnvVar('VITE_BACKEND_API_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase configuration missing. Ensure VITE_BACKEND_API_URL and VITE_BACKEND_API_KEY are set in the environment.");
}

// Ensure the URL is valid before creating the client to avoid secondary errors
const validUrl = supabaseUrl || 'https://placeholder-project.supabase.co';
const validKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(validUrl, validKey);
