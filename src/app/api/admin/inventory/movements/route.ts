import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const variantId = searchParams.get("variantId") || undefined;

    const movements = erpStore.getMovements(variantId);

    return NextResponse.json({
      movements,
      total: movements.length,
    });
  } catch (error) {
    console.error("Stock movements error:", error);
    return NextResponse.json({ error: "Failed to load movements" }, { status: 500 });
  }
}
