import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcjidaegmbsdjzrreyaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZ3llZW5ndGtzaWFkbGJyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDE3NzIsImV4cCI6MjA3NjIxNzc3Mn0.22bAyHr9tlyXzNE1eXpVYaMynhthNaYbGZ-eQBWrkrI'; // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
