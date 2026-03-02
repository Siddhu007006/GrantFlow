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
        value: `${data.contract_balance_algo.toFixed(2)}`,
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

  // Milestone status
  let milestoneLabel = "PENDING";
  let milestoneBg = "bg-[#332800]";
  let milestoneBorder = "border-[#FFD600]";
  let milestoneText = "text-[#FFD600]";
  let milestoneDot = "bg-[#FFD600]";
  let progressWidth = "33%";

  if (data) {
    if (data.total_released_algo > 0 && !data.milestone_approved) {
      milestoneLabel = "PAID";
      milestoneBg = "bg-[#1A0F00]";
      milestoneBorder = "border-[#FF6B35]";
      milestoneText = "text-[#FF6B35]";
      milestoneDot = "bg-[#FF6B35]";
      progressWidth = "100%";
    } else if (data.milestone_approved) {
      milestoneLabel = "APPROVED";
      milestoneBg = "bg-[#0A2E1A]";
      milestoneBorder = "border-[#4ADE80]";
      milestoneText = "text-[#4ADE80]";
      milestoneDot = "bg-[#4ADE80]";
      progressWidth = "66%";
    }
  }

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

        {/* Milestone Status */}
        <div className="flex items-center gap-2 mt-4">
          <span className="w-[4px] h-[4px] bg-[#FF6B35]" />
          <span className="font-ibm-mono text-[10px] font-bold text-[#FF6B35] tracking-[2px]">
            [02] // MILESTONE
          </span>
        </div>

        <div className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D]">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-[#2D2D2D] bg-[#111111]">
            <span className="w-[8px] h-[8px] bg-[#FF6B35]" />
            <span className="font-ibm-mono text-[10px] font-bold text-[#FF6B35] tracking-[2px]">
              PROJECT COMPLETION
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5">
            <div className="flex flex-col gap-1">
              <span className="font-grotesk text-[16px] font-bold text-[#F5F5F0] tracking-[0.5px]">
                Project Completion
              </span>
              <span className="font-ibm-mono text-[11px] text-[#888888] tracking-[1px]">
                {data ? `${data.milestone_amount_algo.toFixed(2)} ALGO` : "---"}
              </span>
            </div>
            <div className={`flex items-center gap-2 h-[28px] px-3 ${milestoneBg} border ${milestoneBorder}`}>
              <span className={`w-[5px] h-[5px] rounded-full ${milestoneDot}`} />
              <span className={`font-ibm-mono text-[9px] font-bold tracking-[1.5px] ${milestoneText}`}>
                {milestoneLabel}
              </span>
            </div>
          </div>
          <div className="px-6 pb-5">
            <div className="w-full h-[4px] bg-[#1A1A1A]">
              <div className="h-full bg-[#FFD600] transition-all duration-500" style={{ width: progressWidth }} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px]">SUBMITTED</span>
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px]">APPROVED</span>
              <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px]">PAID</span>
            </div>
          </div>
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
