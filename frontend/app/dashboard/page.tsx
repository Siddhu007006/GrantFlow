import type { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ContractOverview from "@/components/dashboard/ContractOverview";
import MilestoneStatus from "@/components/dashboard/MilestoneStatus";
import SponsorActions from "@/components/dashboard/SponsorActions";
import TeamPayment from "@/components/dashboard/TeamPayment";
import TransactionHistory from "@/components/dashboard/TransactionHistory";

export const metadata: Metadata = {
  title: "Grant Escrow Dashboard — Algorand TestNet",
  description:
    "Milestone-based grant escrow dashboard for managing smart contract funds on Algorand TestNet.",
};

export default function DashboardPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-[#0A0A0A]">
      <DashboardHeader />

      <div className="flex flex-col gap-6 px-6 md:px-[48px] py-8 md:py-12 max-w-[1400px] mx-auto w-full">
        {/* Section label */}
        <div className="flex items-center gap-2">
          <span className="w-[4px] h-[4px] bg-[#FFD600]" />
          <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px]">
            [01] // CONTRACT STATE
          </span>
        </div>

        {/* Top grid: Contract Overview + Milestone */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2px]">
          <ContractOverview />
          <MilestoneStatus />
        </div>

        {/* Section label */}
        <div className="flex items-center gap-2 mt-4">
          <span className="w-[4px] h-[4px] bg-[#FF6B35]" />
          <span className="font-ibm-mono text-[10px] font-bold text-[#FF6B35] tracking-[2px]">
            [02] // ACTIONS
          </span>
        </div>

        {/* Actions grid: Sponsor + Team */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2px]">
          <SponsorActions />
          <TeamPayment />
        </div>

        {/* Section label */}
        <div className="flex items-center gap-2 mt-4">
          <span className="w-[4px] h-[4px] bg-[#F5F5F0]" />
          <span className="font-ibm-mono text-[10px] font-bold text-[#F5F5F0] tracking-[2px]">
            [03] // HISTORY
          </span>
        </div>

        {/* Transaction History */}
        <TransactionHistory />

        {/* Footer bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-t border-[#1D1D1D] gap-3">
          <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1px]">
            SMART CONTRACT // ALGORAND TESTNET // MILESTONE ESCROW V1
          </span>
          <span className="font-ibm-mono text-[10px] text-[#FFD600] tracking-[1px] font-bold">
            UI DEMO ONLY
          </span>
        </div>
      </div>
    </main>
  );
}
