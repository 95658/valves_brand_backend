"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PrintableInvoice } from "@/components/admin/PrintableInvoice";
import { ErpOrder } from "@/lib/erpStore";
import { OrderStatus, PaymentMethod, CodSettlementStatus } from "@prisma/client";
import {
  Search,
  Filter,
  Download,
  Printer,
  ChevronRight,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<ErpOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [governorateFilter, setGovernorateFilter] = useState("ALL");

  // Selection & Detail Drawer
  const [selectedOrder, setSelectedOrder] = useState<ErpOrder | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<ErpOrder | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>(OrderStatus.CONFIRMED);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (paymentFilter !== "ALL") params.append("paymentMethod", paymentFilter);
      if (governorateFilter !== "ALL") params.append("governorate", governorateFilter);
      if (searchQuery) params.append("query", searchQuery);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter, governorateFilter, searchQuery]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedOrderIds.length === 0) return;
    try {
      await fetch("/api/admin/orders/bulk-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrderIds, status: bulkStatus }),
      });
      setSelectedOrderIds([]);
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter((item) => item !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  };

  return (
    <AdminShell
      title="ORDERS & FULFILLMENT"
      subtitle="LIVE DISPATCH, REAL-TIME STATUS TIMELINE & PACKING SLIP ISSUANCE"
    >
      {/* ----------------- CONTROLS & FILTER BAR ----------------- */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 left-3 text-[var(--ink-secondary)]" />
            <input
              type="text"
              placeholder="Filter by Order #, Patron Name, Mobile (01x), or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] pl-9 pr-3 py-2 text-xs font-mono text-[var(--ink-primary)] outline-none focus:border-[var(--ink-primary)]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[var(--bg-primary)] border border-[var(--border-hairline)] px-2.5 py-2 outline-none cursor-pointer"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value={OrderStatus.PENDING}>PENDING</option>
              <option value={OrderStatus.CONFIRMED}>CONFIRMED</option>
              <option value={OrderStatus.PACKED}>PACKED</option>
              <option value={OrderStatus.SHIPPED}>SHIPPED</option>
              <option value={OrderStatus.DELIVERED}>DELIVERED</option>
              <option value={OrderStatus.RETURNED}>RETURNED</option>
              <option value={OrderStatus.CANCELLED}>CANCELLED</option>
            </select>

            {/* Payment */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-[var(--bg-primary)] border border-[var(--border-hairline)] px-2.5 py-2 outline-none cursor-pointer"
            >
              <option value="ALL">ALL PAYMENTS</option>
              <option value={PaymentMethod.COD}>CASH ON DELIVERY (COD)</option>
              <option value={PaymentMethod.ONLINE}>ONLINE PAYMENT</option>
            </select>

            {/* Governorate */}
            <select
              value={governorateFilter}
              onChange={(e) => setGovernorateFilter(e.target.value)}
              className="bg-[var(--bg-primary)] border border-[var(--border-hairline)] px-2.5 py-2 outline-none cursor-pointer"
            >
              <option value="ALL">ALL REGIONS</option>
              <option value="Cairo">CAIRO</option>
              <option value="Giza">GIZA</option>
              <option value="Alexandria">ALEXANDRIA</option>
              <option value="Dakahlia">MANSOURA</option>
              <option value="Red Sea">RED SEA</option>
            </select>

            {/* Export CSV */}
            <a
              href={`/api/admin/orders/export?status=${statusFilter}&paymentMethod=${paymentFilter}&governorate=${governorateFilter}`}
              className="flex items-center gap-1.5 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT CSV</span>
            </a>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedOrderIds.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-[var(--bg-secondary)] p-2">
            <span className="font-bold text-[var(--accent)]">
              {selectedOrderIds.length} ORDERS SELECTED
            </span>
            <div className="flex items-center gap-2">
              <span>SET STATUS TO:</span>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
                className="bg-[var(--bg-primary)] border border-[var(--border-hairline)] px-2 py-1 outline-none font-mono"
              >
                <option value={OrderStatus.CONFIRMED}>CONFIRMED</option>
                <option value={OrderStatus.PACKED}>PACKED</option>
                <option value={OrderStatus.SHIPPED}>SHIPPED</option>
                <option value={OrderStatus.DELIVERED}>DELIVERED</option>
              </select>
              <button
                onClick={handleBulkUpdate}
                className="px-3 py-1 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-bold uppercase hover:opacity-90"
              >
                APPLY BULK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ----------------- ORDERS DATA TABLE ----------------- */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] text-[10px] uppercase text-[var(--ink-secondary)]">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.length === orders.length && orders.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="py-3 px-2">Order #</th>
                <th className="py-3 px-2">Timestamp</th>
                <th className="py-3 px-2">Customer & Destination</th>
                <th className="py-3 px-2">Method</th>
                <th className="py-3 px-2">Total (EGP)</th>
                <th className="py-3 px-2">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--ink-secondary)]">
                    LOADING ORDERS REPOSITORY...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--ink-secondary)]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr
                    key={ord.id}
                    className="hover:bg-[var(--bg-secondary)]/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedOrder(ord)}
                  >
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.includes(ord.id)}
                        onChange={() => toggleSelectOrder(ord.id)}
                      />
                    </td>
                    <td className="py-3 px-2 font-bold text-[var(--ink-primary)]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-2 text-[var(--ink-secondary)] text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-bold text-[var(--ink-primary)]">{ord.customerName}</div>
                      <div className="text-[10px] text-[var(--ink-secondary)]">
                        {ord.city}, {ord.governorate}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-[10px] text-[var(--ink-secondary)] uppercase">
                        {ord.paymentMethod === PaymentMethod.COD ? "COD" : "ONLINE"}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-bold text-[var(--ink-primary)]">
                      {ord.totalEgp.toLocaleString()} EGP
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={ord.status} type="order" />
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInvoiceOrder(ord)}
                          className="p-1 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] border border-[var(--border-hairline)] bg-[var(--bg-primary)]"
                          title="Print Packing Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                          className="bg-[var(--bg-primary)] border border-[var(--border-hairline)] px-2 py-1 text-[10px] font-mono outline-none"
                        >
                          <option value={OrderStatus.PENDING}>PENDING</option>
                          <option value={OrderStatus.CONFIRMED}>CONFIRMED</option>
                          <option value={OrderStatus.PACKED}>PACKED</option>
                          <option value={OrderStatus.SHIPPED}>SHIPPED</option>
                          <option value={OrderStatus.DELIVERED}>DELIVERED</option>
                          <option value={OrderStatus.RETURNED}>RETURNED</option>
                          <option value={OrderStatus.CANCELLED}>CANCELLED</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- ORDER DETAIL SLIDE-OVER DRAWER ----------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-[var(--bg-elevated)] h-full border-l border-[var(--border-hairline)] p-6 overflow-y-auto font-mono text-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--accent)] tracking-wider">
                    ATELIER ORDER DOSSIER
                  </span>
                  <h2 className="text-lg font-bold text-[var(--ink-primary)]">{selectedOrder.orderNumber}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInvoiceOrder(selectedOrder)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--ink-primary)] text-[var(--bg-primary)] text-xs uppercase"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Packing Slip</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1.5 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Transition Control */}
              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-[var(--ink-secondary)] block">CURRENT LIFECYCLE</span>
                  <StatusBadge status={selectedOrder.status} type="order" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--ink-secondary)]">TRANSITION TO:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                    className="bg-[var(--bg-primary)] border border-[var(--border-hairline)] px-2.5 py-1 text-xs outline-none"
                  >
                    <option value={OrderStatus.PENDING}>PENDING</option>
                    <option value={OrderStatus.CONFIRMED}>CONFIRMED</option>
                    <option value={OrderStatus.PACKED}>PACKED</option>
                    <option value={OrderStatus.SHIPPED}>SHIPPED</option>
                    <option value={OrderStatus.DELIVERED}>DELIVERED</option>
                    <option value={OrderStatus.RETURNED}>RETURNED</option>
                    <option value={OrderStatus.CANCELLED}>CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Patron & Shipping */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-2">
                    PATRON & CONTACT DETAILS
                  </h3>
                  <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] space-y-1.5">
                    <div className="font-bold text-sm text-[var(--ink-primary)]">{selectedOrder.customerName}</div>
                    <div className="flex items-center gap-2 text-[var(--ink-secondary)]">
                      <Phone className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                    {selectedOrder.customerEmail && (
                      <div className="flex items-center gap-2 text-[var(--ink-secondary)]">
                        <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>{selectedOrder.customerEmail}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-[var(--ink-secondary)] pt-1 border-t border-[var(--border-hairline)]">
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                      <span>{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.governorate}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <h3 className="text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                      DELIVERY & PACKAGING INSTRUCTIONS
                    </h3>
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
                      {selectedOrder.notes}
                    </div>
                  </div>
                )}
              </div>

              {/* Items Manifest */}
              <div className="mb-6">
                <h3 className="text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-2">
                  ORDERED PIECES ({selectedOrder.items.length})
                </h3>
                <div className="border border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-[var(--bg-secondary)]/30">
                      <div>
                        <div className="font-bold text-[var(--ink-primary)]">{it.productName}</div>
                        <div className="text-[10px] text-[var(--ink-secondary)] mt-0.5">
                          SKU: {it.sku} · Size: {it.size} · Color: {it.color}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[var(--ink-primary)]">
                          {(it.unitPriceEgp * it.quantity).toLocaleString()} EGP
                        </div>
                        <div className="text-[10px] text-[var(--ink-secondary)]">
                          {it.quantity} × {it.unitPriceEgp.toLocaleString()} EGP
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-hairline)] space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-[var(--ink-secondary)]">Subtotal</span>
                  <span>{selectedOrder.subtotalEgp.toLocaleString()} EGP</span>
                </div>
                {selectedOrder.discountEgp > 0 && (
                  <div className="flex justify-between text-[var(--accent)] font-bold">
                    <span>Discount</span>
                    <span>-{selectedOrder.discountEgp.toLocaleString()} EGP</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--ink-secondary)]">Shipping Fee</span>
                  <span>{selectedOrder.shippingFeeEgp === 0 ? "FREE (Threshold Met)" : `${selectedOrder.shippingFeeEgp} EGP`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[var(--border-hairline)] text-sm font-bold text-[var(--ink-primary)]">
                  <span>Total Amount</span>
                  <span>{selectedOrder.totalEgp.toLocaleString()} EGP</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 border border-[var(--border-hairline)] uppercase text-xs hover:bg-[var(--bg-secondary)]"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}

      {/* ----------------- PRINTABLE INVOICE MODAL ----------------- */}
      {invoiceOrder && (
        <PrintableInvoice
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </AdminShell>
  );
}
