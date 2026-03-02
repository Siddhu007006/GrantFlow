"use client";

import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

const statusConfig = {
  pending: {
    label: "PENDING",
    bg: "bg-[#332800]",
    border: "border-[#FFD600]",
    text: "text-[#FFD600]",
    dot: "bg-[#FFD600]",
  },
  approved: {
    label: "APPROVED",
    bg: "bg-[#0A2E1A]",
    border: "border-[#4ADE80]",
    text: "text-[#4ADE80]",
    dot: "bg-[#4ADE80]",
  },
  paid: {
    label: "PAID",
    bg: "bg-[#1A0F00]",
    border: "border-[#FF6B35]",
    text: "text-[#FF6B35]",
    dot: "bg-[#FF6B35]",
  },
} as const;

type MilestoneStatusType = keyof typeof statusConfig;

interface Milestone {
  name: string;
  amount: string;
  status: MilestoneStatusType;
}

export default function MilestoneStatus() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/status`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const d = res.data;
          let status: MilestoneStatusType = "pending";
          if (d.total_released_algo > 0 && !d.milestone_approved) {
            status = "paid";
          } else if (d.milestone_approved) {
            status = "approved";
          }

          setMilestones([
            {
              name: "Project Completion",
              amount: `${d.milestone_amount_algo.toFixed(2)} ALGO`,
              status,
            },
          ]);
        }
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D]">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-[#2D2D2D] bg-[#111111]">
        <span className="w-[8px] h-[8px] bg-[#FF6B35]" />
        <span className="font-ibm-mono text-[10px] font-bold text-[#FF6B35] tracking-[2px]">
          MILESTONE STATUS
        </span>
        {loading && (
          <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px] ml-auto">
            LOADING...
          </span>
        )}
      </div>

      {/* Milestones */}
      <div className="flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px]">
              FETCHING MILESTONE DATA...
            </span>
          </div>
        ) : (
          milestones.map((m) => {
            const config = statusConfig[m.status];
            return (
              <div key={m.name} className="flex flex-col gap-4 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="font-grotesk text-[16px] font-bold text-[#F5F5F0] tracking-[0.5px]">
                      {m.name}
                    </span>
                    <span className="font-ibm-mono text-[12px] text-[#888888] tracking-[1px]">
                      {m.amount}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 h-[28px] px-3 ${config.bg} border ${config.border}`}
                  >
                    <span className={`w-[5px] h-[5px] rounded-full ${config.dot}`} />
                    <span className={`font-ibm-mono text-[9px] font-bold tracking-[1.5px] ${config.text}`}>
                      {config.label}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-2">
                  <div className="w-full h-[4px] bg-[#1A1A1A]">
                    <div
                      className="h-full bg-[#FFD600] transition-all duration-500"
                      style={{
                        width:
                          m.status === "paid"
                            ? "100%"
                            : m.status === "approved"
                              ? "66%"
                              : "33%",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px]">
                      SUBMITTED
                    </span>
                    <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px]">
                      APPROVED
                    </span>
                    <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px]">
                      PAID
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
