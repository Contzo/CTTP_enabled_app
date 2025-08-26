import { sepolia, arbitrumSepolia } from "wagmi/chains";
import { Abi } from "viem";

// Map of token addresses per chain
type TokenData = {
  name: string;
  usdcTokenAddress: `0x${string}`;
  domain: number;
  tokenMessengerAddress: `0x${string}`;
  messageTransmitterV2Address: `0x${string}`;
};
export const USDC_ADDRESSES: Record<number, TokenData> = {
  [sepolia.id]: {
    name: "Sepolia",
    usdcTokenAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    domain: 101,
    tokenMessengerAddress: "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
    messageTransmitterV2Address: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
  },
  [arbitrumSepolia.id]: {
    name: "Arbitrum Sepolia",
    usdcTokenAddress: "0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d",
    domain: 112,
    tokenMessengerAddress: "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
    messageTransmitterV2Address: "0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872",
  },
  // add other chains here
};

export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const satisfies Abi;

export const TOKEN_MESSENGER_ABI = [
  {
    type: "function",
    name: "depositForBurn",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "destinationDomain", type: "uint32" },
      { name: "mintRecipient", type: "bytes32" },
      { name: "burnToken", type: "address" },
    ],
    outputs: [{ name: "nonce", type: "uint64" }],
  },
  {
    type: "event",
    name: "MessageSent",
    inputs: [{ name: "message", type: "bytes", indexed: false }],
    anonymous: false,
  },
] as const satisfies Abi;
