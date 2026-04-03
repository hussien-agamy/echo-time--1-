import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase Dashboard -> Project Settings -> API
// Example: https://xxxxxxxxxxxx.supabase.co
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
// Example: eyJhb......
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
