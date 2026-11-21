"use client";

import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { Search, X, ArrowRight, CornerDownLeft } from "lucide-react";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const { lang, isRTL, t } = useStore();
  const [query, setQuery] = useState("");
  const [activeCollection, setActiveCollection] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    const matchesColl =
      activeCollection === "all" || p.collection.toLowerCase() === activeCollection.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return matchesColl;
    const matchesQuery =
      p.name.toLowerCase().includes(q) ||
      p.fabricGsm.toLowerCase().includes(q) ||
      (p.tag && p.tag.toLowerCase().includes(q)) ||
      p.colors.some((c) => c.name.toLowerCase().includes(q));
    return matchesColl && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center p-4 sm:p-8 md:p-16 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] shadow-2xl flex flex-col font-sans overflow-hidden">
        {/* Top Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-hairline)] flex items-center gap-3 bg-[var(--bg-primary)]">
          <Search className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={
              lang === "ar"
                ? "ابحث عن قطعة، وزن القماش (460 GSM)، اللون..."
                : "Search garment, GSM spec (460 GSM), colorway..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base font-mono outline-none text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/50"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 border border-[var(--border-hairline)] text-xs font-mono text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
          >
            ESC
          </button>
        </div>

        {/* Collection Filter Pills */}
        <div className="px-4 py-2.5 border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
          <span className="text-[var(--ink-secondary)] uppercase text-[10px] mr-1">
            {lang === "ar" ? "القسم:" : "FILTER:"}
          </span>
          {["all", "streetwear", "casual", "athleisure"].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCollection(c)}
              className={`px-2.5 py-1 uppercase tracking-wider transition-colors ${
                activeCollection === c
                  ? "bg-[var(--ink-primary)] text-[var(--bg-primary)] font-bold"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] border border-transparent hover:border-[var(--border-hairline)]"
              }`}
            >
              {c === "all" ? (lang === "ar" ? "الكل" : "ALL PIECES") : c}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[var(--border-hairline)] p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[var(--ink-secondary)]">
              {lang === "ar" ? "لم يتم العثور على قطع مطابقة للبحث." : "No matching garments found."}
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className="p-3 sm:p-4 flex items-center justify-between gap-4 hover:bg-[var(--bg-secondary)] cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-16 sm:w-16 sm:h-20 bg-[var(--bg-secondary)] flex-shrink-0 overflow-hidden border border-[var(--border-hairline)]">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 border border-[var(--border-hairline)] text-[var(--accent)] font-bold uppercase">
                        {p.fabricGsm}
                      </span>
                      {p.tag && (
                        <span className="text-[9px] font-mono text-[var(--ink-secondary)] uppercase">
                          {p.tag}
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-[var(--ink-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {p.name}
                    </h4>
                    <div className="text-[11px] text-[var(--ink-secondary)] font-mono mt-0.5">
                      {p.colors.map((c) => c.name).join(" · ")}
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div className="font-mono text-xs sm:text-sm font-bold text-[var(--ink-primary)]">
                    {p.price.toLocaleString()} <span className="text-[10px] font-normal text-[var(--ink-secondary)]">EGP</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--ink-secondary)] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 group-hover:text-[var(--ink-primary)] transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-[var(--border-hairline)] bg-[var(--bg-secondary)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-secondary)]">
          <span>{filtered.length} ARCHIVAL PIECES FOUND</span>
          <div className="flex items-center gap-1">
            <span>SELECT PIECE</span>
            <CornerDownLeft className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
