"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "light" | "dark";
export type Language = "en" | "ar";

interface StoreContextType {
  theme: Theme;
  lang: Language;
  isDark: boolean;
  isRTL: boolean;
  toggleTheme: () => void;
  toggleLang: () => void;
  setTheme: (theme: Theme) => void;
  setLang: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const STORE_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Ticker & Navbar
    "nav.ticker": "LIMITED DROP 01 LIVE · COMPLIMENTARY EXPRESS DELIVERY OVER 2,000 EGP",
    "nav.collection": "COLLECTION",
    "nav.materials": "MATERIALS",
    "nav.sizeGuide": "SIZE GUIDE",
    "nav.brand": "VALVES",
    "nav.cart": "BAG",

    // Hero Section
    "hero.tag": "SEASON ARCHIVE 2026 // DROP 01",
    "hero.title1": "CONTROL THE FLOW.",
    "hero.subtitle": "Engineered architectural streetwear and minimalist essentials, crafted in Cairo from custom 460 GSM Egyptian cotton.",
    "hero.cta": "EXPLORE DROP 01",

    // Catalog Section
    "catalog.archiveLabel": "CURATED ARCHIVE // 2026",
    "catalog.allTitle": "ALL PIECES",
    "catalog.streetwearTitle": "STREETWEAR",
    "catalog.casualTitle": "MINIMALIST CASUAL",
    "catalog.athleisureTitle": "ATHLEISURE",
    "catalog.sortFeatured": "SORT: FEATURED",
    "catalog.sortPriceAsc": "PRICE: LOW TO HIGH",
    "catalog.sortPriceDesc": "PRICE: HIGH TO LOW",
    "catalog.quickView": "VIEW DETAILS",
    "catalog.addToBag": "ADD TO BAG",
    "catalog.selectSize": "SELECT SIZE",
    "catalog.noPieces": "NO PIECES FOUND IN THIS CATEGORY",

    // Product Detail Drawer
    "drawer.title": "PRODUCT SPECIFICATIONS",
    "drawer.freeShipping": "Complimentary delivery in Egypt on orders over 2,000 EGP",
    "drawer.easyReturns": "14-day archival exchange & return policy",
    "drawer.selectSize": "SIZE",
    "drawer.selectColor": "COLORWAY",
    "drawer.quantity": "QUANTITY",
    "drawer.fabricSpecs": "FABRIC SPECIFICATIONS & CUT",
    "drawer.addedToBag": "ADDED TO YOUR BAG",
    "drawer.addToCart": "ADD TO SHOPPING BAG",
    "drawer.egp": "EGP",

    // Cart Drawer
    "cart.title": "SHOPPING BAG",
    "cart.empty": "YOUR BAG IS EMPTY",
    "cart.exploreBtn": "EXPLORE DROP 01",
    "cart.freeShippingProgress": "away from complimentary express delivery",
    "cart.freeShippingUnlocked": "COMPLIMENTARY EXPRESS DELIVERY UNLOCKED",
    "cart.promoPlaceholder": "PROMO CODE (e.g. VALVES10)",
    "cart.apply": "APPLY",
    "cart.subtotal": "SUBTOTAL",
    "cart.discount": "PROMO DISCOUNT",
    "cart.shipping": "EXPRESS SHIPPING",
    "cart.free": "FREE",
    "cart.total": "TOTAL",
    "cart.checkout": "PROCEED TO CHECKOUT",
    "cart.orderSuccess": "ORDER RECORDED",
    "cart.orderSuccessMsg": "Your order has been queued in our Cairo atelier. SMS courier tracking will be dispatched shortly.",
    "cart.fullName": "FULL NAME",
    "cart.phone": "MOBILE NUMBER (01xxxxxxxxx)",
    "cart.city": "DESTINATION CITY",
    "cart.address": "STREET / BUILDING / APARTMENT",
    "cart.notes": "DELIVERY INSTRUCTIONS (OPTIONAL)",
    "cart.paymentMethod": "PAYMENT METHOD",
    "cart.cod": "CASH ON DELIVERY (COD)",
    "cart.card": "CREDIT / DEBIT CARD",
    "cart.placeOrder": "CONFIRM ORDER",

    // Material Proof Spread
    "materials.tag": "MATERIAL PROOF // CAIRO MILLS",
    "materials.title": "460 GSM VS 300 GSM CAIRO COTTON",
    "materials.desc": "We reject synthetic fillers and superficial finishes. Every yard is milled in Cairo from long-staple Egyptian cotton, calibrated for heavy structure and kinetic ease.",
    "materials.c300Title": "300 GSM COMBED COTTON",
    "materials.c300Sub": "Lightweight Structure & Everyday Breathability",
    "materials.c300P1": "High-density single jersey spun from long-staple Egyptian combed yarn",
    "materials.c300P2": "Tailored boxy drape that holds its silhouette through continuous daily wear",
    "materials.c300P3": "Bio-polished surface with natural moisture permeability",
    "materials.c300P4": "Engineered for hot Cairo daylight and mild evening breezes",
    "materials.c460Title": "460 GSM HEAVY FRENCH TERRY",
    "materials.c460Sub": "Architectural Stature & Substantial Stiff Drape",
    "materials.c460P1": "Custom-milled unbrushed loopback cotton providing structured dropped shoulders",
    "materials.c460P2": "Zero-sag neckline and reinforced seams tested through 50+ wash cycles",
    "materials.c460P3": "Pre-shrunk vintage wash with deep dye absorption and subtle luster",
    "materials.c460P4": "Substantial windbreak insulation for year-round urban layering",

    // Size Guide Modal
    "sizeGuide.title": "ARCHITECTURAL FIT & SIZE GUIDE",
    "sizeGuide.subtitle": "All measurements in centimeters (CM). Boxy architectural drape.",
    "sizeGuide.size": "SIZE",
    "sizeGuide.chest": "CHEST",
    "sizeGuide.length": "LENGTH",
    "sizeGuide.shoulder": "SHOULDER",
    "sizeGuide.close": "CLOSE",

    // Footer
    "footer.tagline": "Architectural streetwear & minimalist casuals. Cairo, Egypt.",
    "footer.delivery": "Express Delivery Across Egypt · 24–48h Dispatch from Cairo",
    "footer.stamp": "VALVES · CAIRO 30°N",
    "footer.newsletterTitle": "THE VALVES DISPATCH",
    "footer.newsletterDesc": "Receive early access to seasonal drops and atelier fabric notes.",
    "footer.subscribe": "SUBSCRIBE",
    "footer.subscribed": "SUBSCRIBED",
    "footer.rights": "ALL RIGHTS RESERVED. VALVES APPAREL ATELIER // CAIRO, EGYPT.",
  },
  ar: {
    // Ticker & Navbar
    "nav.ticker": "إطلاق دروب 01 متاح الآن · شحن سريع مجاني للطلبات فوق 2,000 ج.م",
    "nav.collection": "المجموعة",
    "nav.materials": "الأقمشة",
    "nav.sizeGuide": "دليل المقاسات",
    "nav.brand": "فالفز",
    "nav.cart": "الحقيبة",

    // Hero Section
    "hero.tag": "أرشيف موسم 2026 // دروب 01",
    "hero.title1": "تحكّم في التدفق.",
    "hero.subtitle": "ملابس ستريتوير معمارية وأزياء أساسية راقية، صُنعت في القاهرة من أقطان مصرية فاخرة بوزن 460 جرام.",
    "hero.cta": "استكشف دروب 01",

    // Catalog Section
    "catalog.archiveLabel": "الأرشيف المختار // 2026",
    "catalog.allTitle": "جميع القطع",
    "catalog.streetwearTitle": "ملابس الشارع",
    "catalog.casualTitle": "كاجوال مريح",
    "catalog.athleisureTitle": "رياضي وأداء",
    "catalog.sortFeatured": "ترتيب: المميز",
    "catalog.sortPriceAsc": "السعر: من الأقل للأعلى",
    "catalog.sortPriceDesc": "السعر: من الأعلى للأقل",
    "catalog.quickView": "التفاصيل",
    "catalog.addToBag": "إضافة للحقيبة",
    "catalog.selectSize": "اختر المقاس",
    "catalog.noPieces": "لا توجد قطع في هذا القسم حالياً",

    // Product Detail Drawer
    "drawer.title": "مواصفات القطعة",
    "drawer.freeShipping": "شحن سريع مجاني داخل مصر للطلبات فوق 2,000 ج.م",
    "drawer.easyReturns": "سياسة استبدال واسترجاع ميسرة خلال 14 يوماً",
    "drawer.selectSize": "المقاس",
    "drawer.selectColor": "اللون",
    "drawer.quantity": "الكمية",
    "drawer.fabricSpecs": "مواصفات القماش والقصة الهندسية",
    "drawer.addedToBag": "تمت الإضافة للحقيبة",
    "drawer.addToCart": "إضافة إلى حقيبة التسوق",
    "drawer.egp": "ج.م",

    // Cart Drawer
    "cart.title": "حقيبة التسوق",
    "cart.empty": "حقيبة التسوق فارغة",
    "cart.exploreBtn": "استكشف قطع دروب 01",
    "cart.freeShippingProgress": "متبقي للحصول على شحن سريع مجاني",
    "cart.freeShippingUnlocked": "تم تفعيل الشحن السريع المجاني",
    "cart.promoPlaceholder": "كود الخصم (مثال: VALVES10)",
    "cart.apply": "تطبيق",
    "cart.subtotal": "المجموع الفرعي",
    "cart.discount": "الخصم",
    "cart.shipping": "الشحن السريع",
    "cart.free": "مجاناً",
    "cart.total": "الإجمالي",
    "cart.checkout": "متابعة الطلب",
    "cart.orderSuccess": "تم تسجيل طلبك",
    "cart.orderSuccessMsg": "تم إدراج طلبك في معمل التجهيز بالقاهرة. ستصلك رسالة SMS برابط تتبع الشحنة فور انطلاقها.",
    "cart.fullName": "الاسم بالكامل",
    "cart.phone": "رقم الهاتف المحمول (01xxxxxxxxx)",
    "cart.city": "المدينة / المحافظة",
    "cart.address": "العنوان التفصيلي (الشارع / العمارة / الشقة)",
    "cart.notes": "ملاحظات التوصيل (اختياري)",
    "cart.paymentMethod": "طريقة الدفع",
    "cart.cod": "الدفع عند الاستلام (COD)",
    "cart.card": "بطاقة بنكية",
    "cart.placeOrder": "تأكيد الطلب الآن",

    // Material Proof Spread
    "materials.tag": "برهان الجودة والخامات // معمل القاهرة",
    "materials.title": "مقارنة 460 جرام مقابل 300 جرام من القطن المصري",
    "materials.desc": "نرفض الخلطات البلاستيكية والأوزان المصطنعة. كل متر قماش يُغزل ويُحاك في القاهرة من أقطان مصرية طويلة التيلة، لثبات معمارى فائق وحرية حركة كاملة.",
    "materials.c300Title": "قطن ممشط بوزن 300 جرام",
    "materials.c300Sub": "قوام خفيف الوزن وتهوية يومية استثنائية",
    "materials.c300P1": "نسيج سينجل جيرسيه عالي الكثافة من خيوط قطنية مصرية فائقة النعومة",
    "materials.c300P2": "قصة مربعة هندسية تحافظ على قوامها وانسيابها مع كثرة الاستخدام",
    "materials.c300P3": "سطح قماشي معالج ضد التوبير والبهتان",
    "materials.c300P4": "مثالي لحرارة النهار وأجواء المساء المعتدلة بالقاهرة",
    "materials.c460Title": "ميلتون فرنش تيري ثقيل 460 جرام",
    "materials.c460Sub": "هيبة معمارية وقوام قماشي صلب ورصين",
    "materials.c460P1": "حلقات قطنية داخلية غير مفرغة محاكة بطلب خاص لثبات خطوط الأكتاف",
    "materials.c460P2": "ياقة وأطراف مضلعة فائقة المرونة تمنع الترهل حتى بعد 50 دورة غسيل",
    "materials.c460P3": "معالجة فينتاج خاصة لمنع الانكماش وتثبيت درجات الصبغة الحجرية",
    "materials.c460P4": "عزل متين ضد نسمات الرياح الباردة لارتداء راقٍ طوال العام",

    // Size Guide Modal
    "sizeGuide.title": "دليل المقاسات المعماري",
    "sizeGuide.subtitle": "جميع القياسات بالسنتيمتر (CM). قصة معمارية واسعة.",
    "sizeGuide.size": "المقاس",
    "sizeGuide.chest": "محيط الصدر",
    "sizeGuide.length": "الطول",
    "sizeGuide.shoulder": "عرض الكتف",
    "sizeGuide.close": "إغلاق",

    // Footer
    "footer.tagline": "أزياء ستريتوير معمارية وأساسيات مريحة. القاهرة، مصر.",
    "footer.delivery": "شحن سريع لكافة محافظات مصر · تجهيز وشحن خلال 24–48 ساعة من القاهرة",
    "footer.stamp": "فالفز · القاهرة 30°N",
    "footer.newsletterTitle": "نشرة فالفز البريدية",
    "footer.newsletterDesc": "كن أول من يحصل على إشعارات الدروبات المحدودة وملاحظات المعمل.",
    "footer.subscribe": "اشتراك",
    "footer.subscribed": "تم الاشتراك",
    "footer.rights": "جميع الحقوق محفوظة. معمل فالفز للأزياء المعمارية // القاهرة، مصر.",
  },
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Light Mode is default as requested: "Light Mode — Cairo Limestone & Oxidized Copper (Default)"
  const [theme, setThemeState] = useState<Theme>("light");
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("valves_store_theme") as Theme;
      if (storedTheme === "light" || storedTheme === "dark") {
        setThemeState(storedTheme);
        applyThemeClass(storedTheme);
      } else {
        applyThemeClass("light");
      }

      const storedLang = localStorage.getItem("valves_store_lang") as Language;
      if (storedLang === "ar" || storedLang === "en") {
        setLangState(storedLang);
        applyLangDir(storedLang);
      } else {
        applyLangDir("en");
      }
    } catch {
      applyThemeClass("light");
      applyLangDir("en");
    }
    setMounted(true);
  }, []);

  const applyThemeClass = (t: Theme) => {
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

  const applyLangDir = (l: Language) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.lang = l;
      root.dir = l === "ar" ? "rtl" : "ltr";
    }
  };

  const setTheme = (next: Theme) => {
    setThemeState(next);
    applyThemeClass(next);
    try {
      localStorage.setItem("valves_store_theme", next);
      localStorage.setItem("valves_admin_theme", next);
    } catch {}
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const setLang = (next: Language) => {
    setLangState(next);
    applyLangDir(next);
    try {
      localStorage.setItem("valves_store_lang", next);
      localStorage.setItem("valves_admin_lang", next);
    } catch {}
  };

  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
  };

  const t = (key: string, defaultText: string = ""): string => {
    return STORE_TRANSLATIONS[lang]?.[key] || STORE_TRANSLATIONS.en[key] || defaultText || key;
  };

  const isDark = theme === "dark";
  const isRTL = lang === "ar";

  return (
    <StoreContext.Provider
      value={{
        theme,
        lang,
        isDark,
        isRTL,
        toggleTheme,
        toggleLang,
        setTheme,
        setLang,
        t,
      }}
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-[var(--bg-primary)] text-[var(--ink-primary)] transition-colors duration-200"
      >
        {children}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return ctx;
};
