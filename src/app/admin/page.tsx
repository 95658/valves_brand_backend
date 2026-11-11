"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/data/orders";
import { getStoredOrders, updateOrderStatus } from "@/lib/orderStorage";
import { Product, PRODUCTS } from "@/data/products";
import {
  Category,
  DEFAULT_CATEGORIES,
  getStoredCategories,
  getStoredProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  resetCategories
} from "@/lib/productStorage";
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
  Globe,
  Lock,
  LogOut,
  ShieldCheck,
  KeyRound,
  User,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Tag,
  Layers,
  FolderPlus,
  RotateCcw
} from "lucide-react";

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Appearance & Localization
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<"en" | "ar">("en");

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "categories" | "inventory" | "analytics">("orders");

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

  // Initialize data
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("valves_admin_auth");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
      }
      const storedTheme = localStorage.getItem("valves_admin_theme") as "dark" | "light";
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
      }
      const storedLang = localStorage.getItem("valves_admin_lang") as "en" | "ar";
      if (storedLang === "ar" || storedLang === "en") {
        setLang(storedLang);
      }
    } catch {}
    finally {
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
    try {
      localStorage.setItem("valves_admin_theme", next);
      localStorage.setItem("valves_store_theme", next);
    } catch {}
  };

  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
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

    if ((u === "admin" || u === "admin@valves.co") && (p === "admin" || p === "valves" || p === "valves2026" || p === "123456")) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem("valves_admin_auth", "true");
      } catch {}
      showToast(lang === "en" ? "Welcome back, Admin" : "مرحبًا بك، المدير");
    } else {
      setLoginError(
        lang === "en"
          ? "Invalid username or password. (Demo: admin / valves2026)"
          : "اسم المستخدم أو كلمة المرور غير صحيحة. (تجريبي: admin / valves2026)"
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
    showToast(lang === "en" ? "Logged out successfully" : "تم تسجيل الخروج بنجاح");
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
        ? `Order ${orderId} marked as ${newStatus}`
        : `تم تحديث الطلب ${orderId} إلى ${newStatus}`
    );
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      collection: categories.find(c => c.id !== "all")?.id || "streetwear",
      price: 1500,
      currency: "EGP",
      fabricGsm: "460 GSM",
      tag: "NEW DROP",
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
    const sizesArray = productForm.sizes.split(",").map(s => s.trim()).filter(Boolean);
    const detailsArray = productForm.details.split("\n").map(d => d.trim()).filter(Boolean);

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
      showToast(lang === "en" ? "Product updated successfully" : "تم تحديث القطعة بنجاح");
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
        colors: [{ name: "Obsidian Black", hex: "#09090b" }],
      });
      setProducts(getStoredProducts());
      showToast(lang === "en" ? "New piece added to catalogue" : "تمت إضافة القطعة الجديدة للكتالوج");
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(lang === "en" ? `Are you sure you want to delete ${name}?` : `هل أنت متأكد من حذف ${name}؟`)) {
      const updated = deleteProduct(id);
      setProducts(updated);
      showToast(lang === "en" ? "Piece removed from catalogue" : "تم حذف القطعة من الكتالوج");
    }
  };

  const handleResetProducts = () => {
    if (confirm(lang === "en" ? "Reset catalogue to default drop pieces?" : "إعادة الكتالوج للقطع الافتراضية؟")) {
      const updated = resetProducts();
      setProducts(updated);
      showToast(lang === "en" ? "Catalogue reset to default" : "تمت استعادة الكتالوج الافتراضي");
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
      const slug = categoryForm.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-") || `cat-${Date.now()}`;
      const updated = createCategory({
        id: slug,
        name: categoryForm.name.toUpperCase(),
        nameAr: categoryForm.nameAr,
        description: categoryForm.description,
      });
      setCategories(updated);
      showToast(lang === "en" ? "New category created" : "تم إنشاء القسم الجديد");
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (cat: Category) => {
    if (cat.id === "all") {
      alert(lang === "en" ? "The 'ALL' root category cannot be deleted." : "لا يمكن حذف قسم 'الكل' الرئيسي.");
      return;
    }
    if (confirm(lang === "en" ? `Delete category '${cat.name}'?` : `هل أنت متأكد من حذف قسم '${cat.nameAr || cat.name}'؟`)) {
      const updated = deleteCategory(cat.id);
      setCategories(updated);
      showToast(lang === "en" ? "Category deleted" : "تم حذف القسم");
    }
  };

  const handleResetCategories = () => {
    if (confirm(lang === "en" ? "Reset categories to default?" : "استعادة الأقسام الافتراضية؟")) {
      const updated = resetCategories();
      setCategories(updated);
      showToast(lang === "en" ? "Categories reset to default" : "تمت استعادة الأقسام الافتراضية");
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "ALL" || o.status.toUpperCase() === statusFilter.toUpperCase();
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
      const matchesCat = productCategoryFilter === "ALL" || p.collection.toLowerCase() === productCategoryFilter.toLowerCase();
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

  // Status badge styling
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return theme === "dark"
          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
          : "bg-amber-50 text-amber-700 border-amber-300";
      case "Confirmed":
        return theme === "dark"
          ? "bg-volt/10 text-volt border-volt/30"
          : "bg-lime-50 text-lime-700 border-lime-300";
      case "Shipped":
        return theme === "dark"
          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
          : "bg-cyan-50 text-cyan-700 border-cyan-300";
      case "Delivered":
        return theme === "dark"
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          : "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "Cancelled":
        return theme === "dark"
          ? "bg-red-500/10 text-red-400 border-red-500/30"
          : "bg-red-50 text-red-700 border-red-300";
    }
  };

  // Translations
  const t = {
    en: {
      storefront: "STOREFRONT",
      controlCenter: "CONTROL CENTER",
      subtitle: "CAIRO APPAREL ARCHIVE // LIVE FULFILLMENT & CATALOG",
      syncOrders: "SYNC ORDERS",
      viewLiveStore: "VIEW LIVE STORE",
      logout: "LOGOUT",
      themeToggle: theme === "dark" ? "LIGHT" : "DARK",

      // Tabs
      ordersTab: `ORDERS (${orders.length})`,
      productsTab: `PRODUCTS (${products.length})`,
      categoriesTab: `CATEGORIES (${categories.length})`,
      inventoryTab: "GSM FABRIC LAB",
      analyticsTab: "DROP 01 REVENUE",

      // Products Tab
      manageProducts: "PRODUCT ARCHIVE & CATALOGUE",
      manageProductsSub: "Add, modify pricing, fabrics, and descriptions for all web store pieces.",
      addPieceBtn: "ADD NEW PIECE",
      resetCatalogBtn: "RESET DEFAULT DROP",
      searchProductsPlaceholder: "SEARCH PIECE BY NAME, GSM, ID...",
      allCategoriesFilter: "ALL CATEGORIES",
      pieceCol: "PIECE",
      collectionCol: "COLLECTION",
      priceCol: "PRICE",
      gsmCol: "FABRIC GSM",
      sizesCol: "SIZES",
      actionsCol: "ACTIONS",
      noProductsFound: "NO PRODUCTS MATCH CRITERIA",

      // Categories Tab
      manageCategories: "STORE NAVIGATION & TAXONOMY",
      manageCategoriesSub: "Manage the navigation pills and category divisions shown on the storefront.",
      addCategoryBtn: "ADD NEW CATEGORY",
      resetCategoriesBtn: "RESET DEFAULTS",
      categorySlug: "SLUG / ID",
      categoryNameEn: "ENGLISH TITLE",
      categoryNameAr: "ARABIC TITLE",
      productCount: "LINKED PRODUCTS",

      // Orders Tab
      netRevenue: "NET REVENUE",
      vsLastDrop: "+34.8% vs last drop batch",
      actionRequired: "ACTION REQUIRED",
      newOrders: "NEW ORDERS",
      awaitingCourier: "Awaiting courier confirmation",
      avgBasket: "AVG BASKET SIZE",
      perOrder: "EGP / ORDER",
      garmentsPerCheckout: "~1.8 garments per checkout",
      fulfillmentRate: "FULFILLMENT RATE",
      dispatchedBosta: (pct: number) => `${pct}% dispatched with Bosta`,
      searchOrderPlaceholder: "SEARCH ORDER #, NAME, PHONE, CITY...",
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
      noOrders: "NO ORDERS MATCH CURRENT FILTER",

      // Modals
      dispatchRecord: "DISPATCH RECORD",
      waybillTitle: "VALVES LOGISTICS WAYBILL",
      courierPartner: "COURIER PARTNER: BOSTA EXPRESS EGYPT",
      recipient: "RECIPIENT (CUSTOMER):",
      shippingDest: "SHIPPING DESTINATION:",
      customerInstruction: "CUSTOMER INSTRUCTION:",
      orderManifest: "ORDER MANIFEST (PIECES):",
      subtotal: "SUBTOTAL",
      discountApplied: "DISCOUNT APPLIED",
      shippingFee: "SHIPPING FEE",
      freeExpress: "FREE EXPRESS",
      amountToCollect: "AMOUNT TO COLLECT",
      updateStatus: "UPDATE STATUS:",
      whatsappCustomer: "WHATSAPP CUSTOMER",
      printWaybill: "PRINT WAYBILL",

      // Login Screen
      loginTitle: "VALVES CONTROL CENTER",
      loginSubtitle: "RESTRICTED ACCESS // AUTHORIZED PERSONNEL ONLY",
      usernameLabel: "ADMIN IDENTIFIER",
      passwordLabel: "SECURITY KEY / PASSWORD",
      signInBtn: "AUTHENTICATE & ENTER",
      autoFillBtn: "Fill Demo Credentials (admin / valves2026)",
      securityNote: "Authorized session with live catalogue and inventory synchronization.",
    },
    ar: {
      storefront: "المتجر",
      controlCenter: "مركز التحكم",
      subtitle: "أرشيف ملابس القاهرة // إدارة الطلبات والكتالوج المباشر",
      syncOrders: "تحديث الطلبات",
      viewLiveStore: "زيارة المتجر الحي",
      logout: "خروج",
      themeToggle: theme === "dark" ? "فاتح" : "داكن",

      // Tabs
      ordersTab: `الطلبات (${orders.length})`,
      productsTab: `المنتجات (${products.length})`,
      categoriesTab: `الأقسام (${categories.length})`,
      inventoryTab: "معمل الأقمشة (GSM)",
      analyticsTab: "إيرادات دروب 01",

      // Products Tab
      manageProducts: "إدارة قطع الكتالوج والمنتجات",
      manageProductsSub: "إضافة قطع جديدة، تعديل الأسعار، نوع القماش، والوصف للمتجر.",
      addPieceBtn: "إضافة قطعة جديدة",
      resetCatalogBtn: "استعادة الكتالوج الافتراضي",
      searchProductsPlaceholder: "بحث عن قطعة بالاسم، الوزن، الكود...",
      allCategoriesFilter: "جميع الأقسام",
      pieceCol: "القطعة",
      collectionCol: "القسم / المجموعة",
      priceCol: "السعر",
      gsmCol: "وزن القماش (GSM)",
      sizesCol: "المقاسات",
      actionsCol: "إجراءات",
      noProductsFound: "لا توجد قطع تطابق معايير البحث",

      // Categories Tab
      manageCategories: "أقسام وتصنيفات المتجر",
      manageCategoriesSub: "التحكم في الأقسام التي تظهر في شريط التنقل الرئيسي للمتجر.",
      addCategoryBtn: "إضافة قسم جديد",
      resetCategoriesBtn: "استعادة الافتراضية",
      categorySlug: "المعرف (Slug)",
      categoryNameEn: "الاسم بالإنجليزية",
      categoryNameAr: "الاسم بالعربية",
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
      searchOrderPlaceholder: "بحث برقم الطلب، الاسم، الهاتف، المدينة...",
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
      noOrders: "لا توجد طلبات تطابق الفلتر الحالي",

      // Modals
      dispatchRecord: "سجل الشحن والتوزيع",
      waybillTitle: "بوليصة شحن ڤالڤز اللوجستية",
      courierPartner: "شريك الشحن: بوسطة إكسبريس مصر",
      recipient: "المستلم (العميل):",
      shippingDest: "عنوان الشحن والتوصيل:",
      customerInstruction: "ملاحظات العميل:",
      orderManifest: "بيان القطع المطلوبة:",
      subtotal: "المجموع الفرعي",
      discountApplied: "الخصم المطبق",
      shippingFee: "تكلفة الشحن",
      freeExpress: "شحن سريع مجاني",
      amountToCollect: "المبلغ المطلوب تحصيله",
      updateStatus: "تحديث الحالة:",
      whatsappCustomer: "واتساب العميل",
      printWaybill: "طباعة البوليصة",

      // Login Screen
      loginTitle: "مركز تحكم ڤالڤز",
      loginSubtitle: "منطقة محمية // للمصرح لهم فقط",
      usernameLabel: "معرّف الإدارة",
      passwordLabel: "كلمة المرور / المفتاح السري",
      signInBtn: "تسجيل الدخول والمتابعة",
      autoFillBtn: "ملء بيانات تجريبية (admin / valves2026)",
      securityNote: "جلسة إدارة آمنة مع مزامنة لحظية للكتالوج والمخزون.",
    }
  }[lang];

  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-[#09090b] text-zinc-100" : "bg-zinc-50 text-zinc-900";
  const headerBgClass = isDark ? "bg-[#121215]/95 border-zinc-800" : "bg-white/95 border-zinc-200 shadow-sm";
  const cardBgClass = isDark ? "bg-[#141417] border-zinc-800" : "bg-white border-zinc-200 shadow-sm";
  const inputBgClass = isDark ? "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-volt" : "bg-zinc-100 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-800";
  const textMutedClass = isDark ? "text-zinc-400" : "text-zinc-500";
  const textDimClass = isDark ? "text-zinc-500" : "text-zinc-400";
  const badgeMutedClass = isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-700";
  const tableHeadClass = isDark ? "bg-zinc-900/90 text-zinc-400 border-zinc-800" : "bg-zinc-100 text-zinc-600 border-zinc-200";
  const tableRowHoverClass = isDark ? "hover:bg-zinc-900/50" : "hover:bg-zinc-50";

  if (authChecking) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center font-mono text-xs`}>
        <div className="flex items-center gap-2">
          <RefreshCw size={16} className="animate-spin text-volt" />
          <span>INITIALIZING CONTROL CENTER...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className={`min-h-screen ${bgClass} flex flex-col justify-between font-sans selection:bg-volt selection:text-black`}
      >
        <header className={`w-full border-b ${headerBgClass} px-6 lg:px-12 py-4 flex items-center justify-between`}>
          <Link
            href="/"
            className={`flex items-center gap-2 text-xs font-mono uppercase ${textMutedClass} hover:text-volt transition`}
          >
            {lang === "ar" ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            <span>{t.storefront}</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleLang}
              className={`px-3 py-1.5 border text-xs font-mono flex items-center gap-1.5 transition ${
                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-white border-zinc-300 text-zinc-700"
              }`}
            >
              <Globe size={13} />
              <span>{lang === "en" ? "عربي (AR)" : "English (EN)"}</span>
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 border transition ${
                isDark ? "bg-zinc-900 border-zinc-800 text-amber-400" : "bg-white border-zinc-300 text-zinc-700"
              }`}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className={`w-full max-w-md ${cardBgClass} border p-8 sm:p-10 shadow-2xl relative overflow-hidden`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-volt" />

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-none bg-volt text-black flex items-center justify-center font-space font-extrabold text-xl shadow-lg mb-4">
                <svg className="w-7 h-7 text-black" viewBox="0 0 512 512" fill="none">
                  <path d="M 180 200 L 256 385 L 332 200 L 294 200 L 256 295 L 218 200 Z" fill="currentColor" />
                  <polygon points="256,325 242,275 270,275" fill="#000000" />
                </svg>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-space font-extrabold text-xl tracking-[0.25em] uppercase">VALVES</span>
                <span className="bg-volt/15 text-volt text-[10px] font-mono px-2 py-0.5 border border-volt/30">
                  {t.controlCenter}
                </span>
              </div>
              <p className={`text-[11px] font-mono ${textDimClass} uppercase mt-1 tracking-wider`}>
                {t.loginSubtitle}
              </p>
            </div>

            {loginError && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className={`block text-[11px] font-space font-bold uppercase tracking-wider mb-2 ${textMutedClass}`}>
                  {t.usernameLabel}
                </label>
                <div className="relative">
                  <User size={16} className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 ${textDimClass}`} />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="admin"
                    required
                    className={`w-full ${inputBgClass} ${lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 text-xs font-mono uppercase focus:outline-none transition`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-space font-bold uppercase tracking-wider mb-2 ${textMutedClass}`}>
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock size={16} className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 ${textDimClass}`} />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full ${inputBgClass} ${lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 text-xs font-mono focus:outline-none transition`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-volt text-black font-space font-bold text-xs uppercase tracking-widest hover:bg-[#b8e600] active:scale-[0.99] transition shadow-lg flex items-center justify-center gap-2"
              >
                <KeyRound size={15} />
                <span>{t.signInBtn}</span>
              </button>
            </form>

            <div className={`mt-6 pt-6 border-t ${isDark ? "border-zinc-800/80" : "border-zinc-200"} text-center`}>
              <button
                type="button"
                onClick={handleAutoFill}
                className={`text-[11px] font-mono ${textMutedClass} hover:text-volt transition flex items-center justify-center gap-1.5 mx-auto`}
              >
                <ShieldCheck size={14} className="text-volt" />
                <span>{t.autoFillBtn}</span>
              </button>
              <div className={`text-[10px] font-mono ${textDimClass} mt-2`}>
                {t.securityNote}
              </div>
            </div>
          </div>
        </div>

        <footer className={`py-4 text-center text-[10px] font-mono ${textDimClass}`}>
          VALVES CLOTHING CO. // CAIRO FULFILLMENT &amp; CATALOG OS v2.5
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED DASHBOARD
  // ==========================================
  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen ${bgClass} flex flex-col font-sans selection:bg-volt selection:text-black`}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-volt text-black font-space font-bold text-xs tracking-wider px-5 py-3 shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom">
          <Check size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className={`border-b ${headerBgClass} sticky top-0 z-30 transition-colors`}>
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/"
              className={`flex items-center gap-2 text-xs font-mono uppercase ${textMutedClass} hover:text-volt transition shrink-0`}
            >
              {lang === "ar" ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className="hidden sm:inline font-bold">{t.storefront}</span>
            </Link>

            <div className={`h-6 w-[1px] ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />

            <div className="flex items-center gap-3">
              <svg className={`w-8 h-8 ${isDark ? "text-white" : "text-zinc-900"} shrink-0`} viewBox="0 0 512 512" fill="none">
                <path d="M 180 200 L 256 385 L 332 200 L 294 200 L 256 295 L 218 200 Z" fill="currentColor" />
                <polygon points="256,325 242,275 270,275" fill="#d4ff00" />
              </svg>
              <div>
                <h1 className="font-space font-extrabold text-base sm:text-lg tracking-[0.2em] uppercase flex items-center gap-2 leading-none">
                  <span>VALVES</span>
                  <span className="bg-volt/15 text-volt text-[10px] font-mono px-2 py-0.5 border border-volt/30 rounded-none">
                    {t.controlCenter}
                  </span>
                </h1>
                <p className={`text-[10px] font-mono ${textDimClass} uppercase mt-1 hidden sm:block`}>
                  {t.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switch */}
            <button
              onClick={toggleLang}
              className={`px-2.5 sm:px-3 py-2 border text-xs font-mono flex items-center gap-1.5 transition ${
                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-white border-zinc-300 text-zinc-700"
              }`}
              title="Toggle Language"
            >
              <Globe size={13} className="text-volt" />
              <span className="font-bold">{lang === "en" ? "عربي" : "EN"}</span>
            </button>

            {/* Theme Switch */}
            <button
              onClick={toggleTheme}
              className={`p-2 border transition ${
                isDark ? "bg-zinc-900 border-zinc-800 text-amber-400" : "bg-white border-zinc-300 text-zinc-700"
              }`}
              title="Toggle Light / Dark Theme"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Sync Orders */}
            <button
              onClick={loadAllData}
              className={`px-3 py-2 border text-xs font-mono flex items-center gap-2 transition ${
                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white" : "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <RefreshCw size={13} />
              <span className="hidden md:inline">{t.syncOrders}</span>
            </button>

            {/* View Live Store */}
            <Link
              href="/"
              target="_blank"
              className="px-3.5 sm:px-4 py-2 bg-volt text-black text-xs font-space font-bold tracking-wider uppercase hover:bg-[#b8e600] transition flex items-center gap-1.5"
            >
              <span className="hidden sm:inline">{t.viewLiveStore}</span>
              <ArrowUpRight size={14} />
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`p-2 border text-red-400 transition ${
                isDark ? "bg-zinc-900 border-zinc-800 hover:border-red-500/50 hover:bg-red-500/10" : "bg-white border-zinc-300 hover:border-red-400"
              }`}
              title={t.logout}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
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
              className={`py-3.5 text-xs font-space font-bold tracking-[0.15em] border-b-2 uppercase whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-volt text-volt"
                  : `border-transparent ${textMutedClass} hover:text-volt`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-32 space-y-8">
        
        {/* ========================================================= */}
        {/* TAB 1: ORDERS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-8">
            {/* KPI Overview Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className={`p-5 sm:p-6 ${cardBgClass} border flex flex-col justify-between hover:border-volt/50 transition-colors`}>
                <div className={`flex items-center justify-between ${textMutedClass} mb-4`}>
                  <span className="text-[11px] font-space font-bold tracking-wider uppercase">{t.netRevenue}</span>
                  <DollarSign size={16} className="text-volt" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-space font-extrabold">
                    {metrics.totalRev.toLocaleString()} <span className="text-xs text-volt font-mono font-normal">EGP</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-1">
                    <TrendingUp size={12} />
                    <span>{t.vsLastDrop}</span>
                  </div>
                </div>
              </div>

              <div className={`p-5 sm:p-6 ${cardBgClass} border flex flex-col justify-between hover:border-amber-400/50 transition-colors`}>
                <div className={`flex items-center justify-between ${textMutedClass} mb-4`}>
                  <span className="text-[11px] font-space font-bold tracking-wider uppercase">{t.actionRequired}</span>
                  <Clock size={16} className="text-amber-400" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-space font-extrabold text-amber-400">
                    {metrics.pendingCount} <span className={`text-xs ${textMutedClass} font-mono font-normal`}>{t.newOrders}</span>
                  </div>
                  <div className={`text-[10px] font-mono ${textMutedClass} pt-1`}>
                    {t.awaitingCourier}
                  </div>
                </div>
              </div>

              <div className={`p-5 sm:p-6 ${cardBgClass} border flex flex-col justify-between hover:border-volt/50 transition-colors`}>
                <div className={`flex items-center justify-between ${textMutedClass} mb-4`}>
                  <span className="text-[11px] font-space font-bold tracking-wider uppercase">{t.avgBasket}</span>
                  <ShoppingBag size={16} className="text-volt" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-space font-extrabold">
                    {metrics.aov.toLocaleString()} <span className={`text-xs ${textMutedClass} font-mono font-normal`}>{t.perOrder}</span>
                  </div>
                  <div className={`text-[10px] font-mono ${textMutedClass} pt-1`}>
                    {t.garmentsPerCheckout}
                  </div>
                </div>
              </div>

              <div className={`p-5 sm:p-6 ${cardBgClass} border flex flex-col justify-between hover:border-cyan-400/50 transition-colors`}>
                <div className={`flex items-center justify-between ${textMutedClass} mb-4`}>
                  <span className="text-[11px] font-space font-bold tracking-wider uppercase">{t.fulfillmentRate}</span>
                  <Truck size={16} className="text-cyan-400" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-space font-extrabold">
                    {metrics.deliveredCount + metrics.shippedCount} / {metrics.totalOrders}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 pt-1">
                    {t.dispatchedBosta(Math.round(((metrics.deliveredCount + metrics.shippedCount) / (metrics.totalOrders || 1)) * 100))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Controls Bar */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 ${cardBgClass} border`}>
              <div className="relative flex-1 max-w-md">
                <Search size={16} className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 ${textDimClass}`} />
                <input
                  type="text"
                  placeholder={t.searchOrderPlaceholder}
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className={`w-full ${inputBgClass} ${lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 text-xs font-mono uppercase focus:outline-none transition-colors`}
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
                    className={`px-3.5 py-2 text-[11px] font-space font-bold tracking-wider uppercase transition-colors ${
                      statusFilter === key
                        ? "bg-volt text-black"
                        : isDark
                        ? "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                        : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className={`${cardBgClass} border overflow-x-auto shadow-xl`}>
              <table className="w-full text-left rtl:text-right text-xs font-mono">
                <thead className={`${tableHeadClass} text-[10px] font-space font-bold uppercase tracking-[0.15em] border-b`}>
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
                <tbody className={`divide-y ${isDark ? "divide-zinc-800/60" : "divide-zinc-200"}`}>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={`text-center py-16 ${textDimClass} font-mono`}>
                        {t.noOrders}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`${tableRowHoverClass} cursor-pointer transition-colors`}
                      >
                        <td className="py-4 sm:py-5 px-5 sm:px-6 whitespace-nowrap align-middle">
                          <div className="flex items-center gap-1 font-bold text-sm">
                            <span className="text-volt">#</span>
                            <span>{order.id}</span>
                          </div>
                          <span className={`block text-[11px] font-normal ${textDimClass} mt-1`}>
                            {order.createdAt}
                          </span>
                        </td>

                        <td className="py-4 sm:py-5 px-5 sm:px-6 align-middle">
                          <div className="font-bold text-xs sm:text-sm">{order.customerName}</div>
                          <div className={`text-[11px] ${textMutedClass} mt-0.5`}>{order.phone}</div>
                        </td>

                        <td className="py-4 sm:py-5 px-5 sm:px-6 whitespace-nowrap align-middle">
                          <span className={`inline-block px-2.5 py-1 ${badgeMutedClass} border text-[11px] font-space font-medium uppercase tracking-wide`}>
                            {order.city}
                          </span>
                        </td>

                        <td className="py-4 sm:py-5 px-5 sm:px-6 align-middle">
                          <div className={`space-y-1 font-mono text-xs ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                            {order.items.map((i, idx) => (
                              <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
                                <span className="text-volt font-bold">{i.quantity}x</span>
                                <span>{i.name}</span>
                                <span className={`${textDimClass} text-[11px]`}>({i.size})</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 sm:py-5 px-5 sm:px-6 whitespace-nowrap align-middle">
                          <div className="font-space font-bold text-sm">
                            {order.total.toLocaleString()} <span className="text-xs text-volt font-mono font-normal">EGP</span>
                          </div>
                          <span className={`block text-[10px] font-mono ${textMutedClass} mt-0.5 tracking-wider uppercase`}>
                            {order.paymentMethod.includes("COD") ? "COD (كاش)" : "PAID CARD"}
                          </span>
                        </td>

                        <td className="py-4 sm:py-5 px-5 sm:px-6 whitespace-nowrap align-middle" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-flex items-center">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              className={`appearance-none text-[10px] font-space font-bold tracking-wider ${
                                lang === "ar" ? "pr-3 pl-7" : "pl-3 pr-7"
                              } py-1.5 uppercase border rounded-none ${
                                isDark ? "bg-black/70" : "bg-white"
                              } cursor-pointer focus:outline-none focus:ring-1 focus:ring-volt transition ${getStatusBadge(
                                order.status
                              )}`}
                            >
                              <option value="Pending" className={isDark ? "bg-zinc-900 text-amber-400" : "bg-white text-amber-700"}>
                                {t.pending}
                              </option>
                              <option value="Confirmed" className={isDark ? "bg-zinc-900 text-volt" : "bg-white text-lime-700"}>
                                {t.confirmed}
                              </option>
                              <option value="Shipped" className={isDark ? "bg-zinc-900 text-cyan-400" : "bg-white text-cyan-700"}>
                                {t.shipped}
                              </option>
                              <option value="Delivered" className={isDark ? "bg-zinc-900 text-emerald-400" : "bg-white text-emerald-700"}>
                                {t.delivered}
                              </option>
                              <option value="Cancelled" className={isDark ? "bg-zinc-900 text-red-400" : "bg-white text-red-700"}>
                                {t.cancelled}
                              </option>
                            </select>
                            <ChevronDown size={12} className={`absolute ${lang === "ar" ? "left-2" : "right-2"} pointer-events-none ${textDimClass}`} />
                          </div>
                        </td>

                        <td className="py-4 sm:py-5 px-5 sm:px-6 text-right rtl:text-left whitespace-nowrap align-middle" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end rtl:justify-start gap-2.5">
                            <a
                              href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                                order.customerName
                              )},%20this%20is%20VALVES%20Clothing%20regarding%20your%20order%20${order.id}`}
                              target="_blank"
                              rel="noreferrer"
                              title="WhatsApp Customer"
                              className={`p-2 border text-emerald-400 transition ${
                                isDark ? "bg-zinc-900 border-zinc-800 hover:border-emerald-500" : "bg-zinc-100 border-zinc-200 hover:border-emerald-500"
                              }`}
                            >
                              <MessageSquare size={15} />
                            </a>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              title="Inspect Waybill"
                              className={`p-2 border transition ${
                                isDark
                                  ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-volt hover:border-volt/50"
                                  : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black"
                              }`}
                            >
                              <Eye size={15} />
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
            <div className={`p-5 sm:p-6 ${cardBgClass} border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div>
                <h3 className="font-space font-extrabold text-lg tracking-wider uppercase">
                  {t.manageProducts}
                </h3>
                <p className={`text-xs ${textMutedClass} font-light mt-0.5`}>
                  {t.manageProductsSub}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleResetProducts}
                  className={`px-3 py-2 border text-xs font-mono flex items-center gap-1.5 transition ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white" : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200"
                  }`}
                  title="Reset catalogue to original drop"
                >
                  <RotateCcw size={13} />
                  <span>{t.resetCatalogBtn}</span>
                </button>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-volt text-black font-space font-bold text-xs uppercase tracking-wider hover:bg-[#b8e600] transition flex items-center gap-2 shadow-lg"
                >
                  <Plus size={15} />
                  <span>{t.addPieceBtn}</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 ${cardBgClass} border`}>
              <div className="relative flex-1 max-w-md">
                <Search size={16} className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 ${textDimClass}`} />
                <input
                  type="text"
                  placeholder={t.searchProductsPlaceholder}
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className={`w-full ${inputBgClass} ${lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 text-xs font-mono uppercase focus:outline-none transition-colors`}
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className={`p-2.5 text-xs font-space font-bold border uppercase cursor-pointer ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-zinc-100 border-zinc-300 text-zinc-800"
                  }`}
                >
                  <option value="ALL">{t.allCategoriesFilter}</option>
                  {categories.filter(c => c.id !== "all").map(c => (
                    <option key={c.id} value={c.id}>
                      {lang === "ar" ? c.nameAr || c.name : c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className={`${cardBgClass} border overflow-x-auto shadow-xl`}>
              <table className="w-full text-left rtl:text-right text-xs font-mono">
                <thead className={`${tableHeadClass} text-[10px] font-space font-bold uppercase tracking-[0.15em] border-b`}>
                  <tr>
                    <th className="py-4 px-5">{t.pieceCol}</th>
                    <th className="py-4 px-5">{t.collectionCol}</th>
                    <th className="py-4 px-5">{t.priceCol}</th>
                    <th className="py-4 px-5">{t.gsmCol}</th>
                    <th className="py-4 px-5">{t.sizesCol}</th>
                    <th className="py-4 px-5 text-right rtl:text-left">{t.actionsCol}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-zinc-800/60" : "divide-zinc-200"}`}>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`text-center py-16 ${textDimClass} font-mono`}>
                        {t.noProductsFound}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => (
                      <tr key={prod.id} className={`${tableRowHoverClass} transition-colors`}>
                        <td className="py-4 px-5 align-middle">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-14 object-cover border border-zinc-800 shrink-0 bg-zinc-900"
                            />
                            <div>
                              <div className="font-space font-bold text-sm uppercase">{prod.name}</div>
                              <div className={`text-[10px] ${textDimClass} font-mono`}>{prod.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-5 align-middle">
                          <span className={`px-2.5 py-1 ${badgeMutedClass} border text-[10px] font-space font-bold uppercase`}>
                            {prod.collection}
                          </span>
                        </td>

                        <td className="py-4 px-5 align-middle font-space font-bold text-sm">
                          {prod.price.toLocaleString()} <span className="text-xs text-volt font-mono font-normal">{prod.currency || "EGP"}</span>
                        </td>

                        <td className="py-4 px-5 align-middle text-zinc-300 font-mono">
                          {prod.fabricGsm}
                        </td>

                        <td className="py-4 px-5 align-middle">
                          <div className="flex gap-1 flex-wrap">
                            {prod.sizes.map((s) => (
                              <span key={s} className="px-1.5 py-0.5 text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-5 text-right rtl:text-left align-middle">
                          <div className="flex items-center justify-end rtl:justify-start gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className={`p-2 border transition ${
                                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-volt hover:border-volt/50" : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-black"
                              }`}
                              title="Edit Piece"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className={`p-2 border text-red-400 transition ${
                                isDark ? "bg-zinc-900 border-zinc-800 hover:border-red-500/50 hover:bg-red-500/10" : "bg-zinc-100 border-zinc-300 hover:bg-red-50"
                              }`}
                              title="Delete Piece"
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
            <div className={`p-5 sm:p-6 ${cardBgClass} border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div>
                <h3 className="font-space font-extrabold text-lg tracking-wider uppercase">
                  {t.manageCategories}
                </h3>
                <p className={`text-xs ${textMutedClass} font-light mt-0.5`}>
                  {t.manageCategoriesSub}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetCategories}
                  className={`px-3 py-2 border text-xs font-mono flex items-center gap-1.5 transition ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white" : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  <RotateCcw size={13} />
                  <span>{t.resetCategoriesBtn}</span>
                </button>
                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-volt text-black font-space font-bold text-xs uppercase tracking-wider hover:bg-[#b8e600] transition flex items-center gap-2 shadow-lg"
                >
                  <FolderPlus size={15} />
                  <span>{t.addCategoryBtn}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => {
                const count = cat.id === "all" ? products.length : products.filter(p => p.collection.toLowerCase() === cat.id.toLowerCase()).length;
                return (
                  <div key={cat.id} className={`p-5 sm:p-6 ${cardBgClass} border flex flex-col justify-between`}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-mono text-volt bg-zinc-900 px-2 py-0.5 border border-zinc-800 uppercase">
                          {cat.id}
                        </span>
                        {cat.id !== "all" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className={`p-1.5 border transition ${
                                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white" : "bg-zinc-100 border-zinc-300 text-zinc-600"
                              }`}
                              title="Edit"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className={`p-1.5 border text-red-400 transition ${
                                isDark ? "bg-zinc-900 border-zinc-800 hover:bg-red-500/10" : "bg-zinc-100 border-zinc-300 hover:bg-red-50"
                              }`}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      <h4 className="font-space font-bold text-base uppercase mb-1">{cat.name}</h4>
                      <h5 className="font-space text-sm text-volt mb-3">{cat.nameAr}</h5>
                      <p className={`text-xs ${textMutedClass} font-light mb-4`}>{cat.description || "Active storefront section."}</p>
                    </div>

                    <div className={`pt-3 border-t ${isDark ? "border-zinc-800" : "border-zinc-200"} flex items-center justify-between text-xs font-mono`}>
                      <span className={textMutedClass}>{t.productCount}:</span>
                      <span className="font-bold text-volt">{count} {lang === "en" ? "pieces" : "قطعة"}</span>
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
            <div className={`p-5 sm:p-6 ${cardBgClass} border flex items-center justify-between`}>
              <div>
                <h3 className="font-space font-extrabold text-base tracking-wider uppercase">
                  FABRIC &amp; INVENTORY ARCHIVE
                </h3>
                <p className={`text-xs ${textMutedClass} font-light mt-0.5`}>
                  Real-time stock across Cairo cutting room and distribution hub.
                </p>
              </div>
              <div className={`flex items-center gap-2 text-xs font-mono text-volt ${badgeMutedClass} px-3 py-1.5 border`}>
                <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
                <span>380-460 GSM MILL RUNNING</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div key={prod.id} className={`p-5 sm:p-6 ${cardBgClass} border flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-mono text-volt uppercase">{prod.collection}</span>
                        <h4 className="font-space font-bold text-sm uppercase mt-0.5">
                          {prod.name}
                        </h4>
                      </div>
                      <span className={`px-2 py-0.5 ${badgeMutedClass} border text-[10px] font-mono`}>
                        {prod.fabricGsm}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className={`text-[11px] font-mono ${textMutedClass}`}>STOCK BREAKDOWN BY SIZE:</div>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                        {prod.sizes.map((s, idx) => {
                          const stock = (idx * 7 + 9) % 24;
                          return (
                            <div
                              key={s}
                              className={`p-2 border ${
                                stock <= 3
                                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                                  : isDark
                                  ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                                  : "bg-zinc-100 border-zinc-200 text-zinc-800"
                              }`}
                            >
                              <div className={`text-[10px] ${textDimClass}`}>{s}</div>
                              <div className="font-bold">{stock} pcs</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className={`pt-3 border-t ${isDark ? "border-zinc-800" : "border-zinc-200"} flex justify-between items-center text-xs font-space font-bold ${textMutedClass}`}>
                    <span>UNIT PRICE: {prod.price.toLocaleString()} EGP</span>
                    <span className="text-emerald-400">ACTIVE DROP</span>
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
              <div className={`p-6 ${cardBgClass} border`}>
                <h4 className="font-space font-bold text-sm tracking-wider uppercase mb-4">
                  PAYMENT METHODS SPLIT
                </h4>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className={`flex justify-between ${textMutedClass} mb-1`}>
                      <span>CASH ON DELIVERY (COD)</span>
                      <span className="text-volt font-bold">58%</span>
                    </div>
                    <div className={`w-full h-1.5 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}><div className="w-[58%] h-full bg-volt" /></div>
                  </div>
                  <div>
                    <div className={`flex justify-between ${textMutedClass} mb-1`}>
                      <span>CREDIT / DEBIT CARDS</span>
                      <span className="text-cyan-400 font-bold">28%</span>
                    </div>
                    <div className={`w-full h-1.5 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}><div className="w-[28%] h-full bg-cyan-400" /></div>
                  </div>
                  <div>
                    <div className={`flex justify-between ${textMutedClass} mb-1`}>
                      <span>INSTAPAY INSTANT</span>
                      <span className="text-emerald-400 font-bold">14%</span>
                    </div>
                    <div className={`w-full h-1.5 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}><div className="w-[14%] h-full bg-emerald-400" /></div>
                  </div>
                </div>
              </div>

              <div className={`p-6 ${cardBgClass} border`}>
                <h4 className="font-space font-bold text-sm tracking-wider uppercase mb-4">
                  TOP CITIES BY DEMAND
                </h4>
                <ul className={`space-y-2.5 font-mono text-xs ${textMutedClass}`}>
                  <li className="flex justify-between"><span>1. NEW CAIRO (التجمع الخامس)</span><span className="text-volt font-bold">42%</span></li>
                  <li className="flex justify-between"><span>2. SHEIKH ZAYED &amp; 6TH OCT</span><span className="text-volt font-bold">26%</span></li>
                  <li className="flex justify-between"><span>3. ALEXANDRIA (الإسكندرية)</span><span>16%</span></li>
                  <li className="flex justify-between"><span>4. MAADI &amp; HELIOPOLIS</span><span>11%</span></li>
                  <li className="flex justify-between"><span>5. MANSOURA &amp; DELTA</span><span>5%</span></li>
                </ul>
              </div>

              <div className={`p-6 ${cardBgClass} border flex flex-col justify-between`}>
                <div>
                  <h4 className="font-space font-bold text-sm tracking-wider uppercase mb-2">
                    DISCOUNT CAMPAIGN
                  </h4>
                  <p className={`text-xs ${textMutedClass} font-light mb-4`}>
                    Performance of the secret drop coupon code:
                  </p>
                  <div className={`p-3 ${badgeMutedClass} border font-mono text-xs flex justify-between items-center mb-2`}>
                    <span className="text-volt font-bold">VALVES10 (10% OFF)</span>
                    <span>38 USES</span>
                  </div>
                </div>
                <div className={`text-[11px] font-mono ${textDimClass}`}>
                  Average order increase with promo: +320 EGP
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`relative w-full max-w-2xl ${cardBgClass} border max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col`}>
            <div className={`p-5 border-b ${isDark ? "border-zinc-800" : "border-zinc-200"} flex items-center justify-between`}>
              <h3 className="font-space font-extrabold text-base uppercase">
                {editingProduct ? (lang === "en" ? "EDIT PIECE SPECIFICATIONS" : "تعديل بيانات القطعة") : (lang === "en" ? "ADD NEW CATALOGUE PIECE" : "إضافة قطعة جديدة للكتالوج")}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className={`p-1.5 rounded-full ${isDark ? "bg-zinc-900 text-zinc-400 hover:text-white" : "bg-zinc-100 text-zinc-600"}`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-space font-bold uppercase mb-1">PIECE NAME *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="KINETIC ZIP HOODIE"
                    className={`w-full p-2.5 border uppercase ${inputBgClass}`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-space font-bold uppercase mb-1">COLLECTION / CATEGORY *</label>
                  <select
                    value={productForm.collection}
                    onChange={(e) => setProductForm({ ...productForm, collection: e.target.value })}
                    className={`w-full p-2.5 border uppercase cursor-pointer ${inputBgClass}`}
                  >
                    {categories.filter(c => c.id !== "all").map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.nameAr})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-space font-bold uppercase mb-1">PRICE (EGP) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className={`w-full p-2.5 border ${inputBgClass}`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-space font-bold uppercase mb-1">FABRIC GSM *</label>
                  <input
                    type="text"
                    required
                    value={productForm.fabricGsm}
                    onChange={(e) => setProductForm({ ...productForm, fabricGsm: e.target.value })}
                    placeholder="460 GSM Heavyweight"
                    className={`w-full p-2.5 border ${inputBgClass}`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-space font-bold uppercase mb-1">RELEASE TAG</label>
                  <input
                    type="text"
                    value={productForm.tag}
                    onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                    placeholder="DROP 01 • LIMITED"
                    className={`w-full p-2.5 border ${inputBgClass}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">IMAGE URL *</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className={`w-full p-2.5 border ${inputBgClass}`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">AVAILABLE SIZES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={productForm.sizes}
                  onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  placeholder="S, M, L, XL, XXL"
                  className={`w-full p-2.5 border uppercase ${inputBgClass}`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className={`w-full p-2.5 border ${inputBgClass}`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">BULLET SPECIFICATIONS (ONE PER LINE)</label>
                <textarea
                  rows={2}
                  value={productForm.details}
                  onChange={(e) => setProductForm({ ...productForm, details: e.target.value })}
                  className={`w-full p-2.5 border ${inputBgClass}`}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className={`px-4 py-2 border text-xs font-mono ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-zinc-100 border-zinc-300"}`}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-volt text-black font-space font-bold text-xs uppercase tracking-wider hover:bg-[#b8e600]"
                >
                  SAVE PIECE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CATEGORY ADD / EDIT MODAL */}
      {/* ========================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`relative w-full max-w-md ${cardBgClass} border shadow-2xl flex flex-col`}>
            <div className={`p-5 border-b ${isDark ? "border-zinc-800" : "border-zinc-200"} flex items-center justify-between`}>
              <h3 className="font-space font-extrabold text-base uppercase">
                {editingCategory ? "EDIT STORE CATEGORY" : "ADD NEW STORE CATEGORY"}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className={`p-1.5 rounded-full ${isDark ? "bg-zinc-900 text-zinc-400 hover:text-white" : "bg-zinc-100 text-zinc-600"}`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs font-mono">
              {!editingCategory && (
                <div>
                  <label className="block text-[10px] font-space font-bold uppercase mb-1">CATEGORY SLUG / ID *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.id}
                    onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                    placeholder="accessories"
                    className={`w-full p-2.5 border lowercase ${inputBgClass}`}
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">ENGLISH TITLE *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="ACCESSORIES & CAPS"
                  className={`w-full p-2.5 border uppercase ${inputBgClass}`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">ARABIC TITLE *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.nameAr}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })}
                  placeholder="إكسسوارات وقبعات"
                  className={`w-full p-2.5 border ${inputBgClass}`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-space font-bold uppercase mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Technical accessories engineered for everyday movement."
                  className={`w-full p-2.5 border ${inputBgClass}`}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className={`px-4 py-2 border text-xs font-mono ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-zinc-100 border-zinc-300"}`}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-volt text-black font-space font-bold text-xs uppercase tracking-wider hover:bg-[#b8e600]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`relative w-full max-w-2xl ${cardBgClass} border max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col`}>
            <div className={`p-5 border-b ${isDark ? "border-zinc-800" : "border-zinc-200"} flex items-center justify-between`}>
              <div>
                <span className="text-[10px] font-mono text-volt uppercase">{t.dispatchRecord}</span>
                <h3 className="font-space font-extrabold text-lg uppercase">
                  ORDER #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className={`p-1.5 rounded-full ${isDark ? "bg-zinc-900 text-zinc-400 hover:text-white" : "bg-zinc-100 text-zinc-600 hover:text-black"}`}
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs font-mono">
              <div className={`p-4 ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-100 border-zinc-200"} border flex justify-between items-start`}>
                <div>
                  <div className="font-space font-bold text-sm tracking-widest uppercase">
                    {t.waybillTitle}
                  </div>
                  <div className={`text-[10px] ${textDimClass} mt-0.5`}>
                    {t.courierPartner}
                  </div>
                  <div className={`text-[10px] ${textDimClass}`}>
                    AIRWAY BILL #BST-2026-VALVES-{selectedOrder.id.replace("VLV-", "")}
                  </div>
                </div>
                <span className={`px-3 py-1 text-[10px] font-space font-bold tracking-wider uppercase border ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className={`grid grid-cols-2 gap-4 p-4 ${isDark ? "bg-zinc-900/60 border-zinc-800/80" : "bg-zinc-50 border-zinc-200"} border`}>
                <div>
                  <div className={`text-[10px] ${textDimClass} uppercase mb-1`}>{t.recipient}</div>
                  <div className="font-bold text-sm">{selectedOrder.customerName}</div>
                  <div className={`${textMutedClass} mt-1`}>{selectedOrder.phone}</div>
                  <div className={`${textDimClass} text-[11px]`}>{selectedOrder.email}</div>
                </div>
                <div>
                  <div className={`text-[10px] ${textDimClass} uppercase mb-1`}>{t.shippingDest}</div>
                  <div className="font-bold text-volt">{selectedOrder.city}</div>
                  <div className={`${textMutedClass} mt-1 leading-relaxed`}>{selectedOrder.address}</div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className={`p-3 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200"} border text-[11px]`}>
                  <span className="text-volt font-bold uppercase">{t.customerInstruction} </span>
                  <span className={textMutedClass}>{selectedOrder.notes}</span>
                </div>
              )}

              <div>
                <div className={`text-[10px] ${textDimClass} uppercase mb-2`}>{t.orderManifest}</div>
                <div className={`border ${isDark ? "border-zinc-800 divide-zinc-800" : "border-zinc-200 divide-zinc-200"} divide-y`}>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className={`p-3 flex justify-between items-center ${isDark ? "bg-zinc-950" : "bg-white"}`}>
                      <div>
                        <div className="font-bold font-sans text-xs">{it.name}</div>
                        <div className={`text-[11px] ${textDimClass} mt-0.5`}>
                          SIZE: {it.size} • COLOR: {it.color} • {it.fabricGsm}
                        </div>
                      </div>
                      <div className="text-right rtl:text-left">
                        <div className={`${textMutedClass} text-xs`}>{it.quantity} x {it.price.toLocaleString()} EGP</div>
                        <div className="font-bold text-volt">{(it.quantity * it.price).toLocaleString()} EGP</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-4 ${isDark ? "bg-zinc-900/60 border-zinc-800/80" : "bg-zinc-50 border-zinc-200"} border space-y-1.5`}>
                <div className={`flex justify-between ${textMutedClass}`}>
                  <span>{t.subtotal}</span>
                  <span>{selectedOrder.subtotal.toLocaleString()} EGP</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-volt">
                    <span>{t.discountApplied}</span>
                    <span>-{selectedOrder.discount.toLocaleString()} EGP</span>
                  </div>
                )}
                <div className={`flex justify-between ${textMutedClass}`}>
                  <span>{t.shippingFee}</span>
                  <span>{selectedOrder.shipping === 0 ? t.freeExpress : `${selectedOrder.shipping} EGP`}</span>
                </div>
                <div className={`flex justify-between font-bold text-sm pt-2 border-t ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                  <span>{t.amountToCollect} ({selectedOrder.paymentMethod})</span>
                  <span className="text-volt">{selectedOrder.total.toLocaleString()} EGP</span>
                </div>
              </div>

              <div className={`p-4 ${isDark ? "bg-black border-zinc-800" : "bg-zinc-100 border-zinc-200"} border flex flex-wrap items-center justify-between gap-3`}>
                <span className={`text-[11px] font-space font-bold uppercase ${textMutedClass}`}>{t.updateStatus}</span>
                <div className="flex flex-wrap gap-2">
                  {(["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`px-2.5 py-1 text-[10px] font-space font-bold tracking-wider uppercase border transition ${
                        selectedOrder.status === st
                          ? "bg-volt text-black border-volt"
                          : isDark
                          ? "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                          : "bg-white text-zinc-600 border-zinc-200 hover:text-black"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-5 border-t ${isDark ? "border-zinc-800 bg-[#141417]" : "border-zinc-200 bg-white"} flex items-center justify-between`}>
              <a
                href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                  selectedOrder.customerName
                )},%20VALVES%20order%20${selectedOrder.id}%20status:%20${selectedOrder.status}`}
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2.5 border text-emerald-400 font-space text-xs font-bold uppercase flex items-center gap-2 transition ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 hover:border-emerald-500"
                    : "bg-zinc-100 border-zinc-300 hover:border-emerald-500"
                }`}
              >
                <MessageSquare size={14} />
                <span>{t.whatsappCustomer}</span>
              </a>

              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-volt text-black font-space text-xs font-bold uppercase tracking-wider hover:bg-[#b8e600] flex items-center gap-2 transition"
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
