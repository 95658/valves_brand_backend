import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const paymentMethod = searchParams.get("paymentMethod") || "ALL";
    const governorate = searchParams.get("governorate") || "ALL";
    const query = searchParams.get("query") || "";

    const orders = erpStore.getOrders({
      status,
      paymentMethod,
      governorate,
      query,
    });

    return NextResponse.json({
      orders,
      total: orders.length,
    });
  } catch (error) {
    console.error("Orders list error:", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
