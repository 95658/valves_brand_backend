"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ValveLogo } from "@/components/ValveLogo";
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  DollarSign,
  TrendingUp,
  Users,
  Tag,
  Settings,
  Bell,
  Search,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Menu,
  X,
  ExternalLink,
  Lock,
} from "lucide-react";
import { DateRangePicker, DateRangeOption } from "./DateRangePicker";

interface AdminUserSession {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "OPERATIONS" | "WAREHOUSE";
}

interface AdminShellProps {
  children: React.ReactNode;
  dateRange?: DateRangeOption;
  onDateRangeChange?: (range: DateRangeOption) => void;
  title?: string;
  subtitle?: string;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  dateRange = "30D",
  onDateRangeChange,
  title,
  subtitle,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // App Theme & Language
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Auth state
  const [sessionUser, setSessionUser] = useState<AdminUserSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("owner@valves.eg");
  const [loginPassword, setLoginPassword] = useState("valves2026");
  const [loginError, setLoginError] = useState("");

  // Low stock / notifications mock
  const notifications = [
    { id: 1, title: "Low Stock Alert", desc: "VLV-STW01-OBS-M has only 2 units left", time: "10m ago", type: "alert" },
    { id: 2, title: "New COD Order", desc: "Order VLV-8921 confirmed from New Cairo", time: "25m ago", type: "order" },
    { id: 3, title: "Courier Payout", desc: "Bosta settled 14,200 EGP collected funds", time: "2h ago", type: "success" },
  ];

  // Initialize theme, language & auth check
  useEffect(() => {
    const savedTheme = (localStorage.getItem("valves_admin_theme") as "light" | "dark") || "light";
    const savedLang = (localStorage.getItem("valves_admin_lang") as "en" | "ar") || "en";
    setTheme(savedTheme);
    setLang(savedLang);

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Check auth
    fetch("/api/admin/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setSessionUser(data.user);
        } else {
          // Check local fallback
          const localSess = localStorage.getItem("valves_admin_user_session");
          if (localSess) {
            try {
              setSessionUser(JSON.parse(localSess));
            } catch {
              setSessionUser(null);
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("valves_admin_theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
    localStorage.setItem("valves_admin_lang", next);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setSessionUser(data.user);
        localStorage.setItem("valves_admin_user_session", JSON.stringify(data.user));
      } else {
        setLoginError(data.error || "Authentication failed");
      }
    } catch {
      // Local fallback
      if (loginEmail === "owner@valves.eg" || loginEmail === "admin") {
        const u: AdminUserSession = {
          id: "usr-owner",
          name: "Ahmed Abdelfatah",
          email: "owner@valves.eg",
          role: "OWNER",
        };
        setSessionUser(u);
        localStorage.setItem("valves_admin_user_session", JSON.stringify(u));
      } else {
        setLoginError("Invalid credentials");
      }
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("valves_admin_user_session");
    setSessionUser(null);
  };

  const isRTL = lang === "ar";

  // Navigation Links
  const navItems = [
    {
      group: lang === "ar" ? "الرئيسية" : "CORE",
      items: [
        {
          nameEn: "Overview",
          nameAr: "لوحة التحكم العامة",
          href: "/admin",
          icon: LayoutDashboard,
          badge: undefined,
        },
        {
          nameEn: "Orders & Fulfillment",
          nameAr: "الطلبات والتوصيل",
          href: "/admin/orders",
          icon: ShoppingBag,
          badge: "48",
        },
      ],
    },
    {
      group: lang === "ar" ? "نظام الـ ERP والمخزون" : "MINI-ERP SYSTEM",
      items: [
        {
          nameEn: "Inventory & SKUs",
          nameAr: "المخزون والأكواد",
          href: "/admin/inventory",
          icon: Boxes,
          badge: "ALERT",
        },
        {
          nameEn: "Finance & P&L",
          nameAr: "المالية والأرباح",
          href: "/admin/finance",
          icon: DollarSign,
          badge: undefined,
        },
      ],
    },
    {
      group: lang === "ar" ? "البيانات والعملاء" : "INSIGHTS & CRM",
      items: [
        {
          nameEn: "Storefront Analytics",
          nameAr: "تحليلات المتجر",
          href: "/admin/analytics",
          icon: TrendingUp,
          badge: "LIVE",
        },
        {
          nameEn: "Customers (CRM)",
          nameAr: "سجل العملاء",
          href: "/admin/customers",
          icon: Users,
          badge: undefined,
        },
      ],
    },
    {
      group: lang === "ar" ? "التسويق والإعدادات" : "MANAGEMENT",
      items: [
        {
          nameEn: "Marketing & Coupons",
          nameAr: "التسويق والكوبونات",
          href: "/admin/marketing",
          icon: Tag,
          badge: undefined,
        },
        {
          nameEn: "Store Settings",
          nameAr: "إعدادات المتجر",
          href: "/admin/settings",
          icon: Settings,
          badge: undefined,
        },
      ],
    },
  ];

  // If loading or not authenticated, render sharp architectural login
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3">
          <ValveLogo className="w-8 h-8 text-[var(--ink-primary)] animate-pulse" />
          <span>INITIALIZING VALVES ATELIER SUITE...</span>
        </div>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-[var(--bg-primary)] text-[var(--ink-primary)] flex flex-col justify-between p-6 sm:p-12 font-mono"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ValveLogo className="w-7 h-7 text-[var(--ink-primary)]" />
            <span className="font-bold tracking-widest text-sm uppercase">VALVES · CONTROL CENTER</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="px-2.5 py-1 text-xs border border-[var(--border-hairline)] bg-[var(--bg-elevated)]"
            >
              {lang === "en" ? "AR / العربية" : "EN / English"}
            </button>
            <button
              onClick={toggleTheme}
              className="p-1.5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)]"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto my-12 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 border border-[var(--border-hairline)] mb-4 bg-[var(--bg-secondary)]">
              <Lock className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <h2 className="text-base font-bold uppercase tracking-wider">ATELIER AUTHENTICATION</h2>
            <p className="text-xs text-[var(--ink-secondary)] mt-1">
              {lang === "ar"
                ? "سجل الدخول للوصول إلى لوحة الإدارة ومخزون فالفز"
                : "Restricted administrative & ERP access for authorized staff only"}
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase text-[10px] text-[var(--ink-secondary)] mb-1">
                STAFF EMAIL // البريد الوظيفي
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] px-3 py-2 text-[var(--ink-primary)] outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block uppercase text-[10px] text-[var(--ink-secondary)] mb-1">
                SECURITY KEY / PASSWORD // كلمة المرور
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] px-3 py-2 text-[var(--ink-primary)] outline-none focus:border-[var(--accent)]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--ink-primary)] text-[var(--bg-primary)] uppercase font-bold tracking-wider hover:opacity-90 transition-opacity mt-2"
            >
              {lang === "ar" ? "دخول إلى النظام" : "ENTER CONTROL CENTER"}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-[var(--border-hairline)] text-[11px]">
            <span className="block text-[10px] uppercase font-bold text-[var(--ink-secondary)] mb-2">
              QUICK DEMO ROLES (CLICK TO FILL):
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setLoginEmail("owner@valves.eg");
                  setLoginPassword("valves2026");
                }}
                className="p-1.5 border border-[var(--border-hairline)] text-center hover:bg-[var(--bg-secondary)]"
              >
                <div className="font-bold text-[var(--accent)]">OWNER</div>
                <div className="text-[9px] opacity-70">Ahmed A.</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail("ops@valves.eg");
                  setLoginPassword("valves2026");
                }}
                className="p-1.5 border border-[var(--border-hairline)] text-center hover:bg-[var(--bg-secondary)]"
              >
                <div className="font-bold">OPERATIONS</div>
                <div className="text-[9px] opacity-70">Laila S.</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail("wh@valves.eg");
                  setLoginPassword("valves2026");
                }}
                className="p-1.5 border border-[var(--border-hairline)] text-center hover:bg-[var(--bg-secondary)]"
              >
                <div className="font-bold">WAREHOUSE</div>
                <div className="text-[9px] opacity-70">Mahmoud H.</div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-[var(--ink-secondary)]">
          <Link href="/" className="hover:text-[var(--ink-primary)] underline">
            ← {lang === "ar" ? "العودة إلى واجهة المتجر" : "Return to VALVES Storefront"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--ink-primary)] flex font-sans"
    >
      {/* ----------------- SIDEBAR ----------------- */}
      <aside
        className={`fixed top-0 bottom-0 z-40 bg-[var(--bg-elevated)] border-r ${
          isRTL ? "border-l border-r-0 right-0" : "border-r left-0"
        } border-[var(--border-hairline)] transition-all duration-300 flex flex-col ${
          sidebarCollapsed ? "w-16" : "w-64"
        } hidden md:flex`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-hairline)]">
          <div className="flex items-center gap-3 overflow-hidden">
            <ValveLogo className="w-7 h-7 text-[var(--ink-primary)] flex-shrink-0" />
            {!sidebarCollapsed && (
              <div className="truncate">
                <span className="font-mono font-bold tracking-widest text-sm uppercase block">
                  {lang === "ar" ? "فالفز للإدارة" : "VALVES"}
                </span>
                <span className="text-[9px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider block">
                  ATELIER CONTROL
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            title="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {navItems.map((grp, gIdx) => (
            <div key={gIdx}>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-mono font-semibold tracking-wider text-[var(--ink-secondary)] uppercase">
                  {grp.group}
                </div>
              )}
              <div className="space-y-1">
                {grp.items.map((it) => {
                  const isActive = pathname === it.href;
                  const Icon = it.icon;
                  return (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-mono transition-colors ${
                        isActive
                          ? "bg-[var(--ink-primary)] text-[var(--bg-primary)] font-semibold"
                          : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                      title={sidebarCollapsed ? (lang === "ar" ? it.nameAr : it.nameEn) : undefined}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="truncate">{lang === "ar" ? it.nameAr : it.nameEn}</span>
                        )}
                      </div>
                      {!sidebarCollapsed && it.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 border ${
                            isActive
                              ? "border-[var(--bg-primary)] text-[var(--bg-primary)]"
                              : "border-[var(--border-hairline)] text-[var(--accent)]"
                          }`}
                        >
                          {it.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Staff session footer */}
        <div className="p-3 border-t border-[var(--border-hairline)] bg-[var(--bg-secondary)]">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="text-xs font-mono font-bold truncate">{sessionUser.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-[var(--accent)] text-white font-semibold">
                    {sessionUser.role}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--ink-secondary)] truncate">
                    {sessionUser.email}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-1.5 text-[var(--ink-secondary)] hover:text-[var(--status-danger)] transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ----------------- MOBILE MENU OVERLAY ----------------- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex">
          <div className="w-72 bg-[var(--bg-elevated)] h-full p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)] mb-4">
                <div className="flex items-center gap-2">
                  <ValveLogo className="w-6 h-6 text-[var(--ink-primary)]" />
                  <span className="font-mono font-bold text-sm">VALVES ADMIN</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {navItems.map((grp, gIdx) => (
                  <div key={gIdx}>
                    <div className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase mb-1">
                      {grp.group}
                    </div>
                    {grp.items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 text-xs font-mono ${
                          pathname === it.href
                            ? "bg-[var(--ink-primary)] text-[var(--bg-primary)] font-bold"
                            : "text-[var(--ink-secondary)]"
                        }`}
                      >
                        <it.icon className="w-4 h-4" />
                        <span>{lang === "ar" ? it.nameAr : it.nameEn}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-hairline)]">
              <button
                onClick={handleLogout}
                className="w-full py-2 border border-[var(--status-danger)] text-[var(--status-danger)] text-xs font-mono"
              >
                LOGOUT ({sessionUser.name})
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* ----------------- MAIN VIEWPORT ----------------- */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed
            ? isRTL ? "md:mr-16" : "md:ml-16"
            : isRTL ? "md:mr-64" : "md:ml-64"
        }`}
      >
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[var(--bg-elevated)]/90 backdrop-blur-md border-b border-[var(--border-hairline)] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 md:hidden text-[var(--ink-secondary)]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search */}
            <div className="relative hidden sm:block w-64 lg:w-80">
              <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 left-3 text-[var(--ink-secondary)]" />
              <input
                type="text"
                placeholder={lang === "ar" ? "بحث برقم الطلب، العميل، الـ SKU..." : "Search orders, SKUs, patrons..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-hairline)] pl-9 pr-3 py-1.5 text-xs font-mono text-[var(--ink-primary)] outline-none focus:border-[var(--ink-primary)]"
              />
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Date Range Picker */}
            {onDateRangeChange && (
              <DateRangePicker
                value={dateRange}
                onChange={onDateRangeChange}
                lang={lang}
              />
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent)] rounded-full" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] shadow-xl z-50 p-3 font-mono text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-[var(--border-hairline)] mb-2 font-bold uppercase text-[10px]">
                    <span>SYSTEM NOTIFICATIONS</span>
                    <button onClick={() => setNotificationsOpen(false)}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 bg-[var(--bg-secondary)] border-l-2 border-[var(--accent)]">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold">{n.title}</span>
                          <span className="text-[var(--ink-secondary)]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono border border-[var(--border-hairline)] hover:bg-[var(--bg-secondary)]"
              title="Open storefront"
            >
              <span>{lang === "ar" ? "المتجر" : "Store"}</span>
              <ExternalLink className="w-3 h-3 text-[var(--ink-secondary)]" />
            </Link>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="px-2 py-1 text-xs font-mono border border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)]"
            >
              {lang === "en" ? "AR" : "EN"}
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] text-[var(--ink-primary)]"
              title="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-8">
          {(title || subtitle) && (
            <div className="mb-6 pb-4 border-b border-[var(--border-hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-[var(--ink-primary)] uppercase">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs font-mono text-[var(--ink-secondary)] mt-1">{subtitle}</p>
                )}
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
};
