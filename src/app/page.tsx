import React from 'react';

export const runtime = 'edge';

export default function Home() {
  return (
    <main style={{ 
      backgroundColor: '#000', 
      color: '#fff', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.05em', marginBottom: '10px' }}>
          INVENTORY APP
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          globaaal network brrrooo
        </p>
        <div style={{ 
          marginTop: '40px', 
          padding: '10px 20px', 
          border: '1px solid #333', 
          borderRadius: '50px',
          display: 'inline-block',
          fontSize: '0.9rem',
          color: '#0f0'
        }}>
          ● SYSTEM ONLINE
        </div>
      </div>
    </main>
  );
}
