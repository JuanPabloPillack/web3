// app/page.tsx
'use client'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { getSiweMessage } from '@/lib/siwe'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [token, setToken] = useState<string | null>(null)
  const [status, setStatus] = useState<any>(null)

  const signIn = async () => {
    if (!address) return

    const res = await fetch('/api/auth/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    })
    const { nonce } = await res.json()

    const message = getSiweMessage(address, nonce)
    const signature = await window.ethereum?.request({
      method: 'personal_sign',
      params: [message, address]
    })

    const loginRes = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature, address })
    })

    const data = await loginRes.json()
    if (data.token) {
      setToken(data.token)
      localStorage.setItem('jwt', data.token)
      loadStatus(data.token)
    }
  }

  const claim = async () => {
    const res = await fetch('/api/faucet/claim', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token || localStorage.getItem('jwt')}`
      }
    })
    const data = await res.json()
    alert(data.success ? '¡Claim exitoso!' : data.error)
    loadStatus(token!)
  }

  const loadStatus = async (jwt: string) => {
    if (!address) return
    const res = await fetch(`/api/faucet/status/${address}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    })
    const data = await res.json()
    setStatus(data)
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl mb-8">Faucet Token - TP Web3 + SIWE</h1>
      
      <w3m-button />

      {isConnected && !token && (
        <button onClick={signIn} className="bg-green-600 text-white px-6 py-3 mt-4 rounded">
          Sign-In with Ethereum
        </button>
      )}

      {token && (
        <div className="mt-8">
          <button onClick={claim} disabled={status?.hasClaimed} className="bg-purple-600 text-white px-8 py-4 text-xl rounded disabled:opacity-50">
            {status?.hasClaimed ? 'Ya reclamaste' : 'Reclamar 1,000,000 tokens'}
          </button>

          {status && (
            <div className="mt-6 bg-gray-100 p-6 rounded">
              <p>Balance: {Number(status.balance) / 1e18} tokens</p>
              <p>Usuarios que reclamaron: {status.users.length}</p>
            </div>
          )}
        </div>
      )}
    </main>
  )
}