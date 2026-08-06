import Image from "next/image";
import {
  ArrowUpRight,
  BadgeCheck,
  ExternalLink,
  ShieldCheck,
  Star,
  UsersRound,
} from "lucide-react";

type Corretora = {
  nome: string;
  creci: string;
  foto: string;
  descricao: string;
  especialidades?: string[];
  whats: string;
};

const GOOGLE_REVIEWS_URL =
  "https://share.google/o6LwoWqi2M17h33y9";

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
      "Corretora de imóveis há 15 anos, com experiência em imóveis residenciais e comerciais, atuando com foco nas necessidades do cliente e excelência.",
    especialidades: ["Documentação", "Visitas", "Negociação"],
    whats: "5524988230138",
  },
];

export default function CorretorasSection() {
  return (
    <section
      id="corretoras"
      aria-labelledby="corretoras-title"
      className="mt-12 scroll-mt-28"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.06)] sm:p-6">
        {/* CABEÇALHO COMPACTO */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#668052]">
              <span className="h-px w-7 bg-[#8da27c]" />
              Atendimento e confiança
            </div>

            <h2
              id="corretoras-title"
              className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
            >
              Quem cuida do seu imóvel
            </h2>

            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">
              Fale com nossas corretoras e consulte a ficha oficial da Araras
              Imóveis no Google.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-[#dce6d6] bg-[#f5f8f2] px-3 py-2 text-xs font-bold text-[#527043] lg:flex">
            <ShieldCheck className="h-4 w-4" />
            Atendimento individual
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="mt-5 grid items-start gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          {/* CORRETORAS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Nossa equipe
                </p>

                <h3 className="mt-0.5 text-lg font-extrabold text-slate-900">
                  Nossas corretoras
                </h3>
              </div>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3e9] text-[#527043]">
                <UsersRound className="h-4.5 w-4.5" />
              </span>
            </div>

            {CORRETORAS.map((corretora) => {
              const primeiroNome = corretora.nome.split(" ")[0];

              const waLink = `https://wa.me/${
                corretora.whats
              }?text=${encodeURIComponent(
                `Olá, ${corretora.nome}! Vim pelo site da Araras Imóveis e gostaria de atendimento.`
              )}`;

              return (
                <article
                  key={corretora.nome}
                  className="group rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_5px_18px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-[#a5b697] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start gap-4">
                    {/* FOTO */}
                    <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[18px] border-4 border-white bg-slate-100 shadow-md sm:h-20 sm:w-20">
                      <Image
                        src={corretora.foto}
                        alt={`Foto de ${corretora.nome}`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="80px"
                      />
                    </div>

                    {/* INFORMAÇÕES */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-extrabold tracking-tight text-slate-950">
                          {corretora.nome}
                        </h4>

                        <BadgeCheck
                          className="h-4.5 w-4.5 shrink-0 text-[#668052]"
                          aria-label="Corretora credenciada"
                        />

                        <span className="rounded-full border border-[#d9e4d3] bg-[#f5f8f2] px-2.5 py-1 text-[10px] font-bold text-[#527043]">
                          {corretora.creci}
                        </span>
                      </div>

                      <p
                        className="mt-1.5 overflow-hidden text-sm leading-5 text-slate-600"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                        }}
                      >
                        {corretora.descricao}
                      </p>

                      <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        {corretora.especialidades?.length ? (
                          <div className="flex flex-wrap gap-1.5">
                            {corretora.especialidades.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-[#dfe8da] bg-[#f0f5ed] px-2.5 py-1 text-[10px] font-bold text-[#577047]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span />
                        )}

                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Falar com ${corretora.nome} no WhatsApp`}
                          className="group/button inline-flex min-h-10 shrink-0 items-center justify-between gap-4 rounded-xl bg-[#168a44] px-4 text-xs font-extrabold text-white shadow-[0_7px_18px_rgba(22,138,68,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#11763a]"
                        >
                          <span className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                              <svg
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                aria-hidden="true"
                                className="fill-white"
                              >
                                <path d="M20.52 3.48A11.86 11.86 0 0012.02 0C5.4 0 .02 5.38.02 12c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.62A11.93 11.93 0 0012.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52zM12.02 22.02c-1.84 0-3.65-.5-5.23-1.44l-.38-.23-3.68.96.98-3.59-.25-.37A9.97 9.97 0 012 12C2 6.49 6.5 2 12.02 2c2.66 0 5.16 1.04 7.04 2.93A9.9 9.9 0 0122 12c0 5.52-4.49 10.02-9.98 10.02zm5.84-7.54c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.18.21-.32.32-.54.11-.21.05-.41-.03-.57-.08-.16-.71-1.71-.98-2.34-.26-.63-.53-.54-.71-.55h-.61c-.21 0-.54.08-.82.41-.28.32-1.07 1.04-1.07 2.54s1.09 2.95 1.25 3.16c.16.21 2.14 3.26 5.18 4.57.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.88-.77 2.14-1.5.26-.73.26-1.36.18-1.5-.08-.14-.29-.23-.61-.39z" />
                              </svg>
                            </span>

                            Falar com {primeiroNome}
                          </span>

                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* GOOGLE — COMPACTO */}
          <aside className="self-start overflow-hidden rounded-[22px] bg-[#315c49] p-5 text-white shadow-[0_14px_35px_rgba(49,92,73,0.18)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl font-extrabold shadow-md">
                <span className="text-[#4285F4]">G</span>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/90">
                <ShieldCheck className="h-3.5 w-3.5" />
                Ficha oficial
              </span>
            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c7ddaf]">
              Avaliações no Google
            </p>

            <h3 className="mt-1.5 text-2xl font-extrabold leading-tight tracking-tight">
              Veja o que nossos clientes dizem
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/75">
              Acesse comentários e experiências públicas diretamente na ficha
              oficial da Araras Imóveis.
            </p>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Star className="h-4 w-4 fill-[#fbbc04] text-[#fbbc04]" />
              </span>

              <div>
                <p className="text-sm font-bold">
                  Avaliações reais
                </p>

                <p className="mt-0.5 text-xs leading-5 text-white/60">
                  Publicadas e atualizadas pelo Google.
                </p>
              </div>
            </div>

            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver avaliações da Araras Imóveis no Google"
              className="group mt-5 flex min-h-11 w-full items-center justify-between rounded-xl bg-white px-4 text-xs font-extrabold text-[#315c49] shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#f5f8f2]"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Ver avaliações no Google
              </span>

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <p className="mt-2 text-center text-[10px] text-white/45">
              Abre a ficha oficial em uma nova aba.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}