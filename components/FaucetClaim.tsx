import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { FAUCET_TOKEN_ABI, FAUCET_TOKEN_ADDRESS } from '../contracts/FaucetToken';

export function FaucetClaim() {
    const { address, isConnected } = useAccount();

    // Verfificar si ya reclamó 
    const { data: hasClaimed } = useReadContract({
        address: FAUCET_TOKEN_ADDRESS,
        abi: FAUCET_TOKEN_ABI,
        functionName: 'hasAddressClaimed',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // Obtener cantidad del faucet
    const { data: faucetAmount } = useReadContract({
        address: FAUCET_TOKEN_ADDRESS,
        abi: FAUCET_TOKEN_ABI,
        functionName: 'getFaucetAmount',
    });

    // Hook para escribir al contrato
    const {
        writeContract,
        data: hash,      
        isPending,
        error
    } = useWriteContract();

    //  Esperar confirmación de la transacción
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const handleClaim = async () => {
        try {
            writeContract({
                address: FAUCET_TOKEN_ADDRESS,
                abi: FAUCET_TOKEN_ABI,
                functionName: 'claimTokens',
            });
        } catch (error) {
            console.error('Error claiming tokens:', error);
        }
    }

    if (!isConnected) {
        return null;
    }

    if (hasClaimed) {
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
            Tokens Already Claimed
            </h3>
            <p className="text-orange-700">
            You have already claimed your tokens from this faucet. Each address can only claim once.
            </p>
        </div>
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Claim Faucet Tokens</h3>

            <div className="mb-6">
                <p className="text-gray-700 mb-2">
                You can claim  
                    <span className="font-bold text-green-600">
                        {faucetAmount}
                    </span> FTK tokens for free!
                </p>
                <p className="text-sm text-gray-500">
                    Each address can only claim once. This operation will require a small gas fee.
                </p>
            </div>

            <button
                onClick={handleClaim}
                disabled={isPending || isConfirming || hasClaimed}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                isPending || isConfirming
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
            >
                {isPending && 'Preparing Transaction...'}
                {isConfirming && 'Confirming Transaction...'}
                {!isPending && !isConfirming && 'Claim Tokens'}
            </button>

            {hash && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 mb-2">Transaction submitted!</p>
                    <a
                        href={`https://sepolia.etherscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                    >
                        View on Etherscan: {hash}
                    </a>
                </div>
            )}

            {isConfirmed && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">✅ Tokens claimed successfully!</p>
                    <p className="text-green-700 text-sm">Check your wallet balance.</p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">❌ Error:</p>
                    <p className="text-red-700 text-sm">{error.message}</p>
                </div>
            )}
            </div>
    )
}   