"use client";
import { createConfig, fallback, http } from "wagmi";
import { arbitrumSepolia, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const getConfig = () => {
  return createConfig({
    chains: [sepolia, arbitrumSepolia],
    transports: {
      [sepolia.id]: fallback([
        http(process.env.SEPOLIA_RPC_URL), // Your custom RPC
        http(), // Fallback to default public RPC
      ]),
      [arbitrumSepolia.id]: fallback([
        http(process.env.ARBITRUM_SEPOLIA_RPC_URL), // Your custom RPC
        http(), // Fallback to default public RPC
      ]),
    },
    connectors: [injected()],
  });
};
