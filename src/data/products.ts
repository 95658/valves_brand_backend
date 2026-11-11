export interface Product {
  id: string;
  name: string;
  collection: "streetwear" | "casual" | "athleisure";
  price: number;
  currency: string;
  tag?: string;
  description: string;
  details: string[];
  fabricGsm: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  image: string;
  gallery: string[];
}

export const PRODUCTS: Product[] = [
  // STREETWEAR COLLECTION
  {
    id: "v-stw-01",
    name: "KINETIC OVERSIZED HOODIE",
    collection: "streetwear",
    price: 1850,
    currency: "EGP",
    tag: "DROP 01 • HEAVYWEIGHT",
    description: "Architectural drop-shoulder hoodie crafted from custom 460 GSM brushed french terry. Features subtle laser-cut eyelets and debossed VALVES kinetic monogram.",
    details: [
      "460 GSM Heavyweight Organic French Terry",
      "Signature double-layered oversized hood",
      "Silicon branded tab on side seam hem",
      "Pre-shrunk vintage wash treatment"
    ],
    fabricGsm: "460 GSM",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Obsidian Black", hex: "#09090b" },
      { name: "Titanium Charcoal", hex: "#27272a" },
      { name: "Concrete Ash", hex: "#71717a" }
    ],
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: "v-stw-02",
    name: "VALVE MODULAR CARGO PANT",
    collection: "streetwear",
    price: 2100,
    currency: "EGP",
    tag: "TECHNICAL CUT",
    description: "Relaxed articulated silhouette with magnetic quick-release pocket flaps and adjustable ankle cinch valves for versatile tapering.",
    details: [
      "High-density ripstop cotton blend",
      "FIDLOCK-inspired magnetic closure hardware",
      "Reinforced knee articulation darts",
      "Water-repellent DWR coating"
    ],
    fabricGsm: "320 GSM Ripstop",
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: "Obsidian Black", hex: "#09090b" },
      { name: "Sage Olive", hex: "#3e4839" }
    ],
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: "v-stw-03",
    name: "MONOGRAM BOX TEE (300 GSM)",
    collection: "streetwear",
    price: 1100,
    currency: "EGP",
    tag: "CORE ESSENTIAL",
    description: "Boxy fit heavy cotton t-shirt with high collar ribbing and minimal high-density micro-print across the upper spine.",
    details: [
      "300 GSM Combed Egyptian Cotton",
      "High-retention 3cm ribbed crewneck",
      "Drop-shoulder tailored box cut",
      "Hand-finished double needle stitching"
    ],
    fabricGsm: "300 GSM",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Obsidian Black", hex: "#09090b" },
      { name: "Platinum Frost", hex: "#f8fafc" },
      { name: "Cyber Volt Accent", hex: "#d4ff00" }
    ],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
    ]
  },

  // MINIMALIST CASUAL COLLECTION
  {
    id: "v-csl-01",
    name: "REFINED MINIMAL BOMBER JACKET",
    collection: "casual",
    price: 2650,
    currency: "EGP",
    tag: "CLEAN CASUAL",
    description: "Streamlined casual jacket crafted for understated everyday elegance. Concealed double-way matte metal zipper and clean welt pockets.",
    details: [
      "Matte peached cotton-twill shell",
      "Breathable cupro inner lining",
      "Custom gunmetal geometric pull tabs",
      "Clean collarless neckline"
    ],
    fabricGsm: "340 GSM Twill",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Midnight Charcoal", hex: "#18181b" },
      { name: "Muted Sand", hex: "#a8a29e" }
    ],
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: "v-csl-02",
    name: "CLEAN CUT SUPIMA CREWNECK",
    collection: "casual",
    price: 950,
    currency: "EGP",
    tag: "DAILY STAPLE",
    description: "Ultra-soft premium long-staple cotton t-shirt with a relaxed regular cut. Designed to be your daily uniform.",
    details: [
      "100% Long-Staple Egyptian Cotton (220 GSM)",
      "Silk-touch bio-polished surface",
      "Anti-pilling treatment",
      "Tonal embroidered micro-badge"
    ],
    fabricGsm: "220 GSM",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Platinum Frost", hex: "#f8fafc" },
      { name: "Obsidian Black", hex: "#09090b" },
      { name: "Slate Blue", hex: "#475569" }
    ],
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80"
    ]
  },

  // ATHLEISURE / ACTIVEWEAR COLLECTION
  {
    id: "v-ath-01",
    name: "AERO-FLOW SEAMLESS COMPRESSION TOP",
    collection: "athleisure",
    price: 1350,
    currency: "EGP",
    tag: "FLOW PERFORMANCE",
    description: "Thermal regulating compression long-sleeve engineered with micro-perforated airflow zones across shoulder blades and underarms.",
    details: [
      "4-way stretch polyamide-elastane blend",
      "Antibacterial silver-ion yarn treatment",
      "Targeted laser ventilation channels",
      "Cyber Volt reflective safety logos"
    ],
    fabricGsm: "240 GSM Stretch",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Stealth Black", hex: "#09090b" },
      { name: "Titanium Silver", hex: "#94a3b8" }
    ],
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: "v-ath-02",
    name: "PACE PERFORMANCE TRACK JOGGER",
    collection: "athleisure",
    price: 1750,
    currency: "EGP",
    tag: "HYBRID MOTION",
    description: "Versatile pants engineered for sprint sessions and airport lounges alike. Waterproof zipper pockets and bonded zero-chafing seams.",
    details: [
      "Ultra-lightweight stretch woven weave",
      "Internal sweat-wicking compression waistband",
      "Concealed secure phone pocket",
      "Cuffed ergonomic leg taper"
    ],
    fabricGsm: "210 GSM Tech",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Obsidian Black", hex: "#09090b" },
      { name: "Graphite Gray", hex: "#334155" }
    ],
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80"
    ]
  }
];
