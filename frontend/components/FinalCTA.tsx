"use client";

import GlitchText from "@/components/GlitchText";

export default function FinalCTA() {
  return (
    <section className="flex flex-col items-center w-full bg-[#0A0A0A] py-16 px-6 md:p-[120px] gap-10 md:gap-[48px] border-t-2 border-t-[#FFD600]">
      {/* Badge */}
      <div className="flex items-center justify-center gap-[8px] h-[32px] px-[16px] bg-[#1A1A1A] border-2 border-[#FFD600]">
        <span className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px]">
          <GlitchText text="[READY TO FUND?]" speed={30} />
        </span>
      </div>

      {/* Title */}
      <h2 className="font-grotesk text-[44px] md:text-[80px] font-bold text-[#F5F5F0] tracking-[-2px] leading-none text-center w-full max-w-[1000px] whitespace-pre-line">
        <GlitchText text={"TRANSPARENT FUNDING.\nON-CHAIN TRUST."} speed={40} delay={200} />
      </h2>

      {/* Subtitle */}
      <p className="font-ibm-mono text-[10px] md:text-[14px] text-[#666666] tracking-[0.5px] md:tracking-[2px] text-center text-pretty w-full max-w-[700px] px-2">
        <GlitchText text="ENSURING ACCOUNTABILITY FOR BOTH SPONSORS AND RECIPIENTS." speed={20} delay={450} />
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-[16px] w-full sm:w-auto">
        <a href="/dashboard" className="nav-light flex items-center justify-center w-full sm:w-[260px] h-[64px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors">
          <span className="font-grotesk text-[13px] font-bold text-[#0A0A0A] tracking-[2px]">
            SPONSOR
          </span>
        </a>
        <a href="/student" className="nav-light-white flex items-center justify-center w-full sm:w-[220px] h-[64px] bg-[#0A0A0A] border-2 border-[#4ADE80] hover:border-[#6EE7A0] transition-colors">
          <span className="font-ibm-mono text-[12px] text-[#4ADE80] tracking-[2px]">
            STUDENT
          </span>
        </a>
      </div>
    </section>
  );
}
