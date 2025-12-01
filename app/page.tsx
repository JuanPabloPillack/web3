// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { getSiweMessage } from '@/lib/siwe'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // Estado de autenticación y datos del faucet
  const [token, setToken] = useState<string | null>(null)
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Recuperar JWT del localStorage al cargar (persistir sesión)
  useEffect(() => {
    const saved = localStorage.getItem('jwt')
    if (saved && address) {
      setToken(saved)
      loadStatus(saved)
    }
  }, [address])

  // 1. Sign-In with Ethereum
  const signIn = async () => {
    if (!address) return
    setLoading(true)
    setError(null)

    try {
      // Obtener nonce del backend
      const res = await fetch('/api/auth/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })

      if (!res.ok) throw new Error('Error al obtener nonce')
      const { nonce } = await res.json()

      // Preparar y firmar mensaje SIWE
      const message = getSiweMessage(address, nonce)
      const signature = await window.ethereum?.request({
        method: 'personal_sign',
        params: [message, address]
      })

      if (!signature) throw new Error('Firma cancelada')

      // Enviar firma al backend
      const loginRes = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature, address })
      })

      const data = await loginRes.json()
      if (!data.token) throw new Error(data.error || 'Login falló')

      setToken(data.token)
      localStorage.setItem('jwt', data.token)
      loadStatus(data.token)
      alert('¡Autenticado correctamente!')
    } catch (err: any) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 2. Reclamar tokens (backend paga gas)
  const claim = async () => {
    setLoading(true)
    setError(null)

    try {
      const jwt = token || localStorage.getItem('jwt')
      const res = await fetch('/api/faucet/claim', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })

      const data = await res.json()
      if (data.success) {
        alert(`¡Éxito! Tx: ${data.txHash}`)
        loadStatus(jwt!)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 3. Cargar estado del faucet
  const loadStatus = async (jwt: string) => {
    if (!address) return
    try {
      const res = await fetch(`/api/faucet/status/${address}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      const data = await res.json()
      setStatus(data)
    } catch (err) {
      console.error('Error cargando estado', err)
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Faucet Token Sepolia
      </h1>

      {/* Botón de conexión Web3Modal */}
      <div className="flex justify-center mb-8">
        <w3m-button size="md" label="Conectar Wallet" />
      </div>

      {/* Estado de conexión */}
      {isConnected && (
        <div className="text-center mb-6 text-sm text-gray-600">
          Conectado: {address?.slice(0, 6)}...{address?.slice(-4)}
          <button onClick={() => disconnect()} className="ml-4 text-red-500 underline">
            Desconectar
          </button>
        </div>
      )}

      {/* Sign-In with Ethereum */}
      {isConnected && !token && (
        <div className="text-center">
          <button
            onClick={signIn}
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50"
          >
            {loading ? 'Firmando...' : 'Sign-In with Ethereum'}
          </button>
        </div>
      )}

      {/* Panel principal cuando está autenticado */}
      {token && (
        <div className="bg