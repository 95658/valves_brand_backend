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

function StorefrontContent() {
  const { isDark, lang, t } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Load products and categories, and listen for admin updates
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

  // Dynamic active title
  const currentCategoryObj = categories.find((c) => c.id === activeCategory);
  const activeTitle = currentCategoryObj
    ? lang === "ar"
      ? currentCategoryObj.nameAr || currentCategoryObj.name
      : currentCategoryObj.name
    : t("catalog.allTitle");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation with Categories & Language/Theme controls */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToProducts();
        }}
        activeCategory={activeCategory}
        categories={categories}
      />

      {/* Hero Header Section */}
      <Hero onExplore={scrollToProducts} />

      {/* Product Catalog Section */}
      <main id="product-catalog" className="flex-1 max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 py-20 w-full">
        {/* Section Control Bar */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b mb-12 ${
          isDark ? "border-zinc-800" : "border-zinc-200"
        }`}>
          <div>
            <div className="text-xs font-space font-bold tracking-[0.25em] text-volt uppercase mb-2">
              {t("catalog.archiveLabel")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-space font-extrabold tracking-tight uppercase">
              {activeTitle}
            </h2>
          </div>

          {/* Category Tabs & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className={`flex items-center border p-1 flex-wrap ${
              isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200 shadow-sm"
            }`}>
              {categories.map((tab) => {
                const label = lang === "ar" ? tab.nameAr || tab.name : tab.name;
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1.5 text-xs font-space font-semibold tracking-wider uppercase transition-colors ${
                      isActive
                        ? "bg-volt text-black font-bold"
                        : isDark
                        ? "text-zinc-400 hover:text-white"
                        : "text-zinc-600 hover:text-black"
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
                className={`border text-xs font-space font-semibold py-2.5 px-3 uppercase focus:outline-none focus:border-volt cursor-pointer ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                    : "bg-white border-zinc-300 text-zinc-800 shadow-sm"
                }`}
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
            <p className={`text-xs font-mono uppercase tracking-widest ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}>
              {t("catalog.noPieces")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
                onAddToCart={(p, size) => handleAddToCart(p, size, 1)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Brand Manifesto & Quality Assurance */}
      <BrandManifesto />

      {/* Footer */}
      <Footer />

      {/* Detailed Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
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
