"use client";
import { createConfig, fallback, http } from "wagmi";
import { arbitrumSepolia, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const getConfig = () => {
  return createConfig({
    chains: [sepolia, arbitrumSepolia],
    transports: {
      [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL), // Your custom RPC
      [arbitrumSepolia.id]: http(
        process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL
      ), // Your custom RPC
    },
    connectors: [injected()],
  });
};
