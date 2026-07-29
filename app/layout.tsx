// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CookieConsent from "@/components/CookieConsent";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.ararasimoveis.net.br"
).replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  applicationName: "Araras Imóveis",

  title: {
    default: "Araras Imóveis | Imóveis em Petrópolis e Itaipava",
    template: "%s | Araras Imóveis",
  },

  description:
    "Imóveis à venda e para locação em Itaipava, Araras, Corrêas e outras regiões de Petrópolis. Casas, apartamentos, terrenos e imóveis de alto padrão.",

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "Araras Imóveis | Imóveis em Petrópolis e Itaipava",
    description:
      "Encontre casas, apartamentos, terrenos e imóveis de alto padrão em Itaipava, Araras, Corrêas e outras regiões de Petrópolis.",
    url: BASE_URL,
    siteName: "Araras Imóveis",
    images: [
      {
        url: "/logo.png",
        alt: "Araras Imóveis",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Araras Imóveis | Imóveis em Petrópolis e Itaipava",
    description:
      "Casas, apartamentos, terrenos e imóveis de alto padrão em Petrópolis e região.",
    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "real estate",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${BASE_URL}/#real-estate-agent`,

    name: "Araras Imóveis",
    url: BASE_URL,

    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/logo.png`,

    email: "araras.imoveisrj@gmail.com",
    telephone: "+5524988230138",

    contactPoint: [
      {
        "@type": "ContactPoint",
        name: "Claudia Raposo",
        telephone: "+5524988230138",
        contactType: "atendimento ao cliente",
        availableLanguage: "Portuguese",
        areaServed: "BR",
      },
      {
        "@type": "ContactPoint",
        name: "Lidiane Farias",
        telephone: "+5521964507343",
        contactType: "atendimento ao cliente",
        availableLanguage: "Portuguese",
        areaServed: "BR",
      },
    ],

    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Estrada União Indústria, 9.500, Sala 03, Itaipava",
      addressLocality: "Petrópolis",
      addressRegion: "RJ",
      addressCountry: "BR",
    },

    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "18:00",
    },

    areaServed: [
      {
        "@type": "City",
        name: "Petrópolis",
      },
      {
        "@type": "Place",
        name: "Itaipava",
      },
      {
        "@type": "Place",
        name: "Araras",
      },
      {
        "@type": "Place",
        name: "Corrêas",
      },
      {
        "@type": "Place",
        name: "Cascatinha",
      },
      {
        "@type": "Place",
        name: "Secretário",
      },
      {
        "@type": "Place",
        name: "Pedro do Rio",
      },
      {
        "@type": "Place",
        name: "Posse",
      },
    ],

    sameAs: [
      "https://www.instagram.com/araras.imoveis?igsh=bDNrMDk1dW80czZs",
      "https://www.youtube.com/@araras.imoveis",
    ],
  };

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CookieConsent />

        {children}

        <WhatsAppFloat />

        <script
          id="real-estate-agent-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </body>
    </html>
  );
}