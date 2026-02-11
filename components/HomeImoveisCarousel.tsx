import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import HomeImoveisCarouselBehavior from "@/components/HomeImoveisCarouselBehavior";

function formatBRL(value?: number | null) {
  if (typeof value !== "number") return "";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Pequeno helper p/ evitar imagem quebrada
function normalizeCover(url?: string | null) {
  if (!url || typeof url !== "string") return "/placeholder.jpg";
  return url;
}

export default async function HomeImoveisCarousel() {
  const imoveis = await prisma.imovel.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true,
      title: true,
      city: true,
      neighborhood: true,
      price: true,
      slug: true,
      coverPhotoId: true,
      photos: {
        select: { id: true, url: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const items = imoveis.map((imovel) => {
    const coverById = imovel.coverPhotoId
      ? imovel.photos.find((p) => p.id === imovel.coverPhotoId)?.url
      : null;

    const coverFallback = imovel.photos?.[0]?.url || "/placeholder.jpg";
    const cover = normalizeCover(coverById || coverFallback);

    return {
      id: imovel.id,
      title: imovel.title,
      city: imovel.city,
      neighborhood: imovel.neighborhood,
      price: imovel.price,
      slug: imovel.slug,
      cover,
    };
  });

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-8">
        <h2 className="text-xl font-semibold">Nenhum imóvel cadastrado</h2>
        <p className="text-slate-600 mt-2">
          Cadastre um imóvel no admin para ele aparecer aqui na home.
        </p>
        <Link
          href="/admin/imoveis"
          className="inline-flex mt-5 rounded-xl border px-4 py-2 hover:bg-slate-50"
        >
          Ir para o admin
        </Link>
      </div>
    );
  }

  return (
    <section className="relative">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-sm text-slate-500">Catálogo</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Imóveis</h2>
          <p className="text-slate-600 mt-2">
            Veja os últimos imóveis cadastrados. Use as setas para navegar.
          </p>

          {/* ✅ Ver todos no MOBILE */}
          <Link
            href="/imoveis?purpose=todos"
            className="mt-4 inline-flex sm:hidden rounded-full border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Ver todos
          </Link>
        </div>

        {/* Desktop (mantido) */}
        <Link
          href="/imoveis?purpose=todos"
          className="hidden sm:inline-flex rounded-full border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Ver todos
        </Link>
      </div>

      <div className="mt-8 relative">
        {/* Botões laterais (desktop) */}
        <button
          type="button"
          aria-label="Anterior"
          className="carousel-prev absolute -left-4 top-[110px] z-10 hidden md:flex h-11 w-11 items-center justify-center rounded-full border bg-white shadow-sm hover:bg-slate-50"
        >
          ‹
        </button>

        <button
          type="button"
          aria-label="Próximo"
          className="carousel-next absolute -right-4 top-[110px] z-10 hidden md:flex h-11 w-11 items-center justify-center rounded-full border bg-white shadow-sm hover:bg-slate-50"
        >
          ›
        </button>

        {/* comportamento */}
        <HomeImoveisCarouselBehavior autoplayMs={4500} />

        {/* CARROSSEL */}
        <div
          id="home-carousel"
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 home-scroll"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {items.map((it) => (
            <Link
              key={it.id}
              href={`/imovel/${it.slug}`}
              className="min-w-[320px] sm:min-w-[380px] md:min-w-[440px] rounded-2xl border bg-white overflow-hidden hover:shadow-sm"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="relative h-56 sm:h-64 md:h-72 w-full bg-slate-100">
                <Image
                  src={it.cover}
                  alt={it.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 440px"
                />
              </div>

              <div className="p-4 space-y-2">
                <p className="text-sm font-semibold text-green-700">
                  {it.city}
                </p>

                <h3 className="text-lg font-semibold leading-snug">
                  {it.title}
                </h3>

                <p className="text-sm text-slate-600">
                  {it.neighborhood} • {it.city}
                </p>

                {typeof it.price === "number" && (
                  <div className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                    {formatBRL(it.price)}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* esconder scrollbar */}
        <style>{`
          .home-scroll::-webkit-scrollbar { height: 0px; }
          .home-scroll { scrollbar-width: none; }
        `}</style>
      </div>
    </section>
  );
}







