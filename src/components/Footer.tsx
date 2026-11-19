"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ValveLogo } from "@/components/ValveLogo";

export const Footer: React.FC = () => {
  const { lang, isRTL, t } = useStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-[var(--border-hairline)] bg-[var(--bg-secondary)] text-[var(--ink-primary)] pt-16 pb-12 transition-colors">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Brand & Newsletter 2-Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-14 border-b border-[var(--border-hairline)]">
          {/* Brand Philosophy & Customer-Friendly Fulfillment Copy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center text-[var(--ink-primary)]">
                <ValveLogo className="w-full h-full" />
              </div>
              <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-[0.25em] uppercase">
                {isRTL ? "فالفز" : "VALVES"}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-light text-[var(--ink-secondary)] leading-relaxed max-w-md">
              {t("footer.tagline")}
            </p>

            {/* Customer-Friendly Dispatch Copy & Hairline Stamp */}
            <div className="pt-2 space-y-1.5">
              <div className="text-xs font-mono text-[var(--ink-primary)] font-medium">
                {t("footer.delivery")}
              </div>
              <div className="inline-block px-2 py-0.5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase">
                {t("footer.stamp")}
              </div>
            </div>
          </div>

          {/* Newsletter / Atelier Dispatch */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-heading font-bold text-sm tracking-wider uppercase mb-2">
                {t("footer.newsletterTitle")}
              </h4>
              <p className="text-xs font-light text-[var(--ink-secondary)] mb-5 max-w-md leading-relaxed">
                {t("footer.newsletterDesc")}
              </p>

              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  required
                  placeholder="atelier@valves.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 text-xs font-mono border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/60 focus:outline-none focus:border-[var(--ink-primary)]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[var(--ink-primary)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-wider border border-[var(--ink-primary)] hover:opacity-90 transition flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  {subscribed ? (
                    <>
                      <Check size={14} />
                      <span>{t("footer.subscribed")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("footer.subscribe")}</span>
                      {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Architectural Coordinates */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider">
          <div>© 2026 VALVES APPAREL. {t("footer.rights")}</div>
          <div className="flex gap-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[var(--ink-primary)] transition">
              INSTAGRAM
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-[var(--ink-primary)] transition">
              TIKTOK
            </a>
            <a href="mailto:atelier@valves.co" className="hover:text-[var(--ink-primary)] transition">
              CONTACT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
