"use client";
import Header from "@/components/Header";
import Transfer from "./Transfer";
import { useAccount } from "wagmi";

export default function HomeContent() {
  // ── State variables & hooks──────────────────────────────────────────────
  const { address } = useAccount();
  return (
    <>
      <Header />
      {address && <Transfer />}
    </>
  );
}
