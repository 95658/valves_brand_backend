"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { X, Check, Truck, RefreshCw } from "lucide-react";
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
  const { isDark, isRTL, t } = useStore();

  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || "Default");
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string>(product.image);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity, selectedColor);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-6 rtl:pl-0 rtl:pr-6 sm:pl-10 rtl:sm:pl-0 rtl:sm:pr-10">
        <div className="w-screen max-w-xl border-l rtl:border-l-0 rtl:border-r border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--ink-primary)] flex flex-col shadow-2xl overflow-y-auto">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-[var(--border-hairline)] flex items-center justify-between sticky top-0 bg-[var(--bg-elevated)]/95 backdrop-blur-sm z-20">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase block mb-0.5">
                {product.collection} // {product.fabricGsm}
              </span>
              <h2 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight">
                {product.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-primary)] transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* Full Color Main Image Frame */}
            <div className="relative aspect-[4/5] bg-[var(--bg-secondary)] overflow-hidden border border-[var(--border-hairline)]">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.tag && (
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[9px] font-mono tracking-widest text-[var(--accent)] uppercase">
                  {product.tag}
                </div>
              )}
            </div>

            {/* Gallery Thumbnails if multiple images exist */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-2">
                {product.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-16 h-20 border overflow-hidden transition ${
                      activeImage === imgUrl
                        ? "border-[var(--ink-primary)] ring-1 ring-[var(--ink-primary)]"
                        : "border-[var(--border-hairline)] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Pricing Bar */}
            <div className="p-4 border border-[var(--border-hairline)] bg-[var(--bg-secondary)]/50 flex items-baseline justify-between">
              <span className="text-[11px] font-mono uppercase text-[var(--ink-secondary)]">
                PRICE / السعر
              </span>
              <div className="font-mono text-xl font-semibold text-[var(--ink-primary)]">
                {product.price.toLocaleString()}{" "}
                <span className="text-xs uppercase font-normal text-[var(--ink-secondary)]">EGP</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm font-light text-[var(--ink-secondary)] leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-primary)] font-semibold">
                  {t("drawer.selectSize")}: {selectedSize}
                </span>
                <span className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase">
                  ARCHITECTURAL FIT
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2.5 text-xs font-mono font-medium uppercase border transition ${
                      selectedSize === s
                        ? "bg-[var(--ink-primary)] text-[var(--bg-primary)] border-[var(--ink-primary)]"
                        : "bg-[var(--bg-elevated)] border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-primary)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colorway Selector if available */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-[var(--ink-primary)] font-semibold mb-2">
                  {t("drawer.selectColor")}: {selectedColor}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono transition ${
                        selectedColor === c.name
                          ? "border-[var(--ink-primary)] bg-[var(--bg-secondary)]"
                          : "border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--ink-secondary)]"
                      }`}
                    >
                      <span
                        className="w-3 h-3 border border-[var(--border-hairline)]"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fabric Specifications & Cut details */}
            <div className="p-4 border border-[var(--border-hairline)] bg-[var(--bg-secondary)]/30 space-y-2">
              <h4 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[var(--ink-primary)]">
                {t("drawer.fabricSpecs")}
              </h4>
              <ul className="space-y-1.5 text-xs font-light text-[var(--ink-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[var(--accent)]" />
                  <span className="font-mono">{product.fabricGsm} Cairo Milled Egyptian Cotton</span>
                </li>
                {product.details.map((d, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-[var(--accent)]" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery Assurance */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono text-[var(--ink-secondary)]">
              <div className="flex items-center gap-2 p-2.5 border border-[var(--border-hairline)]">
                <Truck size={14} className="text-[var(--accent)] shrink-0" />
                <span>{t("drawer.freeShipping")}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 border border-[var(--border-hairline)]">
                <RefreshCw size={14} className="text-[var(--accent)] shrink-0" />
                <span>{t("drawer.easyReturns")}</span>
              </div>
            </div>
          </div>

          {/* Drawer Sticky Footer with Add to Bag CTA */}
          <div className="p-5 border-t border-[var(--border-hairline)] bg-[var(--bg-elevated)] sticky bottom-0">
            <button
              onClick={handleAdd}
              disabled={addedNotice}
              className="w-full py-4 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-[0.25em] border border-[var(--ink-primary)] hover:opacity-90 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              {addedNotice ? (
                <>
                  <Check size={16} />
                  <span>{t("drawer.addedToBag")}</span>
                </>
              ) : (
                <span>{t("drawer.addToCart")}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
