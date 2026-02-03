"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isRegistering) {
      // РЕГИСТРАЦИЯ
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) alert("Ошибка регистрации: " + error.message);
      else alert("Аккаунт создан! Теперь войдите.");
    } else {
      // ВХОД
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert("Ошибка входа: " + error.message);
      else {
        router.push('/'); // Перекидываем на сканер
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full border border-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-600 italic tracking-tighter">INV.SYSTEM</h1>
          <p className="text-slate-400 text-sm mt-2">
            {isRegistering ? 'Создать новый аккаунт' : 'Войти в систему'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            required
            className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            required
            className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? 'ЗАГРУЗКА...' : (isRegistering ? 'ЗАРЕГИСТРИРОВАТЬСЯ' : 'ВОЙТИ')}
          </button>
        </form>

        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Регистрация'}
        </button>
      </div>
    </div>
  );
}
