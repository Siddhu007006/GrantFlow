import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Student Portal — Coming Soon | GrantFlow",
    description: "The GrantFlow Student Portal is under development. Stay tuned for milestone submission and grant tracking features.",
};

export default function StudentPage() {
    return (
        <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#0A0A0A] px-6">
            {/* Badge */}
            <div className="flex items-center gap-2 h-[32px] px-4 bg-[#1A1A1A] border-2 border-[#4ADE80] mb-8">
                <span className="w-[8px] h-[8px] bg-[#4ADE80]" />
                <span className="font-ibm-mono text-[10px] font-bold text-[#4ADE80] tracking-[2px]">
                    [STUDENT PORTAL]
                </span>
            </div>

            {/* Title */}
            <h1 className="font-grotesk text-[clamp(32px,8vw,72px)] font-bold text-[#F5F5F0] tracking-[-1px] leading-none text-center">
                COMING SOON
            </h1>

            <div className="h-6" />

            {/* Description */}
            <p className="font-ibm-mono text-[13px] text-[#888888] tracking-[1px] leading-[1.8] text-center max-w-[600px]">
                THE STUDENT PORTAL WILL ALLOW GRANT RECIPIENTS TO SUBMIT MILESTONE PROGRESS,
                TRACK PAYMENT STATUS, AND VIEW COMPLETE GRANT HISTORY.
            </p>

            <div className="h-10" />

            {/* Back button */}
            <a
                href="/"
                className="flex items-center justify-center w-[200px] h-[48px] bg-[#0A0A0A] border-2 border-[#3D3D3D] hover:border-[#888888] transition-colors"
            >
                <span className="font-ibm-mono text-[11px] text-[#888888] tracking-[2px]">
                    ← BACK HOME
                </span>
            </a>

            {/* Footer */}
            <div className="absolute bottom-8">
                <span className="font-ibm-mono text-[10px] text-[#333333] tracking-[1px]">
                    GRANTFLOW // ALGORAND TESTNET // STUDENT PORTAL V1
                </span>
            </div>
        </main>
    );
}
