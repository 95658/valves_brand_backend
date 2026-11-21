"use client";

import React, { useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

export const LookbookSection: React.FC = () => {
  const { lang, isRTL } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 420;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const looks = [
    {
      id: "look-01",
      title: "LOOK 01 // KINETIC DRAPE",
      piece: "Kinetic Oversized Hoodie (460 GSM)",
      color: "Obsidian Black",
      img: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85",
      coords: "30°02′N 31°14′E",
    },
    {
      id: "look-02",
      title: "LOOK 02 // MODULAR TRANSIT",
      piece: "Valve Modular Cargo Pant",
      color: "Sage Olive",
      img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85",
      coords: "DOWNTOWN CAIRO",
    },
    {
      id: "look-03",
      title: "LOOK 03 // ARCHITECTURAL ESSENTIAL",
      piece: "Monogram Box Tee (300 GSM)",
      color: "Oxidized Copper",
      img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85",
      coords: "ZAMALEK ATELIER",
    },
    {
      id: "look-04",
      title: "LOOK 04 // MONOCHROME TEXTURE",
      piece: "Heavy French Terry Oversized",
      color: "Titanium Charcoal",
      img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85",
      coords: "MAADI HUB",
    },
  ];

  return (
    <section className="py-20 sm:py-28 border-b border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--ink-primary)] transition-colors overflow-hidden">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header with Navigation Arrows */}
        <div className="flex items-end justify-between pb-6 border-b border-[var(--border-hairline)] mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[10px] font-mono tracking-[0.25em] text-[var(--accent)] uppercase mb-3">
              <span>{lang === "ar" ? "لوحة الإطلالات // إطلاق 01" : "EDITORIAL LOOKBOOK // DROP 01"}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold uppercase tracking-tight">
              {lang === "ar" ? "الهيكل الحركي في شوارع القاهرة" : "KINETIC STRUCTURE IN CAIRO ARCHITECTURE"}
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-primary)] hover:border-[var(--ink-primary)] transition-colors"
              aria-label="Previous look"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-primary)] hover:border-[var(--ink-primary)] transition-colors"
              aria-label="Next look"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Filmstrip Gallery */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {looks.map((look) => (
            <article
              key={look.id}
              className="w-[280px] sm:w-[360px] md:w-[420px] flex-shrink-0 snap-start border border-[var(--border-hairline)] bg-[var(--bg-primary)] flex flex-col group"
            >
              {/* Image Frame */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-secondary)]">
                <img
                  src={look.img}
                  alt={look.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[var(--bg-primary)]/90 backdrop-blur-sm px-2 py-0.5 border border-[var(--border-hairline)] font-mono text-[9px] text-[var(--accent)] uppercase tracking-wider">
                  {look.coords}
                </div>
              </div>

              {/* Look Info Footer */}
              <div className="p-4 sm:p-5 border-t border-[var(--border-hairline)] flex items-start justify-between font-mono">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-primary)]">
                    {look.title}
                  </h3>
                  <div className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                    {look.piece} · {look.color}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
