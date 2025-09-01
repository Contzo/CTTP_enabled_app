import { TOKEN_MESSENGER_ABI, USDC_ADDRESSES } from "@/constants/tokens";
import { AbiCoder, getAddress, isAddress } from "ethers";
import { useState } from "react";
import { useAccount, useWatchContractEvent } from "wagmi";

const MESSAGE_TYPES = [
  "uint32", // source domain
  "bytes32", // sender
  "uint32", // destination domain
  "bytes32", // recipient
  "uint64", // nonce
  "address", // burn token
  "uint256", // amount
];

const abiDecoder = AbiCoder.defaultAbiCoder();
export function useMyMessageHashes(): { hashes: string[]; error: string } {
  const { address, chainId } = useAccount();
  const [hashes, setHashes] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const tokenMessengerAddress = chainId
    ? USDC_ADDRESSES[chainId].tokenMessengerAddress
    : undefined;
  console.log("Token messenger address: " + tokenMessengerAddress);
  if (!tokenMessengerAddress || !isAddress(tokenMessengerAddress)) {
    return {
      hashes,
      error: "Token messenger contract not supported on current chain",
    };
  }

  useWatchContractEvent({
    address: tokenMessengerAddress as `0x${string}`,
    abi: TOKEN_MESSENGER_ABI,
    eventName: "MessageSent",
    onLogs: (logs) => {
      logs.forEach((log) => {
        console.log("Raw log: ", log);
        const { args } = log;
        console.log("Raw args:", args);
        if (!args) {
          setError("No transactions for this account");
          return;
        }
        const messageHash = args.messageHash as string;
        const message = args.message as string;

        try {
          const decodedMessage = abiDecoder.decode(MESSAGE_TYPES, message);
          const senderBytes32 = decodedMessage[1] as string;

          const senderHex = "0x" + senderBytes32.slice(-40);
          const senderAddress = getAddress(senderHex);
          if (
            address &&
            senderAddress.toLocaleLowerCase() === address.toLocaleLowerCase()
          ) {
            setHashes((prev) =>
              prev.includes(messageHash) ? prev : [...prev, messageHash]
            );
          }
        } catch (error) {
          setError(String(error));
        }
      });
    },
    onError: (error) => setError(String(error)),
  });
  return { hashes, error };
}
