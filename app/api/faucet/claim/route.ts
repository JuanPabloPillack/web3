// app/api/faucet/claim/route.ts - cambio realizado
import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!
const PRIVATE_KEY = process.env.PRIVATE_KEY!
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!
const JWT_SECRET = process.env.JWT_SECRET!

const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`)

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(RPC_URL)
})

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL)
})

const ABI = [ 
  { name: 'claimTokens', inputs: [], outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'hasAddressClaimed', inputs: [{ type: 'address' }], outputs: [{ type: 'bool' }], stateMutability: 'view', type: 'function' },
  { name: 'getFaucetUsers', inputs: [], outputs: [{ type: 'address[]' }], stateMutability: 'view', type: 'function' },
  { name: 'balanceOf', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' }
] as const

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

export async function POST(req: Request) {
  const address = verifyToken(req.headers.get('authorization') || '')
  if (!address) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const hasClaimed = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'hasAddressClaimed',
      args: [address as `0x${string}`]
    })

    if (hasClaimed) {
      return NextResponse.json({ success: false, error: 'Already claimed' })
    }

    const { request } = await publicClient.simulateContract({
      account,
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'claimTokens',
    })

    const hash = await walletClient.writeContract(request)
    
    return NextResponse.json({ success: true, txHash: hash })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.shortMessage || error.message })
  }
}