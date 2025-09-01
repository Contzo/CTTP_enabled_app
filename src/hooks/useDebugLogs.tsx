import { USDC_ADDRESSES } from "@/constants/tokens";
import { useEffect, useState } from "react";
import {
  decodeAbiParameters,
  getAddress,
  keccak256,
  parseAbiItem,
  parseAbiParameters,
  slice,
} from "viem";
import { useAccount, usePublicClient } from "wagmi";

// CCTP Burn Message format (the message body part)
const BURN_MESSAGE_TYPES = parseAbiParameters([
  "uint32 version",
  "address burnToken",
  "uint256 mintRecipient",
  "uint256 amount",
  "bytes32 messageSender",
]);

// Alternative: If you need the full message format
const MESSAGE_TYPES = parseAbiParameters([
  "uint32 sourceDomain",
  "bytes32 sender",
  "uint32 destinationDomain",
  "bytes32 recipient",
  "uint64 nonce",
  "address burnToken",
  "uint256 amount",
  "address originalCaller",
]);

export function useDebugLogs() {
  const publicClient = usePublicClient();
  const [messageHashes, setMessageHashes] = useState<string[]>([]);
  const { address, chainId } = useAccount();

  const usdcAddress = chainId
    ? USDC_ADDRESSES[chainId].usdcTokenAddress
    : undefined;
  const domain = chainId ? USDC_ADDRESSES[chainId].domain : 0;

  useEffect(() => {
    async function testLogs() {
      try {
        if (!publicClient) return;

        const lastBlock = await publicClient.getBlockNumber();
        console.log("Last block: ", lastBlock);
        const startBlock = lastBlock - BigInt(499);
        console.log("start block: ", lastBlock - startBlock);

        const logs = await publicClient.getLogs({
          address: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD", // TokenMessenger
          events: [parseAbiItem("event MessageSent(bytes message)")],
          fromBlock: startBlock,
          toBlock: lastBlock,
        });

        for (const log of logs) {
          const message = log.args?.message as `0x${string}`;
          if (!message) continue;

          try {
            // Parse the CCTP message format
            // The message format is: version (4) + sourceDomain (4) + destinationDomain (4) + nonce (8) + sender (32) + recipient (32) + messageBody

            const version = slice(message, 0, 4);
            const sourceDomain = slice(message, 4, 8);
            const destinationDomain = slice(message, 8, 12);
            const nonce = slice(message, 12, 20);
            const sender = slice(message, 20, 52);
            const recipient = slice(message, 52, 84);
            const messageBody = slice(message, 84); // Rest is the message body

            console.log("CCTP Message Structure:");
            console.log("- Version:", version);
            console.log("- Source Domain:", parseInt(sourceDomain, 16));
            console.log(
              "- Destination Domain:",
              parseInt(destinationDomain, 16)
            );
            console.log("- Nonce:", BigInt(nonce));
            console.log("- Sender:", sender);
            console.log("- Recipient:", recipient);
            console.log("- Message Body:", messageBody);

            // Now decode the message body (burn message)
            if (messageBody.length > 2) {
              // Check if there's actual data
              try {
                const decodedBody = decodeAbiParameters(
                  BURN_MESSAGE_TYPES,
                  messageBody
                );
                console.log("Decoded Burn Message:", decodedBody);

                // Extract the mint recipient address from bytes32
                const mintRecipientBytes32 = decodedBody[2] as bigint;
                const mintRecipientAddress = getAddress(
                  `0x${mintRecipientBytes32
                    .toString(16)
                    .padStart(40, "0")
                    .slice(-40)}`
                );

                console.log("Mint Recipient Address:", mintRecipientAddress);
                console.log("Burn Token:", decodedBody[1]);
                console.log("Amount:", decodedBody[3]);

                // Check if this message is for the current user
                if (
                  mintRecipientAddress.toLowerCase() === address?.toLowerCase()
                ) {
                  setMessageHashes((prev) => [...prev, message]);
                  console.log("Found message for current user!");
                }
              } catch (bodyError) {
                console.error("Failed to decode message body:", bodyError);
                console.log("Message body hex:", messageBody);
              }
            }
          } catch (parseError) {
            console.error(
              "Failed to parse CCTP message structure:",
              parseError
            );
            console.log("Raw message:", message);
          }
        }

        console.log("My account messages: ", messageHashes);
      } catch (err) {
        console.error("❌ getLogs failed:", err);
      }
    }

    if (publicClient) testLogs();
  }, [publicClient, address]);

  return { messageHashes };
}

// Helper function to create message hash (for attestation API calls)
export function createMessageHash(message: `0x${string}`): string {
  return keccak256(message);
}
