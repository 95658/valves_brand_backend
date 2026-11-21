"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product } from "@/data/products";
import { Category, getStoredCategories, getStoredProducts } from "@/lib/productStorage";
import { StoreProvider, useStore } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { CartDrawer, CartItem } from "@/components/CartDrawer";
import { FabricLab } from "@/components/FabricLab";
import { LookbookSection } from "@/components/LookbookSection";
import { Footer } from "@/components/Footer";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { QuickSearchModal } from "@/components/QuickSearchModal";
import { useStorefrontAnalytics, trackEvent } from "@/lib/analytics";
import { AnalyticsEventType } from "@prisma/client";
import { LayoutGrid, Grid3X3, ListFilter, SlidersHorizontal } from "lucide-react";

function StorefrontContent() {
  const { lang, t } = useStore();
  useStorefrontAnalytics();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [viewMode, setViewMode] = useState<"bento" | "grid" | "spec">("bento");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Load products and categories from storage & subscribe to updates
  useEffect(() => {
    const loadData = () => {
      setProducts(getStoredProducts());
      setCategories(getStoredCategories());
    };

    loadData();

    window.addEventListener("valves_products_updated", loadData);
    window.addEventListener("valves_categories_updated", loadData);

    return () => {
      window.removeEventListener("valves_products_updated", loadData);
      window.removeEventListener("valves_categories_updated", loadData);
    };
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list =
      activeCategory === "all"
        ? [...products]
        : products.filter((p) => p.collection.toLowerCase() === activeCategory.toLowerCase());

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, activeCategory, sortBy]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: string,
    quantity: number = 1,
    color: string = product.colors[0]?.name || "Default"
  ) => {
    trackEvent(AnalyticsEventType.ADD_TO_BAG, { productId: product.id });
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, size, color, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToProducts = () => {
    const el = document.getElementById("product-catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToMaterials = () => {
    const el = document.getElementById("materials");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isSevenPieceBento = activeCategory === "all" && filteredProducts.length === 7 && viewMode === "bento";

  const activeTitle = useMemo(() => {
    if (activeCategory === "all") return t("catalog.allTitle");
    if (activeCategory === "streetwear") return t("catalog.streetwearTitle");
    if (activeCategory === "casual") return t("catalog.casualTitle");
    if (activeCategory === "athleisure") return t("catalog.athleisureTitle");
    const found = categories.find((c) => c.id === activeCategory);
    return found ? (lang === "ar" ? found.nameAr : found.name) : t("catalog.allTitle");
  }, [activeCategory, categories, lang, t]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--ink-primary)] selection:bg-[var(--ink-primary)] selection:text-[var(--bg-primary)] flex flex-col transition-colors">
      {/* 3-Zone Sticky Architectural Header with Search Trigger */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onScrollToCollection={scrollToProducts}
        onScrollToMaterials={scrollToMaterials}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Full-Color Editorial Campaign Hero with Shop-The-Look Hotspots */}
      <Hero
        onExplore={scrollToProducts}
        onSelectProductById={(id) => {
          const found = products.find((p) => p.id === id);
          if (found) setSelectedProduct(found);
        }}
      />

      {/* Main Catalog Viewport */}
      <main id="product-catalog" className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        {/* Catalog Control Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-hairline)] mb-12">
          <div>
            <div className="text-[10px] font-mono tracking-[0.25em] text-[var(--accent)] uppercase mb-2">
              {t("catalog.archiveLabel")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold uppercase tracking-tight">
              {activeTitle}
            </h2>
          </div>

          {/* Category Tabs, View Switcher & Sort Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-1 flex-wrap">
              {categories.map((tab) => {
                const label = lang === "ar" ? tab.nameAr || tab.name : tab.name;
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition ${
                      isActive
                        ? "bg-[var(--ink-primary)] text-[var(--bg-primary)] font-semibold"
                        : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Layout View Mode Switcher */}
            <div className="hidden lg:flex items-center border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-1">
              <button
                onClick={() => setViewMode("bento")}
                className={`p-1.5 text-xs transition ${
                  viewMode === "bento"
                    ? "bg-[var(--ink-primary)] text-[var(--bg-primary)] font-bold"
                    : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                }`}
                title="Editorial Bento Layout"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 text-xs transition ${
                  viewMode === "grid"
                    ? "bg-[var(--ink-primary)] text-[var(--bg-primary)] font-bold"
                    : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                }`}
                title="Symmetrical 3-Column Grid"
              >
                <Grid3X3 size={15} />
              </button>
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--ink-primary)] text-xs font-mono uppercase py-2.5 px-3 focus:outline-none focus:border-[var(--ink-primary)] cursor-pointer"
              >
                <option value="featured">{t("catalog.sortFeatured")}</option>
                <option value="price-asc">{t("catalog.sortPriceAsc")}</option>
                <option value="price-desc">{t("catalog.sortPriceDesc")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--ink-secondary)]">
              {t("catalog.noPieces")}
            </p>
          </div>
        ) : isSevenPieceBento ? (
          /* Asymmetric 7-Piece Editorial Bento Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
            <div className="lg:col-span-4">
              <ProductCard
                product={filteredProducts[0]}
                onSelect={(p) => setSelectedProduct(p)}
                featured={true}
              />
            </div>
            <div className="lg:col-span-2">
              <ProductCard
                product={filteredProducts[1]}
                onSelect={(p) => setSelectedProduct(p)}
              />
            </div>
            <div className="lg:col-span-2">
              <ProductCard
                product={filteredProducts[2]}
                onSelect={(p) => setSelectedProduct(p)}
              />
            </div>
            <div className="lg:col-span-2">
              <ProductCard
                product={filteredProducts[3]}
                onSelect={(p) => setSelectedProduct(p)}
              />
            </div>
            <div className="lg:col-span-2">
              <ProductCard
                product={filteredProducts[4]}
                onSelect={(p) => setSelectedProduct(p)}
              />
            </div>
            <div className="lg:col-span-3">
              <ProductCard
                product={filteredProducts[5]}
                onSelect={(p) => setSelectedProduct(p)}
              />
            </div>
            <div className="lg:col-span-3">
              <ProductCard
                product={filteredProducts[6]}
                onSelect={(p) => setSelectedProduct(p)}
              />
            </div>
          </div>
        ) : (
          /* Standard Balanced Responsive Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Interactive Fabric Laboratory (Replacing Static Manifesto) */}
      <FabricLab />

      {/* Editorial Lookbook Filmstrip (Runway Silhouettes in Cairo Architecture) */}
      <LookbookSection />

      {/* Clean Architectural Footer */}
      <Footer />

      {/* Slide-over Garment Dossier with Fit Recommender */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* High-Conversion Shopping Bag & Concierge Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Quick Visual Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}
