import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase Dashboard -> Project Settings -> API
// Example: https://xxxxxxxxxxxx.supabase.co
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://euonympbiqckydssejgf.supabase.co').trim();
// Example: eyJhb......
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PE6a-FumLqUfRHSLxUr6nA_Tzp8cy_X').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
