"use client";
import { USDC_ADDRESSES } from "@/constants/tokens";
import { ERC20Contract } from "@/services/ERC20Services";
import { TokenMessenger } from "@/services/TokenMessangerServices";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  useAccount,
  usePublicClient,
  useSwitchChain,
  useWriteContract,
} from "wagmi";

interface SubmitButtonProps {
  amountToBridge: string;
  destinationChainId: number;
  sourceChainId: number;
}

export default function SubmitButton({
  amountToBridge,
  destinationChainId,
  sourceChainId,
}: SubmitButtonProps) {
  // ── State and hooks ──────────────────────────────────────────────
  const [step, setStep] = useState<"idle" | "approving" | "burning">("idle"); // state of the transaction
  const { address, chainId } = useAccount();
  const searchParams = useSearchParams();
  const destinationNetwork = searchParams.get("destination") ?? undefined;
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isBurning, setIsBurning] = useState<boolean>(false);

  console.log(chainId);
  const tokenMessengerAddress = chainId
    ? USDC_ADDRESSES[chainId].tokenMessengerAddress
    : undefined;
  const usdcTokenAddress = chainId
    ? USDC_ADDRESSES[chainId].usdcTokenAddress
    : undefined;
  const destinationDomain = USDC_ADDRESSES[destinationChainId].domain;
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const erc20USDC = new ERC20Contract(writeContractAsync);
  const tokenMessenger = new TokenMessenger(writeContractAsync);
  const publicClient = usePublicClient();

  async function handleSubmit() {
    try {
      if (!address) throw Error("Please connect a wallet");
      if (!writeContractAsync || !tokenMessengerAddress || !usdcTokenAddress)
        throw Error("Chain not supported for transfer");
      if (step !== "idle") throw Error("Previous transaction not done");
      if (!amountToBridge) return;

      if (!switchChainAsync) return;
      // Switching to MetaMask to source chain
      console.log("chianId: " + chainId);
      if (chainId !== sourceChainId) {
        console.log("Switching MetaMask network");
        await switchChainAsync({ chainId: sourceChainId });
      }
      // Approving
      setStep("approving");
      setIsApproving(true);
      const approveTXHash = await erc20USDC.approveTokens(
        usdcTokenAddress,
        tokenMessengerAddress,
        amountToBridge
      );
      console.log(
        "Waiting for confirmation of approve TX hash:" + approveTXHash
      );
      const approveReceipt = await publicClient?.waitForTransactionReceipt({
        hash: approveTXHash as `0x${string}`,
      });
      console.log(
        `Approved transaction with hash: ${approveTXHash} confirmed in block: ${approveReceipt?.blockNumber}`
      );
      setIsApproving(false);
      // Burning
      setStep("burning");
      setIsBurning(true);
      const burnTxHash = await tokenMessenger.depositForBurn(
        amountToBridge,
        destinationDomain,
        address,
        usdcTokenAddress,
        tokenMessengerAddress
      );
      console.log("Waiting for confirmation of burn TX hash:" + burnTxHash);
      const burnReceipt = await publicClient?.waitForTransactionReceipt({
        hash: burnTxHash as `0x${string}`,
      });
      console.log(
        `Approved transaction with hash: ${burnTxHash} confirmed in block: ${burnReceipt?.blockNumber}`
      );
      setStep("idle");
      setIsBurning(false);
    } catch (error) {
      console.error(error);
    }
  }

  function getButtonText(): string {
    if (isApproving) return "Approving amount to burn";
    if (isBurning) return "Burning tokens on source chain";
    return `Move funds to ${destinationNetwork ?? ""}`;
  }
  if (!tokenMessengerAddress || !usdcTokenAddress)
    return <p>Chain not supported for transfer</p>;

  return (
    <button
      className="bg-gray-200 shadow-sm rounded-md hover:bg-gray-400 p-2"
      type="button"
      onClick={handleSubmit}
      disabled={isBurning || isApproving}
    >
      {getButtonText()}
    </button>
  );
}
