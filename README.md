# VALVES — Official E-Commerce Storefront & Admin OS

> **"Control the flow. Break the resistance."**

VALVES is an architectural apparel label engineered in Cairo, Egypt. This repository contains the complete Next.js 15 web store and live Admin Control Center.

---

## ⚡ Tech Stack & Architecture

- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS (Obsidian `#09090b` & Cyber Volt `#d4ff00` design tokens)
- **Icons:** Lucide React
- **Typography:** Space Grotesk, Inter, and Cairo (Arabic)
- **Localization:** Bilingual English (LTR) & Arabic (RTL) with dynamic instant switching
- **Theme:** Obsidian Dark Mode & High-Contrast Light Mode
- **State & Storage:** Client-side reactive persistence (`localStorage` & event-driven synchronization between Admin & Storefront)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port assigned by Next.js) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🛡️ Admin Control Center

Accessible at `/admin` (or `/dashboard`):
- **Demo Credentials:** Username: `admin` | Password: `valves2026` (or click *Fill Demo Credentials*)
- **Orders Management:** Live status tracking, one-click WhatsApp customer dispatch, and printable Bosta Airway Bill waybills.
- **Product Management:** Full CRUD (add new piece, update pricing/fabric GSM/specs, delete, search, filter).
- **Category Management:** Manage store navigation pills and collections dynamically.
- **Fabric Lab & Inventory:** Real-time size breakdown (S/M/L/XL) across Cairo hub.
- **Drop Analytics:** Net revenue, payment methods split (COD vs Card vs InstaPay), and city demand metrics.

---

## 📂 Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── admin/          # Admin Control Center (Authentication, Orders, Products, Categories, Analytics)
│   │   ├── dashboard/      # Alias redirecting to /admin
│   │   ├── globals.css     # Global styles, fonts & Tailwind directives
│   │   ├── layout.tsx      # Root HTML layout with Google Fonts
│   │   └── page.tsx        # Public Storefront Home Page
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky navigation with categories, theme & lang toggles
│   │   ├── Hero.tsx            # Full-bleed architectural campaign header
│   │   ├── ProductCard.tsx     # Product card with quick-view and add-to-bag
│   │   ├── ProductModal.tsx    # Detailed spec modal with size/color selectors
│   │   ├── CartDrawer.tsx      # Slide-out bag with free shipping meter & checkout
│   │   ├── BrandManifesto.tsx  # 460 GSM Terry, Aero regulation, and milling philosophy
│   │   └── Footer.tsx          # Newsletter signup, app promo & links
│   ├── context/
│   │   └── StoreContext.tsx    # Global theme (light/dark) & language (AR/EN) provider
│   ├── data/
│   │   ├── orders.ts           # Order data models & mock records
│   │   └── products.ts         # Initial seasonal drop products
│   └── lib/
│       ├── orderStorage.ts     # Persistent order repository
│       └── productStorage.ts   # Persistent product & category repository with event bus
├── public/
│   └── brand/              # Brand guidelines, SVG wordmarks, and logos
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

© 2026 VALVES CLOTHING CO. Cairo, Egypt.
