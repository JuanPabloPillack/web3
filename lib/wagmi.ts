// lib/wagmi.ts
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { sepolia } from 'wagmi/chains'
import { http } from 'viem'


const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'TU_PROJECT_ID_AQUI'

if (!projectId || projectId.includes('TU_PROJECT_ID')) {
  console.warn('⚠️  Crea un proyecto gratis en https://cloud.walletconnect.com y poné el ID en .env.local')
}

const metadata = {
  name: 'Faucet Token - TP Web3 + SIWE',
  description: 'Entrega final con autenticación segura y backend protegido',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [sepolia] as const

// Configuración oficial recomendada por Wagmi + Web3Modal
export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com')
  }
})

// Inicialización del modal (solo se llama una vez)
createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#8b5cf6', // morado bonito
  },
  // Opcional: forzar Sepolia como red principal
  defaultChain: sepolia,
  chainImages: {
    [sepolia.id]: 'https://icons.llamao.fi/icons/chains/rsz_sepolia.jpg'
  }
})