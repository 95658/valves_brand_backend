import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";
import { OrderStatus, PaymentMethod, CodSettlementStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30D";

    let days = 30;
    if (range === "Today") days = 1;
    else if (range === "7D") days = 7;
    else if (range === "90D") days = 90;

    const currentPeriodStart = Date.now() - days * 86400000;
    const allOrders = erpStore.getOrders();
    const allExpenses = erpStore.getExpenses();

    const orders = allOrders.filter(
      (o) => new Date(o.createdAt).getTime() >= currentPeriodStart
    );
    const expenses = allExpenses.filter(
      (e) => new Date(e.incurredDate).getTime() >= currentPeriodStart
    );

    // Filter valid vs returned
    const nonCancelled = orders.filter((o) => o.status !== OrderStatus.CANCELLED);
    const returned = orders.filter((o) => o.status === OrderStatus.RETURNED);

    // 1. Gross Revenue (retail value of non-cancelled items)
    const grossRevenue = nonCancelled.reduce((sum, o) => sum + o.subtotalEgp, 0);

    // 2. Discounts
    const totalDiscounts = nonCancelled.reduce((sum, o) => sum + o.discountEgp, 0);

    // 3. Returns Value
    const totalReturns = returned.reduce((sum, o) => sum + o.totalEgp, 0);

    // 4. Net Sales
    const netSales = Math.max(0, grossRevenue - totalDiscounts - totalReturns);

    // 5. COGS (Cost of goods sold for delivered/shipped/confirmed orders)
    const fulfilledOrders = nonCancelled.filter(
      (o) => o.status !== OrderStatus.RETURNED
    );
    const cogs = fulfilledOrders.reduce((sum, o) => {
      return (
        sum +
        o.items.reduce(
          (sub, it) => sub + it.unitCostSnapshotEgp * it.quantity,
          0
        )
      );
    }, 0);

    // 6. Gross Profit
    const grossProfit = netSales - cogs;
    const grossMarginPercent = netSales > 0 ? Number(((grossProfit / netSales) * 100).toFixed(1)) : 0;

    // 7. Shipping Costs (absorbed shipping for free shipping orders, ~65 EGP average cost)
    const freeShippingOrdersCount = fulfilledOrders.filter((o) => o.shippingFeeEgp === 0).length;
    const estimatedShippingExpense = freeShippingOrdersCount * 65;

    // 8. Operating & Ad Expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amountEgp, 0);

    const expenseByCategory: Record<string, number> = {
      META_ADS: 0,
      TIKTOK_ADS: 0,
      PACKAGING: 0,
      PRODUCTION: 0,
      STUDIO: 0,
      MISC: 0,
    };
    expenses.forEach((e) => {
      if (expenseByCategory[e.category] !== undefined) {
        expenseByCategory[e.category] += e.amountEgp;
      }
    });

    // 9. Net Profit
    const netProfit = grossProfit - estimatedShippingExpense - totalExpenses;
    const netMarginPercent = netSales > 0 ? Number(((netProfit / netSales) * 100).toFixed(1)) : 0;

    // 10. COD Cashflow Tracker
    const codOrders = nonCancelled.filter((o) => o.paymentMethod === PaymentMethod.COD);
    const codWithCourier = codOrders
      .filter((o) => o.codSettlementStatus === CodSettlementStatus.WITH_COURIER)
      .reduce((sum, o) => sum + o.totalEgp, 0);
    const codSettled = codOrders
      .filter((o) => o.codSettlementStatus === CodSettlementStatus.SETTLED)
      .reduce((sum, o) => sum + o.totalEgp, 0);
    const codUncollected = codOrders
      .filter((o) => o.codSettlementStatus === CodSettlementStatus.UNCOLLECTED)
      .reduce((sum, o) => sum + o.totalEgp, 0);

    return NextResponse.json({
      pnl: {
        grossRevenue,
        discounts: totalDiscounts,
        returns: totalReturns,
        netSales,
        cogs,
        grossProfit,
        grossMarginPercent,
        shippingExpense: estimatedShippingExpense,
        operatingExpenses: totalExpenses,
        netProfit,
        netMarginPercent,
      },
      expenseByCategory,
      codTracker: {
        totalCodOrders: codOrders.length,
        withCourierEgp: codWithCourier,
        settledEgp: codSettled,
        uncollectedEgp: codUncollected,
        totalCodEgp: codWithCourier + codSettled + codUncollected,
      },
    });
  } catch (error) {
    console.error("Finance PnL error:", error);
    return NextResponse.json({ error: "Failed to generate PnL" }, { status: 500 });
  }
}
