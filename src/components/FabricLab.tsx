"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Sliders, Sparkles, ShieldCheck, Wind, Layers } from "lucide-react";

export const FabricLab: React.FC = () => {
  const { lang, isRTL, t } = useStore();
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const [activeTab, setActiveTab] = useState<"compare" | "300gsm" | "460gsm">("compare");

  return (
    <section
      id="materials"
      className="py-20 sm:py-28 border-b border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] transition-colors overflow-hidden"
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[var(--border-hairline)]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[10px] font-mono tracking-[0.25em] text-[var(--accent)] uppercase mb-3">
              <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
              <span>{lang === "ar" ? "معمل الأقمشة والمعايير // مصانع القاهرة" : "FABRIC LABORATORY // CAIRO MILLS"}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold uppercase tracking-tight leading-tight">
              {lang === "ar" ? "مقارنة الأقمشة: 460 GSM ضد 300 GSM" : "460 GSM VS 300 GSM CAIRO COTTON"}
            </h2>
            <p className="text-sm sm:text-base font-light text-[var(--ink-secondary)] max-w-2xl mt-2 leading-relaxed">
              {lang === "ar"
                ? "نرفض تماماً الألياف الصناعية والحشو البلاستيكي. نغزل كل ياردة في مصانعنا المصرية من قطن طويل التيلة فائق النقاء بهيكل معماري متماسك."
                : "Zero synthetic fillers. Milled in Cairo from pure long-staple Egyptian cotton yarn, calibrated for architectural drape, kinetic longevity, and heavyweight structure."}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] text-xs font-mono">
            <button
              onClick={() => setActiveTab("compare")}
              className={`px-3 py-1.5 uppercase font-bold transition-colors ${
                activeTab === "compare"
                  ? "bg-[var(--ink-primary)] text-[var(--bg-primary)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              {lang === "ar" ? "مقارنة تفاعلية" : "Interactive Split"}
            </button>
            <button
              onClick={() => setActiveTab("300gsm")}
              className={`px-3 py-1.5 uppercase font-bold transition-colors ${
                activeTab === "300gsm"
                  ? "bg-[var(--ink-primary)] text-[var(--bg-primary)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              300 GSM
            </button>
            <button
              onClick={() => setActiveTab("460gsm")}
              className={`px-3 py-1.5 uppercase font-bold transition-colors ${
                activeTab === "460gsm"
                  ? "bg-[var(--ink-primary)] text-[var(--bg-primary)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              460 GSM
            </button>
          </div>
        </div>

        {/* ----------------- INTERACTIVE SPLIT SLIDER ----------------- */}
        {activeTab === "compare" && (
          <div className="border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-4 sm:p-8 mb-12">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-secondary)] select-none">
              {/* Left Image: 300 GSM Jersey Texture */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=85"
                  alt="300 GSM Egyptian Combed Cotton Texture"
                  className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                  style={{ width: "100%", minWidth: "800px" }}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-[var(--bg-elevated)]/90 backdrop-blur-md px-3 py-1.5 border border-[var(--border-hairline)] font-mono text-xs">
                  <span className="font-bold text-[var(--ink-primary)]">300 GSM</span>
                  <span className="text-[10px] text-[var(--ink-secondary)] block">COMBED SINGLE JERSEY</span>
                </div>
              </div>

              {/* Right Image: 460 GSM French Terry Texture */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ left: `${sliderPos}%`, width: `${100 - sliderPos}%` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1600&q=85"
                  alt="460 GSM Heavy French Terry Texture"
                  className="absolute inset-0 w-full h-full object-cover object-center max-w-none -translate-x-[50%]"
                  style={{ width: "100%", minWidth: "800px" }}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-[var(--bg-elevated)]/90 backdrop-blur-md px-3 py-1.5 border border-[var(--border-hairline)] font-mono text-xs text-right">
                  <span className="font-bold text-[var(--accent)]">460 GSM</span>
                  <span className="text-[10px] text-[var(--ink-secondary)] block">HEAVY BRUSHED TERRY</span>
                </div>
              </div>

              {/* Center Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[var(--ink-primary)] pointer-events-none z-10"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[var(--ink-primary)] text-[var(--bg-primary)] flex items-center justify-center font-mono text-[10px] font-bold shadow-lg">
                  ⇄
                </div>
              </div>

              {/* Slider Input Handle */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Fabric weight compare slider"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--ink-secondary)] mt-3">
              <span>← DRAG TO REVEAL 300 GSM</span>
              <span>DRAG TO REVEAL 460 GSM →</span>
            </div>
          </div>
        )}

        {/* ----------------- SPEC MATRIX CARDS ----------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* 300 GSM CARD */}
          <div
            className={`border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 sm:p-8 flex flex-col justify-between transition-all ${
              activeTab === "300gsm" ? "ring-2 ring-[var(--ink-primary)]" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] font-bold block mb-1">
                    FOUNDATION GRADE // CLASS 01
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-extrabold uppercase">
                    {lang === "ar" ? "300 جرام: قطن مصري مُمشّط" : "300 GSM COMBED COTTON"}
                  </h3>
                </div>
                <div className="px-3 py-1 font-mono text-xl font-bold border border-[var(--border-hairline)] bg-[var(--bg-secondary)]">
                  300 GSM
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs mb-8">
                <div className="flex justify-between py-1.5 border-b border-[var(--border-hairline)]">
                  <span className="text-[var(--ink-secondary)]">{lang === "ar" ? "نوع الغزل:" : "YARN TYPE:"}</span>
                  <span className="font-bold">{lang === "ar" ? "قطن مصري ناعم 100%" : "100% Long-Staple Egyptian Cotton"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border-hairline)]">
                  <span className="text-[var(--ink-secondary)]">{lang === "ar" ? "مؤشر النفاذية:" : "BREATHABILITY:"}</span>
                  <span className="font-bold text-[var(--status-success)]">{lang === "ar" ? "عالي جداً (نهاري وصيفي)" : "High Aero-Flow (Hot Weather Calibrated)"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border-hairline)]">
                  <span className="text-[var(--ink-secondary)]">{lang === "ar" ? "هيكل القصة:" : "SILHOUETTE STRUCTURE:"}</span>
                  <span className="font-bold">{lang === "ar" ? "قصة صندوقية واسعة لا تلتصق" : "Tailored Box Cut, Non-Clinging Drape"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border-hairline)]">
                  <span className="text-[var(--ink-secondary)]">{lang === "ar" ? "الياقة:" : "COLLAR SPEC:"}</span>
                  <span className="font-bold">{lang === "ar" ? "ياقة مضلعة 3 سم لا تتمدد" : "3cm High-Retention Heavy Ribbed Crew"}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] text-[11px] font-mono text-[var(--ink-secondary)]">
              {lang === "ar"
                ? "مثالي للتيشيرتات الصندوقية الأساسية (Monogram Box Tee) في طقس القاهرة الحار وأمسيات الربيع."
                : "Engineered specifically for everyday essential Box Tees through daytime heat and mild evening wear."}
            </div>
          </div>

          {/* 460 GSM CARD */}
          <div
            className={`border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 sm:p-8 flex flex-col justify-between transition-all ${
              activeTab === "460gsm" ? "ring-2 ring-[var(--accent)]" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] font-bold block mb-1">
                    HEAVYWEIGHT GRADE // CLASS 02
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-extrabold uppercase">
                    {lang === "ar" ? "460 جرام: فرينش تيري معماري" : "460 GSM HEAVY FRENCH TERRY"}
                  </h3>
                </div>
                <div className="px-3 py-1 font-mono text-xl font-bold border border-[var(--border-hairline)] bg-[var(--bg-secondary)] text-[var(--accent)]">
                  460 GSM
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs mb-8">
                <div className="flex justify-between py-1.5 border-b border-[var(--border-hairline)]">
                  <span className="text-[var(--ink-secondary)]">{lang === "ar" ? "نوع الغزل:" : "YARN TYPE:"}</span>
                  <span className="font-bold">{lang === "ar" ? "فرينش تيري مُمشّط عالي الكثافة" : "Heavy Brushed Loopback Terry"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border-hairline)]">
                  <span className="text-[var(--ink-secondary)]">{lang === "ar" ? "هيكل القلنسوة:" : "HOOD CONSTRUCTION:"}</span>
                  <span className="font-bold">{lang === "ar" ? "طبقة مزدوجة تقف بمفردها" : "Double-Layer Standalone Sculpted Hood"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border-hairline)]">
                  <span className="text-[var(--ink-secondary)]">{lang === "ar" ? "معالجة القماش:" : "FINISHING:"}</span>
                  <span className="font-bold text-[var(--accent)]">{lang === "ar" ? "معالجة مسبقة ضد الانكماش" : "Pre-Shrunk Vintage Bio-Wash"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border-hairline)]">
                  <span className="text-[var(--ink-secondary)]">{lang === "ar" ? "الوزن الحراري:" : "THERMAL DENSITY:"}</span>
                  <span className="font-bold">{lang === "ar" ? "ثقيل شتوي يحافظ على شكله" : "Extreme Thermal Mass, Architectural Drop"}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] text-[11px] font-mono text-[var(--ink-secondary)]">
              {lang === "ar"
                ? "العمود الفقري لمجموعة الهوديز المعمارية (Kinetic Oversized Hoodie) مع كتف ساقط وأطراف سيليكونية."
                : "The sculptural backbone of the Kinetic Oversized Hoodie series, delivering monumental drape without sag."}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
