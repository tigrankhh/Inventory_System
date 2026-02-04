export const runtime = 'edge';


import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import { Plus, Search, PackageOpen, Edit2, Trash2, QrCode } from 'lucide-react'
import Link from 'next/link'

export default async function InventoryPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const params = await searchParams;
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  let query = supabase
    .from('inventory_items')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (params.q) {
    query = query.ilike('name', `%${params.q}%`)
  }

  const { data: items } = await query

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen bg-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-blue-600 uppercase">Inventory</h1>
          <p className="text-slate-500 font-medium">Пользователь: {session.user.email}</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-200">
          <Plus size={20} /> ADD ITEM
        </button>
      </div>

      <div className="flex gap-4 mb-8 bg-slate-50 p-4 rounded-[2rem] border border-slate-100">
        <form className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            name="q"
            defaultValue={params.q}
            placeholder="Search assets..." 
            className="w-full bg-white border-none rounded-xl py-3 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </form>
      </div>

      {!items || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-4 border-dashed border-slate-100 rounded-[3rem]">
          <PackageOpen size={64} className="text-slate-200 mb-4" />
          <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">No items found</h2>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="group bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between hover:shadow-2xl hover:shadow-blue-100 transition-all border-l-8 border-l-blue-600">
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-800 uppercase leading-none mb-2">{item.name}</h3>
                <div className="flex gap-3 items-center">
                  <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tighter">
                    {item.category}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tighter 
                    ${item.status === 'in stock' ? 'bg-green-100 text-green-600' : 
                      item.status === 'low' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link href={`/inventory/${item.id}/qr`} className="p-3 bg-slate-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                  <QrCode size={20} />
                </Link>
                <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                  <Edit2 size={20} />
                </button>
                <button className="p-3 bg-slate-50 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
