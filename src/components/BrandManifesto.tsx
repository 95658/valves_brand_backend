"use client";

import React from "react";
import { Layers, Flame, Wind, Shield } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export const BrandManifesto: React.FC = () => {
  const { isDark, t } = useStore();

  return (
    <section
      id="manifesto"
      className={`py-24 border-b relative overflow-hidden transition-colors ${
        isDark ? "bg-[#09090b] border-zinc-800" : "bg-white border-zinc-200"
      }`}
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Upper Manifesto Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-space font-bold tracking-[0.25em] text-volt uppercase mb-3">
            {t("manifesto.tag")}
          </div>
          <h2 className="text-3xl sm:text-5xl font-space font-extrabold tracking-tight uppercase leading-tight mb-6">
            <span>{t("manifesto.title1")}</span><br />
            <span>{t("manifesto.title2")}</span>
          </h2>
          <p className={`text-base sm:text-lg font-light leading-relaxed ${
            isDark ? "text-zinc-400" : "text-zinc-600"
          }`}>
            {t("manifesto.desc")}
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-6 sm:p-7 border flex flex-col justify-between transition-colors ${
            isDark ? "bg-[#141417] border-zinc-800" : "bg-zinc-50 border-zinc-200 shadow-sm"
          }`}>
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-volt mb-6 ${
              isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-300"
            }`}>
              <Layers size={20} />
            </div>
            <div>
              <h3 className="font-space font-bold text-base tracking-wider uppercase mb-2">
                {t("manifesto.pillar1Title")}
              </h3>
              <p className={`text-xs font-light leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {t("manifesto.pillar1Desc")}
              </p>
            </div>
          </div>

          <div className={`p-6 sm:p-7 border flex flex-col justify-between transition-colors ${
            isDark ? "bg-[#141417] border-zinc-800" : "bg-zinc-50 border-zinc-200 shadow-sm"
          }`}>
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-volt mb-6 ${
              isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-300"
            }`}>
              <Wind size={20} />
            </div>
            <div>
              <h3 className="font-space font-bold text-base tracking-wider uppercase mb-2">
                {t("manifesto.pillar2Title")}
              </h3>
              <p className={`text-xs font-light leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {t("manifesto.pillar2Desc")}
              </p>
            </div>
          </div>

          <div className={`p-6 sm:p-7 border flex flex-col justify-between transition-colors ${
            isDark ? "bg-[#141417] border-zinc-800" : "bg-zinc-50 border-zinc-200 shadow-sm"
          }`}>
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-volt mb-6 ${
              isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-300"
            }`}>
              <Flame size={20} />
            </div>
            <div>
              <h3 className="font-space font-bold text-base tracking-wider uppercase mb-2">
                {t("manifesto.pillar3Title")}
              </h3>
              <p className={`text-xs font-light leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {t("manifesto.pillar3Desc")}
              </p>
            </div>
          </div>

          <div className={`p-6 sm:p-7 border flex flex-col justify-between transition-colors ${
            isDark ? "bg-[#141417] border-zinc-800" : "bg-zinc-50 border-zinc-200 shadow-sm"
          }`}>
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-volt mb-6 ${
              isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-300"
            }`}>
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-space font-bold text-base tracking-wider uppercase mb-2">
                {t("manifesto.pillar4Title")}
              </h3>
              <p className={`text-xs font-light leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {t("manifesto.pillar4Desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
