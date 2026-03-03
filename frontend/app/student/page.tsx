"use client";

import { useState, useEffect } from "react";
import { type Project, initialProjects, getInitialMilestones } from "@/lib/projectsStore";
import Link from "next/link";
import { useWallet } from "@/components/WalletProvider";
import { useSharedState } from "@/lib/useSharedState";
import { getInitialTransactions } from "@/components/dashboard/TransactionHistory";

type MilestoneStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "PAID";

interface Milestone {
    id: number;
    title: string;
    amount: number;
    status: MilestoneStatus;
}

interface Submission {
    id: string;
    milestoneId: number;
    milestoneTitle: string;
    description: string;
    proofLink: string;
    notes?: string;
    date: string;
    status: "SUBMITTED" | "REVIEWING" | "APPROVED";
}





function shortenAddr(addr: string) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
}

const statusBadge: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    PENDING: { bg: "bg-[#1A1A1A]", border: "border-[#555555]", text: "text-[#555555]", dot: "bg-[#555555]" },
    SUBMITTED: { bg: "bg-[#0A1A2E]", border: "border-[#60A5FA]", text: "text-[#60A5FA]", dot: "bg-[#60A5FA]" },
    APPROVED: { bg: "bg-[#332800]", border: "border-[#FFD600]", text: "text-[#FFD600]", dot: "bg-[#FFD600]" },
    PAID: { bg: "bg-[#0A2E1A]", border: "border-[#4ADE80]", text: "text-[#4ADE80]", dot: "bg-[#4ADE80]" },
};

export default function StudentPage() {
    const { walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [allProjects] = useSharedState<Project[]>("grantflow_projects", initialProjects);

    // Filter projects where team address matches the connected student wallet
    let myProjects = allProjects.filter(
        p => walletAddress && p.team === walletAddress
    );

    // MVP Fallback: if no projects match exactly, show all projects as demos
    if (myProjects.length === 0 && walletAddress) {
        myProjects = allProjects;
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] font-sans pb-20">
            {/* ── HEADER ── */}
            <header className="flex flex-col w-full bg-[#0F0F0F] border-b border-[#2D2D2D]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-[48px] py-5 max-w-[1400px] mx-auto w-full">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-[10px] shrink-0 group">
                                <span className="w-[10px] h-[10px] bg-[#4ADE80] group-hover:scale-110 transition-transform" />
                                <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
                                    GRANTFLOW
                                </span>
                            </Link>
                            <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1px]">/</span>
                            <span className="font-ibm-mono text-[10px] text-[#4ADE80] tracking-[1.5px] font-bold">
                                STUDENT PORTAL
                            </span>
                        </div>
                        <h1 className="font-grotesk text-[28px] md:text-[36px] font-bold text-[#F5F5F0] tracking-[-1px] leading-none">
                            {selectedProject ? "Recipient Workspace" : "My Projects"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 h-[32px] px-3 bg-[#1A1A1A] border border-[#2D2D2D]">
                            <span className="w-[6px] h-[6px] rounded-full bg-[#4ADE80] animate-pulse" />
                            <span className="font-ibm-mono text-[10px] text-[#4ADE80] tracking-[1.5px]">
                                ALGORAND TESTNET
                            </span>
                        </div>
                        {walletAddress ? (
                            <button
                                onClick={disconnectWallet}
                                className="flex items-center gap-2 h-[36px] px-4 bg-[#111111] border border-[#FFD600] hover:border-[#F5F5F0] transition-colors cursor-pointer"
                            >
                                <span className="w-[6px] h-[6px] bg-[#4ADE80] rounded-full" />
                                <span className="font-ibm-mono text-[11px] text-[#FFD600] tracking-[1px]">
                                    {shortenAddr(walletAddress)}
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={connectWallet}
                                disabled={isConnecting}
                                className="nav-light-white flex items-center justify-center h-[36px] px-5 bg-[#FFD600] text-[#0A0A0A] font-grotesk font-bold text-[11px] tracking-[1.5px] hover:bg-[#e6c200] transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <span className="font-grotesk text-[11px] font-bold text-[#0A0A0A] tracking-[1.5px]">
                                    {isConnecting ? "CONNECTING..." : "CONNECT WALLET"}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 md:px-[48px] py-8 md:py-[48px]">
                {!walletAddress ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] border border-[#2D2D2D] border-dashed p-12 text-center">
                        <span className="w-12 h-12 bg-[#1A1A1A] rounded-full mb-6 items-center justify-center flex">
                            <span className="w-3 h-3 bg-[#FFD600] rounded-full animate-pulse" />
                        </span>
                        <h2 className="font-grotesk text-[24px] font-bold text-[#F5F5F0] mb-2">Connect Your Team Wallet</h2>
                        <p className="font-ibm-mono text-[13px] text-[#888888] max-w-md">
                            Please connect your Algorand wallet to view projects and submit proofs of work.
                        </p>
                    </div>
                ) : !selectedProject ? (
                    /* ── PROJECTS OVERVIEW ── */
                    <div className="flex flex-col gap-6">
                        {myProjects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[40vh] border border-[#2D2D2D] border-dashed p-12 text-center">
                                <h2 className="font-grotesk text-[20px] font-bold text-[#888888]">No Projects Found</h2>
                                <p className="font-ibm-mono text-[12px] text-[#555555] mt-2">
                                    There are no active projects assigned to {shortenAddr(walletAddress)}.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {myProjects.map((project) => (
                                    <StudentProjectCard
                                        key={project.id}
                                        project={project}
                                        onSelect={() => setSelectedProject(project)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* ── WORKSPACE DETAIL ── */
                    <StudentWorkspace
                        project={selectedProject}
                        onBack={() => setSelectedProject(null)}
                    />
                )}
            </main>
        </div>
    );
}

function StudentProjectCard({ project, onSelect }: { project: Project, onSelect: () => void }) {
    const [milestones] = useSharedState<Milestone[]>(`grantflow_milestones_app_${project.appId}`, getInitialMilestones(project.appId) as any);

    const fundsReceived = milestones.filter(m => m.status === "PAID").reduce((sum, m) => sum + m.amount, 0);
    const remainingFunds = milestones.filter(m => m.status !== "PAID").reduce((sum, m) => sum + m.amount, 0);
    const calculatedTotalGrant = fundsReceived + remainingFunds;

    return (
        <div className="flex flex-col bg-[#111111] border border-[#2D2D2D] hover:border-[#4ADE80] transition-all group overflow-hidden">
            <div className="px-6 py-5 border-b border-[#2D2D2D] bg-[#161616]">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-grotesk text-[20px] font-bold text-[#F5F5F0] leading-tight pr-4">
                        {project.title}
                    </h3>
                    <div className="px-2 py-1 bg-[#0A2E1A] border border-[#4ADE80] shrink-0">
                        <span className="font-ibm-mono text-[9px] text-[#4ADE80] tracking-[1px] font-bold">
                            {project.status}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="font-ibm-mono text-[10px] text-[#555555]">SPONSOR WALLET</span>
                    <span className="font-ibm-mono text-[12px] text-[#888888] truncate">{project.team}</span>
                </div>
            </div>

            <div className="px-6 py-5 flex items-center justify-between border-b border-[#2D2D2D]">
                <div className="flex flex-col gap-1">
                    <span className="font-ibm-mono text-[10px] text-[#555555]">FUNDS RECEIVED</span>
                    <span className="font-ibm-mono text-[10px] text-[#F5F5F0]">{fundsReceived.toFixed(2)} ALGO</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                    <span className="font-ibm-mono text-[10px] text-[#555555]">TOTAL GRANT</span>
                    <span className="font-ibm-mono text-[9px] text-[#F5F5F0] tracking-[1px]">{calculatedTotalGrant.toFixed(2)} ALGO</span>
                </div>
            </div>

            <button
                onClick={onSelect}
                className="nav-light-white w-full py-4 bg-[#111111] hover:bg-[#4ADE80] hover:text-[#0A0A0A] text-[#4ADE80] font-grotesk font-bold text-[12px] tracking-[2px] transition-colors flex items-center justify-center gap-2 group-hover:bg-[#4ADE80] group-hover:text-[#0A0A0A]"
            >
                OPEN WORKSPACE <span>→</span>
            </button>
        </div>
    );
}

/**
 * The inner workspace component. Isolated to ensure useSharedState hooks 
 * properly reinitialize when a project is switched, as their keys depend on the appId.
 */
function StudentWorkspace({ project, onBack }: { project: Project; onBack: () => void }) {
    const [milestones, setMilestones] = useSharedState<Milestone[]>(`grantflow_milestones_app_${project.appId}`, getInitialMilestones(project.appId) as any);
    const [submissions, setSubmissions] = useSharedState<Submission[]>(`grantflow_submissions_app_${project.appId}`, []);
    const [transactions, setTransactions] = useSharedState<any[]>(`grantflow_transactions_app_${project.appId}`, getInitialTransactions(project.appId));

    const [selectedMilestone, setSelectedMilestone] = useState<number>(4);
    const [description, setDescription] = useState("");
    const [proofLink, setProofLink] = useState("");
    const [notes, setNotes] = useState("");
    const [contractAddress, setContractAddress] = useState(project.contract);



    const fundsReceived = milestones.filter(m => m.status === "PAID").reduce((sum, m) => sum + m.amount, 0);
    const remainingFunds = milestones.filter(m => m.status !== "PAID").reduce((sum, m) => sum + m.amount, 0);
    const calculatedTotalGrant = fundsReceived + remainingFunds;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !proofLink) return;

        const milestone = milestones.find(m => m.id === selectedMilestone);
        if (!milestone) return;

        // Create submission record
        const newSubmission: Submission = {
            id: Math.random().toString(36).substring(7),
            milestoneId: milestone.id,
            milestoneTitle: milestone.title,
            description,
            proofLink,
            notes,
            date: new Date().toISOString().split("T")[0],
            status: "SUBMITTED"
        };

        setSubmissions([newSubmission, ...submissions]);

        // Push a generic submission event to the transaction history log
        const newTx = {
            action: "SUBMISSION",
            actionColor: "#60A5FA",
            details: `Proof Submitted for Milestone ${milestone.id}`,
            date: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
            txId: "---",
            status: "PENDING REVIEW",
            statusColor: "#FFD600"
        };
        setTransactions((prev) => [newTx, ...prev]);

        // Update milestone status
        setMilestones(prev => prev.map(m =>
            m.id === selectedMilestone ? { ...m, status: "SUBMITTED" } : m
        ));

        // Reset form
        setDescription("");
        setProofLink("");
        setNotes("");

        // Select next available pending milestone if any
        const nextPending = milestones.find(m => m.status === "PENDING" && m.id !== selectedMilestone);
        if (nextPending) setSelectedMilestone(nextPending.id);
    };

    return (
        <div className="flex flex-col gap-8 w-full">

            {/* BACK BUTTON */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 self-start group cursor-pointer"
            >
                <span className="font-ibm-mono text-[10px] text-[#555555] group-hover:text-[#4ADE80] tracking-[1.5px] transition-colors">
                    ← BACK TO MY PROJECTS
                </span>
            </button>

            {/* Project Title Banner */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#111111] border border-[#2D2D2D] w-full">
                <div className="flex items-center gap-3">
                    <span className="w-[8px] h-[8px] bg-[#4ADE80]" />
                    <span className="font-grotesk text-[16px] font-bold text-[#F5F5F0] tracking-[-0.3px]">
                        {project.title}
                    </span>
                </div>
                <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[1.5px]">
                    ID: {project.id.toUpperCase()}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── LEFT COLUMN ── */}
                <div className="lg:col-span-2 flex flex-col gap-8">

                    {/* [01] PROJECT OVERVIEW */}
                    <section className="bg-[#111111] border border-[#2D2D2D] p-6">
                        <h2 className="font-ibm-mono text-[12px] text-[#888888] tracking-[2px] mb-6">
                            PROJECT OVERVIEW
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col gap-2">
                                <span className="font-ibm-mono text-[10px] text-[#555555]">CONTRACT</span>
                                <span className="font-ibm-mono text-[13px] text-[#F5F5F0]">{contractAddress}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="font-ibm-mono text-[10px] text-[#555555]">TOTAL GRANT</span>
                                <span className="font-ibm-mono text-[13px] text-[#4ADE80]">{calculatedTotalGrant.toFixed(2)} ALGO</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="font-ibm-mono text-[10px] text-[#555555]">RECEIVED</span>
                                <span className="font-ibm-mono text-[13px] text-[#F5F5F0]">{fundsReceived.toFixed(2)} ALGO</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="font-ibm-mono text-[10px] text-[#555555]">REMAINING</span>
                                <span className="font-ibm-mono text-[13px] text-[#888888]">{remainingFunds.toFixed(2)} ALGO</span>
                            </div>
                        </div>
                    </section>

                    {/* [02] MILESTONE LIST */}
                    <section className="bg-[#111111] border border-[#2D2D2D] p-6">
                        <h2 className="font-ibm-mono text-[12px] text-[#888888] tracking-[2px] mb-6">
                            MILESTONE TRACKER
                        </h2>
                        <div className="flex flex-col gap-3">
                            {milestones.map((m) => (
                                <div key={m.id} className="flex items-center justify-between p-4 bg-[#161616] border border-[#222222]">
                                    <div className="flex items-center gap-4">
                                        <span className="font-ibm-mono text-[12px] text-[#555555]">0{m.id}</span>
                                        <span className="font-ibm-mono text-[14px] text-[#F5F5F0]">{m.title}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-ibm-mono text-[13px] text-[#888888]">{m.amount.toFixed(2)} ALGO</span>
                                        <div className={`flex items-center gap-2 h-[24px] px-3 shrink-0 ${statusBadge[m.status].bg} border ${statusBadge[m.status].border}`}>
                                            <span className={`w-[4px] h-[4px] rounded-full ${statusBadge[m.status].dot}`} />
                                            <span className={`font-ibm-mono text-[8px] font-bold tracking-[1.5px] ${statusBadge[m.status].text}`}>
                                                {m.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* [04] SUBMISSION HISTORY */}
                    {submissions.length > 0 && (
                        <section className="bg-[#111111] border border-[#2D2D2D] p-6">
                            <h2 className="font-ibm-mono text-[12px] text-[#888888] tracking-[2px] mb-6">
                                SUBMISSION HISTORY
                            </h2>
                            <div className="flex flex-col gap-4">
                                {submissions.map((sub) => (
                                    <div key={sub.id} className="flex flex-col gap-3 p-4 bg-[#161616] border border-[#222222]">
                                        <div className="flex items-center justify-between border-b border-[#2D2D2D] pb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="font-ibm-mono text-[11px] text-[#4ADE80]">#{sub.id}</span>
                                                <span className="font-ibm-mono text-[13px] text-[#F5F5F0]">{sub.milestoneTitle}</span>
                                            </div>
                                            <span className="font-ibm-mono text-[11px] text-[#888888]">{sub.date}</span>
                                        </div>
                                        <p className="font-ibm-mono text-[12px] text-[#AAAAAA] leading-relaxed">
                                            {sub.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-2">
                                            <a href={sub.proofLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#4ADE80] hover:text-[#3BC970] transition-colors">
                                                <span className="font-ibm-mono text-[11px] tracking-[1px]">VIEW PROOF ↗</span>
                                            </a>
                                            <div className="px-2 py-1 bg-[#222211] border border-[#FFD600]">
                                                <span className="font-ibm-mono text-[9px] text-[#FFD600] tracking-[1px]">UNDER REVIEW</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="flex flex-col gap-8">

                    {/* [03] SUBMISSION PANEL */}
                    <section className="bg-[#111111] border border-[#4ADE80] p-6">
                        <h2 className="font-ibm-mono text-[12px] text-[#4ADE80] tracking-[2px] mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#4ADE80] rounded-full animate-pulse" />
                            SUBMIT PROOF
                        </h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="font-ibm-mono text-[10px] text-[#888888] tracking-[1px]">SELECT MILESTONE</label>
                                <select
                                    value={selectedMilestone}
                                    onChange={(e) => setSelectedMilestone(Number(e.target.value))}
                                    className="w-full bg-[#1A1A1A] border border-[#333333] p-3 font-ibm-mono text-[12px] text-[#F5F5F0] focus:border-[#4ADE80] outline-none transition-colors"
                                >
                                    {milestones.filter(m => m.status === "PENDING").map(m => (
                                        <option key={m.id} value={m.id}>{m.title} ({m.amount} ALGO)</option>
                                    ))}
                                    {milestones.filter(m => m.status === "PENDING").length === 0 && (
                                        <option value={0} disabled>No pending milestones</option>
                                    )}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-ibm-mono text-[10px] text-[#888888] tracking-[1px]">WORK DESCRIPTION</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the work completed..."
                                    className="w-full bg-[#1A1A1A] border border-[#333333] p-3 font-ibm-mono text-[12px] text-[#F5F5F0] focus:border-[#4ADE80] outline-none transition-colors min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-ibm-mono text-[10px] text-[#888888] tracking-[1px]">PROOF LINK (URL)</label>
                                <input
                                    type="url"
                                    required
                                    value={proofLink}
                                    onChange={(e) => setProofLink(e.target.value)}
                                    placeholder="https://github.com/..."
                                    className="w-full bg-[#1A1A1A] border border-[#333333] p-3 font-ibm-mono text-[12px] text-[#F5F5F0] focus:border-[#4ADE80] outline-none transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-ibm-mono text-[10px] text-[#888888] tracking-[1px]">NOTES (OPTIONAL)</label>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any additional context..."
                                    className="w-full bg-[#1A1A1A] border border-[#333333] p-3 font-ibm-mono text-[12px] text-[#F5F5F0] focus:border-[#4ADE80] outline-none transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={milestones.filter(m => m.status === "PENDING").length === 0}
                                className="nav-light-white w-full mt-2 bg-[#4ADE80] hover:bg-[#3BC970] text-[#0A0A0A] font-grotesk font-bold text-[13px] tracking-[2px] h-[48px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                SUBMIT MILESTONE
                            </button>
                        </form>
                    </section>

                </div>
            </div>
        </div>
    );
}
