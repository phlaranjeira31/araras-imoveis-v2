export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Bath,
  BedDouble,
  Building2,
  CarFront,
  House,
  MapPin,
  MapPinned,
  Ruler,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";
import PriceRangeClient from "@/components/PriceRangeClient";
import StyledSelect from "@/components/StyledSelect";

type PageProps = {
  searchParams?:
    | {
        bairro?: string;
        cidade?: string;
        tipo?: string;
        purpose?: string;
        negocio?: string;
        q?: string;
        minPrice?: string;
        maxPrice?: string;
        page?: string;
        sort?: string;
      }
    | Promise<{
        bairro?: string;
        cidade?: string;
        tipo?: string;
        purpose?: string;
        negocio?: string;
        q?: string;
        minPrice?: string;
        maxPrice?: string;
        page?: string;
        sort?: string;
      }>;
};

const TIPOS_FIXOS = [
  "Casa",
  "Casa em Condomínio",
  "Apartamento",
  "Cobertura",
  "Terreno",
  "Terreno em Condomínio",
  "Comercial",
  "Sítio",
  "Fazenda",
  "Galpão",
  "Loja",
  "Loft",
  "Apartamento Garden",
  "Studio",
];

function capitalize(text: string) {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getPurposeLabel(purpose?: string | null) {
  const normalized = String(purpose ?? "").toLowerCase();

  if (normalized === "alugar") return "Aluguel";
  if (normalized === "comprar") return "Venda";

  return null;
}

export default async function ImoveisPage({
  searchParams,
}: PageProps) {
  const sp = await Promise.resolve(searchParams);

  const bairroSelecionado = String(sp?.bairro ?? "").trim();
  const cidadeSelecionada = String(sp?.cidade ?? "").trim();
  const tipoSelecionado = String(sp?.tipo ?? "").trim();

  const negocioSelecionado = String(sp?.negocio ?? "").trim();

  const purposeSelecionado = String(
    sp?.purpose ?? negocioSelecionado ?? ""
  ).trim();

  const purposeNormalized = purposeSelecionado.toLowerCase();

  const qSelecionado = String(sp?.q ?? "").trim();
  const qNormalized = qSelecionado.toLowerCase();

  const minPriceSelecionado = String(
    sp?.minPrice ?? ""
  ).trim();

  const maxPriceSelecionado = String(
    sp?.maxPrice ?? ""
  ).trim();

  const minPriceNum = minPriceSelecionado
    ? Number(minPriceSelecionado)
    : null;

  const maxPriceNum = maxPriceSelecionado
    ? Number(maxPriceSelecionado)
    : null;

  const sortSelecionado = String(sp?.sort ?? "").trim();
  const sortValue = sortSelecionado || "recentes";

  const TAKE = 12;

  const pageRaw = String(sp?.page ?? "").trim();
  const pageNum = Math.max(1, Number(pageRaw || 1) || 1);

  /*
   * FILTROS DO BANCO
   */
  const where: any = {};

  if (bairroSelecionado) {
    where.neighborhood = {
      equals: bairroSelecionado,
      mode: "insensitive",
    };
  }

  if (cidadeSelecionada) {
    where.city = {
      equals: cidadeSelecionada,
      mode: "insensitive",
    };
  }

  if (tipoSelecionado) {
    where.tipo = {
      equals: tipoSelecionado,
      mode: "insensitive",
    };
  }

  if (
    purposeNormalized &&
    purposeNormalized !== "todos"
  ) {
    where.purpose = {
      equals: purposeNormalized,
      mode: "insensitive",
    };
  }

  if (qNormalized) {
    where.OR = [
      {
        city: {
          contains: qNormalized,
          mode: "insensitive",
        },
      },
      {
        neighborhood: {
          contains: qNormalized,
          mode: "insensitive",
        },
      },
      {
        title: {
          contains: qNormalized,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: qNormalized,
          mode: "insensitive",
        },
      },
      {
        codigo: {
          contains: qNormalized,
          mode: "insensitive",
        },
      },
    ];
  }

  if (
    minPriceNum !== null &&
    !Number.isNaN(minPriceNum)
  ) {
    where.price = {
      ...(where.price ?? {}),
      gte: minPriceNum,
    };
  }

  if (
    maxPriceNum !== null &&
    !Number.isNaN(maxPriceNum)
  ) {
    where.price = {
      ...(where.price ?? {}),
      lte: maxPriceNum,
    };
  }

  const orderBy: Prisma.ImovelOrderByWithRelationInput =
    sortValue === "menor_preco"
      ? { price: "asc" }
      : sortValue === "maior_preco"
        ? { price: "desc" }
        : { createdAt: "desc" };

  /*
   * OPÇÕES DOS FILTROS
   */
  const [bairrosRows, cidadesRows, tiposRows] =
    await Promise.all([
      prisma.imovel.findMany({
        where: {
          ativo: true,
        },
        select: {
          neighborhood: true,
        },
        distinct: ["neighborhood"],
        orderBy: {
          neighborhood: "asc",
        },
      }),

      prisma.imovel.findMany({
        where: {
          ativo: true,
        },
        select: {
          city: true,
        },
        distinct: ["city"],
        orderBy: {
          city: "asc",
        },
      }),

      prisma.imovel.findMany({
        where: {
          ativo: true,
        },
        select: {
          tipo: true,
        },
        distinct: ["tipo"],
        orderBy: {
          tipo: "asc",
        },
      }),
    ]);

  const bairros = bairrosRows
    .map((item) =>
      String(item.neighborhood ?? "").trim()
    )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  const cidades = cidadesRows
    .map((item) => String(item.city ?? "").trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  const tiposDisponiveis = tiposRows
    .map((item) => String(item.tipo ?? "").trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  const tiposParaSelect =
    tiposDisponiveis.length > 0
      ? tiposDisponiveis
      : TIPOS_FIXOS;

  const whereFinal = {
    ...where,
    ativo: true,
  };

  /*
   * PAGINAÇÃO
   */
  const total = await prisma.imovel.count({
    where: whereFinal,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(total / TAKE)
  );

  const currentPage = Math.min(
    pageNum,
    totalPages
  );

  /*
   * IMÓVEIS
   */
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
      priceRent: true,
      slug: true,
      coverPhotoId: true,
      tipo: true,
      purpose: true,

      quartos: true,
      banheiros: true,
      vagas: true,
      areaConstruida: true,
      areaTerreno: true,
    },
  });

  /*
   * CAPAS DOS IMÓVEIS
   */
  const coverIds = imoveisBase
    .map((imovel) => imovel.coverPhotoId)
    .filter(
      (id): id is string => Boolean(id)
    );

  const coverPhotos =
    coverIds.length > 0
      ? await prisma.photo.findMany({
          where: {
            id: {
              in: coverIds,
            },
          },
          select: {
            id: true,
            url: true,
          },
        })
      : [];

  const coverMap = new Map(
    coverPhotos.map((photo) => [
      photo.id,
      photo.url,
    ])
  );

  const imoveis = imoveisBase.map((imovel) => ({
    ...imovel,

    cover:
      (imovel.coverPhotoId
        ? coverMap.get(imovel.coverPhotoId)
        : null) || "/placeholder.jpg",
  }));

  const temFiltro = Boolean(
    bairroSelecionado ||
      cidadeSelecionada ||
      tipoSelecionado ||
      (purposeSelecionado &&
        purposeNormalized !== "todos") ||
      qSelecionado ||
      minPriceSelecionado ||
      maxPriceSelecionado ||
      sortSelecionado
  );

  /*
   * URL DA PAGINAÇÃO
   */
  const makePageHref = (page: number) => {
    const params = new URLSearchParams();

    if (bairroSelecionado) {
      params.set("bairro", bairroSelecionado);
    }

    if (cidadeSelecionada) {
      params.set("cidade", cidadeSelecionada);
    }

    if (tipoSelecionado) {
      params.set("tipo", tipoSelecionado);
    }

    if (
      purposeSelecionado &&
      purposeNormalized !== "todos"
    ) {
      params.set(
        "purpose",
        purposeSelecionado
      );
    }

    if (qSelecionado) {
      params.set("q", qSelecionado);
    }

    if (minPriceSelecionado) {
      params.set(
        "minPrice",
        minPriceSelecionado
      );
    }

    if (maxPriceSelecionado) {
      params.set(
        "maxPrice",
        maxPriceSelecionado
      );
    }

    if (sortSelecionado) {
      params.set("sort", sortSelecionado);
    }

    params.set("page", String(page));

    return `/imoveis?${params.toString()}`;
  };

  const pageButtons = (() => {
    const pages = new Set<number>();

    pages.add(1);
    pages.add(totalPages);
    pages.add(currentPage);
    pages.add(currentPage - 1);
    pages.add(currentPage + 1);

    return Array.from(pages)
      .filter(
        (page) =>
          page >= 1 && page <= totalPages
      )
      .sort((a, b) => a - b);
  })();

  const clearHref = "/imoveis";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7faf8_0%,#eef6f1_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* APRESENTAÇÃO E FILTROS INTEGRADOS */}
        <section className="relative z-30 overflow-visible rounded-[26px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
          {/* CABEÇALHO COMPACTO */}
          <div className="relative overflow-hidden rounded-t-[26px] border-b border-slate-100 bg-[linear-gradient(135deg,#ffffff_0%,#f7faf5_100%)] px-5 py-4 sm:px-6 sm:py-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#90a982]/10 blur-3xl"
            />

            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* TÍTULO */}
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#668052]">
                  <span className="h-px w-7 bg-[#95aa84]" />
                  Catálogo Araras Imóveis
                </div>

                <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  Encontre seu imóvel ideal
                </h1>

                <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                  Imóveis selecionados em Petrópolis,
                  Itaipava, Araras e nas principais
                  regiões da serra.
                </p>
              </div>

              {/* CONTADORES */}
              <div className="flex items-center gap-2">
                <div className="min-w-[108px] rounded-xl border border-[#dfe8da] bg-[#f3f8ef] px-3 py-2">
                  <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#71825f]">
                    Resultados
                  </p>

                  <p className="mt-0.5 text-sm font-extrabold text-[#365f4d]">
                    {total}{" "}
                    {total === 1
                      ? "imóvel"
                      : "imóveis"}
                  </p>
                </div>

                <div className="min-w-[82px] rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Página
                  </p>

                  <p className="mt-0.5 text-sm font-extrabold text-slate-900">
                    {currentPage} de {totalPages}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CABEÇALHO DOS FILTROS */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-[#fbfcfa] px-4 py-2.5 sm:px-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e7f0e2] text-[#527443]">
                <SlidersHorizontal className="h-4 w-4" />
              </span>

              <div>
                <h2 className="text-xs font-extrabold text-slate-900">
                  Filtre sua busca
                </h2>

                <p className="hidden text-[10px] text-slate-500 sm:block">
                  Refine os imóveis por localização,
                  tipo e valor.
                </p>
              </div>
            </div>

            {temFiltro ? (
              <Link
                href={clearHref}
                className="shrink-0 text-[11px] font-bold text-[#527443] transition hover:text-[#365f4d]"
              >
                Limpar todos
              </Link>
            ) : null}
          </div>

          {/* FORMULÁRIO */}
          <form
            action="/imoveis"
            method="GET"
            className="grid grid-cols-1 gap-3 p-4 md:grid-cols-12 md:p-5"
          >
            <input
              type="hidden"
              name="page"
              value="1"
            />

            {/* PALAVRA-CHAVE */}
            <div className="md:col-span-5">
              <label
                htmlFor="q"
                className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-600"
              >
                Palavra-chave
              </label>

              <div className="relative mt-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#789064]" />

                <input
                  id="q"
                  name="q"
                  type="search"
                  defaultValue={qSelecionado}
                  placeholder="Cidade, bairro, título ou código"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-[#a4b498] focus:border-[#7f9970] focus:ring-4 focus:ring-[#7f9970]/10"
                />
              </div>
            </div>

            {/* FINALIDADE */}
            <div className="md:col-span-3">
              <label className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                Finalidade
              </label>

              <div className="mt-1">
                <StyledSelect
                  name="purpose"
                  defaultValue={
                    purposeNormalized === "todos"
                      ? ""
                      : purposeNormalized
                  }
                  ariaLabel="Selecionar finalidade"
                  icon={
                    <House className="h-4 w-4" />
                  }
                  options={[
                    {
                      value: "",
                      label:
                        "Comprar ou alugar",
                    },
                    {
                      value: "comprar",
                      label: "Comprar",
                    },
                    {
                      value: "alugar",
                      label: "Alugar",
                    },
                  ]}
                />
              </div>
            </div>

            {/* ORDENAÇÃO */}
            <div className="md:col-span-4">
              <label className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                Ordenar
              </label>

              <div className="mt-1">
                <StyledSelect
                  name="sort"
                  defaultValue={sortValue}
                  ariaLabel="Ordenar imóveis"
                  icon={
                    <ArrowUpDown className="h-4 w-4" />
                  }
                  options={[
                    {
                      value: "recentes",
                      label: "Mais recentes",
                    },
                    {
                      value: "maior_preco",
                      label: "Maior preço",
                    },
                    {
                      value: "menor_preco",
                      label: "Menor preço",
                    },
                  ]}
                />
              </div>
            </div>

            {/* BAIRRO */}
            <div className="md:col-span-4">
              <label className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                Bairro
              </label>

              <div className="mt-1">
                <StyledSelect
                  name="bairro"
                  defaultValue={
                    bairroSelecionado
                  }
                  ariaLabel="Selecionar bairro"
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                  options={[
                    {
                      value: "",
                      label:
                        "Todos os bairros",
                    },
                    ...bairros.map(
                      (bairro) => ({
                        value: bairro,
                        label:
                          capitalize(bairro),
                      })
                    ),
                  ]}
                />
              </div>
            </div>

            {/* CIDADE */}
            <div className="md:col-span-4">
              <label className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                Cidade
              </label>

              <div className="mt-1">
                <StyledSelect
                  name="cidade"
                  defaultValue={
                    cidadeSelecionada
                  }
                  ariaLabel="Selecionar cidade"
                  icon={
                    <MapPinned className="h-4 w-4" />
                  }
                  options={[
                    {
                      value: "",
                      label:
                        "Todas as cidades",
                    },
                    ...cidades.map(
                      (cidade) => ({
                        value: cidade,
                        label:
                          capitalize(cidade),
                      })
                    ),
                  ]}
                />
              </div>
            </div>

            {/* TIPO */}
            <div className="md:col-span-4">
              <label className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                Tipo de imóvel
              </label>

              <div className="mt-1">
                <StyledSelect
                  name="tipo"
                  defaultValue={
                    tipoSelecionado
                  }
                  ariaLabel="Selecionar tipo de imóvel"
                  icon={
                    <Building2 className="h-4 w-4" />
                  }
                  options={[
                    {
                      value: "",
                      label:
                        "Todos os tipos",
                    },
                    ...tiposParaSelect.map(
                      (tipo) => ({
                        value: tipo,
                        label:
                          capitalize(tipo),
                      })
                    ),
                  ]}
                />
              </div>
            </div>

            {/* PREÇO */}
            <div className="md:col-span-8">
              <label className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                Faixa de preço
              </label>

              <div className="mt-1 rounded-xl border border-slate-200 bg-[#fbfcfb] px-4 py-2">
                <PriceRangeClient
                  nameMin="minPrice"
                  nameMax="maxPrice"
                  defaultMin={
                    minPriceNum !== null &&
                    !Number.isNaN(
                      minPriceNum
                    )
                      ? minPriceNum
                      : 0
                  }
                  defaultMax={
                    maxPriceNum !== null &&
                    !Number.isNaN(
                      maxPriceNum
                    )
                      ? maxPriceNum
                      : 25000000
                  }
                  minBound={0}
                  maxBound={25000000}
                  step={50000}
                />
              </div>
            </div>

            {/* BOTÕES */}
            <div className="flex flex-col justify-end gap-2 sm:flex-row md:col-span-4">
              <button
                type="submit"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#365f4d] px-4 text-sm font-extrabold text-white shadow-[0_7px_18px_rgba(54,95,77,0.18)] transition hover:-translate-y-0.5 hover:bg-[#294c3c]"
              >
                <Search className="h-4 w-4" />
                Aplicar filtros
              </button>

              <Link
                href={clearHref}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Limpar
              </Link>
            </div>
          </form>
        </section>

        {/* RESULTADOS */}
        <section className="mt-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#668052]">
                <Sparkles className="h-4 w-4" />
                Resultados da busca
              </div>

              <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
                Imóveis disponíveis
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              Exibindo página{" "}
              <span className="font-bold text-slate-800">
                {currentPage}
              </span>{" "}
              de{" "}
              <span className="font-bold text-slate-800">
                {totalPages}
              </span>
            </p>
          </div>

          {imoveis.length === 0 ? (
            <div className="rounded-[26px] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#527043]">
                <Search className="h-6 w-6" />
              </span>

              <h3 className="mt-4 text-xl font-extrabold text-slate-950">
                Nenhum imóvel encontrado
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Não encontramos imóveis com os
                filtros selecionados. Tente alterar
                a localização, o tipo ou a faixa de
                preço.
              </p>

              <Link
                href="/imoveis"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#365f4d] px-5 text-sm font-bold text-white transition hover:bg-[#294c3c]"
              >
                Ver todos os imóveis
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {imoveis.map((imovel) => {
                const purposeLabel =
                  getPurposeLabel(
                    imovel.purpose
                  );

                const isRent =
                  String(
                    imovel.purpose ?? ""
                  ).toLowerCase() ===
                  "alugar";

                const displayPrice =
                  isRent &&
                  typeof imovel.priceRent ===
                    "number"
                    ? imovel.priceRent
                    : imovel.price;

                const area =
                  typeof imovel.areaConstruida ===
                    "number" &&
                  imovel.areaConstruida > 0
                    ? imovel.areaConstruida
                    : typeof imovel.areaTerreno ===
                          "number" &&
                        imovel.areaTerreno > 0
                      ? imovel.areaTerreno
                      : null;

                const possuiCaracteristicas =
                  (typeof imovel.quartos ===
                    "number" &&
                    imovel.quartos > 0) ||
                  (typeof imovel.banheiros ===
                    "number" &&
                    imovel.banheiros > 0) ||
                  (typeof imovel.vagas ===
                    "number" &&
                    imovel.vagas > 0) ||
                  area !== null;

                return (
                  <Link
                    key={imovel.id}
                    href={`/imovel/${imovel.slug}`}
                    className="group block h-full"
                  >
                    <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_9px_28px_rgba(15,23,42,0.055)] transition duration-500 group-hover:-translate-y-1 group-hover:border-[#9fb391] group-hover:shadow-[0_20px_42px_rgba(15,23,42,0.12)]">
                      {/* IMAGEM */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={imovel.cover}
                          alt={imovel.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-[1.045]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                          {purposeLabel && (
                            <span className="rounded-full border border-white/20 bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#365f4d] shadow-sm">
                              {purposeLabel}
                            </span>
                          )}

                          {imovel.tipo && (
                            <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                              {imovel.tipo}
                            </span>
                          )}
                        </div>

                        <span className="absolute bottom-4 left-4 inline-flex max-w-[85%] items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3 py-2 text-xs font-bold text-white backdrop-blur-md">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />

                          <span className="truncate">
                            {imovel.neighborhood ||
                              imovel.city ||
                              "Petrópolis"}
                          </span>
                        </span>
                      </div>

                      {/* CONTEÚDO */}
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#71875f]">
                          {imovel.city ||
                            "Petrópolis"}
                        </p>

                        <h3
                          className="mt-2 min-h-[52px] overflow-hidden text-lg font-extrabold leading-[1.4] text-slate-950 transition group-hover:text-[#365f4d]"
                          style={{
                            display:
                              "-webkit-box",
                            WebkitBoxOrient:
                              "vertical",
                            WebkitLineClamp: 2,
                          }}
                        >
                          {imovel.title}
                        </h3>

                        <p className="mt-2 truncate text-sm text-slate-500">
                          {[
                            imovel.neighborhood,
                            imovel.city,
                          ]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>

                        {/* CARACTERÍSTICAS */}
                        <div className="mt-4 flex min-h-[42px] items-center border-y border-slate-100 py-3">
                          {possuiCaracteristicas ? (
                            <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                              {typeof imovel.quartos ===
                                "number" &&
                                imovel.quartos >
                                  0 && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <BedDouble className="h-4 w-4 text-[#71885e]" />
                                    {
                                      imovel.quartos
                                    }
                                  </span>
                                )}

                              {typeof imovel.banheiros ===
                                "number" &&
                                imovel.banheiros >
                                  0 && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <Bath className="h-4 w-4 text-[#71885e]" />
                                    {
                                      imovel.banheiros
                                    }
                                  </span>
                                )}

                              {typeof imovel.vagas ===
                                "number" &&
                                imovel.vagas >
                                  0 && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <CarFront className="h-4 w-4 text-[#71885e]" />
                                    {
                                      imovel.vagas
                                    }
                                  </span>
                                )}

                              {area !== null && (
                                <span className="inline-flex items-center gap-1.5">
                                  <Ruler className="h-4 w-4 text-[#71885e]" />
                                  {area.toLocaleString(
                                    "pt-BR"
                                  )}{" "}
                                  m²
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-slate-400">
                              Consulte os detalhes
                              do imóvel
                            </span>
                          )}
                        </div>

                        {/* PREÇO */}
                        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-slate-400">
                              {isRent
                                ? "Aluguel mensal"
                                : "Valor do imóvel"}
                            </p>

                            <p className="mt-1 truncate text-xl font-extrabold tracking-tight text-[#315f46]">
                              {typeof displayPrice ===
                              "number"
                                ? formatBRL(
                                    displayPrice
                                  )
                                : "Consulte o valor"}
                            </p>
                          </div>

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#527043] transition duration-300 group-hover:bg-[#365f4d] group-hover:text-white">
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <nav
            aria-label="Paginação dos imóveis"
            className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row"
          >
            <Link
              href={makePageHref(
                Math.max(
                  1,
                  currentPage - 1
                )
              )}
              aria-disabled={
                currentPage === 1
              }
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 ${
                currentPage === 1
                  ? "pointer-events-none opacity-40"
                  : ""
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {pageButtons.map(
                (page, index) => {
                  const previousPage =
                    pageButtons[index - 1];

                  const hasGap =
                    previousPage !==
                      undefined &&
                    page - previousPage > 1;

                  return (
                    <div
                      key={page}
                      className="flex items-center gap-2"
                    >
                      {hasGap && (
                        <span className="px-1 text-slate-400">
                          …
                        </span>
                      )}

                      <Link
                        href={makePageHref(
                          page
                        )}
                        aria-current={
                          page ===
                          currentPage
                            ? "page"
                            : undefined
                        }
                        className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-extrabold transition ${
                          page ===
                          currentPage
                            ? "border-[#365f4d] bg-[#365f4d] text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </Link>
                    </div>
                  );
                }
              )}
            </div>

            <Link
              href={makePageHref(
                Math.min(
                  totalPages,
                  currentPage + 1
                )
              )}
              aria-disabled={
                currentPage === totalPages
              }
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-40"
                  : ""
              }`}
            >
              Próxima
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        )}
      </div>
    </main>
  );
}