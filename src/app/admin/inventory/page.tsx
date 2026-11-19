"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ErpProductVariant, ErpStockMovement } from "@/lib/erpStore";
import { StockMovementReason } from "@prisma/client";
import {
  Boxes,
  Search,
  Filter,
  Plus,
  RotateCcw,
  AlertTriangle,
  History,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from "lucide-react";

export default function InventoryManagementPage() {
  const [variants, setVariants] = useState<ErpProductVariant[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [movements, setMovements] = useState<ErpStockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<"matrix" | "audit">("matrix");

  // Adjustment Modal
  const [selectedVariant, setSelectedVariant] = useState<ErpProductVariant | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<StockMovementReason>(StockMovementReason.RESTOCK);
  const [adjustNote, setAdjustNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/inventory/variants?search=${searchQuery}&lowStockOnly=${lowStockOnly}`
      );
      const data = await res.json();
      setVariants(data.variants || []);
      setKpis(data.kpis);

      const movRes = await fetch("/api/admin/inventory/movements");
      const movData = await movRes.json();
      setMovements(movData.movements || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [searchQuery, lowStockOnly]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/admin/inventory/adjust-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          changeQty: adjustQty,
          reason: adjustReason,
          note: adjustNote || undefined,
        }),
      });

      setSelectedVariant(null);
      setAdjustNote("");
      fetchInventory();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminShell
      title="MINI-ERP: INVENTORY & PRODUCTION"
      subtitle="SKU MATRIX, COGS COSTING, AUTOMATIC STOCK AUDIT & WAREHOUSE LEDGER"
    >
      {/* ----------------- INVENTORY OVERVIEW CARDS ----------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <KpiCard label="ACTIVE SKUs" value={kpis?.totalSkus || 0} />
        <KpiCard label="TOTAL UNITS IN ATELIER" value={kpis?.totalUnits || 0} />
        <KpiCard
          label="RETAIL VALUE"
          value={kpis?.totalInventoryValueRetail || 0}
          isCurrency
        />
        <KpiCard
          label="INVENTORY COGS"
          value={kpis?.totalInventoryCost || 0}
          isCurrency
        />
        <KpiCard
          label="EST. MARGIN"
          value={`${kpis?.potentialMarginPercent || 0}%`}
          indicator="positive"
        />
        <KpiCard
          label="LOW STOCK WARNINGS"
          value={kpis?.lowStockCount || 0}
          indicator={kpis?.lowStockCount > 0 ? "negative" : "neutral"}
        />
      </div>

      {/* ----------------- TABS & SEARCH BAR ----------------- */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors ${
                activeTab === "matrix"
                  ? "bg-[var(--ink-primary)] text-[var(--bg-primary)]"
                  : "bg-[var(--bg-secondary)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              SKU & Variant Matrix ({variants.length})
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors ${
                activeTab === "audit"
                  ? "bg-[var(--ink-primary)] text-[var(--bg-primary)]"
                  : "bg-[var(--bg-secondary)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              Stock Audit Ledger ({movements.length})
            </button>
          </div>

          {activeTab === "matrix" && (
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 left-3 text-[var(--ink-secondary)]" />
                <input
                  type="text"
                  placeholder="Search SKU, piece, color, size..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] pl-9 pr-3 py-1.5 text-xs font-mono text-[var(--ink-primary)] outline-none focus:border-[var(--ink-primary)]"
                />
              </div>

              <label className="flex items-center gap-1.5 text-xs font-mono cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={lowStockOnly}
                  onChange={(e) => setLowStockOnly(e.target.checked)}
                />
                <span className="text-[var(--status-danger)] font-bold">Low Stock Only</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* ----------------- TAB 1: SKU MATRIX TABLE ----------------- */}
      {activeTab === "matrix" && (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] text-[10px] uppercase text-[var(--ink-secondary)]">
                  <th className="py-3 px-4">SKU / Code</th>
                  <th className="py-3 px-2">Piece Description</th>
                  <th className="py-3 px-2">Size / Color</th>
                  <th className="py-3 px-2">Fabric Weight</th>
                  <th className="py-3 px-2">Unit COGS</th>
                  <th className="py-3 px-2">Retail Price</th>
                  <th className="py-3 px-2">Margin</th>
                  <th className="py-3 px-2">Stock Level</th>
                  <th className="py-3 px-4 text-right">Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[var(--ink-secondary)]">
                      CALCULATING ATELIER SKU MATRIX...
                    </td>
                  </tr>
                ) : variants.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[var(--ink-secondary)]">
                      No matching SKUs found.
                    </td>
                  </tr>
                ) : (
                  variants.map((v) => {
                    const marginPct = Number(
                      (((v.retailPriceEgp - v.unitCostEgp) / v.retailPriceEgp) * 100).toFixed(0)
                    );
                    const isLow = v.stockQty <= v.lowStockThreshold;

                    return (
                      <tr key={v.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-[var(--ink-primary)]">
                          {v.sku}
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-bold">{v.productName}</div>
                          <div className="text-[10px] text-[var(--ink-secondary)]">{v.dropTag}</div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-bold">{v.size}</span> · {v.color}
                        </td>
                        <td className="py-3 px-2 text-[var(--ink-secondary)]">
                          {v.fabricGsm} GSM
                        </td>
                        <td className="py-3 px-2 text-[var(--ink-secondary)]">
                          {v.unitCostEgp.toLocaleString()} EGP
                        </td>
                        <td className="py-3 px-2 font-bold text-[var(--ink-primary)]">
                          {v.retailPriceEgp.toLocaleString()} EGP
                        </td>
                        <td className="py-3 px-2 text-[var(--accent)] font-bold">
                          {marginPct}%
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-bold ${
                                isLow ? "text-[var(--status-danger)]" : "text-[var(--ink-primary)]"
                              }`}
                            >
                              {v.stockQty}
                            </span>
                            {isLow && (
                              <span className="text-[9px] px-1 py-0.2 bg-red-500/10 text-[var(--status-danger)] font-bold border border-red-500/30">
                                LOW
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedVariant(v);
                              setAdjustQty(10);
                              setAdjustReason(StockMovementReason.RESTOCK);
                            }}
                            className="px-2.5 py-1 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] hover:border-[var(--ink-primary)] text-[10px] uppercase font-bold transition-colors"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: AUDIT LEDGER TABLE ----------------- */}
      {activeTab === "audit" && (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] text-[10px] uppercase text-[var(--ink-secondary)]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-2">SKU / Item</th>
                  <th className="py-3 px-2">Reason</th>
                  <th className="py-3 px-2">Quantity Change</th>
                  <th className="py-3 px-2">Order / Note</th>
                  <th className="py-3 px-4 text-right">Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {movements.map((m) => {
                  const isPositive = m.changeQty > 0;
                  return (
                    <tr key={m.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                      <td className="py-3 px-4 text-[var(--ink-secondary)]">
                        {new Date(m.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-bold text-[var(--ink-primary)]">{m.sku}</div>
                        <div className="text-[10px] text-[var(--ink-secondary)]">{m.productName}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-1.5 py-0.5 text-[10px] uppercase border border-[var(--border-hairline)] bg-[var(--bg-secondary)]">
                          {m.reason.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div
                          className={`flex items-center gap-0.5 font-bold ${
                            isPositive ? "text-[var(--status-success)]" : "text-[var(--status-danger)]"
                          }`}
                        >
                          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{isPositive ? `+${m.changeQty}` : m.changeQty} units</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-[var(--ink-secondary)]">
                        {m.note || m.orderId || "—"}
                      </td>
                      <td className="py-3 px-4 text-right text-[11px] text-[var(--ink-secondary)]">
                        {m.adminUserName || "System"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- MANUAL ADJUSTMENT MODAL ----------------- */}
      {selectedVariant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] w-full max-w-md p-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--accent)]">
                  STOCK ADJUSTMENT DIALOG
                </span>
                <h3 className="text-sm font-bold text-[var(--ink-primary)]">
                  {selectedVariant.sku}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVariant(null)}
                className="p-1 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] mb-4">
              <div className="font-bold">{selectedVariant.productName}</div>
              <div className="text-[10px] text-[var(--ink-secondary)] mt-0.5">
                Current Stock: <span className="font-bold text-[var(--ink-primary)]">{selectedVariant.stockQty} units</span> · Threshold: {selectedVariant.lowStockThreshold}
              </div>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  ADJUSTMENT REASON // سبب التعديل
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as StockMovementReason)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none"
                >
                  <option value={StockMovementReason.RESTOCK}>RESTOCK // توريد من المصنع</option>
                  <option value={StockMovementReason.DAMAGED}>DAMAGED // تالف / غير مطابق</option>
                  <option value={StockMovementReason.MANUAL_AUDIT}>MANUAL AUDIT // جرد دوري</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  QUANTITY DELTA (+ OR -) // الكمية المضافة أو المخصومة
                </label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none font-bold"
                />
                <span className="text-[9px] text-[var(--ink-secondary)] mt-1 block">
                  Positive number adds stock, negative number deducts stock.
                </span>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  AUDIT NOTE // ملاحظات المستودع
                </label>
                <input
                  type="text"
                  placeholder="e.g. Batch #4 replenishment from Cairo Mills"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-[var(--ink-primary)] text-[var(--bg-primary)] uppercase font-bold hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? "RECORDING..." : "COMMIT STOCK CHANGE"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVariant(null)}
                  className="px-4 py-2 border border-[var(--border-hairline)] hover:bg-[var(--bg-secondary)]"
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
