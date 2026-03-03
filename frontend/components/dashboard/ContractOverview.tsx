"use client";

import { useEffect, useState } from "react";

import { useSharedState } from "@/lib/useSharedState";
import { useMilestones } from "./MilestoneContext";
import { type Project, initialProjects } from "@/lib/projectsStore";

function shortenAddress(addr: string) {
  if (!addr || addr.length < 10) return addr || "---";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

interface Props {
  appId: number;
}

export default function ContractOverview({ appId }: Props) {
  const [projects] = useSharedState<Project[]>("grantflow_projects", initialProjects);
  const project = projects.find(p => p.appId === appId);
  const { milestones } = useMilestones();

  const fundsReceived = milestones.filter(m => m.status === "PAID").reduce((sum, m) => sum + m.amount, 0);
  const remainingFunds = milestones.filter(m => m.status !== "PAID").reduce((sum, m) => sum + m.amount, 0);
  const totalFundsLocked = fundsReceived + remainingFunds;

  const contractData = project
    ? [
      { key: "APPLICATION ID", value: `APP-${project.appId}` },
      { key: "CONTRACT ADDRESS", value: shortenAddress(project.contract) },
      { key: "TEAM ADDRESS", value: shortenAddress(project.team) },
      {
        key: "TOTAL FUNDS LOCKED",
        value: `${totalFundsLocked.toFixed(2)} ALGO`,
        highlight: true,
      },
      {
        key: "FUNDS RELEASED",
        value: `${fundsReceived.toFixed(2)} ALGO`,
      },
      {
        key: "REMAINING BALANCE",
        value: `${remainingFunds.toFixed(2)} ALGO`,
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
      </div>

      {/* Data rows */}
      <div className="flex flex-col">
        {contractData.map((item, i) => (
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
        }
      </div>
    </div>
  );
}
