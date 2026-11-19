"use client";

import React from "react";
import { ErpOrder } from "@/lib/erpStore";
import { ValveLogo } from "@/components/ValveLogo";
import { Printer, X } from "lucide-react";

interface PrintableInvoiceProps {
  order: ErpOrder;
  onClose: () => void;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink-primary)]">
              ATELIER PACKING SLIP // {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--ink-primary)] text-[var(--bg-primary)] text-xs font-mono uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors border border-[var(--border-hairline)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto print:p-0 print:m-0 font-mono text-[var(--ink-primary)]">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[var(--ink-primary)] pb-6 mb-8">
            <div className="flex items-center gap-3">
              <ValveLogo className="w-10 h-10 text-[var(--ink-primary)]" />
              <div>
                <h1 className="text-xl font-bold tracking-tight uppercase">VALVES CLOTHING CO.</h1>
                <p className="text-[11px] text-[var(--ink-secondary)] uppercase">
                  Cairo Atelier · 30°02′N 31°14′E · Egyptian Cotton 460 GSM
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold uppercase text-[var(--accent)]">PACKING SLIP & RECEIPT</div>
              <div className="text-lg font-bold">{order.orderNumber}</div>
              <div className="text-[11px] text-[var(--ink-secondary)]">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-[var(--border-hairline)] text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-2">
                RECIPIENT & DESTINATION
              </div>
              <div className="font-bold text-sm mb-1">{order.customerName}</div>
              <div className="text-[var(--ink-secondary)]">{order.customerPhone}</div>
              {order.customerEmail && <div className="text-[var(--ink-secondary)]">{order.customerEmail}</div>}
              <div className="mt-2 text-[var(--ink-primary)]">
                {order.address}, {order.city}, {order.governorate}
              </div>
            </div>

            <div className="border-l border-[var(--border-hairline)] pl-8">
              <div className="text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-2">
                FULFILLMENT & PAYMENT
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--ink-secondary)]">Payment Method:</span>
                <span className="font-bold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--ink-secondary)]">Fulfillment Hub:</span>
                <span>Maadi Distribution Hub</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--ink-secondary)]">COD Status:</span>
                <span className="uppercase">{order.codSettlementStatus}</span>
              </div>
              {order.notes && (
                <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2 border border-amber-500/20">
                  <span className="font-bold">Courier Note:</span> {order.notes}
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mb-8">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--ink-primary)] text-[10px] uppercase text-[var(--ink-secondary)]">
                  <th className="py-2">SKU / Item</th>
                  <th className="py-2">Cut / Specs</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {order.items.map((it, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-3">
                      <div className="font-bold">{it.productName}</div>
                      <div className="text-[10px] text-[var(--ink-secondary)]">{it.sku}</div>
                    </td>
                    <td className="py-3 text-[var(--ink-secondary)]">
                      {it.size} · {it.color}
                    </td>
                    <td className="py-3 text-center font-bold">{it.quantity}</td>
                    <td className="py-3 text-right">{it.unitPriceEgp.toLocaleString()} EGP</td>
                    <td className="py-3 text-right font-bold">
                      {(it.unitPriceEgp * it.quantity).toLocaleString()} EGP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end mb-10">
            <div className="w-64 text-xs space-y-1.5">
              <div className="flex justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--ink-secondary)]">Subtotal:</span>
                <span>{order.subtotalEgp.toLocaleString()} EGP</span>
              </div>
              {order.discountEgp > 0 && (
                <div className="flex justify-between py-1 border-b border-[var(--border-hairline)] text-[var(--accent)]">
                  <span>Discount ({order.couponCode || "PROMO"}):</span>
                  <span>-{order.discountEgp.toLocaleString()} EGP</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--ink-secondary)]">Express Delivery:</span>
                <span>{order.shippingFeeEgp === 0 ? "FREE (Orders > 2,000)" : `${order.shippingFeeEgp} EGP`}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-[var(--ink-primary)] text-sm font-bold">
                <span>TOTAL DUE:</span>
                <span>{order.totalEgp.toLocaleString()} EGP</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-[var(--border-hairline)] text-center text-[10px] text-[var(--ink-secondary)] uppercase">
            Thank you for patronizing VALVES Cairo Atelier · 14-Day Archival Exchange Policy · support@valves.eg
          </div>
        </div>
      </div>
    </div>
  );
};
