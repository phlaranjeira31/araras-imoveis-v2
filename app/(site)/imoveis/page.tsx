export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";
import PriceRangeClient from "@/components/PriceRangeClient";
import { Prisma } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";

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

        // ✅ PAGINAÇÃO
        page?: string;

        // ✅ ORDENAR
        sort?: string;
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

        // ✅ PAGINAÇÃO
        page?: string;

        // ✅ ORDENAR
        sort?: string;
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

  // ✅ ORDENAR (novo)
  const sortSelecionado = (sp?.sort ?? "").toString().trim();
  const sortValue = sortSelecionado || "recentes";

  // ✅ PAGINAÇÃO (novo)
  const TAKE = 12;
  const pageRaw = (sp?.page ?? "").toString().trim();
  const pageNum = Math.max(1, Number(pageRaw || 1) || 1);
  const skip = (pageNum - 1) * TAKE;

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

  // ✅ ORDER BY TIPADO (corrige o erro do build)
  const orderBy: Prisma.ImovelOrderByWithRelationInput =
    sortValue === "menor_preco"
      ? { price: "asc" }
      : sortValue === "maior_preco"
      ? { price: "desc" }
      : { createdAt: "desc" };

  // ============================
  // ✅ PERFORMANCE: selects (bairros/cidades/tipos) via DISTINCT no banco
  // (NÃO usa "imoveis" aqui, pra não quebrar)
  // ============================
  const [bairrosRows, cidadesRows, tiposRows] = await Promise.all([
    prisma.imovel.findMany({
      where: { ativo: true },
      select: { neighborhood: true },
      distinct: ["neighborhood"],
      orderBy: { neighborhood: "asc" },
    }),
    prisma.imovel.findMany({
      where: { ativo: true },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    }),
    prisma.imovel.findMany({
      where: { ativo: true },
      select: { tipo: true },
      distinct: ["tipo"],
      orderBy: { tipo: "asc" },
    }),
  ]);

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

  // ✅ garante ativo sem risco de ser sobrescrito
  const whereFinal = { ...where, ativo: true };

  // ✅ total para paginação (novo)
  const total = await prisma.imovel.count({ where: whereFinal });
  const totalPages = Math.max(1, Math.ceil(total / TAKE));
  const currentPage = Math.min(pageNum, totalPages);

  // ============================
  // ✅ PERFORMANCE: busca só os imóveis já filtrados no DB (com paginação)
  // ============================
  const imoveisBase = await prisma.imovel.findMany({
    where: whereFinal,
    orderBy,
    take: TAKE,
    skip: (currentPage - 1) * TAKE,
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
      maxPriceSelecionado ||
      sortSelecionado
  );

  // ✅ helper de URL preservando filtros (novo)
  const makePageHref = (p: number) => {
    const params = new URLSearchParams();

    if (bairroSelecionado) params.set("bairro", bairroSelecionado);
    if (cidadeSelecionada) params.set("cidade", cidadeSelecionada);
    if (tipoSelecionado) params.set("tipo", tipoSelecionado);

    if (purposeSelecionado) params.set("purpose", purposeSelecionado);
    if (negocioSelecionado) params.set("negocio", negocioSelecionado);

    if (qSelecionado) params.set("q", qSelecionado);

    if (minPriceSelecionado) params.set("minPrice", minPriceSelecionado);
    if (maxPriceSelecionado) params.set("maxPrice", maxPriceSelecionado);

    if (sortSelecionado) params.set("sort", sortSelecionado);

    params.set("page", String(p));

    return `/imoveis?${params.toString()}`;
  };

  const pageButtons = (() => {
    // mostra: 1 ... (p-1) p (p+1) ... last
    const set = new Set<number>();
    set.add(1);
    set.add(totalPages);
    set.add(currentPage);
    set.add(currentPage - 1);
    set.add(currentPage + 1);

    const arr = Array.from(set)
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);

    return arr;
  })();

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

        {/* ✅ PAGINAÇÃO: info (novo) */}
        {total > 0 ? (
          <p className="text-sm text-neutral-500">
            Página <span className="font-semibold">{currentPage}</span> de{" "}
            <span className="font-semibold">{totalPages}</span> •{" "}
            <span className="font-semibold">{total}</span> imóveis
          </p>
        ) : null}
      </div>

      {(bairros.length > 0 ||
        cidades.length > 0 ||
        tiposParaSelect.length > 0) && (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur md:p-6">
          <form
  action="/imoveis"
  method="GET"
  className="grid grid-cols-1 gap-4 md:grid-cols-12"
>
  {purposeSelecionado ? (
    <input type="hidden" name="purpose" value={purposeSelecionado} />
  ) : null}

  {qSelecionado ? (
    <input type="hidden" name="q" value={qSelecionado} />
  ) : null}

  {negocioSelecionado ? (
    <input type="hidden" name="negocio" value={negocioSelecionado} />
  ) : null}

  <input type="hidden" name="page" value="1" />

  {/* SELECT BAIRRO */}
  <div className="md:col-span-4">
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
  <div className="md:col-span-4">
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
  <div className="md:col-span-4">
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

  {/* BLOCO PREÇO */}
  <div className="md:col-span-8">
    <label className="text-sm font-bold text-slate-900">Preço</label>

    <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <PriceRangeClient
        nameMin="minPrice"
        nameMax="maxPrice"
        defaultMin={
          minPriceNum !== null && !Number.isNaN(minPriceNum) ? minPriceNum : 0
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

  {/* BLOCO ORDENAR */}
  <div className="md:col-span-4">
    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
      <ArrowUpDown className="h-4 w-4 text-slate-600" />
      Ordenar por
    </div>

    <select
      name="sort"
      defaultValue={sortValue}
      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm"
    >
      <option value="recentes">Recentes</option>
      <option value="maior_preco">Maior preço</option>
      <option value="menor_preco">Menor preço</option>
    </select>
  </div>

  {/* BOTÕES */}
  <div className="md:col-span-12 flex flex-col gap-2 pt-2 sm:flex-row">
    <button
      className="h-12 rounded-2xl bg-primary px-5 text-sm font-extrabold text-white sm:w-auto"
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
      className="inline-flex h-12 items-center justify-center rounded-2xl border px-5 text-sm font-bold sm:w-auto"
    >
      Limpar
    </Link>
  </div>
</form>
        </div>
      )}

      {imoveisFiltrados.length === 0 ? (
        <div className="rounded-2xl border p-6 text-neutral-600">
          Nenhum imóvel encontrado com esses filtros.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imoveisFiltrados.map((imovel: any) => {
              const cover =
                (imovel.coverPhotoId
                  ? imovel.photos.find((p: any) => p.id === imovel.coverPhotoId)
                      ?.url
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

          {/* ✅ PAGINAÇÃO (novo) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Link
                href={makePageHref(Math.max(1, currentPage - 1))}
                className={`h-10 px-4 rounded-xl border inline-flex items-center text-sm font-semibold ${
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Anterior
              </Link>

              <div className="flex items-center gap-2">
                {pageButtons.map((n, idx) => {
                  const prev = pageButtons[idx - 1];
                  const hasGap = prev != null && n - prev > 1;

                  return (
                    <span key={n} className="flex items-center gap-2">
                      {hasGap ? (
                        <span className="px-1 text-neutral-400">…</span>
                      ) : null}

                      <Link
                        href={makePageHref(n)}
                        className={`h-10 min-w-10 px-3 rounded-xl border inline-flex items-center justify-center text-sm font-bold ${
                          n === currentPage
                            ? "bg-primary text-white border-primary"
                            : "hover:bg-neutral-50"
                        }`}
                      >
                        {n}
                      </Link>
                    </span>
                  );
                })}
              </div>

              <Link
                href={makePageHref(Math.min(totalPages, currentPage + 1))}
                className={`h-10 px-4 rounded-xl border inline-flex items-center text-sm font-semibold ${
                  currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Próxima
              </Link>
            </div>
          )}
        </>
      )}
    </main>
  );
}













