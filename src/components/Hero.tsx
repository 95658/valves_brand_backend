"use client";

import React from "react";
import { ArrowDown } from "lucide-react";
import { useStore } from "@/context/StoreContext";

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const { isDark, t } = useStore();

  return (
    <section className="relative min-h-[82vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-[var(--border-hairline)] bg-[var(--bg-primary)]">
      {/* Full-Color Editorial Campaign Backdrop (No Grayscale Filter) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=85"
          alt="VALVES Architectural Streetwear Editorial"
          className={`w-full h-full object-cover object-center transition-all duration-700 ${
            isDark ? "opacity-30 brightness-90" : "opacity-25 contrast-105"
          }`}
        />
        {/* Subtle Atmospheric Gradient Layer */}
        <div
          className={`absolute inset-0 z-10 transition-colors ${
            isDark
              ? "bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/70 to-transparent"
              : "bg-gradient-to-t from-[#EFECE6] via-[#EFECE6]/75 to-transparent"
          }`}
        />
      </div>

      {/* Central Editorial Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        {/* Release Metadata Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--border-hairline)] bg-[var(--bg-elevated)]/90 backdrop-blur-sm mb-8">
          <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--ink-secondary)] uppercase">
            {t("hero.tag")}
          </span>
        </div>

        {/* ONE Bold Architectural Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold uppercase tracking-tight leading-[1.02] text-[var(--ink-primary)] mb-6 select-none">
          {t("hero.title1")}
        </h1>

        {/* 1-Sentence Subtitle about 460 GSM Egyptian cotton */}
        <p className="max-w-2xl text-sm sm:text-base md:text-lg font-light text-[var(--ink-secondary)] leading-relaxed mb-10">
          {t("hero.subtitle")}
        </p>

        {/* ONE Solid --ink-primary CTA */}
        <button
          onClick={onExplore}
          className="group px-8 sm:px-10 py-4 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-[0.25em] border border-[var(--ink-primary)] hover:bg-transparent hover:text-[var(--ink-primary)] transition-all flex items-center gap-3 cursor-pointer"
        >
          <span>{t("hero.cta")}</span>
          <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Minimalist Bottom Hairline Coordinates */}
      <div className="absolute bottom-4 left-6 right-6 z-20 hidden md:flex justify-between items-center text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-[0.2em] pointer-events-none opacity-60">
        <span>VALVES · ATELIER 01</span>
        <span>CAIRO 30°02&apos;N 31°14&apos;E</span>
        <span>460 GSM EGYPTIAN HEAVYWEIGHT</span>
      </div>
    </section>
  );
};

export default Hero;
