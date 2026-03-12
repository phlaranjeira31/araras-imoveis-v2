
// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Araras Imóveis",
  description: "Atendimento rápido e curadoria de imóveis em toda Petrópolis.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/site.webmanifest", // ✅ ADIÇÃO PARA ANDROID / PWA
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Araras Imóveis",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/logo.png`,
    telephone: "+55 21 96450-7343",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Petrópolis",
      addressRegion: "RJ",
      addressCountry: "BR",
    },
    areaServed: [
      { "@type": "City", name: "Petrópolis" },
      { "@type": "City", name: "Itaipava" },
      { "@type": "City", name: "Araras" },
    ],
  };

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CookieConsent />
        {children}
        <WhatsAppFloat />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}







