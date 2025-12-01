// lib/wagmi.ts
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { sepolia } from 'wagmi/chains'
import { http } from 'viem'

const projectId = 'TU_WALLET_CONNECT_PROJECT_ID' // crea uno gratis en walletconnect.com

const metadata = {
  name: 'Faucet Token TP',
  description: 'TP Web3 con SIWE',
  url: 'https://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [sepolia] as const

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL)
  }
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: 'light'
})