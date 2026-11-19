import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";
import { StockMovementReason } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { variantId, changeQty, reason, note, adminUserName } = body;

    if (!variantId || changeQty === undefined || !reason) {
      return NextResponse.json(
        { error: "variantId, changeQty and reason are required" },
        { status: 400 }
      );
    }

    if (!Object.values(StockMovementReason).includes(reason)) {
      return NextResponse.json(
        { error: "Invalid StockMovementReason" },
        { status: 400 }
      );
    }

    const updated = erpStore.adjustStock(
      variantId,
      Number(changeQty),
      reason as StockMovementReason,
      note,
      adminUserName || "Admin"
    );

    return NextResponse.json({
      success: true,
      variant: updated,
    });
  } catch (error: any) {
    console.error("Adjust stock error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to adjust stock" },
      { status: 500 }
    );
  }
}
