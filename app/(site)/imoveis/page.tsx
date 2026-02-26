export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatBRL } from "@/lib/format";
import PriceRangeClient from "@/components/PriceRangeClient";


type PageProps = {
  searchParams?:
    | {
        bairro?: string;
        cidade?: string;
        tipo?: string;
        purpose?: string;

        // ✅ ACRÉSCIMO (para funcionar com a HomeSearchBar nova)
        q?: string;
        negocio?: string;

        // ✅ ACRÉSCIMO: preço
        minPrice?: string;
        maxPrice?: string;
      }
    | Promise<{
        bairro?: string;
        cidade?: string;
        tipo?: string;
        purpose?: string;

        // ✅ ACRÉSCIMO (para funcionar com a HomeSearchBar nova)
        q?: string;
        negocio?: string;

        // ✅ ACRÉSCIMO: preço
        minPrice?: string;
        maxPrice?: string;
      }>;
};

const TIPOS_FIXOS = ["Casa", "Apartamento", "Cobertura", "Terreno", "Comercial"];

// ✅ ADICIONADO: helper SOMENTE para exibição
function capitalize(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default async function ImoveisPage({ searchParams }: PageProps) {
  const sp = await Promise.resolve(searchParams);

  const bairroSelecionado = (sp?.bairro ?? "").trim();
  const cidadeSelecionada = (sp?.cidade ?? "").trim();
  const tipoSelecionado = (sp?.tipo ?? "").trim();

  // ✅ ACRÉSCIMO: aceita "negocio" (da HomeSearchBar) como fallback do "purpose"
  const negocioSelecionado = (sp?.negocio ?? "").trim();
  const purposeSelecionado = (sp?.purpose ?? negocioSelecionado ?? "").trim();

  // ✅ ACRÉSCIMO: texto livre da barra (q)
  const qSelecionado = (sp?.q ?? "").trim();

  // ✅ ACRÉSCIMO: preço (min/max) vindo da URL
  const minPriceSelecionado = (sp?.minPrice ?? "").trim();
  const maxPriceSelecionado = (sp?.maxPrice ?? "").trim();

  const minPriceNum = minPriceSelecionado ? Number(minPriceSelecionado) : null;
  const maxPriceNum = maxPriceSelecionado ? Number(maxPriceSelecionado) : null;

  const purposeNormalized = purposeSelecionado
    ? purposeSelecionado.toLowerCase()
    : "";

  const qNormalized = qSelecionado ? qSelecionado.toLowerCase() : "";

  // ============================
  // ✅ PERFORMANCE: filtros no BANCO (Prisma)
  // ============================
  const where: any = {};

  if (bairroSelecionado) {
    where.neighborhood = { equals: bairroSelecionado, mode: "insensitive" };
  }

  if (cidadeSelecionada) {
    where.city = { equals: cidadeSelecionada, mode: "insensitive" };
  }

  if (tipoSelecionado) {
    where.tipo = { equals: tipoSelecionado, mode: "insensitive" };
  }

  if (purposeNormalized && purposeNormalized !== "todos") {
    where.purpose = { equals: purposeNormalized, mode: "insensitive" };
  }

  if (qNormalized) {
    where.OR = [
      { city: { contains: qNormalized, mode: "insensitive" } },
      { neighborhood: { contains: qNormalized, mode: "insensitive" } },
      { title: { contains: qNormalized, mode: "insensitive" } },
      { slug: { contains: qNormalized, mode: "insensitive" } },
    ];
  }

  // preço
  if (minPriceNum !== null && !Number.isNaN(minPriceNum)) {
    where.price = { ...(where.price ?? {}), gte: minPriceNum };
  }
  if (maxPriceNum !== null && !Number.isNaN(maxPriceNum)) {
    where.price = { ...(where.price ?? {}), lte: maxPriceNum };
  }

  // ============================
  // ✅ PERFORMANCE: selects (bairros/cidades/tipos) via DISTINCT no banco
  // ============================
  const bairrosRows = await prisma.imovel.findMany({
    select: { neighborhood: true },
    distinct: ["neighborhood"],
    orderBy: { neighborhood: "asc" },
  });

  const cidadesRows = await prisma.imovel.findMany({
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });

  const tiposRows = await prisma.imovel.findMany({
    select: { tipo: true },
    distinct: ["tipo"],
    orderBy: { tipo: "asc" },
  });

  const bairros = bairrosRows
    .map((r: any) => (r.neighborhood ?? "").trim())
    .filter(Boolean)
    .sort((a: string, b: string) => a.localeCompare(b, "pt-BR"));

  const cidades = cidadesRows
    .map((r: any) => (r.city ?? "").trim())
    .filter(Boolean)
    .sort((a: string, b: string) => a.localeCompare(b, "pt-BR"));

  const tiposDisponiveis = tiposRows
    .map((r: any) => (r.tipo ?? "").trim())
    .filter(Boolean)
    .sort((a: string, b: string) => a.localeCompare(b, "pt-BR"));

  const tiposParaSelect =
    tiposDisponiveis.length > 0 ? tiposDisponiveis : TIPOS_FIXOS;

  // ============================
  // ✅ PERFORMANCE: busca só os imóveis já filtrados no DB
  // ============================
  const imoveisBase = await prisma.imovel.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      city: true,
      neighborhood: true,
      price: true,
      slug: true,
      coverPhotoId: true,
      tipo: true,
      purpose: true,
    },
  });

  // pega só os ids das capas
  const coverIds = imoveisBase
    .map((i: any) => i.coverPhotoId)
    .filter(Boolean) as string[];

  const coverPhotos = coverIds.length
    ? await prisma.photo.findMany({
        where: { id: { in: coverIds } },
        select: { id: true, url: true },
      })
    : [];

  const coverMap = new Map(coverPhotos.map((p: any) => [p.id, p.url]));

  // devolve no MESMO formato que você já usa: photos: [{id,url}]
  const imoveis = imoveisBase.map((im: any) => {
    const url = im.coverPhotoId ? coverMap.get(im.coverPhotoId) ?? "" : "";
    return {
      ...im,
      photos: im.coverPhotoId && url ? [{ id: im.coverPhotoId, url }] : [],
    };
  });

  // mantém a mesma variável final, agora já vem do banco
  const imoveisFiltrados = imoveis;

  const temFiltro = Boolean(
    bairroSelecionado ||
      cidadeSelecionada ||
      tipoSelecionado ||
      purposeSelecionado ||
      qSelecionado ||
      minPriceSelecionado ||
      maxPriceSelecionado
  );

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Imóveis</h1>
        <p className="text-neutral-500">
          Pesquise por bairro/cidade e filtre por finalidade.
        </p>

        {/* ✅ ACRÉSCIMO: mostra o termo pesquisado (sem mexer no layout) */}
        {qSelecionado ? (
          <p className="text-sm text-slate-600">
            Buscando por: <span className="font-semibold">{qSelecionado}</span>
            {temFiltro ? null : "."}
          </p>
        ) : null}
      </div>

      {(bairros.length > 0 || cidades.length > 0 || tiposParaSelect.length > 0) && (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur md:p-6">
          <form
            action="/imoveis"
            method="GET"
            className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
          >
            {purposeSelecionado ? (
              <input type="hidden" name="purpose" value={purposeSelecionado} />
            ) : null}

            {/* ✅ ACRÉSCIMO: preserva q quando você clicar em Aplicar */}
            {qSelecionado ? (
              <input type="hidden" name="q" value={qSelecionado} />
            ) : null}

            {/* ✅ ACRÉSCIMO: preserva negocio caso venha da HomeSearchBar */}
            {negocioSelecionado ? (
              <input type="hidden" name="negocio" value={negocioSelecionado} />
            ) : null}

            {/* SELECT BAIRRO */}
            <div>
              <label className="text-sm font-bold text-slate-900">
                Filtrar por bairro
              </label>
              <select
                name="bairro"
                defaultValue={bairroSelecionado}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm"
              >
                <option value="">Todos</option>
                {bairros.map((b) => (
                  <option key={b} value={b}>
                    {capitalize(b)}
                  </option>
                ))}
              </select>
            </div>

            {/* SELECT CIDADE */}
            <div>
              <label className="text-sm font-bold text-slate-900">
                Filtrar por cidade
              </label>
              <select
                name="cidade"
                defaultValue={cidadeSelecionada}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm"
              >
                <option value="">Todas</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>
                    {capitalize(c)}
                  </option>
                ))}
              </select>
            </div>

            {/* SELECT TIPO */}
            <div>
              <label className="text-sm font-bold text-slate-900">
                Filtrar por tipo
              </label>
              <select
                name="tipo"
                defaultValue={tipoSelecionado}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm"
              >
                <option value="">Todos</option>
                {tiposParaSelect.map((t) => (
                  <option key={t} value={t}>
                    {capitalize(t)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                className="h-12 rounded-2xl bg-primary px-5 text-sm font-extrabold text-white"
                type="submit"
              >
                Aplicar
              </button>

              <Link
                href={
                  purposeSelecionado
                    ? `/imoveis?purpose=${encodeURIComponent(purposeSelecionado)}`
                    : "/imoveis"
                }
                className="h-12 rounded-2xl border px-5 text-sm font-bold inline-flex items-center"
              >
                Limpar
              </Link>
            </div>

            {/* ✅ ACRÉSCIMO: PREÇO (ESTILO SLIDER) */}
            <div className="md:col-span-4">
              <div className="flex justify-center">
                <div className="w-full max-w-3xl">
                  <label className="text-sm font-bold text-slate-900">Preço</label>

                  <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <PriceRangeClient
                      nameMin="minPrice"
                      nameMax="maxPrice"
                      defaultMin={
                        minPriceNum !== null && !Number.isNaN(minPriceNum)
                          ? minPriceNum
                          : 0
                      }
                      defaultMax={
                        maxPriceNum !== null && !Number.isNaN(maxPriceNum)
                          ? maxPriceNum
                          : 25000000
                      }
                      minBound={0}
                      maxBound={25000000}
                      step={50000}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {imoveisFiltrados.length === 0 ? (
        <div className="rounded-2xl border p-6 text-neutral-600">
          Nenhum imóvel encontrado com esses filtros.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {imoveisFiltrados.map((imovel: any) => {
            const cover =
              (imovel.coverPhotoId
                ? imovel.photos.find((p: any) => p.id === imovel.coverPhotoId)?.url
                : null) ||
              imovel.photos[0]?.url ||
              "/placeholder.jpg";

            return (
              <Link
                key={imovel.id}
                href={`/imovel/${imovel.slug}`}
                className="block rounded-2xl border overflow-hidden hover:shadow-sm"
              >
                <img
                  src={cover}
                  alt={imovel.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-4 space-y-2">
                  <p className="text-sm text-green-700 font-medium">
                    {imovel.city}
                  </p>

                  <h3 className="text-lg font-semibold">{imovel.title}</h3>

                  <p className="text-sm text-neutral-500">
                    {imovel.neighborhood} • {imovel.city}
                    {imovel.tipo ? ` • ${imovel.tipo}` : ""}
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
    </main>
  );
}
















