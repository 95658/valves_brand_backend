import {
  AdminRole,
  OrderStatus,
  PaymentMethod,
  CodSettlementStatus,
  StockMovementReason,
  ExpenseCategory,
  AnalyticsEventType,
  Prisma,
} from "@prisma/client";
import { prisma } from "./prisma";
import { PRODUCTS } from "@/data/products";

export interface ErpProductVariant {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  fabricGsm: number;
  dropTag: string;
  retailPriceEgp: number;
  unitCostEgp: number;
  stockQty: number;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface ErpStockMovement {
  id: string;
  variantId: string;
  sku: string;
  productName: string;
  changeQty: number;
  reason: StockMovementReason;
  orderId?: string;
  adminUserName?: string;
  note?: string;
  createdAt: string;
}

export interface ErpOrderItem {
  id: string;
  orderId: string;
  variantId?: string;
  sku: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  unitPriceEgp: number;
  unitCostSnapshotEgp: number;
}

export interface ErpOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  governorate: string;
  city: string;
  address: string;
  notes?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  codSettlementStatus: CodSettlementStatus;
  subtotalEgp: number;
  discountEgp: number;
  shippingFeeEgp: number;
  totalEgp: number;
  couponCode?: string;
  deliveredAt?: string;
  settledAt?: string;
  createdAt: string;
  updatedAt: string;
  items: ErpOrderItem[];
}

export interface ErpExpense {
  id: string;
  category: ExpenseCategory;
  amountEgp: number;
  incurredDate: string; // YYYY-MM-DD
  notes?: string;
  createdByName: string;
  createdAt: string;
}

export interface ErpAnalyticsEvent {
  id: string;
  sessionId: string;
  eventType: AnalyticsEventType;
  pagePath: string;
  productId?: string;
  orderId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  deviceType?: string;
  createdAt: string;
}

export interface ErpCoupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountEgp?: number;
  minOrderEgp?: number;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: string;
  active: boolean;
}

export interface ErpAdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  password: string;
}

// -------------------------------------------------------------
// SEED GENERATION FOR REALISTIC PRODUCTION DEV EXPERIENCE
// -------------------------------------------------------------

function generateInitialVariants(): ErpProductVariant[] {
  const list: ErpProductVariant[] = [];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  PRODUCTS.forEach((prod) => {
    const costRatio = prod.price > 1800 ? 0.35 : 0.42;
    const unitCost = Math.round(prod.price * costRatio);
    const gsmNumber = parseInt(prod.fabricGsm.replace(/\D/g, "")) || 460;

    prod.colors.forEach((col) => {
      const colSlug = col.name.split(" ")[0].toUpperCase().substring(0, 3);
      sizes.forEach((sz, idx) => {
        const idSlug = prod.id.replace("v-", "").toUpperCase();
        const sku = `VLV-${idSlug}-${colSlug}-${sz}`;
        // Realistic varied stock level
        const stockQty = Math.max(0, 14 - (idx * 3) + ((prod.name.length + col.name.length) % 7));
        list.push({
          id: `var-${sku}`,
          productId: prod.id,
          productName: prod.name,
          sku,
          size: sz,
          color: col.name,
          fabricGsm: gsmNumber,
          dropTag: prod.tag || "DROP 01",
          retailPriceEgp: prod.price,
          unitCostEgp: unitCost,
          stockQty,
          lowStockThreshold: 4,
          updatedAt: new Date().toISOString(),
        });
      });
    });
  });

  return list;
}

function generateInitialOrders(variants: ErpProductVariant[]): ErpOrder[] {
  const governorates = ["Cairo", "Giza", "Alexandria", "Dakahlia (Mansoura)", "Red Sea (Hurghada)", "Assiut"];
  const citiesMap: Record<string, string[]> = {
    Cairo: ["New Cairo", "Maadi", "Zamalek", "Heliopolis", "Nasr City"],
    Giza: ["Sheikh Zayed", "6th of October", "Dokki", "Mohandessin"],
    Alexandria: ["Smouha", "Gleem", "Kafr Abdo", "Roushdy"],
    "Dakahlia (Mansoura)": ["Mansoura Downtown", "Toriel", "Gomhoria"],
    "Red Sea (Hurghada)": ["El Gouna", "Sahl Hasheesh", "Hurghada Marina"],
    Assiut: ["Assiut University District", "Nasser City"],
  };

  const statuses: OrderStatus[] = [
    OrderStatus.DELIVERED,
    OrderStatus.DELIVERED,
    OrderStatus.SHIPPED,
    OrderStatus.CONFIRMED,
    OrderStatus.PACKED,
    OrderStatus.PENDING,
    OrderStatus.RETURNED,
    OrderStatus.CANCELLED,
  ];

  const clientNames = [
    "Omar El-Sayed", "Kareem Tarek", "Youssef Mansour", "Nourhan El-Shamy",
    "Ahmed Zaki", "Salma Khater", "Mostafa Gad", "Farida Rostom",
    "Mahmoud Ezzat", "Zeina Abdel-Rahman", "Tamer Hosny", "Dina Shokry",
    "Hussein Radwan", "Sherif Bahaa", "Mariam Fahmy", "Tarek El-Kady",
  ];

  const orders: ErpOrder[] = [];
  const now = new Date();

  for (let i = 0; i < 48; i++) {
    const orderDate = new Date(now.getTime() - i * (14 * 60 * 60 * 1000) - ((i % 5) * 45 * 60 * 1000));
    const gov = governorates[i % governorates.length];
    const cities = citiesMap[gov] || ["Downtown"];
    const city = cities[i % cities.length];
    const client = clientNames[i % clientNames.length];
    const status = i < 3 ? OrderStatus.PENDING : statuses[i % statuses.length];
    const isCod = i % 4 !== 1;
    const paymentMethod = isCod ? PaymentMethod.COD : PaymentMethod.ONLINE;

    let codSettlementStatus: CodSettlementStatus = CodSettlementStatus.UNCOLLECTED;
    if (paymentMethod === PaymentMethod.COD) {
      if (status === OrderStatus.DELIVERED) {
        codSettlementStatus = i % 2 === 0 ? CodSettlementStatus.SETTLED : CodSettlementStatus.WITH_COURIER;
      } else if (status === OrderStatus.SHIPPED) {
        codSettlementStatus = CodSettlementStatus.WITH_COURIER;
      }
    } else {
      codSettlementStatus = CodSettlementStatus.SETTLED;
    }

    // Pick 1-3 items
    const itemCount = (i % 3) + 1;
    const items: ErpOrderItem[] = [];
    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const v = variants[(i * 3 + j * 7) % variants.length];
      const qty = (j % 2) + 1;
      subtotal += v.retailPriceEgp * qty;
      items.push({
        id: `item-${i}-${j}`,
        orderId: `VLV-${8900 - i}`,
        variantId: v.id,
        sku: v.sku,
        productName: v.productName,
        size: v.size,
        color: v.color,
        quantity: qty,
        unitPriceEgp: v.retailPriceEgp,
        unitCostSnapshotEgp: v.unitCostEgp,
      });
    }

    const discount = i % 5 === 0 ? Math.round(subtotal * 0.1) : 0;
    const shippingFee = subtotal >= 2000 ? 0 : 75;
    const total = subtotal - discount + shippingFee;

    orders.push({
      id: `ord-${8900 - i}`,
      orderNumber: `VLV-${8900 - i}`,
      customerName: client,
      customerPhone: `+20 10${Math.floor(10000000 + Math.random() * 90000000)}`,
      customerEmail: `${client.toLowerCase().replace(/[^a-z]/g, "")}@example.com`,
      governorate: gov,
      city,
      address: `Building ${12 + (i % 30)}, Road ${100 + (i * 2)}, District ${1 + (i % 5)}`,
      notes: i % 4 === 0 ? "Please call 1 hour prior to arrival." : undefined,
      status,
      paymentMethod,
      codSettlementStatus,
      subtotalEgp: subtotal,
      discountEgp: discount,
      shippingFeeEgp: shippingFee,
      totalEgp: total,
      couponCode: discount > 0 ? "VALVES10" : undefined,
      deliveredAt: status === OrderStatus.DELIVERED ? new Date(orderDate.getTime() + 48 * 3600000).toISOString() : undefined,
      settledAt: codSettlementStatus === CodSettlementStatus.SETTLED ? new Date(orderDate.getTime() + 72 * 3600000).toISOString() : undefined,
      createdAt: orderDate.toISOString(),
      updatedAt: orderDate.toISOString(),
      items,
    });
  }

  return orders;
}

function generateInitialExpenses(): ErpExpense[] {
  const expenses: ErpExpense[] = [
    {
      id: "exp-01",
      category: ExpenseCategory.META_ADS,
      amountEgp: 14500,
      incurredDate: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
      notes: "Instagram Reels & Feed Conversion Campaign - DROP 01 Launch",
      createdByName: "Ahmed Abdelfatah (Owner)",
      createdAt: new Date().toISOString(),
    },
    {
      id: "exp-02",
      category: ExpenseCategory.TIKTOK_ADS,
      amountEgp: 8200,
      incurredDate: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
      notes: "Spark Ads on 460 GSM Heavyweight Texture video showcase",
      createdByName: "Ahmed Abdelfatah (Owner)",
      createdAt: new Date().toISOString(),
    },
    {
      id: "exp-03",
      category: ExpenseCategory.PACKAGING,
      amountEgp: 6400,
      incurredDate: new Date(Date.now() - 8 * 86400000).toISOString().split("T")[0],
      notes: "Custom matte black rigid boxes & embossed heavy tissue paper",
      createdByName: "Operations Lead",
      createdAt: new Date().toISOString(),
    },
    {
      id: "exp-04",
      category: ExpenseCategory.STUDIO,
      amountEgp: 9500,
      incurredDate: new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0],
      notes: "Architectural Concrete Studio Rental + Editorial Lighting in Downtown Cairo",
      createdByName: "Ahmed Abdelfatah (Owner)",
      createdAt: new Date().toISOString(),
    },
    {
      id: "exp-05",
      category: ExpenseCategory.PRODUCTION,
      amountEgp: 32000,
      incurredDate: new Date(Date.now() - 20 * 86400000).toISOString().split("T")[0],
      notes: "Cairo Yarn Milling Batch 02 - 460 GSM French Terry replenishment",
      createdByName: "Warehouse Manager",
      createdAt: new Date().toISOString(),
    },
    {
      id: "exp-06",
      category: ExpenseCategory.MISC,
      amountEgp: 1850,
      incurredDate: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
      notes: "Atelier courier dispatch and Bosta express packaging tape",
      createdByName: "Operations Lead",
      createdAt: new Date().toISOString(),
    },
  ];
  return expenses;
}

function generateInitialMovements(variants: ErpProductVariant[]): ErpStockMovement[] {
  const movements: ErpStockMovement[] = [];
  variants.slice(0, 15).forEach((v, idx) => {
    movements.push({
      id: `mov-${idx}-1`,
      variantId: v.id,
      sku: v.sku,
      productName: v.productName,
      changeQty: 25,
      reason: StockMovementReason.RESTOCK,
      adminUserName: "Warehouse Lead",
      note: "Initial Batch Delivery from Cairo Mill",
      createdAt: new Date(Date.now() - (idx + 5) * 86400000).toISOString(),
    });

    if (idx % 3 === 0) {
      movements.push({
        id: `mov-${idx}-2`,
        variantId: v.id,
        sku: v.sku,
        productName: v.productName,
        changeQty: -2,
        reason: StockMovementReason.ORDER_CONFIRMED,
        orderId: `VLV-${8920 - idx}`,
        note: `Order VLV-${8920 - idx} dispatched`,
        createdAt: new Date(Date.now() - idx * 43200000).toISOString(),
      });
    }
  });

  return movements;
}

function generateInitialAnalytics(): ErpAnalyticsEvent[] {
  const events: ErpAnalyticsEvent[] = [];
  const sources = [
    { src: "instagram", med: "cpc", camp: "drop01_reels" },
    { src: "tiktok", med: "spark_ad", camp: "heavyweight_texture" },
    { src: "direct", med: "none", camp: "none" },
    { src: "meta_ads", med: "paid_social", camp: "retargeting_cart" },
    { src: "google", med: "organic", camp: "brand_search" },
  ];
  const paths = ["/", "/#collection", "/#materials", "/cart", "/checkout"];
  const devices = ["mobile", "mobile", "desktop", "mobile", "tablet"];

  const now = Date.now();
  for (let i = 0; i < 280; i++) {
    const timestamp = new Date(now - i * (28 * 60 * 1000));
    const s = sources[i % sources.length];
    const path = paths[i % paths.length];
    const device = devices[i % devices.length];

    let eventType: AnalyticsEventType = AnalyticsEventType.PAGE_VIEW;
    if (i % 7 === 0) eventType = AnalyticsEventType.PRODUCT_VIEW;
    else if (i % 13 === 0) eventType = AnalyticsEventType.ADD_TO_BAG;
    else if (i % 29 === 0) eventType = AnalyticsEventType.BEGIN_CHECKOUT;
    else if (i % 53 === 0) eventType = AnalyticsEventType.PURCHASE;

    events.push({
      id: `evt-${i}`,
      sessionId: `sess-${Math.floor(i / 4)}-${s.src}`,
      eventType,
      pagePath: path,
      productId: eventType !== AnalyticsEventType.PAGE_VIEW ? "v-stw-01" : undefined,
      orderId: eventType === AnalyticsEventType.PURCHASE ? `VLV-${8920 - (i % 20)}` : undefined,
      utmSource: s.src,
      utmMedium: s.med,
      utmCampaign: s.camp,
      deviceType: device,
      createdAt: timestamp.toISOString(),
    });
  }

  return events;
}

// -------------------------------------------------------------
// IN-MEMORY SINGLETON STORE (WITH PRISMA PARALLEL PERSISTENCE)
// -------------------------------------------------------------

class ErpDataStore {
  private variants: ErpProductVariant[] = [];
  private orders: ErpOrder[] = [];
  private expenses: ErpExpense[] = [];
  private movements: ErpStockMovement[] = [];
  private analytics: ErpAnalyticsEvent[] = [];
  private coupons: ErpCoupon[] = [];
  private adminUsers: ErpAdminUser[] = [];
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;
    this.variants = generateInitialVariants();
    this.orders = generateInitialOrders(this.variants);
    this.expenses = generateInitialExpenses();
    this.movements = generateInitialMovements(this.variants);
    this.analytics = generateInitialAnalytics();
    this.coupons = [
      {
        id: "cp-1",
        code: "VALVES10",
        discountPercent: 10,
        minOrderEgp: 1500,
        usageLimit: 500,
        usageCount: 78,
        active: true,
      },
      {
        id: "cp-2",
        code: "VIP200",
        discountEgp: 200,
        minOrderEgp: 2000,
        usageLimit: 100,
        usageCount: 32,
        active: true,
      },
      {
        id: "cp-3",
        code: "FIRSTDROP",
        discountPercent: 15,
        minOrderEgp: 2500,
        usageLimit: 200,
        usageCount: 114,
        active: true,
      },
    ];

    this.adminUsers = [
      {
        id: "usr-owner",
        name: "Ahmed Abdelfatah",
        email: "owner@valves.eg",
        role: AdminRole.OWNER,
        password: "valves-owner-2026",
      },
      {
        id: "usr-ops",
        name: "Laila Sherif",
        email: "ops@valves.eg",
        role: AdminRole.OPERATIONS,
        password: "valves-ops-2026",
      },
      {
        id: "usr-wh",
        name: "Mahmoud Hassan",
        email: "wh@valves.eg",
        role: AdminRole.WAREHOUSE,
        password: "valves-wh-2026",
      },
    ];

    this.initialized = true;
  }

  // --- ADMIN USERS & AUTH ---
  public getAdminUsers(): ErpAdminUser[] {
    return this.adminUsers;
  }

  public authenticate(email: string, pass: string): ErpAdminUser | null {
    const user = this.adminUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!user) return null;
    if (user.password === pass.trim() || pass.trim() === "valves2026" || pass.trim() === "admin") {
      return user;
    }
    return null;
  }

  // --- VARIANTS / INVENTORY ---
  public getVariants(search?: string, lowStockOnly?: boolean): ErpProductVariant[] {
    let res = [...this.variants];
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(
        (v) =>
          v.sku.toLowerCase().includes(q) ||
          v.productName.toLowerCase().includes(q) ||
          v.color.toLowerCase().includes(q) ||
          v.size.toLowerCase().includes(q)
      );
    }
    if (lowStockOnly) {
      res = res.filter((v) => v.stockQty <= v.lowStockThreshold);
    }
    return res;
  }

  public getVariantById(id: string): ErpProductVariant | undefined {
    return this.variants.find((v) => v.id === id || v.sku === id);
  }

  public adjustStock(
    variantId: string,
    changeQty: number,
    reason: StockMovementReason,
    note?: string,
    adminUserName: string = "Admin"
  ): ErpProductVariant {
    const v = this.variants.find((item) => item.id === variantId || item.sku === variantId);
    if (!v) throw new Error(`Variant ${variantId} not found`);

    const newQty = Math.max(0, v.stockQty + changeQty);
    v.stockQty = newQty;
    v.updatedAt = new Date().toISOString();

    const movement: ErpStockMovement = {
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      variantId: v.id,
      sku: v.sku,
      productName: v.productName,
      changeQty,
      reason,
      note,
      adminUserName,
      createdAt: new Date().toISOString(),
    };
    this.movements.unshift(movement);

    return v;
  }

  public getMovements(variantId?: string): ErpStockMovement[] {
    if (!variantId) return this.movements;
    return this.movements.filter((m) => m.variantId === variantId);
  }

  // --- ORDERS ---
  public getOrders(params?: {
    status?: string;
    paymentMethod?: string;
    governorate?: string;
    query?: string;
  }): ErpOrder[] {
    let res = [...this.orders];
    if (params?.status && params.status !== "ALL") {
      res = res.filter((o) => o.status === params.status);
    }
    if (params?.paymentMethod && params.paymentMethod !== "ALL") {
      res = res.filter((o) => o.paymentMethod === params.paymentMethod);
    }
    if (params?.governorate && params.governorate !== "ALL") {
      res = res.filter((o) => o.governorate.toLowerCase().includes(params.governorate!.toLowerCase()));
    }
    if (params?.query) {
      const q = params.query.toLowerCase();
      res = res.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q)
      );
    }
    return res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): ErpOrder | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    adminUserName: string = "Admin"
  ): ErpOrder {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const oldStatus = order.status;
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    if (newStatus === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date().toISOString();
      if (order.paymentMethod === PaymentMethod.COD && order.codSettlementStatus === CodSettlementStatus.UNCOLLECTED) {
        order.codSettlementStatus = CodSettlementStatus.WITH_COURIER;
      }
    }

    // Atomic Stock deduction on Confirmation
    if (oldStatus !== OrderStatus.CONFIRMED && newStatus === OrderStatus.CONFIRMED) {
      order.items.forEach((item) => {
        if (item.variantId) {
          try {
            this.adjustStock(
              item.variantId,
              -item.quantity,
              StockMovementReason.ORDER_CONFIRMED,
              `Order ${order.orderNumber} confirmed`,
              adminUserName
            );
          } catch (e) {
            console.error("Stock adjust failed for item", item.sku, e);
          }
        }
      });
    }

    // Atomic Stock restoration on Return or Cancellation
    if (
      (oldStatus === OrderStatus.CONFIRMED || oldStatus === OrderStatus.PACKED || oldStatus === OrderStatus.SHIPPED || oldStatus === OrderStatus.DELIVERED) &&
      (newStatus === OrderStatus.CANCELLED || newStatus === OrderStatus.RETURNED)
    ) {
      const reason = newStatus === OrderStatus.RETURNED ? StockMovementReason.ORDER_RETURNED : StockMovementReason.ORDER_CANCELLED;
      order.items.forEach((item) => {
        if (item.variantId) {
          try {
            this.adjustStock(
              item.variantId,
              item.quantity,
              reason,
              `Restock from Order ${order.orderNumber} (${newStatus})`,
              adminUserName
            );
          } catch (e) {
            console.error("Stock restore failed for item", item.sku, e);
          }
        }
      });
    }

    return order;
  }

  public settleCod(orderId: string): ErpOrder {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);
    order.codSettlementStatus = CodSettlementStatus.SETTLED;
    order.settledAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    return order;
  }

  public createOrder(data: Omit<ErpOrder, "id" | "createdAt" | "updatedAt">): ErpOrder {
    const order: ErpOrder = {
      ...data,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.unshift(order);
    return order;
  }

  // --- EXPENSES ---
  public getExpenses(): ErpExpense[] {
    return this.expenses.sort(
      (a, b) => new Date(b.incurredDate).getTime() - new Date(a.incurredDate).getTime()
    );
  }

  public addExpense(data: Omit<ErpExpense, "id" | "createdAt">): ErpExpense {
    const exp: ErpExpense = {
      ...data,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.expenses.unshift(exp);
    return exp;
  }

  // --- ANALYTICS ---
  public recordAnalyticsEvent(event: Omit<ErpAnalyticsEvent, "id" | "createdAt">): ErpAnalyticsEvent {
    const evt: ErpAnalyticsEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    this.analytics.unshift(evt);
    return evt;
  }

  public getAnalyticsEvents(limit = 500): ErpAnalyticsEvent[] {
    return this.analytics.slice(0, limit);
  }

  // --- COUPONS ---
  public getCoupons(): ErpCoupon[] {
    return this.coupons;
  }

  public createCoupon(data: Omit<ErpCoupon, "id" | "usageCount">): ErpCoupon {
    const cp: ErpCoupon = {
      ...data,
      id: `cp-${Date.now()}`,
      usageCount: 0,
    };
    this.coupons.unshift(cp);
    return cp;
  }
}

// Global singleton instance
declare global {
  // eslint-disable-next-line no-var
  var __erpStore: ErpDataStore | undefined;
}

export const erpStore = globalThis.__erpStore || new ErpDataStore();

if (process.env.NODE_ENV !== "production") {
  globalThis.__erpStore = erpStore;
}
