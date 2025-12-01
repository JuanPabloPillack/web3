// app/api/faucet/status/[address]/route.ts
import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { publicClient } from '@/lib/viem' // lo movemos a un archivo compartido
import { ABI } from '@/lib/contract'     // ABI compartido
import { sepolia } from 'viem/chains'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!
const JWT_SECRET = process.env.JWT_SECRET!

// Middleware reutilizable de autenticación JWT
function verifyToken(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.split(' ')[1]

  try {
    const payload = verify(token, JWT_SECRET!, { algorithms: ['HS256'] }) as any
    return payload.address as string
  } catch (error) {
    return null
  }
}

export async function GET(
  req: Request,
  { params }: { params: { address: string } }
) {
  const userAddress = params.address as `0x${string}`
  const authHeader = req.headers.get('authorization')

  // 1. Verificar que el JWT sea válido
  const authenticatedAddress = verifyToken(authHeader || '')
  if (!authenticatedAddress) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing token' },
      { status: 401 }
    )
  }

  // 2. Verificar que la address del JWT coincida con la del parámetro
  // (seguridad: no puedes consultar el estado de otra wallet)
  if (authenticatedAddress.toLowerCase() !== userAddress.toLowerCase()) {
    return NextResponse.json(
      { error: 'Forbidden - You can only view your own status' },
      { status: 403 }
    )
  }

  try {
    // 3. Lectura paralela de los 3 datos del contrato (optimizado)
    const [hasClaimed, balance, users] = await Promise.all([
      publicClient.readContract({('hasAddressClaimed', {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: 'hasAddressClaimed',
        args: [userAddress]
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: 'balanceOf',
        args: [userAddress]
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: 'getFaucetUsers'
      })
    ])

    // 4. Respuesta exacta según el enunciado
    return NextResponse.json({
      hasClaimed,                    // boolean
      balance: balance.toString(),    // string (para evitar problemas con BigInt en JSON)
      users                           // string[] de direcciones
    })

  } catch (error: any) {
    console.error('Error fetching faucet status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch status', details: error.shortMessage || error.message },
      { status: 500 }
    )
  }
}