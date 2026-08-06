import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bath,
  BedDouble,
  MapPin,
  Ruler,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import HomeImoveisCarouselBehavior from "@/components/HomeImoveisCarouselBehavior";

function formatBRL(value?: number | null) {
  if (typeof value !== "number") return "";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function normalizeCover(url?: string | null) {
  if (!url || typeof url !== "string") {
    return "/placeholder.jpg";
  }

  return url;
}

export default async function HomeImoveisCarousel() {
  const imoveis = await prisma.imovel.findMany({
    where: {
      ativo: true,
      featured: true,
    },

    orderBy: {
      featuredAt: "desc",
    },

    take: 10,

    select: {
      id: true,
      title: true,
      city: true,
      neighborhood: true,
      price: true,
      quartos: true,
      banheiros: true,
      areaConstruida: true,
      slug: true,
      coverPhotoId: true,

      photos: {
        select: {
          id: true,
          url: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const items = imoveis.map((imovel) => {
    const coverById = imovel.coverPhotoId
      ? imovel.photos.find((photo) => photo.id === imovel.coverPhotoId)?.url
      : null;

    const coverFallback = imovel.photos[0]?.url || "/placeholder.jpg";

    return {
      id: imovel.id,
      title: imovel.title,
      city: imovel.city,
      neighborhood: imovel.neighborhood,
      price: imovel.price,
      quartos: imovel.quartos,
      banheiros: imovel.banheiros,
      areaConstruida: imovel.areaConstruida,
      slug: imovel.slug,
      cover: normalizeCover(coverById || coverFallback),
    };
  });

  if (items.length === 0) {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Nenhum imóvel em destaque
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Marque imóveis como destaque no painel administrativo para eles
          aparecerem nesta seção.
        </p>

        <Link
          href="/admin/imoveis"
          className="mt-5 inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Ir para o painel
        </Link>
      </section>
    );
  }

  return (
    <section aria-labelledby="imoveis-destaque-title">
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.21em] text-[#6b8257]">
            <span className="h-px w-8 bg-[#9aaf89]" />
            Seleção especial
          </div>

          <h2
            id="imoveis-destaque-title"
            className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
          >
            Imóveis em destaque
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Oportunidades selecionadas pela Araras Imóveis nas principais
            regiões da serra.
          </p>
        </div>

        <Link
          href="/imoveis?purpose=todos"
          className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#a9b99d] hover:bg-[#f7faf5]"
        >
          Ver todos os imóveis

          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* CARROSSEL */}
      <div className="relative mt-7">
        <HomeImoveisCarouselBehavior autoplayMs={4500} />

        {/* SETA ESQUERDA */}
        <button
          type="button"
          aria-label="Ver imóveis anteriores"
          className="carousel-prev absolute -left-5 top-[82px] z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-semibold text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.14)] transition hover:scale-105 hover:bg-[#f7faf5] md:flex"
        >
          ‹
        </button>

        {/* SETA DIREITA */}
        <button
          type="button"
          aria-label="Ver próximos imóveis"
          className="carousel-next absolute -right-5 top-[82px] z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-semibold text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.14)] transition hover:scale-105 hover:bg-[#f7faf5] md:flex"
        >
          ›
        </button>

        <div
          id="home-carousel"
          className="home-scroll grid grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-3"
        >
          {items.map((imovel) => {
            const localizacao =
              imovel.neighborhood || imovel.city || "Petrópolis";

            const possuiQuartos =
              typeof imovel.quartos === "number" && imovel.quartos > 0;

            const possuiBanheiros =
              typeof imovel.banheiros === "number" &&
              imovel.banheiros > 0;

            const possuiArea =
              typeof imovel.areaConstruida === "number" &&
              imovel.areaConstruida > 0;

            const possuiCaracteristicas =
              possuiQuartos || possuiBanheiros || possuiArea;

            return (
              <Link
                key={imovel.id}
                href={`/imovel/${imovel.slug}`}
                className="block h-full min-w-0 snap-start"
              >
                <article className="group flex h-[390px] flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_7px_24px_rgba(15,23,42,0.06)] transition duration-500 hover:-translate-y-1 hover:border-[#a8b99c] hover:shadow-[0_17px_36px_rgba(15,23,42,0.12)]">
                  {/* IMAGEM PADRONIZADA */}
                  <div className="relative h-[175px] w-full shrink-0 overflow-hidden bg-slate-100">
                    <Image
                      src={imovel.cover}
                      alt={imovel.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.045]"
                      sizes="
                        (max-width: 640px) 86vw,
                        (max-width: 1024px) 50vw,
                        280px
                      "
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  </div>

                  {/* CONTEÚDO PADRONIZADO */}
                  <div className="flex min-h-0 flex-1 flex-col p-4">
                    {/* LOCALIZAÇÃO */}
                    <p className="flex h-5 items-center gap-1.5 text-xs font-medium text-slate-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#789064]" />

                      <span className="truncate">{localizacao}</span>
                    </p>

                    {/* TÍTULO COM DUAS LINHAS FIXAS */}
                    <h3
                      className="mt-2 h-[44px] overflow-hidden text-[15px] font-extrabold leading-[1.4] text-slate-950 transition-colors group-hover:text-[#365f4d]"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {imovel.title}
                    </h3>

                    {/* CARACTERÍSTICAS COM ALTURA FIXA */}
                    <div className="mt-3 flex h-[42px] items-center border-t border-slate-100 pt-3">
                      {possuiCaracteristicas ? (
                        <div className="flex w-full items-center justify-between gap-2 text-[10px] font-medium text-slate-500">
                          {possuiQuartos && (
                            <span
                              className="inline-flex min-w-0 items-center gap-1"
                              title={`${imovel.quartos} quartos`}
                            >
                              <BedDouble className="h-3.5 w-3.5 shrink-0 text-[#71885e]" />

                              <span className="truncate">
                                {imovel.quartos}{" "}
                                {imovel.quartos === 1
                                  ? "quarto"
                                  : "quartos"}
                              </span>
                            </span>
                          )}

                          {possuiBanheiros && (
                            <span
                              className="inline-flex min-w-0 items-center gap-1"
                              title={`${imovel.banheiros} banheiros`}
                            >
                              <Bath className="h-3.5 w-3.5 shrink-0 text-[#71885e]" />

                              <span className="truncate">
                                {imovel.banheiros} banh.
                              </span>
                            </span>
                          )}

                          {possuiArea && (
                            <span
                              className="inline-flex min-w-0 items-center gap-1"
                              title={`${imovel.areaConstruida} metros quadrados`}
                            >
                              <Ruler className="h-3.5 w-3.5 shrink-0 text-[#71885e]" />

                              <span className="truncate">
                                {imovel.areaConstruida.toLocaleString("pt-BR")}{" "}
                                m²
                              </span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">
                          Características sob consulta
                        </span>
                      )}
                    </div>

                    {/* PREÇO SEMPRE NO FINAL */}
                    <div className="mt-auto border-t border-slate-100 pt-3">
                      <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-slate-400">
                        Valor do imóvel
                      </p>

                      <div className="mt-1.5 flex items-end justify-between gap-2">
                        <p className="truncate text-lg font-extrabold tracking-tight text-[#315f46]">
                          {typeof imovel.price === "number"
                            ? formatBRL(imovel.price)
                            : "Consulte o valor"}
                        </p>

                        <ArrowRight className="mb-1 h-4 w-4 shrink-0 text-[#71885e] transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <style>{`
          .home-scroll {
            grid-auto-columns: 86%;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -ms-overflow-style: none;
            -webkit-overflow-scrolling: touch;
          }

          .home-scroll::-webkit-scrollbar {
            display: none;
          }

          @media (min-width: 640px) {
            .home-scroll {
              grid-auto-columns: calc((100% - 1rem) / 2);
            }
          }

          @media (min-width: 1024px) {
            .home-scroll {
              grid-auto-columns: calc((100% - 3rem) / 4);
            }
          }
        `}</style>
      </div>
    </section>
  );
}