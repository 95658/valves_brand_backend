"use client";

import React from "react";
import { Product } from "@/data/products";
import { Eye } from "lucide-react";
import { useStore } from "@/context/StoreContext";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
}) => {
  const { isDark, t } = useStore();

  return (
    <div
      className={`group relative border flex flex-col transition-all duration-300 ${
        isDark
          ? "bg-[#141417] border-zinc-800 hover:border-zinc-600"
          : "bg-white border-zinc-200 shadow-sm hover:border-zinc-400"
      }`}
    >
      {/* Product Image Frame */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-zinc-950 cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 contrast-110 transition-all duration-700 group-hover:scale-105"
        />

        {/* Tag Pill */}
        {product.tag && (
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-10 bg-black/80 backdrop-blur-md border border-zinc-700/60 px-2.5 py-1 text-[9px] font-space font-bold tracking-widest text-volt uppercase">
            {product.tag}
          </div>
        )}

        {/* GSM Indicator Pill */}
        <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 z-10 bg-black/85 border border-zinc-800 px-2 py-0.5 text-[9px] font-mono text-zinc-300 uppercase">
          {product.fabricGsm}
        </div>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-3 rounded-full bg-white text-black hover:bg-volt transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg"
            title={t("catalog.quickView")}
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Product Details Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            onClick={() => onQuickView(product)}
            className="font-space font-bold text-sm tracking-wider uppercase transition-colors cursor-pointer hover:text-volt"
          >
            {product.name}
          </h3>
          <span className="font-space font-bold text-sm text-volt whitespace-nowrap">
            {product.price.toLocaleString()} {product.currency}
          </span>
        </div>

        <p className={`text-xs line-clamp-2 mb-4 font-light ${
          isDark ? "text-zinc-400" : "text-zinc-600"
        }`}>
          {product.description}
        </p>

        {/* Size Selection & Quick Add */}
        <div className={`mt-auto pt-3 border-t flex items-center justify-between gap-2 ${
          isDark ? "border-zinc-800" : "border-zinc-200"
        }`}>
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.sizes.slice(0, 4).map((size) => (
              <button
                key={size}
                onClick={() => onAddToCart(product, size)}
                className={`text-[10px] font-mono font-semibold px-2 py-1 border transition-colors ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-volt hover:text-volt"
                    : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:border-black hover:text-black"
                }`}
                title={`Add size ${size} to bag`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="text-[10px] font-space font-bold tracking-wider uppercase text-volt hover:underline"
          >
            {t("catalog.quickView")}
          </button>
        </div>
      </div>
    </div>
  );
};
