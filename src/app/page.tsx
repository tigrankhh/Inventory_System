'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        // Если юзер не залогинен — отправляем на логин
        router.push('/login')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }

    checkUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Навигация */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
          Inventory <span className="text-blue-600">Pro</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-500">{user?.email}</span>
          <button 
            onClick={handleSignOut}
            className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all"
          >
            Exit
          </button>
        </div>
      </nav>

      {/* Контент */}
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back! 📦</h2>
            <p className="text-slate-500 font-medium">Your inventory system is ready to work.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <p className="text-blue-600 font-black text-2xl">0</p>
                <p className="text-blue-400 text-[10px] font-bold uppercase uppercase tracking-widest">Products</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-slate-300 italic">
                <p className="text-sm font-bold">Coming Soon...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
