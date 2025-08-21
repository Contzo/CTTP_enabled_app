import { useAccount } from "wagmi";
import WalletConnected from "./WalletConnected";
import WalletDisconnected from "./WalletDisconnected";

export default function Connect() {
  // ── State variables and hooks ──────────────────────────────────────────────
  const { isConnected } = useAccount();
  return <>{isConnected ? <WalletConnected /> : <WalletDisconnected />}</>;
}
