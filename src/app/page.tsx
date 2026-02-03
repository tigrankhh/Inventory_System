"use client";

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '@/lib/supabase';

export default function SmartInventory() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [existingProduct, setExistingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Поля для нового товара
  const [formData, setFormData] = useState({ name: '', category: 'Other' });

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    scanner.render(onScanSuccess, (err) => {});
    return () => { scanner.clear().catch(e => {}); };
  }, []);

  // Функция, которая срабатывает при сканировании
  async function onScanSuccess(decodedText: string) {
    setScanResult(decodedText);
    setLoading(true);

    // Ищем продукт в базе по серийнику (QR-коду)
    const { data, error } = await supabase
      .from('gadgets')
      .select('*')
      .eq('serial_number', decodedText)
      .single();

    if (data) {
      setExistingProduct(data);
      setIsNewProduct(false);
    } else {
      // Если продукта нет в базе
      setExistingProduct(null);
      setIsNewProduct(true);
    }
    setLoading(false);
  }

  // Функция сохранения нового продукта
  const handleSaveNew = async () => {
    setLoading(true);
    const { error } = await supabase.from('gadgets').insert([{
      name: formData.name,
      category: formData.category,
      serial_number: scanResult,
      status: 'available'
    }]);

    if (!error) {
      alert("Product added to database! 🚀");
      setIsNewProduct(false);
      // Сразу подгружаем его как существующий
      onScanSuccess(scanResult!); 
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        
        <h1 className="text-2xl font-black text-center text-blue-600 mt-6">SCAN & MANAGE 🛰️</h1>

        {/* СКАНЕР */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-white">
          <div id="reader"></div>
        </div>

        {loading && <p className="text-center animate-pulse text-blue-500">Checking database...</p>}

        {/* ЕСЛИ ПРОДУКТ НАЙДЕН */}
        {existingProduct && (
          <div className="bg-green-100 p-6 rounded-3xl border border-green-200 animate-in fade-in duration-500">
            <h2 className="text-green-800 font-bold text-xl uppercase italic">Found in System ✅</h2>
            <div className="mt-2 text-green-700">
              <p><strong>Name:</strong> {existingProduct.name}</p>
              <p><strong>Category:</strong> {existingProduct.category}</p>
              <p><strong>SN:</strong> {existingProduct.serial_number}</p>
            </div>
          </div>
        )}

        {/* ЕСЛИ ПРОДУКТА НЕТ (ФОРМА ДОБАВЛЕНИЯ) */}
        {isNewProduct && (
          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-200 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-orange-800 font-bold text-xl uppercase">New Product Detected! ⚠️</h2>
            <p className="text-orange-600 text-sm mb-4">This QR is not in our database. Register it now:</p>
            
            <div className="space-y-3">
              <input 
                placeholder="Product Name (e.g. iPhone 13)"
                className="w-full p-4 rounded-2xl border-none ring-1 ring-orange-300 outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <select 
                className="w-full p-4 rounded-2xl border-none ring-1 ring-orange-300 outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Laptop">Laptop</option>
                <option value="Phone">Phone</option>
                <option value="Monitor">Monitor</option>
                <option value="Other">Other</option>
              </select>
              <button 
                onClick={handleSaveNew}
                className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl hover:bg-orange-700 transition-colors"
              >
                Add to Inventory
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
