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

  const imoveis = await prisma.imovel.findMany({
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
      photos: {
        select: { id: true, url: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const bairros = Array.from(
    new Set(imoveis.map((i) => (i.neighborhood ?? "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  const cidades = Array.from(
    new Set(imoveis.map((i) => (i.city ?? "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  const tiposDisponiveis = Array.from(
    new Set(imoveis.map((i) => (i.tipo ?? "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  const tiposParaSelect =
    tiposDisponiveis.length > 0 ? tiposDisponiveis : TIPOS_FIXOS;

  const purposeNormalized = purposeSelecionado
    ? purposeSelecionado.toLowerCase()
    : "";

  // ✅ ACRÉSCIMO: normaliza o q
  const qNormalized = qSelecionado ? qSelecionado.toLowerCase() : "";

  const imoveisFiltrados = imoveis.filter((i) => {
    const b = (i.neighborhood ?? "").trim().toLowerCase();
    const c = (i.city ?? "").trim().toLowerCase();
    const title = (i.title ?? "").trim().toLowerCase();
    const slug = (i.slug ?? "").trim().toLowerCase();

    const t = (i.tipo ?? "").trim().toLowerCase();
    const p = ((i as any).purpose ?? "").trim().toLowerCase();

    const okBairro = bairroSelecionado
      ? b === bairroSelecionado.toLowerCase()
      : true;

    const okCidade = cidadeSelecionada
      ? c === cidadeSelecionada.toLowerCase()
      : true;

    const okTipo = tipoSelecionado
      ? t === tipoSelecionado.toLowerCase()
      : true;

    const okPurpose = purposeNormalized
      ? purposeNormalized === "todos"
        ? true
        : p === purposeNormalized
      : true;

    // ✅ ACRÉSCIMO: busca livre (q) por cidade/bairro/título/slug
    const okQ = qNormalized
      ? c.includes(qNormalized) ||
        b.includes(qNormalized) ||
        title.includes(qNormalized) ||
        slug.includes(qNormalized)
      : true;

    // ✅ ACRÉSCIMO: filtro por preço
    const price = typeof i.price === "number" ? i.price : null;

    const okMin =
      minPriceNum !== null && !Number.isNaN(minPriceNum)
        ? price !== null
          ? price >= minPriceNum
          : false
        : true;

    const okMax =
      maxPriceNum !== null && !Number.isNaN(maxPriceNum)
        ? price !== null
          ? price <= maxPriceNum
          : false
        : true;

    return okBairro && okCidade && okTipo && okPurpose && okQ && okMin && okMax;
  });

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
          {imoveisFiltrados.map((imovel) => {
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
















