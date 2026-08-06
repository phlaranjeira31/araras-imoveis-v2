export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import { MapPin } from "lucide-react";

import HomeSearchBar from "@/components/HomeSearchBar";
import HomeImoveisCarousel from "@/components/HomeImoveisCarousel";
import CorretoresSection from "@/components/CorretorasSection";
import ContactSection from "@/components/ContactSection";
import RegioesSection from "@/components/RegioesSection";

export default function HomePage() {
  return (
    <main>
      {/* HERO PANORÂMICO */}
      <section className="relative isolate z-20 overflow-visible bg-[#173d2f]">
        <Image
          src="/brand/hero-serra-petropolis.png"
          alt="Vista panorâmica da Serra de Petrópolis, no Rio de Janeiro"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#06110d]/95 via-[#0b1d16]/65 to-[#0b1d16]/20" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_28%,rgba(255,255,255,0.14),transparent_32%)]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-9 pt-9 sm:pb-10 sm:pt-10 lg:pb-11">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* CONTEÚDO PRINCIPAL */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                <MapPin className="h-4 w-4" />
                Petrópolis e região
              </div>

              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-[56px]">
                Seu imóvel
                <span className="block text-[#b8d79d]">
                  na serra carioca
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 drop-shadow sm:text-lg">
                Imóveis selecionados com curadoria, atendimento próximo e
                conhecimento profundo de Petrópolis, Itaipava, Araras e toda a
                região.
              </p>
            </div>

            {/* ASSINATURA */}
            <div className="hidden lg:flex lg:justify-end">
              <div className="max-w-[300px] border-l border-white/35 pl-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c6dfb0]">
                  Araras Imóveis
                </p>

                <h2 className="mt-3 text-2xl font-bold leading-tight">
                  Curadoria, confiança e conhecimento da serra.
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  Atendimento próximo para encontrar imóveis alinhados ao seu
                  estilo de vida e aos seus objetivos.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["Petrópolis", "Itaipava", "Araras"].map((regiao) => (
                    <span
                      key={regiao}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm"
                    >
                      {regiao}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BARRA DE BUSCA */}
          <div className="relative z-[80] mt-6">
            <HomeSearchBar />
          </div>
        </div>
      </section>

      {/* CONTEÚDO DA HOME */}
      <section className="araras-premium-band -mb-24">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-10">
          <HomeImoveisCarousel />

          <ContactSection />

          <CorretoresSection />

          {/* SOMENTE A NOVA SEÇÃO */}
          <RegioesSection />
        </div>
      </section>
    </main>
  );
}