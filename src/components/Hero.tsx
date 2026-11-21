"use client";

import React, { useState } from "react";
import { ArrowDown, Sparkles, Plus, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";

interface HeroProps {
  onExplore: () => void;
  onSelectProductById?: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onSelectProductById }) => {
  const { isDark, t, lang } = useStore();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[var(--border-hairline)] bg-[var(--bg-primary)]">
      {/* Full-Bleed Editorial Campaign Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2200&q=85"
          alt="VALVES Architectural Streetwear Editorial"
          className={`w-full h-full object-cover object-center transition-all duration-1000 ${
            isDark ? "opacity-35 brightness-95" : "opacity-30 contrast-105"
          }`}
        />
        {/* Subtle Atmospheric Gradient */}
        <div
          className={`absolute inset-0 z-10 transition-colors ${
            isDark
              ? "bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/70 to-[#0D0E10]/40"
              : "bg-gradient-to-t from-[#EFECE6] via-[#EFECE6]/75 to-[#EFECE6]/40"
          }`}
        />
      </div>

      {/* Interactive Editorial Hotspot 1 (Hoodie) */}
      <div className="absolute top-[38%] left-[24%] sm:left-[28%] z-20 hidden md:block">
        <div className="relative group">
          <button
            onClick={() => onSelectProductById?.("v-stw-01")}
            className="w-7 h-7 rounded-full bg-[var(--bg-primary)]/90 border border-[var(--ink-primary)] flex items-center justify-center text-[var(--ink-primary)] shadow-lg hover:scale-110 transition-transform"
            aria-label="Shop Kinetic Oversized Hoodie"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping absolute" />
            <Plus className="w-3.5 h-3.5 relative z-10" />
          </button>
          <div className="absolute left-9 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-elevated)]/95 backdrop-blur-md px-3 py-1.5 border border-[var(--border-hairline)] text-[10px] font-mono whitespace-nowrap shadow-xl pointer-events-none">
            <div className="font-bold uppercase text-[var(--ink-primary)]">KINETIC OVERSIZED HOODIE</div>
            <div className="text-[var(--accent)]">460 GSM · 1,850 EGP</div>
          </div>
        </div>
      </div>

      {/* Interactive Editorial Hotspot 2 (Cargo) */}
      <div className="absolute top-[68%] right-[26%] sm:right-[32%] z-20 hidden md:block">
        <div className="relative group">
          <button
            onClick={() => onSelectProductById?.("v-stw-02")}
            className="w-7 h-7 rounded-full bg-[var(--bg-primary)]/90 border border-[var(--ink-primary)] flex items-center justify-center text-[var(--ink-primary)] shadow-lg hover:scale-110 transition-transform"
            aria-label="Shop Valve Modular Cargo Pant"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping absolute" />
            <Plus className="w-3.5 h-3.5 relative z-10" />
          </button>
          <div className="absolute right-9 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-elevated)]/95 backdrop-blur-md px-3 py-1.5 border border-[var(--border-hairline)] text-[10px] font-mono whitespace-nowrap shadow-xl pointer-events-none">
            <div className="font-bold uppercase text-[var(--ink-primary)]">VALVE MODULAR CARGO</div>
            <div className="text-[var(--accent)]">320 GSM RIPSTOP · 2,100 EGP</div>
          </div>
        </div>
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

        {/* CTA Stack */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onExplore}
            className="group px-8 sm:px-10 py-4 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-[0.25em] border border-[var(--ink-primary)] hover:bg-transparent hover:text-[var(--ink-primary)] transition-all flex items-center gap-3 cursor-pointer"
          >
            <span>{t("hero.cta")}</span>
            <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
          </button>

          <a
            href="#materials"
            className="px-6 py-4 text-xs font-mono uppercase tracking-[0.2em] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors border border-transparent hover:border-[var(--border-hairline)]"
          >
            {lang === "ar" ? "معمل الأقمشة (460 GSM) ←" : "460 GSM FABRIC LAB →"}
          </a>
        </div>
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
