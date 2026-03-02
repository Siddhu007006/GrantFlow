"use client";

import { RECEIVER_ADDRESS } from "@/lib/constants";
import { useMilestones, type MilestoneStatusType } from "./MilestoneContext";

function shortenAddress(addr: string) {
  if (!addr || addr.length < 10) return addr || "---";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function paymentLabel(status: MilestoneStatusType): {
  label: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case "PAID":
      return { label: "RECEIVED", text: "text-[#4ADE80]", dot: "bg-[#4ADE80]" };
    case "APPROVED":
      return { label: "PENDING", text: "text-[#FFD600]", dot: "bg-[#FFD600]" };
    case "SUBMITTED":
      return { label: "PENDING", text: "text-[#60A5FA]", dot: "bg-[#60A5FA]" };
    case "PENDING":
    default:
      return { label: "LOCKED", text: "text-[#555555]", dot: "bg-[#555555]" };
  }
}

export default function TeamPayment() {
  const { milestones, totalPaid, totalPending, totalGrant } = useMilestones();

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
        {/* Per-milestone payment breakdown header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#2D2D2D] bg-[#0D0D0D]">
          <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
            MILESTONE PAYMENTS
          </span>
        </div>

        {/* Per-milestone rows */}
        {milestones.map((m, i) => {
          const pl = paymentLabel(m.status);
          return (
            <div
              key={m.id}
              className={`flex items-center justify-between px-6 py-3 ${i < milestones.length - 1 ? "border-b border-[#1D1D1D]" : "border-b border-[#2D2D2D]"
                }`}
            >
              <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[0.5px]">
                {m.title}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className={`w-[4px] h-[4px] rounded-full ${pl.dot}`} />
                  <span className={`font-ibm-mono text-[8px] font-bold tracking-[1.5px] ${pl.text}`}>
                    {pl.label}
                  </span>
                </div>
                <span className={`font-ibm-mono text-[10px] tracking-[1px] ${m.status === "PAID" ? "text-[#F5F5F0]" : "text-[#555555]"
                  }`}>
                  {m.amount.toFixed(2)} ALGO
                </span>
              </div>
            </div>
          );
        })}

        {/* Summary totals */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1D1D1D]">
          <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px]">
            TEAM WALLET
          </span>
          <span className="font-ibm-mono text-[11px] text-[#F5F5F0] tracking-[1px]">
            {shortenAddress(RECEIVER_ADDRESS)}
          </span>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1D1D1D]">
          <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px]">
            TOTAL RECEIVED
          </span>
          <span className="font-ibm-mono text-[11px] text-[#4ADE80] font-bold tracking-[1px]">
            {totalPaid.toFixed(2)} ALGO
          </span>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1D1D1D]">
          <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px]">
            PENDING RELEASE
          </span>
          <span className="font-ibm-mono text-[11px] text-[#FFD600] font-bold tracking-[1px]">
            {totalPending.toFixed(2)} ALGO
          </span>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px]">
            TOTAL GRANT
          </span>
          <span className="font-ibm-mono text-[11px] text-[#F5F5F0] tracking-[1px]">
            {totalGrant.toFixed(2)} ALGO
          </span>
        </div>
      </div>
    </div>
  );
}
