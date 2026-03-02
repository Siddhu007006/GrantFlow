"use client";

import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

interface Transaction {
  action: string;
  actionColor: string;
  date: string;
  txId: string;
  status: string;
  statusColor: string;
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

function mapTransaction(tx: any): Transaction {
  let action = "TRANSACTION";
  let actionColor = "#888888";

  if (tx.type === "appl") {
    const args = tx.app_args || [];
    if (args.includes("approve")) {
      action = "APPROVAL";
      actionColor = "#60A5FA";
    } else if (args.includes("release")) {
      action = "PAYMENT";
      actionColor = "#FF6B35";
    } else {
      action = "APP CALL";
      actionColor = "#A78BFA";
    }
  } else if (tx.type === "pay") {
    action = "FUNDING";
    actionColor = "#FFD600";
  }

  return {
    action,
    actionColor,
    date: formatDate(tx.timestamp),
    txId: shortenTxId(tx.txid),
    status: "CONFIRMED",
    statusColor: "#4ADE80",
  };
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/transactions?limit=10`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTransactions(res.data.map(mapTransaction));
        }
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D]">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-[#2D2D2D] bg-[#111111]">
        <span className="w-[8px] h-[8px] bg-[#F5F5F0]" />
        <span className="font-ibm-mono text-[10px] font-bold text-[#F5F5F0] tracking-[2px]">
          TRANSACTION HISTORY
        </span>
        {loading && (
          <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px] ml-auto">
            LOADING...
          </span>
        )}
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-3 border-b border-[#2D2D2D] bg-[#0D0D0D]">
        <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
          ACTION
        </span>
        <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
          DATE
        </span>
        <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
          TRANSACTION ID
        </span>
        <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px] text-right">
          STATUS
        </span>
      </div>

      {/* Rows */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
            FETCHING TRANSACTIONS...
          </span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
            NO TRANSACTIONS FOUND
          </span>
        </div>
      ) : (
        transactions.map((tx, i) => (
          <div
            key={i}
            className={`flex flex-col md:grid md:grid-cols-4 gap-2 md:gap-4 px-6 py-4 ${i < transactions.length - 1 ? "border-b border-[#1D1D1D]" : ""
              }`}
          >
            {/* Action */}
            <div className="flex items-center gap-2">
              <span
                className="w-[6px] h-[6px] shrink-0"
                style={{ backgroundColor: tx.actionColor }}
              />
              <span
                className="font-ibm-mono text-[11px] font-bold tracking-[1.5px]"
                style={{ color: tx.actionColor }}
              >
                {tx.action}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center">
              <span className="md:hidden font-ibm-mono text-[9px] text-[#555555] tracking-[1px] mr-2">
                DATE:
              </span>
              <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[0.5px]">
                {tx.date}
              </span>
            </div>

            {/* TX ID */}
            <div className="flex items-center">
              <span className="md:hidden font-ibm-mono text-[9px] text-[#555555] tracking-[1px] mr-2">
                TX ID:
              </span>
              <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[0.5px]">
                {tx.txId}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center md:justify-end">
              <span
                className="font-ibm-mono text-[10px] font-bold tracking-[1.5px]"
                style={{ color: tx.statusColor }}
              >
                {tx.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
