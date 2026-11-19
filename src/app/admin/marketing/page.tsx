"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ErpCoupon } from "@/lib/erpStore";
import { Tag, Plus, Download, CheckCircle2, X } from "lucide-react";

export default function MarketingManagementPage() {
  const [coupons, setCoupons] = useState<ErpCoupon[]>([]);
  const [loading, setLoading] = useState(true);

  // New Coupon Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [discountEgp, setDiscountEgp] = useState<number>(0);
  const [minOrder, setMinOrder] = useState<number>(1500);
  const [usageLimit, setUsageLimit] = useState<number>(200);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/marketing/coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/marketing/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountPercent: discountPercent > 0 ? discountPercent : undefined,
          discountEgp: discountEgp > 0 ? discountEgp : undefined,
          minOrderEgp: minOrder,
          usageLimit,
        }),
      });
      setIsModalOpen(false);
      setCode("");
      fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminShell
      title="MARKETING & PROMOTIONS"
      subtitle="COUPON CAMPAIGN ENGINE, DROP SCHEDULING & NEWSLETTER MANAGEMENT"
    >
      {/* ----------------- ACTIVE CAMPAIGNS & COUPONS ----------------- */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 mb-8 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-hairline)] mb-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-primary)]">
              ACTIVE PROMOTIONAL CODES & DISCOUNTS
            </h3>
            <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
              Governs cart checkout validation across storefront
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--ink-primary)] text-[var(--bg-primary)] text-xs uppercase font-bold hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Promo Code</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] text-[10px] uppercase text-[var(--ink-secondary)]">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-2">Discount Value</th>
                <th className="py-3 px-2">Min. Cart Value</th>
                <th className="py-3 px-2">Redemptions</th>
                <th className="py-3 px-2">Cap / Limit</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[var(--accent)] text-sm">
                    {c.code}
                  </td>
                  <td className="py-3 px-2 font-bold text-[var(--ink-primary)]">
                    {c.discountPercent ? `${c.discountPercent}% OFF` : `${c.discountEgp} EGP OFF`}
                  </td>
                  <td className="py-3 px-2 text-[var(--ink-secondary)]">
                    {c.minOrderEgp ? `${c.minOrderEgp.toLocaleString()} EGP` : "No Min."}
                  </td>
                  <td className="py-3 px-2 font-bold">{c.usageCount} used</td>
                  <td className="py-3 px-2 text-[var(--ink-secondary)]">
                    {c.usageLimit || "Unlimited"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- DROP & FEATURED COLLECTION CONTROLS ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-primary)] mb-2">
            ACTIVE ARCHIVE: DROP 01 // 2026
          </h3>
          <p className="text-[11px] text-[var(--ink-secondary)] mb-4">
            Curated pieces featured on storefront homepage bento grid
          </p>

          <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--ink-secondary)]">Hero Headline:</span>
              <span className="font-bold">CONTROL THE FLOW.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-secondary)]">Featured Weight:</span>
              <span>460 GSM Heavy French Terry</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-secondary)]">Drop Tag Status:</span>
              <span className="text-[var(--accent)] font-bold">LIMITED DROP 01 LIVE</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-primary)] mb-2">
              DISPATCH NEWSLETTER SUBSCRIBERS
            </h3>
            <p className="text-[11px] text-[var(--ink-secondary)] mb-4">
              1,482 verified subscribers ready for Drop 02 announcement campaign
            </p>
          </div>
          <button
            onClick={() => alert("Newsletter subscribers exported")}
            className="flex items-center justify-center gap-2 py-2 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] uppercase hover:bg-[var(--bg-primary)]"
          >
            <Download className="w-4 h-4" />
            <span>Download All 1,482 Emails (CSV)</span>
          </button>
        </div>
      </div>

      {/* ----------------- CREATE COUPON MODAL ----------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] w-full max-w-md p-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-4">
              <h3 className="text-sm font-bold uppercase text-[var(--ink-primary)]">
                CREATE PROMOTIONAL CODE
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  COUPON CODE (UPPERCASE)
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP25"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    DISCOUNT %
                  </label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    OR FIXED (EGP)
                  </label>
                  <input
                    type="number"
                    value={discountEgp}
                    onChange={(e) => setDiscountEgp(Number(e.target.value))}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  MINIMUM ORDER THRESHOLD (EGP)
                </label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  USAGE LIMIT (REDEMPTIONS CAP)
                </label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[var(--ink-primary)] text-[var(--bg-primary)] uppercase font-bold hover:opacity-90"
                >
                  SAVE & ACTIVATE CODE
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
