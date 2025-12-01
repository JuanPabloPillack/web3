// app/layout.tsx
import './globals.css'
import { wagmiConfig } from '@/lib/wagmi'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Opcional pero recomendado: React Query para mejor caching
const queryClient = new QueryClient()

export const metadata = {
  title: 'Faucet Token - TP Web3 + SIWE',
  description: 'Entrega final con autenticación Sign-In with Ethereum',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        {/*
          WagmiProvider: provee toda la config de Web3 (chains, transports, connectors)
          QueryClientProvider: mejora el rendimiento del cache de viem/wagmi
          Web3Modal se inicializa en lib/wagmi.ts → no hace falta nada más aquí
        */}
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}