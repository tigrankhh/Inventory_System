'use client'
import { createClient } from '@/lib/supabaseClient'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl text-center">
        <h1 className="text-3xl font-black mb-6 italic tracking-tight">INV.MANAGER</h1>
        <button 
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 bg-white border border-slate-300 p-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Войти через Google
        </button>
      </div>
    </div>
  )
}
