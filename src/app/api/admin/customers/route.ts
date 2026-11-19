import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";
import { OrderStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const orders = erpStore.getOrders();
    const customerMap: Record<
      string,
      {
        id: string;
        name: string;
        email: string;
        phone: string;
        governorate: string;
        city: string;
        totalOrders: number;
        totalSpentEgp: number;
        returnedOrders: number;
        lastOrderDate: string;
      }
    > = {};

    orders.forEach((o) => {
      const key = (o.customerEmail || o.customerPhone).toLowerCase();
      if (!customerMap[key]) {
        customerMap[key] = {
          id: `cust-${Math.abs(key.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`,
          name: o.customerName,
          email: o.customerEmail || `${o.customerName.toLowerCase().replace(/\s+/g, "")}@client.eg`,
          phone: o.customerPhone,
          governorate: o.governorate,
          city: o.city,
          totalOrders: 0,
          totalSpentEgp: 0,
          returnedOrders: 0,
          lastOrderDate: o.createdAt,
        };
      }

      const c = customerMap[key];
      c.totalOrders++;
      if (o.status !== OrderStatus.CANCELLED) {
        c.totalSpentEgp += o.totalEgp;
      }
      if (o.status === OrderStatus.RETURNED) {
        c.returnedOrders++;
      }
      if (new Date(o.createdAt).getTime() > new Date(c.lastOrderDate).getTime()) {
        c.lastOrderDate = o.createdAt;
      }
    });

    let customers = Object.values(customerMap).map((c) => {
      const returnRate = c.totalOrders > 0 ? Number(((c.returnedOrders / c.totalOrders) * 100).toFixed(1)) : 0;
      return {
        ...c,
        returnRate,
        isHighReturnRisk: returnRate >= 33 && c.totalOrders >= 2,
        averageOrderValue: Math.round(c.totalSpentEgp / Math.max(c.totalOrders, 1)),
      };
    });

    if (search) {
      const q = search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.governorate.toLowerCase().includes(q)
      );
    }

    // Sort by LTV descending
    customers.sort((a, b) => b.totalSpentEgp - a.totalSpentEgp);

    return NextResponse.json({
      customers,
      total: customers.length,
      kpis: {
        totalCustomers: customers.length,
        averageLtv:
          customers.length > 0
            ? Math.round(
                customers.reduce((sum, c) => sum + c.totalSpentEgp, 0) /
                  customers.length
              )
            : 0,
        highRiskCount: customers.filter((c) => c.isHighReturnRisk).length,
      },
    });
  } catch (error) {
    console.error("Customers list error:", error);
    return NextResponse.json({ error: "Failed to load customers" }, { status: 500 });
  }
}
