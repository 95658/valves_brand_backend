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
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-3 sm:p-3.5 flex flex-col justify-between hover:border-[var(--ink-secondary)] transition-colors min-w-0 overflow-hidden">
      <div>
        <div className="flex items-start justify-between gap-1 mb-2">
          <span
            className="text-[9.5px] sm:text-[10px] tracking-wider uppercase font-mono text-[var(--ink-secondary)] font-medium leading-tight truncate block max-w-[70%]"
            title={label}
          >
            {label}
          </span>
          {change !== undefined && (
            <div className={`flex items-center gap-0.5 text-[10px] sm:text-[11px] font-mono font-semibold shrink-0 ${trendColor}`}>
              {isPositive && <ArrowUpRight className="w-3 h-3" />}
              {isNegative && <ArrowDownRight className="w-3 h-3" />}
              {isNeutral && <Minus className="w-2.5 h-2.5" />}
              <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
          {prefix && <span className="text-xs font-mono text-[var(--ink-secondary)]">{prefix}</span>}
          <div
            className="text-lg sm:text-xl lg:text-2xl font-mono font-bold tracking-tight text-[var(--ink-primary)] leading-tight truncate"
            title={typeof value === "number" ? value.toLocaleString("en-US") : String(value)}
          >
            {typeof value === "number" ? value.toLocaleString("en-US") : value}
          </div>
          {isCurrency && (
            <span className="text-[10px] sm:text-xs font-mono font-medium text-[var(--ink-secondary)] uppercase tracking-wider shrink-0 select-none">
              EGP
            </span>
          )}
          {suffix && <span className="text-[10px] sm:text-xs font-mono text-[var(--ink-secondary)] shrink-0">{suffix}</span>}
        </div>
      </div>

      {(subvalue || helper) && (
        <div className="mt-2.5 pt-2 border-t border-[var(--border-hairline)] flex items-center justify-between text-[10px] sm:text-[11px] text-[var(--ink-secondary)] font-mono min-w-0">
          <span className="truncate">{subvalue || helper}</span>
        </div>
      )}
    </div>
  );
};
