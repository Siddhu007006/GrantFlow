import SectionHeader from "./SectionHeader";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  bgColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

function StepCard({
  number,
  title,
  description,
  bgColor = "#0A0A0A",
  borderColor = "#2D2D2D",
  borderWidth = 1,
}: StepCardProps) {
  return (
    <div
      className="flex flex-col gap-4 p-8 md:p-[40px] border w-full md:flex-1 md:h-[260px]"
      style={{ backgroundColor: bgColor, borderColor, borderWidth }}
    >
      <span className="font-grotesk text-[48px] font-bold text-[#FFD600] tracking-[-2px]">
        {number}
      </span>
      <h3 className="font-grotesk text-[20px] font-bold text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line">
        {title}
      </h3>
      <p className="font-ibm-mono text-[11px] text-[#555555] tracking-[1px] leading-[1.5]">
        {description}
      </p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="howitworks"
      className="flex flex-col w-full bg-[#0D0D0D] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]"
    >
      <SectionHeader
        label="[02] // HOW IT WORKS"
        title={"FOUR STEPS.\nTRUSTLESS EXECUTION."}
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px] flex-wrap">
        <StepCard
          number="01"
          title={"DEPOSIT\nFUNDS"}
          description="SPONSOR DEPOSITS ALGO INTO THE SMART CONTRACT ESCROW. FUNDS ARE LOCKED AND VERIFIABLE ON-CHAIN."
        />
        <StepCard
          number="02"
          title={"BUILD\nMILESTONES"}
          description="TEAM WORKS ON PROJECT MILESTONES. PROGRESS IS TRACKED AND SUBMITTED FOR REVIEW."
          bgColor="#111111"
          borderColor="#FFD600"
          borderWidth={1}
        />
        <StepCard
          number="03"
          title={"VERIFY &\nAPPROVE"}
          description="SPONSOR REVIEWS COMPLETED WORK AND APPROVES THE MILESTONE VIA A BLOCKCHAIN TRANSACTION."
        />
        <StepCard
          number="04"
          title={"AUTOMATIC\nRELEASE"}
          description="SMART CONTRACT RELEASES PAYMENT TO THE TEAM WALLET AUTOMATICALLY. NO MANUAL TRANSFERS."
          bgColor="#111111"
          borderColor="#4ADE80"
          borderWidth={1}
        />
      </div>
    </section>
  );
}
