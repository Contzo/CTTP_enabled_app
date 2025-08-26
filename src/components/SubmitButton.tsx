"use client";
import React, { useState } from "react";
import {
  USDC_ADDRESSES,
  ERC20_ABI,
  TOKEN_MESSENGER_ABI,
} from "@/constants/tokens";
import {
  useAccount,
  usePublicClient,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits } from "viem";
import getConfig from "next/config";

interface SubmitButtonProps {
  amountToBridge: string;
  destinationChainId: number;
}
export default function SubmitButton({
  amountToBridge,
  destinationChainId,
}: SubmitButtonProps) {
  // ── State and hooks ──────────────────────────────────────────────
  const [step, setStep] = useState<"idle" | "approving" | "burning">("idle"); // state of the transaction
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isBurning, setIsBurning] = useState<boolean>(false);
  const { address, chainId } = useAccount();
  const usdcTokenAddress = chainId
    ? USDC_ADDRESSES[chainId]?.usdcTokenAddress
    : undefined;
  const tokenMessengerAddress = chainId
    ? USDC_ADDRESSES[chainId]?.tokenMessengerAddress
    : undefined;
  const destinationDomain = USDC_ADDRESSES[destinationChainId]?.domain;
  //Set up approve transaction
  const approveTransferConfig = {
    abi: ERC20_ABI,
    address: usdcTokenAddress,
    functionName: "approve",
    args: [tokenMessengerAddress, parseUnits(amountToBridge, 6)],
  } as const;
  const { data: approveTXHash, writeContract: approve } = useWriteContract();
  const { isLoading: approveTxConfirming, isSuccess: approveSuccess } =
    useWaitForTransactionReceipt({ hash: approveTXHash });
  //Set up burn transaction
  const burnTransactionConfig = {
    abi: TOKEN_MESSENGER_ABI,
    address: tokenMessengerAddress,
    functionName: "depositForBurn",
    args: [
      parseUnits(amountToBridge, 6),
      destinationDomain,
      address,
      usdcTokenAddress,
    ],
  };
  const { data: burnTXHash, writeContract: burn } = useWriteContract();
  const { isLoading: burnTxConfirming, isSuccess: burnSuccess } =
    useWaitForTransactionReceipt({ hash: burnTXHash });

  async function handleSubmit(): Promise<void> {
    try {
      //Approving the amount to burn
      if (step !== "idle" || !burn) return;
      if (!tokenMessengerAddress || !usdcTokenAddress)
        throw Error("Chain not supported");
      setIsApproving(true);
      setStep("approving");
      approve(approveTransferConfig);
    } catch (error) {
      console.error(error);
    }
  }
  if (!tokenMessengerAddress || !usdcTokenAddress)
    return <p>Chain not supported for transfer</p>;

  return (
    <button
      className="bg-gray-200 shadow-sm rounded-md hover:bg-gray-400 p-2"
      type="button"
    >
      Move funds to Sepolia
    </button>
  );
}
