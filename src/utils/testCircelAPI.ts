import "dotenv/config";
import { randomUUID } from "crypto";

async function getAllTheCTTPTransactions(address: `0x${string}`) {
  // Use the correct V2 endpoint for messages (which includes attestations)
  const res = await fetch(
    `https://iris-api.circle.com/v2/messages?sourceAddress=${address}`,
    {
      method: "GET",
      headers: {
        // Note: Circle CCTP API appears to be public - remove auth if not needed
        // Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
        "X-Request-Id": randomUUID(),
        Accept: "application/json",
      },
    }
  );

  // Add error handling
  if (!res.ok) {
    console.error(`API Error: ${res.status} - ${res.statusText}`);
    const errorText = await res.text();
    console.error("Error details:", errorText);
    return;
  }

  const data = await res.json();
  console.log("CCTP Messages:", JSON.stringify(data, null, 2));

  // Log the count of messages
  if (data.messages) {
    console.log(`Found ${data.messages.length} messages`);

    // Show status of each message
    data.messages.forEach((msg: any, index: number) => {
      console.log(`Message ${index + 1}:`, {
        messageHash: msg.messageHash,
        status: msg.status,
        sourceChain: msg.sourceChain,
        destinationChain: msg.destinationChain,
        amount: msg.amount,
      });
    });
  }
}

// Alternative function using V1 endpoint (if you need specific attestation data)
async function getAllAttestationsV1(messageHash?: string) {
  const url = messageHash
    ? `https://iris-api.circle.com/v1/attestations/${messageHash}`
    : `https://iris-api.circle.com/v1/attestations`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-Request-Id": randomUUID(),
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error(`V1 API Error: ${res.status} - ${res.statusText}`);
    const errorText = await res.text();
    console.error("Error details:", errorText);
    return;
  }

  const data = await res.json();
  console.log("V1 Attestations:", JSON.stringify(data, null, 2));
}

// Usage - try the V2 messages endpoint first
getAllTheCTTPTransactions("0xEcA5e7FaDF270376Af5e6f9bD06124BdE90b58d3");

// If you need specific attestation data, you can also try:
// getAllAttestationsV1();
