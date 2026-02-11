import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { prisma } from "@/lib/prisma";

export default async function AdminImoveisPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};

  const getParam = (key: string) => {
    const v = sp?.[key];
    const raw = Array.isArray(v) ? v[0] ?? "" : v ?? "";
    return String(raw).trim();
  };

  const tipo = getParam("tipo");
  const valorMin = getParam("valorMin");
  const valorMax = getParam("valorMax");
  const proprietario = getParam("proprietario");
  const telefone = getParam("telefone");
  const condominioNome = getParam("condominioNome");
  const bairro = getParam("bairro");
  const codigo = getParam("codigo");

  const hasFilters = Boolean(
    tipo ||
      valorMin ||
      valorMax ||
      proprietario ||
      telefone ||
      condominioNome ||
      bairro ||
      codigo
  );

  const toNumber = (v: string) => {
    if (!v) return undefined;
    const n = Number(String(v).replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  };

  const min = toNumber(valorMin);
  const max = toNumber(valorMax);

  const where: any = {};

  // ✅ CORRIGIDO: removido mode (campos nullable não aceitam mode)
  if (tipo) where.tipo = { contains: tipo };

  if (bairro) where.neighborhood = { contains: bairro };

  if (codigo) where.codigo = { contains: codigo };

  if (condominioNome) where.condominioNome = { contains: condominioNome };

  if (proprietario) where.proprietarioNome = { contains: proprietario };

  if (telefone) where.proprietarioTelefone = { contains: telefone };

  if (min != null || max != null) {
    where.price = {};
    if (min != null) where.price.gte = min;
    if (max != null) where.price.lte = max;
  }

  const imoveis = await prisma.imovel.findMany({
    ...(Object.keys(where).length ? { where } : {}),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      city: true,
      neighborhood: true,
      cep: true,
      price: true,
      slug: true,
      coverPhotoId: true,
      photos: {
        select: { id: true, url: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },

      // ✅ planilha
      tipo: true,
      proprietarioNome: true,
      proprietarioTelefone: true,
      condominioNome: true,
      codigo: true,
    },
  });

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Imóveis</h1>
          <p className="text-neutral-500">Gerencie os imóveis cadastrados.</p>
        </div>

        {/* ✅ ADICIONADO: Botão Blog (sem mudar o resto) */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/blog"
            className="px-4 py-2 rounded-xl border hover:bg-neutral-50"
          >
            
          </Link>

          <Link
            href="/admin/imoveis/novo"
            className="px-4 py-2 rounded-xl bg-green-700 text-white hover:opacity-90"
          >
            + Cadastrar imóvel
          </Link>
        </div>
      </div>

      {/* ✅ FILTRO / PLANILHA */}
      <section className="rounded-2xl border p-4 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold">Filtro / Planilha de Imóveis</h2>
            <p className="text-neutral-500 text-sm">
              Filtre e visualize os imóveis em formato de planilha.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasFilters && <PrintButton />}

            <Link
              href="/admin/imoveis"
              className="px-3 py-2 rounded-xl border hover:bg-neutral-50 text-sm"
            >
              Limpar filtros
            </Link>
          </div>
        </div>

        <form method="GET" className="grid gap-3 md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-600">
              Tipo de imóvel
            </label>
            <input
              name="tipo"
              defaultValue={tipo}
              placeholder="Ex: casa, apartamento..."
              className="h-10 rounded-xl border px-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-600">
              Valor (mín.)
            </label>
            <input
              name="valorMin"
              defaultValue={valorMin}
              placeholder="Ex: 500000"
              inputMode="numeric"
              className="h-10 rounded-xl border px-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-600">
              Valor (máx.)
            </label>
            <input
              name="valorMax"
              defaultValue={valorMax}
              placeholder="Ex: 3000000"
              inputMode="numeric"
              className="h-10 rounded-xl border px-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-600">
              Nome do proprietário
            </label>
            <input
              name="proprietario"
              defaultValue={proprietario}
              placeholder="Ex: João"
              className="h-10 rounded-xl border px-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-600">
              Telefone
            </label>
            <input
              name="telefone"
              defaultValue={telefone}
              placeholder="Ex: 21 99999-9999"
              className="h-10 rounded-xl border px-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-600">
              Nome do condomínio
            </label>
            <input
              name="condominioNome"
              defaultValue={condominioNome}
              placeholder="Ex: Bela Vista"
              className="h-10 rounded-xl border px-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-600">Bairro</label>
            <input
              name="bairro"
              defaultValue={bairro}
              placeholder="Ex: Itaipava"
              className="h-10 rounded-xl border px-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-600">
              Código do imóvel
            </label>
            <input
              name="codigo"
              defaultValue={codigo}
              placeholder="Ex: AR-102"
              className="h-10 rounded-xl border px-3 text-sm"
            />
          </div>

          <div className="md:col-span-4 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-green-700 text-white hover:opacity-90 text-sm font-semibold"
            >
              Aplicar filtros
            </button>
          </div>
        </form>

        {/* ✅ a planilha só aparece quando tiver filtros */}
        {hasFilters && (
          <div className="overflow-x-auto rounded-2xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-xs font-bold uppercase text-neutral-600">
                <tr>
                  <th className="px-4 py-3 text-left">Tipo de imóvel</th>
                  <th className="px-4 py-3 text-left">Valor</th>
                  <th className="px-4 py-3 text-left">Nome do proprietário</th>
                  <th className="px-4 py-3 text-left">Telefone</th>
                  <th className="px-4 py-3 text-left">Nome do condomínio</th>
                  <th className="px-4 py-3 text-left">Bairro</th>
                  <th className="px-4 py-3 text-left">Código do imóvel</th>
                </tr>
              </thead>

              <tbody>
                {imoveis.map((imovel) => (
                  <tr key={imovel.id} className="border-t hover:bg-neutral-50">
                    <td className="px-4 py-3">{imovel.tipo ?? "—"}</td>
                    <td className="px-4 py-3">
                      {typeof imovel.price === "number"
                        ? `R$ ${imovel.price.toLocaleString("pt-BR")}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">{imovel.proprietarioNome ?? "—"}</td>
                    <td className="px-4 py-3">{imovel.proprietarioTelefone ?? "—"}</td>
                    <td className="px-4 py-3">{imovel.condominioNome ?? "—"}</td>
                    <td className="px-4 py-3">{imovel.neighborhood ?? "—"}</td>
                    <td className="px-4 py-3">{imovel.codigo ?? "—"}</td>
                  </tr>
                ))}

                {imoveis.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-neutral-500">
                      Nenhum imóvel encontrado com esses filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ✅ SEU CÓDIGO ORIGINAL (LISTA EM CARDS) - INTACTO */}
      {imoveis.length === 0 ? (
        <div className="rounded-2xl border p-6">
          <p className="text-neutral-600">Nenhum imóvel cadastrado ainda.</p>
          <Link
            href="/admin/imoveis/novo"
            className="inline-block mt-4 px-4 py-2 rounded-xl border hover:bg-neutral-50"
          >
            Cadastrar o primeiro
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {imoveis.map((imovel) => {
            const coverUrl =
              (imovel.coverPhotoId
                ? imovel.photos.find((p) => p.id === imovel.coverPhotoId)?.url
                : null) ||
              imovel.photos?.[0]?.url ||
              "/placeholder.jpg";

            const hasCover = Boolean(
              imovel.coverPhotoId &&
                imovel.photos.some((p) => p.id === imovel.coverPhotoId)
            );

            return (
              <div key={imovel.id} className="rounded-2xl border p-4 space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl}
                  alt={imovel.title}
                  className="w-full h-[220px] object-cover rounded-xl border"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{imovel.title}</h2>
                    {hasCover && (
                      <span className="text-xs rounded-full bg-green-100 text-green-700 px-2 py-1">
                        CAPA DEFINIDA
                      </span>
                    )}
                  </div>

                  <p className="text-neutral-500">
                    {imovel.neighborhood} • {imovel.city}
                  </p>

                  {imovel.cep && (
                    <p className="text-neutral-500">CEP: {imovel.cep}</p>
                  )}

                  {typeof imovel.price === "number" && (
                    <p className="font-semibold">
                      R$ {imovel.price.toLocaleString("pt-BR")}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/imoveis/${imovel.id}`}
                    className="px-3 py-2 rounded-xl border hover:bg-neutral-50"
                  >
                    Fotos / Editar
                  </Link>

                  <Link
                    href={`/imovel/${imovel.slug}`}
                    className="px-3 py-2 rounded-xl border hover:bg-neutral-50"
                    target="_blank"
                  >
                    Ver no site
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}










