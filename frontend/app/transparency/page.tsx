"use client";

import { useEffect, useState } from "react";
import TransparencyHeader from "@/components/transparency/TransparencyHeader";
import ProjectsOverview from "@/components/dashboard/ProjectsOverview";
import { type Project, getInitialMilestones } from "@/lib/projectsStore";
import { useSharedState } from "@/lib/useSharedState";
import { getInitialTransactions } from "@/components/dashboard/TransactionHistory";

// No raw transactions needed

// Multi-milestone mock data (read-only, matches dashboard)
type MilestoneStatusType = "PENDING" | "SUBMITTED" | "APPROVED" | "PAID";

interface MilestoneDisplay {
  id: number;
  title: string;
  amount: number;
  status: MilestoneStatusType;
}



const statusConfig: Record<
  MilestoneStatusType,
  { label: string; bg: string; border: string; text: string; dot: string }
> = {
  PENDING: {
    label: "PENDING",
    bg: "bg-[#1A1A1A]",
    border: "border-[#555555]",
    text: "text-[#555555]",
    dot: "bg-[#555555]",
  },
  SUBMITTED: {
    label: "SUBMITTED",
    bg: "bg-[#0A1A2E]",
    border: "border-[#60A5FA]",
    text: "text-[#60A5FA]",
    dot: "bg-[#60A5FA]",
  },
  APPROVED: {
    label: "APPROVED",
    bg: "bg-[#332800]",
    border: "border-[#FFD600]",
    text: "text-[#FFD600]",
    dot: "bg-[#FFD600]",
  },
  PAID: {
    label: "PAID",
    bg: "bg-[#0A2E1A]",
    border: "border-[#4ADE80]",
    text: "text-[#4ADE80]",
    dot: "bg-[#4ADE80]",
  },
};

function progressPercent(status: MilestoneStatusType): string {
  switch (status) {
    case "PENDING": return "0%";
    case "SUBMITTED": return "33%";
    case "APPROVED": return "66%";
    case "PAID": return "100%";
  }
}

export default function TransparencyPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Sync with live mock data
  const [milestones] = useSharedState<MilestoneDisplay[]>(`grantflow_milestones_app_${selectedProject?.appId || "default"}`, selectedProject ? getInitialMilestones(selectedProject.appId) as any : []);
  const [transactions] = useSharedState<any[]>(
    `grantflow_transactions_app_${selectedProject?.appId || "default"}`,
    selectedProject ? getInitialTransactions(selectedProject.appId) : []
  );

  const fundsReceived = milestones.filter(m => m.status === "PAID").reduce((sum, m) => sum + m.amount, 0);
  const remainingFunds = milestones.filter(m => m.status !== "PAID").reduce((sum, m) => sum + m.amount, 0);
  const calculatedTotalGrant = fundsReceived + remainingFunds;

  const summaryData = selectedProject
    ? [
      {
        key: "TOTAL GRANT VALUE",
        value: `${calculatedTotalGrant.toFixed(2)}`,
        color: "#FFD600",
      },
      {
        key: "FUNDS DISTRIBUTED",
        value: `${fundsReceived.toFixed(2)}`,
        color: "#F5F5F0",
      },
      {
        key: "REMAINING FUNDS",
        value: `${remainingFunds.toFixed(2)}`,
        color: "#4ADE80",
      },
    ]
    : [];

  const contractInfo = selectedProject
    ? [
      { key: "CONTRACT ADDRESS", value: selectedProject.contract.slice(0, 6) + "..." + selectedProject.contract.slice(-4) },
      { key: "APPLICATION ID", value: `APP-${selectedProject.appId}` },
      { key: "TEAM WALLET", value: selectedProject.team.slice(0, 6) + "..." + selectedProject.team.slice(-4) },
    ]
    : [];

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#0A0A0A]">
      <TransparencyHeader />

      {!selectedProject ? (
        <ProjectsOverview onSelectProject={setSelectedProject} />
      ) : (
        <div className="flex flex-col gap-6 px-6 md:px-[48px] py-8 md:py-12 max-w-[1400px] mx-auto w-full">
          {/* Back Button */}
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 self-start group cursor-pointer"
          >
            <span className="font-ibm-mono text-[10px] text-[#555555] group-hover:text-[#FFD600] tracking-[1.5px] transition-colors">
              ← BACK TO PROJECTS
            </span>
          </button>

          {/* Project title bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#111111] border border-[#2D2D2D]">
            <div className="flex items-center gap-3">
              <span className="w-[8px] h-[8px] bg-[#FFD600]" />
              <span className="font-grotesk text-[16px] font-bold text-[#F5F5F0] tracking-[-0.3px]">
                {selectedProject.title}
              </span>
            </div>
            <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
              ID: {selectedProject.id.toUpperCase()}
            </span>
          </div>

          {/* Summary Cards */}
          <div className="flex items-center gap-2">
            <span className="w-[4px] h-[4px] bg-[#4ADE80]" />
            <span className="font-ibm-mono text-[10px] font-bold text-[#4ADE80] tracking-[2px]">
              [01] // FUND SUMMARY
            </span>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[2px]">
            {summaryData.map((item) => (
              <div
                key={item.key}
                className="flex flex-col items-center justify-center gap-2 py-8 bg-[#0F0F0F] border border-[#2D2D2D]"
              >
                <span
                  className="font-grotesk text-[36px] md:text-[48px] font-bold tracking-[-2px] leading-none"
                  style={{ color: item.color }}
                >
                  {item.value}
                </span>
                <span className="font-ibm-mono text-[11px] text-[#888888] tracking-[1px]">
                  ALGO
                </span>
                <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px] mt-1">
                  {item.key}
                </span>
              </div>
            ))}
          </div>

          {/* Multi-Milestone Status (Read-Only) */}
          <div className="flex items-center gap-2 mt-4">
            <span className="w-[4px] h-[4px] bg-[#FF6B35]" />
            <span className="font-ibm-mono text-[10px] font-bold text-[#FF6B35] tracking-[2px]">
              [02] // MILESTONES
            </span>
          </div>

          <div className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D]">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#2D2D2D] bg-[#111111]">
              <span className="w-[8px] h-[8px] bg-[#FF6B35]" />
              <span className="font-ibm-mono text-[10px] font-bold text-[#FF6B35] tracking-[2px]">
                MILESTONE PROGRESS
              </span>
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px] ml-auto">
                {milestones.filter((m) => m.status === "PAID").length}/{milestones.length} COMPLETED
              </span>
            </div>

            {milestones.map((m, i) => {
              const config = statusConfig[m.status];
              const isPaid = m.status === "PAID";

              return (
                <div
                  key={m.title}
                  className={`flex flex-col gap-3 px-6 py-4 ${i < milestones.length - 1 ? "border-b border-[#1D1D1D]" : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                      className={`flex items-center justify-center w-[24px] h-[24px] shrink-0 border ${isPaid
                        ? "border-[#4ADE80] bg-[#0A2E1A]"
                        : m.status === "APPROVED"
                          ? "border-[#FFD600] bg-[#1A1500]"
                          : "border-[#333333] bg-[#1A1A1A]"
                        }`}
                    >
                      <span
                        className={`font-ibm-mono text-[11px] font-bold ${isPaid
                          ? "text-[#4ADE80]"
                          : m.status === "APPROVED"
                            ? "text-[#FFD600]"
                            : "text-[#555555]"
                          }`}
                      >
                        {isPaid ? "✓" : m.status === "APPROVED" ? "•" : " "}
                      </span>
                    </div>

                    {/* Title + amount */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span
                        className={`font-grotesk text-[13px] font-bold tracking-[0.5px] ${isPaid ? "text-[#888888]" : "text-[#F5F5F0]"
                          }`}
                      >
                        {m.title}
                      </span>
                      <span className="font-ibm-mono text-[10px] text-[#666666] tracking-[1px]">
                        {m.amount.toFixed(2)} ALGO
                      </span>
                    </div>

                    {/* Badge */}
                    <div
                      className={`flex items-center gap-2 h-[24px] px-3 shrink-0 ${config.bg} border ${config.border}`}
                    >
                      <span className={`w-[4px] h-[4px] rounded-full ${config.dot}`} />
                      <span
                        className={`font-ibm-mono text-[8px] font-bold tracking-[1.5px] ${config.text}`}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex flex-col gap-1 pl-[36px]">
                    <div className="w-full h-[3px] bg-[#1A1A1A]">
                      <div
                        className={`h-full transition-all duration-500 ${isPaid ? "bg-[#4ADE80]" : "bg-[#FFD600]"
                          }`}
                        style={{ width: progressPercent(m.status) }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-ibm-mono text-[7px] text-[#444444] tracking-[1px]">
                        SUBMITTED
                      </span>
                      <span className="font-ibm-mono text-[7px] text-[#444444] tracking-[1px]">
                        APPROVED
                      </span>
                      <span className="font-ibm-mono text-[7px] text-[#444444] tracking-[1px]">
                        PAID
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contract Info */}
          <div className="flex items-center gap-2 mt-4">
            <span className="w-[4px] h-[4px] bg-[#FFD600]" />
            <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px]">
              [03] // CONTRACT INFO
            </span>
          </div>

          <div className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D]">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#2D2D2D] bg-[#111111]">
              <span className="w-[8px] h-[8px] bg-[#FFD600]" />
              <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px]">
                ON-CHAIN DETAILS
              </span>
            </div>
            {contractInfo.map((item, i) => (
              <div
                key={item.key}
                className={`flex items-center justify-between px-6 py-4 ${i < contractInfo.length - 1 ? "border-b border-[#1D1D1D]" : ""
                  }`}
              >
                <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px]">
                  {item.key}
                </span>
                <span className="font-ibm-mono text-[11px] text-[#F5F5F0] tracking-[1px]">
                  {item.value}
                </span>
              </div>
            ))
            }
          </div>

          {/* Transaction Log */}
          <div className="flex items-center gap-2 mt-4">
            <span className="w-[4px] h-[4px] bg-[#F5F5F0]" />
            <span className="font-ibm-mono text-[10px] font-bold text-[#F5F5F0] tracking-[2px]">
              [04] // TRANSACTION LOG
            </span>
          </div>

          <div className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D]">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#2D2D2D] bg-[#111111]">
              <span className="w-[8px] h-[8px] bg-[#F5F5F0]" />
              <span className="font-ibm-mono text-[10px] font-bold text-[#F5F5F0] tracking-[2px]">
                ALL TRANSACTIONS
              </span>
            </div>

            {/* Table header */}
            <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 border-b border-[#2D2D2D] bg-[#0D0D0D]">
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">ACTION</span>
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">DATE</span>
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">TRANSACTION ID</span>
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">AMOUNT</span>
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px] text-right">STATUS</span>
            </div>

            {transactions.filter(tx => tx.action === "FUNDING" || tx.action === "PAYMENT").length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
                  NO TRANSACTIONS FOUND
                </span>
              </div>
            ) : (
              transactions
                .filter(tx => tx.action === "FUNDING" || tx.action === "PAYMENT")
                .map((tx, i, arr) => (
                  <div
                    key={i}
                    className={`flex flex-col md:grid md:grid-cols-5 gap-2 md:gap-4 px-6 py-4 ${i < arr.length - 1 ? "border-b border-[#1D1D1D]" : ""
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-[6px] h-[6px] shrink-0" style={{ backgroundColor: tx.actionColor }} />
                      <span className="font-ibm-mono text-[11px] font-bold tracking-[1.5px]" style={{ color: tx.actionColor }}>
                        {tx.action}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="md:hidden font-ibm-mono text-[9px] text-[#555555] tracking-[1px] mr-2">DATE:</span>
                      <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[0.5px]">{tx.date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="md:hidden font-ibm-mono text-[9px] text-[#555555] tracking-[1px] mr-2">TX ID:</span>
                      <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[0.5px]">{tx.txId}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="md:hidden font-ibm-mono text-[9px] text-[#555555] tracking-[1px] mr-2">DETAILS:</span>
                      <span className="font-ibm-mono text-[10px] text-[#F5F5F0] tracking-[0.5px]">{tx.details}</span>
                    </div>
                    <div className="flex items-center md:justify-end">
                      <span className="font-ibm-mono text-[10px] font-bold tracking-[1.5px]" style={{ color: tx.statusColor }}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-t border-[#1D1D1D] gap-3">
            <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1px]">
              PUBLIC VIEW // ALL DATA IS ON-CHAIN AND VERIFIABLE
            </span>
            <span className="font-ibm-mono text-[10px] text-[#4ADE80] tracking-[1px] font-bold">
              LIVE DATA
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
