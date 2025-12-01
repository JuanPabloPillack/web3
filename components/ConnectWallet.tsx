// components/ConnectWallet.tsx
'use client'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'

export default function ConnectWallet() {
  const { address, isConnected, chain } = useAccount()
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md">
      {isConnected ? (
        <>
          {/* Botón oficial de Web3Modal con avatar y dirección */}
          <w3m-account-button />

          {/* Info extra opcional */}
          <div className="text-sm text-gray-600 hidden sm:block">
            {chain?.name || 'Red desconocida'}
          </div>

          {/* Botón de desconexión */}
          <button
            onClick={() => disconnect()}
            className="text-xs text-red-600 underline hover:no-underline"
          >
            Desconectar
          </button>
        </>
      ) : (
        <button
          onClick={() => open()}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
        >
          Conectar Wallet
        </button>
      )}
    </div>
  )
}