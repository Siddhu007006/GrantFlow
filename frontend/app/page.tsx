import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PixelDivider from "@/components/PixelDivider";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[60px]">
      <Navbar />
      <Hero />
      <PixelDivider />
      <Features />
      <HowItWorks />
      <Stats />
      <FinalCTA />
      <Footer />
    </main>
  );
}
