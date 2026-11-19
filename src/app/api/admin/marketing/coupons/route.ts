import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";

export async function GET() {
  try {
    const coupons = erpStore.getCoupons();
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Coupons get error:", error);
    return NextResponse.json({ error: "Failed to load coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discountPercent, discountEgp, minOrderEgp, usageLimit, expiresAt } = body;

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = erpStore.createCoupon({
      code: code.trim().toUpperCase(),
      discountPercent: discountPercent ? Number(discountPercent) : undefined,
      discountEgp: discountEgp ? Number(discountEgp) : undefined,
      minOrderEgp: minOrderEgp ? Number(minOrderEgp) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      expiresAt: expiresAt || undefined,
      active: true,
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error("Coupons post error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
