import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ImovelPhotosGallery from "@/components/ImovelPhotosGallery";
import ShareImovelButton from "@/components/ShareImovelButton";


export const runtime = "nodejs";
export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

import type { Metadata } from "next";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) return {};

  const imovel = await prisma.imovel.findUnique({
  where: { slug },
  select: {
    title: true,
    slug: true,
    city: true,
    neighborhood: true,
    price: true,
    descricao: true,
    coverPhotoId: true,
    photos: {
      take: 1, // ✅ só 1 foto, bem leve
      orderBy: { createdAt: "desc" },
      select: { id: true, url: true },
    },
  },
});

  if (!imovel) {
    return {
      title: "Imóvel não encontrado | Araras Imóveis",
      robots: { index: false, follow: false },
    };
  }
  
  const formatMoney = (v?: number | null) =>
    v == null
      ? ""
      : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const cover = imovel.photos[0]?.url || "/placeholder.jpg";


  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const absolute = (u: string) => (u?.startsWith("http") ? u : `${baseUrl}${u}`);

  const title = `${imovel.title} | Araras Imóveis`;
  const localizacao = [imovel.neighborhood, imovel.city].filter(Boolean).join(" • ");
  const priceLine = imovel.price ? `Valor: ${formatMoney(imovel.price)}.` : "";
  const descBase =
    imovel.descricao?.trim()?.replace(/\s+/g, " ") ||
    "Confira detalhes, fotos e informações completas deste imóvel.";

  const description = `${descBase} ${localizacao ? `Localização: ${localizacao}. ` : ""}${priceLine}`.trim();

  const url = `${baseUrl}/imovel/${imovel.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Araras Imóveis",
      locale: "pt_BR",
      images: [
        {
          url: absolute(cover),
          width: 1200,
          height: 630,
          alt: imovel.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absolute(cover)],
    },
  };
}

export default async function ImovelPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) return notFound();

  const imovel = await prisma.imovel.findUnique({
    where: { slug },
    include: { photos: true },
  });

  if (!imovel) return notFound();


const bairro = (imovel.neighborhood ?? "").trim();
const cidade = (imovel.city ?? "").trim();

let relacionados: any[] = [];


if (bairro) {
  relacionados = await prisma.imovel.findMany({
    where: {
      id: { not: imovel.id },
      neighborhood: bairro,
    },
    include: { photos: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}


if (relacionados.length === 0 && cidade) {
  relacionados = await prisma.imovel.findMany({
    where: {
      id: { not: imovel.id },
      city: cidade,
    },
    include: { photos: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}


if (relacionados.length === 0) {
  relacionados = await prisma.imovel.findMany({
    where: {
      id: { not: imovel.id },
    },
    include: { photos: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}

const tituloRelacionados = bairro || cidade || "sua região";


  const cover =
    (imovel.coverPhotoId &&
      imovel.photos.find((p) => p.id === imovel.coverPhotoId)?.url) ||
    imovel.photos[0]?.url ||
    "/placeholder.jpg";

  const hasAnyDetails =
    imovel.tipo ||
    imovel.quartos != null ||
    imovel.suites != null ||
    imovel.banheiros != null ||
    imovel.vagas != null ||
    imovel.areaConstruida != null ||
    imovel.areaTerreno != null ||
    imovel.mobiliado != null ||
    imovel.condominio != null ||
    imovel.iptu != null ||
    !!imovel.cep;

  const formatMoney = (v?: number | null) =>
    v == null
      ? ""
      : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  
  const imovelPath = `/imovel/${imovel.slug}`;
  const localizacao = [imovel.neighborhood, imovel.city].filter(Boolean).join(" • ");
  const precoLinha = imovel.price ? `Valor: ${formatMoney(imovel.price)}` : "";

  const whatsappText =
    `Olá! Tenho interesse neste imóvel:\n` +
    `${imovel.title}\n` +
    (localizacao ? `${localizacao}\n` : "") +
    (precoLinha ? `${precoLinha}\n` : "") +
    `Link: ${imovelPath}`;

  const whatsappHref = `https://wa.me/5521964507343?text=${encodeURIComponent(
    whatsappText
  )}`;

  
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const absolute = (u: string) => (u?.startsWith("http") ? u : `${baseUrl}${u}`);

  const images = [
    ...new Set(
      (imovel.photos || [])
        .map((p) => p.url)
        .filter(Boolean)
        .map(absolute)
    ),
  ];

  const addressLocality = imovel.city || undefined;
  const addressRegion = "RJ"; 
  const postalCode = imovel.cep || undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: imovel.title,
    url: `${baseUrl}/imovel/${imovel.slug}`,
    image: images.length ? images : [absolute(cover)],
    description:
      imovel.descricao?.trim() ||
      "Confira detalhes, fotos e informações completas deste imóvel.",
    offers: imovel.price
      ? {
          "@type": "Offer",
          price: imovel.price,
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: `${baseUrl}/imovel/${imovel.slug}`,
        }
      : undefined,
    
    numberOfRooms: imovel.quartos ?? undefined,
    numberOfBathroomsTotal: imovel.banheiros ?? undefined,
    floorSize: imovel.areaConstruida
      ? {
          "@type": "QuantitativeValue",
          value: imovel.areaConstruida,
          unitCode: "MTK",
        }
      : undefined,
    
    address:
      addressLocality || postalCode || imovel.neighborhood
        ? {
            "@type": "PostalAddress",
            streetAddress: imovel.neighborhood || undefined,
            addressLocality,
            addressRegion,
            postalCode,
            addressCountry: "BR",
          }
        : undefined,
    
    provider: {
      "@type": "RealEstateAgent",
      name: "Araras Imóveis",
      url: baseUrl,
      telephone: "+55 21 96450-7343",
    },
  };
  

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/imoveis" className="text-sm font-semibold text-primary">
        ← Voltar para Imóveis
      </Link>

<div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
  
  <div>
    <h1 className="text-3xl font-extrabold">{imovel.title}</h1>

    <div className="mt-2 text-slate-600">
      {[imovel.neighborhood, imovel.city].filter(Boolean).join(" • ")}
    </div>

    {imovel.price ? (
      <div className="mt-2 text-2xl font-extrabold">
        {formatMoney(imovel.price)}
      </div>
    ) : null}
  </div>

  
  <div className="md:mb-1">
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp sobre este imóvel"
      className="
        inline-flex w-full items-center justify-center gap-3
        rounded-2xl
        border border-white/20
        bg-gradient-to-r from-green-700 to-emerald-700
        px-8 py-5
        text-base font-extrabold text-white
        shadow-md
        transition-all
        hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110
        focus:outline-none focus:ring-2 focus:ring-emerald-300/60
        md:w-auto
      "
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden="true"
        className="shrink-0 fill-white"
      >
        <path d="M20.52 3.48A11.86 11.86 0 0012.02 0C5.4 0 .02 5.38.02 12c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.62A11.93 11.93 0 0012.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52zM12.02 22.02c-1.84 0-3.65-.5-5.23-1.44l-.38-.23-3.68.96.98-3.59-.25-.37A9.97 9.97 0 012 12C2 6.49 6.5 2 12.02 2c2.66 0 5.16 1.04 7.04 2.93A9.9 9.9 0 0122 12c0 5.52-4.49 10.02-9.98 10.02zm5.84-7.54c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.18.21-.32.32-.54.11-.21.05-.41-.03-.57-.08-.16-.71-1.71-.98-2.34-.26-.63-.53-.54-.71-.55h-.61c-.21 0-.54.08-.82.41-.28.32-1.07 1.04-1.07 2.54s1.09 2.95 1.25 3.16c.16.21 2.14 3.26 5.18 4.57.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.88-.77 2.14-1.5.26-.73.26-1.36.18-1.5-.08-.14-.29-.23-.61-.39z" />
      </svg>

      <span className="flex flex-col items-start leading-tight">
        <span>Agende sua visita</span>
        <span className="text-[12px] font-semibold text-white/85">
          Atendimento imediato
        </span>
      </span>
    </a>
    <div className="mt-3">
  <ShareImovelButton
    title={imovel.title}
    text={`Confira este imóvel: ${imovel.title}`}
  />
</div>

  </div>
</div>


      
      <div className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-soft">
        <div className="relative aspect-[16/7] w-full">
          <Image
            src={cover}
            alt={imovel.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      
      {imovel.photos?.length ? (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">Fotos</h2>

          
          <ImovelPhotosGallery
            photos={imovel.photos}
            coverPhotoId={imovel.coverPhotoId ?? null}
          />
        </section>
      ) : null}


     
      {hasAnyDetails ? (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">Detalhes</h2>

          <div className="mt-4 rounded-3xl border bg-white p-6 shadow-soft">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {imovel.tipo ? (
                <div>
                  <div className="flex items-center gap-2">
                    
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-6v-7H10v7H4a1 1 0 0 1-1-1V10.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                      TIPO
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">{imovel.tipo}</p>
                </div>
              ) : null}

              {imovel.quartos != null ? (
                <div>
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M3 16v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M5 16v3M19 16v3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                      QUARTOS
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">{imovel.quartos}</p>
                </div>
              ) : null}

              {imovel.suites != null ? (
                <div>
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M3 16v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 2l.8 1.7 1.9.2-1.4 1.3.4 1.9L12 6.2 10.3 7l.4-1.9L9.3 3.9l1.9-.2L12 2z"
                        fill="currentColor"
                        opacity="0.9"
                      />
                    </svg>

                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                      SUÍTES
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">{imovel.suites}</p>
                </div>
              ) : null}

              {imovel.banheiros != null ? (
                <div>
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 7V5a3 3 0 0 1 6 0v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M5 10h14v3a7 7 0 0 1-7 7h0a7 7 0 0 1-7-7v-3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 10V8a1 1 0 0 0-1-1h-2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                      BANHEIROS
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">{imovel.banheiros}</p>
                </div>
              ) : null}

              {imovel.vagas != null ? (
                <div>
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 16l-1-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3l-1 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 16h14v3a1 1 0 0 1-1 1h-1v-1a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H6a1 1 0 0 1-1-1v-3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 13h8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                      VAGAS
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">{imovel.vagas}</p>
                </div>
              ) : null}

              {imovel.areaConstruida != null ? (
                <div>
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 7h16M6 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8 11h8M8 14h5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                      ÁREA CONSTRUÍDA
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">
                    {imovel.areaConstruida} m²
                  </p>
                </div>
              ) : null}

              {imovel.areaTerreno != null ? (
                <div>
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 4h16v16H4V4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 9h16M9 4v16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.9"
                      />
                    </svg>

                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                      ÁREA DO TERRENO
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">
                    {imovel.areaTerreno} m²
                  </p>
                </div>
              ) : null}

              {imovel.mobiliado != null ? (
                <div>
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M4 13h16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 18v2M17 18v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                      MOBILIADO
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">
                    {imovel.mobiliado ? "Sim" : "Não"}
                  </p>
                </div>
              ) : null}

              {imovel.condominio != null ? (
                <div>
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 22V4l5-2 5 2v18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 8h2M9 12h2M9 16h2M13 8h2M13 12h2M13 16h2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                      CONDOMÍNIO
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatMoney(imovel.condominio)}
                  </p>
                </div>
              ) : null}

              {imovel.iptu != null ? (
                <div>
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 3v4h4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8 11h8M8 14h8M8 17h5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                      IPTU
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatMoney(imovel.iptu)}
                  </p>
                </div>
              ) : null}

              {imovel.cep ? (
                <div>
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>

                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                      CEP
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">{imovel.cep}</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      
      {imovel.descricao ? (
        <section className="mt-8">
          <div className="rounded-3xl border bg-white p-6 shadow-soft">
            <h3 className="text-base font-bold text-slate-900">Descrição</h3>
            <p className="mt-3 text-slate-700 whitespace-pre-line">
              {imovel.descricao}
            </p>
          </div>
        </section>
      ) : null}

      
{relacionados.length > 0 ? (
  <section className="mt-12">
  <h2 className="mb-6 text-xl font-extrabold text-slate-900">
  Mais imóveis em {(imovel.neighborhood || imovel.city || "sua região")}
</h2>



    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {relacionados.map((item) => {
        const coverRelacionado =
          (item.coverPhotoId &&
            item.photos.find((p) => p.id === item.coverPhotoId)?.url) ||
          item.photos[0]?.url ||
          "/placeholder.jpg";

        return (
          <Link
            key={item.id}
            href={`/imovel/${item.slug}`}
            className="group overflow-hidden rounded-3xl border bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={coverRelacionado}
                alt={item.title}
                fill
                className="object-cover transition group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {[item.neighborhood, item.city].filter(Boolean).join(" • ")}
              </p>

              {item.price ? (
                <p className="mt-2 font-extrabold text-primary">
                  {item.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  </section>
) : null}

      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}



















