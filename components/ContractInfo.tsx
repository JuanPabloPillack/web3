import { useReadContract } from 'wagmi';
import { FAUCET_TOKEN_ADDRESS, FAUCET_TOKEN_ABI } from '../contracts/FaucetToken';

export function ContractInfo() {
    const { data: faucetAmount } = useReadContract({
        address: FAUCET_TOKEN_ADDRESS,
        abi: FAUCET_TOKEN_ABI,
        functionName: 'getFaucetAmount',
    });

    const { data: totalUsers  } = useReadContract({
        address: FAUCET_TOKEN_ADDRESS,
        abi: FAUCET_TOKEN_ABI,
        functionName: 'getFaucetUsers',
        // select: (data) => data?.length || 0,
    });

    const totalUsersLength = totalUsers ? totalUsers.length : 0;

    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Faucet Token Contract</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm opacity-90">Tokens per Claim</p>
                    <p className="text-lg font-bold">
                        {faucetAmount} FTK
                    </p>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm opacity-90">Total Claimers</p>
                    <p className="text-lg font-bold">{totalUsersLength}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm opacity-90">Network</p>
                    <p className="text-lg font-bold">Sepolia</p>
                </div>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm opacity-90 mb-1">Contract Address:</p>
                <div className="flex items-center justify-between">
                    <code className="text-xs break-all mr-2">{FAUCET_TOKEN_ADDRESS}</code>
                    <a
                        href={`https://sepolia.etherscan.io/address/${FAUCET_TOKEN_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm"
                    >
                        View ↗
                    </a>
                </div>
            </div>
        </div>
    );
}