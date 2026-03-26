import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  Plus,
  Image,
  Pencil,
  Printer,
  ExternalLink,
  Home,
  DollarSign,
  User,
  Phone,
  Building,
  MapPin,
  Hash,
  FileText,
  Briefcase,
} from "lucide-react";
import ToggleAtivoButton from "./ToggleAtivoButton";
import FeaturedToggle from "@/components/admin/FeaturedToggle";

export default async function AdminImoveisPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};

  async function salvarObservacao(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "").trim();
    const observacoesInternas = String(
      formData.get("observacoesInternas") ?? ""
    ).trim();

    if (!id) return;

    await prisma.imovel.update({
      where: { id },
      data: { observacoesInternas },
    });

    revalidatePath("/admin/imoveis");
  }

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
  const endereco = getParam("endereco");
  const corretora = getParam("corretora");

  const hasFilters = Boolean(
    tipo ||
      valorMin ||
      valorMax ||
      proprietario ||
      telefone ||
      condominioNome ||
      bairro ||
      codigo ||
      endereco ||
      corretora
  );

  const toNumber = (v: string) => {
    if (!v) return undefined;
    const n = Number(String(v).replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  };

  const min = toNumber(valorMin);
  const max = toNumber(valorMax);

  const where: any = {};

  if (tipo) where.tipo = { contains: tipo };
  if (bairro) where.neighborhood = { contains: bairro };
  if (codigo) where.codigo = { contains: codigo };
  if (condominioNome) where.condominioNome = { contains: condominioNome };
  if (proprietario) where.proprietarioNome = { contains: proprietario };
  if (telefone) where.proprietarioTelefone = { contains: telefone };
  if (endereco) where.endereco = { contains: endereco };
  if (corretora) {
    where.corretoraCaptacao = { equals: corretora, mode: "insensitive" };
  }

  if (min != null || max != null) {
    where.price = {};
    if (min != null) where.price.gte = min;
    if (max != null) where.price.lte = max;
  }

  const TAKE = 50;

  const imoveisBase = await prisma.imovel.findMany({
    ...(Object.keys(where).length ? { where } : {}),
    orderBy: { createdAt: "desc" },
    take: TAKE,
    select: {
      id: true,
      title: true,
      city: true,
      neighborhood: true,
      cep: true,
      price: true,
      featured: true,
      slug: true,
      coverPhotoId: true,
      ativo: true,
      createdAt: true,
      tipo: true,
      proprietarioNome: true,
      proprietarioTelefone: true,
      condominioNome: true,
      codigo: true,
      endereco: true,
      corretoraCaptacao: true,
      observacoesInternas: true,
    },
  });

  const imovelIds = imoveisBase.map((i) => i.id);

  const photos = imovelIds.length
    ? await prisma.photo.findMany({
        where: { imovelId: { in: imovelIds } },
        select: { id: true, url: true, imovelId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const coverUrlByCoverId = new Map<string, string>();
  for (const p of photos) coverUrlByCoverId.set(p.id, p.url);

  const firstPhotoByImovelId = new Map<string, { id: string; url: string }>();
  for (const p of photos) {
    if (!firstPhotoByImovelId.has(p.imovelId)) {
      firstPhotoByImovelId.set(p.imovelId, { id: p.id, url: p.url });
    }
  }

  const imoveis = imoveisBase.map((im) => {
    const coverUrl = im.coverPhotoId
      ? coverUrlByCoverId.get(im.coverPhotoId) ?? ""
      : "";

    const first = firstPhotoByImovelId.get(im.id);

    const finalCover =
      (coverUrl && im.coverPhotoId ? coverUrl : "") ||
      first?.url ||
      "/placeholder.jpg";

    const hasCover = Boolean(
      im.coverPhotoId && coverUrlByCoverId.has(im.coverPhotoId)
    );

    const minimalPhotos =
      im.coverPhotoId && coverUrl
        ? [{ id: im.coverPhotoId, url: coverUrl }]
        : first
          ? [{ id: first.id, url: first.url }]
          : [];

    return {
      ...im,
      coverUrl: finalCover,
      hasCover,
      photos: minimalPhotos,
    };
  });

  const imoveisSafe = JSON.parse(JSON.stringify(imoveis));

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Imóveis</h1>
          <p className="text-neutral-500">Gerencie os imóveis cadastrados.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/imoveis/novo"
            className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700/30"
          >
            <Plus className="h-4 w-4" />
            Cadastrar Imóvel
          </Link>
        </div>
      </div>

      <section className="rounded-3xl border bg-white/80 backdrop-blur-sm p-6 space-y-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-neutral-900">
              <Home className="h-5 w-5 text-green-700" />
              Filtro / Planilha de Imóveis
            </h2>
            <p className="text-neutral-500 text-sm">
              Filtre e visualize os imóveis em formato de planilha.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasFilters && <PrintButton />}

            <Link
              href="/admin/imoveis"
              className="px-4 py-2 rounded-full border hover:bg-neutral-50 text-sm"
            >
              Limpar Filtros
            </Link>
          </div>
        </div>

        <form
          method="GET"
          className="grid grid-cols-1 gap-5 md:grid-cols-4"
        >
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600">
              Tipo de Imóvel
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                name="tipo"
                defaultValue={tipo}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="Ex: casa, apartamento..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600">
              Valor (mín.)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                name="valorMin"
                defaultValue={valorMin}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="Ex: 500000"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600">
              Valor (máx.)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                name="valorMax"
                defaultValue={valorMax}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="Ex: 3000000"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600">
              Nome do Proprietário
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                name="proprietario"
                defaultValue={proprietario}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="Ex: João"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                name="telefone"
                defaultValue={telefone}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="Ex: 21 99999-9999"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600">
              Nome do Condomínio
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                name="condominioNome"
                defaultValue={condominioNome}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="Ex: Bela Vista"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600">
              Bairro
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                name="bairro"
                defaultValue={bairro}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="Ex: Itaipava"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600">
              Código do Imóvel
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                name="codigo"
                defaultValue={codigo}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="Ex: AR-102"
              />
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-neutral-600">
              Endereço do Imóvel (interno)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                name="endereco"
                defaultValue={endereco}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="Ex: Estrada União Indústria, 9500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600">
              Corretora (captação)
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                name="corretora"
                defaultValue={corretora}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="Digite o nome da corretora"
              />
            </div>
          </div>

          <div className="flex items-end justify-end md:col-span-4">
            <button
              type="submit"
              className="h-11 rounded-full bg-green-700 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
            >
              Aplicar Filtros
            </button>
          </div>
        </form>

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
                  <th className="px-4 py-3 text-left">Endereço (interno)</th>
                  <th className="px-4 py-3 text-left">Corretora</th>
                </tr>
              </thead>

              <tbody>
                {imoveisSafe.map((imovel) => (
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
                    <td className="px-4 py-3">{imovel.endereco ?? "—"}</td>
                    <td className="px-4 py-3">{imovel.corretoraCaptacao ?? "—"}</td>
                  </tr>
                ))}

                {imoveis.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-neutral-500">
                      Nenhum imóvel encontrado com esses filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

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
          {imoveisSafe.map((imovel) => {
            const coverUrl = (imovel as any).coverUrl;
            const hasCover = (imovel as any).hasCover;

            return (
              <div key={imovel.id} className="rounded-2xl border p-4 space-y-3">
                <img
                  src={coverUrl}
                  alt={imovel.title}
                  className="w-full h-[220px] object-cover rounded-xl border"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{imovel.title}</h2>
                    {hasCover && (
                      <div className="flex flex-wrap gap-2">
                        <FeaturedToggle id={imovel.id} initialFeatured={imovel.featured} />
                      </div>
                    )}
                  </div>

                  <p className="text-neutral-500">
                    {imovel.neighborhood} • {imovel.city}
                  </p>

                  {imovel.createdAt ? (
                    <p className="text-xs text-neutral-400">
                      Cadastrado em{" "}
                      {new Date(imovel.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  ) : null}

                  {imovel.cep && <p className="text-neutral-500">CEP: {imovel.cep}</p>}

                  {typeof imovel.price === "number" && (
                    <p className="font-semibold">
                      R$ {imovel.price.toLocaleString("pt-BR")}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <ToggleAtivoButton id={imovel.id} ativo={imovel.ativo} />

                  <Link
                    href={`/admin/imoveis/${imovel.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-neutral-50 text-xs font-semibold"
                  >
                    <Image className="h-4 w-4" />
                    Fotos
                  </Link>

                  <Link
                    href={`/admin/imoveis/${imovel.id}/editar`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-neutral-50 text-xs font-semibold"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>

                  <Link
                    href={`/admin/imoveis/${imovel.id}/imprimir`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-neutral-50 text-xs font-semibold"
                    target="_blank"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Link>

                  <Link
                    href={`/imovel/${imovel.slug}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-neutral-50 text-xs font-semibold"
                    target="_blank"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Site
                  </Link>

                  <details className="group">
                    <summary className="list-none inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-neutral-50 text-xs font-semibold">
                      <FileText className="h-4 w-4" />
                      OBS
                    </summary>

                    <div className="mt-3 w-full rounded-2xl border bg-neutral-50 p-3">
                      <form action={salvarObservacao} className="space-y-3">
                        <input type="hidden" name="id" value={imovel.id} />

                        <textarea
                          name="observacoesInternas"
                          defaultValue={imovel.observacoesInternas ?? ""}
                          placeholder="Digite observações internas deste imóvel..."
                          className="min-h-[120px] w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                        />

                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] text-neutral-500">
                            Visível somente no admin.
                          </p>

                          <button
                            type="submit"
                            className="rounded-full bg-green-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-800"
                          >
                            Salvar observação
                          </button>
                        </div>
                      </form>
                    </div>
                  </details>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}









