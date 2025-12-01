import './globals.css'
import { wagmiConfig } from '@/lib/wagmi'
import { WagmiProvider } from 'wagmi'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </body>
    </html>
  )
}