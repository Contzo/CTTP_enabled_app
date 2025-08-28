import type { WriteContractMutateAsync } from "wagmi/query";
import type { Config } from "wagmi";
import { TOKEN_MESSENGER_ABI } from "@/constants/tokens";
import { parseUnits } from "viem";

export class TokenMessenger {
  constructor(
    private writeContractAsync: WriteContractMutateAsync<Config, unknown>
  ) {}
  async depositForBurn(
    amount: string,
    destinationDomain: number,
    recipient: `0x${string}`,
    usdcTokenAddress: `0x${string}`,
    tokenMessengerAddress: `0x${string}`
  ): Promise<string | void> {
    try {
      const formattedRecipient = `0x000000000000000000000000${recipient.slice(
        2
      )}` as `0x${string}`;
      console.log(
        "// ── Burning──────────────────────────────────────────────"
      );
      console.log("Amount to burn: " + amount);
      const burnTxHash = await this.writeContractAsync({
        abi: TOKEN_MESSENGER_ABI,
        address: tokenMessengerAddress,
        functionName: "depositForBurn",
        args: [
          parseUnits(amount, 6),
          destinationDomain,
          formattedRecipient, // just the 0x-padded string
          usdcTokenAddress,
        ],
      });
      return burnTxHash;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(String(error));
      }
    }
  }
}
