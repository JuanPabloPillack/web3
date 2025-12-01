// app/api/auth/signin/route.ts
import { NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'
import { sign } from 'jsonwebtoken'

// Secreto para firmar el JWT. Viene desde .env.local → nunca queda expuesto
// El "!" es non-null assertion porque sabemos que lo definimos en .env
const JWT_SECRET = process.env.JWT_SECRET!

// Mapa en memoria que comparte estado con /auth/message
// Guarda los nonces generados previamente por dirección
// Esto evita ataques de replay: el nonce solo se puede usar una vez
const nonces = new Map<string, string>()

export async function POST(req: Request) {
  try {
    // 1. Recibimos del frontend: el mensaje SIWE preparado, la firma y la address
    const { message, signature, address } = await req.json()

    // 2. Reconstruimos el mensaje SIWE desde el string que nos mandaron
    const siweMessage = new SiweMessage(message)

    // 3. VERIFICACIÓN OFICIAL DE FIRMA (lo más importante del SIWE)
    // verify() lanza error si:
    //    - La firma no corresponde a la address
    //    - El nonce no coincide
    //    - El dominio/origin no es correcto
    //    - El mensaje está expirado o mal formado
    const fields = await siweMessage.verify({ signature })

    // 4. DOBLE CHECK del nonce (defensa en profundidad)
    // Aunque siwe.verify() ya lo chequea, nosotros también lo validamos contra nuestro mapa
    const storedNonce = nonces.get(fields.address.toLowerCase())

    if (storedNonce !== fields.nonce) {
      return NextResponse.json(
        { error: 'Invalid nonce' },
        { status: 422 } // 422 Unprocessable Entity = semánticamente incorrecto
      )
    }

    // 5. Nonce válido → lo eliminamos para que no se pueda reutilizar (replay attack protection)
    nonces.delete(fields.address.toLowerCase())

    // 6. Todo OK → generamos un JWT firmado con la address dentro
    // El frontend usará este token en los headers Authorization para acceder a rutas protegidas
    const token = sign(
      { address: fields.address }, // payload: solo guardamos la address
      JWT_SECRET,
      { expiresIn: '24h' }         // expiración razonable
    )

    // 7. Respuesta exitosa: devolvemos el JWT y la address
    return NextResponse.json({
      token,
      address: fields.address
    })

  } catch (error: any) {
    // Capturamos errores de:
    //    - JSON mal formado
    //    - verify() que falla (firma inválida, dominio equivocado, etc.)
    //    - Cualquier excepción inesperada
    console.error('SIWE verification failed:', error.message)
    return NextResponse.json(
      { error: error.message || 'Invalid signature or message' },
      { status: 400 }
    )
  }
}