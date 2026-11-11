"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, ArrowUpRight, Sun, Moon, Globe } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Category } from "@/lib/productStorage";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectCategory: (cat: string) => void;
  activeCategory: string;
  categories: Category[];
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onSelectCategory,
  activeCategory,
  categories,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, lang, toggleTheme, toggleLang, isDark, t } = useStore();

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isDark
          ? "bg-[#09090b]/90 border-zinc-800 text-zinc-100"
          : "bg-white/95 border-zinc-200 text-zinc-900 shadow-sm"
      }`}
    >
      {/* Top Banner Ticker */}
      <div
        className={`text-xs py-1.5 px-4 text-center border-b flex items-center justify-center gap-3 transition-colors ${
          isDark
            ? "bg-[#141417] text-zinc-400 border-zinc-800"
            : "bg-zinc-100 text-zinc-600 border-zinc-200"
        }`}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-volt animate-pulse" />
        <span className="tracking-widest font-space uppercase text-[11px] font-semibold">
          {t("nav.ticker")}
        </span>
      </div>

      <nav className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 transition-colors ${
            isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"
          }`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <svg className={`w-8 h-8 ${isDark ? "text-white" : "text-zinc-900"} group-hover:scale-105 transition-transform`} viewBox="0 0 512 512" fill="none">
            <path d="M 180 200 L 256 385 L 332 200 L 294 200 L 256 295 L 218 200 Z" fill="currentColor" />
            <polygon points="256,325 242,275 270,275" fill="#d4ff00" />
          </svg>
          <div className="flex flex-col">
            <span className="font-space font-extrabold tracking-[0.25em] text-xl sm:text-2xl uppercase leading-none">
              VALVES
            </span>
            <span className={`text-[9px] tracking-[0.3em] font-mono uppercase mt-0.5 hidden sm:block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              CLOTHING CO.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {categories.map((cat) => {
            const label = lang === "ar" ? cat.nameAr || cat.name : cat.name;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`text-xs tracking-[0.15em] font-space font-semibold transition-colors uppercase ${
                  isActive
                    ? "text-volt border-b-2 border-volt pb-1 font-bold"
                    : isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                {label}
              </button>
            );
          })}
          <a
            href="#manifesto"
            className={`text-xs tracking-[0.15em] font-space font-semibold uppercase transition-colors ${
              isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"
            }`}
          >
            {t("nav.archive")}
          </a>
        </div>

        {/* Right Action Controls: Lang, Theme, Admin, Cart */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className={`px-2.5 py-1.5 border text-xs font-mono flex items-center gap-1.5 transition ${
              isDark
                ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                : "bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-800"
            }`}
            title="Switch Language (AR / EN)"
          >
            <Globe size={13} className="text-volt" />
            <span className="font-bold">{lang === "en" ? "عربي" : "EN"}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className={`p-2 border transition ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-amber-400 hover:border-zinc-700"
                : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200"
            }`}
            title="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Admin Dashboard Link */}
          <Link
            href="/admin"
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-[11px] font-space font-bold tracking-wider uppercase transition ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-volt hover:text-volt"
                : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:border-black hover:text-black"
            }`}
          >
            <span>{t("nav.admin")}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-volt" />
          </Link>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className={`relative p-2.5 border transition ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
                : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black hover:border-zinc-300"
            }`}
            aria-label="View Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-volt text-black font-space font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-4 py-6 space-y-4 animate-in slide-in-from-top ${
            isDark ? "bg-[#09090b] border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          {categories.map((cat) => {
            const label = lang === "ar" ? cat.nameAr || cat.name : cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left rtl:text-right text-sm font-space tracking-widest uppercase py-2 transition ${
                  activeCategory === cat.id
                    ? "text-volt font-bold"
                    : isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                {label}
              </button>
            );
          })}
          <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">{t("nav.admin")}</span>
            <Link
              href="/admin"
              className="px-4 py-2 bg-volt text-black font-space text-xs font-bold uppercase"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.admin")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
