"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Settings, Shield, Truck, Users, Check, Save } from "lucide-react";

export default function StoreSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data.settings);
      setAdminUsers(data.adminUsers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !settings) {
    return (
      <AdminShell title="STORE SETTINGS" subtitle="LOGISTICS, SHIPPING & ACCESS GOVERNANCE">
        <div className="py-12 text-center font-mono text-xs text-[var(--ink-secondary)]">
          LOADING STORE CONFIGURATION...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="STORE SETTINGS & GOVERNANCE"
      subtitle="FREE SHIPPING THRESHOLDS, REGIONAL TARIFFS & STAFF ACCESS CONTROL"
    >
      <form onSubmit={handleSave} className="space-y-8 font-mono text-xs">
        {/* Save confirmation banner */}
        {savedSuccess && (
          <div className="p-3 bg-[var(--status-success)]/10 border border-[var(--status-success)]/30 text-[var(--status-success)] font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Store settings successfully updated and synchronized across atelier systems.</span>
          </div>
        )}

        {/* ----------------- 1. SHIPPING & LOGISTICS POLICY ----------------- */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[var(--border-hairline)] mb-6">
            <Truck className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-primary)]">
              SHIPPING POLICY & ATELIER DISPATCH
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                COMPLIMENTARY SHIPPING THRESHOLD (EGP)
              </label>
              <input
                type="number"
                value={settings.freeShippingThresholdEgp}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThresholdEgp: Number(e.target.value) })
                }
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2.5 font-bold text-sm"
              />
              <span className="text-[10px] text-[var(--ink-secondary)] mt-1 block">
                Storefront cart shows dynamic progress bar toward this target.
              </span>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                STANDARD FLAT RATE (EGP)
              </label>
              <input
                type="number"
                value={settings.standardShippingFeeEgp}
                onChange={(e) =>
                  setSettings({ ...settings, standardShippingFeeEgp: Number(e.target.value) })
                }
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] p-2.5 font-bold text-sm"
              />
            </div>
          </div>

          {/* Governorate Rates */}
          <div>
            <h4 className="text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-3">
              REGIONAL COURIER TARIFF BY GOVERNORATE:
            </h4>
            <div className="border border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
              {settings.governorates?.map((g: any, idx: number) => (
                <div key={idx} className="p-3 flex items-center justify-between bg-[var(--bg-secondary)]/30">
                  <span className="font-bold">{g.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={g.fee}
                      onChange={(e) => {
                        const updated = [...settings.governorates];
                        updated[idx].fee = Number(e.target.value);
                        setSettings({ ...settings, governorates: updated });
                      }}
                      className="w-20 bg-[var(--bg-primary)] border border-[var(--border-hairline)] px-2 py-1 text-right font-bold"
                    />
                    <span className="text-[var(--ink-secondary)] text-[10px]">EGP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ----------------- 2. STAFF ROLES & ACCESS CONTROL ----------------- */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[var(--border-hairline)] mb-6">
            <Shield className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-primary)]">
              ATELIER STAFF ACCOUNTS & ROLE-BASED ACCESS
            </h3>
          </div>

          <div className="border border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)] mb-4">
            {adminUsers.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between bg-[var(--bg-secondary)]/30">
                <div>
                  <div className="font-bold text-sm text-[var(--ink-primary)]">{u.name}</div>
                  <div className="text-[11px] text-[var(--ink-secondary)]">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-[10px] uppercase font-bold border ${
                      u.role === "OWNER"
                        ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                        : "bg-[var(--bg-primary)] border-[var(--border-hairline)] text-[var(--ink-primary)]"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] text-[11px] text-[var(--ink-secondary)]">
            <span className="font-bold text-[var(--ink-primary)]">Role Permissions:</span>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li><strong>OWNER:</strong> Full read/write access across all modules, P&L finances, marketing, and settings.</li>
              <li><strong>OPERATIONS:</strong> Order dispatch, courier settlement, patron CRM, and customer communications.</li>
              <li><strong>WAREHOUSE:</strong> Inventory management, SKU matrix, and stock movement adjustments only.</li>
            </ul>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-bold uppercase text-xs hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
