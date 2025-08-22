"use client";

import { useAccount, useDisconnect } from "wagmi";

export default function WalletConnected() {
  // ── State & hooks ──────────────────────────────────────────────
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  // Determine token address for current chain

  // ── TSX ──────────────────────────────────────────────
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <p>
        <strong>Address:</strong> {address?.slice(0, 6)}...
        {address?.slice(-4)}
      </p>
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
