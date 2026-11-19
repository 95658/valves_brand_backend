import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";
import { AnalyticsEventType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      sessionId,
      eventType,
      pagePath,
      productId,
      orderId,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
      deviceType,
    } = body;

    if (!sessionId || !eventType || !pagePath) {
      return NextResponse.json(
        { error: "sessionId, eventType and pagePath are required" },
        { status: 400 }
      );
    }

    if (!Object.values(AnalyticsEventType).includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid AnalyticsEventType" },
        { status: 400 }
      );
    }

    const recorded = erpStore.recordAnalyticsEvent({
      sessionId,
      eventType: eventType as AnalyticsEventType,
      pagePath,
      productId,
      orderId,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
      deviceType: deviceType || "desktop",
    });

    return NextResponse.json({ success: true, eventId: recorded.id });
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
