export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import HomeSearchBar from "@/components/HomeSearchBar";
import HomeImoveisCarousel from "@/components/HomeImoveisCarousel";
import CorretoresSection from "@/components/CorretorasSection";
import ContactSection from "@/components/ContactSection";

export default function HomePage() {
  return (
    <main>
      {/* ✅ HERO (apenas a parte da barra de busca) com background */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: "url('/brand/Logotipo-07.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {/* overlay escuro */}
        <div className="absolute inset-0 bg-black/35" />

        {/* neblina suave */}
        <div className="absolute inset-0 bg-white/10" />

        {/* Conteúdo do hero */}
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="mx-auto w-full max-w-5xl">
            <HomeSearchBar />
          </div>
        </div>
      </section>

      {/* ✅ CONTEÚDO COM FUNDO CONTÍNUO (SEM FAIXA BRANCA) */}
      <section className="araras-premium-band -mb-24">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <HomeImoveisCarousel />

          <ContactSection />

          <CorretoresSection />

          {/* ✅ REGIÕES DE ATUAÇÃO */}
          <section className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#5a6b3f]">
                Onde atuamos
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Regiões de atuação
              </h2>

              <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
                A Araras Imóveis atua em diferentes regiões de Petrópolis,
                oferecendo atendimento próximo, transparente e conhecimento
                especializado dos principais bairros e distritos da serra
                fluminense.
              </p>
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_1fr]">
              {/* MAPA */}
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <Image
                  src="/brand/mapa-regioes-petropolis.jpeg"
                  alt="Mapa dos cinco distritos de Petrópolis, incluindo Petrópolis, Cascatinha, Itaipava, Pedro do Rio e Posse"
                  width={1600}
                  height={900}
                  className="h-auto w-full object-contain"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              </div>

              {/* DESCRIÇÃO */}
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Conhecimento de toda a região
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Nossa atuação contempla os cinco distritos de Petrópolis:
                  Petrópolis, Cascatinha, Itaipava, Pedro do Rio e Posse.
                </p>

                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Também trabalhamos com imóveis em Araras, Corrêas, Secretário,
                  Centro, Fazenda Inglesa, Samambaia, Nogueira e outras
                  localidades da região.
                </p>

                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Esse conhecimento local permite apresentar imóveis alinhados
                  ao estilo de vida, às necessidades e aos objetivos de cada
                  cliente.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Petrópolis",
                    "Cascatinha",
                    "Itaipava",
                    "Pedro do Rio",
                    "Posse",
                    "Araras",
                    "Corrêas",
                    "Secretário",
                  ].map((regiao) => (
                    <span
                      key={regiao}
                      className="rounded-full bg-[#eef1e9] px-4 py-2 text-sm font-medium text-[#5a6b3f]"
                    >
                      {regiao}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}