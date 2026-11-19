"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { X, Trash2, CheckCircle2 } from "lucide-react";
import { addOrder } from "@/lib/orderStorage";
import { Order } from "@/data/orders";
import { useStore } from "@/context/StoreContext";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEventType } from "@prisma/client";

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { lang, isRTL, t } = useStore();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  // Customer form inputs
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("New Cairo");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash on Delivery (COD)" | "Credit Card" | "InstaPay"
  >("Cash on Delivery (COD)");

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 2000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 75;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "VALVES10") {
      setDiscount(subtotal * 0.1);
      setPromoApplied(true);
    } else {
      alert(
        lang === "en"
          ? "Invalid code. Try 'VALVES10' for 10% off."
          : "كود غير صحيح. استخدم 'VALVES10' لخصم 10%."
      );
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const newOrder: Order = {
      id: `VLV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || (lang === "en" ? "Guest Patron" : "عميل كريم"),
      email: `${customerName.toLowerCase().replace(/\s+/g, "") || "client"}@valves.eg`,
      phone: customerPhone || "+20 100 000 0000",
      city: customerCity,
      address: customerAddress || "Cairo, Egypt",
      status: "Pending",
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.product.price,
        fabricGsm: i.product.fabricGsm,
      })),
      subtotal,
      shipping: shippingFee,
      discount,
      total,
      paymentMethod,
      createdAt: "Just now",
      notes: customerNotes,
    };

    addOrder(newOrder);
    trackEvent(AnalyticsEventType.PURCHASE, { orderId: newOrder.id });
    setConfirmedOrderId(newOrder.id);
    setCheckoutSuccess(true);
    onClearCart();
  };

  const resetDrawer = () => {
    setCheckoutSuccess(false);
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-6 rtl:pl-0 rtl:pr-6 sm:pl-10 rtl:sm:pl-0 rtl:sm:pr-10">
        <div className="w-screen max-w-md border-l rtl:border-l-0 rtl:border-r border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--ink-primary)] flex flex-col shadow-2xl transition-colors">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[var(--border-hairline)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
              <h2 className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-widest">
                {t("cart.title")}
              </h2>
            </div>
            <button
              onClick={resetDrawer}
              className="p-1.5 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* SUCCESS SCREEN */}
          {checkoutSuccess ? (
            <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 border border-[var(--status-success)] text-[var(--status-success)] flex items-center justify-center mb-6">
                <CheckCircle2 size={30} />
              </div>
              <h3 className="font-heading font-extrabold text-xl uppercase mb-2">
                {t("cart.orderSuccess")}
              </h3>
              <div className="text-xs font-mono text-[var(--ink-primary)] bg-[var(--bg-secondary)] px-3 py-1.5 border border-[var(--border-hairline)] mb-4">
                #{confirmedOrderId}
              </div>
              <p className="text-xs font-light text-[var(--ink-secondary)] mb-8 leading-relaxed max-w-xs">
                {t("cart.orderSuccessMsg")}
              </p>
              <button
                onClick={resetDrawer}
                className="w-full py-3.5 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-widest border border-[var(--ink-primary)] hover:opacity-90 transition"
              >
                {t("cart.exploreBtn")}
              </button>
            </div>
          ) : isCheckingOut ? (
            /* CHECKOUT FORM VIEW */
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-5 border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)]/50 flex items-center justify-between">
                <span className="font-heading font-bold text-xs uppercase tracking-wider">
                  CHECKOUT / الدفع والشحن
                </span>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs font-mono text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] underline"
                >
                  ← {lang === "en" ? "Back to Bag" : "العودة للحقيبة"}
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-6 space-y-4 text-xs font-mono flex-1">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    {t("cart.fullName")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ahmed El-Sayed"
                    className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    {t("cart.phone")} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    {t("cart.city")} *
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)] uppercase cursor-pointer"
                  >
                    <option value="New Cairo">New Cairo (التجمع الخامس)</option>
                    <option value="Sheikh Zayed & 6th Oct">Sheikh Zayed & 6th October</option>
                    <option value="Maadi & Heliopolis">Maadi & Heliopolis</option>
                    <option value="Giza & Dokki">Giza, Zamalek & Dokki</option>
                    <option value="Alexandria">Alexandria (الإسكندرية)</option>
                    <option value="Other Egyptian Governorates">Other Governorates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    {t("cart.address")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Building 14, Street 9, Apt 3"
                    className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    {t("cart.notes")}
                  </label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Leave with building security if unavailable"
                    className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-2">
                    {t("cart.paymentMethod")}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "Cash on Delivery (COD)"}
                        onChange={() => setPaymentMethod("Cash on Delivery (COD)")}
                        className="accent-[var(--accent)]"
                      />
                      <span>{t("cart.cod")}</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "Credit Card"}
                        onChange={() => setPaymentMethod("Credit Card")}
                        className="accent-[var(--accent)]"
                      />
                      <span>{t("cart.card")} (Visa / Mastercard)</span>
                    </label>
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="p-4 border border-[var(--border-hairline)] bg-[var(--bg-secondary)]/50 space-y-1.5 mt-4">
                  <div className="flex justify-between text-[var(--ink-secondary)]">
                    <span>{t("cart.subtotal")}</span>
                    <span>{subtotal.toLocaleString()} EGP</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[var(--accent)]">
                      <span>{t("cart.discount")}</span>
                      <span>-{discount.toLocaleString()} EGP</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--ink-secondary)]">
                    <span>{t("cart.shipping")}</span>
                    <span>{shippingFee === 0 ? t("cart.free") : `${shippingFee} EGP`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-2 border-t border-[var(--border-hairline)] text-[var(--ink-primary)]">
                    <span>{t("cart.total")}</span>
                    <span>{total.toLocaleString()} EGP</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-widest border border-[var(--ink-primary)] hover:opacity-90 transition mt-4"
                >
                  {t("cart.placeOrder")}
                </button>
              </form>
            </div>
          ) : (
            /* BAG ITEMS VIEW */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              {/* Free shipping status bar */}
              <div className="p-4 border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)]/50">
                <div className="flex justify-between text-[11px] font-mono text-[var(--ink-secondary)] mb-2">
                  <span>
                    {remainingForFreeShipping > 0
                      ? `${remainingForFreeShipping.toLocaleString()} EGP ${t("cart.freeShippingProgress")}`
                      : t("cart.freeShippingUnlocked")}
                  </span>
                  <span className="font-bold text-[var(--ink-primary)]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1 bg-[var(--border-hairline)]">
                  <div
                    className="h-full bg-[var(--accent)] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {items.length === 0 ? (
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--ink-secondary)] mb-6">
                    {t("cart.empty")}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-widest border border-[var(--ink-primary)] hover:opacity-90 transition"
                  >
                    {t("cart.exploreBtn")}
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-hairline)] flex-1 overflow-y-auto">
                  {items.map((item, idx) => (
                    <div key={idx} className="p-5 flex gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover border border-[var(--border-hairline)] bg-[var(--bg-secondary)] shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-heading font-bold text-xs uppercase text-[var(--ink-primary)]">
                              {item.product.name}
                            </h4>
                            <div className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase mt-0.5">
                              {item.size} · {item.color}
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveItem(idx)}
                            className="text-[var(--ink-secondary)] hover:text-[var(--status-danger)] p-1 transition"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center border border-[var(--border-hairline)] bg-[var(--bg-primary)]">
                            <button
                              onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                              className="px-2 py-0.5 text-xs font-mono text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-mono text-[var(--ink-primary)] font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs font-mono text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-mono font-medium text-xs text-[var(--ink-primary)]">
                            {(item.product.price * item.quantity).toLocaleString()} EGP
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Promo Code & Bottom Checkout Bar */}
              {items.length > 0 && (
                <div className="p-5 border-t border-[var(--border-hairline)] bg-[var(--bg-elevated)] space-y-4">
                  {/* Promo Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t("cart.promoPlaceholder")}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 p-2.5 text-xs font-mono uppercase border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                    />
                    <button
                      onClick={applyPromo}
                      className="px-4 py-2.5 border border-[var(--border-hairline)] bg-[var(--bg-secondary)] text-[var(--ink-primary)] text-xs font-mono font-bold uppercase hover:bg-[var(--ink-primary)] hover:text-[var(--bg-primary)] transition"
                    >
                      {t("cart.apply")}
                    </button>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-[var(--ink-secondary)]">
                      <span>{t("cart.subtotal")}</span>
                      <span>{subtotal.toLocaleString()} EGP</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-[var(--accent)]">
                        <span>{t("cart.discount")} (10%)</span>
                        <span>-{discount.toLocaleString()} EGP</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[var(--ink-secondary)]">
                      <span>{t("cart.shipping")}</span>
                      <span>{shippingFee === 0 ? t("cart.free") : `${shippingFee} EGP`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-2 border-t border-[var(--border-hairline)] text-[var(--ink-primary)]">
                      <span>{t("cart.total")}</span>
                      <span>{total.toLocaleString()} EGP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      trackEvent(AnalyticsEventType.BEGIN_CHECKOUT);
                      setIsCheckingOut(true);
                    }}
                    className="w-full py-4 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-widest border border-[var(--ink-primary)] hover:opacity-90 active:scale-[0.99] transition flex items-center justify-center gap-2"
                  >
                    <span>{t("cart.checkout")}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
