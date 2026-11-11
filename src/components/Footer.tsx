"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export const Footer: React.FC = () => {
  const { isDark, lang, t } = useStore();
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
    <footer className={`border-t pt-20 pb-12 transition-colors ${
      isDark ? "bg-[#09090b] border-zinc-800" : "bg-white border-zinc-200"
    }`}>
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* App Promo Banner */}
        <div id="app-download" className={`mb-20 p-8 sm:p-12 border flex flex-col md:flex-row items-center justify-between gap-8 ${
          isDark
            ? "bg-gradient-to-r from-[#141417] to-zinc-900 border-zinc-800"
            : "bg-gradient-to-r from-zinc-50 to-zinc-100 border-zinc-200"
        }`}>
          <div>
            <div className="inline-block px-3 py-1 bg-volt/10 text-volt text-[10px] font-space font-bold tracking-widest border border-volt/20 uppercase mb-3">
              {t("footer.nativeApp")}
            </div>
            <h3 className="text-2xl sm:text-3xl font-space font-extrabold uppercase mb-2">
              {t("footer.downloadApp")}
            </h3>
            <p className={`text-sm font-light max-w-lg ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              {t("footer.downloadDesc")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className={`px-5 py-3 border rounded-none flex items-center gap-3 cursor-pointer hover:border-volt transition ${
              isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-zinc-300 text-zinc-900"
            }`}>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-2.01.6-2.66 1.35-.57.65-1.07 1.72-.94 2.76 1.02.08 2.06-.51 2.68-1.24z"/>
              </svg>
              <div>
                <div className="text-[9px] font-mono text-zinc-400 uppercase">COMING TO</div>
                <div className="text-xs font-space font-bold">{t("footer.appleStore")}</div>
              </div>
            </div>

            <div className={`px-5 py-3 border rounded-none flex items-center gap-3 cursor-pointer hover:border-volt transition ${
              isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-zinc-300 text-zinc-900"
            }`}>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.793 12 3.61 22.186c-.198-.198-.31-.476-.31-.786V2.6c0-.31.112-.588.31-.786zm11.233 11.234l2.585 2.585-11.472 6.623 8.887-9.208zm0-2.096L5.955 1.744l11.472 6.623-2.585 2.585zm1.485 1.048l3.35 1.933c.96.554.96 1.46 0 2.014l-3.35 1.933-2.336-2.336 2.336-3.544z"/>
              </svg>
              <div>
                <div className="text-[9px] font-mono text-zinc-400 uppercase">COMING TO</div>
                <div className="text-xs font-space font-bold">{t("footer.googlePlay")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter & Brand Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-16 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-space font-extrabold text-2xl tracking-[0.25em]">VALVES</span>
              <span className="bg-volt text-black text-[9px] font-mono font-bold px-2 py-0.5">CAIRO</span>
            </div>
            <p className={`text-xs max-w-sm font-light leading-relaxed mb-6 ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              Experimental apparel engineering label based in Cairo, Egypt. Designing heavyweight garments that resist wear while enabling unrestricted urban motion.
            </p>
            <div className={`text-[10px] font-mono ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              BOSTA EXPRESS LIVE API // DISPATCH FROM MAADI HUB
            </div>
          </div>

          <div>
            <h4 className="font-space font-bold text-sm tracking-wider uppercase mb-2">
              {t("footer.newsletterTitle")}
            </h4>
            <p className={`text-xs font-light mb-4 ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              {t("footer.newsletterDesc")}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                placeholder="vip@valves.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 p-3 text-xs font-mono border focus:outline-none focus:border-volt ${
                  isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-zinc-100 border-zinc-300 text-zinc-900"
                }`}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-volt text-black font-space font-bold text-xs uppercase tracking-wider hover:bg-[#b8e600] transition flex items-center gap-2 shrink-0"
              >
                {subscribed ? (
                  <>
                    <Check size={14} />
                    <span>DONE</span>
                  </>
                ) : (
                  <>
                    <span>{t("footer.subscribe")}</span>
                    {lang === "ar" ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono ${
          isDark ? "text-zinc-500" : "text-zinc-400"
        }`}>
          <div>© 2026 VALVES CLOTHING CO. {t("footer.rights")}</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-volt transition">INSTAGRAM</a>
            <a href="#" className="hover:text-volt transition">TIKTOK</a>
            <a href="#" className="hover:text-volt transition">DISCORD</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
