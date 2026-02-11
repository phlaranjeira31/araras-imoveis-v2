
// app/(site)/imoveis/page.tsx
import { properties, type Property } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";

type SearchParams = {
  q?: string;
  purpose?: string;
};

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const q = (sp?.q ?? "").toLowerCase().trim();
  const purpose = (sp?.purpose ?? "").toLowerCase().trim();

  const list = (properties as Property[]).filter((p) => {
    const hay = `${p.title} ${p.city} ${p.neighborhood ?? ""}`.toLowerCase();

    const matchQ = q ? hay.includes(q) : true;

    // aceitando "lancamentos" no filtro mesmo que no dado esteja "venda/aluguel/temporada"
    const matchPurpose =
      !purpose || purpose === "todos"
        ? true
        : purpose === "lancamentos" || purpose === "lançamentos"
        ? true
        : p.purpose.toLowerCase() === purpose;

    return matchQ && matchPurpose;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-sm font-semibold text-primary">Catálogo</div>
          <h1 className="mt-2 text-4xl font-extrabold">Imóveis</h1>
          <p className="mt-2 text-slate-600">
            Pesquise por bairro/cidade e filtre por finalidade.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <PropertyCard key={p.slug} p={p} />
        ))}
      </div>
    </main>
  );
}

