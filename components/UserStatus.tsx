import { useAccount, useReadContract } from 'wagmi';
import { FAUCET_TOKEN_ABI, FAUCET_TOKEN_ADDRESS } from '../contracts/FaucetToken';
import { formatUnits } from 'viem';

export function UserStatus() {
    const { address, isConnected } = useAccount();

    // Verificar si ya reclamó tokens
    const { data: hasClaimed, isLoading: isLoadingClaimed } = useReadContract({
        address: FAUCET_TOKEN_ADDRESS,
        abi: FAUCET_TOKEN_ABI,
        functionName: 'hasAddressClaimed',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    const { data: balance, isLoading: isLoadingBalance } = useReadContract({
        address: FAUCET_TOKEN_ADDRESS,
        abi: FAUCET_TOKEN_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    if (!isConnected || !address) {
        return null;
    }

    const formattedBalance = balance ? formatUnits(balance, 18) : '0';

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Your Token Status</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Token Balance:</p>
                {isLoadingBalance ? (
                    <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
                ) : (
                    <p className="text-xl font-bold text-green-600">
                    {Number(formattedBalance).toLocaleString()} FTK
                    </p>
                )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Claim Status:</p>
                {isLoadingClaimed ? (
                    <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                    <p className={`text-xl font-bold ${
                    hasClaimed ? 'text-orange-600' : 'text-blue-600'
                    }`}>
                    {hasClaimed ? 'Already Claimed' : 'Available'}
                    </p>
                )}
                </div>
            </div>
        </div>
    )
}
