import type { Metadata } from "next";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Grant Escrow Dashboard — Algorand TestNet",
  description:
    "Milestone-based grant escrow dashboard for managing smart contract funds on Algorand TestNet.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
