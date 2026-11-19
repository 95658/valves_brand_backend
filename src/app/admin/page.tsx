"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/data/orders";
import { getStoredOrders, updateOrderStatus } from "@/lib/orderStorage";
import { Product } from "@/data/products";
import {
  Category,
  getStoredCategories,
  getStoredProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  resetCategories,
} from "@/lib/productStorage";
import { ValveLogo } from "@/components/ValveLogo";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Truck,
  Search,
  ArrowUpRight,
  Printer,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  RefreshCw,
  Eye,
  Check,
  ChevronDown,
  Sun,
  Moon,
  Lock,
  LogOut,
  ShieldCheck,
  KeyRound,
  User,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  FolderPlus,
} from "lucide-react";

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Appearance & Localization (Default to light mode to match system default)
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"en" | "ar">("en");

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<
    "orders" | "products" | "categories" | "inventory" | "analytics"
  >("orders");

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Products & Categories State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("ALL");

  // Product Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    collection: "streetwear" as any,
    price: 1500,
    currency: "EGP",
    fabricGsm: "460 GSM",
    tag: "DROP 01",
    description: "",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
    sizes: "S, M, L, XL",
    details: "Heavyweight Egyptian cotton\nDouble-needle tailored stitching",
  });

  // Category Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
    nameAr: "",
    description: "",
  });

  // Notifications
  const [notification, setNotification] = useState<string | null>(null);

  // Apply theme to document root
  const applyThemeToDOM = (t: "light" | "dark") => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (t === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    }
  };

  const applyLangToDOM = (l: "en" | "ar") => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.lang = l;
      root.dir = l === "ar" ? "rtl" : "ltr";
    }
  };

  // Initialize data & preferences
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("valves_admin_auth");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
      }
      const storedTheme = (localStorage.getItem("valves_admin_theme") ||
        localStorage.getItem("valves_store_theme")) as "light" | "dark";
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
        applyThemeToDOM(storedTheme);
      } else {
        applyThemeToDOM("light");
      }
      const storedLang = (localStorage.getItem("valves_admin_lang") ||
        localStorage.getItem("valves_store_lang")) as "en" | "ar";
      if (storedLang === "ar" || storedLang === "en") {
        setLang(storedLang);
        applyLangToDOM(storedLang);
      } else {
        applyLangToDOM("en");
      }
    } catch {
      applyThemeToDOM("light");
      applyLangToDOM("en");
    } finally {
      setAuthChecking(false);
      loadAllData();
    }
  }, []);

  const loadAllData = () => {
    setOrders(getStoredOrders());
    setProducts(getStoredProducts());
    setCategories(getStoredCategories());
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyThemeToDOM(next);
    try {
      localStorage.setItem("valves_admin_theme", next);
      localStorage.setItem("valves_store_theme", next);
    } catch {}
  };

  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
    applyLangToDOM(next);
    try {
      localStorage.setItem("valves_admin_lang", next);
      localStorage.setItem("valves_store_lang", next);
    } catch {}
  };

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const u = loginUsername.trim().toLowerCase();
    const p = loginPassword.trim();

    if (
      (u === "admin" || u === "admin@valves.co") &&
      (p === "admin" || p === "valves" || p === "valves2026" || p === "123456")
    ) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem("valves_admin_auth", "true");
      } catch {}
      showToast(lang === "en" ? "Authenticated successfully" : "تم تسجيل الدخول بنجاح");
    } else {
      setLoginError(
        lang === "en"
          ? "Invalid credentials. Use demo: admin / valves2026"
          : "بيانات غير صحيحة. البيانات التجريبية: admin / valves2026"
      );
    }
  };

  const handleAutoFill = () => {
    setLoginUsername("admin");
    setLoginPassword("valves2026");
    setLoginError("");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("valves_admin_auth");
    } catch {}
    showToast(lang === "en" ? "Logged out" : "تم تسجيل الخروج");
  };

  // Order Status Handler
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    showToast(
      lang === "en"
        ? `Order #${orderId} marked as ${newStatus}`
        : `تم تحديث الطلب #${orderId} إلى ${newStatus}`
    );
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      collection: categories.find((c) => c.id !== "all")?.id || "streetwear",
      price: 1500,
      currency: "EGP",
      fabricGsm: "460 GSM",
      tag: "DROP 01",
      description: "Engineered architectural streetwear piece crafted with premium Egyptian cotton.",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      sizes: "S, M, L, XL",
      details: "Heavyweight French Terry\nReinforced seams\nTailored boxy fit",
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      collection: prod.collection,
      price: prod.price,
      currency: prod.currency || "EGP",
      fabricGsm: prod.fabricGsm,
      tag: prod.tag || "",
      description: prod.description,
      image: prod.image,
      sizes: prod.sizes.join(", "),
      details: prod.details.join("\n"),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = productForm.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const detailsArray = productForm.details
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    if (editingProduct) {
      const updated = updateProduct(editingProduct.id, {
        name: productForm.name.toUpperCase(),
        collection: productForm.collection,
        price: Number(productForm.price),
        fabricGsm: productForm.fabricGsm,
        tag: productForm.tag,
        description: productForm.description,
        image: productForm.image,
        sizes: sizesArray.length > 0 ? sizesArray : ["S", "M", "L", "XL"],
        details: detailsArray.length > 0 ? detailsArray : ["Premium Egyptian cotton"],
      });
      setProducts(updated);
      showToast(lang === "en" ? "Product updated" : "تم تحديث القطعة");
    } else {
      createProduct({
        name: productForm.name.toUpperCase(),
        collection: productForm.collection,
        price: Number(productForm.price),
        currency: "EGP",
        fabricGsm: productForm.fabricGsm,
        tag: productForm.tag,
        description: productForm.description,
        image: productForm.image,
        gallery: [productForm.image],
        sizes: sizesArray.length > 0 ? sizesArray : ["S", "M", "L", "XL"],
        details: detailsArray.length > 0 ? detailsArray : ["Premium Egyptian cotton"],
        colors: [{ name: "Obsidian Black", hex: "#0D0E10" }],
      });
      setProducts(getStoredProducts());
      showToast(lang === "en" ? "Piece added to archive" : "تمت إضافة القطعة");
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(lang === "en" ? `Delete ${name}?` : `هل أنت متأكد من حذف ${name}؟`)) {
      const updated = deleteProduct(id);
      setProducts(updated);
      showToast(lang === "en" ? "Piece deleted" : "تم حذف القطعة");
    }
  };

  const handleResetProducts = () => {
    if (confirm(lang === "en" ? "Reset catalogue to default pieces?" : "استعادة الكتالوج الافتراضي؟")) {
      const updated = resetProducts();
      setProducts(updated);
      showToast(lang === "en" ? "Catalogue reset" : "تمت الاستعادة");
    }
  };

  // Category CRUD
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      id: "",
      name: "",
      nameAr: "",
      description: "",
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      nameAr: cat.nameAr,
      description: cat.description || "",
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      const updated = updateCategory(editingCategory.id, {
        name: categoryForm.name.toUpperCase(),
        nameAr: categoryForm.nameAr,
        description: categoryForm.description,
      });
      setCategories(updated);
      showToast(lang === "en" ? "Category updated" : "تم تحديث القسم");
    } else {
      const slug =
        categoryForm.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-") ||
        `cat-${Date.now()}`;
      const updated = createCategory({
        id: slug,
        name: categoryForm.name.toUpperCase(),
        nameAr: categoryForm.nameAr,
        description: categoryForm.description,
      });
      setCategories(updated);
      showToast(lang === "en" ? "Category created" : "تم إنشاء القسم");
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (cat: Category) => {
    if (cat.id === "all") {
      alert(lang === "en" ? "Root category cannot be deleted." : "لا يمكن حذف القسم الرئيسي.");
      return;
    }
    if (confirm(lang === "en" ? `Delete category '${cat.name}'?` : `حذف قسم '${cat.nameAr || cat.name}'؟`)) {
      const updated = deleteCategory(cat.id);
      setCategories(updated);
      showToast(lang === "en" ? "Category deleted" : "تم حذف القسم");
    }
  };

  const handleResetCategories = () => {
    if (confirm(lang === "en" ? "Reset categories to default?" : "استعادة الأقسام الافتراضية؟")) {
      const updated = resetCategories();
      setCategories(updated);
      showToast(lang === "en" ? "Categories reset" : "تمت الاستعادة");
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        statusFilter === "ALL" || o.status.toUpperCase() === statusFilter.toUpperCase();
      const query = orderSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        o.id.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.phone.toLowerCase().includes(query) ||
        o.city.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, orderSearchQuery]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        productCategoryFilter === "ALL" ||
        p.collection.toLowerCase() === productCategoryFilter.toLowerCase();
      const query = productSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.fabricGsm.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [products, productCategoryFilter, productSearchQuery]);

  // Analytics Metrics
  const metrics = useMemo(() => {
    const totalRev = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    const pendingCount = orders.filter((o) => o.status === "Pending").length;
    const confirmedCount = orders.filter((o) => o.status === "Confirmed").length;
    const shippedCount = orders.filter((o) => o.status === "Shipped").length;
    const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
    const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

    const validOrdersCount = orders.filter((o) => o.status !== "Cancelled").length;
    const aov = validOrdersCount > 0 ? Math.round(totalRev / validOrdersCount) : 0;

    return {
      totalRev,
      pendingCount,
      confirmedCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      aov,
      totalOrders: orders.length,
    };
  }, [orders]);

  // Status badge styling with muted architectural tones
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/40";
      case "Confirmed":
        return "bg-[var(--status-success)]/10 text-[var(--status-success)] border-[var(--status-success)]/40";
      case "Shipped":
        return "bg-[var(--ink-secondary)]/10 text-[var(--ink-primary)] border-[var(--border-hairline)]";
      case "Delivered":
        return "bg-[var(--status-success)]/20 text-[var(--status-success)] border-[var(--status-success)]/50";
      case "Cancelled":
        return "bg-[var(--status-danger)]/10 text-[var(--status-danger)] border-[var(--status-danger)]/40";
    }
  };

  // Translations
  const t = {
    en: {
      storefront: "STOREFRONT",
      atelierTitle: "VALVES ATELIER · CONTROL CENTER",
      loginSubtitle: "ARCHITECTURAL APPAREL LAB // AUTHENTICATED ACCESS",
      syncOrders: "SYNC",
      viewLiveStore: "LIVE STORE",
      logout: "LOGOUT",

      // Tabs
      ordersTab: `ORDERS (${orders.length})`,
      productsTab: `PRODUCTS (${products.length})`,
      categoriesTab: `CATEGORIES (${categories.length})`,
      inventoryTab: "GSM FABRIC LAB",
      analyticsTab: "DROP 01 REVENUE",

      // Products Tab
      manageProducts: "ARCHIVAL CATALOGUE MANAGEMENT",
      manageProductsSub: "Modify piece specifications, pricing, and Cairo fabric weights.",
      addPieceBtn: "ADD PIECE",
      resetCatalogBtn: "RESET DEFAULT DROP",
      searchProductsPlaceholder: "SEARCH BY PIECE, GSM, OR ID...",
      allCategoriesFilter: "ALL CATEGORIES",
      pieceCol: "PIECE",
      collectionCol: "COLLECTION",
      priceCol: "PRICE",
      gsmCol: "FABRIC GSM",
      sizesCol: "SIZES",
      actionsCol: "ACTIONS",
      noProductsFound: "NO PRODUCTS MATCH CRITERIA",

      // Categories Tab
      manageCategories: "STORE TAXONOMY & DIVISIONS",
      manageCategoriesSub: "Manage divisions displayed on the storefront navigation bar.",
      addCategoryBtn: "ADD CATEGORY",
      resetCategoriesBtn: "RESET DEFAULTS",
      categorySlug: "SLUG / ID",
      categoryNameEn: "TITLE (EN)",
      categoryNameAr: "TITLE (AR)",
      productCount: "LINKED PIECES",

      // Orders Tab
      netRevenue: "NET REVENUE",
      vsLastDrop: "+34.8% vs last drop batch",
      actionRequired: "ACTION REQUIRED",
      newOrders: "NEW ORDERS",
      awaitingCourier: "Awaiting courier confirmation",
      avgBasket: "AVERAGE BASKET",
      perOrder: "EGP / ORDER",
      garmentsPerCheckout: "~1.8 garments per checkout",
      fulfillmentRate: "FULFILLMENT RATE",
      dispatchedBosta: (pct: number) => `${pct}% dispatched with Bosta`,
      searchOrderPlaceholder: "SEARCH ORDER #, CUSTOMER, PHONE, CITY...",
      all: "ALL",
      pending: "PENDING",
      confirmed: "CONFIRMED",
      shipped: "SHIPPED",
      delivered: "DELIVERED",
      cancelled: "CANCELLED",
      orderId: "ORDER ID",
      customer: "CUSTOMER",
      destination: "DESTINATION",
      pieces: "PIECES",
      total: "TOTAL",
      status: "STATUS",
      actions: "ACTIONS",
      noOrders: "NO ORDERS MATCH CRITERIA",

      // Modals & Waybill
      dispatchRecord: "DISPATCH RECORD",
      waybillTitle: "VALVES LOGISTICS WAYBILL",
      courierPartner: "COURIER PARTNER: BOSTA EXPRESS EGYPT",
      recipient: "RECIPIENT:",
      shippingDest: "DESTINATION:",
      customerInstruction: "INSTRUCTION:",
      orderManifest: "MANIFEST:",
      subtotal: "SUBTOTAL",
      discountApplied: "DISCOUNT APPLIED",
      shippingFee: "SHIPPING FEE",
      freeExpress: "COMPLIMENTARY",
      amountToCollect: "AMOUNT TO COLLECT",
      updateStatus: "UPDATE STATUS:",
      whatsappCustomer: "WHATSAPP",
      printWaybill: "PRINT WAYBILL",

      // Login
      usernameLabel: "ADMIN IDENTIFIER",
      passwordLabel: "SECURITY KEY",
      signInBtn: "AUTHENTICATE & ENTER",
      autoFillBtn: "Fill Demo Credentials (admin / valves2026)",
      securityNote: "Authenticated atelier session with live Cairo inventory synchronization.",
    },
    ar: {
      storefront: "المتجر",
      atelierTitle: "معمل فالفز · مركز التحكم",
      loginSubtitle: "معمل الأزياء المعمارية // دخول مصرح به",
      syncOrders: "تحديث",
      viewLiveStore: "زيارة المتجر",
      logout: "خروج",

      // Tabs
      ordersTab: `الطلبات (${orders.length})`,
      productsTab: `المنتجات (${products.length})`,
      categoriesTab: `الأقسام (${categories.length})`,
      inventoryTab: "معمل الأقمشة (GSM)",
      analyticsTab: "إيرادات دروب 01",

      // Products Tab
      manageProducts: "إدارة قطع الكتالوج الأرشيفي",
      manageProductsSub: "تعديل مواصفات القطع، الأسعار، وأوزان الأقمشة المصرية.",
      addPieceBtn: "إضافة قطعة",
      resetCatalogBtn: "استعادة الكتالوج الافتراضي",
      searchProductsPlaceholder: "بحث عن قطعة، وزن القماش، الكود...",
      allCategoriesFilter: "جميع الأقسام",
      pieceCol: "القطعة",
      collectionCol: "القسم",
      priceCol: "السعر",
      gsmCol: "وزن القماش (GSM)",
      sizesCol: "المقاسات",
      actionsCol: "إجراءات",
      noProductsFound: "لا توجد قطع مطابقة",

      // Categories Tab
      manageCategories: "أقسام وتصنيفات المتجر",
      manageCategoriesSub: "التحكم في الأقسام التي تظهر في شريط التنقل الرئيسي للمتجر.",
      addCategoryBtn: "إضافة قسم",
      resetCategoriesBtn: "استعادة الافتراضية",
      categorySlug: "المعرف (Slug)",
      categoryNameEn: "الاسم (EN)",
      categoryNameAr: "الاسم (AR)",
      productCount: "القطع المرتبطة",

      // Orders Tab
      netRevenue: "صافي الإيرادات",
      vsLastDrop: "+34.8% مقارنة بالدفعة السابقة",
      actionRequired: "إجراء مطلوب",
      newOrders: "طلبات جديدة",
      awaitingCourier: "في انتظار تأكيد مندوب الشحن",
      avgBasket: "متوسط السلة",
      perOrder: "ج.م / طلب",
      garmentsPerCheckout: "~1.8 قطعة لكل طلب",
      fulfillmentRate: "نسبة التنفيذ والتوصيل",
      dispatchedBosta: (pct: number) => `${pct}% تم تسليمها لبوسطة`,
      searchOrderPlaceholder: "بحث برقم الطلب، العميل، الهاتف، المدينة...",
      all: "الكل",
      pending: "قيد الانتظار",
      confirmed: "مؤكد",
      shipped: "تم الشحن",
      delivered: "تم التوصيل",
      cancelled: "ملغي",
      orderId: "رقم الطلب",
      customer: "العميل",
      destination: "الوجهة",
      pieces: "القطع",
      total: "الإجمالي",
      status: "الحالة",
      actions: "إجراءات",
      noOrders: "لا توجد طلبات مطابقة",

      // Modals & Waybill
      dispatchRecord: "سجل الشحن والتوزيع",
      waybillTitle: "بوليصة شحن ڤالڤز اللوجستية",
      courierPartner: "شريك الشحن: بوسطة إكسبريس مصر",
      recipient: "المستلم:",
      shippingDest: "عنوان الشحن:",
      customerInstruction: "ملاحظات العميل:",
      orderManifest: "بيان القطع:",
      subtotal: "المجموع الفرعي",
      discountApplied: "الخصم",
      shippingFee: "تكلفة الشحن",
      freeExpress: "مجاناً",
      amountToCollect: "المبلغ المطلوب تحصيله",
      updateStatus: "تحديث الحالة:",
      whatsappCustomer: "واتساب",
      printWaybill: "طباعة البوليصة",

      // Login
      usernameLabel: "معرّف الإدارة",
      passwordLabel: "كلمة المرور / المفتاح السري",
      signInBtn: "تسجيل الدخول والمتابعة",
      autoFillBtn: "ملء بيانات تجريبية (admin / valves2026)",
      securityNote: "جلسة إدارة معتمدة مع مزامنة لحظية لمخزون القاهرة.",
    },
  }[lang];

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--ink-primary)] flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <RefreshCw size={15} className="animate-spin text-[var(--accent)]" />
          <span>INITIALIZING VALVES ATELIER...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: ARCHITECTURAL LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="min-h-screen bg-[var(--bg-primary)] text-[var(--ink-primary)] flex flex-col justify-between font-sans selection:bg-[var(--ink-primary)] selection:text-[var(--bg-primary)] transition-colors"
      >
        {/* Login Top Navigation */}
        <header className="w-full border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition"
          >
            {lang === "ar" ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            <span>← {t.storefront}</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-xs font-mono font-bold uppercase text-[var(--ink-primary)] hover:bg-[var(--bg-secondary)] transition"
            >
              {lang === "en" ? "AR" : "EN"}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--ink-primary)] hover:bg-[var(--bg-secondary)] transition"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>

        {/* Center Architectural Login Box */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-8 sm:p-10 shadow-2xl relative">
            {/* Architectural Monogram & Headline */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 flex items-center justify-center text-[var(--ink-primary)] mb-4">
                <ValveLogo className="w-full h-full" />
              </div>

              <div className="space-y-1">
                <h1 className="font-heading font-extrabold text-lg sm:text-xl tracking-[0.2em] uppercase text-[var(--ink-primary)]">
                  {t.atelierTitle}
                </h1>
                <p className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-widest">
                  {t.loginSubtitle}
                </p>
              </div>
            </div>

            {loginError && (
              <div className="mb-6 p-3 bg-[var(--status-danger)]/10 border border-[var(--status-danger)]/40 text-[var(--status-danger)] text-xs font-mono flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-[var(--ink-secondary)] tracking-wider mb-1.5">
                  {t.usernameLabel}
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className={`absolute ${
                      lang === "ar" ? "right-3.5" : "left-3.5"
                    } top-1/2 -translate-y-1/2 text-[var(--ink-secondary)]`}
                  />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="admin"
                    required
                    className={`w-full border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] ${
                      lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"
                    } py-3 text-xs font-mono uppercase focus:outline-none focus:border-[var(--ink-primary)] transition`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-[var(--ink-secondary)] tracking-wider mb-1.5">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className={`absolute ${
                      lang === "ar" ? "right-3.5" : "left-3.5"
                    } top-1/2 -translate-y-1/2 text-[var(--ink-secondary)]`}
                  />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] ${
                      lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"
                    } py-3 text-xs font-mono focus:outline-none focus:border-[var(--ink-primary)] transition`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-widest border border-[var(--ink-primary)] hover:opacity-90 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound size={14} />
                <span>{t.signInBtn}</span>
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[var(--border-hairline)] text-center">
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-[11px] font-mono text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition flex items-center justify-center gap-1.5 mx-auto"
              >
                <ShieldCheck size={14} className="text-[var(--accent)]" />
                <span>{t.autoFillBtn}</span>
              </button>
              <div className="text-[10px] font-mono text-[var(--ink-secondary)]/70 mt-2">
                {t.securityNote}
              </div>
            </div>
          </div>
        </div>

        <footer className="py-4 text-center text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider">
          VALVES APPAREL ATELIER // CAIRO FULFILLMENT &amp; CONTROL CENTER
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ARCHITECTURAL DASHBOARD
  // ==========================================
  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--ink-primary)] flex flex-col font-sans selection:bg-[var(--ink-primary)] selection:text-[var(--bg-primary)] transition-colors"
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs tracking-wider px-5 py-3 border border-[var(--border-hairline)] shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom">
          <Check size={15} />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Architectural Top Navigation */}
      <header className="border-b border-[var(--border-hairline)] bg-[var(--bg-secondary)] sticky top-0 z-30 transition-colors">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 h-18 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition shrink-0"
            >
              {lang === "ar" ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
              <span className="hidden sm:inline font-bold">← {t.storefront}</span>
            </Link>

            <div className="h-6 w-[1px] bg-[var(--border-hairline)]" />

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 flex items-center justify-center text-[var(--ink-primary)] shrink-0">
                <ValveLogo className="w-full h-full" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase leading-none text-[var(--ink-primary)] flex items-center gap-2">
                  <span>VALVES</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--accent)] font-semibold">
                    CONTROL CENTER
                  </span>
                </h1>
                <p className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase mt-1 hidden sm:block">
                  CAIRO APPAREL LAB // ARCHIVE &amp; FULFILLMENT
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switch */}
            <button
              onClick={toggleLang}
              className="px-2.5 sm:px-3 py-2 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-xs font-mono font-bold uppercase text-[var(--ink-primary)] hover:bg-[var(--bg-secondary)] transition"
              title="Toggle Language"
            >
              {lang === "en" ? "AR" : "EN"}
            </button>

            {/* Theme Switch */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--ink-primary)] hover:bg-[var(--bg-secondary)] transition"
              title="Toggle Light / Dark Mode"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Sync Orders */}
            <button
              onClick={loadAllData}
              className="px-3 py-2 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-xs font-mono flex items-center gap-1.5 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition"
            >
              <RefreshCw size={13} />
              <span className="hidden md:inline">{t.syncOrders}</span>
            </button>

            {/* View Live Store */}
            <Link
              href="/"
              target="_blank"
              className="px-3.5 sm:px-4 py-2 bg-[var(--ink-primary)] text-[var(--bg-primary)] text-xs font-mono uppercase tracking-wider hover:opacity-90 transition flex items-center gap-1.5"
            >
              <span className="hidden sm:inline">{t.viewLiveStore}</span>
              <ArrowUpRight size={14} />
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--status-danger)] hover:bg-[var(--status-danger)]/10 transition"
              title={t.logout}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Tab Navigation with Architectural Underlines */}
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 flex gap-6 sm:gap-8 -mb-[1px] overflow-x-auto">
          {[
            { id: "orders", label: t.ordersTab },
            { id: "products", label: t.productsTab },
            { id: "categories", label: t.categoriesTab },
            { id: "inventory", label: t.inventoryTab },
            { id: "analytics", label: t.analyticsTab },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 text-xs font-mono font-bold tracking-[0.15em] border-b-2 uppercase whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-[var(--accent)] text-[var(--ink-primary)]"
                  : "border-transparent text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-32 space-y-8">
        {/* ========================================================= */}
        {/* TAB 1: ORDERS & FULFILLMENT */}
        {/* ========================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-8">
            {/* Monospace KPI Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 sm:p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[var(--ink-secondary)] mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{t.netRevenue}</span>
                  <DollarSign size={16} className="text-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[var(--ink-primary)]">
                    {metrics.totalRev.toLocaleString()}{" "}
                    <span className="text-xs uppercase font-normal text-[var(--ink-secondary)]">EGP</span>
                  </div>
                  <div className="text-[10px] font-mono text-[var(--status-success)] flex items-center gap-1 pt-1">
                    <TrendingUp size={12} />
                    <span>{t.vsLastDrop}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[var(--ink-secondary)] mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{t.actionRequired}</span>
                  <Clock size={16} className="text-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[var(--accent)]">
                    {metrics.pendingCount}{" "}
                    <span className="text-xs font-normal text-[var(--ink-secondary)]">{t.newOrders}</span>
                  </div>
                  <div className="text-[10px] font-mono text-[var(--ink-secondary)] pt-1">
                    {t.awaitingCourier}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[var(--ink-secondary)] mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{t.avgBasket}</span>
                  <ShoppingBag size={16} className="text-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[var(--ink-primary)]">
                    {metrics.aov.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-[var(--ink-secondary)]">{t.perOrder}</span>
                  </div>
                  <div className="text-[10px] font-mono text-[var(--ink-secondary)] pt-1">
                    {t.garmentsPerCheckout}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[var(--ink-secondary)] mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{t.fulfillmentRate}</span>
                  <Truck size={16} className="text-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[var(--ink-primary)]">
                    {metrics.deliveredCount + metrics.shippedCount} / {metrics.totalOrders}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--ink-secondary)] pt-1">
                    {t.dispatchedBosta(
                      Math.round(
                        ((metrics.deliveredCount + metrics.shippedCount) /
                          (metrics.totalOrders || 1)) *
                          100
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={15}
                  className={`absolute ${
                    lang === "ar" ? "right-3.5" : "left-3.5"
                  } top-1/2 -translate-y-1/2 text-[var(--ink-secondary)]`}
                />
                <input
                  type="text"
                  placeholder={t.searchOrderPlaceholder}
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className={`w-full border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] ${
                    lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"
                  } py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-[var(--ink-primary)] transition`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: "ALL", label: t.all },
                  { key: "PENDING", label: t.pending },
                  { key: "CONFIRMED", label: t.confirmed },
                  { key: "SHIPPED", label: t.shipped },
                  { key: "DELIVERED", label: t.delivered },
                  { key: "CANCELLED", label: t.cancelled },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={`px-3.5 py-2 text-[11px] font-mono font-bold tracking-wider uppercase transition ${
                      statusFilter === key
                        ? "bg-[var(--ink-primary)] text-[var(--bg-primary)] border border-[var(--ink-primary)]"
                        : "border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hairline Orders Table */}
            <div className="border border-[var(--border-hairline)] bg-[var(--bg-elevated)] overflow-x-auto shadow-sm">
              <table className="w-full text-left rtl:text-right text-xs font-mono">
                <thead className="bg-[var(--bg-secondary)] text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--ink-secondary)] border-b border-[var(--border-hairline)]">
                  <tr>
                    <th className="py-4 px-5 sm:px-6">{t.orderId}</th>
                    <th className="py-4 px-5 sm:px-6">{t.customer}</th>
                    <th className="py-4 px-5 sm:px-6">{t.destination}</th>
                    <th className="py-4 px-5 sm:px-6">{t.pieces}</th>
                    <th className="py-4 px-5 sm:px-6">{t.total}</th>
                    <th className="py-4 px-5 sm:px-6">{t.status}</th>
                    <th className="py-4 px-5 sm:px-6 text-right rtl:text-left">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-[var(--ink-secondary)] font-mono">
                        {t.noOrders}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-[var(--bg-secondary)]/50 cursor-pointer transition-colors"
                      >
                        <td className="py-4 sm:py-5 px-5 sm:px-6 whitespace-nowrap align-middle">
                          <div className="font-bold text-sm text-[var(--ink-primary)]">
                            #{order.id}
                          </div>
                          <span className="block text-[11px] text-[var(--ink-secondary)] mt-0.5">
                            {order.createdAt}
                          </span>
                        </td>

                        <td className="py-4 sm:py-5 px-5 sm:px-6 align-middle">
                          <div className="font-bold text-xs sm:text-sm text-[var(--ink-primary)]">
                            {order.customerName}
                          </div>
                          <div className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                            {order.phone}
                          </div>
                        </td>

                        <td className="py-4 sm:py-5 px-5 sm:px-6 whitespace-nowrap align-middle">
                          <span className="inline-block px-2.5 py-1 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[11px] font-mono uppercase">
                            {order.city}
                          </span>
                        </td>

                        <td className="py-4 sm:py-5 px-5 sm:px-6 align-middle">
                          <div className="space-y-1 font-mono text-xs text-[var(--ink-secondary)]">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
                                <span className="font-bold text-[var(--ink-primary)]">{i.quantity}x</span>
                                <span>{i.name}</span>
                                <span className="text-[11px]">({i.size})</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 sm:py-5 px-5 sm:px-6 whitespace-nowrap align-middle">
                          <div className="font-mono font-bold text-sm text-[var(--ink-primary)]">
                            {order.total.toLocaleString()}{" "}
                            <span className="text-xs uppercase font-normal text-[var(--ink-secondary)]">EGP</span>
                          </div>
                          <span className="block text-[10px] font-mono text-[var(--ink-secondary)] mt-0.5 uppercase">
                            {order.paymentMethod.includes("COD") ? "COD" : "CARD"}
                          </span>
                        </td>

                        <td
                          className="py-4 sm:py-5 px-5 sm:px-6 whitespace-nowrap align-middle"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="relative inline-flex items-center">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value as OrderStatus)
                              }
                              className={`appearance-none text-[10px] font-mono font-bold tracking-wider ${
                                lang === "ar" ? "pr-3 pl-7" : "pl-3 pr-7"
                              } py-1.5 uppercase border cursor-pointer focus:outline-none transition ${getStatusBadge(
                                order.status
                              )}`}
                            >
                              <option value="Pending">{t.pending}</option>
                              <option value="Confirmed">{t.confirmed}</option>
                              <option value="Shipped">{t.shipped}</option>
                              <option value="Delivered">{t.delivered}</option>
                              <option value="Cancelled">{t.cancelled}</option>
                            </select>
                            <ChevronDown
                              size={12}
                              className={`absolute ${
                                lang === "ar" ? "left-2" : "right-2"
                              } pointer-events-none text-[var(--ink-secondary)]`}
                            />
                          </div>
                        </td>

                        <td
                          className="py-4 sm:py-5 px-5 sm:px-6 text-right rtl:text-left whitespace-nowrap align-middle"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end rtl:justify-start gap-2">
                            <a
                              href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                                order.customerName
                              )},%20VALVES%20order%20${order.id}`}
                              target="_blank"
                              rel="noreferrer"
                              title="WhatsApp Customer"
                              className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--status-success)] hover:border-[var(--status-success)] transition"
                            >
                              <MessageSquare size={14} />
                            </a>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              title="Inspect Waybill"
                              className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-primary)] transition"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="p-5 sm:p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-wider text-[var(--ink-primary)]">
                  {t.manageProducts}
                </h3>
                <p className="text-xs text-[var(--ink-secondary)] font-light mt-0.5">
                  {t.manageProductsSub}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleResetProducts}
                  className="px-3 py-2 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-xs font-mono flex items-center gap-1.5 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition"
                >
                  <RotateCcw size={13} />
                  <span>{t.resetCatalogBtn}</span>
                </button>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-wider hover:opacity-90 transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{t.addPieceBtn}</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={15}
                  className={`absolute ${
                    lang === "ar" ? "right-3.5" : "left-3.5"
                  } top-1/2 -translate-y-1/2 text-[var(--ink-secondary)]`}
                />
                <input
                  type="text"
                  placeholder={t.searchProductsPlaceholder}
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className={`w-full border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] ${
                    lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"
                  } py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-[var(--ink-primary)] transition`}
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="p-2.5 text-xs font-mono uppercase border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] cursor-pointer"
              >
                <option value="ALL">{t.allCategoriesFilter}</option>
                {categories
                  .filter((c) => c.id !== "all")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {lang === "ar" ? c.nameAr || c.name : c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Products Table */}
            <div className="border border-[var(--border-hairline)] bg-[var(--bg-elevated)] overflow-x-auto shadow-sm">
              <table className="w-full text-left rtl:text-right text-xs font-mono">
                <thead className="bg-[var(--bg-secondary)] text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--ink-secondary)] border-b border-[var(--border-hairline)]">
                  <tr>
                    <th className="py-4 px-5">{t.pieceCol}</th>
                    <th className="py-4 px-5">{t.collectionCol}</th>
                    <th className="py-4 px-5">{t.priceCol}</th>
                    <th className="py-4 px-5">{t.gsmCol}</th>
                    <th className="py-4 px-5">{t.sizesCol}</th>
                    <th className="py-4 px-5 text-right rtl:text-left">{t.actionsCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-[var(--ink-secondary)]">
                        {t.noProductsFound}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[var(--bg-secondary)]/50 transition">
                        <td className="py-4 px-5 align-middle">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-14 object-cover border border-[var(--border-hairline)] bg-[var(--bg-secondary)] shrink-0"
                            />
                            <div>
                              <div className="font-heading font-bold text-xs sm:text-sm uppercase text-[var(--ink-primary)]">
                                {prod.name}
                              </div>
                              <div className="text-[10px] text-[var(--ink-secondary)] mt-0.5">
                                {prod.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-5 align-middle">
                          <span className="px-2 py-0.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[10px] font-mono uppercase">
                            {prod.collection}
                          </span>
                        </td>

                        <td className="py-4 px-5 align-middle font-mono font-bold text-xs sm:text-sm text-[var(--ink-primary)]">
                          {prod.price.toLocaleString()}{" "}
                          <span className="text-[10px] uppercase font-normal text-[var(--ink-secondary)]">EGP</span>
                        </td>

                        <td className="py-4 px-5 align-middle text-[var(--ink-secondary)]">
                          {prod.fabricGsm}
                        </td>

                        <td className="py-4 px-5 align-middle">
                          <div className="flex gap-1 flex-wrap">
                            {prod.sizes.map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 text-[10px] border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-secondary)]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-5 text-right rtl:text-left align-middle">
                          <div className="flex items-center justify-end rtl:justify-start gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--status-danger)] hover:bg-[var(--status-danger)]/10 transition"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="p-5 sm:p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-wider text-[var(--ink-primary)]">
                  {t.manageCategories}
                </h3>
                <p className="text-xs text-[var(--ink-secondary)] font-light mt-0.5">
                  {t.manageCategoriesSub}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetCategories}
                  className="px-3 py-2 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-xs font-mono flex items-center gap-1.5 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition"
                >
                  <RotateCcw size={13} />
                  <span>{t.resetCategoriesBtn}</span>
                </button>
                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-wider hover:opacity-90 transition flex items-center gap-2 cursor-pointer"
                >
                  <FolderPlus size={14} />
                  <span>{t.addCategoryBtn}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => {
                const count =
                  cat.id === "all"
                    ? products.length
                    : products.filter(
                        (p) => p.collection.toLowerCase() === cat.id.toLowerCase()
                      ).length;
                return (
                  <div
                    key={cat.id}
                    className="p-5 sm:p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-mono text-[var(--accent)] border border-[var(--border-hairline)] bg-[var(--bg-primary)] px-2 py-0.5 uppercase">
                          {cat.id}
                        </span>
                        {cat.id !== "all" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className="p-1.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--status-danger)] hover:bg-[var(--status-danger)]/10 transition"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      <h4 className="font-heading font-bold text-sm sm:text-base uppercase text-[var(--ink-primary)] mb-1">
                        {cat.name}
                      </h4>
                      <h5 className="font-heading text-xs text-[var(--accent)] mb-3">
                        {cat.nameAr}
                      </h5>
                      <p className="text-xs text-[var(--ink-secondary)] font-light mb-4 leading-relaxed">
                        {cat.description || "Active storefront category."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs font-mono">
                      <span className="text-[var(--ink-secondary)]">{t.productCount}:</span>
                      <span className="font-bold text-[var(--ink-primary)]">
                        {count} {lang === "en" ? "pieces" : "قطعة"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: GSM FABRIC LAB & INVENTORY */}
        {/* ========================================================= */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="p-5 sm:p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-base uppercase tracking-wider text-[var(--ink-primary)]">
                  CAIRO GSM FABRIC LAB &amp; ATELIER STOCK
                </h3>
                <p className="text-xs text-[var(--ink-secondary)] font-light mt-0.5">
                  Real-time stock across Cairo cutting room and Maadi distribution hub.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] border border-[var(--border-hairline)] bg-[var(--bg-primary)] px-3 py-1.5">
                <span className="w-1.5 h-1.5 bg-[var(--accent)] animate-pulse" />
                <span>300–460 GSM MILL RUNNING</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-5 sm:p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-[var(--border-hairline)]">
                      <div>
                        <span className="text-[10px] font-mono text-[var(--accent)] uppercase">
                          {prod.collection}
                        </span>
                        <h4 className="font-heading font-bold text-sm uppercase text-[var(--ink-primary)] mt-0.5">
                          {prod.name}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[10px] font-mono text-[var(--ink-primary)]">
                        {prod.fabricGsm}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-[10px] font-mono uppercase text-[var(--ink-secondary)]">
                        STOCK BREAKDOWN BY SIZE:
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                        {prod.sizes.map((s, idx) => {
                          const stock = (idx * 7 + 9) % 24;
                          return (
                            <div
                              key={s}
                              className={`p-2 border ${
                                stock <= 3
                                  ? "bg-[var(--status-danger)]/10 border-[var(--status-danger)]/40 text-[var(--status-danger)]"
                                  : "border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)]"
                              }`}
                            >
                              <div className="text-[10px] text-[var(--ink-secondary)]">{s}</div>
                              <div className="font-bold">{stock} pcs</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-hairline)] flex justify-between items-center text-xs font-mono text-[var(--ink-secondary)]">
                    <span>UNIT: {prod.price.toLocaleString()} EGP</span>
                    <span className="text-[var(--status-success)] uppercase font-semibold">
                      IN STOCK
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: DROP REVENUE ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--ink-primary)] mb-4">
                  PAYMENT METHODS SPLIT
                </h4>
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-[var(--ink-secondary)] mb-1">
                      <span>CASH ON DELIVERY (COD)</span>
                      <span className="text-[var(--ink-primary)] font-bold">58%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--border-hairline)]">
                      <div className="w-[58%] h-full bg-[var(--accent)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[var(--ink-secondary)] mb-1">
                      <span>CREDIT / DEBIT CARDS</span>
                      <span className="text-[var(--ink-primary)] font-bold">28%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--border-hairline)]">
                      <div className="w-[28%] h-full bg-[var(--ink-primary)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[var(--ink-secondary)] mb-1">
                      <span>INSTAPAY INSTANT</span>
                      <span className="text-[var(--status-success)] font-bold">14%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--border-hairline)]">
                      <div className="w-[14%] h-full bg-[var(--status-success)]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--ink-primary)] mb-4">
                  REGIONAL DEMAND DISTRIBUTION
                </h4>
                <ul className="space-y-3 font-mono text-xs text-[var(--ink-secondary)]">
                  <li className="flex justify-between pb-1 border-b border-[var(--border-hairline)]">
                    <span>1. NEW CAIRO (التجمع الخامس)</span>
                    <span className="text-[var(--ink-primary)] font-bold">42%</span>
                  </li>
                  <li className="flex justify-between pb-1 border-b border-[var(--border-hairline)]">
                    <span>2. SHEIKH ZAYED &amp; 6TH OCT</span>
                    <span className="text-[var(--ink-primary)] font-bold">26%</span>
                  </li>
                  <li className="flex justify-between pb-1 border-b border-[var(--border-hairline)]">
                    <span>3. ALEXANDRIA (الإسكندرية)</span>
                    <span>16%</span>
                  </li>
                  <li className="flex justify-between pb-1 border-b border-[var(--border-hairline)]">
                    <span>4. MAADI &amp; HELIOPOLIS</span>
                    <span>11%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>5. OTHER GOVERNORATES</span>
                    <span>5%</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--ink-primary)] mb-2">
                    PROMO CODE PERFORMANCE
                  </h4>
                  <p className="text-xs text-[var(--ink-secondary)] font-light mb-4">
                    Performance of the secret drop coupon code:
                  </p>
                  <div className="p-3 border border-[var(--border-hairline)] bg-[var(--bg-primary)] font-mono text-xs flex justify-between items-center mb-3">
                    <span className="text-[var(--accent)] font-bold">VALVES10 (10% OFF)</span>
                    <span className="text-[var(--ink-primary)]">38 USES</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-[var(--ink-secondary)] pt-2 border-t border-[var(--border-hairline)]">
                  Average basket lift with promo code: +320 EGP
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* PRODUCT ADD / EDIT ARCHITECTURAL MODAL */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-5 border-b border-[var(--border-hairline)] flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base uppercase text-[var(--ink-primary)]">
                {editingProduct
                  ? lang === "en"
                    ? "EDIT PIECE SPECIFICATIONS"
                    : "تعديل بيانات القطعة"
                  : lang === "en"
                  ? "ADD NEW ARCHIVAL PIECE"
                  : "إضافة قطعة جديدة"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    PIECE NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="KINETIC ZIP HOODIE"
                    className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] uppercase focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    COLLECTION *
                  </label>
                  <select
                    value={productForm.collection}
                    onChange={(e) => setProductForm({ ...productForm, collection: e.target.value })}
                    className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] uppercase cursor-pointer"
                  >
                    {categories
                      .filter((c) => c.id !== "all")
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.nameAr})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    PRICE (EGP) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    FABRIC GSM *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.fabricGsm}
                    onChange={(e) => setProductForm({ ...productForm, fabricGsm: e.target.value })}
                    placeholder="460 GSM Heavyweight"
                    className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    TAG
                  </label>
                  <input
                    type="text"
                    value={productForm.tag}
                    onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                    placeholder="DROP 01 • LIMITED"
                    className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  IMAGE URL *
                </label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  AVAILABLE SIZES (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={productForm.sizes}
                  onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  placeholder="S, M, L, XL"
                  className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  FABRIC SPECIFICATIONS (ONE PER LINE)
                </label>
                <textarea
                  rows={2}
                  value={productForm.details}
                  onChange={(e) => setProductForm({ ...productForm, details: e.target.value })}
                  className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border-hairline)]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-wider hover:opacity-90"
                >
                  SAVE PIECE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CATEGORY ADD / EDIT ARCHITECTURAL MODAL */}
      {/* ========================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md border border-[var(--border-hairline)] bg-[var(--bg-elevated)] shadow-2xl flex flex-col">
            <div className="p-5 border-b border-[var(--border-hairline)] flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base uppercase text-[var(--ink-primary)]">
                {editingCategory ? "EDIT STORE CATEGORY" : "ADD NEW STORE CATEGORY"}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs font-mono">
              {!editingCategory && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    CATEGORY SLUG / ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.id}
                    onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                    placeholder="accessories"
                    className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] lowercase"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  ENGLISH TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="ACCESSORIES"
                  className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)] uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  ARABIC TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.nameAr}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })}
                  placeholder="إكسسوارات"
                  className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-primary)]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border-hairline)]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-wider hover:opacity-90"
                >
                  SAVE CATEGORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ORDER INSPECTION & WAYBILL MODAL */}
      {/* ========================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-5 border-b border-[var(--border-hairline)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[var(--accent)] uppercase">
                  {t.dispatchRecord}
                </span>
                <h3 className="font-heading font-extrabold text-base sm:text-lg uppercase text-[var(--ink-primary)]">
                  ORDER #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs font-mono">
              <div className="p-4 border border-[var(--border-hairline)] bg-[var(--bg-secondary)] flex justify-between items-start">
                <div>
                  <div className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--ink-primary)]">
                    {t.waybillTitle}
                  </div>
                  <div className="text-[10px] text-[var(--ink-secondary)] mt-0.5">
                    {t.courierPartner}
                  </div>
                  <div className="text-[10px] text-[var(--ink-secondary)]">
                    BST-2026-VALVES-{selectedOrder.id.replace("VLV-", "")}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase border ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 border border-[var(--border-hairline)] bg-[var(--bg-primary)]">
                <div>
                  <div className="text-[10px] text-[var(--ink-secondary)] uppercase mb-1">
                    {t.recipient}
                  </div>
                  <div className="font-bold text-sm text-[var(--ink-primary)]">
                    {selectedOrder.customerName}
                  </div>
                  <div className="text-[var(--ink-secondary)] mt-1">{selectedOrder.phone}</div>
                  <div className="text-[var(--ink-secondary)]/70 text-[11px]">{selectedOrder.email}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--ink-secondary)] uppercase mb-1">
                    {t.shippingDest}
                  </div>
                  <div className="font-bold text-[var(--ink-primary)]">{selectedOrder.city}</div>
                  <div className="text-[var(--ink-secondary)] mt-1 leading-relaxed">
                    {selectedOrder.address}
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[11px]">
                  <span className="font-bold uppercase text-[var(--ink-primary)]">
                    {t.customerInstruction}{" "}
                  </span>
                  <span className="text-[var(--ink-secondary)]">{selectedOrder.notes}</span>
                </div>
              )}

              <div>
                <div className="text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-2">
                  {t.orderManifest}
                </div>
                <div className="border border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
                  {selectedOrder.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3 flex justify-between items-center bg-[var(--bg-primary)]"
                    >
                      <div>
                        <div className="font-bold text-xs text-[var(--ink-primary)]">{it.name}</div>
                        <div className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                          SIZE: {it.size} · COLOR: {it.color} · {it.fabricGsm}
                        </div>
                      </div>
                      <div className="text-right rtl:text-left">
                        <div className="text-[var(--ink-secondary)] text-xs">
                          {it.quantity} x {it.price.toLocaleString()} EGP
                        </div>
                        <div className="font-bold text-[var(--ink-primary)]">
                          {(it.quantity * it.price).toLocaleString()} EGP
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Waybill Pricing Summary */}
              <div className="p-4 border border-[var(--border-hairline)] bg-[var(--bg-secondary)] space-y-1.5">
                <div className="flex justify-between text-[var(--ink-secondary)]">
                  <span>{t.subtotal}</span>
                  <span>{selectedOrder.subtotal.toLocaleString()} EGP</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-[var(--accent)]">
                    <span>{t.discountApplied}</span>
                    <span>-{selectedOrder.discount.toLocaleString()} EGP</span>
                  </div>
                )}
                <div className="flex justify-between text-[var(--ink-secondary)]">
                  <span>{t.shippingFee}</span>
                  <span>
                    {selectedOrder.shipping === 0
                      ? t.freeExpress
                      : `${selectedOrder.shipping} EGP`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-[var(--border-hairline)] text-[var(--ink-primary)]">
                  <span>
                    {t.amountToCollect} ({selectedOrder.paymentMethod})
                  </span>
                  <span>{selectedOrder.total.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Status Update Quick Select */}
              <div className="p-4 border border-[var(--border-hairline)] bg-[var(--bg-primary)] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase text-[var(--ink-secondary)]">
                  {t.updateStatus}
                </span>
                <div className="flex flex-wrap gap-2">
                  {(["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"] as OrderStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedOrder.id, st)}
                        className={`px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider uppercase border transition ${
                          selectedOrder.status === st
                            ? "bg-[var(--ink-primary)] text-[var(--bg-primary)] border-[var(--ink-primary)]"
                            : "border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[var(--border-hairline)] bg-[var(--bg-secondary)] flex items-center justify-between">
              <a
                href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                  selectedOrder.customerName
                )},%20VALVES%20order%20${selectedOrder.id}%20status:%20${selectedOrder.status}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--status-success)] font-mono text-xs uppercase flex items-center gap-2 hover:border-[var(--status-success)] transition"
              >
                <MessageSquare size={14} />
                <span>{t.whatsappCustomer}</span>
              </a>

              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-wider hover:opacity-90 flex items-center gap-2 transition cursor-pointer"
              >
                <Printer size={14} />
                <span>{t.printWaybill}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
