import Link from "next/link";

const REGIOES = [
  { slug: "centro", label: "Centro", icon: "▲" },
  { slug: "itaipava", label: "Itaipava", icon: "🍃" },
  { slug: "araras", label: "Araras", icon: "✦" },
  { slug: "cascatinha", label: "Cascatinha", icon: "▲" },
  { slug: "correas", label: "Corrêas", icon: "✦" },
  { slug: "secretario", label: "Secretário", icon: "●" },
  { slug: "pedro-do-rio", label: "Pedro do Rio", icon: "👤" },
  { slug: "posse", label: "Posse", icon: "▦" },
];

export default function RegionsSection() {
  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Explore</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Mapa & Regiões</h2>
          <p className="text-slate-600 mt-2">
            Escolha uma região para ver imóveis e localização no mapa.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {REGIOES.map((r) => (
          <Link
            key={r.slug}
            href={`/regioes/${r.slug}`}
            className="
              inline-flex items-center justify-center gap-2
              rounded-2xl border border-slate-200 bg-white px-4 py-3
              text-sm font-semibold text-slate-800
              hover:bg-slate-50
            "
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
              {r.icon}
            </span>
            <span>{r.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
