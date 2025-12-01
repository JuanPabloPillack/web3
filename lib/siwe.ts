// lib/siwe.ts
import { SiweMessage } from 'siwe'

/**
 * Genera el mensaje SIWE listo para firmar según el estándar EIP-4361
 * @param address Dirección de la wallet conectada
 * @param nonce Nonce recibido del backend (anti-replay)
 * @returns String del mensaje preparado para personal_sign
 */
export const getSiweMessage = (address: string, nonce: string): string => {
  const domain = window.location.host
  const origin = window.location.origin

  const message = new SiweMessage({
    domain,
    address,
    statement: 'Sign in with Ethereum to the faucet app.',
    uri: origin,
    version: '1',
    chainId: 11155111, // Sepolia
    nonce,
  })

  // prepareMessage() formatea según el estándar y agrega el header
  return message.prepareMessage()
}