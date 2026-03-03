"use client";

import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import ContractOverview from "./ContractOverview";
import MilestoneStatus from "./MilestoneStatus";
import SponsorActions from "./SponsorActions";
import TeamPayment from "./TeamPayment";
import TransactionHistory from "./TransactionHistory";
import { MilestoneProvider } from "./MilestoneContext";
import ProjectsOverview, { type Project } from "./ProjectsOverview";

export default function DashboardClient() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <main className="flex flex-col w-full min-h-screen bg-[#0A0A0A]">
            <DashboardHeader />

            {selectedProject === null ? (
                /* ── PROJECTS OVERVIEW ── */
                <ProjectsOverview onSelectProject={setSelectedProject} />
            ) : (
                /* ── PROJECT DETAIL (existing dashboard) ── */
                <MilestoneProvider appId={selectedProject.appId}>
                    <div className="flex flex-col gap-6 px-6 md:px-[48px] py-8 md:py-12 max-w-[1400px] mx-auto w-full">
                        {/* Back Button */}
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="flex items-center gap-2 self-start group cursor-pointer"
                        >
                            <span className="font-ibm-mono text-[10px] text-[#555555] group-hover:text-[#FFD600] tracking-[1.5px] transition-colors">
                                ← BACK TO PROJECTS
                            </span>
                        </button>

                        {/* Project title bar */}
                        <div className="flex items-center justify-between px-5 py-3 bg-[#111111] border border-[#2D2D2D]">
                            <div className="flex items-center gap-3">
                                <span className="w-[8px] h-[8px] bg-[#FFD600]" />
                                <span className="font-grotesk text-[16px] font-bold text-[#F5F5F0] tracking-[-0.3px]">
                                    {selectedProject.title}
                                </span>
                            </div>
                            <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
                                ID: {selectedProject.id.toUpperCase()}
                            </span>
                        </div>

                        {/* Section label */}
                        <div className="flex items-center gap-2">
                            <span className="w-[4px] h-[4px] bg-[#FFD600]" />
                            <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px]">
                                [01] // CONTRACT STATE
                            </span>
                        </div>

                        {/* Top grid: Contract Overview + Milestones */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2px]">
                            <ContractOverview appId={selectedProject.appId} />
                            <MilestoneStatus />
                        </div>

                        {/* Section label */}
                        <div className="flex items-center gap-2 mt-4">
                            <span className="w-[4px] h-[4px] bg-[#FF6B35]" />
                            <span className="font-ibm-mono text-[10px] font-bold text-[#FF6B35] tracking-[2px]">
                                [02] // ACTIONS
                            </span>
                        </div>

                        {/* Actions grid: Sponsor + Team */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2px]">
                            <SponsorActions appId={selectedProject.appId} />
                            <TeamPayment />
                        </div>

                        {/* Section label */}
                        <div className="flex items-center gap-2 mt-4">
                            <span className="w-[4px] h-[4px] bg-[#F5F5F0]" />
                            <span className="font-ibm-mono text-[10px] font-bold text-[#F5F5F0] tracking-[2px]">
                                [03] // HISTORY
                            </span>
                        </div>

                        {/* Transaction History */}
                        <TransactionHistory appId={selectedProject.appId} />

                        {/* Footer bar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-t border-[#1D1D1D] gap-3">
                            <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1px]">
                                SMART CONTRACT // ALGORAND TESTNET // MILESTONE ESCROW V2
                            </span>
                            <span className="font-ibm-mono text-[10px] text-[#FFD600] tracking-[1px] font-bold">
                                MULTI-MILESTONE
                            </span>
                        </div>
                    </div>
                </MilestoneProvider>
            )}
        </main>
    );
}
