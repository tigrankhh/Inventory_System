export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // Это заставит Cloudflare создать воркер!

import { createClient } from '@/lib/supabaseServer';
import { Suspense } from 'react';




// ℹ️ Функция получения данных с расширенным логированием
async function getInventoryData() {
  console.log("ℹ️ [Inventory Fetch] Starting request to Supabase...");
  
  try {
    const supabase = await createClient();
    
    // Проверка наличия переменных окружения (частая причина 500 на Cloudflare)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("❌ [Config Error] NEXT_PUBLIC_SUPABASE_URL is missing in Edge Runtime!");
    }

    const { data, error, status } = await supabase
      .from('inventory')
      .select('*')
      .limit(50);

    if (error) {
      console.error(`❌ [Supabase Error] Status: ${status}, Message: ${error.message}`);
      throw new Error(error.message);
    }

    console.log(`ℹ️ [Inventory Fetch] Success! Retrieved ${data?.length || 0} items.`);
    return data;
    
  } catch (err: any) {
    // ⚠️ Ловим "тихие" падения (проблемы сети, таймауты)
    console.error("❌ [Critical Failure] Failed to fetch inventory:", err.message);
    return null;
  }
}

export default async function Home() {
  console.log("ℹ️ [Page Render] Rendering Home page (Edge Runtime)");

  const items = await getInventoryData();

  if (!items) {
    console.warn("⚠️ [UI Warning] No items returned, showing empty state or error UI");
    return (
      <div className="p-10 text-red-500 bg-black min-h-screen">
        <h1>❌ System Error (Check Cloudflare Logs)</h1>
      </div>
    );
  }

  return (
    <main className="bg-black text-white p-8">
      <h1 className="italic font-black text-3xl">GLOBAAAL NETWORK BRRROOO</h1>
      <ul className="mt-4">
        {items.map((item: any) => (
          <li key={item.id} className="border-b border-green-500/30 py-2">
             {item.name} — {item.quantity}
          </li>
        ))}
      </ul>
    </main>
  );
}
