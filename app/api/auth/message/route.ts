// app/api/auth/message/route.ts
import { NextResponse } from 'next/server'
import { generateNonce } from 'siwe'

// Mapa en memoria para almacenar los nonces generados por dirección
// Clave: address en minúsculas (para evitar problemas de case-sensitive)
// Valor: el nonce actual que espera el backend para esa wallet

const nonces = new Map<string, string>()

export async function POST(req: Request) {
  try {
    // 1. Parseamos el body que viene desde el frontend
    const { address } = await req.json()

    // Validación básica: si no mandan address → 400
    if (!address) {
      return NextResponse.json(
        { error: 'Address required' },
        { status: 400 }
      )
    }

    // 2. Generamos un nonce aleatorio y seguro usando la librería siwe
    const nonce = generateNonce()

    // 3. Guardamos el nonce asociado a esta dirección (en minúsculas para consistencia)
    nonces.set(address.toLowerCase(), nonce)

    // 4. Devolvemos solo el nonce al frontend
    // El frontend lo usará para armar el mensaje SIWE
    return NextResponse.json({ nonce })
  } catch (error) {
    // Capturamos cualquier error inesperado (JSON mal formado, etc.)
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }
}