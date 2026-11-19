import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";

// In-memory settings state
let storeSettings = {
  freeShippingThresholdEgp: 2000,
  standardShippingFeeEgp: 75,
  expressDeliveryHours: "24-48h",
  dispatchHub: "Cairo Atelier & Maadi Fulfillment Hub",
  autoStockDeduction: true,
  lowStockGlobalThreshold: 4,
  governorates: [
    { name: "Cairo", fee: 65, active: true },
    { name: "Giza", fee: 65, active: true },
    { name: "Alexandria", fee: 75, active: true },
    { name: "Delta (Mansoura / Tanta)", fee: 85, active: true },
    { name: "Canal Cities (Suez / Ismailia / Port Said)", fee: 85, active: true },
    { name: "Upper Egypt (Assiut / Luxor / Aswan)", fee: 110, active: true },
    { name: "Red Sea & Sinai (El Gouna / Sharm)", fee: 125, active: true },
  ],
};

export async function GET() {
  const users = erpStore.getAdminUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  }));

  return NextResponse.json({
    settings: storeSettings,
    adminUsers: users,
  });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    storeSettings = {
      ...storeSettings,
      ...body,
    };
    return NextResponse.json({ success: true, settings: storeSettings });
  } catch (error) {
    console.error("Settings put error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
