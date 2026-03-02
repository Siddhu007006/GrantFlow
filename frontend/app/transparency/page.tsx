"use client";

import { useEffect, useState } from "react";
import TransparencyHeader from "@/components/transparency/TransparencyHeader";

const API_BASE = "http://localhost:5000/api";

function shortenAddress(addr: string) {
  if (!addr || addr.length < 10) return addr || "---";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function formatDate(timestamp: number): string {
  if (!timestamp) return "---";
  const d = new Date(timestamp * 1000);
  return d.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

function shortenTxId(txId: string): string {
  if (!txId || txId.length < 12) return txId || "---";
  return txId.slice(0, 8) + "..." + txId.slice(-4);
}

interface StatusData {
  app_id: number;
  contract_address: string;
  sponsor: string;
  team: string;
  contract_balance_algo: number;
  total_released_algo: number;
  milestone_amount_algo: number;
  milestone_approved: boolean;
}

interface RawTransaction {
  type: string;
  txid: string;
  timestamp: number;
  app_args?: string[];
  payment_amount_algo?: number;
  inner_txns?: { amount_algo?: number; receiver?: string }[];
}

// Multi-milestone mock data (read-only, matches dashboard)
type MilestoneStatusType = "PENDING" | "SUBMITTED" | "APPROVED" | "PAID";

interface MilestoneDisplay {
  title: string;
  amount: number;
  status: MilestoneStatusType;
}

const milestones: MilestoneDisplay[] = [
  { title: "Proposal Approval", amount: 0.15, status: "PAID" },
  { title: "Development Phase", amount: 0.35, status: "PAID" },
  { title: "Testing Phase", amount: 0.25, status: "APPROVED" },
  { title: "Final Delivery", amount: 0.45, status: "PENDING" },
];

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
  const [data, setData] = useState<StatusData | null>(null);
  const [transactions, setTransactions] = useState<RawTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/status`).then((r) => r.json()),
      fetch(`${API_BASE}/transactions?limit=10`).then((r) => r.json()),
    ])
      .then(([statusRes, txRes]) => {
        if (statusRes.success) setData(statusRes.data);
        if (txRes.success) setTransactions(txRes.data);
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => setLoading(false));
  }, []);

  const summaryData = data
    ? [
      {
        key: "TOTAL GRANT VALUE",
        value: `${(data.total_released_algo + data.contract_balance_algo).toFixed(2)}`,
        color: "#FFD600",
      },
      {
        key: "FUNDS DISTRIBUTED",
        value: `${data.total_released_algo.toFixed(2)}`,
        color: "#F5F5F0",
      },
      {
        key: "REMAINING FUNDS",
        value: `${data.contract_balance_algo.toFixed(2)}`,
        color: "#4ADE80",
      },
    ]
    : [];

  const contractInfo = data
    ? [
      { key: "CONTRACT ADDRESS", value: shortenAddress(data.contract_address) },
      { key: "APPLICATION ID", value: `APP-${data.app_id}` },
      { key: "SPONSOR", value: shortenAddress(data.sponsor) },
      { key: "TEAM", value: shortenAddress(data.team) },
    ]
    : [];

  // Map transactions for display
  const txDisplay = transactions.map((tx) => {
    let action = "TRANSACTION";
    let actionColor = "#888888";
    let amount = "---";

    if (tx.type === "appl") {
      const args = tx.app_args || [];
      if (args.includes("approve")) {
        action = "APPROVAL";
        actionColor = "#60A5FA";
      } else if (args.includes("release")) {
        action = "PAYMENT";
        actionColor = "#FF6B35";
        if (tx.inner_txns?.length) {
          const inner = tx.inner_txns[0];
          if (inner.amount_algo) {
            amount = `+${inner.amount_algo.toFixed(2)} ALGO`;
          }
        }
      }
    } else if (tx.type === "pay") {
      action = "FUNDING";
      actionColor = "#FFD600";
      if (tx.payment_amount_algo) {
        amount = `+${tx.payment_amount_algo.toFixed(2)} ALGO`;
      }
    }

    return {
      action,
      actionColor,
      date: formatDate(tx.timestamp),
      txId: shortenTxId(tx.txid),
      amount,
      status: "CONFIRMED",
      statusColor: "#4ADE80",
    };
  });

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#0A0A0A]">
      <TransparencyHeader />

      <div className="flex flex-col gap-6 px-6 md:px-[48px] py-8 md:py-12 max-w-[1400px] mx-auto w-full">
        {/* Summary Cards */}
        <div className="flex items-center gap-2">
          <span className="w-[4px] h-[4px] bg-[#4ADE80]" />
          <span className="font-ibm-mono text-[10px] font-bold text-[#4ADE80] tracking-[2px]">
            [01] // FUND SUMMARY
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 bg-[#0F0F0F] border border-[#2D2D2D]">
            <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
              FETCHING ON-CHAIN DATA...
            </span>
          </div>
        ) : (
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
        )}

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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
                LOADING...
              </span>
            </div>
          ) : (
            contractInfo.map((item, i) => (
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
          )}
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

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
                FETCHING TRANSACTIONS...
              </span>
            </div>
          ) : txDisplay.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
                NO TRANSACTIONS FOUND
              </span>
            </div>
          ) : (
            txDisplay.map((tx, i) => (
              <div
                key={i}
                className={`flex flex-col md:grid md:grid-cols-5 gap-2 md:gap-4 px-6 py-4 ${i < txDisplay.length - 1 ? "border-b border-[#1D1D1D]" : ""
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
                  <span className="md:hidden font-ibm-mono text-[9px] text-[#555555] tracking-[1px] mr-2">AMOUNT:</span>
                  <span className="font-ibm-mono text-[10px] text-[#F5F5F0] tracking-[0.5px]">{tx.amount}</span>
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
    </main>
  );
}
