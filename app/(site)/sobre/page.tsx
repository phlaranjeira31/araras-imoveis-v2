import Link from "next/link";

export default function SobrePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* Topo */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft md:p-10">
        <p className="text-xs font-semibold tracking-wide text-slate-500">
          Araras Imóveis – Seu imóvel na Serra do Rio de Janeiro
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Sobre Nós
        </h1>

        <p className="mt-4 max-w-3xl text-slate-600">
          Localizada no centro de Itaipava, acima da Casa do Alemão, a Araras Imóveis é a sua melhor escolha na hora de comprar o imóvel dos seus sonhos em Petrópolis e região. Com uma equipe especializada e um atendimento personalizado, ajudamos você a encontrar a casa, apartamento, terreno ou sítio perfeito para o seu estilo de vida.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/imoveis?purpose=todos" className="btn-primary">
            Ver imóveis
          </Link>

          <Link href="/#corretoras" className="btn-outline">
            Falar com a equipe
          </Link>
        </div>
      </div>

      {/* Cards */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft">
          <div className="badge">Atendimento</div>
          <h2 className="mt-3 text-lg font-extrabold text-slate-900">
            Atendimento humano e rápido
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Atendimento transparente, com suporte em cada etapa do processo. O cliente é o nosso maior patrimônio.
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft">
          <div className="badge">Curadoria</div>
          <h2 className="mt-3 text-lg font-extrabold text-slate-900">
            Imóveis selecionados
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Priorizamos qualidade, localização e documentação alinhada para segurança.
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft">
          <div className="badge">Segurança</div>
          <h2 className="mt-3 text-lg font-extrabold text-slate-900">
            Processo seguro do início ao fim
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Orientação e cuidado para você fechar negócio com confiança. Segurança e credibilidade no mercado imobiliário. 
          </p>
        </div>
      </section>

      {/* Bloco final */}
      <section className="mt-10 rounded-3xl border border-black/5 bg-white p-6 shadow-soft md:p-10">
        <h2 className="text-xl font-extrabold text-slate-900">
          Nossa missão
        </h2>
        <p className="mt-3 text-slate-600">
          Conectar pessoas ao imóvel ideal com transparência, agilidade e uma
          experiência premium. Nosso foco é entender o que você procura e te
          guiar na melhor decisão.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/#contato" className="btn-primary">
            Entrar em contato
          </Link>
          <Link href="/imoveis?purpose=todos" className="btn-outline">
            Ver opções
          </Link>
        </div>
      </section>
    </main>
  );
}
