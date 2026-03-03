export interface Project {
    id: string;
    title: string;
    team: string;
    totalFunds: number;
    releasedFunds: number;
    status: "ACTIVE" | "IN PROGRESS" | "COMPLETED" | "PENDING";
    contract: string;
    appId: number;
    lastUpdated: string;
}

export const statusStyle: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    ACTIVE: { bg: "bg-[#0A2E1A]", border: "border-[#4ADE80]", text: "text-[#4ADE80]", dot: "bg-[#4ADE80]" },
    "IN PROGRESS": { bg: "bg-[#332800]", border: "border-[#FFD600]", text: "text-[#FFD600]", dot: "bg-[#FFD600]" },
    COMPLETED: { bg: "bg-[#1A1A2E]", border: "border-[#60A5FA]", text: "text-[#60A5FA]", dot: "bg-[#60A5FA]" },
    PENDING: { bg: "bg-[#1A1A1A]", border: "border-[#555555]", text: "text-[#555555]", dot: "bg-[#555555]" },
};

export const initialProjects: Project[] = [
    {
        id: "proj_001",
        title: "Blockchain Education Fund",
        team: "OHQISH2P67CG7KVQA7T22ICMRN245VE4M4KGO7G43R4QBUATJN36NMFDRM",
        totalFunds: 4.00,
        releasedFunds: 0.00,
        status: "ACTIVE",
        contract: "5UJS5WR6TK7YRBCHEGO3RW2YGL5NIHEUVIQ3C67L2RGONRC5G",
        appId: 756430745,
        lastUpdated: "2026-03-02 17:45:00 UTC",
    },
    {
        id: "proj_002",
        title: "DeFi Protocol Audit",
        team: "OHQISH2P67CG7XHVZSSYCNWCTKQRV7SHYBHE",
        totalFunds: 4.00,
        releasedFunds: 0.50,
        status: "IN PROGRESS",
        contract: "MN8P2QR4TK7YBCHF6O3EW2XDLS5JIHEUVAQ9C1GL7RONC",
        appId: 756439065,
        lastUpdated: "2026-03-03 10:00:00 UTC",
    },
];

export function getInitialMilestones(appId: number) {
    if (appId === 756439065) {
        return [
            { id: 1, title: "Smart Contract Analysis", amount: 0.50, status: "PAID" },
            { id: 2, title: "Vulnerability Assessment", amount: 1.00, status: "APPROVED" },
            { id: 3, title: "Penetration Testing", amount: 1.00, status: "PENDING" },
            { id: 4, title: "Final Audit Report", amount: 1.50, status: "PENDING" },
        ];
    }
    // Default fallback
    return [
        { id: 1, title: "Proposal Approval", amount: 1.00, status: "PENDING" },
        { id: 2, title: "Development Phase", amount: 1.00, status: "PENDING" },
        { id: 3, title: "Testing Phase", amount: 1.00, status: "PENDING" },
        { id: 4, title: "Final Delivery", amount: 1.00, status: "PENDING" },
    ];
}
