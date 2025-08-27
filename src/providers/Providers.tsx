"use client";

import { WagmiProvider } from "wagmi";
import { getConfig } from "@/providers/wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import useIsMounted from "@/hooks/useIsMounted";

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export default function Providers({ children }: ProvidersProps) {
  // const isMounted = useIsMounted();

  // if (!isMounted) return <div>Loading web3 ...</div>;

  return (
    <WagmiProvider config={getConfig()}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
