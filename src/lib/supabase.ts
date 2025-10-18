import { createClient } from '@supabase/supabase-js';
import {Database} from "@/types/supabase.ts";

const SUPABASE_URL = 'https://fagyeengtksiadlbroim.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZ3llZW5ndGtzaWFkbGJyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDE3NzIsImV4cCI6MjA3NjIxNzc3Mn0.22bAyHr9tlyXzNE1eXpVYaMynhthNaYbGZ-eQBWrkrI'; // Replace with your anon key

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
    }
});