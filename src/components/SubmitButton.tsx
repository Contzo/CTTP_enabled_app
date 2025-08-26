"use client";
import {
  ERC20_ABI,
  TOKEN_MESSENGER_ABI,
  USDC_ADDRESSES,
} from "@/constants/tokens";
import { useState } from "react";
import { parseUnits } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";

interface SubmitButtonProps {
  amountToBridge: string;
  destinationChainId: number;
}
// const approveTransferConfig = {
//   abi: ERC20_ABI,
//   address: usdcTokenAddress,
//   functionName: "approve",
//   args: [tokenMessengerAddress, parseUnits(amountToBridge, 6)],
// } as const;
// const burnTransactionConfig = {
//   abi: TOKEN_MESSENGER_ABI,
//   address: tokenMessengerAddress,
//   functionName: "depositForBurn",
//   args: [
//     parseUnits(amountToBridge, 6),
//     destinationDomain,
//     address,
//     usdcTokenAddress,
//   ],
// };
export default function SubmitButton({
  amountToBridge,
  destinationChainId,
}: SubmitButtonProps) {
  // ── State and hooks ──────────────────────────────────────────────
  const [step, setStep] = useState<"idle" | "approving" | "burning">("idle"); // state of the transaction
  const { address, chainId } = useAccount();
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isBurning, setIsBurning] = useState<boolean>(false);

  const tokenMessengerAddress = chainId
    ? USDC_ADDRESSES[chainId].tokenMessengerAddress
    : undefined;
  const usdcTokenAddress = chainId
    ? USDC_ADDRESSES[chainId].usdcTokenAddress
    : undefined;
  const destinationDomain = USDC_ADDRESSES[destinationChainId].domain;
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  async function handleSubmit() {
    try {
      if (!address) throw Error("Please connect a wallet");
      if (!writeContractAsync || !tokenMessengerAddress || !usdcTokenAddress)
        throw Error("Chain not supported for transfer");
      if (step !== "idle") throw Error("Previous transaction not done");
      if (!amountToBridge) return;
      // Approving
      setStep("approving");
      const approveTXHash = await writeContractAsync({
        abi: ERC20_ABI,
        address: usdcTokenAddress,
        functionName: "approve",
        args: [tokenMessengerAddress, parseUnits(amountToBridge, 6)],
      });
      console.log(
        "Waiting for confirmation of approve TX hash:" + approveTXHash
      );
      const approveReceipt = await publicClient?.waitForTransactionReceipt({
        hash: approveTXHash,
      });
      console.log(
        `Approved transaction with hash: ${approveTXHash} confirmed in block: ${approveReceipt?.blockNumber}`
      );
      // Burning
      setStep("burning");
      console.log("Address: " + address);
      // Convert address to bytes32 for depositForBurn
      const mintRecipient = `0x000000000000000000000000${address.slice(
        2
      )}` as `0x${string}`;

      console.log("destination domain: " + destinationDomain);
      console.log("Mint recipient: " + mintRecipient);
      console.log("Amount to burn" + parseUnits(amountToBridge, 6));
      console.log(
        "amount to burn type: " + typeof parseUnits(amountToBridge, 6)
      );
      const burnTxHash = await writeContractAsync({
        abi: TOKEN_MESSENGER_ABI,
        address: tokenMessengerAddress,
        functionName: "depositForBurn",
        args: [
          parseUnits(amountToBridge, 6),
          destinationDomain,
          mintRecipient, // just the 0x-padded string
          usdcTokenAddress,
        ],
      });

      console.log("Waiting for confirmation of burn TX hash:" + burnTxHash);
      const burnReceipt = await publicClient?.waitForTransactionReceipt({
        hash: burnTxHash,
      });
      console.log(
        `Approved transaction with hash: ${burnTxHash} confirmed in block: ${burnReceipt?.blockNumber}`
      );
      setStep("idle");
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
      onClick={handleSubmit}
    >
      Move funds to Sepolia
    </button>
  );
}
