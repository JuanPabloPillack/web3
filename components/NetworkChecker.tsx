import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export function NetworkChecker() {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    if (!isConnected) return null;

    if (chainId !== sepolia.id) {
        return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-yellow-800 font-medium">Wrong Network</h3>
                    <p className="text-yellow-700 text-sm">
                    Please switch to Sepolia Testnet to use this faucet.
                    </p>
                </div>
                <button
                    onClick={() => switchChain({ chainId: sepolia.id })}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                >
                    Switch to Sepolia
                </button>
            </div>
            <div className="mt-2 text-xs text-yellow-600">
                Current: {chainId} | Required: {sepolia.id} (Sepolia)
            </div>
        </div>
        );
    }

    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
        <p className="text-green-800 text-sm">
            ✅ Connected to Sepolia Testnet
        </p>
        </div>
    );
}
