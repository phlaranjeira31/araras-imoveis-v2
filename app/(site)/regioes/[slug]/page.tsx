import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatBRL } from "@/lib/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const REGIOES = [
  { slug: "centro", label: "Centro", bairro: "Centro" },
  { slug: "itaipava", label: "Itaipava", bairro: "Itaipava" },
  { slug: "araras", label: "Araras", bairro: "Araras" },
  { slug: "cascatinha", label: "Cascatinha", bairro: "Cascatinha" },
  { slug: "correas", label: "Corrêas", bairro: "Corrêas" },
  { slug: "secretario", label: "Secretário", bairro: "Secretário" },
  { slug: "pedro-do-rio", label: "Pedro do Rio", bairro: "Pedro do Rio" },
  { slug: "posse", label: "Posse", bairro: "Posse" },
];


function getRegiao(slug: string) {
  return REGIOES.find((r) => r.slug === slug);
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RegiaoPage({ params }: PageProps) {
  const { slug } = await params;
  const regiao = getRegiao(slug);

  if (!regiao) return notFound();

  const imoveis = await prisma.imovel.findMany({
    where: {
    ativo: true,
    neighborhood: regiao.bairro,
    },
    orderBy: { createdAt: "desc" },
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
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const mapQuery = encodeURIComponent(`${regiao.bairro}, Petrópolis - RJ`);
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/" className="text-sm font-semibold text-primary">
            ← Voltar para a Home
          </Link>

          <h1 className="mt-4 text-3xl font-extrabold">
            Imóveis em {regiao.label}
          </h1>

          <p className="mt-2 text-slate-600">
            Veja no mapa onde fica {regiao.label} e confira os imóveis disponíveis.
          </p>
        </div>

        <Link
          href={`/imoveis?bairro=${encodeURIComponent(regiao.bairro)}`}
          className="hidden sm:inline-flex rounded-full border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Ver no catálogo
        </Link>
      </div>

      {/* MAPA */}
      <section className="rounded-3xl border bg-white overflow-hidden shadow-soft">
        <div className="p-5 md:p-6">
          <h2 className="text-lg font-bold text-slate-900">Mapa</h2>
          <p className="mt-1 text-sm text-slate-600">
            Localização aproximada de {regiao.label} em Petrópolis.
          </p>
        </div>

        <div className="relative w-full">
          <div className="aspect-[16/6] w-full">
            <iframe
              src={mapSrc}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa de ${regiao.label}`}
            />
          </div>
        </div>
      </section>

      {/* LISTA DE IMÓVEIS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-extrabold text-slate-900">Imóveis</h2>

          <Link
            href={`/imoveis?bairro=${encodeURIComponent(regiao.bairro)}`}
            className="sm:hidden inline-flex rounded-full border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Ver no catálogo
          </Link>
        </div>

        {imoveis.length === 0 ? (
          <div className="rounded-2xl border p-6 text-slate-600 bg-white">
            Nenhum imóvel encontrado em <b>{regiao.label}</b> ainda.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {imoveis.map((imovel) => {
              const cover =
                (imovel.coverPhotoId
                  ? imovel.photos.find((p) => p.id === imovel.coverPhotoId)?.url
                  : null) ||
                imovel.photos[0]?.url ||
                "/placeholder.jpg";

              return (
                <Link
                  key={imovel.id}
                  href={`/imovel/${imovel.slug}`}
                  className="block overflow-hidden rounded-2xl border bg-white hover:shadow-sm"
                >
                  <div className="relative h-56 w-full bg-slate-100">
                    <Image
                      src={cover}
                      alt={imovel.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 92vw, 380px"
                    />
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-sm font-semibold text-green-700">
                      {imovel.city}
                    </p>

                    <h3 className="text-lg font-semibold leading-snug">
                      {imovel.title}
                    </h3>

                    <p className="text-sm text-slate-600">
                      {[imovel.neighborhood, imovel.city].filter(Boolean).join(" • ")}
                    </p>

                    {typeof imovel.price === "number" && (
                      <div className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                        {formatBRL(imovel.price)}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
