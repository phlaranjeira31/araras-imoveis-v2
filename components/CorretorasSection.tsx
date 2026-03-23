import Image from "next/image";

type Corretora = {
  nome: string;
  creci: string;
  foto: string; // caminho em /public
  descricao: string;
  especialidades?: string[];

  // ✅ ADICIONADO: WhatsApp individual (só números, ex: 5521999999999)
  whats: string;
};

const CORRETORAS: Corretora[] = [
  {
    nome: "Lidiane Farias",
    creci: "CRECI: 073302",
    foto: "/corretoras/corretora-1.jpg",
    descricao:
      "Empresária, mãe, com mais de 25 anos de experiência no mercado imobiliário, especialista em lançamentos de médio e alto padrão, marketing digital e gestão completa de processos. Construiu uma trajetória sólida pautada na excelência, credibilidade e resultados consistentes.",
    especialidades: ["Petrópolis", "Itaipava", "Alto padrão"],
    whats: "5521964507343",
  },
  {
    nome: "Claudia Raposo",
    creci: "CRECI: 069261",
    foto: "/corretoras/corretora claudia.jpg",
    descricao:
      "Corretora de imóveis há 15 anos, com experiência em imóveis residenciais e comerciais, atuando com foco nas necessidades do cliente e excelência no atendimento. Construiu uma trajetória sólida baseada em confiança, transparência e resultados consistentes.",
    especialidades: ["Documentação", "Visitas", "Negociação"],
    whats: "5524988230138",
  },
];

export default function CorretorasSection() {
  return (
    <section id="corretoras" className="mt-16 scroll-mt-24">
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft md:p-10">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-slate-500">
            ARARAS IMÓVEIS
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Nossas Corretoras
          </h2>
          <p className="max-w-3xl text-slate-600">
            Atendimento próximo, transparente e com curadoria para você encontrar
            o imóvel ideal na serra.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CORRETORAS.map((c) => {
            const waLink = `https://wa.me/${c.whats}?text=${encodeURIComponent(
              `Olá, ${c.nome}! Vim pelo site da Araras Imóveis e gostaria de atendimento.`
            )}`;

            return (
              <article
                key={c.nome}
                className="rounded-3xl border border-black/5 bg-white p-5 shadow-soft transition hover:shadow-soft-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border border-black/10 bg-slate-50">
                    <Image
                      src={c.foto}
                      alt={c.nome}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-extrabold text-slate-900">
                      {c.nome}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      {c.creci}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {c.descricao}
                </p>

                {c.especialidades?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.especialidades.map((tag) => (
                      <span key={tag} className="badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800"
                  aria-label={`Falar com ${c.nome} no WhatsApp`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                    className="shrink-0 fill-white"
                  >
                    <path d="M20.52 3.48A11.86 11.86 0 0012.02 0C5.4 0 .02 5.38.02 12c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.62A11.93 11.93 0 0012.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52zM12.02 22.02c-1.84 0-3.65-.5-5.23-1.44l-.38-.23-3.68.96.98-3.59-.25-.37A9.97 9.97 0 012 12C2 6.49 6.5 2 12.02 2c2.66 0 5.16 1.04 7.04 2.93A9.9 9.9 0 0122 12c0 5.52-4.49 10.02-9.98 10.02zm5.84-7.54c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.18.21-.32.32-.54.11-.21.05-.41-.03-.57-.08-.16-.71-1.71-.98-2.34-.26-.63-.53-.54-.71-.55h-.61c-.21 0-.54.08-.82.41-.28.32-1.07 1.04-1.07 2.54s1.09 2.95 1.25 3.16c.16.21 2.14 3.26 5.18 4.57.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.88-.77 2.14-1.5.26-.73.26-1.36.18-1.5-.08-.14-.29-.23-.61-.39z" />
                  </svg>
                  Falar no WhatsApp
                </a>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-slate-500">
          
          <span className="font-semibold text-slate-700">
            
          </span>
          .
        </p>
      </div>
    </section>
  );
}

