export interface OrderItem {
  id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  fabricGsm: string;
}

export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: "Cash on Delivery (COD)" | "Credit Card" | "InstaPay";
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export const INITIAL_ORDERS: Order[] = [
  {
    id: "VLV-8921",
    customerName: "Omar El-Sayed",
    phone: "+20 101 234 5678",
    email: "omar.sayed@gmail.com",
    city: "New Cairo",
    address: "Villa 42, South Choueifat, 5th Settlement",
    items: [
      {
        id: "v-stw-01",
        name: "KINETIC OVERSIZED HOODIE",
        size: "L",
        color: "Obsidian Black",
        quantity: 1,
        price: 1850,
        fabricGsm: "460 GSM"
      },
      {
        id: "v-stw-03",
        name: "MONOGRAM BOX TEE (300 GSM)",
        size: "L",
        color: "Oxidized Copper Accent",
        quantity: 1,
        price: 1100,
        fabricGsm: "300 GSM"
      }
    ],
    subtotal: 2950,
    discount: 295,
    shipping: 0,
    total: 2655,
    paymentMethod: "Cash on Delivery (COD)",
    status: "Pending",
    createdAt: "Just now (14:15)",
    notes: "Please call before delivery. Oversized packaging requested."
  },
  {
    id: "VLV-8920",
    customerName: "Kareem Tarek",
    phone: "+20 112 987 6543",
    email: "kareem.tarek@outlook.com",
    city: "Sheikh Zayed",
    address: "Apartment 302, Palm Hills Greens",
    items: [
      {
        id: "v-stw-02",
        name: "VALVE MODULAR CARGO PANT",
        size: "32",
        color: "Obsidian Black",
        quantity: 1,
        price: 2100,
        fabricGsm: "320 GSM Ripstop"
      }
    ],
    subtotal: 2100,
    discount: 0,
    shipping: 0,
    total: 2100,
    paymentMethod: "Credit Card",
    status: "Confirmed",
    createdAt: "Today, 12:40 PM"
  },
  {
    id: "VLV-8919",
    customerName: "Youssef Mansour",
    phone: "+20 120 456 7890",
    email: "ymansour@gmail.com",
    city: "Maadi",
    address: "Degla, Road 218, Building 14",
    items: [
      {
        id: "v-csl-01",
        name: "REFINED MINIMAL BOMBER JACKET",
        size: "XL",
        color: "Midnight Charcoal",
        quantity: 1,
        price: 2650,
        fabricGsm: "340 GSM Twill"
      },
      {
        id: "v-csl-02",
        name: "CLEAN CUT SUPIMA CREWNECK",
        size: "XL",
        color: "Platinum Frost",
        quantity: 2,
        price: 950,
        fabricGsm: "220 GSM"
      }
    ],
    subtotal: 4550,
    discount: 455,
    shipping: 0,
    total: 4095,
    paymentMethod: "InstaPay",
    status: "Shipped",
    createdAt: "Today, 10:15 AM",
    notes: "Courier: Bosta Express (Waybill #BST-99412)"
  },
  {
    id: "VLV-8918",
    customerName: "Nouran Hatem",
    phone: "+20 109 876 5432",
    email: "nouran.hatem@yahoo.com",
    city: "Alexandria",
    address: "Kafr Abdou, Fouad Street, Flat 5",
    items: [
      {
        id: "v-ath-01",
        name: "AERO-FLOW SEAMLESS COMPRESSION TOP",
        size: "M",
        color: "Stealth Black",
        quantity: 1,
        price: 1350,
        fabricGsm: "240 GSM Stretch"
      },
      {
        id: "v-ath-02",
        name: "PACE PERFORMANCE TRACK JOGGER",
        size: "M",
        color: "Obsidian Black",
        quantity: 1,
        price: 1750,
        fabricGsm: "210 GSM Tech"
      }
    ],
    subtotal: 3100,
    discount: 0,
    shipping: 0,
    total: 3100,
    paymentMethod: "Credit Card",
    status: "Delivered",
    createdAt: "Yesterday, 16:20",
    notes: "Delivered successfully with signed receipt."
  },
  {
    id: "VLV-8917",
    customerName: "Mohamed Aly",
    phone: "+20 155 333 2211",
    email: "m.aly@company.eg",
    city: "Heliopolis",
    address: "Al-Mirghani St, Near Baron Palace",
    items: [
      {
        id: "v-stw-01",
        name: "KINETIC OVERSIZED HOODIE",
        size: "S",
        color: "Titanium Charcoal",
        quantity: 1,
        price: 1850,
        fabricGsm: "460 GSM"
      }
    ],
    subtotal: 1850,
    discount: 0,
    shipping: 75,
    total: 1925,
    paymentMethod: "Cash on Delivery (COD)",
    status: "Cancelled",
    createdAt: "Yesterday, 11:05",
    notes: "Customer canceled: wanted size M instead (out of stock)."
  }
];
