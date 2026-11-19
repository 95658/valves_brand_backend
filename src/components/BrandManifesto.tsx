"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";

export const BrandManifesto: React.FC = () => {
  const { t, isRTL } = useStore();

  return (
    <section
      id="materials"
      className="py-20 sm:py-28 border-b border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] transition-colors"
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-block px-2.5 py-0.5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[10px] font-mono tracking-[0.25em] text-[var(--accent)] uppercase mb-4">
            {t("materials.tag")}
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold uppercase tracking-tight leading-tight mb-5">
            {t("materials.title")}
          </h2>
          <p className="text-sm sm:text-base font-light text-[var(--ink-secondary)] leading-relaxed">
            {t("materials.desc")}
          </p>
        </div>

        {/* 2-Column Editorial Contrast Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Column 1: 300 GSM Combed Cotton */}
          <div className="border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-8 sm:p-10 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[var(--border-hairline)] mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase block mb-1">
                    FOUNDATION GRADE // CLASS 01
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
                    {t("materials.c300Title")}
                  </h3>
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[var(--ink-primary)] px-3 py-1 border border-[var(--border-hairline)] bg-[var(--bg-secondary)]">
                  300 <span className="text-xs uppercase font-normal text-[var(--ink-secondary)]">GSM</span>
                </div>
              </div>

              <div className="text-xs font-mono uppercase tracking-wider text-[var(--ink-secondary)] mb-6">
                {t("materials.c300Sub")}
              </div>

              <ul className="space-y-4 text-xs sm:text-sm font-light text-[var(--ink-secondary)] mb-8">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[var(--accent)] text-xs mt-0.5 font-bold">01</span>
                  <span>{t("materials.c300P1")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[var(--accent)] text-xs mt-0.5 font-bold">02</span>
                  <span>{t("materials.c300P2")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[var(--accent)] text-xs mt-0.5 font-bold">03</span>
                  <span>{t("materials.c300P3")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[var(--accent)] text-xs mt-0.5 font-bold">04</span>
                  <span>{t("materials.c300P4")}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-[var(--border-hairline)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-widest">
              <span>APPLICATION: HEAVY BOX TEES</span>
              <span>100% EGYPTIAN COMBED</span>
            </div>
          </div>

          {/* Column 2: 460 GSM Heavyweight French Terry */}
          <div className="border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-8 sm:p-10 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[var(--border-hairline)] mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase block mb-1">
                    HEAVYWEIGHT GRADE // CLASS 02
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
                    {t("materials.c460Title")}
                  </h3>
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[var(--ink-primary)] px-3 py-1 border border-[var(--border-hairline)] bg-[var(--bg-secondary)]">
                  460 <span className="text-xs uppercase font-normal text-[var(--ink-secondary)]">GSM</span>
                </div>
              </div>

              <div className="text-xs font-mono uppercase tracking-wider text-[var(--ink-secondary)] mb-6">
                {t("materials.c460Sub")}
              </div>

              <ul className="space-y-4 text-xs sm:text-sm font-light text-[var(--ink-secondary)] mb-8">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[var(--accent)] text-xs mt-0.5 font-bold">01</span>
                  <span>{t("materials.c460P1")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[var(--accent)] text-xs mt-0.5 font-bold">02</span>
                  <span>{t("materials.c460P2")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[var(--accent)] text-xs mt-0.5 font-bold">03</span>
                  <span>{t("materials.c460P3")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[var(--accent)] text-xs mt-0.5 font-bold">04</span>
                  <span>{t("materials.c460P4")}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-[var(--border-hairline)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-widest">
              <span>APPLICATION: ARCHITECTURAL HOODIES</span>
              <span>100% UNBRUSHED LOOPBACK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandManifesto;
