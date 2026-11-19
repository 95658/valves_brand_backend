"use client";

import React from "react";
import { X } from "lucide-react";
import { useStore } from "@/context/StoreContext";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const { isDark, isRTL, t } = useStore();

  if (!isOpen) return null;

  const measurements = [
    { size: "S", chest: "116", length: "72", shoulder: "54" },
    { size: "M", chest: "122", length: "74", shoulder: "56" },
    { size: "L", chest: "128", length: "76", shoulder: "58" },
    { size: "XL", chest: "134", length: "78", shoulder: "60" },
    { size: "XXL", chest: "140", length: "80", shoulder: "62" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className={`relative w-full max-w-xl border p-6 sm:p-8 bg-[var(--bg-elevated)] border-[var(--border-hairline)] text-[var(--ink-primary)] shadow-2xl`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[var(--border-hairline)] mb-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase block mb-1">
              VALVES ATELIER // SPEC 01
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold uppercase tracking-tight">
              {t("sizeGuide.title")}
            </h3>
            <p className="text-xs text-[var(--ink-secondary)] mt-1 font-light">
              {t("sizeGuide.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-primary)] transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left rtl:text-right text-xs border border-[var(--border-hairline)]">
            <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-hairline)] text-[10px] font-mono uppercase tracking-widest text-[var(--ink-secondary)]">
              <tr>
                <th className="py-3 px-4">{t("sizeGuide.size")}</th>
                <th className="py-3 px-4">{t("sizeGuide.chest")} (CM)</th>
                <th className="py-3 px-4">{t("sizeGuide.length")} (CM)</th>
                <th className="py-3 px-4">{t("sizeGuide.shoulder")} (CM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)] font-mono">
              {measurements.map((row) => (
                <tr key={row.size} className="hover:bg-[var(--bg-secondary)]/50 transition">
                  <td className="py-3 px-4 font-bold text-[var(--ink-primary)]">{row.size}</td>
                  <td className="py-3 px-4 text-[var(--ink-secondary)]">{row.chest}</td>
                  <td className="py-3 px-4 text-[var(--ink-secondary)]">{row.length}</td>
                  <td className="py-3 px-4 text-[var(--ink-secondary)]">{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 border border-[var(--border-hairline)] bg-[var(--bg-secondary)]/50 text-[11px] text-[var(--ink-secondary)] leading-relaxed mb-6 font-light">
          {isRTL ? (
            <span>
              جميع قطع فالفز مصممة بقصة بوكسي معمارية عريضة (Boxy Architectural Fit). إذا كنت تفضل قصة محكمة، ننصح باختيار مقاس أصغر بدرجة واحدة.
            </span>
          ) : (
            <span>
              All VALVES garments feature a tailored boxy drop-shoulder silhouette. For a standard closer fit, we recommend sizing down one size.
            </span>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-mono uppercase tracking-widest bg-[var(--ink-primary)] text-[var(--bg-primary)] hover:opacity-90 transition"
          >
            {t("sizeGuide.close")}
          </button>
        </div>
      </div>
    </div>
  );
};
