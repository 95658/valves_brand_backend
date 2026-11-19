import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  subvalue?: string;
  change?: number; // e.g. +14.2% or -3.1%
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
  indicator?: "neutral" | "positive" | "negative";
  helper?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subvalue,
  change,
  isCurrency = false,
  prefix = "",
  suffix = "",
  indicator,
  helper,
}) => {
  const isPositive = change !== undefined ? change > 0 : false;
  const isNegative = change !== undefined ? change < 0 : false;
  const isNeutral = change === 0 || change === undefined;

  let trendColor = "text-[var(--ink-secondary)]";
  if (indicator === "positive" || (indicator === undefined && isPositive)) {
    trendColor = "text-[var(--status-success)]";
  } else if (indicator === "negative" || (indicator === undefined && isNegative)) {
    trendColor = "text-[var(--status-danger)]";
  }

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-4 flex flex-col justify-between hover:border-[var(--ink-secondary)] transition-colors">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] tracking-widest uppercase font-mono text-[var(--ink-secondary)] font-medium">
            {label}
          </span>
          {change !== undefined && (
            <div className={`flex items-center gap-0.5 text-[11px] font-mono font-semibold ${trendColor}`}>
              {isPositive && <ArrowUpRight className="w-3.5 h-3.5" />}
              {isNegative && <ArrowDownRight className="w-3.5 h-3.5" />}
              {isNeutral && <Minus className="w-3 h-3" />}
              <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1.5">
          {prefix && <span className="text-sm font-mono text-[var(--ink-secondary)]">{prefix}</span>}
          <div className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-[var(--ink-primary)]">
            {typeof value === "number" ? value.toLocaleString("en-US") : value}
          </div>
          {isCurrency && <span className="text-xs font-mono text-[var(--ink-secondary)]">EGP</span>}
          {suffix && <span className="text-xs font-mono text-[var(--ink-secondary)]">{suffix}</span>}
        </div>
      </div>

      {(subvalue || helper) && (
        <div className="mt-3 pt-2.5 border-t border-[var(--border-hairline)] flex items-center justify-between text-[11px] text-[var(--ink-secondary)] font-mono">
          <span>{subvalue || helper}</span>
        </div>
      )}
    </div>
  );
};
