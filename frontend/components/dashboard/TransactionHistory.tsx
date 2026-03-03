"use client";

import { useState } from "react";
import { useSharedState } from "@/lib/useSharedState";

const API_BASE = "http://127.0.0.1:5000/api";

export interface Transaction {
  action: string;
  actionColor: string;
  details: string;
  date: string;
  txId: string;
  status: string;
  statusColor: string;
}

export const mockTransactionsByApp: Record<number, Transaction[]> = {
  756430745: [
    { action: "PAYMENT", actionColor: "#555555", details: "1.00 ALGO Released", date: "2026-03-02 18:20:00 UTC", txId: "TXJDNF...8F9G", status: "CONFIRMED", statusColor: "#4ADE80" },
    { action: "APPROVAL", actionColor: "#555555", details: "Milestone 2 Approved", date: "2026-03-02 18:15:00 UTC", txId: "AXJDNF...8F9H", status: "CONFIRMED", statusColor: "#4ADE80" },
    { action: "SUBMISSION", actionColor: "#60A5FA", details: "Proof Submitted for Milestone 2", date: "2026-03-02 18:10:00 UTC", txId: "---", status: "APPROVED", statusColor: "#FFD600" },
    { action: "PAYMENT", actionColor: "#555555", details: "1.00 ALGO Released", date: "2026-03-02 18:05:00 UTC", txId: "PXJDNF...8F9I", status: "CONFIRMED", statusColor: "#4ADE80" },
    { action: "APPROVAL", actionColor: "#555555", details: "Milestone 1 Approved", date: "2026-03-02 18:00:00 UTC", txId: "QXJDNF...8F9J", status: "CONFIRMED", statusColor: "#4ADE80" },
    { action: "SUBMISSION", actionColor: "#60A5FA", details: "Proof Submitted for Milestone 1", date: "2026-03-02 17:55:00 UTC", txId: "---", status: "APPROVED", statusColor: "#FFD600" },
    { action: "FUNDING", actionColor: "#FFD600", details: "4.00 ALGO Deposited", date: "2026-03-02 17:45:00 UTC", txId: "V0BAX3...JKXIQ", status: "CONFIRMED", statusColor: "#4ADE80" }
  ],
  756439065: [
    { action: "PAYMENT", actionColor: "#555555", details: "0.50 ALGO Released", date: "2026-03-03 10:30:00 UTC", txId: "TXDEFI...9A1B", status: "CONFIRMED", statusColor: "#4ADE80" },
    { action: "APPROVAL", actionColor: "#555555", details: "Milestone 1 Approved", date: "2026-03-03 10:20:00 UTC", txId: "AXDEFI...9A1C", status: "CONFIRMED", statusColor: "#4ADE80" },
    { action: "SUBMISSION", actionColor: "#60A5FA", details: "Proof Submitted for Milestone 1", date: "2026-03-03 10:10:00 UTC", txId: "---", status: "APPROVED", statusColor: "#FFD600" },
    { action: "FUNDING", actionColor: "#FFD600", details: "4.00 ALGO Deposited", date: "2026-03-03 10:00:00 UTC", txId: "FDEFI...92XZ", status: "CONFIRMED", statusColor: "#4ADE80" }
  ],
  756442667: [
    { action: "FUNDING", actionColor: "#FFD600", details: "4.00 ALGO Deposited", date: "2026-03-03 10:00:00 UTC", txId: "JCK4V3...ZZQJG", status: "CONFIRMED", statusColor: "#4ADE80" }
  ]
};

export const getInitialTransactions = (appId: number) => mockTransactionsByApp[appId] || [];

interface Props {
  appId: number;
}

export default function TransactionHistory({ appId }: Props) {
  const [transactions, setTransactions] = useSharedState<Transaction[]>(`grantflow_transactions_app_${appId}`, getInitialTransactions(appId));
  const loading = false;

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
      <div className="hidden lg:grid grid-cols-5 gap-4 px-6 py-3 border-b border-[#2D2D2D] bg-[#0D0D0D]">
        <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
          ACTION
        </span>
        <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
          DETAILS
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
            className={`flex flex-col lg:grid lg:grid-cols-5 gap-2 lg:gap-4 px-6 py-4 ${i < transactions.length - 1 ? "border-b border-[#1D1D1D]" : ""
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

            {/* Details */}
            <div className="flex items-center">
              <span className="lg:hidden font-ibm-mono text-[9px] text-[#555555] tracking-[1px] mr-2">
                DETAILS:
              </span>
              <span className="font-ibm-mono text-[10px] text-[#F5F5F0] tracking-[0.5px]">
                {tx.details}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center">
              <span className="lg:hidden font-ibm-mono text-[9px] text-[#555555] tracking-[1px] mr-2">
                DATE:
              </span>
              <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[0.5px]">
                {tx.date}
              </span>
            </div>

            {/* TX ID */}
            <div className="flex items-center">
              <span className="lg:hidden font-ibm-mono text-[9px] text-[#555555] tracking-[1px] mr-2">
                TX ID:
              </span>
              <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[0.5px]">
                {tx.txId}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center lg:justify-end mt-2 lg:mt-0">
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
