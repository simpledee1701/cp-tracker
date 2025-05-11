import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const getRedirectUrl = () => {
  return import.meta.env.VITE_REDIRECT_URL || 'https://cp-tracker-mauve.vercel.app';
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    redirectTo: getRedirectUrl(),
    flowType: 'pkce',
    detectSessionInUrl: true,
  },
});