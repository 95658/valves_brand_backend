import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";
import { OrderStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30D";

    let days = 30;
    if (range === "Today") days = 1;
    else if (range === "7D") days = 7;
    else if (range === "90D") days = 90;

    const allOrders = erpStore.getOrders();
    const allExpenses = erpStore.getExpenses();
    const allVariants = erpStore.getVariants();
    const allEvents = erpStore.getAnalyticsEvents(1000);

    const now = Date.now();
    const currentPeriodStart = now - days * 86400000;
    const prevPeriodStart = currentPeriodStart - days * 86400000;

    // Filter current vs previous period
    const currentOrders = allOrders.filter(
      (o) => new Date(o.createdAt).getTime() >= currentPeriodStart
    );
    const prevOrders = allOrders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= prevPeriodStart && t < currentPeriodStart;
    });

    const currentExpenses = allExpenses.filter(
      (e) => new Date(e.incurredDate).getTime() >= currentPeriodStart
    );
    const prevExpenses = allExpenses.filter((e) => {
      const t = new Date(e.incurredDate).getTime();
      return t >= prevPeriodStart && t < currentPeriodStart;
    });

    // Valid non-cancelled orders for revenue
    const validCurrent = currentOrders.filter((o) => o.status !== OrderStatus.CANCELLED);
    const validPrev = prevOrders.filter((o) => o.status !== OrderStatus.CANCELLED);

    const grossRevenue = validCurrent.reduce((sum, o) => sum + o.totalEgp, 0);
    const prevGrossRevenue = validPrev.reduce((sum, o) => sum + o.totalEgp, 0);

    // COGS
    const cogs = validCurrent.reduce((sum, o) => {
      return (
        sum +
        o.items.reduce(
          (sub, it) => sub + it.unitCostSnapshotEgp * it.quantity,
          0
        )
      );
    }, 0);

    const prevCogs = validPrev.reduce((sum, o) => {
      return (
        sum +
        o.items.reduce(
          (sub, it) => sub + it.unitCostSnapshotEgp * it.quantity,
          0
        )
      );
    }, 0);

    const totalExpenses = currentExpenses.reduce((sum, e) => sum + e.amountEgp, 0);
    const prevTotalExpenses = prevExpenses.reduce((sum, e) => sum + e.amountEgp, 0);

    const netProfit = grossRevenue - cogs - totalExpenses;
    const prevNetProfit = prevGrossRevenue - prevCogs - prevTotalExpenses;

    const totalOrdersCount = currentOrders.length;
    const prevOrdersCount = prevOrders.length;

    const aov = validCurrent.length > 0 ? Math.round(grossRevenue / validCurrent.length) : 0;
    const prevAov = validPrev.length > 0 ? Math.round(prevGrossRevenue / validPrev.length) : 0;

    // Return Rate
    const returnedOrdersCount = currentOrders.filter(
      (o) => o.status === OrderStatus.RETURNED
    ).length;
    const returnRate =
      totalOrdersCount > 0
        ? Number(((returnedOrdersCount / totalOrdersCount) * 100).toFixed(1))
        : 0;

    // Conversion Rate from analytics
    const sessionIds = new Set(allEvents.map((e) => e.sessionId)).size || 1;
    const purchaseCount = validCurrent.length;
    const conversionRate = Number(((purchaseCount / Math.max(sessionIds, 1)) * 100).toFixed(2));

    // Low stock count
    const lowStockCount = allVariants.filter(
      (v) => v.stockQty <= v.lowStockThreshold
    ).length;

    // Time-series Chart Data (split range into points)
    const pointsCount = days === 1 ? 12 : Math.min(days, 14);
    const chartData = [];
    const stepMs = (days * 86400000) / pointsCount;

    for (let i = 0; i < pointsCount; i++) {
      const sliceStart = currentPeriodStart + i * stepMs;
      const sliceEnd = sliceStart + stepMs;
      const dateLabel = new Date(sliceStart).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
      });

      const sliceOrders = validCurrent.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= sliceStart && t < sliceEnd;
      });

      const sliceRev = sliceOrders.reduce((sum, o) => sum + o.totalEgp, 0);
      const sliceCogs = sliceOrders.reduce((sum, o) => {
        return (
          sum +
          o.items.reduce(
            (sub, it) => sub + it.unitCostSnapshotEgp * it.quantity,
            0
          )
        );
      }, 0);
      const sliceExp = totalExpenses / pointsCount;
      const sliceProfit = Math.round(sliceRev - sliceCogs - sliceExp);

      chartData.push({
        date: dateLabel,
        revenue: sliceRev,
        profit: Math.max(0, sliceProfit),
        orders: sliceOrders.length,
      });
    }

    // Orders by Status
    const statusCounts: Record<string, number> = {
      DELIVERED: 0,
      SHIPPED: 0,
      CONFIRMED: 0,
      PACKED: 0,
      PENDING: 0,
      RETURNED: 0,
      CANCELLED: 0,
    };
    currentOrders.forEach((o) => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    // Sales by Category
    const categorySales = {
      Streetwear: 0,
      "Minimalist Casual": 0,
      Athleisure: 0,
    };
    validCurrent.forEach((o) => {
      o.items.forEach((it) => {
        if (it.productName.toLowerCase().includes("hoodie") || it.productName.toLowerCase().includes("cargo") || it.productName.toLowerCase().includes("box tee")) {
          categorySales.Streetwear += it.unitPriceEgp * it.quantity;
        } else if (it.productName.toLowerCase().includes("crewneck") || it.productName.toLowerCase().includes("knit") || it.productName.toLowerCase().includes("pant")) {
          categorySales["Minimalist Casual"] += it.unitPriceEgp * it.quantity;
        } else {
          categorySales.Athleisure += it.unitPriceEgp * it.quantity;
        }
      });
    });

    // Top Selling Pieces
    const itemPerformance: Record<string, { name: string; sku: string; unitsSold: number; revenue: number }> = {};
    validCurrent.forEach((o) => {
      o.items.forEach((it) => {
        if (!itemPerformance[it.productName]) {
          itemPerformance[it.productName] = {
            name: it.productName,
            sku: it.sku,
            unitsSold: 0,
            revenue: 0,
          };
        }
        itemPerformance[it.productName].unitsSold += it.quantity;
        itemPerformance[it.productName].revenue += it.unitPriceEgp * it.quantity;
      });
    });

    const topSelling = Object.values(itemPerformance)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Low stock items list
    const lowStockAlerts = allVariants
      .filter((v) => v.stockQty <= v.lowStockThreshold)
      .slice(0, 6)
      .map((v) => ({
        id: v.id,
        sku: v.sku,
        productName: v.productName,
        size: v.size,
        color: v.color,
        stockQty: v.stockQty,
        threshold: v.lowStockThreshold,
      }));

    // Calculate percentage changes
    const calcChange = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Number((((curr - prev) / prev) * 100).toFixed(1));
    };

    return NextResponse.json({
      kpis: {
        grossRevenue: { value: grossRevenue, change: calcChange(grossRevenue, prevGrossRevenue) },
        netProfit: { value: netProfit, change: calcChange(netProfit, prevNetProfit) },
        totalOrders: { value: totalOrdersCount, change: calcChange(totalOrdersCount, prevOrdersCount) },
        aov: { value: aov, change: calcChange(aov, prevAov) },
        conversionRate: { value: conversionRate, change: 1.2 },
        returnRate: { value: returnRate, change: -0.4 },
        lowStockSkus: { value: lowStockCount, change: 0 },
      },
      chartData,
      statusDistribution: statusCounts,
      categorySales,
      topSelling,
      lowStockAlerts,
      recentOrders: currentOrders.slice(0, 6),
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return NextResponse.json({ error: "Failed to generate dashboard overview" }, { status: 500 });
  }
}
