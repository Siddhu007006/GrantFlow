"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { label: "HOME", section: "hero", href: "/" },
  { label: "FEATURES", section: "features", href: "/#features" },
  { label: "HOW IT WORKS", section: "howitworks", href: "/#howitworks" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── active section via IntersectionObserver ── */
  useEffect(() => {
    const ids = links.map((l) => l.section).filter(Boolean);
    const obs: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-35% 0px -60% 0px" }
      );
      o.observe(el);
      obs.push(o);
    });

    return () => obs.forEach((o) => o.disconnect());
  }, []);

  return (
    <header className={`fixed z-50 transition-all duration-300 ${scrolled ? "top-4" : "top-6"} left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2`}>
      <nav
        className="flex items-center justify-between px-6 py-3 rounded-full text-[#F5F5F0] transition-all duration-300 w-full md:w-auto"
        style={{
          background: scrolled ? "rgba(15, 15, 15, 0.75)" : "rgba(10, 10, 10, 0.4)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: scrolled ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: scrolled ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "none"
        }}
      >
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-[10px] shrink-0 group md:mr-8">
          <span className="w-[10px] h-[10px] bg-[#FFD600] group-hover:scale-110 transition-transform rounded-full" />
          <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
            GRANTFLOW
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ label, section }) => {
            const isActive = active === section;
            return (
              <button
                key={label}
                onClick={() => scrollTo(section)}
                className="relative overflow-hidden h-4 group font-ibm-mono text-[10px] tracking-[1.5px] cursor-pointer"
                style={{ color: isActive ? "#FFD600" : "#888" }}
              >
                <span className="block group-hover:-translate-y-full transition-transform duration-300">
                  {label}
                </span>
                <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300 text-[#F5F5F0]">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Desktop CTA buttons ── */}
        <div className="hidden md:flex items-center gap-3 ml-12">
          <Link href="/student" className="border border-[#333] hover:bg-[#1A1A1A] hover:border-[#4ADE80] text-[#888] hover:text-[#4ADE80] px-5 py-[10px] rounded-full font-ibm-mono text-[10px] tracking-[1.5px] transition-all duration-300">
            STUDENT
          </Link>
          <Link href="/dashboard" className="nav-light bg-[#111] border border-[#FFD600] text-[#FFD600] hover:bg-[#FFD600] hover:text-[#0A0A0A] px-5 py-[10px] rounded-full font-grotesk font-bold text-[11px] tracking-[1.5px] transition-all duration-300">
            SPONSOR
          </Link>
        </div>

        {/* ── Mobile burger ── */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 ml-4 text-[#888]"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block w-[20px] h-[1.5px] bg-current transition-transform duration-200 origin-center" style={{ transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }} />
          <span className="block w-[20px] h-[1.5px] bg-current transition-opacity duration-200" style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-[20px] h-[1.5px] bg-current transition-transform duration-200 origin-center" style={{ transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
        </button>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 mt-2 mx-auto rounded-2xl w-full"
        style={{
          maxHeight: menuOpen ? "400px" : "0px",
          background: "rgba(15, 15, 15, 0.95)",
          backdropFilter: "blur(14px)",
          border: menuOpen ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
        }}
      >
        <div className="flex flex-col px-6 py-5 gap-0">
          {links.map(({ label, section }) => {
            const isActive = active === section;
            return (
              <button
                key={label}
                onClick={() => { scrollTo(section); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full font-ibm-mono text-[12px] tracking-[2px] py-[14px] border-b border-[#222] transition-colors bg-transparent border-x-0 border-t-0 cursor-pointer"
                style={{ color: isActive ? "#FFD600" : "#888" }}
              >
                <span className="w-[4px] h-[4px] rounded-full shrink-0 transition-colors" style={{ background: isActive ? "#FFD600" : "#333" }} />
                {label}
              </button>
            );
          })}

          {/* Mobile CTA */}
          <div className="flex flex-col gap-3 pt-5 mt-2">
            <Link
              href="/student"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center border border-[#333] hover:bg-[#1A1A1A] hover:border-[#4ADE80] text-[#888] hover:text-[#4ADE80] px-5 py-[12px] rounded-full font-ibm-mono text-[11px] tracking-[1.5px] transition-all duration-300"
            >
              STUDENT PORTAL
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="nav-light w-full text-center bg-[#111] border border-[#FFD600] text-[#FFD600] hover:bg-[#FFD600] hover:text-[#0A0A0A] px-5 py-[12px] rounded-full font-grotesk font-bold text-[12px] tracking-[1.5px] transition-all duration-300"
            >
              SPONSOR DASHBOARD
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
