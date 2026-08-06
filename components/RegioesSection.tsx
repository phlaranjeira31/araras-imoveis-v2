import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  MapPin,
} from "lucide-react";

const REGIOES = [
  "Petrópolis",
  "Cascatinha",
  "Itaipava",
  "Pedro do Rio",
  "Posse",
  "Araras",
  "Corrêas",
  "Secretário",
];

export default function RegioesSection() {
  return (
    <section
      id="regioes"
      aria-labelledby="regioes-title"
      className="mt-12 scroll-mt-28"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
        <div className="grid items-stretch lg:grid-cols-[1.3fr_0.7fr]">
          {/* MAPA */}
          <div className="flex items-center justify-center bg-gradient-to-br from-[#f6f5f0] via-[#faf9f5] to-white p-3 sm:p-4">
            <div className="flex w-full items-center justify-center overflow-hidden rounded-[22px] border border-[#eee9df] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.07)]">
              <Image
                src="/brand/mapa-distritos-petropolis-premium.png"
                alt="Mapa ilustrado dos cinco distritos de Petrópolis: Petrópolis, Cascatinha, Itaipava, Pedro do Rio e Posse"
                width={1536}
                height={1152}
                className="h-auto max-h-[440px] w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
            </div>
          </div>

          {/* CONTEÚDO */}
          <div className="flex flex-col justify-center border-t border-slate-100 p-5 sm:p-6 lg:border-l lg:border-t-0">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#668052]">
              <span className="h-px w-7 bg-[#8da27c]" />
              Onde atuamos
            </div>

            <h2
              id="regioes-title"
              className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-950"
            >
              Presença em toda a serra
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Atuamos nos cinco distritos de Petrópolis e nos principais
              bairros da região, com conhecimento especializado do mercado
              imobiliário local.
            </p>

            {/* DIFERENCIAIS COMPACTOS */}
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-center gap-3 rounded-xl border border-[#dfe7da] bg-[#f7faf5] p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f0e3] text-[#527043]">
                  <MapPin className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Conhecimento local
                  </p>

                  <p className="text-xs leading-5 text-slate-500">
                    Bairros, distritos e oportunidades.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#dfe7da] bg-[#f7faf5] p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f0e3] text-[#527043]">
                  <Compass className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Curadoria regional
                  </p>

                  <p className="text-xs leading-5 text-slate-500">
                    Imóveis para diferentes perfis.
                  </p>
                </div>
              </div>
            </div>

            {/* REGIÕES */}
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
                Imóveis por região
              </p>

              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {REGIOES.map((regiao) => (
                  <Link
                    key={regiao}
                    href={`/imoveis?q=${encodeURIComponent(regiao)}`}
                    className="group flex min-h-9 items-center justify-between gap-2 rounded-lg border border-[#dfe7da] bg-[#f1f6ee] px-3 text-[11px] font-bold text-[#577047] transition duration-300 hover:-translate-y-0.5 hover:border-[#9caf8d] hover:bg-[#e7efe2]"
                  >
                    <span className="truncate">{regiao}</span>

                    <ArrowRight className="h-3 w-3 shrink-0 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/imoveis?purpose=todos"
              className="group mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#365f4d] px-4 text-sm font-extrabold text-white shadow-[0_7px_18px_rgba(54,95,77,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#294c3c]"
            >
              Ver imóveis disponíveis

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}