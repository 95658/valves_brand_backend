"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "dark" | "light";
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
    // Top Bar & Navbar
    "nav.ticker": "DROP 01 LIVE // FREE DELIVERY ON ORDERS OVER 2,000 EGP",
    "nav.allPieces": "ALL PIECES",
    "nav.streetwear": "STREETWEAR",
    "nav.casual": "MINIMALIST CASUAL",
    "nav.athleisure": "ATHLEISURE",
    "nav.archive": "THE ARCHIVE",
    "nav.brandGuide": "BRAND GUIDE",
    "nav.admin": "ADMIN",
    "nav.getApp": "GET APP",
    "nav.cart": "CART",

    // Hero Section
    "hero.tag": "SEASON ARCHIVE 2026 // LIMITED DROP 01",
    "hero.title1": "CONTROL THE FLOW.",
    "hero.title2": "BREAK THE RESISTANCE.",
    "hero.subtitle": "Engineered architectural streetwear, clean everyday casuals, and high-performance athleisure. Built from custom 460 GSM organic fabrics and precision technical cuts.",
    "hero.shopBtn": "SHOP THE COLLECTION",
    "hero.brandArchive": "BRAND ARCHIVE",
    "hero.apparelArch": "EGYPTIAN APPAREL ARCHITECTURE",
    "hero.coords": "LATITUDE 30.0444° N / LONGITUDE 31.2357° E",
    "hero.gsmRange": "HEAVYWEIGHT 300-460 GSM",

    // Catalog Section
    "catalog.archiveLabel": "CATALOGUE ARCHIVE // 2026",
    "catalog.allTitle": "ALL ARCHIVAL PIECES",
    "catalog.streetwearTitle": "STREETWEAR COLLECTION",
    "catalog.casualTitle": "MINIMALIST CASUALS",
    "catalog.athleisureTitle": "ATHLEISURE & TRAINING",
    "catalog.sortFeatured": "SORT: FEATURED",
    "catalog.sortPriceAsc": "PRICE: LOW TO HIGH",
    "catalog.sortPriceDesc": "PRICE: HIGH TO LOW",
    "catalog.quickView": "QUICK VIEW",
    "catalog.addToBag": "ADD TO BAG",
    "catalog.selectSize": "SELECT SIZE",
    "catalog.noPieces": "NO PIECES FOUND IN THIS CATEGORY",

    // Product Modal
    "modal.freeShipping": "Free Cairo delivery for orders over 2,000 EGP",
    "modal.easyReturns": "14-day hassle-free return and exchange policy",
    "modal.gsmTag": "Custom Milled Heavyweight Fabric",
    "modal.selectSize": "CHOOSE SIZE",
    "modal.selectColor": "CHOOSE COLOR",
    "modal.quantity": "QUANTITY",
    "modal.fabricSpecs": "FABRIC SPECIFICATIONS & CUT",
    "modal.addedToBag": "ADDED TO YOUR BAG",
    "modal.addToCart": "ADD TO SHOPPING BAG",

    // Cart Drawer
    "cart.title": "YOUR ARCHIVE BAG",
    "cart.empty": "YOUR BAG IS CURRENTLY EMPTY",
    "cart.exploreBtn": "EXPLORE DROP 01",
    "cart.freeShippingProgress": "Away from FREE Express Delivery",
    "cart.freeShippingUnlocked": "🎉 FREE EXPRESS DELIVERY UNLOCKED",
    "cart.promoPlaceholder": "PROMO CODE (e.g. VALVES10)",
    "cart.apply": "APPLY",
    "cart.subtotal": "SUBTOTAL",
    "cart.discount": "PROMO DISCOUNT",
    "cart.shipping": "EXPRESS SHIPPING",
    "cart.free": "FREE",
    "cart.total": "TOTAL",
    "cart.checkout": "PROCEED TO CHECKOUT",
    "cart.orderSuccess": "ORDER CONFIRMED!",
    "cart.orderSuccessMsg": "Your order has been recorded into the live Cairo fulfillment queue. Courier tracking will arrive via SMS.",
    "cart.fullName": "FULL NAME",
    "cart.phone": "PHONE NUMBER (01xxxxxxxxx)",
    "cart.city": "DESTINATION CITY",
    "cart.address": "STREET ADDRESS / BUILDING / APT",
    "cart.notes": "DELIVERY NOTES (OPTIONAL)",
    "cart.paymentMethod": "PAYMENT METHOD",
    "cart.cod": "CASH ON DELIVERY (الدفع عند الاستلام)",
    "cart.card": "CREDIT / DEBIT CARD",
    "cart.placeOrder": "CONFIRM ORDER",

    // Brand Manifesto
    "manifesto.tag": "03 // ARCHITECTURAL PHILOSOPHY",
    "manifesto.title1": "NOT JUST CLOTHING.",
    "manifesto.title2": "AN INSTRUMENT OF FLOW & RESISTANCE.",
    "manifesto.desc": "In thermodynamics, a valve governs the release of trapped pressure and dictates fluid energy. We take that principle into modern apparel: heavy Egyptian cottons that resist degradation, paired with fluid kinetic cuts that empower daily movement across the city.",
    "manifesto.pillar1Title": "460 GSM TERRY",
    "manifesto.pillar1Desc": "Custom milled heavyweight cotton loops for structured drop shoulders that never sag after washing.",
    "manifesto.pillar2Title": "AERO REGULATION",
    "manifesto.pillar2Desc": "Integrated laser ventilation and technical membranes designed for Cairo heat and chilly night breezes.",
    "manifesto.pillar3Title": "LOCAL MILLING",
    "manifesto.pillar3Desc": "100% spun, cut, and assembled by specialized heritage artisans in Cairo, Egypt.",
    "manifesto.pillar4Title": "PRECISION FIT",
    "manifesto.pillar4Desc": "Engineered drape with minimal distortion, tested rigorously on athletes and artists.",

    // Footer
    "footer.nativeApp": "NATIVE MOBILE APPLICATION",
    "footer.downloadApp": "DOWNLOAD THE VALVES APP",
    "footer.downloadDesc": "Get exclusive 30-minute early access to seasonal drops, live order tracking, and in-app member pricing.",
    "footer.appleStore": "APPLE APP STORE",
    "footer.googlePlay": "GOOGLE PLAY STORE",
    "footer.newsletterTitle": "JOIN THE PRIVATE INNER CIRCLE",
    "footer.newsletterDesc": "Be first to receive secret password-protected drop access and fabric lab updates.",
    "footer.subscribe": "JOIN ARCHIVE",
    "footer.rights": "ALL RIGHTS RESERVED. ARCHITECTURAL APPAREL LAB // CAIRO, EGYPT.",
  },
  ar: {
    // Top Bar & Navbar
    "nav.ticker": "إطلاق الدروب الأول // شحن سريع مجاني للطلبات فوق 2,000 ج.م",
    "nav.allPieces": "كل القطع",
    "nav.streetwear": "ملابس الشارع",
    "nav.casual": "كاجوال مريح",
    "nav.athleisure": "رياضي وعصري",
    "nav.archive": "الأرشيف",
    "nav.brandGuide": "دليل البراند",
    "nav.admin": "لوحة الإدارة",
    "nav.getApp": "حمل التطبيق",
    "nav.cart": "السلة",

    // Hero Section
    "hero.tag": "أرشيف موسم 2026 // دروب محدود 01",
    "hero.title1": "تحكّم في التدفق.",
    "hero.title2": "واكسر المقاومة.",
    "hero.subtitle": "ملابس ستريتوير معمارية مبتكرة، كاجوال يومي بأعلى درجات الراحة، وأزياء رياضية عالية الأداء. مصممة من أقطان مصرية فاخرة بوزن 460 جرام وقصات هندسية دقيقة.",
    "hero.shopBtn": "تسوق المجموعة الآن",
    "hero.brandArchive": "أرشيف البراند",
    "hero.apparelArch": "هندسة أزياء مصرية",
    "hero.coords": "خط عرض 30.0444° شمالاً / خط طول 31.2357° شرقاً",
    "hero.gsmRange": "أقمشة ثقيلة 300 - 460 GSM",

    // Catalog Section
    "catalog.archiveLabel": "أرشيف الكتالوج // 2026",
    "catalog.allTitle": "جميع القطع الأرشيفية",
    "catalog.streetwearTitle": "مجموعة ملابس الشارع (Streetwear)",
    "catalog.casualTitle": "مجموعة الكاجوال المريح (Minimalist)",
    "catalog.athleisureTitle": "مجموعة الرياضة والتدريب (Athleisure)",
    "catalog.sortFeatured": "ترتيب: المميز أولاً",
    "catalog.sortPriceAsc": "السعر: من الأقل للأعلى",
    "catalog.sortPriceDesc": "السعر: من الأعلى للأقل",
    "catalog.quickView": "معاينة سريعة",
    "catalog.addToBag": "إضافة للسلة",
    "catalog.selectSize": "اختر المقاس",
    "catalog.noPieces": "لا توجد قطع معروضة في هذا القسم حالياً",

    // Product Modal
    "modal.freeShipping": "شحن مجاني داخل القاهرة للطلبات فوق 2,000 ج.م",
    "modal.easyReturns": "سياسة استبدال واسترجاع ميسرة خلال 14 يوماً",
    "modal.gsmTag": "قماش قطني ثقيل فاخر معالج خصيصاً",
    "modal.selectSize": "اختر المقاس المطلوب",
    "modal.selectColor": "اختر اللون",
    "modal.quantity": "الكمية",
    "modal.fabricSpecs": "مواصفات القماش والقصة المعمارية",
    "modal.addedToBag": "تمت الإضافة بنجاح إلى حقيبة التسوق",
    "modal.addToCart": "إضافة لحقيبة التسوق",

    // Cart Drawer
    "cart.title": "حقيبة التسوق الخاصة بك",
    "cart.empty": "حقيبة التسوق فارغة حالياً",
    "cart.exploreBtn": "استكشف قطع الإطلاق الأول",
    "cart.freeShippingProgress": "متبقي للحصول على شحن سريع مجاني",
    "cart.freeShippingUnlocked": "🎉 تهانينا! حصلت على شحن سريع مجاني",
    "cart.promoPlaceholder": "كود الخصم (مثال: VALVES10)",
    "cart.apply": "تطبيق",
    "cart.subtotal": "المجموع الفرعي",
    "cart.discount": "خصم الكود",
    "cart.shipping": "الشحن السريع",
    "cart.free": "مجاناً",
    "cart.total": "الإجمالي النهائي",
    "cart.checkout": "متابعة لإتمام الطلب",
    "cart.orderSuccess": "تم تأكيد طلبك بنجاح!",
    "cart.orderSuccessMsg": "تم إرسال طلبك مباشرة إلى غرفة التجهيز والشحن في القاهرة. ستصلك رسالة SMS برقم تتبع بوسطة فور خروج الشحنة.",
    "cart.fullName": "الاسم بالكامل",
    "cart.phone": "رقم الهاتف المحمول (01xxxxxxxxx)",
    "cart.city": "المدينة / المحافظة",
    "cart.address": "العنوان التفصيلي (الشارع / العمارة / الشقة)",
    "cart.notes": "ملاحظات إضافية للتوصيل (اختياري)",
    "cart.paymentMethod": "طريقة الدفع",
    "cart.cod": "الدفع نقدًا عند الاستلام (COD)",
    "cart.card": "بطاقة بنكية / فيزا / ماستركارد",
    "cart.placeOrder": "تأكيد وإرسال الطلب الآن",

    // Brand Manifesto
    "manifesto.tag": "03 // الفلسفة الهندسية",
    "manifesto.title1": "ليست مجرد ملابس.",
    "manifesto.title2": "أداة للتحكم في التدفق ومقاومة الضغوط.",
    "manifesto.desc": "في الديناميكا الحرارية، الصمام (Valve) يتحكم في تدفق الطاقة وتحرير الضغط المحبوس. ننقل هذا المبدأ إلى صناعة الأزياء: أقطان مصرية متينة تقاوم التلف والبهتان، مع قصات ديناميكية تمنحك حرية حركة استثنائية طوال اليوم.",
    "manifesto.pillar1Title": "ميلتون 460 جرام",
    "manifesto.pillar1Desc": "قماش قطني ثقيل منسوج بطلب خاص للحفاظ على قوام الأكتاف وثبات الشكل بعد الغسيل.",
    "manifesto.pillar2Title": "تنظيم الهواء والحرارة",
    "manifesto.pillar2Desc": "فتحات تهوية ليزرية دقيقة مصممة لتناسب درجات حرارة القاهرة ونسمات المساء.",
    "manifesto.pillar3Title": "صناعة مصرية خالصة",
    "manifesto.pillar3Desc": "غزل وقص وحياكة 100% بأيدي حرفيين مصريين مهرة في قلب القاهرة.",
    "manifesto.pillar4Title": "انسيابية القوام",
    "manifesto.pillar4Desc": "هيكل قماشي مدروس يمنحك راحة مطلقة تم اختبارها على الرياضيين والمبدعين.",

    // Footer
    "footer.nativeApp": "تطبيق الهاتف الذكي",
    "footer.downloadApp": "حمل تطبيق ڤالڤز الرسمي",
    "footer.downloadDesc": "احصل على أسبقية الشراء قبل الإطلاق الرسمي بنصف ساعة، تتبع طلباتك لحظة بلحظة، وأسعار خاصة للأعضاء.",
    "footer.appleStore": "متجر أبل (APPLE APP STORE)",
    "footer.googlePlay": "متجر جوجل (GOOGLE PLAY)",
    "footer.newsletterTitle": "انضم للدائرة المقربة من ڤالڤز",
    "footer.newsletterDesc": "كن أول من يحصل على أكواد الخصم السرية وتحديثات أحدث أقمشة المعمل.",
    "footer.subscribe": "اشتراك بالأرشيف",
    "footer.rights": "جميع الحقوق محفوظة. معمل الأزياء المعمارية // القاهرة، مصر.",
  },
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("valves_store_theme") as Theme;
      if (storedTheme === "light" || storedTheme === "dark") {
        setThemeState(storedTheme);
      }
      const storedLang = localStorage.getItem("valves_store_lang") as Language;
      if (storedLang === "ar" || storedLang === "en") {
        setLangState(storedLang);
      }
    } catch {}
    setMounted(true);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem("valves_store_theme", next);
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem("valves_store_lang", next);
    } catch {}
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "ar" : "en");
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
        className={`min-h-screen ${
          isDark ? "bg-[#09090b] text-zinc-100 dark" : "bg-zinc-50 text-zinc-900 light"
        } transition-colors duration-200 selection:bg-volt selection:text-black`}
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
