// app/api/auth/signin/route.ts
import { NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

const nonces = new Map<string, string>()

export async function POST(req: Request) {
  try {
    const { message, signature, address } = await req.json()

    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.verify({ signature })

    const storedNonce = nonces.get(fields.address.toLowerCase())
    if (storedNonce !== fields.nonce) {
      return NextResponse.json({ error: 'Invalid nonce' }, { status: 422 })
    }

    nonces.delete(fields.address.toLowerCase())

    const token = sign({ address: fields.address }, JWT_SECRET, { expiresIn: '24h' })

    return NextResponse.json({ token, address: fields.address })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}