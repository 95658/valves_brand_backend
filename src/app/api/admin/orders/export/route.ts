import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const paymentMethod = searchParams.get("paymentMethod") || "ALL";
    const governorate = searchParams.get("governorate") || "ALL";

    const orders = erpStore.getOrders({
      status,
      paymentMethod,
      governorate,
    });

    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Phone",
      "Governorate",
      "City",
      "Address",
      "Items Count",
      "Items Detail",
      "Payment Method",
      "COD Settlement",
      "Subtotal (EGP)",
      "Discount (EGP)",
      "Shipping (EGP)",
      "Total (EGP)",
      "Status",
    ];

    const rows = orders.map((o) => {
      const itemsDetail = o.items
        .map((it) => `${it.productName} [${it.size}/${it.color}] x${it.quantity}`)
        .join(" | ");

      return [
        `"${o.orderNumber}"`,
        `"${new Date(o.createdAt).toISOString().replace("T", " ").substring(0, 19)}"`,
        `"${o.customerName.replace(/"/g, '""')}"`,
        `"${o.customerPhone}"`,
        `"${o.governorate}"`,
        `"${o.city}"`,
        `"${o.address.replace(/"/g, '""')}"`,
        o.items.reduce((s, it) => s + it.quantity, 0),
        `"${itemsDetail.replace(/"/g, '""')}"`,
        `"${o.paymentMethod}"`,
        `"${o.codSettlementStatus}"`,
        o.subtotalEgp,
        o.discountEgp,
        o.shippingFeeEgp,
        o.totalEgp,
        `"${o.status}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="valves_orders_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Orders CSV export error:", error);
    return NextResponse.json({ error: "Failed to export orders" }, { status: 500 });
  }
}
