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
        </div>
      </section>
    </main>
  );
}














