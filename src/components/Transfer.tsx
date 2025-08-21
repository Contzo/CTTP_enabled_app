"use client";
import { useState } from "react";
import TransferInput from "./TransferInput";
import { useSearchParams } from "next/navigation";
import { useSwitchChain } from "wagmi";

export default function Transfer() {
  const [sourceBalanceToBurn, setSourceBalanceToBurn] = useState();
  const { chains, switchChain } = useSwitchChain();
  const searchParams = useSearchParams();
  const sourceChain = searchParams.get("source");
  const sourceChainObj = chains.find((chain) => chain.name === sourceChain);
  const sourceChainId = sourceChainObj ? sourceChainObj.id : undefined;
  const destinationChain = searchParams.get("destination");
  const destinationChainObj = chains.find(
    (chain) => chain.name === destinationChain
  );
  const destinationChainId = destinationChainObj
    ? destinationChainObj.id
    : undefined;

  return (
    <form className="bg-gray-50 p-2  rounded-md mt-4 flex flex-col space-y-3">
      <TransferInput sourceOrDestination="source" chainId={sourceChainId} />
      <TransferInput
        sourceOrDestination="destination"
        chainId={destinationChainId}
      />
    </form>
  );
}
