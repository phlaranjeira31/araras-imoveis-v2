import RegionsFilterServer from "@/components/RegionsFilterServer";
import PetropolisRegioesMapClient from "@/components/PetropolisRegioesMapClient";

export default function MapaPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* ✅ TÍTULO UMA ÚNICA VEZ (NÃO DUPLICAR EM COMPONENTES) */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Explore</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Mapa & Regiões
          </h1>
          <p className="text-slate-600">
            Filtre por cidade e bairro para ver os imóveis daquela região.
          </p>
        </div>

        {/* ✅ FILTRO (SÓ ELE, SEM TÍTULO DENTRO) */}
        <div className="mt-8">
          <RegionsFilterServer />
        </div>
      </section>

{/* ✅ MAPA ABAIXO */}
<div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
  <div className="h-[420px] w-full md:h-[520px]">
    <PetropolisRegioesMapClient />
  </div>
</div>

    </main>
  );
}



