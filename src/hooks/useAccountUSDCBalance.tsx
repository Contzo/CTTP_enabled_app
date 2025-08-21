"use client";
import { ERC20_ABI, USDC_ADDRESSES } from "@/constants/tokens";
import { useAccount, useReadContract } from "wagmi";

export type AccountUSDCBalance = {
  address?: `0x${string}`;
  tokenAddress?: `0x${string}`;
  balance?: bigint;
  isLoading: boolean;
  error: Error | null;
  chainId: number;
};

export default function useAccountUSDCBalance(
  targetChian?: number
): AccountUSDCBalance {
  const { address, chainId } = useAccount();
  const effectiveChianId = targetChian ?? chainId;
  // Determine token address for current chain
  const tokenAddress = effectiveChianId
    ? USDC_ADDRESSES[effectiveChianId].usdcTokenAddress
    : undefined;

  // Read balanceOf for connected address
  const {
    data: balance,
    isLoading,
    error,
  } = useReadContract({
    address: tokenAddress!,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: effectiveChianId,
    query: {
      enabled: !!address && !!tokenAddress,
    },
  });
  return {
    address,
    tokenAddress,
    chainId: chainId ?? 0,
    balance,
    isLoading,
    error,
  };
}
