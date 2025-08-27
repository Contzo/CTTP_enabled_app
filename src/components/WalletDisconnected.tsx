import { useConnect, Connector } from "wagmi";

export default function WalletDisconnected() {
  // ── State $ hooks ──────────────────────────────────────────────
  const { connect, connectors, isPending } = useConnect();
  const connector: Connector | undefined = connectors.find(
    (c) => c.name === "MetaMask"
  );

  if (!connector) return <p>No other connectors available</p>;
  // ── TSX ──────────────────────────────────────────────
  return (
    <div className="flex items-center space-x-4 p-4">
      <p className="whitespace-nowrap">Connect a wallet!</p>
      <button
        onClick={() => connect({ connector })}
        disabled={isPending}
        className="block w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
      >
        {isPending ? "Connecting..." : `Connect ${connector.name}`}
      </button>
    </div>
  );
}
