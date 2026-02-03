import React from 'react';
import { supabase } from '@/libsupabase';
import { QrCode, History, Settings, Package, User } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Шапка */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-xl font-bold">Inventory System</h1>
      </header>

      {/* Основной контент */}
      <main className="flex-1 p-4 grid grid-cols-2 gap-4">
        {/* Кнопка сканера */}
        <button className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-sm border-2 border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 transition">
          <QrCode size={48} />
          <span className="mt-2 font-semibold">Scan QR</span>
        </button>

        {/* История */}
        <button className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-sm text-gray-700 hover:bg-gray-50 transition">
          <History size={48} />
          <span className="mt-2 font-semibold">History</span>
        </button>

        {/* Все гаджеты */}
        <button className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-sm text-gray-700 hover:bg-gray-50 transition">
          <Package size={48} />
          <span className="mt-2 font-semibold">Assets</span>
        </button>

        {/* Профиль */}
        <button className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-sm text-gray-700 hover:bg-gray-50 transition">
          <User size={48} />
          <span className="mt-2 font-semibold">Profile</span>
        </button>
      </main>

      {/* Футер */}
      <footer className="p-4 text-center text-gray-400 text-sm">
        v1.0.0 Powered by Supabase
      </footer>
    </div>
  );
}
