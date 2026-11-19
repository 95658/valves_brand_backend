"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";

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
  const { isRTL } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  // Secondary angle image for subtle hover transition if available
  const displayImage =
    isHovered && product.gallery && product.gallery.length > 1
      ? product.gallery[1]
      : product.image;

  return (
    <article
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col transition-all duration-300 hover:border-[var(--ink-primary)]"
    >
      {/* 4:5 Full-Color Editorial Photo Frame (Zero Grayscale Filter) */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Optional Minimalist Tag */}
        {product.tag && (
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 bg-[var(--bg-primary)]/90 backdrop-blur-sm border border-[var(--border-hairline)] text-[9px] font-mono tracking-widest text-[var(--accent)] uppercase">
            {product.tag}
          </div>
        )}
      </div>

      {/* Stripped Information: ONLY Title and Monospace Price */}
      <div className="p-4 sm:p-5 flex items-baseline justify-between gap-3 border-t border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
        <h3 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-[var(--ink-primary)] group-hover:text-[var(--accent)] transition-colors">
          {product.name}
        </h3>
        <div className="font-mono text-xs sm:text-sm font-medium text-[var(--ink-secondary)] whitespace-nowrap">
          {product.price.toLocaleString()} <span className="text-[10px] uppercase font-normal">EGP</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
