'use client';

import { useState } from 'react';
import { supabase } from '../../../libsupabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuth = async (type: 'login' | 'signup') => {
    setLoading(true);
    setErrorMessage('');

    // Подготовка данных
    const cleanEmail = email.trim();

    const { data, error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email: cleanEmail, password })
      : await supabase.auth.signUp({ 
          email: cleanEmail, 
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        });

    if (error) {
      setErrorMessage(error.message);
    } else {
      if (type === 'signup' && !data.session) {
        setErrorMessage('Success! Please check your email for confirmation.');
      } else {
        // Успешный вход — летим на главную
        window.location.href = '/'; 
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border border-gray-100 p-12 rounded-[50px] shadow-2xl shadow-gray-200/50 relative overflow-hidden">
        
        {/* Логотип */}
        <div className="text-center mb-10">
          <div className="inline-block w-14 h-14 bg-black rounded-[20px] mb-6 flex items-center justify-center text-white font-black italic shadow-xl">A</div>
          <h1 className="text-2xl font-black tracking-tighter text-black">Welcome to AssetOS.</h1>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2">Professional Registry Gateway</p>
        </div>

        <div className="space-y-6">
          {/* Поле Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-300 uppercase ml-4 tracking-widest">Identification</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-gray-50 border border-transparent p-5 rounded-[25px] outline-none focus:bg-white focus:border-gray-200 transition-all text-sm font-medium"
            />
          </div>

          {/* Поле Пароля */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-300 uppercase ml-4 tracking-widest">Security Key</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-gray-50 border border-transparent p-5 rounded-[25px] outline-none focus:bg-white focus:border-gray-200 transition-all text-sm font-medium"
            />
          </div>

          {/* Сообщения об ошибках */}
          {errorMessage && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[11px] font-bold text-center border border-red-100 animate-pulse">
              {errorMessage.toUpperCase()}
            </div>
          )}

          {/* Кнопки */}
          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={() => handleAuth('login')} 
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-[25px] font-bold text-sm hover:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-black/10"
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
            <button 
              onClick={() => handleAuth('signup')} 
              disabled={loading}
              className="w-full bg-white text-gray-400 border border-gray-100 py-5 rounded-[25px] font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
              Request Access (Register)
            </button>
          </div>
        </div>

        <p className="text-center mt-10 text-[9px] text-gray-300 font-medium uppercase tracking-[0.2em]">
          Encrypted Connection &bull; AssetOS v5.0
        </p>
      </div>
    </div>
  );
}