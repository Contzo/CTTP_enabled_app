import { sepolia, arbitrumSepolia } from "wagmi/chains";
import { Abi } from "viem";

// Map of token addresses per chain
export const USDC_ADDRESSES: Record<
  number,
  { name: string; usdcTokenAddress: `0x${string}`; domain: number }
> = {
  [sepolia.id]: {
    name: "Sepolia",
    usdcTokenAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    domain: 101,
  },
  [arbitrumSepolia.id]: {
    name: "Arbitrum Sepolia",
    usdcTokenAddress: "0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d",
    domain: 112,
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
