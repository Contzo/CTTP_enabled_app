import { sepolia, arbitrumSepolia } from "wagmi/chains";
import { Abi } from "viem";

// Map of token addresses per chain
export const USDC_ADDRESSES: Record<
  number,
  { name: string; usdcTokenAddress: `0x${string}` }
> = {
  [sepolia.id]: {
    name: "Sepolia",
    usdcTokenAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
  [arbitrumSepolia.id]: {
    name: "Arbitrum Sepolia",
    usdcTokenAddress: "0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d",
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
