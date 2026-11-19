import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status, adminUserName } = body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updated = erpStore.updateOrderStatus(
      id,
      status as OrderStatus,
      adminUserName || "Admin"
    );

    return NextResponse.json({
      success: true,
      order: updated,
    });
  } catch (error: any) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}
