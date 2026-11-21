"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DateRangeOption } from "@/components/admin/DateRangePicker";
import {
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Package,
  Eye,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { OrderStatus } from "@prisma/client";

export default function AdminOverviewPage() {
  const [range, setRange] = useState<DateRangeOption>("30D");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchOverview = async (selectedRange: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard/overview?range=${selectedRange}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to load dashboard overview", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview(range);
  }, [range]);

  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOverview(range);
    } catch (e) {
      console.error(e);
    }
  };

  const kpis = data?.kpis;

  return (
    <AdminShell
      dateRange={range}
      onDateRangeChange={(r) => setRange(r)}
      title="OPERATIONS OVERVIEW"
      subtitle="REAL-TIME PERFORMANCE, REVENUE ACCRUAL & LOGISTICS STATUS"
    >
      {/* ---------------- 1. TOP KPI MATRIX ---------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        <KpiCard
          label="GROSS REVENUE"
          value={kpis?.grossRevenue?.value || 0}
          change={kpis?.grossRevenue?.change}
          isCurrency
        />
        <KpiCard
          label="NET PROFIT"
          value={kpis?.netProfit?.value || 0}
          change={kpis?.netProfit?.change}
          isCurrency
          indicator={kpis?.netProfit?.value > 0 ? "positive" : "negative"}
        />
        <KpiCard
          label="ORDERS"
          value={kpis?.totalOrders?.value || 0}
          change={kpis?.totalOrders?.change}
        />
        <KpiCard
          label="AVG ORDER VALUE"
          value={kpis?.aov?.value || 0}
          change={kpis?.aov?.change}
          isCurrency
        />
        <KpiCard
          label="CONV. RATE"
          value={`${kpis?.conversionRate?.value || 0}%`}
          change={kpis?.conversionRate?.change}
        />
        <KpiCard
          label="RETURN RATE"
          value={`${kpis?.returnRate?.value || 0}%`}
          change={kpis?.returnRate?.change}
          indicator={kpis?.returnRate?.value > 10 ? "negative" : "positive"}
        />
        <KpiCard
          label="LOW STOCK SKUS"
          value={kpis?.lowStockSkus?.value || 0}
          subvalue="Threshold ≤ 4"
          indicator={kpis?.lowStockSkus?.value > 0 ? "negative" : "neutral"}
        />
      </div>

      {/* ---------------- 2. PRIMARY CHARTS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue vs Net Profit Time-Series Area Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="REVENUE VS. NET PROFIT TRAJECTORY"
            subtitle={`Accrued financial performance over the last ${range} period`}
            data={data?.chartData || []}
          />
        </div>

        {/* Orders by Status & Category Breakdown */}
        <div className="space-y-6">
          {/* Order Status Distribution */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-5">
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--ink-primary)] mb-4 pb-2 border-b border-[var(--border-hairline)]">
              ORDERS BY STATUS // توزيع الحالات
            </h3>
            <div className="space-y-2.5 font-mono text-xs">
              {data?.statusDistribution &&
                Object.entries(data.statusDistribution).map(([st, cnt]: [string, any]) => {
                  const total = data.kpis?.totalOrders?.value || 1;
                  const pct = Math.round((cnt / total) * 100);
                  return (
                    <div key={st}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-[var(--ink-secondary)]">{st}</span>
                        <span className="font-bold">
                          {cnt} <span className="opacity-60 text-[10px]">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-[var(--bg-secondary)] h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${
                            st === "DELIVERED"
                              ? "bg-[var(--status-success)]"
                              : st === "CONFIRMED" || st === "SHIPPED"
                              ? "bg-[var(--accent)]"
                              : st === "RETURNED" || st === "CANCELLED"
                              ? "bg-[var(--status-danger)]"
                              : "bg-[var(--ink-secondary)]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Sales by Category */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-5">
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--ink-primary)] mb-3 pb-2 border-b border-[var(--border-hairline)]">
              SALES BY CATEGORY // مبيعات الأقسام
            </h3>
            <div className="space-y-3 font-mono text-xs">
              {data?.categorySales &&
                Object.entries(data.categorySales).map(([cat, val]: [string, any]) => {
                  const total = Object.values(data.categorySales).reduce((a: any, b: any) => a + b, 0) || 1;
                  const pct = Math.round(((val as number) / (total as number)) * 100);
                  return (
                    <div key={cat} className="flex justify-between items-center py-1 border-b border-[var(--border-hairline)]">
                      <span className="text-[var(--ink-secondary)]">{cat}</span>
                      <div className="text-right">
                        <div className="font-bold">{val.toLocaleString()} EGP</div>
                        <div className="text-[10px] text-[var(--accent)]">{pct}% of catalog</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- 3. ACTIONABLE WIDGETS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Quick Actions */}
        <div className="lg:col-span-2 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-5">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--border-hairline)]">
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--ink-primary)]">
              RECENT ORDERS & DISPATCH QUEUE
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-mono text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <span>View All 48 Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[var(--border-hairline)] text-[10px] uppercase text-[var(--ink-secondary)]">
                  <th className="py-2">Order #</th>
                  <th className="py-2">Client / City</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Quick Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {data?.recentOrders?.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="py-3 font-bold text-[var(--ink-primary)]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3">
                      <div>{ord.customerName}</div>
                      <div className="text-[10px] text-[var(--ink-secondary)]">{ord.city}</div>
                    </td>
                    <td className="py-3 font-bold">{ord.totalEgp.toLocaleString()} EGP</td>
                    <td className="py-3">
                      <StatusBadge status={ord.status} type="order" />
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => handleQuickStatusChange(ord.id, e.target.value)}
                        className="bg-[var(--bg-primary)] border border-[var(--border-hairline)] px-2 py-1 text-[11px] font-mono outline-none cursor-pointer"
                      >
                        <option value={OrderStatus.PENDING}>PENDING</option>
                        <option value={OrderStatus.CONFIRMED}>CONFIRMED</option>
                        <option value={OrderStatus.PACKED}>PACKED</option>
                        <option value={OrderStatus.SHIPPED}>SHIPPED</option>
                        <option value={OrderStatus.DELIVERED}>DELIVERED</option>
                        <option value={OrderStatus.RETURNED}>RETURNED</option>
                        <option value={OrderStatus.CANCELLED}>CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts & Top Selling */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-5">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--border-hairline)]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[var(--status-danger)]">
                <AlertTriangle className="w-4 h-4" />
                <span>LOW STOCK SKUs ({data?.lowStockAlerts?.length || 0})</span>
              </div>
              <Link
                href="/admin/inventory"
                className="text-[11px] font-mono text-[var(--accent)] hover:underline"
              >
                ERP Matrix →
              </Link>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {data?.lowStockAlerts?.length === 0 ? (
                <div className="text-[var(--ink-secondary)] text-center py-4">All SKU stock levels healthy</div>
              ) : (
                data?.lowStockAlerts?.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-[var(--bg-secondary)] border-l-2 border-[var(--status-danger)] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[11px]">{item.sku}</div>
                      <div className="text-[10px] text-[var(--ink-secondary)] truncate max-w-[160px]">
                        {item.productName} [{item.size}]
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[var(--status-danger)]">
                        {item.stockQty} left
                      </div>
                      <div className="text-[9px] text-[var(--ink-secondary)]">Thresh: {item.threshold}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Selling Pieces */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-5">
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--ink-primary)] mb-3 pb-2 border-b border-[var(--border-hairline)]">
              TOP PERFORMING PIECES
            </h3>
            <div className="space-y-2 font-mono text-xs">
              {data?.topSelling?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-[var(--border-hairline)] last:border-0">
                  <div className="truncate max-w-[170px]">
                    <div className="font-bold truncate">{item.name}</div>
                    <div className="text-[10px] text-[var(--ink-secondary)]">{item.unitsSold} units shipped</div>
                  </div>
                  <div className="text-right font-bold text-[var(--ink-primary)]">
                    {item.revenue.toLocaleString()} EGP
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
