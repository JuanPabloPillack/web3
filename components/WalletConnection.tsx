import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

export function WalletConnection() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { open } = useWeb3Modal();

    if (!isConnected) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Faucet Token DApp</h2>
                <p className="mb-6 text-gray-600">
                Connect your wallet to claim tokens from the faucet.
                </p>
                <button
                onClick={() => open()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg"
                >
                Connect Wallet
                </button>
            </div>
        )
    }

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Connected:</p>
            <p className="font-mono text-sm break-all">{address}</p>
            <button
                onClick={() => disconnect()}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
                Disconnect
            </button>
        </div>
    )

}