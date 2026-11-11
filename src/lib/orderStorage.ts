import { Order, INITIAL_ORDERS } from "@/data/orders";

const STORAGE_KEY = "valves_orders_v1";

export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load orders from storage", e);
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save orders to storage", e);
  }
}

export function addOrder(order: Order): void {
  const current = getStoredOrders();
  const updated = [order, ...current];
  saveOrders(updated);
}

export function updateOrderStatus(orderId: string, newStatus: Order["status"]): Order[] {
  const current = getStoredOrders();
  const updated = current.map((order) =>
    order.id === orderId ? { ...order, status: newStatus } : order
  );
  saveOrders(updated);
  return updated;
}
