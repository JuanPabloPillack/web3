import { useReadContract } from 'wagmi';
import { FAUCET_TOKEN_ABI, FAUCET_TOKEN_ADDRESS } from '../contracts/FaucetToken';

export function FaucetUsersList() {
    const { data: users, isLoading, error } = useReadContract({
        address: FAUCET_TOKEN_ADDRESS,
        abi: FAUCET_TOKEN_ABI,
        functionName: 'getFaucetUsers',
    });

    if (isLoading) {
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Faucet Users</h3>
            <div className="animate-pulse space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-200 h-4 rounded"></div>
                ))}
            </div>
        </div>
    }

    if (error) {
        return (
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Faucet Users</h3>
                <p className="text-red-600">Error loading users: {error.message}</p>
            </div>
        )
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
                Faucet Users ({users?.length || 0})
            </h3>

            {users && users.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                        {users.map((user: string, index: number) => (
                            <div 
                                key={user} 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                        #{index + 1}
                                    </span>
                                    <span className="font-mono text-black text-sm break-all">
                                        {user}
                                    </span>
                                </div>
                                <a
                                href={`https://sepolia.etherscan.io/address/${user}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                View ↗
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center py-8">
                    No users have claimed tokens yet.
                </p>
            )}
        </div>
    )
}