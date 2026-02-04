export const runtime = 'edge';

import { createClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'

export default async function PublicItemPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params
  const supabase = await createClient()
  
  const { data: item } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', itemId)
    .single()

  if (!item) notFound()

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mb-6 flex items-center justify-center text-white">
          <span className="font-black text-2xl">📦</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 uppercase mb-2">{item.name}</h1>
        <p className="text-slate-500 mb-6 font-medium">{item.description || 'No description provided'}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
            <span className="font-bold text-slate-400 uppercase text-xs">Status</span>
            <span className="font-black text-blue-600 uppercase text-xs">{item.status}</span>
          </div>
          <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
            <span className="font-bold text-slate-400 uppercase text-xs">Category</span>
            <span className="font-black text-slate-900 uppercase text-xs">{item.category}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
