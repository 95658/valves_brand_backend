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
import { BrandManifesto } from "@/components/BrandManifesto";
import { Footer } from "@/components/Footer";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { useStorefrontAnalytics, trackEvent } from "@/lib/analytics";
import { AnalyticsEventType } from "@prisma/client";

function StorefrontContent() {
  const { lang, t } = useStore();
  useStorefrontAnalytics();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);

  // Load products and categories from storage & subscribe to admin updates
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

  // Dynamic active title
  const currentCategoryObj = categories.find((c) => c.id === activeCategory);
  const activeTitle = currentCategoryObj
    ? lang === "ar"
      ? currentCategoryObj.nameAr || currentCategoryObj.name
      : currentCategoryObj.name
    : t("catalog.allTitle");

  // Determine if asymmetric 7-piece bento grid applies
  const isSevenPieceBento = activeCategory === "all" && filteredProducts.length === 7;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--ink-primary)] selection:bg-[var(--ink-primary)] selection:text-[var(--bg-primary)]">
      {/* 3-Zone Sticky Navigation (Admin button removed) */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onScrollToCollection={scrollToProducts}
        onScrollToMaterials={scrollToMaterials}
      />

      {/* Hero Editorial Campaign */}
      <Hero onExplore={scrollToProducts} />

      {/* Main Product Catalog Section */}
      <main id="product-catalog" className="flex-1 max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 py-18 sm:py-24 w-full">
        {/* Section Header & Taxonomy Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-hairline)] mb-12">
          <div>
            <div className="text-[10px] font-mono tracking-[0.25em] text-[var(--accent)] uppercase mb-2">
              {t("catalog.archiveLabel")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold uppercase tracking-tight">
              {activeTitle}
            </h2>
          </div>

          {/* Category Tabs & Sort Selector */}
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
          /* Asymmetric 7-Piece Editorial Bento Grid:
             Row 1: 1 featured piece (4 cols) + 1 piece (2 cols) = 6 cols
             Row 2: 3 pieces (2 cols + 2 cols + 2 cols) = 6 cols
             Row 3: 2 wide pieces (3 cols + 3 cols) = 6 cols
          */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
            {/* Row 1: Item 0 (Featured 2 cols of 3 = 4/6 width) */}
            <div className="lg:col-span-4">
              <ProductCard
                product={filteredProducts[0]}
                onSelect={(p) => setSelectedProduct(p)}
                featured={true}
              />
            </div>
            {/* Row 1: Item 1 (1 col of 3 = 2/6 width) */}
            <div className="lg:col-span-2">
              <ProductCard
                product={filteredProducts[1]}
                onSelect={(p) => setSelectedProduct(p)}
              />
            </div>

            {/* Row 2: 3 Pieces (Items 2, 3, 4 = 2/6 width each) */}
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

            {/* Row 3: 2 Wide Pieces (Items 5, 6 = 3/6 width each) */}
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
          /* Standard Balanced Responsive Grid for filtered sub-categories */
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

      {/* Material Proof Editorial Spread (Contrasting 300 GSM vs 460 GSM) */}
      <BrandManifesto />

      {/* Clean Architectural Footer (Mobile app box removed) */}
      <Footer />

      {/* Slide-over Product Detail Drawer */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}
