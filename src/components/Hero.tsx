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
    <section className={`relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b transition-colors ${
      isDark ? "border-zinc-800" : "border-zinc-200"
    }`}>
      {/* Background with Ambient Gradients */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 z-10 ${
          isDark
            ? "bg-gradient-to-t from-[#09090b] via-[#09090b]/75 to-transparent"
            : "bg-gradient-to-t from-zinc-50 via-zinc-50/80 to-transparent"
        }`} />
        <img
          src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=85"
          alt="VALVES Streetwear Campaign"
          className={`w-full h-full object-cover object-center filter grayscale contrast-125 transform scale-105 transition-all duration-1000 ${
            isDark ? "opacity-35" : "opacity-20"
          }`}
        />
      </div>

      {/* Grid Overlay Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Central Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
        {/* Release Pill */}
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-6 backdrop-blur-md transition-colors ${
          isDark
            ? "bg-zinc-900/90 border-zinc-700/80 text-zinc-300"
            : "bg-white/90 border-zinc-300 text-zinc-700 shadow-sm"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-volt shadow-[0_0_8px_#d4ff00]" />
          <span className="text-[11px] font-space font-semibold tracking-[0.2em] uppercase">
            {t("hero.tag")}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-space font-extrabold tracking-tight uppercase leading-[1.08] mb-6">
          <span>{t("hero.title1")}</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 via-zinc-600 to-zinc-900 dark:from-zinc-100 dark:via-zinc-400 dark:to-zinc-600">
            {t("hero.title2")}
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`max-w-2xl text-base sm:text-lg font-light mb-10 leading-relaxed ${
          isDark ? "text-zinc-400" : "text-zinc-600"
        }`}>
          {t("hero.subtitle")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-4 bg-volt text-black font-space font-bold text-xs tracking-[0.2em] uppercase rounded-none hover:bg-[#b8e600] transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(212,255,0,0.25)]"
          >
            <span>{t("hero.shopBtn")}</span>
            <ArrowDown size={16} />
          </button>

          <a
            href="#manifesto"
            className={`w-full sm:w-auto px-8 py-4 bg-transparent border font-space font-semibold text-xs tracking-[0.2em] uppercase transition flex items-center justify-center gap-2 ${
              isDark
                ? "border-zinc-700 text-white hover:bg-zinc-900"
                : "border-zinc-300 text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <span>{t("hero.brandArchive")}</span>
          </a>
        </div>
      </div>

      {/* Floating Bottom Metadata */}
      <div className={`absolute bottom-6 left-6 right-6 z-20 hidden md:flex justify-between items-center text-[10px] font-mono tracking-widest uppercase pointer-events-none ${
        isDark ? "text-zinc-500" : "text-zinc-400"
      }`}>
        <div>{t("hero.apparelArch")}</div>
        <div>{t("hero.coords")}</div>
        <div>{t("hero.gsmRange")}</div>
      </div>
    </section>
  );
};
