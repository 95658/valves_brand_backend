"use client";

import React from "react";
import { Calendar } from "lucide-react";

export type DateRangeOption = "Today" | "7D" | "30D" | "90D" | "Custom";

interface DateRangePickerProps {
  value: DateRangeOption;
  onChange: (value: DateRangeOption) => void;
  lang?: "en" | "ar";
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  lang = "en",
}) => {
  const options: { labelEn: string; labelAr: string; value: DateRangeOption }[] = [
    { labelEn: "Today", labelAr: "اليوم", value: "Today" },
    { labelEn: "7D", labelAr: "7 أيام", value: "7D" },
    { labelEn: "30D", labelAr: "30 يوم", value: "30D" },
    { labelEn: "90D", labelAr: "90 يوم", value: "90D" },
  ];

  return (
    <div className="inline-flex items-center border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-0.5 text-xs font-mono">
      <div className="px-2 py-1 text-[var(--ink-secondary)] flex items-center gap-1 border-r border-[var(--border-hairline)]">
        <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
      </div>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 text-[11px] transition-colors ${
            value === opt.value
              ? "bg-[var(--ink-primary)] text-[var(--bg-primary)] font-semibold"
              : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          {lang === "ar" ? opt.labelAr : opt.labelEn}
        </button>
      ))}
    </div>
  );
};
