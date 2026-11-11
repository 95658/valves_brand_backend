"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { X, Check, ShieldCheck, RefreshCw, Truck } from "lucide-react";
import { useStore } from "@/context/StoreContext";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number, color: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const { isDark, lang, t } = useStore();

  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || "Default");
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity, selectedColor);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        className={`relative w-full max-w-4xl border max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl transition-colors ${
          isDark
            ? "bg-[#141417] border-zinc-800 text-zinc-100"
            : "bg-white border-zinc-200 text-zinc-900"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2 rounded-full border transition ${
            isDark
              ? "bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white"
              : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-black"
          }`}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Left Side: Product Imagery */}
        <div className="md:w-1/2 bg-zinc-950 relative min-h-[350px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          {product.tag && (
            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-black/80 border border-zinc-700 px-3 py-1 text-[10px] font-space font-bold tracking-widest text-volt uppercase">
              {product.tag}
            </div>
          )}
        </div>

        {/* Right Side: Product Configuration */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-[10px] font-mono text-volt uppercase mb-2">
              <span>{product.collection}</span>
              <span>•</span>
              <span>{product.fabricGsm}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-space font-extrabold uppercase mb-2">
              {product.name}
            </h2>
            <div className="text-xl font-space font-bold text-volt">
              {product.price.toLocaleString()} {product.currency}
            </div>
          </div>

          <p className={`text-xs sm:text-sm font-light leading-relaxed mb-6 ${
            isDark ? "text-zinc-400" : "text-zinc-600"
          }`}>
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-space font-bold uppercase tracking-wider ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}>
                {t("modal.selectSize")}
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 text-xs font-mono font-bold uppercase border transition ${
                    selectedSize === s
                      ? "bg-volt text-black border-volt"
                      : isDark
                      ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      : "bg-zinc-100 border-zinc-300 text-zinc-800 hover:border-zinc-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <span className={`block text-[11px] font-space font-bold uppercase tracking-wider mb-2 ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}>
                {t("modal.selectColor")}
              </span>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono transition ${
                      selectedColor === c.name
                        ? "border-volt"
                        : isDark
                        ? "border-zinc-800 bg-zinc-900/60"
                        : "border-zinc-300 bg-zinc-100"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-zinc-600"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fabric Specifications */}
          <div className="mb-8">
            <h4 className={`text-[11px] font-space font-bold uppercase tracking-wider mb-2 ${
              isDark ? "text-zinc-300" : "text-zinc-700"
            }`}>
              {t("modal.fabricSpecs")}
            </h4>
            <ul className={`space-y-1.5 text-xs font-light ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              {product.details.map((d, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-volt" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Value Props */}
          <div className={`grid grid-cols-2 gap-3 p-3.5 border mb-6 text-[10px] font-mono ${
            isDark ? "bg-zinc-950/70 border-zinc-800 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600"
          }`}>
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-volt" />
              <span>{t("modal.freeShipping")}</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="text-volt" />
              <span>{t("modal.easyReturns")}</span>
            </div>
          </div>

          {/* Add to Bag CTA */}
          <div className="mt-auto">
            <button
              onClick={handleAdd}
              disabled={addedNotice}
              className="w-full py-4 bg-volt text-black font-space font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#b8e600] active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-lg"
            >
              {addedNotice ? (
                <>
                  <Check size={16} />
                  <span>{t("modal.addedToBag")}</span>
                </>
              ) : (
                <span>{t("modal.addToCart")}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
