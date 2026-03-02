"use client";

import { useMilestones, type MilestoneStatusType } from "./MilestoneContext";

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
    case "PENDING":
      return "0%";
    case "SUBMITTED":
      return "33%";
    case "APPROVED":
      return "66%";
    case "PAID":
      return "100%";
  }
}

function statusIcon(status: MilestoneStatusType) {
  if (status === "PAID") return "✓";
  if (status === "APPROVED") return "•";
  return " ";
}

export default function MilestoneStatus() {
  const { milestones } = useMilestones();

  return (
    <div className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D]">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-[#2D2D2D] bg-[#111111]">
        <span className="w-[8px] h-[8px] bg-[#FF6B35]" />
        <span className="font-ibm-mono text-[10px] font-bold text-[#FF6B35] tracking-[2px]">
          MILESTONE STATUS
        </span>
        <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px] ml-auto">
          {milestones.filter((m) => m.status === "PAID").length}/{milestones.length} COMPLETED
        </span>
      </div>

      {/* Milestone cards */}
      <div className="flex flex-col">
        {milestones.map((m, i) => {
          const config = statusConfig[m.status];
          const icon = statusIcon(m.status);
          const isPaid = m.status === "PAID";

          return (
            <div
              key={m.id}
              className={`flex flex-col gap-3 px-6 py-4 ${i < milestones.length - 1 ? "border-b border-[#1D1D1D]" : ""
                }`}
            >
              <div className="flex items-center gap-3">
                {/* Checkmark/dot indicator */}
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
                    {icon}
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

                {/* Status badge */}
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
    </div>
  );
}
