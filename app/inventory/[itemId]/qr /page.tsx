import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const runtime = 'edge';

export default async function QRPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params
  const supabase = await createClient()

  return (
    <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <Link href={`/inventory/${itemId}`} style={{ display: 'flex', alignItems: 'center', color: '#888', textDecoration: 'none' }}>
        <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Back
      </Link>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>QR CODE</h1>
        <p>Item ID: {itemId}</p>
        {/* Здесь будет твой QR код */}
        <div style={{ width: '200px', height: '200px', background: '#fff', margin: '20px auto' }}></div>
      </div>
    </main>
  )
}
