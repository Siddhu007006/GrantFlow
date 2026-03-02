import SectionHeader from "./SectionHeader";

interface FeatureCardProps {
  iconColor: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  bgColor?: string;
  borderColor?: string;
}

function FeatureCard({
  iconColor,
  title,
  description,
  tag,
  tagColor,
  bgColor = "#111111",
  borderColor = "#2D2D2D",
}: FeatureCardProps) {
  return (
    <div
      className="flex flex-col gap-5 p-8 md:p-[32px] border w-full md:flex-1 md:h-[320px]"
      style={{ backgroundColor: bgColor, borderColor }}
    >
      <div className="w-[40px] h-[40px] shrink-0" style={{ backgroundColor: iconColor }} />
      <h3 className="font-grotesk text-[18px] font-bold text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line">
        {title}
      </h3>
      <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[1px] leading-[1.6]">
        {description}
      </p>
      <div
        className="flex items-center justify-center h-[28px] px-[12px] bg-[#1A1A1A] border w-fit"
        style={{ borderColor: tagColor }}
      >
        <span className="font-ibm-mono text-[11px] tracking-[2px]" style={{ color: tagColor }}>
          {tag}
        </span>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      className="flex flex-col w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]"
    >
      <SectionHeader
        label="[01] // FEATURES"
        title={"WHY BLOCKCHAIN\nGRANT ESCROW?"}
        subtitle="PROGRAMMABLE PAYMENTS. VERIFIABLE TRANSPARENCY. ZERO TRUST REQUIRED."
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px] flex-wrap">
        <FeatureCard
          iconColor="#FFD600"
          title={"SMART CONTRACT\nESCROW"}
          description="FUNDS ARE LOCKED ON-CHAIN AND CANNOT BE ACCESSED UNTIL MILESTONE CONDITIONS ARE SATISFIED."
          tag="ESCROW"
          tagColor="#FFD600"
          borderColor="#FFD600"
        />
        <FeatureCard
          iconColor="#FF6B35"
          title={"CONDITIONAL\nPAYMENTS"}
          description="SPONSORS APPROVE COMPLETED WORK, TRIGGERING AUTOMATIC RELEASE OF FUNDS WITHOUT MANUAL TRANSFERS."
          tag="AUTOMATED"
          tagColor="#FF6B35"
          bgColor="#0F0F0F"
          borderColor="#FF6B35"
        />
        <FeatureCard
          iconColor="#4ADE80"
          title={"PUBLIC\nTRANSPARENCY"}
          description="ALL FUNDING, APPROVALS, AND PAYMENTS ARE PERMANENTLY RECORDED ON BLOCKCHAIN FOR VERIFICATION."
          tag="ON-CHAIN"
          tagColor="#4ADE80"
          borderColor="#4ADE80"
        />
        <FeatureCard
          iconColor="#60A5FA"
          title={"POWERED BY\nALGORAND"}
          description="FAST FINALITY, HIGH SECURITY, AND LOW FEES ENABLE REAL-TIME GRANT DISTRIBUTION."
          tag="ALGORAND"
          tagColor="#60A5FA"
          bgColor="#0F0F0F"
          borderColor="#60A5FA"
        />
      </div>
    </section>
  );
}
