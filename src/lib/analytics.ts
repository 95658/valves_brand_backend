"use client";

import { useEffect } from "react";
import { AnalyticsEventType } from "@prisma/client";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server-sess";
  let sid = sessionStorage.getItem("valves_analytics_session_id");
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("valves_analytics_session_id", sid);
  }
  return sid;
}

function getUtmParams(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
} {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
  };
}

export function trackEvent(
  eventType: AnalyticsEventType,
  payload?: {
    pagePath?: string;
    productId?: string;
    orderId?: string;
  }
) {
  if (typeof window === "undefined") return;

  const sessionId = getOrCreateSessionId();
  const utm = getUtmParams();
  const pagePath = payload?.pagePath || window.location.pathname;
  const isMobile = window.innerWidth <= 768;

  const data = {
    sessionId,
    eventType,
    pagePath,
    productId: payload?.productId,
    orderId: payload?.orderId,
    utmSource: utm.utmSource || (document.referrer.includes("instagram") ? "instagram" : document.referrer.includes("tiktok") ? "tiktok" : "direct"),
    utmMedium: utm.utmMedium,
    utmCampaign: utm.utmCampaign,
    referrer: document.referrer || undefined,
    deviceType: isMobile ? "mobile" : "desktop",
  };

  // Asynchronous non-blocking beacon or fetch
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/track", JSON.stringify(data));
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Fail silently so storefront experience is uninterrupted
  }
}

export function useStorefrontAnalytics() {
  useEffect(() => {
    // Record page view on load
    trackEvent(AnalyticsEventType.PAGE_VIEW);
  }, []);
}
