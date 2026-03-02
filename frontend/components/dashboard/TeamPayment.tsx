"use client";

import { useEffect, useState } from "react";
import { RECEIVER_ADDRESS } from "@/lib/constants";

const API_BASE = "http://localhost:5000/api";

function shortenAddress(addr: string) {
  if (!addr || addr.length < 10) return addr || "---";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

interface StatusData {
  team: string;
  total_released_algo: number;
  milestone_amount_algo: number;
  milestone_approved: boolean;
  team_balance_algo: number;
}

export default function TeamPayment() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/status`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Determine payment status
  let statusLabel = "AWAITING APPROVAL";
  let statusBg = "bg-[#332800]";
  let statusBorder = "border-[#FFD600]";
  let statusText = "text-[#FFD600]";
  let statusDot = "bg-[#FFD600]";

  if (data) {
    if (data.total_released_algo > 0) {
      statusLabel = "FUNDS RECEIVED";
      statusBg = "bg-[#0A2E1A]";
      statusBorder = "border-[#4ADE80]";
      statusText = "text-[#4ADE80]";
      statusDot = "bg-[#4ADE80]";
    } else if (data.milestone_approved) {
      statusLabel = "APPROVED - AWAITING RELEASE";
      statusBg = "bg-[#0A1A2E]";
      statusBorder = "border-[#60A5FA]";
      statusText = "text-[#60A5FA]";
      statusDot = "bg-[#60A5FA]";
    }
  }

  const paymentData = data
    ? [
      { key: "TEAM WALLET", value: shortenAddress(RECEIVER_ADDRESS) },
      {
        key: "AMOUNT RECEIVED",
        value: `${data.total_released_algo.toFixed(2)} ALGO`,
      },
      {
        key: "PENDING AMOUNT",
        value: `${data.milestone_amount_algo.toFixed(2)} ALGO`,
        accent: true,
      },
      {
        key: "TEAM BALANCE",
        value: `${data.team_balance_algo.toFixed(2)} ALGO`,
      },
    ]
    : [];

  return (
    <div className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D]">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-[#2D2D2D] bg-[#111111]">
        <span className="w-[8px] h-[8px] bg-[#60A5FA]" />
        <span className="font-ibm-mono text-[10px] font-bold text-[#60A5FA] tracking-[2px]">
          TEAM PAYMENT
        </span>
      </div>

      <div className="flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
              FETCHING PAYMENT DATA...
            </span>
          </div>
        ) : (
          <>
            {/* Payment status */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1D1D1D]">
              <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px]">
                PAYMENT STATUS
              </span>
              <div
                className={`flex items-center gap-2 h-[24px] px-3 ${statusBg} border ${statusBorder}`}
              >
                <span className={`w-[4px] h-[4px] rounded-full ${statusDot}`} />
                <span className={`font-ibm-mono text-[9px] font-bold tracking-[1.5px] ${statusText}`}>
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Data rows */}
            {paymentData.map((item, i) => (
              <div
                key={item.key}
                className={`flex items-center justify-between px-6 py-4 ${i < paymentData.length - 1 ? "border-b border-[#1D1D1D]" : ""
                  }`}
              >
                <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px]">
                  {item.key}
                </span>
                <span
                  className={`font-ibm-mono text-[11px] tracking-[1px] ${item.accent ? "text-[#FFD600] font-bold" : "text-[#F5F5F0]"
                    }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
