'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../libsupabase';
import { QRCodeSVG } from 'qrcode.react';

const MODELS = [
  { id: 'mbp', name: 'MacBook Pro', brand: 'Apple', icon: '💻' },
  { id: 'iphone', name: 'iPhone 15', brand: 'Apple', icon: '📱' },
  { id: 'ipad', name: 'iPad Pro', brand: 'Apple', icon: '🖊️' },
  { id: 'watch', name: 'Apple Watch', brand: 'Apple', icon: '⌚' },
  { id: 'sony', name: 'Sony Camera', brand: 'Sony', icon: '📷' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'RUB', symbol: '₽', rate: 91.5 },
];

export default function AssetOSZen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  
  // FORM
  const [person, setPerson] = useState('');
  const [price, setPrice] = useState('');
  const [maint, setMaint] = useState('');

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    const { data } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
    setLogs(data || []);
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    if (!person) return;
    const sku = `PRO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const meta = `${person}|${selectedModel.name}|${price || '0'}|Excellent|${maint || '0'}`;
    await supabase.from('assets').insert([{ name: meta, sku }]);
    setPerson(''); setPrice(''); setMaint(''); fetchLogs();
  };

  const totals = useMemo(() => {
    let sum = 0;
    logs.forEach(l => {
      const [_, __, pr, ___, mt] = (l.name || '0|0|0|0|0').split('|');
      sum += (parseFloat(pr) || 0) - (parseFloat(mt) || 0);
    });
    return sum;
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-black selection:text-white">
      
      {/* 🧭 NAVIGATION */}
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 flex items-center justify-between px-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg" />
          <span className="font-bold tracking-tighter text-xl">AssetOS.</span>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {CURRENCIES.map(c => (
            <button key={c.code} onClick={() => setCurrency(c)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${currency.code === c.code ? 'bg-white shadow-sm' : 'text-gray-400'}`}>{c.code}</button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-20 px-6">
        
        {/* 💰 CLEAN SUMMARY */}
        <div className="text-center mb-24">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-2">Current Portfolio Value</p>
          <h1 className={`text-8xl font-black tracking-tighter ${totals < 0 ? 'text-red-500' : 'text-black'}`}>
            {currency.symbol}{Math.abs(totals * currency.rate).toLocaleString()}
          </h1>
        </div>

        {/* 🏎️ THE SLIDER */}
        <div className="mb-16">
          <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-6">Select Gadget Type</p>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {MODELS.map(m => (
              <div 
                key={m.id} 
                onClick={() => setSelectedModel(m)}
                className={`flex-none w-40 p-6 rounded-[32px] border-2 transition-all cursor-pointer ${selectedModel.id === m.id ? 'border-black bg-white shadow-xl' : 'border-transparent bg-gray-50 opacity-40 hover:opacity-100'}`}
              >
                <div className="text-3xl mb-4">{m.icon}</div>
                <div className="font-bold text-sm tracking-tight">{m.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ✍️ SIMPLE FORM */}
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-32 bg-white p-4 rounded-[40px] shadow-2xl shadow-gray-200/50">
          <input value={person} onChange={e => setPerson(e.target.value)} placeholder="Who owns it?" className="bg-gray-50 p-6 rounded-[30px] outline-none text-sm font-medium focus:bg-gray-100 transition-all col-span-1 md:col-span-1" />
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price ($)" className="bg-gray-50 p-6 rounded-[30px] outline-none text-sm font-medium focus:bg-gray-100 transition-all" />
          <input type="number" value={maint} onChange={e => setMaint(e.target.value)} placeholder="Repair ($)" className="bg-gray-50 p-6 rounded-[30px] outline-none text-sm font-medium focus:bg-gray-100 transition-all" />
          <button className="bg-black text-white rounded-[30px] font-bold text-sm hover:scale-[0.98] transition-transform">Add Asset</button>
        </form>

        {/* 📜 LIST */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-6 mb-8">Recent Registry</h3>
          {logs.map(log => {
            const [p, it, pr, _, mt] = (log.name || '0|0|0|0|0').split('|');
            const net = (parseFloat(pr) || 0) - (parseFloat(mt) || 0);
            return (
              <div key={log.id} className="bg-white border border-gray-100 p-8 rounded-[40px] flex items-center justify-between group hover:shadow-lg transition-all">
                <div className="flex items-center gap-8">
                  <div className="p-2 bg-gray-50 rounded-2xl grayscale group-hover:grayscale-0 transition-all"><QRCodeSVG value={log.sku} size={40} /></div>
                  <div>
                    <h4 className="font-bold text-xl tracking-tight">{it}</h4>
                    <p className="text-xs text-gray-400 font-medium">{p} • <span className={net < 0 ? 'text-red-500' : 'text-green-500'}>{currency.symbol}{(net * currency.rate).toLocaleString()}</span></p>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-gray-200 uppercase">{log.sku}</div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
