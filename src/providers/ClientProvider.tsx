"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Providers = dynamic(() => import("@/providers/Providers"), {
  ssr: false,
  loading: () => <div>Loading web3...</div>,
});

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return <Providers>{children}</Providers>;
}
