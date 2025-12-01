import { WalletConnection } from './components/WalletConnection';
import { ContractInfo } from './components/ContractInfo';
import { UserStatus } from './components/UserStatus';
import { FaucetClaim } from './components/FaucetClaim';
import { FaucetUsersList } from './components/FaucetUsersList';
import { useAccount } from 'wagmi';
import { NetworkChecker } from './components/NetworkChecker';


function App() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <div className="container mx-0 px-4 py-8">
        <WalletConnection />

        {isConnected && (
          <>
            <NetworkChecker />
            <ContractInfo />
            <UserStatus />
            <FaucetClaim />
            <FaucetUsersList />
          </>
        )}
      </div>
    </div>
  )
}

export default App