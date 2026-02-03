import { createClient } from '@supabase/supabase-js';

// Эти переменные Next.js берет из настроек Netlify (Environment Variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Создаем один экземпляр клиента для всего приложения
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
