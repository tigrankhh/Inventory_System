'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/libsupabase';
import { QrCode, History, Package, User, Search, ArrowLeft, Loader2, LogOut } from 'lucide-react';

export default function InventoryApp() {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'dashboard' | 'assets' | 'history'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  
  // Состояния для формы логина
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  // 1. Проверка авторизации при загрузке
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // 2. Функции входа/выхода
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = isRegister 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    
    if (error) alert(error.message);
    else if (isRegister) alert('Check your email!');
    setLoading(false);
  };

  const handleSignOut = () => supabase.auth.signOut();

  // 3. Загрузка данных из БД
  const fetchData = async (table: string) => {
    setLoading(true);
    const { data: result, error } = await supabase.from(table).select('*');
    if (error) console.error(error);
    else setData(result || []);
    setLoading(false);
  };

  // --- ЭКРАН ЛОГИНА ---
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-slate-800 text-center mb-2">
            {isRegister ? 'Join Us' : 'Magical Inv'}
          </h2>
          <p className="text-slate-400 text-center mb-8 text-sm">Please {isRegister ? 'register' : 'sign in'} to continue</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500" value={password} onChange={e => setPassword(e.target.value)} required />
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : (isRegister ? 'Create Account' : 'Sign In')}
            </button>
          </form>
          <button onClick={() => setIsRegister(!isRegister)} className="w-full text-center mt-6 text-sm font-semibold text-blue-600">
            {isRegister ? 'Already have an account? Log in' : 'New here? Register'}
          </button>
        </div>
      </div>
    );
  }

  // --- ЭКРАН СПИСКОВ (Assets/History) ---
  if (view !== 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft size={24} /></button>
            <h1 className="text-xl font-bold capitalize">{view}</h1>
          </div>
        </header>
        <main className="p-4 space-y-3">
          {loading ? <Loader2 className="animate-spin mx-auto mt-10 text-blue-600" /> : 
            data.map((item: any) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <p className="font-bold">{item.name || item.gadget_name}</p>
                <p className="text-sm text-slate-500">{item.status || item.action_date}</p>
              </div>
            ))
          }
        </main>
      </div>
    );
  }

  // --- ГЛАВНЫЙ ЭКРАН (Dashboard) ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white px-6 py-5 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-blue-600">MAGICAL INV</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active: {session.user.email}</p>
        </div>
        <button onClick={handleSignOut} className="p-2 text-slate-400 hover:text-red-500 transition"><LogOut size={20} /></button>
      </header>

      <main className="p-6 space-y-6 flex-1">
        <button onClick={() => alert('QR Scanner coming next!')} className="w-full bg-blue-600 text-white rounded-3xl p-8 shadow-xl flex items-center justify-between">
          <div className="text-left"><span className="text-xl font-bold block">Scan QR Code</span><p className="text-blue-100 text-xs">Instantly check device</p></div>
          <div className="bg-white/20 p-4 rounded-2xl"><QrCode size={32} /></div>
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => { setView('assets'); fetchData('gadgets'); }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="text-orange-500 bg-orange-50 w-fit p-3 rounded-2xl"><Package size={24} /></div>
            <span className="font-bold text-slate-700">Assets</span>
          </button>
          <button onClick={() => { setView('history'); fetchData('history'); }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="text-purple-500 bg-purple-50 w-fit p-3 rounded-2xl"><History size={24} /></div>
            <span className="font-bold text-slate-700">History</span>
          </button>
        </div>
      </main>
    </div>
  );
}
