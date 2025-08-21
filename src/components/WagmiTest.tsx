"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function WagmiTest() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="p-6 border-2 border-gray-200 rounded-lg max-w-md">
      <h2 className="text-xl font-bold mb-4">Wagmi Connection Test</h2>

      {isConnected ? (
        <div className="space-y-2">
          <p className="text-green-600 font-semibold">✅ Wallet Connected!</p>
          <p>
            <strong>Address:</strong> {address?.slice(0, 6)}...
            {address?.slice(-4)}
          </p>
          <p>
            <strong>Chain:</strong> {chain?.name || "Unknown"}
          </p>
          <p>
            <strong>Chain ID:</strong> {chain?.id}
          </p>
          <button
            onClick={() => disconnect()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-3"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-600">Not connected</p>

          <div className="space-y-2">
            <p className="font-medium">Available Connectors:</p>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isPending}
                className="block w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
              >
                {isPending ? "Connecting..." : `Connect ${connector.name}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
