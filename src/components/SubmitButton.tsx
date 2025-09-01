"use client";
import { USDC_ADDRESSES } from "@/constants/tokens";
import { ERC20Contract } from "@/services/ERC20Services";
import { TokenMessenger } from "@/services/TokenMessangerServices";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { BrowserProvider } from "ethers";
import { useMyMessageHashes } from "@/hooks/useMyMessageHashes";
import { useDebugLogs } from "@/hooks/useDebugLogs";

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
  const [step, setStep] = useState<"idle" | "approving" | "burning">("idle");
  const { address, chainId } = useAccount();
  const searchParams = useSearchParams();
  const destinationNetwork = searchParams.get("destination") ?? undefined;
  const { switchChainAsync } = useSwitchChain();
  // const { hashes, error } = useMyMessageHashes();

  // useEffect(() => {
  //   if (error) console.error(error);
  //   if (step === "idle") console.log("Hashes for the account: ", hashes);
  // }, [step]);

  useDebugLogs();

  async function handleSubmit() {
    try {
      if (!address) throw Error("Please connect a wallet");
      if (!amountToBridge) return;
      if (!switchChainAsync) return;

      // --- Ensure MetaMask is on the source chain ---
      if (chainId !== sourceChainId) {
        console.log("Switching MetaMask network to source chain...");
        await switchChainAsync({ chainId: sourceChainId });
      }

      // --- Reconnect signer on the *newly switched chain* ---
      if (!window.ethereum) throw new Error("MetaMask not detected");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log(signer);

      const tokenMessengerAddress =
        USDC_ADDRESSES[sourceChainId]?.tokenMessengerAddress;
      const usdcTokenAddress = USDC_ADDRESSES[sourceChainId]?.usdcTokenAddress;
      const destinationDomain = USDC_ADDRESSES[destinationChainId]?.domain;

      if (!tokenMessengerAddress || !usdcTokenAddress) {
        throw Error("Chain not supported for transfer");
      }

      const erc20USDC = new ERC20Contract(signer);
      const tokenMessenger = new TokenMessenger(signer);

      // --- Approve ---
      setStep("approving");
      const approveTxHash = await erc20USDC.approveTokens(
        usdcTokenAddress,
        tokenMessengerAddress,
        amountToBridge
      );
      console.log("✅ Approval TX:", approveTxHash);

      // --- Burn ---
      setStep("burning");
      const burnTxHash = await tokenMessenger.depositForBurn(
        amountToBridge,
        destinationDomain,
        address,
        usdcTokenAddress,
        tokenMessengerAddress
      );
      console.log("✅ Burn TX:", burnTxHash);

      setStep("idle");
    } catch (error) {
      console.error(error);
      setStep("idle");
    }
  }

  function getButtonText(): string {
    if (step === "approving") return "Approving USDC...";
    if (step === "burning") return "Burning on source chain...";
    return `Move funds to ${destinationNetwork ?? ""}`;
  }

  return (
    <button
      className="bg-gray-200 shadow-sm rounded-md hover:bg-gray-400 p-2"
      type="button"
      onClick={handleSubmit}
      disabled={step !== "idle"}
    >
      {getButtonText()}
    </button>
  );
}
