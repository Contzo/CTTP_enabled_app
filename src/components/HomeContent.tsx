"use client";
import { useAccount } from "wagmi";
import Transfer from "./Transfer";

export default function HomeContent() {
  // ── State variables & hooks──────────────────────────────────────────────
  const { address } = useAccount();
  return <div>{address && <Transfer />}</div>;
}
