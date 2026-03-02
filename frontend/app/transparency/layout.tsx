import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Public Transparency View - Grant Escrow",
    description:
        "Public read-only view of the milestone-based grant escrow contract state on Algorand TestNet.",
};

export default function TransparencyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
