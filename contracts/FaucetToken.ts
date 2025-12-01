export const FAUCET_TOKEN_ADDRESS = "0x3E2117C19A921507EaD57494BbF29032F33C7412";

export const FAUCET_TOKEN_ABI = [
  // Función para reclamar tokens
  {
    inputs: [],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Verificar si ya reclamó
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "hasAddressClaimed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Obtener balance
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Obtener usuarios del faucet
  {
    inputs: [],
    name: "getFaucetUsers",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  // Cantidad del faucet
  {
    inputs: [],
    name: "getFaucetAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
] as const;

export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";