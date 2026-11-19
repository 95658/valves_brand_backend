import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const updated = erpStore.settleCod(orderId);
    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Settle COD error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to settle COD" },
      { status: 500 }
    );
  }
}
