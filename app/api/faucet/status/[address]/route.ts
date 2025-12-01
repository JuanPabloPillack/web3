// app/api/faucet/status/[address]/route.ts - cambio realizado
import { NextResponse } from 'next/server'
import { publicClient, ABI, CONTRACT_ADDRESS } from './utils' 

export async function GET(req: Request, { params }: { params: { address: string } }) {
  const address = params.address as `0x${string}`
  const auth = req.headers.get('authorization')

  function verifyToken(authHeader?: string) {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.split(' ')[1]
  try {
    const payload = verify(token, JWT_SECRET) as any
    return payload.address as string
  } catch {
    return null
  }
}

  try {
    const [hasClaimed, balance, users] = await Promise.all([
      publicClient.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'hasAddressClaimed', args: [address] }),
      publicClient.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'balanceOf', args: [address] }),
      publicClient.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'getFaucetUsers' })
    ])

    return NextResponse.json({
      hasClaimed,
      balance: balance.toString(),
      users
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 })
  }
}