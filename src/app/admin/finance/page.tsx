"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DateRangeOption } from "@/components/admin/DateRangePicker";
import { ErpExpense } from "@/lib/erpStore";
import { ExpenseCategory, CodSettlementStatus } from "@prisma/client";
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  PieChart,
  Truck,
  X,
} from "lucide-react";

export default function FinanceManagementPage() {
  const [range, setRange] = useState<DateRangeOption>("30D");
  const [data, setData] = useState<any>(null);
  const [expenses, setExpenses] = useState<ErpExpense[]>([]);
  const [loading, setLoading] = useState(true);

  // New Expense Modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<ExpenseCategory>(ExpenseCategory.META_ADS);
  const [newAmount, setNewAmount] = useState<number>(5000);
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [newNotes, setNewNotes] = useState<string>("");

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/finance/pnl?range=${range}`);
      const json = await res.json();
      setData(json);

      const expRes = await fetch("/api/admin/finance/expenses");
      const expJson = await expRes.json();
      setExpenses(expJson.expenses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, [range]);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/finance/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newCategory,
          amountEgp: newAmount,
          incurredDate: newDate,
          notes: newNotes,
        }),
      });
      setIsExpenseModalOpen(false);
      setNewNotes("");
      fetchFinance();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSettleOrder = async (orderId: string) => {
    try {
      await fetch("/api/admin/finance/settle-cod", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      fetchFinance();
    } catch (e) {
      console.error(e);
    }
  };

  const pnl = data?.pnl;
  const cod = data?.codTracker;

  return (
    <AdminShell
      dateRange={range}
      onDateRangeChange={(r) => setRange(r)}
      title="MINI-ERP: FINANCE & P&L"
      subtitle="ACCRUAL FINANCIAL AUDIT, MARKETING SPEND ATTRIBUTION & COURIER COD RECONCILIATION"
    >
      {/* ----------------- TOP FINANCIAL MATRIX ----------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <KpiCard
          label="GROSS REVENUE"
          value={pnl?.grossRevenue || 0}
          isCurrency
        />
        <KpiCard
          label="NET SALES"
          value={pnl?.netSales || 0}
          isCurrency
          subvalue={`Discounts: -${(pnl?.discounts || 0).toLocaleString()} EGP`}
        />
        <KpiCard
          label="COGS (FABRIC & MAKE)"
          value={pnl?.cogs || 0}
          isCurrency
        />
        <KpiCard
          label="OPERATING & AD SPEND"
          value={pnl?.operatingExpenses || 0}
          isCurrency
        />
        <KpiCard
          label="NET PROFIT"
          value={pnl?.netProfit || 0}
          isCurrency
          indicator={pnl?.netProfit > 0 ? "positive" : "negative"}
        />
        <KpiCard
          label="NET MARGIN %"
          value={`${pnl?.netMarginPercent || 0}%`}
          indicator="positive"
        />
      </div>

      {/* ----------------- P&L WATERFALL & COD RECONCILIATION ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Waterfall Breakdown */}
        <div className="lg:col-span-2 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 font-mono text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-4">
            <h3 className="font-bold uppercase tracking-wider text-sm text-[var(--ink-primary)]">
              ATELIER P&L WATERFALL BREAKDOWN ({range})
            </h3>
            <span className="text-[10px] text-[var(--accent)] font-bold">REAL-TIME ACCRUAL</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-hairline)]">
              <span className="text-[var(--ink-primary)] font-bold">1. Gross Revenue (Storefront Bookings)</span>
              <span className="font-bold text-sm">{(pnl?.grossRevenue || 0).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-hairline)] text-[var(--accent)] pl-4">
              <span>Less: Promo Discounts (Coupons)</span>
              <span>-{(pnl?.discounts || 0).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-hairline)] text-[var(--status-danger)] pl-4">
              <span>Less: Returns & Exchanges (14-Day Guarantee)</span>
              <span>-{(pnl?.returns || 0).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b-2 border-[var(--border-hairline)] bg-[var(--bg-secondary)] px-2 font-bold">
              <span>= Net Merchandise Sales</span>
              <span>{(pnl?.netSales || 0).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-hairline)] text-[var(--ink-secondary)] pl-4">
              <span>Less: Cost of Goods Sold (460 GSM Yarn, Milling & Stitching)</span>
              <span>-{(pnl?.cogs || 0).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-hairline)] text-[var(--ink-secondary)] pl-4">
              <span>Less: Atelier Absorbed Express Shipping (Orders &gt; 2,000 EGP)</span>
              <span>-{(pnl?.shippingExpense || 0).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b-2 border-[var(--border-hairline)] bg-[var(--bg-secondary)] px-2 font-bold text-[var(--status-success)]">
              <span>= Gross Profit (Contribution Margin: {pnl?.grossMarginPercent || 0}%)</span>
              <span>{(pnl?.grossProfit || 0).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-hairline)] text-[var(--status-danger)] pl-4">
              <span>Less: Operational & Paid Advertising Expenses</span>
              <span>-{(pnl?.operatingExpenses || 0).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-bold text-sm">
              <span className="uppercase">NET BOTTOM-LINE PROFIT</span>
              <span>{(pnl?.netProfit || 0).toLocaleString()} EGP ({pnl?.netMarginPercent || 0}%)</span>
            </div>
          </div>
        </div>

        {/* COD Cashflow Tracker */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-4">
              <h3 className="font-bold uppercase tracking-wider text-sm text-[var(--ink-primary)]">
                COD COURIER CASHFLOW
              </h3>
              <Truck className="w-4 h-4 text-[var(--accent)]" />
            </div>

            <p className="text-[11px] text-[var(--ink-secondary)] mb-4">
              Cash on Delivery accounts for ~75% of domestic sales. Monitor funds held by courier dispatch vs. settled atelier payouts.
            </p>

            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30">
                <div className="text-[10px] uppercase text-amber-700 dark:text-amber-400 font-bold mb-1">
                  PENDING WITH COURIER // قيد التحصيل
                </div>
                <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                  {(cod?.withCourierEgp || 0).toLocaleString()} EGP
                </div>
                <div className="text-[10px] text-[var(--ink-secondary)] mt-1">
                  In transit or awaiting bi-weekly courier remittance
                </div>
              </div>

              <div className="p-3 bg-[var(--status-success)]/10 border border-[var(--status-success)]/30">
                <div className="text-[10px] uppercase text-[var(--status-success)] font-bold mb-1">
                  COLLECTED & SETTLED // تم التحويل للبنك
                </div>
                <div className="text-xl font-bold text-[var(--status-success)]">
                  {(cod?.settledEgp || 0).toLocaleString()} EGP
                </div>
                <div className="text-[10px] text-[var(--ink-secondary)] mt-1">
                  Cleared funds in atelier corporate account
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)]">
                <div className="text-[10px] uppercase text-[var(--ink-secondary)] font-bold mb-1">
                  UNCOLLECTED / DISPATCH QUEUE
                </div>
                <div className="text-lg font-bold text-[var(--ink-primary)]">
                  {(cod?.uncollectedEgp || 0).toLocaleString()} EGP
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-hairline)] mt-6">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[var(--ink-secondary)]">Total COD Orders</span>
              <span className="font-bold">{cod?.totalCodOrders || 0} shipments</span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- OPERATING & AD SPEND LEDGER ----------------- */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-hairline)] mb-4">
          <div>
            <h3 className="text-sm font-mono font-bold tracking-wider uppercase text-[var(--ink-primary)]">
              EXPENSES & MARKETING AD SPEND LOG
            </h3>
            <p className="text-xs font-mono text-[var(--ink-secondary)] mt-0.5">
              Accurate ad channel spend (Meta, TikTok) and atelier production outlays
            </p>
          </div>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase font-bold hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record New Expense</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] text-[10px] uppercase text-[var(--ink-secondary)]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Description / Campaign</th>
                <th className="py-3 px-2">Recorded By</th>
                <th className="py-3 px-4 text-right">Amount (EGP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                  <td className="py-3 px-4 text-[var(--ink-secondary)]">
                    {exp.incurredDate}
                  </td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 text-[10px] uppercase border border-[var(--border-hairline)] bg-[var(--bg-secondary)] font-bold">
                      {exp.category.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-[var(--ink-primary)]">
                    {exp.notes || "—"}
                  </td>
                  <td className="py-3 px-2 text-[var(--ink-secondary)] text-[11px]">
                    {exp.createdByName}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[var(--ink-primary)]">
                    {exp.amountEgp.toLocaleString()} EGP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- RECORD EXPENSE MODAL ----------------- */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] w-full max-w-md p-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-4">
              <h3 className="text-sm font-bold uppercase text-[var(--ink-primary)]">
                LOG OPERATING OR AD EXPENSE
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  EXPENSE CATEGORY
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none"
                >
                  <option value={ExpenseCategory.META_ADS}>META ADS (Instagram & FB)</option>
                  <option value={ExpenseCategory.TIKTOK_ADS}>TIKTOK ADS (Spark Ads & Catalog)</option>
                  <option value={ExpenseCategory.PACKAGING}>PACKAGING & BRANDING BOXES</option>
                  <option value={ExpenseCategory.PRODUCTION}>PRODUCTION & COTTON MILLING</option>
                  <option value={ExpenseCategory.STUDIO}>STUDIO SHOOT & CAMPAIGN CREATIVE</option>
                  <option value={ExpenseCategory.MISC}>MISCELLANEOUS ATELIER EXPENSE</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  AMOUNT (EGP)
                </label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  INCURRED DATE
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  CAMPAIGN / INVOICE DESCRIPTION
                </label>
                <input
                  type="text"
                  placeholder="e.g. Meta Ads Drop 01 ROAS Scaling"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[var(--ink-primary)] text-[var(--bg-primary)] uppercase font-bold hover:opacity-90"
                >
                  RECORD EXPENSE
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 border border-[var(--border-hairline)]"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
