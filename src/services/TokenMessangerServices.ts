import { BrowserProvider, Contract, Signer } from "ethers";
import { TOKEN_MESSENGER_ABI } from "@/constants/tokens";
import { parseUnits } from "viem";

export class TokenMessenger {
  private signer: Signer;

  constructor(signer: Signer) {
    this.signer = signer;
  }

  async depositForBurn(
    amount: string,
    destinationDomain: number,
    recipient: `0x${string}`,
    usdcTokenAddress: `0x${string}`,
    tokenMessengerAddress: `0x${string}`
  ): Promise<string> {
    try {
      const formattedRecipient = `0x000000000000000000000000${recipient.slice(
        2
      )}` as `0x${string}`;

      console.log("// ── Burning ────────────────────────────────");
      console.log("Amount to burn: " + amount);

      const contract = new Contract(
        tokenMessengerAddress,
        TOKEN_MESSENGER_ABI,
        this.signer
      );

      const tx = await contract.depositForBurn(
        parseUnits(amount, 6),
        destinationDomain,
        formattedRecipient,
        usdcTokenAddress
      );
      const receipt = await tx.wait();

      console.log("✅ Burn confirmed in block:", receipt.blockNumber);
      return tx.hash;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error(String(error));
    }
  }
}
