"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Sun, Moon } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ValveLogo } from "@/components/ValveLogo";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSizeGuide: () => void;
  onScrollToCollection: () => void;
  onScrollToMaterials: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSizeGuide,
  onScrollToCollection,
  onScrollToMaterials,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, toggleTheme, toggleLang, isDark, isRTL, t } = useStore();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b border-[var(--border-hairline)] bg-[var(--bg-primary)]/90 text-[var(--ink-primary)] transition-colors">
      {/* Top Ticker Bar */}
      <div className="text-xs py-1.5 px-4 text-center border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] text-[var(--ink-secondary)] flex items-center justify-center gap-3 transition-colors">
        <span className="inline-block w-1.5 h-1.5 bg-[var(--accent)]" />
        <span className="tracking-[0.2em] font-mono uppercase text-[10px] font-medium">
          {t("nav.ticker")}
        </span>
      </div>

      {/* 3-Zone Sticky Navigation */}
      <nav className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 h-18 sm:h-20 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* ZONE 1: Brand Monogram & Wordmark (No "CLOTHING CO.") */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[var(--ink-primary)] group-hover:scale-105 transition-transform">
            <ValveLogo className="w-full h-full" />
          </div>
          <span className="font-heading font-extrabold tracking-[0.25em] text-lg sm:text-2xl uppercase leading-none select-none">
            {isRTL ? "فالفز" : "VALVES"}
          </span>
        </Link>

        {/* ZONE 2: Concise Links (Collection, Materials, Size Guide) */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <button
            onClick={onScrollToCollection}
            className="text-xs tracking-[0.2em] font-mono uppercase text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-b hover:border-[var(--accent)] pb-1 transition-all"
          >
            {t("nav.collection")}
          </button>
          <button
            onClick={onScrollToMaterials}
            className="text-xs tracking-[0.2em] font-mono uppercase text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-b hover:border-[var(--accent)] pb-1 transition-all"
          >
            {t("nav.materials")}
          </button>
          <button
            onClick={onOpenSizeGuide}
            className="text-xs tracking-[0.2em] font-mono uppercase text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-b hover:border-[var(--accent)] pb-1 transition-all"
          >
            {t("nav.sizeGuide")}
          </button>
        </div>

        {/* ZONE 3: Bilingual Switcher, Theme Toggle, Shopping Bag (NO ADMIN BUTTON) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher - Clean AR / EN rendering */}
          <button
            onClick={toggleLang}
            className="px-2.5 py-1.5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] text-[var(--ink-primary)] text-xs font-mono uppercase transition flex items-center gap-1.5"
            title="Switch Language: AR / EN"
          >
            <span className="font-bold text-[11px] tracking-wider">
              {lang === "en" ? "AR" : "EN"}
            </span>
          </button>

          {/* Theme Switcher: Light / Dark */}
          <button
            onClick={toggleTheme}
            className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] text-[var(--ink-primary)] transition"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 sm:px-3 sm:py-2 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] text-[var(--ink-primary)] flex items-center gap-2 transition"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline text-xs font-mono tracking-wider uppercase">
              {t("nav.cart")}
            </span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-[var(--ink-primary)] text-[var(--bg-primary)]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu (No Admin Button) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-6 py-6 space-y-4 animate-in slide-in-from-top">
          <button
            onClick={() => {
              onScrollToCollection();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left rtl:text-right text-xs font-mono tracking-[0.2em] uppercase py-2 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition"
          >
            {t("nav.collection")}
          </button>
          <button
            onClick={() => {
              onScrollToMaterials();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left rtl:text-right text-xs font-mono tracking-[0.2em] uppercase py-2 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition"
          >
            {t("nav.materials")}
          </button>
          <button
            onClick={() => {
              onOpenSizeGuide();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left rtl:text-right text-xs font-mono tracking-[0.2em] uppercase py-2 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition"
          >
            {t("nav.sizeGuide")}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
