import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VALVES — Hybrid Apparel Label | Streetwear, Casual & Athleisure",
  description:
    "Official store for VALVES Apparel. Architectural streetwear, refined minimalist casuals, and high-performance athleisure. Free express delivery on orders over 2,000 EGP.",
  keywords: ["Valves", "Streetwear", "Egyptian Cotton", "Athleisure", "Heavyweight Hoodie"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
