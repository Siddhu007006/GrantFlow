import Link from "next/link";

export default function TransparencyHeader() {
  return (
    <header className="flex flex-col w-full bg-[#0F0F0F] border-b border-[#2D2D2D]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-[48px] py-5 max-w-[1400px] mx-auto w-full">
        {/* Left: Logo + Title */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-[10px] shrink-0 group">
              <span className="w-[10px] h-[10px] bg-[#FFD600] group-hover:scale-110 transition-transform" />
              <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
                GRANTFLOW
              </span>
            </Link>
            <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[1px]">/</span>
            <span className="font-ibm-mono text-[10px] text-[#4ADE80] tracking-[1.5px] font-bold">
              TRANSPARENCY
            </span>
          </div>
          <h1 className="font-grotesk text-[28px] md:text-[36px] font-bold text-[#F5F5F0] tracking-[-1px] leading-none">
            Public Transparency View
          </h1>
          <p className="font-ibm-mono text-[11px] text-[#888888] tracking-[0.5px] leading-[1.6] max-w-[500px]">
            Read-only public view of the grant escrow contract state on Algorand TestNet.
            All data is on-chain and verifiable.
          </p>
        </div>

        {/* Right: Network badge */}
        <div className="flex items-center gap-2 h-[32px] px-3 bg-[#1A1A1A] border border-[#2D2D2D]">
          <span className="w-[6px] h-[6px] rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="font-ibm-mono text-[10px] text-[#4ADE80] tracking-[1.5px]">
            ALGORAND TESTNET
          </span>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-6 px-6 md:px-[48px] py-3 max-w-[1400px] mx-auto w-full border-t border-[#1D1D1D]">
        <Link
          href="/"
          className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px] hover:text-[#F5F5F0] transition-colors"
        >
          HOME
        </Link>
        <Link
          href="/dashboard"
          className="font-ibm-mono text-[10px] text-[#555555] tracking-[1.5px] hover:text-[#F5F5F0] transition-colors"
        >
          DASHBOARD
        </Link>
        <Link
          href="/transparency"
          className="font-ibm-mono text-[10px] text-[#4ADE80] tracking-[1.5px]"
        >
          TRANSPARENCY
        </Link>
      </div>
    </header>
  );
}
