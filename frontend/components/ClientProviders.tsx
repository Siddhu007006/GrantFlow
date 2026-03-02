"use client";

import { WalletProvider } from "@/components/WalletProvider";
import type { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
    return <WalletProvider>{children}</WalletProvider>;
}
