"use client";

import useAccountUSDCBalance from "@/hooks/useAccountUSDCBalance";
import { useEffect } from "react";
import { formatUnits } from "viem";
import { useDisconnect, useSwitchChain } from "wagmi";

export default function WalletConnected() {
  // ── State & hooks ──────────────────────────────────────────────
  const { balance, address, chainId, tokenAddress, isLoading, error } =
    useAccountUSDCBalance();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();

  // Determine token address for current chain

  useEffect(() => {
    console.log("Current USDC token address", tokenAddress);
  }, [tokenAddress]);

  // ── TSX ──────────────────────────────────────────────
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      {/* Wallet & chain info */}
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2 items-center">
          <p>
            <strong>Address:</strong> {address?.slice(0, 6)}...
            {address?.slice(-4)}
          </p>

          <select
            className="border rounded px-2 py-1"
            onChange={(e) => switchChain?.({ chainId: Number(e.target.value) })}
            defaultValue={chainId ?? ""}
          >
            <option value="" disabled>
              Select Network
            </option>
            {chains.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          {isLoading && <p>Loading balance...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          {balance != null && ( // checks both undefined and null
            <p>
              Balance: <strong>{formatUnits(balance, 6)}</strong> USDC
            </p>
          )}
        </div>
      </div>

      {/* Disconnect button */}
      <button
        onClick={() => disconnect()}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Disconnect
      </button>
    </div>
  );
}
