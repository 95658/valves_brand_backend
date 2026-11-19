import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const lowStockOnly = searchParams.get("lowStockOnly") === "true";

    const variants = erpStore.getVariants(search, lowStockOnly);

    // Calculate aggregated inventory KPIs
    const totalSkus = variants.length;
    const totalUnits = variants.reduce((sum, v) => sum + v.stockQty, 0);
    const totalInventoryValueRetail = variants.reduce(
      (sum, v) => sum + v.retailPriceEgp * v.stockQty,
      0
    );
    const totalInventoryCost = variants.reduce(
      (sum, v) => sum + v.unitCostEgp * v.stockQty,
      0
    );
    const lowStockCount = variants.filter(
      (v) => v.stockQty <= v.lowStockThreshold
    ).length;

    return NextResponse.json({
      variants,
      kpis: {
        totalSkus,
        totalUnits,
        totalInventoryValueRetail,
        totalInventoryCost,
        potentialMarginPercent:
          totalInventoryValueRetail > 0
            ? Number(
                (
                  ((totalInventoryValueRetail - totalInventoryCost) /
                    totalInventoryValueRetail) *
                  100
                ).toFixed(1)
              )
            : 0,
        lowStockCount,
      },
    });
  } catch (error) {
    console.error("Inventory variants error:", error);
    return NextResponse.json({ error: "Failed to load variants" }, { status: 500 });
  }
}
