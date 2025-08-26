"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useSwitchChain } from "wagmi";
import { USDC_ADDRESSES } from "@/constants/tokens";
import useAccountUSDCBalance from "@/hooks/useAccountUSDCBalance";
import { formatUnits } from "viem";

type Direction = "source" | "destination";
type TransferInputProps = {
  valueState: [string, React.Dispatch<React.SetStateAction<string>>];
  sourceOrDestination: Direction;
  chainId: number | undefined;
};

export default function TransferInput({
  valueState,
  chainId,
  sourceOrDestination,
}: TransferInputProps) {
  const [value, setValue] = valueState;
  const { chains } = useSwitchChain();
  const { balance, isLoading } = useAccountUSDCBalance(chainId);

  const searchParams = useSearchParams();
  const currentSelectValue = chainId?.toString() || "";
  const router = useRouter();

  function handleChainChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams);
    const newChainId = Number(e.target.value);
    const newValue = USDC_ADDRESSES[newChainId].name;

    if (!newValue) return;

    // Get current values before change
    const currentSource = params.get("source");
    const currentDestination = params.get("destination");

    // Update depending on which one changed
    if (sourceOrDestination === "source") {
      // Move old source into destination
      if (currentSource) {
        params.set("destination", currentSource);
      }
      params.set("source", newValue);
    } else {
      // sourceOrDestination === "destination"
      if (currentDestination) {
        params.set("source", currentDestination);
      }
      params.set("destination", newValue);
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-col bg-gray-400 p-1">
      <div className="flex items-center space-x-1 p-2">
        <span>From:</span>
        <select
          value={currentSelectValue}
          className="w-auto"
          onChange={handleChainChange}
        >
          {chains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex bg-white space-x-1.5 p-1">
        <input
          className="bg-white"
          type="number"
          step="any"
          disabled={sourceOrDestination === "destination"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm">{`Balance: ${
          isLoading
            ? "Balance pending..."
            : formatUnits(balance ?? BigInt(0), 6)
        }`}</p>
      </div>
    </div>
  );
}
