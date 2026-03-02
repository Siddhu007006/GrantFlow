"use client";

import { useState } from "react";
import { useSharedState } from "@/lib/useSharedState";

export interface Project {
    id: string;
    title: string;
    team: string;
    totalFunds: number;
    releasedFunds: number;
    status: "ACTIVE" | "IN PROGRESS" | "COMPLETED" | "PENDING";
    contract: string;
    lastUpdated: string;
}

const statusStyle: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    ACTIVE: { bg: "bg-[#0A2E1A]", border: "border-[#4ADE80]", text: "text-[#4ADE80]", dot: "bg-[#4ADE80]" },
    "IN PROGRESS": { bg: "bg-[#332800]", border: "border-[#FFD600]", text: "text-[#FFD600]", dot: "bg-[#FFD600]" },
    COMPLETED: { bg: "bg-[#1A1A2E]", border: "border-[#60A5FA]", text: "text-[#60A5FA]", dot: "bg-[#60A5FA]" },
    PENDING: { bg: "bg-[#1A1A1A]", border: "border-[#555555]", text: "text-[#555555]", dot: "bg-[#555555]" },
};

const initialProjects: Project[] = [
    {
        id: "proj_001",
        title: "Blockchain Education Fund",
        team: "OHQISH2P67CG7KVQA7T22ICMRN245VE4M4KGO7G43R4QBUATJN36NMFDRM",
        totalFunds: 2.00,
        releasedFunds: 0.00,
        status: "ACTIVE",
        contract: "5UJS5WR6TK7YRBCHEGO3RW2YGL5NIHEUVIQ3C67L2RGONRC5G",
        lastUpdated: "2026-03-02 17:45:00 UTC",
    },
    {
        id: "proj_002",
        title: "DeFi Protocol Audit",
        team: "QR7TL3FJN8DKWPX5VA2YMCG6EHBI9SU0O4Z1NMXFK7PL",
        totalFunds: 15.00,
        releasedFunds: 15.00,
        status: "COMPLETED",
        contract: "MN8P2QR4TK7YBCHF6O3EW2XDLS5JIHEUVAQ9C1GL7RONC",
        lastUpdated: "2026-02-28 09:15:00 UTC",
    },
];

function shortenAddr(addr: string) {
    if (!addr || addr.length < 10) return addr || "---";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// Helper to generate mock addresses
function genMockAddress(prefix: string) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let addr = prefix;
    while (addr.length < 58) {
        addr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return addr;
}

interface Props {
    onSelectProject: (project: Project) => void;
}

export default function ProjectsOverview({ onSelectProject }: Props) {
    const [projects, setProjects] = useSharedState<Project[]>("grantflow_projects", initialProjects);
    const [milestones] = useSharedState<any[]>("grantflow_milestones", []);
    const proj1Paid = milestones.filter(m => m.status === "PAID").reduce((sum: number, m: any) => sum + m.amount, 0);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        team: "",
        totalFunds: "",
        milestones: "4",
        description: "" // Optional, just for completeness
    });

    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === "ACTIVE" || p.status === "IN PROGRESS").length;
    const completedProjects = projects.filter(p => p.status === "COMPLETED").length;
    const totalFunds = projects.reduce((s, p) => s + p.totalFunds, 0);

    return (
        <div className="flex flex-col gap-8 px-6 md:px-[48px] py-8 md:py-12 max-w-[1400px] mx-auto w-full">
            {/* Summary Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
                {[
                    { label: "TOTAL PROJECTS", value: totalProjects.toString(), color: "#F5F5F0" },
                    { label: "ACTIVE PROJECTS", value: activeProjects.toString(), color: "#4ADE80" },
                    { label: "COMPLETED", value: completedProjects.toString(), color: "#60A5FA" },
                    { label: "TOTAL ALLOCATED", value: `${totalFunds.toFixed(2)} ALGO`, color: "#FFD600" },
                ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-2 bg-[#0F0F0F] border border-[#2D2D2D] px-5 py-4">
                        <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">{s.label}</span>
                        <span className="font-grotesk text-[22px] font-bold tracking-[-0.5px]" style={{ color: s.color }}>
                            {s.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Section Label + Action Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1D1D1D] pb-4">
                <div className="flex items-center gap-2">
                    <span className="w-[4px] h-[4px] bg-[#FFD600]" />
                    <span className="font-ibm-mono text-[10px] font-bold text-[#FFD600] tracking-[2px]">
                        ALL PROJECTS
                    </span>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center h-[40px] px-6 bg-[#FFD600] hover:bg-[#e6c200] transition-colors cursor-pointer"
                >
                    <span className="font-grotesk text-[11px] font-bold text-[#0A0A0A] tracking-[1.5px]">
                        + CREATE NEW PROJECT
                    </span>
                </button>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((p) => {
                    const st = statusStyle[p.status] || statusStyle.PENDING;
                    // Link proj_001 to live milestones mock data from other tabs
                    const actualReleased = p.id === "proj_001" ? proj1Paid : p.releasedFunds;
                    const progress = p.totalFunds > 0 ? (actualReleased / p.totalFunds) * 100 : 0;

                    return (
                        <button
                            key={p.id}
                            onClick={() => onSelectProject(p)}
                            className="flex flex-col bg-[#0F0F0F] border border-[#2D2D2D] hover:border-[#FFD600] transition-colors cursor-pointer text-left group"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2D2D2D]">
                                <span className="font-grotesk text-[14px] font-bold text-[#F5F5F0] tracking-[-0.3px] group-hover:text-[#FFD600] transition-colors">
                                    {p.title}
                                </span>
                                <div className={`flex items-center gap-1.5 h-[20px] px-2 ${st.bg} border ${st.border}`}>
                                    <span className={`w-[4px] h-[4px] rounded-full ${st.dot}`} />
                                    <span className={`font-ibm-mono text-[7px] font-bold tracking-[1.5px] ${st.text}`}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="flex flex-col gap-3 px-5 py-4">
                                {/* Fund bar */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">FUNDS</span>
                                        <span className="font-ibm-mono text-[10px] text-[#F5F5F0] tracking-[0.5px]">
                                            {actualReleased.toFixed(2)} / {p.totalFunds.toFixed(2)} ALGO
                                        </span>
                                    </div>
                                    <div className="w-full h-[3px] bg-[#1D1D1D]">
                                        <div
                                            className="h-full bg-[#4ADE80] transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex items-center justify-between">
                                    <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px]">TEAM</span>
                                    <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[0.5px]">{shortenAddr(p.team)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px]">CONTRACT</span>
                                    <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[0.5px]">{shortenAddr(p.contract)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1px]">UPDATED</span>
                                    <span className="font-ibm-mono text-[10px] text-[#888888] tracking-[0.5px]">{p.lastUpdated}</span>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="flex items-center justify-center px-5 py-3 border-t border-[#2D2D2D] bg-[#111111] group-hover:bg-[#1A1A0A] transition-colors">
                                <span className="font-ibm-mono text-[9px] font-bold text-[#FFD600] tracking-[2px] group-hover:tracking-[3px] transition-all">
                                    OPEN PROJECT →
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                    <div className="flex flex-col w-full max-w-[500px] bg-[#0A0A0A] border border-[#2D2D2D] shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2D2D] bg-[#111111]">
                            <div className="flex items-center gap-2">
                                <span className="w-[6px] h-[6px] bg-[#FFD600]" />
                                <span className="font-grotesk text-[14px] font-bold text-[#F5F5F0] tracking-[-0.3px]">
                                    CREATE NEW PROJECT
                                </span>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-[#555555] hover:text-[#FF4444] transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form Body */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                const newProj: Project = {
                                    id: `proj_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                                    title: formData.title || "Untitled Project",
                                    team: formData.team || genMockAddress("TEAM"),
                                    totalFunds: parseFloat(formData.totalFunds) || 0,
                                    releasedFunds: 0,
                                    status: "PENDING",
                                    contract: genMockAddress("APP"),
                                    lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 19) + " UTC"
                                };

                                setProjects([newProj, ...projects]);
                                setIsModalOpen(false);
                                setFormData({ title: "", team: "", totalFunds: "", milestones: "4", description: "" });
                            }}
                            className="flex flex-col gap-5 px-6 py-6"
                        >
                            <label className="flex flex-col gap-2">
                                <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">PROJECT NAME</span>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. DeFi Innovation Grant"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="h-[44px] bg-[#111111] border border-[#2D2D2D] focus:border-[#FFD600] px-3 font-grotesk text-[13px] text-[#F5F5F0] outline-none transition-colors"
                                />
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">TEAM WALLET ADDRESS</span>
                                <input
                                    required
                                    type="text"
                                    placeholder="Paste Algorand address"
                                    value={formData.team}
                                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                    className="h-[44px] bg-[#111111] border border-[#2D2D2D] focus:border-[#FFD600] px-3 font-ibm-mono text-[10px] text-[#F5F5F0] outline-none transition-colors"
                                />
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex flex-col gap-2">
                                    <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">TOTAL FUNDING (ALGO)</span>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.totalFunds}
                                        onChange={(e) => setFormData({ ...formData, totalFunds: e.target.value })}
                                        className="h-[44px] bg-[#111111] border border-[#2D2D2D] focus:border-[#FFD600] px-3 font-ibm-mono text-[12px] text-[#FFD600] outline-none transition-colors"
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">MILESTONES</span>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.milestones}
                                        onChange={(e) => setFormData({ ...formData, milestones: e.target.value })}
                                        className="h-[44px] bg-[#111111] border border-[#2D2D2D] focus:border-[#FFD600] px-3 font-ibm-mono text-[12px] text-[#F5F5F0] outline-none transition-colors"
                                    />
                                </label>
                            </div>

                            <label className="flex flex-col gap-2">
                                <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">DESCRIPTION (OPTIONAL)</span>
                                <textarea
                                    rows={2}
                                    placeholder="Brief summary matching grant proposal..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="bg-[#111111] border border-[#2D2D2D] focus:border-[#FFD600] p-3 font-grotesk text-[12px] text-[#F5F5F0] outline-none transition-colors resize-none"
                                />
                            </label>

                            <div className="flex gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-[44px] border border-[#2D2D2D] hover:bg-[#1A1A1A] text-[#888888] font-grotesk font-bold text-[11px] tracking-[1.5px] transition-colors"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 h-[44px] bg-[#FFD600] hover:bg-[#e6c200] text-[#0A0A0A] font-grotesk font-bold text-[11px] tracking-[1.5px] transition-colors"
                                >
                                    CREATE PROJECT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
