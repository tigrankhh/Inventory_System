import { createClient } from '@/lib/supabaseServer'

export const runtime = 'edge';

export default async function Home() {
  // Важно: вызываем через await
  const supabase = await createClient()
  
  // Пример запроса к данным
  const { data: items } = await supabase.from('inventory').select('*')

  return (
    <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Globaaal Network Brrrooo</h1>
      <div style={{ marginTop: '20px', color: '#0f0' }}>
        ● Database Connected: {items ? 'YES' : 'FETCHING...'}
      </div>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </main>
  )
}
