// app/api/faucet/claim/route.ts
import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import {
  createPublicClient,
  createWalletClient,
  http,

} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

// Variables de entorno obligatorias (definidas en .env.local)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!
const PRIVATE_KEY = process.env.PRIVATE_KEY!                   // Esta wallet paga el gas
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!
const JWT_SECRET = process.env.JWT_SECRET!

// Cuenta del backend que firma las transacciones (nunca se expone al frontend)
const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`)

// Cliente con permisos de escritura (usa la private key)
const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(RPC_URL)
})

// Cliente solo de lectura (no necesita clave privada)
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL)
})

// ABI 
// Usar `as const` permite que TypeScript infiera tipos exactos → menos errores
const ABI = [
  { name: 'claimTokens', inputs: [], outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'hasAddressClaimed', inputs: [{ type: 'address' }], outputs: [{ type: 'bool' }], stateMutability: 'view', type: 'function' },
  { name: 'balanceOf', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' }
] as const

// Middleware manual de autenticación JWT (reutilizable)
function verifyToken(authHeader?: string): string | null {
  // Verifica que venga "Bearer <token>"
  if (!authHeader?.startsWith('Bearer ')) return null
  
  const token = authHeader.split(' ')[1]
  
  try {
    const payload = verify(token, JWT_SECRET) as any
    // Devolvemos la address que está dentro del JWT
    return payload.address as string
  } catch {
    // Token inválido, expirado o mal firmado
    return null
  }
}

export async function POST(req: Request) {
  // 1. Extraemos y validamos el JWT del header Authorization
  const address = verifyToken(req.headers.get('authorization') || '')
  if (!address) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 2. Verificamos que esta dirección NO haya reclamado ya
    const hasClaimed = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'hasAddressClaimed',
      args: [address as `0x${string}`]
    })

    if (hasClaimed) {
      return NextResponse.json({
        success: false,
        error: 'Already claimed'
      })
    }

    // 3. Simulamos la transacción ANTES de enviarla
    // Esto evita gastar gas si hay error (revert, insuficiente balance del faucet, etc.)
    const { request } = await publicClient.simulateContract({
      account,                                          // quién paga el gas
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'claimTokens',
      // claimTokens() no recibe parámetros
    })

    // 4. Si la simulación pasó → ejecutamos la transacción real
    const hash = await walletClient.writeContract(request)

    // 5. Éxito total: devolvemos el hash de la transacción
    return NextResponse.json({
      success: true,
      txHash: hash
    })

  } catch (error: any) {
    // Captura errores de:
    //    - simulación (revert del contrato)
    //    - envío de tx (red congestionada, etc.)
    //    - lectura del contrato
    console.error('Claim failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.shortMessage || error.message || 'Transaction failed'
    })
  }
}