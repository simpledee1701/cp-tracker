import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const getRedirectUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5173';
  }
  return 'https://cp-tracker-mauve.vercel.app';
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    redirectTo: getRedirectUrl(),
    flowType: 'pkce', // Recommended for security
  },
});
