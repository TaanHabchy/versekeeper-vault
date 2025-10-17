import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcjidaegmbsdjzrreyaj.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
