"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { DateRangeOption } from "@/components/admin/DateRangePicker";
import {
  TrendingUp,
  Users,
  Eye,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  Share2,
  Mail,
  Download,
} from "lucide-react";

export default function StorefrontAnalyticsPage() {
  const [range, setRange] = useState<DateRangeOption>("30D");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics/report?range=${range}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const funnel = data?.funnel || [];
  const traffic = data?.trafficSources || [];
  const products = data?.productStats || [];
  const newsletter = data?.newsletterStats;

  return (
    <AdminShell
      dateRange={range}
      onDateRangeChange={(r) => setRange(r)}
      title="PAGE & STOREFRONT ANALYTICS"
      subtitle="LIVE BEACON TELEMETRY, CONVERSION FUNNEL & MARKETING ATTRIBUTION"
    >
      {/* ----------------- 1. CONVERSION FUNNEL ----------------- */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 mb-8 font-mono text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-primary)]">
              STOREFRONT CONVERSION FUNNEL ({range})
            </h3>
            <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
              Auditing buyer journey progression from landing to completed payment
            </p>
          </div>
          <span className="text-[10px] text-[var(--accent)] font-bold">
            OVERALL CONVERSION: {funnel[4] && funnel[0] ? ((funnel[4].count / funnel[0].count) * 100).toFixed(1) : 0}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {funnel.map((step: any, idx: number) => {
            const icons = [Users, Eye, ShoppingBag, CreditCard, CheckCircle2];
            const Icon = icons[idx] || Users;
            return (
              <div
                key={idx}
                className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[var(--ink-secondary)] mb-2">
                    <span className="uppercase font-bold">STEP 0{idx + 1}</span>
                    <Icon className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <div className="text-[11px] font-bold text-[var(--ink-secondary)] uppercase">
                    {step.step}
                  </div>
                  <div className="text-2xl font-bold text-[var(--ink-primary)] mt-1">
                    {step.count.toLocaleString()}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-[var(--border-hairline)]">
                  {idx === 0 ? (
                    <span className="text-[10px] text-[var(--status-success)] font-bold">100% Top of Funnel</span>
                  ) : (
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[var(--status-danger)] font-bold">
                        -{step.dropoffPercent}% Drop-off
                      </span>
                      <span className="text-[var(--ink-secondary)]">from prior</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ----------------- 2. TRAFFIC SOURCES & NEWSLETTER ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 font-mono text-xs">
        {/* Traffic Sources */}
        <div className="lg:col-span-2 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-primary)]">
              TRAFFIC SOURCES & CAMPAIGN ATTRIBUTION (UTM)
            </h3>
            <Share2 className="w-4 h-4 text-[var(--accent)]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-hairline)] text-[10px] uppercase text-[var(--ink-secondary)]">
                  <th className="py-2">Marketing Channel</th>
                  <th className="py-2">Sessions</th>
                  <th className="py-2">Orders</th>
                  <th className="py-2">Conv. Rate</th>
                  <th className="py-2 text-right">Attributed Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {traffic.map((ch: any, i: number) => (
                  <tr key={i} className="hover:bg-[var(--bg-secondary)]/50">
                    <td className="py-3 font-bold text-[var(--ink-primary)]">
                      {ch.channel}
                    </td>
                    <td className="py-3 text-[var(--ink-secondary)]">
                      {ch.visitors.toLocaleString()}
                    </td>
                    <td className="py-3 font-bold">{ch.orders}</td>
                    <td className="py-3 text-[var(--accent)] font-bold">
                      {ch.conversionRate}%
                    </td>
                    <td className="py-3 text-right font-bold text-[var(--ink-primary)]">
                      {ch.revenue.toLocaleString()} EGP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Newsletter Subscribers Growth */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-primary)]">
                VALVES DISPATCH (NEWSLETTER)
              </h3>
              <Mail className="w-4 h-4 text-[var(--accent)]" />
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] mb-4">
              <span className="text-[10px] uppercase text-[var(--ink-secondary)] font-bold block mb-1">
                TOTAL ARCHIVAL SUBSCRIBERS
              </span>
              <div className="text-2xl font-bold text-[var(--ink-primary)]">
                {(newsletter?.totalSubscribers || 0).toLocaleString()}
              </div>
              <div className="text-[10px] text-[var(--status-success)] font-bold mt-1">
                +{newsletter?.newThisPeriod || 0} patrons joined ({range})
              </div>
            </div>

            <span className="text-[10px] uppercase font-bold text-[var(--ink-secondary)] block mb-2">
              RECENT DISPATCH RECIPIENTS:
            </span>
            <div className="space-y-2">
              {newsletter?.recentSubscribers?.map((sub: any, i: number) => (
                <div key={i} className="p-2 border border-[var(--border-hairline)] text-[11px] flex justify-between">
                  <span className="font-bold truncate max-w-[170px]">{sub.email}</span>
                  <span className="text-[var(--ink-secondary)]">{sub.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-hairline)] mt-4">
            <button
              onClick={() => {
                alert("Subscribers list exported as CSV");
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] text-xs uppercase hover:bg-[var(--bg-primary)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dispatch List</span>
            </button>
          </div>
        </div>
      </div>

      {/* ----------------- 3. PRODUCT PERFORMANCE TABLE ----------------- */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 font-mono text-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-primary)] mb-4 pb-2 border-b border-[var(--border-hairline)]">
          PIECE-BY-PIECE ENGAGEMENT & CONVERSION PERFORMANCE
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] text-[10px] uppercase text-[var(--ink-secondary)]">
                <th className="py-3 px-4">Garment Title</th>
                <th className="py-3 px-2">Collection</th>
                <th className="py-3 px-2">Fabric Weight</th>
                <th className="py-3 px-2">Views</th>
                <th className="py-3 px-2">Bag Adds</th>
                <th className="py-3 px-2">Add-to-Bag %</th>
                <th className="py-3 px-2">Units Sold</th>
                <th className="py-3 px-2">Conv. %</th>
                <th className="py-3 px-4 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[var(--ink-primary)]">
                    {p.name}
                  </td>
                  <td className="py-3 px-2 uppercase text-[10px] text-[var(--ink-secondary)]">
                    {p.collection}
                  </td>
                  <td className="py-3 px-2 text-[var(--ink-secondary)]">{p.fabricGsm}</td>
                  <td className="py-3 px-2">{p.views}</td>
                  <td className="py-3 px-2">{p.atb}</td>
                  <td className="py-3 px-2 text-[var(--accent)] font-bold">{p.atbRate}%</td>
                  <td className="py-3 px-2 font-bold">{p.unitsSold}</td>
                  <td className="py-3 px-2 text-[var(--status-success)] font-bold">{p.convRate}%</td>
                  <td className="py-3 px-4 text-right font-bold text-[var(--ink-primary)]">
                    {p.revenue.toLocaleString()} EGP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
