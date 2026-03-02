"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/components/WalletProvider";

const CONTRACT_ADDRESS = "TBD7...4H9Z";
const TOTAL_GRANT = 1.20;

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

const initialMilestones: Milestone[] = [
    { id: 1, title: "Proposal Approval", amount: 0.15, status: "PAID" },
    { id: 2, title: "Development Phase", amount: 0.35, status: "PAID" },
    { id: 3, title: "Testing Phase", amount: 0.25, status: "APPROVED" },
    { id: 4, title: "Final Delivery", amount: 0.45, status: "PENDING" },
];

function shortenAddr(addr: string) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function StudentPage() {
    const { walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();
    const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    // Form state
    const [selectedMilestone, setSelectedMilestone] = useState<number>(4);
    const [description, setDescription] = useState("");
    const [proofLink, setProofLink] = useState("");
    const [notes, setNotes] = useState("");

    const fundsReceived = milestones.filter(m => m.status === "PAID").reduce((sum, m) => sum + m.amount, 0);
    const remainingFunds = TOTAL_GRANT - fundsReceived;

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
                            Recipient Workspace
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
                                className="flex items-center gap-2 h-[36px] px-4 bg-[#111111] border border-[#4ADE80] hover:border-[#F5F5F0] transition-colors cursor-pointer"
                            >
                                <span className="w-[6px] h-[6px] bg-[#4ADE80] rounded-full" />
                                <span className="font-ibm-mono text-[10px] text-[#4ADE80] tracking-[1px]">
                                    {shortenAddr(walletAddress)}
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={connectWallet}
                                disabled={isConnecting}
                                className="nav-light-white font-grotesk text-[11px] font-bold text-[#0A0A0A] bg-[#4ADE80] tracking-[1.5px] px-[18px] py-[9px] hover:bg-[#F5F5F0] transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {isConnecting ? "CONNECTING..." : "CONNECT WALLET"}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 md:px-[48px] py-8 md:py-[48px]">
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
                                    <span className="font-ibm-mono text-[13px] text-[#F5F5F0]">{CONTRACT_ADDRESS}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="font-ibm-mono text-[10px] text-[#555555]">TOTAL GRANT</span>
                                    <span className="font-ibm-mono text-[13px] text-[#4ADE80]">{TOTAL_GRANT.toFixed(2)} ALGO</span>
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
                                            <div className={`flex items-center justify-center px-3 py-1 border ${m.status === "PAID" ? "bg-[#112211] border-[#4ADE80] text-[#4ADE80]" :
                                                m.status === "APPROVED" ? "bg-[#112211] border-[#4ADE80] text-[#4ADE80]" :
                                                    m.status === "SUBMITTED" ? "bg-[#222211] border-[#FFD600] text-[#FFD600]" :
                                                        "bg-[#1A1A1A] border-[#333333] text-[#888888]"
                                                }`}>
                                                <span className="font-ibm-mono text-[10px] tracking-[1px]">{m.status}</span>
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
                        <section className="bg-[#111111] border border-[#4ADE80] p-6 sticky top-24">
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

                        {/* [05] PAYMENT SUMMARY */}
                        <section className="bg-[#111111] border border-[#2D2D2D] p-6">
                            <h2 className="font-ibm-mono text-[12px] text-[#888888] tracking-[2px] mb-6">
                                PAYMENT SUMMARY
                            </h2>
                            <div className="flex flex-col gap-3">
                                {milestones.map(m => (
                                    <div key={m.id} className="flex items-center justify-between pb-3 border-b border-[#1D1D1D] last:border-0 last:pb-0">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-ibm-mono text-[12px] text-[#F5F5F0]">{m.title}</span>
                                            <span className="font-ibm-mono text-[10px] text-[#555555]">
                                                {m.status === "PAID" ? "FUNDS RECEIVED" : m.status === "APPROVED" ? "LOCKED IN ESCROW" : "PENDING"}
                                            </span>
                                        </div>
                                        <span className={`font-ibm-mono text-[13px] ${m.status === "PAID" ? "text-[#4ADE80]" : "text-[#888888]"}`}>
                                            {m.amount.toFixed(2)} ALGO
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
}
