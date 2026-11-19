"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import {
  Users,
  Search,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Clock,
  ShieldCheck,
  ChevronRight,
  X,
} from "lucide-react";

export default function CustomersCrmPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers?search=${searchQuery}`);
      const data = await res.json();
      setCustomers(data.customers || []);
      setKpis(data.kpis);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery]);

  return (
    <AdminShell
      title="CUSTOMERS & CRM DIRECTORY"
      subtitle="PATRON LIFETIME VALUE (LTV), RETURN RISK AUDIT & REGIONAL DEMOGRAPHICS"
    >
      {/* ----------------- CRM KPI CARDS ----------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard
          label="REGISTERED / GUEST PATRONS"
          value={kpis?.totalCustomers || 0}
        />
        <KpiCard
          label="AVERAGE LIFETIME VALUE (LTV)"
          value={kpis?.averageLtv || 0}
          isCurrency
          indicator="positive"
        />
        <KpiCard
          label="HIGH-RETURN RISK PATRONS"
          value={kpis?.highRiskCount || 0}
          subvalue="Return rate ≥ 33% on COD orders"
          indicator={kpis?.highRiskCount > 0 ? "negative" : "neutral"}
        />
      </div>

      {/* ----------------- SEARCH & FILTERS ----------------- */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 left-3 text-[var(--ink-secondary)]" />
          <input
            type="text"
            placeholder="Search patron by name, phone, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] pl-9 pr-3 py-2 text-xs font-mono text-[var(--ink-primary)] outline-none focus:border-[var(--ink-primary)]"
          />
        </div>
      </div>

      {/* ----------------- CUSTOMERS DATA TABLE ----------------- */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] text-[10px] uppercase text-[var(--ink-secondary)]">
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-2">Contact & Governorate</th>
                <th className="py-3 px-2">Total Bookings</th>
                <th className="py-3 px-2">Lifetime Value (LTV)</th>
                <th className="py-3 px-2">AOV</th>
                <th className="py-3 px-2">Return History</th>
                <th className="py-3 px-4 text-right">Risk Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--ink-secondary)]">
                    LOADING CRM REPOSITORY...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--ink-secondary)]">
                    No customers found matching search query.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[var(--bg-secondary)]/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedCustomer(c)}
                  >
                    <td className="py-3 px-4 font-bold text-[var(--ink-primary)]">
                      {c.name}
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-[var(--ink-primary)]">{c.phone}</div>
                      <div className="text-[10px] text-[var(--ink-secondary)]">
                        {c.city}, {c.governorate}
                      </div>
                    </td>
                    <td className="py-3 px-2 font-bold">{c.totalOrders} orders</td>
                    <td className="py-3 px-2 font-bold text-[var(--ink-primary)]">
                      {c.totalSpentEgp.toLocaleString()} EGP
                    </td>
                    <td className="py-3 px-2 text-[var(--ink-secondary)]">
                      {c.averageOrderValue.toLocaleString()} EGP
                    </td>
                    <td className="py-3 px-2">
                      <span className={c.returnedOrders > 0 ? "text-[var(--status-danger)]" : "text-[var(--ink-secondary)]"}>
                        {c.returnedOrders} returned ({c.returnRate}%)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {c.isHighReturnRisk ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          <span>HIGH RETURN RISK</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase font-bold bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30">
                          <ShieldCheck className="w-3 h-3" />
                          <span>TRUSTED PATRON</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- PATRON DOSSIER MODAL ----------------- */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] w-full max-w-lg p-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--accent)]">
                  ATELIER PATRON DOSSIER
                </span>
                <h3 className="text-base font-bold text-[var(--ink-primary)]">
                  {selectedCustomer.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{selectedCustomer.city}, {selectedCustomer.governorate}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)]">
                  <div className="text-[9px] text-[var(--ink-secondary)] uppercase">TOTAL ORDERS</div>
                  <div className="text-lg font-bold mt-0.5">{selectedCustomer.totalOrders}</div>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)]">
                  <div className="text-[9px] text-[var(--ink-secondary)] uppercase">LIFETIME VALUE</div>
                  <div className="text-lg font-bold mt-0.5 text-[var(--ink-primary)]">
                    {selectedCustomer.totalSpentEgp.toLocaleString()} EGP
                  </div>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)]">
                  <div className="text-[9px] text-[var(--ink-secondary)] uppercase">RETURN RATE</div>
                  <div className="text-lg font-bold mt-0.5 text-[var(--status-danger)]">
                    {selectedCustomer.returnRate}%
                  </div>
                </div>
              </div>

              {selectedCustomer.isHighReturnRisk && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                  <span className="font-bold">Operations Warning:</span> This patron has a high return frequency on COD deliveries. Phone pre-confirmation is recommended prior to dispatch.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-hairline)]">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full py-2 bg-[var(--ink-primary)] text-[var(--bg-primary)] uppercase font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
