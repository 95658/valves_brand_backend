"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { X, Trash2, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { addOrder } from "@/lib/orderStorage";
import { Order } from "@/data/orders";
import { useStore } from "@/context/StoreContext";

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
  const { isDark, lang, t } = useStore();
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
  const [paymentMethod, setPaymentMethod] = useState<"Cash on Delivery (COD)" | "Credit Card" | "InstaPay">("Cash on Delivery (COD)");

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
      alert(lang === "en" ? "Invalid code. Try 'VALVES10' for 10% off!" : "كود غير صحيح. جرب 'VALVES10' لخصم 10%!");
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const newOrder: Order = {
      id: `VLV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || (lang === "en" ? "Guest Customer" : "عميل كريم"),
      email: `${customerName.toLowerCase().replace(/\s+/g, "") || "client"}@valves-customer.eg`,
      phone: customerPhone || "+20 100 000 0000",
      city: customerCity,
      address: customerAddress || "Downtown Cairo",
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className={`fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10`}
      >
        <div
          className={`w-screen max-w-md border-l rtl:border-l-0 rtl:border-r flex flex-col shadow-2xl transition-colors ${
            isDark
              ? "bg-[#141417] border-zinc-800 text-zinc-100"
              : "bg-white border-zinc-200 text-zinc-900"
          }`}
        >
          {/* Header */}
          <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
            isDark ? "border-zinc-800" : "border-zinc-200"
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-volt" />
              <h2 className="font-space font-extrabold text-sm sm:text-base uppercase tracking-widest">
                {t("cart.title")}
              </h2>
            </div>
            <button
              onClick={resetDrawer}
              className={`p-1.5 rounded-full border transition ${
                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white" : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-black"
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* SUCCESS SCREEN */}
          {checkoutSuccess ? (
            <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-volt/20 text-volt border border-volt/30 flex items-center justify-center mb-6">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-space font-extrabold uppercase mb-2">
                {t("cart.orderSuccess")}
              </h3>
              <div className="text-xs font-mono text-volt bg-zinc-900 px-3 py-1.5 border border-zinc-800 mb-4">
                ORDER #{confirmedOrderId}
              </div>
              <p className={`text-xs font-light leading-relaxed max-w-xs mb-8 ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}>
                {t("cart.orderSuccessMsg")}
              </p>
              <button
                onClick={resetDrawer}
                className="w-full py-3.5 bg-volt text-black font-space font-bold text-xs uppercase tracking-widest hover:bg-[#b8e600] transition"
              >
                {t("cart.exploreBtn")}
              </button>
            </div>
          ) : isCheckingOut ? (
            /* CHECKOUT FORM VIEW */
            <form onSubmit={handleCreateOrder} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <span className="font-space font-bold text-sm uppercase text-volt">
                  {lang === "en" ? "DISPATCH DETAILS" : "بيانات الشحن والتوصيل"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className={`text-[11px] underline ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
                >
                  {lang === "en" ? "Back to items" : "العودة للقطع"}
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">{t("cart.fullName")} *</label>
                <input
                  type="text"
                  required
                  placeholder="Omar El-Sayed"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full p-2.5 border uppercase ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-zinc-100 border-zinc-300 text-zinc-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">{t("cart.phone")} *</label>
                <input
                  type="tel"
                  required
                  placeholder="01012345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={`w-full p-2.5 border ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-zinc-100 border-zinc-300 text-zinc-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">{t("cart.city")} *</label>
                <select
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className={`w-full p-2.5 border uppercase ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-zinc-100 border-zinc-300 text-zinc-900"
                  }`}
                >
                  <option value="New Cairo">New Cairo (التجمع الخامس)</option>
                  <option value="Sheikh Zayed">Sheikh Zayed &amp; 6th of October</option>
                  <option value="Maadi">Maadi (المعادي)</option>
                  <option value="Heliopolis">Heliopolis / Nasr City</option>
                  <option value="Alexandria">Alexandria (الإسكندرية)</option>
                  <option value="Mansoura & Delta">Mansoura &amp; Delta</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">{t("cart.address")} *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Building 14, St 9, Apt 3"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className={`w-full p-2.5 border ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-zinc-100 border-zinc-300 text-zinc-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">{t("cart.paymentMethod")}</label>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-space font-bold uppercase">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash on Delivery (COD)")}
                    className={`p-2.5 border text-center transition ${
                      paymentMethod.includes("COD")
                        ? "bg-volt text-black border-volt"
                        : isDark
                        ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                        : "bg-zinc-100 border-zinc-300 text-zinc-700"
                    }`}
                  >
                    COD (كاش)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Credit Card")}
                    className={`p-2.5 border text-center transition ${
                      paymentMethod.includes("Card")
                        ? "bg-volt text-black border-volt"
                        : isDark
                        ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                        : "bg-zinc-100 border-zinc-300 text-zinc-700"
                    }`}
                  >
                    CARD (فيزا)
                  </button>
                </div>
              </div>

              <div className={`p-4 border mt-4 space-y-1.5 ${
                isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-100 border-zinc-200"
              }`}>
                <div className="flex justify-between">
                  <span>{t("cart.subtotal")}</span>
                  <span>{subtotal.toLocaleString()} EGP</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-volt">
                    <span>{t("cart.discount")}</span>
                    <span>-{discount.toLocaleString()} EGP</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t("cart.shipping")}</span>
                  <span>{shippingFee === 0 ? t("cart.free") : `${shippingFee} EGP`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-zinc-800">
                  <span>{t("cart.total")}</span>
                  <span className="text-volt">{total.toLocaleString()} EGP</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-volt text-black font-space font-bold text-xs uppercase tracking-widest hover:bg-[#b8e600] transition mt-4"
              >
                {t("cart.placeOrder")}
              </button>
            </form>
          ) : (
            /* CART ITEMS VIEW */
            <>
              {/* Free Shipping Ticker */}
              <div className={`p-4 border-b ${
                isDark ? "bg-zinc-950/60 border-zinc-800" : "bg-zinc-50 border-zinc-200"
              }`}>
                <div className="flex justify-between text-[11px] font-space font-semibold uppercase mb-1.5">
                  <span>
                    {remainingForFreeShipping > 0
                      ? `${remainingForFreeShipping.toLocaleString()} EGP ${t("cart.freeShippingProgress")}`
                      : t("cart.freeShippingUnlocked")}
                  </span>
                  <span className="text-volt">{Math.round(progressPercent)}%</span>
                </div>
                <div className={`w-full h-1.5 ${isDark ? "bg-zinc-800" : "bg-zinc-200"} rounded-full overflow-hidden`}>
                  <div
                    className="h-full bg-volt transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-zinc-800/40">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <p className={`text-xs font-mono uppercase tracking-wider mb-6 ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}>
                      {t("cart.empty")}
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-volt text-black font-space font-bold text-xs uppercase tracking-widest hover:bg-[#b8e600] transition"
                    >
                      {t("cart.exploreBtn")}
                    </button>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="py-4 flex gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-space font-bold text-xs uppercase leading-snug">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(idx)}
                              className={`p-1 transition ${
                                isDark ? "text-zinc-500 hover:text-red-400" : "text-zinc-400 hover:text-red-600"
                              }`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className={`text-[10px] font-mono mt-1 ${
                            isDark ? "text-zinc-400" : "text-zinc-600"
                          }`}>
                            {item.size} • {item.color} • {item.product.fabricGsm}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className={`flex items-center border ${
                            isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-300 bg-zinc-100"
                          }`}>
                            <button
                              onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                              className="px-2 py-0.5 text-xs font-mono hover:text-volt"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 text-xs font-mono">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs font-mono hover:text-volt"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-space font-bold text-xs text-volt">
                            {(item.product.price * item.quantity).toLocaleString()} EGP
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer Summary */}
              {items.length > 0 && (
                <div className={`p-4 sm:p-6 border-t space-y-4 ${
                  isDark ? "border-zinc-800 bg-zinc-950/70" : "border-zinc-200 bg-zinc-50"
                }`}>
                  {/* Promo Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t("cart.promoPlaceholder")}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className={`flex-1 p-2 text-xs font-mono uppercase border ${
                        isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                      }`}
                    />
                    <button
                      onClick={applyPromo}
                      className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-space font-bold hover:border-volt hover:text-volt uppercase transition"
                    >
                      {t("cart.apply")}
                    </button>
                  </div>

                  {/* Financial Lines */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className={`flex justify-between ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                      <span>{t("cart.subtotal")}</span>
                      <span>{subtotal.toLocaleString()} EGP</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-volt">
                        <span>{t("cart.discount")}</span>
                        <span>-{discount.toLocaleString()} EGP</span>
                      </div>
                    )}
                    <div className={`flex justify-between ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                      <span>{t("cart.shipping")}</span>
                      <span>{shippingFee === 0 ? t("cart.free") : `${shippingFee} EGP`}</span>
                    </div>
                    <div className={`flex justify-between text-sm font-bold pt-2 border-t ${
                      isDark ? "border-zinc-800 text-white" : "border-zinc-200 text-zinc-900"
                    }`}>
                      <span>{t("cart.total")}</span>
                      <span className="text-volt">{total.toLocaleString()} EGP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full py-4 bg-volt text-black font-space font-bold text-xs uppercase tracking-widest hover:bg-[#b8e600] transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>{t("cart.checkout")}</span>
                    {lang === "ar" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
