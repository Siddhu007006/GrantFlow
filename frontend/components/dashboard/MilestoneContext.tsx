"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type MilestoneStatusType = "PENDING" | "SUBMITTED" | "APPROVED" | "PAID";

export interface Milestone {
    id: number;
    title: string;
    amount: number;
    status: MilestoneStatusType;
}

interface MilestoneContextType {
    milestones: Milestone[];
    selectedId: number;
    selectedMilestone: Milestone | undefined;
    selectMilestone: (id: number) => void;
    approveMilestone: (id: number) => void;
    releaseMilestone: (id: number) => void;
    totalPaid: number;
    totalPending: number;
    totalGrant: number;
}

const defaultMilestones: Milestone[] = [
    { id: 1, title: "Proposal Approval", amount: 0.15, status: "PAID" },
    { id: 2, title: "Development Phase", amount: 0.35, status: "PAID" },
    { id: 3, title: "Testing Phase", amount: 0.40, status: "APPROVED" },
    { id: 4, title: "Final Delivery", amount: 1.10, status: "PENDING" },
];

const MilestoneContext = createContext<MilestoneContextType>({
    milestones: defaultMilestones,
    selectedId: 3,
    selectedMilestone: defaultMilestones[2],
    selectMilestone: () => { },
    approveMilestone: () => { },
    releaseMilestone: () => { },
    totalPaid: 0,
    totalPending: 0,
    totalGrant: 0,
});

export function useMilestones() {
    return useContext(MilestoneContext);
}

export function MilestoneProvider({ children }: { children: ReactNode }) {
    const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
    const [selectedId, setSelectedId] = useState(3); // Default to Testing Phase

    const selectedMilestone = milestones.find((m) => m.id === selectedId);

    const selectMilestone = useCallback((id: number) => {
        setSelectedId(id);
    }, []);

    const approveMilestone = useCallback((id: number) => {
        setMilestones((prev) =>
            prev.map((m) =>
                m.id === id && (m.status === "PENDING" || m.status === "SUBMITTED")
                    ? { ...m, status: "APPROVED" as MilestoneStatusType }
                    : m
            )
        );
    }, []);

    const releaseMilestone = useCallback((id: number) => {
        setMilestones((prev) =>
            prev.map((m) =>
                m.id === id && m.status === "APPROVED"
                    ? { ...m, status: "PAID" as MilestoneStatusType }
                    : m
            )
        );
    }, []);

    const totalPaid = milestones
        .filter((m) => m.status === "PAID")
        .reduce((sum, m) => sum + m.amount, 0);

    const totalPending = milestones
        .filter((m) => m.status !== "PAID")
        .reduce((sum, m) => sum + m.amount, 0);

    const totalGrant = milestones.reduce((sum, m) => sum + m.amount, 0);

    return (
        <MilestoneContext.Provider
            value={{
                milestones,
                selectedId,
                selectedMilestone,
                selectMilestone,
                approveMilestone,
                releaseMilestone,
                totalPaid,
                totalPending,
                totalGrant,
            }}
        >
            {children}
        </MilestoneContext.Provider>
    );
}
