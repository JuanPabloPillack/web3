import { SiweMessage } from 'siwe'

export const getSiweMessage = (address: string, nonce: string) => {
  const domain = window.location.host
  const origin = window.location.origin

  const message = new SiweMessage({
    domain,
    address,
    statement: 'Sign in with Ethereum to the faucet app.',
    uri: origin,
    version: '1',
    chainId: 11155111,
    nonce,
  })

  return message.prepareMessage()
}