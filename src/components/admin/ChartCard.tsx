"use client";

import React, { useState } from "react";

interface AreaPoint {
  date: string;
  revenue: number;
  profit: number;
  orders: number;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: AreaPoint[];
  lang?: "en" | "ar";
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  data,
  lang = "en",
}) => {
  const [metric, setMetric] = useState<"revenue" | "profit">("revenue");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-5 h-72 flex items-center justify-center">
        <span className="text-xs font-mono text-[var(--ink-secondary)]">No time-series data available</span>
      </div>
    );
  }

  const values = data.map((d) => (metric === "revenue" ? d.revenue : d.profit));
  const maxVal = Math.max(...values, 1000);
  const minVal = 0;
  const height = 180;
  const width = 600;
  const paddingX = 20;
  const paddingY = 20;

  // Generate SVG path points
  const points = data.map((d, i) => {
    const val = metric === "revenue" ? d.revenue : d.profit;
    const x = paddingX + (i / (data.length - 1 || 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
    return { x, y, data: d, val };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height - paddingY} L ${points[0].x.toFixed(1)} ${height - paddingY} Z`;

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--border-hairline)]">
        <div>
          <h3 className="text-sm font-semibold tracking-wider uppercase font-mono text-[var(--ink-primary)]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-mono text-[var(--ink-secondary)] mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="inline-flex border border-[var(--border-hairline)] bg-[var(--bg-secondary)] p-0.5 text-xs font-mono">
          <button
            onClick={() => setMetric("revenue")}
            className={`px-3 py-1 text-[11px] font-medium transition-colors ${
              metric === "revenue"
                ? "bg-[var(--ink-primary)] text-[var(--bg-primary)]"
                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            {lang === "ar" ? "الإيرادات الإجمالية" : "Gross Revenue"}
          </button>
          <button
            onClick={() => setMetric("profit")}
            className={`px-3 py-1 text-[11px] font-medium transition-colors ${
              metric === "profit"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            {lang === "ar" ? "صافي الأرباح" : "Net Profit"}
          </button>
        </div>
      </div>

      {/* SVG Time-Series Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-52 stroke-1"
          preserveAspectRatio="none"
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = height - paddingY - pct * (height - 2 * paddingY);
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="currentColor"
                className="text-[var(--border-hairline)]"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Fill Area Gradient */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={metric === "revenue" ? "var(--ink-primary)" : "var(--accent)"}
                stopOpacity="0.25"
              />
              <stop
                offset="100%"
                stopColor={metric === "revenue" ? "var(--ink-primary)" : "var(--accent)"}
                stopOpacity="0.0"
              />
            </linearGradient>
          </defs>

          <path d={areaD} fill="url(#chartGradient)" />

          {/* Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke={metric === "revenue" ? "var(--ink-primary)" : "var(--accent)"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={hoverIndex === i ? "5" : "3"}
              className={`${
                metric === "revenue" ? "fill-[var(--ink-primary)]" : "fill-[var(--accent)]"
              } cursor-pointer transition-all`}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          ))}
        </svg>

        {/* Hover info tooltip */}
        {hoverIndex !== null && points[hoverIndex] && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-[var(--ink-primary)] text-[var(--bg-primary)] px-3 py-1.5 text-xs font-mono shadow-md pointer-events-none border border-[var(--border-hairline)]"
          >
            <div className="font-semibold">
              {points[hoverIndex].data.date}: {points[hoverIndex].val.toLocaleString()} EGP
            </div>
            <div className="text-[10px] opacity-80">
              {points[hoverIndex].data.orders} orders recorded
            </div>
          </div>
        )}
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between items-center text-[10px] font-mono text-[var(--ink-secondary)] mt-3 pt-2 border-t border-[var(--border-hairline)]">
        <span>{data[0]?.date}</span>
        <span>{data[Math.floor(data.length / 2)]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
};
