import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VALVES — Cairo Architectural Apparel | Minimalist Streetwear & Casuals",
  description:
    "Architectural streetwear, refined minimalist casuals, and high-performance garments crafted from custom 460 GSM Egyptian cotton. Cairo, Egypt.",
  keywords: ["Valves", "Streetwear", "Egyptian Cotton", "Heavyweight Hoodie", "Cairo Fashion", "Minimalist"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
