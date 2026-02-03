'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/libsupabase';
import { 
  QrCode, History, Package, User, Search, 
  ArrowLeft, Loader2, LogOut, Filter, Monitor, 
  Smartphone, Laptop, Tablet, HardDrive 
} from 'lucide-react';

// --- ГИГАНТСКАЯ БАЗА ДАННЫХ ДЛЯ ДЕМО ---
const MASTER_DATA = [
  { id: 1, type: 'Laptop', name: 'MacBook Pro 14"', model: 'M3 Max / 64GB', os: 'macOS Sonoma', year: 2023, status: 'In Stock' },
  { id: 2, type: 'Laptop', name: 'MacBook Pro 16"', model: 'M2 Max / 32GB', os: 'macOS Ventura', year: 2022, status: 'In Stock' },
  { id: 3, type: 'Laptop', name: 'MacBook Air 13"', model: 'M1 / 8GB', os: 'macOS Monterey', year: 2020, status: 'Low Stock' },
  { id: 4, type: 'Laptop', name: 'ThinkPad X1 Carbon', model: 'Gen 11 / i7-1355U', os: 'Windows 11 Pro', year: 2023, status: 'In Stock' },
  { id: 5, type: 'Laptop', name: 'Dell XPS 15', model: '9530 / i9 / RTX 4070', os: 'Windows 11 Pro', year: 2023, status: 'In Stock' },
  { id: 6, type: 'Smartphone', name: 'iPhone 15 Pro', model: '256GB / Titanium', os: 'iOS 17', year: 2023, status: 'In Stock' },
  { id: 7, type: 'Smartphone', name: 'Samsung Galaxy S23', model: 'Ultra / 512GB', os: 'Android 14', year: 2023, status: 'In Stock' },
  { id: 8, type: 'Tablet', name: 'iPad Pro 12.9"', model: 'M2 / Gen 6', os: 'iPadOS 17', year: 2022, status: 'In Stock' },
  { id: 9, type: 'Monitor', name: 'Studio Display', model: '27" 5K / Tilt', os: 'Firmware 17', year: 2022, status: 'In Stock' },
  { id: 10, type: 'Monitor', name: 'Dell UltraSharp', model: 'U2723QE / 4K', os: 'N/A', year: 2022, status: 'In Stock' },
  { id: 11, type: 'Smartphone', name: 'Google Pixel 8', model: 'Pro / 128GB', os: 'Android 14', year: 2023, status: 'Out of Stock' },
  { id: 12, type: 'Laptop', name: 'Surface Laptop 5', model: '13.5" / i5', os: 'Windows 11', year: 2022, status: 'In Stock' },
  { id: 13, type: 'Accessory', name: 'Magic Mouse', model: 'Black / USB-C', os: 'N/A', year: 2022, status: 'In Stock' },
  { id: 14, type: 'Laptop', name: 'MacBook Pro 13"', model: 'Intel i7 / 16GB', os: 'macOS Catalina', year: 2019, status: 'Assigned' },
];

export default function InventorySystem() {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'dashboard' | 'search'>('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Auth states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOS, setFilterOS] = useState('All');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = isRegister 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const filteredAssets = useMemo(() => {
    return MASTER_DATA.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.model.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOS = filterOS === 'All' || item.os.includes(filterOS);
      const matchesType = filterType === 'All' || item.type === filterType;
      return matchesSearch && matchesOS && matchesType;
    });
  }, [searchQuery, filterOS, filterType]);

  // --- ЭКРАН ВХОДА ---
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-blue-600 tracking-tighter">INV_SYS</h1>
            <p className="text-slate-500 font-medium text-sm mt-2">
              {isRegister ? 'Create an admin account' : 'Sign in to manage stock'}
            </p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="admin@company.com" 
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium transition-all" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium transition-all" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex justify-center mt-4">
              {loading ? <Loader2 className="animate-spin" /> : (isRegister ? 'Register' : 'Login')}
            </button>
          </form>
          <button onClick={() => setIsRegister(!isRegister)} className="w-full mt-8 text-xs font-black text-blue-600 uppercase tracking-[0.2em] hover:text-blue-800 transition">
            {isRegister ? '← Back to Login' : 'Need Registration?'}
          </button>
        </div>
      </div>
    );
  }

  // --- ЭКРАН ПОИСКА ---
  if (view === 'search') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-20 border-b border-slate-100">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition"><ArrowLeft size={24} /></button>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              autoFocus
              type="text" 
              placeholder="Search MacBook, ThinkPad, iPhone..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 bg-white border-r border-slate-100 p-6 hidden md:block space-y-8 overflow-y-auto">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">OS Environment</h3>
              <div className="space-y-1">
                {['All', 'macOS', 'Windows', 'iOS', 'Android'].map(os => (
                  <button key={os} onClick={() => setFilterOS(os)} className={`block w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterOS === os ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'}`}>{os}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Category</h3>
              <div className="space-y-1">
                {['All', 'Laptop', 'Smartphone', 'Monitor', 'Tablet'].map(type => (
                  <button key={type} onClick={() => setFilterType(type)} className={`block w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterType === type ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'}`}>{type}</button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1 overflow-auto p-6 bg-slate-50">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Year</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssets.map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">{item.type}</p>
                      </td>
                      <td className="p-5">
                        <p className="text-sm text-slate-700 font-medium">{item.model}</p>
                        <p className="text-xs text-slate-400 font-medium">{item.os}</p>
                      </td>
                      <td className="p-5 text-center text-sm font-mono font-bold text-slate-500">{item.year}</td>
                      <td className="p-5 text-right">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                          item.status === 'In Stock' ? 'bg-green-100 text-green-700' : 
                          item.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAssets.length === 0 && (
                <div className="p-24 text-center">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Search size={32} />
                  </div>
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching results found</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // --- ЭКРАН DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white px-8 py-6 shadow-sm flex justify-between items-center border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">M</div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter">MAGICAL_INV</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">{session.user.email}</p>
          </div>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-red-500 transition uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          <LogOut size={14} /> Sign Out
        </button>
      </header>

      <main className="p-8 max-w-5xl mx-auto w-full space-y-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Total Fleet</p>
            <p className="text-4xl font-black text-slate-900">{MASTER_DATA.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-orange-400 uppercase mb-2 tracking-widest">Low Stock</p>
            <p className="text-4xl font-black text-orange-500">2</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-red-400 uppercase mb-2 tracking-widest">Assigned</p>
            <p className="text-4xl font-black text-red-500">1</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => setView('search')}
            className="w-full bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] flex flex-col items-center gap-6 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-50 transition-all group active:scale-[0.98] relative overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-xl shadow-blue-200 transition-transform group-hover:scale-110">
              <Search size={36} />
            </div>
            <div className="text-center relative z-10">
              <span className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Inventory Directory</span>
              <p className="text-slate-400 text-sm font-medium mt-1">Search models, OS versions and real-time stock</p>
            </div>
          </button>

          <button onClick={() => alert('Scanner requires production HTTPS environment')} className="w-full bg-slate-900 text-white p-6 rounded-3xl flex items-center justify-center gap-4 hover:bg-black hover:shadow-2xl transition shadow-xl shadow-slate-200 active:scale-[0.98]">
            <QrCode size={22} />
            <span className="font-black text-xs uppercase tracking-[0.2em]">Launch QR Scanner</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={16} className="text-slate-400" />
              <span className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Recent Fleet Activity</span>
            </div>
            <span className="text-[10px] font-bold text-blue-500 cursor-pointer hover:underline uppercase">View All</span>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">MacBook Pro 14" M3</p>
                  <p className="text-xs text-slate-400 font-medium italic">Assigned to: John Doe (Engineering)</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase">Just Now</span>
            </div>
            <div className="flex justify-between items-start opacity-50">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5"></div>
                <div>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Pixel 8 Pro 128GB</p>
                  <p className="text-xs text-slate-400 font-medium italic">Added to inventory by System</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase">2h ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
