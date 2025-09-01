import { ERC20_ABI } from "@/constants/tokens";
import { Contract, Signer } from "ethers";
import { parseUnits } from "viem";

export class ERC20Contract {
  private signer: Signer;

  constructor(signer: Signer) {
    this.signer = signer;
  }

  async approveTokens(
    tokenAddress: `0x${string}`,
    spenderAddress: `0x${string}`,
    amount: string
  ): Promise<string> {
    try {
      console.log("// ── Approving ────────────────────────────────");
      console.log("Token: " + tokenAddress);
      console.log("Spender: " + spenderAddress);
      console.log("Amount: " + amount);

      const contract = new Contract(tokenAddress, ERC20_ABI, this.signer);
      const tx = await contract.approve(spenderAddress, parseUnits(amount, 6));
      const receipt = await tx.wait();

      console.log("✅ Approval confirmed in block:", receipt.blockNumber);
      return tx.hash;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error(String(error));
    }
  }
}
