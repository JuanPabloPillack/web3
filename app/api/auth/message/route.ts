// app/api/auth/message/route.ts
import { NextResponse } from 'next/server'
import { generateNonce } from 'siwe'

const nonces = new Map<string, string>()

export async function POST(req: Request) {
  try {
    const { address } = await req.json()
    if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 })

    const nonce = generateNonce()
    nonces.set(address.toLowerCase(), nonce)

    return NextResponse.json({ nonce })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}