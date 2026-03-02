"use client";

import Link from "next/link";
import { useWallet } from "@/components/WalletProvider";

export default function DashboardHeader() {
  const { walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();

  function shortenAddr(addr: string) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }

  return (
    <header className="flex flex-col w-full bg-[#0F0F0F] border-b border-[#2D2D2D]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-[48px] py-5 max-w-[1400px] mx-auto w-full">
        {/* Left: Logo + Title */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-[10px] shrink-0 group">
              <span className="w-[10px] h-[10px] bg-[#FFD600] group-hover:scale-110 transition-transform" />
              <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
                GRANTFLOW
              </span>
            </Link>
            <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1px]">/</span>
            <span className="font-ibm-mono text-[10px] text-[#FFD600] tracking-[1.5px] font-bold">
              ESCROW DASHBOARD
            </span>
          </div>
          <h1 className="font-grotesk text-[28px] md:text-[36px] font-bold text-[#F5F5F0] tracking-[-1px] leading-none">
            Grant Escrow Dashboard
          </h1>
        </div>

        {/* Right: Wallet + Network */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Network Badge */}
          <div className="flex items-center gap-2 h-[32px] px-3 bg-[#1A1A1A] border border-[#2D2D2D]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#4ADE80] animate-pulse" />
            <span className="font-ibm-mono text-[10px] text-[#4ADE80] tracking-[1.5px]">
              ALGORAND TESTNET
            </span>
          </div>

          {/* Wallet Button */}
          {walletAddress ? (
            <button
              onClick={disconnectWallet}
              className="flex items-center gap-2 h-[36px] px-4 bg-[#111111] border border-[#FFD600] hover:border-[#F5F5F0] transition-colors cursor-pointer"
            >
              <span className="w-[6px] h-[6px] bg-[#4ADE80] rounded-full" />
              <span className="font-ibm-mono text-[11px] text-[#FFD600] tracking-[1px]">
                {shortenAddr(walletAddress)}
              </span>
            </button>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="nav-light-white flex items-center justify-center h-[36px] px-5 bg-[#FFD600] text-[#0A0A0A] font-grotesk font-bold text-[11px] tracking-[1.5px] hover:bg-[#e6c200] transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className="font-grotesk text-[11px] font-bold text-[#0A0A0A] tracking-[1.5px]">
                {isConnecting ? "CONNECTING..." : "CONNECT WALLET"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-6 px-6 md:px-[48px] py-3 max-w-[1400px] mx-auto w-full border-t border-[#1D1D1D]">
        <Link
          href="/"
          className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px] hover:text-[#F5F5F0] transition-colors"
        >
          HOME
        </Link>
        <Link
          href="/dashboard"
          className="font-ibm-mono text-[10px] text-[#FFD600] tracking-[1.5px]"
        >
          DASHBOARD
        </Link>
        <Link
          href="/transparency"
          className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px] hover:text-[#F5F5F0] transition-colors"
        >
          TRANSPARENCY
        </Link>
      </div>
    </header>
  );
}
