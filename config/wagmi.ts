import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { sepolia } from 'wagmi/chains';

export const projectId = 'b55335e8c8f800df9dcbee9fcf948878';

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
    name: 'Faucet Token App',
    description: 'A React app to interact with FaucetToken smart contract',
    url: 'http://localhost:5173',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [sepolia] as const;

export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
})