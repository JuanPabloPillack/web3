'use client'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

export default function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()

  return (
    <div className="p-4">
      {isConnected ? (
        <w3m-account-button />
      ) : (
        <button onClick={() => open()} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Conectar Wallet
        </button>
      )}
    </div>
  )
}