"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  featured = false,
}) => {
  const { isRTL, lang } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Determine current image: explicit colorway preview or hover secondary
  const currentImage =
    activeImageIndex !== null && product.gallery && product.gallery[activeImageIndex]
      ? product.gallery[activeImageIndex]
      : isHovered && product.gallery && product.gallery.length > 1
      ? product.gallery[1]
      : product.image;

  return (
    <article
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImageIndex(null);
      }}
      className="group cursor-pointer border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col transition-all duration-300 hover:border-[var(--ink-primary)] relative"
    >
      {/* 4:5 Full-Color Editorial Photo Frame */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.tag && (
            <div className="px-2 py-0.5 bg-[var(--bg-primary)]/95 backdrop-blur-sm border border-[var(--border-hairline)] text-[9px] font-mono tracking-widest text-[var(--accent)] uppercase font-bold">
              {product.tag}
            </div>
          )}
          <div className="px-2 py-0.5 bg-[var(--bg-primary)]/90 backdrop-blur-sm border border-[var(--border-hairline)] text-[9px] font-mono tracking-wider text-[var(--ink-secondary)] uppercase">
            {product.fabricGsm}
          </div>
        </div>

        {/* Hover Quick Action Pill */}
        <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-full py-2 bg-[var(--bg-elevated)]/95 backdrop-blur-md border border-[var(--border-hairline)] text-center text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[var(--ink-primary)] flex items-center justify-center gap-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{lang === "ar" ? "معاينة القطعة والمقاسات" : "VIEW SPECIFICATIONS"}</span>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="p-4 sm:p-5 flex flex-col gap-2 border-t border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-[var(--ink-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="font-mono text-xs sm:text-sm font-bold text-[var(--ink-primary)] whitespace-nowrap">
            {product.price.toLocaleString()} <span className="text-[10px] uppercase font-normal text-[var(--ink-secondary)]">EGP</span>
          </div>
        </div>

        {/* Colorway Swatches Preview */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-hairline)] text-[10px] font-mono text-[var(--ink-secondary)]">
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                onMouseEnter={() => {
                  if (product.gallery && product.gallery[idx]) {
                    setActiveImageIndex(idx);
                  }
                }}
                className={`w-3.5 h-3.5 border transition-all ${
                  activeImageIndex === idx ? "border-[var(--ink-primary)] scale-125" : "border-[var(--border-hairline)]"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Colorway ${color.name}`}
              />
            ))}
          </div>
          <span className="uppercase tracking-wider">
            {product.sizes.length} {lang === "ar" ? "مقاسات" : "SIZES"}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
