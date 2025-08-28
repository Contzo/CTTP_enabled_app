import type { WriteContractMutateAsync } from "wagmi/query";
import type { Config } from "wagmi";
import { ERC20_ABI } from "@/constants/tokens";
import { parseUnits } from "viem";

export class ERC20Contract {
  constructor(
    private writeContractAsync: WriteContractMutateAsync<Config, unknown>
  ) {}

  async approveTokens(
    tokenAddress: `0x${string}`,
    spenderAddress: `0x${string}`,
    amount: string
  ): Promise<string | Error> {
    try {
      console.log(
        "// ── Approving ──────────────────────────────────────────────"
      );
      console.log("Spender: " + tokenAddress);
      console.log("Amount to spend: " + amount);
      const approvalHash = await this.writeContractAsync({
        abi: ERC20_ABI,
        address: tokenAddress,
        functionName: "approve",
        args: [spenderAddress, parseUnits(amount, 6)],
      });

      return approvalHash;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(String(error));
      }
    }
  }
}
