"use client";

import { useAccount, useConnect, useConfig } from "wagmi";
import { useEffect } from "react";

export default function WagmiDebug() {
  const config = useConfig();
  const { isConnected, address, chain } = useAccount();
  const { connectors } = useConnect();

  useEffect(() => {
    console.log("=== WAGMI DEBUG INFO ===");
    console.log("Config:", config);
    console.log("Available chains:", config.chains);
    console.log("Available connectors:", connectors);
    console.log("Is connected:", isConnected);
    console.log("Address:", address);
    console.log("Current chain:", chain);
    console.log("========================");
  }, [config, connectors, isConnected, address, chain]);

  return (
    <div className="p-4 bg-gray-100 rounded text-xs">
      <p>Check browser console for Wagmi debug info</p>
      <p>Connectors available: {connectors.length}</p>
      <p>Chains configured: {config.chains.length}</p>
    </div>
  );
}
