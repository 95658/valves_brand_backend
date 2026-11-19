import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";
import { OrderStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderIds, status, adminUserName } = body;

    if (!Array.isArray(orderIds) || !status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid payload: orderIds array and valid status are required" },
        { status: 400 }
      );
    }

    const updatedOrders = [];
    for (const id of orderIds) {
      try {
        const order = erpStore.updateOrderStatus(
          id,
          status as OrderStatus,
          adminUserName || "Admin"
        );
        updatedOrders.push(order);
      } catch (err) {
        console.error(`Failed to update ${id}`, err);
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount: updatedOrders.length,
      orders: updatedOrders,
    });
  } catch (error) {
    console.error("Bulk order status update error:", error);
    return NextResponse.json({ error: "Failed to perform bulk update" }, { status: 500 });
  }
}
