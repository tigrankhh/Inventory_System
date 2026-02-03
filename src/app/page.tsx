"use client";

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../lib/supabase'; // Этот путь теперь верный

export default function InventoryApp() {
  const [activeTab, setActiveTab] = useState<'scan' | 'staff'>('scan');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [item, setItem] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (activeTab === 'scan') {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
      scanner.render(async (code) => {
        setScanResult(code);
        const { data } = await supabase.from('gadgets').select('*').eq('serial_number', code).single();
        if (data) { setItem(data); setIsNew(false); } 
        else { setItem(null); setIsNew(true); }
      }, () => {});
      return () => { scanner.clear().catch(() => {}); };
    }
  }, [activeTab]);

  const saveGadget = async () => {
    if (!name) return alert("Enter name");
    const { error } = await supabase.from('gadgets').insert([{ name, serial_number: scanResult, status: 'available' }]);
    if (!error) { alert("Saved! ✅"); setIsNew(false); setName(''); }
  };

  const saveStaff = async () => {
    if (!name) return alert("Enter name");
    const { error } = await supabase.from('employees').insert([{ full_name: name }]);
    if (!error) { alert("Staff added! 👤"); setName(''); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900">
      <header className="max-w-md mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-xl font-black text-blue-600 tracking-tighter italic">INV.HQ</h1>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border">
          <button onClick={() => setActiveTab('scan')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'scan' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>SCAN</button>
          <button onClick={() => setActiveTab('staff')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'staff' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>STAFF</button>
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-4">
        {activeTab === 'scan' ? (
          <>
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
              <div id="reader"></div>
            </div>
            {item && (
              <div className="bg-white p-6 rounded-[2rem] shadow-lg border-l-8 border-green-500">
                <h3 className="text-xs font-black text-green-600 uppercase">Registered Item</h3>
                <p className="text-2xl font-bold">{item.name}</p>
                <p className="text-slate-400 text-xs mt-1 font-mono">{item.serial_number}</p>
              </div>
            )}
            {isNew && (
              <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl">
                <h3 className="font-bold text-lg mb-3">New Item! 🆕</h3>
                <input placeholder="Name" className="w-full p-4 rounded-xl bg-blue-700 text-white border-none outline-none ring-2 ring-blue-400 mb-3" value={name} onChange={e => setName(e.target.value)} />
                <button onClick={saveGadget} className="w-full bg-white text-blue-600 font-black py-4 rounded-xl shadow-lg">REGISTER</button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-6 rounded-[2rem] shadow-lg border">
            <h3 className="font-bold text-lg mb-4">Add Staff 👤</h3>
            <input placeholder="Full Name" className="w-full p-4 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 mb-3 outline-none" value={name} onChange={e => setName(e.target.value)} />
            <button onClick={saveStaff} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl">SAVE STAFF</button>
          </div>
        )}
      </main>
    </div>
  );
}
