"use client";

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
// Вместо import { supabase } from '@/lib/supabase'
import { supabase } from '../lib/supabase'

export default function UltimateInventory() {
  const [activeTab, setActiveTab] = useState<'scan' | 'staff'>('scan');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Поля форм
  const [gadgetName, setGadgetName] = useState('');
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    if (activeTab === 'scan') {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
      scanner.render(onScan, (err) => {});
      return () => { scanner.clear().catch(e => {}); };
    }
  }, [activeTab]);

  async function onScan(code: string) {
    setScanResult(code);
    setLoading(true);
    const { data } = await supabase.from('gadgets').select('*').eq('serial_number', code).single();
    
    if (data) {
      setItem(data);
      setIsNew(false);
    } else {
      setItem(null);
      setIsNew(true);
    }
    setLoading(false);
  }

  const saveGadget = async () => {
    if (!gadgetName) return alert("Введите название!");
    const { error } = await supabase.from('gadgets').insert([
      { name: gadgetName, serial_number: scanResult, status: 'available' }
    ]);
    if (!error) { alert("Гаджет добавлен! ✅"); setIsNew(false); onScan(scanResult!); setGadgetName(''); }
  };

  const saveEmployee = async () => {
    const { error } = await supabase.from('employees').insert([{ full_name: employeeName }]);
    if (!error) { alert("Сотрудник добавлен! 👤"); setEmployeeName(''); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
      {/* HEADER */}
      <header className="bg-white border-b p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="font-black text-blue-600 text-xl tracking-tight">STOCKS.IO 🛰️</h1>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setActiveTab('scan')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${activeTab === 'scan' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>SCAN</button>
            <button onClick={() => setActiveTab('staff')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${activeTab === 'staff' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>STAFF</button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        
        {activeTab === 'scan' && (
          <>
            {/* SCANNER WINDOW */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/40 overflow-hidden border-4 border-white">
              <div id="reader"></div>
            </div>

            {loading && <div className="text-center py-4 animate-pulse text-blue-500 font-medium">Сверка с базой...</div>}

            {/* IF PRODUCT EXISTS */}
            {item && !isNew && (
              <div className="bg-white p-6 rounded-[2rem] border-l-8 border-green-500 shadow-lg">
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">In Database</span>
                <h2 className="text-2xl font-bold mt-1">{item.name}</h2>
                <p className="text-gray-400 text-sm font-mono mt-1">SN: {item.serial_number}</p>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{item.status}</span>
                </div>
              </div>
            )}

            {/* IF NEW PRODUCT (FORM) */}
            {isNew && (
              <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-2xl shadow-blue-300 animate-in slide-in-from-bottom-5">
                <h2 className="text-xl font-bold mb-2">New Item Detected! 🆕</h2>
                <p className="text-blue-100 text-sm mb-4">This QR is not registered. Fill in the details:</p>
                <input 
                  placeholder="Gadget name (e.g. Sony A7 III)"
                  className="w-full p-4 rounded-xl bg-blue-700 border-none placeholder-blue-300 text-white outline-none ring-2 ring-blue-400 focus:ring-white transition-all mb-3"
                  value={gadgetName}
                  onChange={e => setGadgetName(e.target.value)}
                />
                <button onClick={saveGadget} className="w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">REGISTER ITEM</button>
              </div>
            )}
          </>
        )}

        {activeTab === 'staff' && (
          <div className="bg-white p-6 rounded-[2rem] shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Add New Employee 👤</h2>
            <div className="space-y-3">
              <input 
                placeholder="Full Name"
                className="w-full p-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={employeeName}
                onChange={e => setEmployeeName(e.target.value)}
              />
              <button onClick={saveEmployee} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all">SAVE STAFF MEMBER</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
