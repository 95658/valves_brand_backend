import { Product, PRODUCTS } from "@/data/products";

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "all",
    name: "ALL PIECES",
    nameAr: "كل القطع",
    description: "Complete seasonal drop archive",
    descriptionAr: "الأرشيف الكامل لإطلاق الموسم",
  },
  {
    id: "streetwear",
    name: "STREETWEAR",
    nameAr: "ملابس الشارع",
    description: "Heavyweight 460 GSM architectural cuts",
    descriptionAr: "قصات معمارية ثقيلة 460 جرام",
  },
  {
    id: "casual",
    name: "MINIMALIST CASUAL",
    nameAr: "كاجوال مريح",
    description: "Refined Supima cotton everyday essentials",
    descriptionAr: "قطع أساسية يومية من قطن السوبيما الفاخر",
  },
  {
    id: "athleisure",
    name: "ATHLEISURE",
    nameAr: "رياضي وعصري",
    description: "Technical aero-flow training garments",
    descriptionAr: "ملابس تدريب تقنية بنفاذية هواء عالية",
  },
];

const PRODUCTS_STORAGE_KEY = "valves_products_catalog_v2";
const CATEGORIES_STORAGE_KEY = "valves_categories_catalog_v2";

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") {
    return PRODUCTS;
  }
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(PRODUCTS));
      return PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return PRODUCTS;
  } catch (err) {
    console.error("Failed to load products from storage:", err);
    return PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event("valves_products_updated"));
  } catch (err) {
    console.error("Failed to save products to storage:", err);
  }
}

export function createProduct(newProd: Omit<Product, "id"> & { id?: string }): Product {
  const current = getStoredProducts();
  const id = newProd.id?.trim() || `v-custom-${Date.now().toString(36)}`;
  const product: Product = {
    ...newProd,
    id,
    currency: newProd.currency || "EGP",
    sizes: newProd.sizes && newProd.sizes.length > 0 ? newProd.sizes : ["S", "M", "L", "XL"],
    colors: newProd.colors && newProd.colors.length > 0 ? newProd.colors : [{ name: "Obsidian Black", hex: "#09090b" }],
    gallery: newProd.gallery && newProd.gallery.length > 0 ? newProd.gallery : [newProd.image],
    details: newProd.details && newProd.details.length > 0 ? newProd.details : ["Premium heavyweight cotton", "Signature VALVES tailoring"],
  };

  const updated = [product, ...current];
  saveProducts(updated);
  return product;
}

export function updateProduct(id: string, patch: Partial<Product>): Product[] {
  const current = getStoredProducts();
  const updated = current.map((p) => {
    if (p.id === id) {
      return { ...p, ...patch };
    }
    return p;
  });
  saveProducts(updated);
  return updated;
}

export function deleteProduct(id: string): Product[] {
  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== id);
  saveProducts(updated);
  return updated;
}

export function resetProducts(): Product[] {
  saveProducts(PRODUCTS);
  return PRODUCTS;
}

// Categories Management
export function getStoredCategories(): Category[] {
  if (typeof window === "undefined") {
    return DEFAULT_CATEGORIES;
  }
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATEGORIES;
  } catch (err) {
    console.error("Failed to load categories from storage:", err);
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event("valves_categories_updated"));
  } catch (err) {
    console.error("Failed to save categories to storage:", err);
  }
}

export function createCategory(cat: Category): Category[] {
  const current = getStoredCategories();
  const slug = cat.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-") || `cat-${Date.now()}`;
  const newCat: Category = {
    ...cat,
    id: slug,
    name: cat.name.trim().toUpperCase(),
    nameAr: cat.nameAr.trim(),
  };
  const updated = [...current, newCat];
  saveCategories(updated);
  return updated;
}

export function updateCategory(id: string, patch: Partial<Category>): Category[] {
  const current = getStoredCategories();
  const updated = current.map((c) => {
    if (c.id === id) {
      return { ...c, ...patch };
    }
    return c;
  });
  saveCategories(updated);
  return updated;
}

export function deleteCategory(id: string): Category[] {
  if (id === "all") return getStoredCategories(); // Prevent deleting "all"
  const current = getStoredCategories();
  const updated = current.filter((c) => c.id !== id);
  saveCategories(updated);
  return updated;
}

export function resetCategories(): Category[] {
  saveCategories(DEFAULT_CATEGORIES);
  return DEFAULT_CATEGORIES;
}
