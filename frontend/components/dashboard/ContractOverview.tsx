"use client";

import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

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

function shortenAddress(addr: string) {
  if (!addr || addr.length < 10) return addr || "---";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function ContractOverview() {
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

  const contractData = data
    ? [
      { key: "APPLICATION ID", value: `APP-${data.app_id}` },
      { key: "CONTRACT ADDRESS", value: shortenAddress(data.contract_address) },
      { key: "SPONSOR ADDRESS", value: shortenAddress(data.sponsor) },
      { key: "TEAM ADDRESS", value: shortenAddress(data.team) },
      {
        key: "TOTAL FUNDS LOCKED",
        value: `${data.contract_balance_algo.toFixed(2)} ALGO`,
        highlight: true,
      },
      {
        key: "FUNDS RELEASED",
        value: `${data.total_released_algo.toFixed(2)} ALGO`,
      },
      {
        key: "REMAINING BALANCE",
        value: `${(data.contract_balance_algo).toFixed(2)} ALGO`,
        accent: true,
      },
    ]
    : [];

  return (
    <div className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D]">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-[#2D2D2D] bg-[#111111]">
        <span className="w-[8px] h-[8px] bg-[#FFD600]" />
        <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px]">
          CONTRACT OVERVIEW
        </span>
        {loading && (
          <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px] ml-auto">
            LOADING...
          </span>
        )}
      </div>

      {/* Data rows */}
      <div className="flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
              FETCHING ON-CHAIN DATA...
            </span>
          </div>
        ) : (
          contractData.map((item, i) => (
            <div
              key={item.key}
              className={`flex items-center justify-between px-6 py-4 ${i < contractData.length - 1 ? "border-b border-[#1D1D1D]" : ""
                }`}
            >
              <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px]">
                {item.key}
              </span>
              <span
                className={`font-ibm-mono text-[11px] tracking-[1px] ${item.highlight
                    ? "text-[#FFD600] font-bold"
                    : item.accent
                      ? "text-[#4ADE80] font-bold"
                      : "text-[#F5F5F0]"
                  }`}
              >
                {item.value}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
