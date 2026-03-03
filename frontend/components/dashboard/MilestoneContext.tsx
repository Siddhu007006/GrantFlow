"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useSharedState } from "@/lib/useSharedState";
import { getInitialMilestones } from "@/lib/projectsStore";

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

const MilestoneContext = createContext<MilestoneContextType>({
    milestones: [],
    selectedId: 3,
    selectedMilestone: undefined,
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

export function MilestoneProvider({ children, appId }: { children: ReactNode, appId: number }) {
    const [milestones, setMilestones] = useSharedState<Milestone[]>(`grantflow_milestones_app_${appId}`, getInitialMilestones(appId) as any);
    const [selectedId, setSelectedId] = useState(3); // Default to Testing Phase

    const selectedMilestone = milestones.find((m) => m.id === selectedId);

    const selectMilestone = useCallback((id: number) => {
        setSelectedId(id);
    }, []);

    const approveMilestone = useCallback(async (id: number) => {
        // Optimistic UI update
        setMilestones((prev) =>
            prev.map((m) =>
                m.id === id && (m.status === "PENDING" || m.status === "SUBMITTED")
                    ? { ...m, status: "APPROVED" as MilestoneStatusType }
                    : m
            )
        );

        // Actual network request
        try {
            await fetch("http://127.0.0.1:5000/api/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ app_id: appId })
            });
        } catch (err) {
            console.error("Error approving milestone:", err);
        }
    }, [appId, setMilestones]);

    const releaseMilestone = useCallback(async (id: number) => {
        // Optimistic UI update
        setMilestones((prev) =>
            prev.map((m) =>
                m.id === id && m.status === "APPROVED"
                    ? { ...m, status: "PAID" as MilestoneStatusType }
                    : m
            )
        );

        // Actual network request
        try {
            await fetch("http://127.0.0.1:5000/api/release", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ app_id: appId })
            });
        } catch (err) {
            console.error("Error releasing milestone:", err);
        }
    }, [appId, setMilestones]);

    const totalPaid = milestones.filter(m => m.status === "PAID").reduce((sum, m) => sum + m.amount, 0);
    const totalPending = milestones.filter(m => m.status !== "PAID").reduce((sum, m) => sum + m.amount, 0);
    const totalGrant = totalPaid + totalPending;

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
