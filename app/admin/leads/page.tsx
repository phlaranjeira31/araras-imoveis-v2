export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Flame,
  House,
  KeyRound,
  LayoutDashboard,
  MapPin,
  Pencil,
  Phone,
  Search,
  Sparkles,
  Target,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DemandaFinalidade,
  LeadOrigem,
  LeadPrioridade,
  LeadStatus,
  LeadTemperatura,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import WhatsAppMark from "@/components/WhatsAppMark";

/* =========================================================
   TIPOS
========================================================= */

type PageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    origem?: string;
    temperatura?: string;
    prioridade?: string;
    finalidade?: string;
    responsavel?: string;
    page?: string;

    criado?: string;
    excluido?: string;
  }>;
};

/* =========================================================
   LABELS
========================================================= */

const STATUS_LABEL: Record<LeadStatus, string> = {
  NOVO: "Novo",
  PRIMEIRO_CONTATO: "Primeiro contato",
  EM_ATENDIMENTO: "Em atendimento",
  QUALIFICADO: "Qualificado",
  IMOVEIS_ENVIADOS: "Imóveis enviados",
  VISITA_AGENDADA: "Visita agendada",
  VISITA_REALIZADA: "Visita realizada",
  PROPOSTA: "Proposta",
  NEGOCIACAO: "Negociação",
  CONVERTIDO: "Convertido",
  PERDIDO: "Perdido",
  SEM_RETORNO: "Sem retorno",
  SEM_INTERESSE: "Sem interesse",
};

const ORIGEM_LABEL: Record<LeadOrigem, string> = {
  SITE: "Site",
  WHATSAPP: "WhatsApp",
  TELEFONE: "Telefone",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  GOOGLE: "Google",
  INDICACAO: "Indicação",
  PRESENCIAL: "Presencial",
  PORTAL_IMOBILIARIO: "Portal imobiliário",
  PLACA: "Placa",
  EVENTO: "Evento",
  OUTRO: "Outro",
};

const TEMPERATURA_LABEL: Record<LeadTemperatura, string> = {
  FRIO: "Frio",
  MORNO: "Morno",
  QUENTE: "Quente",
};

const PRIORIDADE_LABEL: Record<LeadPrioridade, string> = {
  BAIXA: "Baixa",
  NORMAL: "Normal",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

const FINALIDADE_LABEL: Record<DemandaFinalidade, string> = {
  COMPRAR: "Comprar",
  ALUGAR: "Alugar",
  TEMPORADA: "Temporada",
  INVESTIR: "Investir",
  VENDER: "Vender",
};

/* =========================================================
   HELPERS
========================================================= */

function getOne(value?: string) {
  return String(value || "").trim();
}

function money(value?: number | null) {
  if (typeof value !== "number") return null;

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function whatsappUrl(
  whatsapp?: string | null,
  telefone?: string | null
) {
  let digits = String(
    whatsapp || telefone || ""
  ).replace(/\D/g, "");

  if (!digits) return null;

  if (
    digits.length === 10 ||
    digits.length === 11
  ) {
    digits = `55${digits}`;
  }

  return `https://wa.me/${digits}`;
}

function isEnumValue<T extends string>(
  value: string,
  values: readonly T[]
): value is T {
  return values.includes(value as T);
}

function statusClasses(status: LeadStatus) {
  switch (status) {
    case "NOVO":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "PRIMEIRO_CONTATO":
    case "EM_ATENDIMENTO":
      return "border-sky-200 bg-sky-50 text-sky-700";

    case "QUALIFICADO":
    case "IMOVEIS_ENVIADOS":
      return "border-violet-200 bg-violet-50 text-violet-700";

    case "VISITA_AGENDADA":
    case "VISITA_REALIZADA":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "PROPOSTA":
    case "NEGOCIACAO":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "CONVERTIDO":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "PERDIDO":
    case "SEM_INTERESSE":
      return "border-red-200 bg-red-50 text-red-700";

    case "SEM_RETORNO":
      return "border-slate-200 bg-slate-100 text-slate-600";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function temperatureClasses(
  value: LeadTemperatura
) {
  switch (value) {
    case "QUENTE":
      return "border-red-200 bg-red-50 text-red-600";

    case "MORNO":
      return "border-amber-200 bg-amber-50 text-amber-600";

    case "FRIO":
      return "border-sky-200 bg-sky-50 text-sky-600";
  }
}

function prioridadeClasses(
  value: LeadPrioridade
) {
  switch (value) {
    case "URGENTE":
      return "bg-red-500";

    case "ALTA":
      return "bg-orange-500";

    case "NORMAL":
      return "bg-[#668052]";

    case "BAIXA":
      return "bg-slate-300";
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminLeadsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const q = getOne(params.q);

  const statusRaw = getOne(
    params.status
  );

  const origemRaw = getOne(
    params.origem
  );

  const temperaturaRaw = getOne(
    params.temperatura
  );

  const prioridadeRaw = getOne(
    params.prioridade
  );

  const finalidadeRaw = getOne(
    params.finalidade
  );

  const responsavel = getOne(
    params.responsavel
  );

  const status = isEnumValue(
    statusRaw,
    Object.values(LeadStatus)
  )
    ? statusRaw
    : undefined;

  const origem = isEnumValue(
    origemRaw,
    Object.values(LeadOrigem)
  )
    ? origemRaw
    : undefined;

  const temperatura = isEnumValue(
    temperaturaRaw,
    Object.values(LeadTemperatura)
  )
    ? temperaturaRaw
    : undefined;

  const prioridade = isEnumValue(
    prioridadeRaw,
    Object.values(LeadPrioridade)
  )
    ? prioridadeRaw
    : undefined;

  const finalidade = isEnumValue(
    finalidadeRaw,
    Object.values(DemandaFinalidade)
  )
    ? finalidadeRaw
    : undefined;

  const PAGE_SIZE = 12;

  const currentPage = Math.max(
    1,
    Number.parseInt(
      params.page || "1",
      10
    ) || 1
  );

  /* =======================================================
     FILTROS PRISMA
  ======================================================= */

  const where: Prisma.LeadWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (origem) {
    where.origem = origem;
  }

  if (temperatura) {
    where.temperatura =
      temperatura;
  }

  if (prioridade) {
    where.prioridade =
      prioridade;
  }

  if (finalidade) {
    where.finalidade =
      finalidade;
  }

  if (responsavel) {
    where.AND = [
      {
        OR: [
          {
            responsavelNome: {
              contains: responsavel,
              mode: "insensitive",
            },
          },
          {
            responsavel: {
              is: {
                email: {
                  contains: responsavel,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
    ];
  }

  if (q) {
    where.OR = [
      {
        contato: {
          is: {
            nome: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      },

      {
        contato: {
          is: {
            telefone: {
              contains: q,
            },
          },
        },
      },

      {
        contato: {
          is: {
            whatsapp: {
              contains: q,
            },
          },
        },
      },

      {
        contato: {
          is: {
            email: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      },

      {
        assunto: {
          contains: q,
          mode: "insensitive",
        },
      },

      {
        origemDetalhe: {
          contains: q,
          mode: "insensitive",
        },
      },

      {
        responsavelNome: {
          contains: q,
          mode: "insensitive",
        },
      },

      {
        responsavel: {
          is: {
            email: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      },

      {
        imovelOrigem: {
          is: {
            title: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      },

      {
        imovelOrigem: {
          is: {
            codigo: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  /* =======================================================
     CONSULTAS
  ======================================================= */

  const [
    total,
    novos,
    quentes,
    qualificados,
    visitas,
    propostas,
    negociacoes,
    convertidos,
    totalFiltrado,
    leads,
  ] = await Promise.all([
    prisma.lead.count(),

    prisma.lead.count({
      where: {
        status: LeadStatus.NOVO,
      },
    }),

    prisma.lead.count({
      where: {
        temperatura:
          LeadTemperatura.QUENTE,
      },
    }),

    prisma.lead.count({
      where: {
        status:
          LeadStatus.QUALIFICADO,
      },
    }),

    prisma.visita.count({
      where: {
        status: {
          in: [
            "AGENDADA",
            "CONFIRMADA",
          ],
        },
      },
    }),

    prisma.lead.count({
      where: {
        status:
          LeadStatus.PROPOSTA,
      },
    }),

    prisma.lead.count({
      where: {
        status:
          LeadStatus.NEGOCIACAO,
      },
    }),

    prisma.lead.count({
      where: {
        status:
          LeadStatus.CONVERTIDO,
      },
    }),

    prisma.lead.count({
      where,
    }),

    prisma.lead.findMany({
      where,

      orderBy: {
        createdAt: "desc",
      },

      skip:
        (currentPage - 1) *
        PAGE_SIZE,

      take: PAGE_SIZE,

      include: {
        contato: true,

        responsavel: {
          select: {
            id: true,
            email: true,
          },
        },

        imovelOrigem: {
          select: {
            id: true,
            title: true,
            codigo: true,
            city: true,
            neighborhood: true,
            price: true,
            priceRent: true,
            purpose: true,
          },
        },

        demandas: {
          where: {
            ativo: true,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 1,
        },

        _count: {
          select: {
            interesses: true,
            tarefas: true,
            visitas: true,
            propostas: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalFiltrado / PAGE_SIZE
    )
  );

  const hasFilters = Boolean(
    q ||
      status ||
      origem ||
      temperatura ||
      prioridade ||
      finalidade ||
      responsavel
  );

  function pageHref(
    page: number
  ) {
    const url =
      new URLSearchParams();

    if (q) {
      url.set("q", q);
    }

    if (status) {
      url.set(
        "status",
        status
      );
    }

    if (origem) {
      url.set(
        "origem",
        origem
      );
    }

    if (temperatura) {
      url.set(
        "temperatura",
        temperatura
      );
    }

    if (prioridade) {
      url.set(
        "prioridade",
        prioridade
      );
    }

    if (finalidade) {
      url.set(
        "finalidade",
        finalidade
      );
    }

    if (responsavel) {
      url.set(
        "responsavel",
        responsavel
      );
    }

    url.set(
      "page",
      String(page)
    );

    return `/admin/leads?${url.toString()}`;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8faf8_0%,#f2f6f3_100%)]">
      <div className="mx-auto max-w-[1450px] px-4 py-7 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/admin/imoveis"
              className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#527443] transition hover:text-[#365f4d]"
            >
              <ArrowLeft className="h-4 w-4" />

              Voltar para administração
            </Link>

            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#365f4d] text-white shadow-sm">
                <Users className="h-5 w-5" />
              </span>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[28px] font-bold tracking-[-0.04em] text-slate-950 sm:text-[32px]">
                    Central de Leads
                  </h1>

                  <span className="rounded-full border border-[#dce7d7] bg-[#f1f6ee] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#668052]">
                    Araras CRM
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-[12px] text-slate-500">
                  Gerencie oportunidades,
                  interesses, demandas,
                  atendimentos, visitas e
                  negociações.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <LayoutDashboard className="h-4 w-4" />

              Dashboard
            </Link>

            <Link
              href="/admin/leads/novo"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#16863c] px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#107533]"
            >
              <UserPlus className="h-4 w-4" />

              Novo Lead
            </Link>
          </div>
        </header>

        {/* =================================================
            AVISOS
        ================================================= */}

        {params.criado ? (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <BadgeCheck className="h-4 w-4" />
              </span>

              <div>
                <p className="text-xs font-bold text-emerald-800">
                  Lead cadastrado com
                  sucesso
                </p>

                <p className="mt-0.5 text-[10px] text-emerald-600">
                  O Lead #
                  {String(
                    params.criado
                  ).padStart(6, "0")}{" "}
                  já está disponível na
                  Central Comercial.
                </p>
              </div>
            </div>

            <Link
              href="/admin/leads"
              className="text-[10px] font-bold text-emerald-700 hover:underline"
            >
              Fechar
            </Link>
          </div>
        ) : null}

        {params.excluido ===
        "1" ? (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-800">
                Lead excluído
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                A oportunidade foi
                removida do CRM.
              </p>
            </div>

            <Link
              href="/admin/leads"
              className="text-[10px] font-bold text-[#527443] hover:underline"
            >
              Fechar
            </Link>
          </div>
        ) : null}

        {/* =================================================
            CARDS
        ================================================= */}

        <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <MetricCard
            label="Total"
            value={total}
            icon={
              <Users className="h-4 w-4" />
            }
          />

          <MetricCard
            label="Novos"
            value={novos}
            icon={
              <Sparkles className="h-4 w-4" />
            }
            tone="blue"
          />

          <MetricCard
            label="Quentes"
            value={quentes}
            icon={
              <Flame className="h-4 w-4" />
            }
            tone="red"
          />

          <MetricCard
            label="Qualificados"
            value={qualificados}
            icon={
              <Target className="h-4 w-4" />
            }
            tone="violet"
          />

          <Link
            href="/admin/visitas"
            className="block"
          >
            <MetricCard
              label="Visitas"
              value={visitas}
              icon={
                <CalendarDays className="h-4 w-4" />
              }
              tone="amber"
            />
          </Link>

          <MetricCard
            label="Propostas"
            value={propostas}
            icon={
              <CircleDollarSign className="h-4 w-4" />
            }
            tone="orange"
          />

          <MetricCard
            label="Negociações"
            value={negociacoes}
            icon={
              <Activity className="h-4 w-4" />
            }
            tone="orange"
          />

          <MetricCard
            label="Convertidos"
            value={convertidos}
            icon={
              <BadgeCheck className="h-4 w-4" />
            }
            tone="green"
          />
        </section>

        {/* =================================================
            BUSCA E FILTROS
        ================================================= */}

        <section className="mt-5 rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Buscar e filtrar
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                Encontre rapidamente
                qualquer oportunidade
                comercial.
              </p>
            </div>

            {hasFilters ? (
              <Link
                href="/admin/leads"
                className="text-[10px] font-semibold text-[#527443] hover:underline"
              >
                Limpar filtros
              </Link>
            ) : null}
          </div>

          <form className="mt-4 grid gap-2.5 lg:grid-cols-12">
            <div className="relative lg:col-span-3">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                name="q"
                defaultValue={q}
                placeholder="Nome, telefone, responsável, imóvel..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#8da37d] focus:ring-4 focus:ring-[#6f895c]/10"
              />
            </div>

            <div className="relative lg:col-span-2">
              <Users className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                name="responsavel"
                defaultValue={responsavel}
                placeholder="Responsável"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#8da37d] focus:ring-4 focus:ring-[#6f895c]/10"
              />
            </div>

            <SelectFilter
              name="status"
              value={status || ""}
              label="Todos os status"
              options={Object.values(
                LeadStatus
              ).map((value) => ({
                value,
                label:
                  STATUS_LABEL[
                    value
                  ],
              }))}
            />

            <SelectFilter
              name="origem"
              value={origem || ""}
              label="Todas as origens"
              options={Object.values(
                LeadOrigem
              ).map((value) => ({
                value,
                label:
                  ORIGEM_LABEL[
                    value
                  ],
              }))}
            />

            <SelectFilter
              name="temperatura"
              value={
                temperatura || ""
              }
              label="Temperatura"
              options={Object.values(
                LeadTemperatura
              ).map((value) => ({
                value,
                label:
                  TEMPERATURA_LABEL[
                    value
                  ],
              }))}
            />

            <SelectFilter
              name="prioridade"
              value={
                prioridade || ""
              }
              label="Prioridade"
              options={Object.values(
                LeadPrioridade
              ).map((value) => ({
                value,
                label:
                  PRIORIDADE_LABEL[
                    value
                  ],
              }))}
            />

            <SelectFilter
              name="finalidade"
              value={
                finalidade || ""
              }
              label="Finalidade"
              options={Object.values(
                DemandaFinalidade
              ).map((value) => ({
                value,
                label:
                  FINALIDADE_LABEL[
                    value
                  ],
              }))}
            />

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#365f4d] px-4 text-xs font-bold text-white transition hover:bg-[#294b3c] lg:col-span-2"
            >
              <Search className="h-3.5 w-3.5" />

              Aplicar
            </button>
          </form>
        </section>

        {/* =================================================
            RESULTADOS
        ================================================= */}

        <section className="mt-5">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900">
                Oportunidades
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {totalFiltrado.toLocaleString(
                  "pt-BR"
                )}{" "}
                resultado
                {totalFiltrado === 1
                  ? ""
                  : "s"}
              </p>
            </div>

            <p className="text-[10px] text-slate-400">
              Página {currentPage} de{" "}
              {totalPages}
            </p>
          </div>

          {/* =================================================
              VAZIO
          ================================================= */}

          {leads.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#ccd9c6] bg-white px-6 py-16 text-center shadow-sm">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4e9] text-[#527443]">
                <UserPlus className="h-6 w-6" />
              </span>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {hasFilters
                  ? "Nenhum lead encontrado"
                  : "A central está pronta"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
                {hasFilters
                  ? "Tente alterar os filtros utilizados."
                  : "Ainda não existem oportunidades cadastradas. O primeiro lead poderá vir do WhatsApp, telefone, indicação, Instagram, site ou qualquer outra origem."}
              </p>

              {!hasFilters ? (
                <Link
                  href="/admin/leads/novo"
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#16863c] px-5 text-sm font-bold text-white transition hover:bg-[#107533]"
                >
                  <UserPlus className="h-4 w-4" />

                  Cadastrar primeiro lead
                </Link>
              ) : (
                <Link
                  href="/admin/leads"
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Limpar filtros
                </Link>
              )}
            </div>
          ) : (
            /* =================================================
               CARDS DOS LEADS
            ================================================= */

            <div className="grid gap-3 xl:grid-cols-2">
              {leads.map(
                (lead) => {
                  const demanda =
                    lead
                      .demandas[0];

                  const waUrl =
                    whatsappUrl(
                      lead.contato
                        .whatsapp,
                      lead.contato
                        .telefone
                    );

                  const telefone =
                    lead.contato
                      .whatsapp ||
                    lead.contato
                      .telefone ||
                    "Não informado";

                  const convertido =
                    lead.status ===
                    LeadStatus.CONVERTIDO;

                  const perdido =
                    lead.status ===
                    LeadStatus.PERDIDO;

                  return (
                    <article
                      key={lead.id}
                      className={`group rounded-[24px] border bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.035)] transition hover:shadow-[0_14px_34px_rgba(15,23,42,0.07)] ${
                        convertido
                          ? "border-emerald-200"
                          : perdido
                            ? "border-red-200"
                            : "border-slate-200 hover:border-[#cbd9c5]"
                      }`}
                    >
                      {/* =====================================
                          CABEÇALHO DO CARD
                      ===================================== */}

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf4e9] text-sm font-bold text-[#365f4d]">
                            {lead.contato.nome
                              .trim()
                              .slice(0, 1)
                              .toUpperCase()}

                            <span
                              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${prioridadeClasses(
                                lead.prioridade
                              )}`}
                              title={`Prioridade ${
                                PRIORIDADE_LABEL[
                                  lead
                                    .prioridade
                                ]
                              }`}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <Link
                                href={`/admin/leads/${lead.id}`}
                                className="truncate text-[14px] font-bold text-slate-900 transition hover:text-[#365f4d]"
                              >
                                {
                                  lead
                                    .contato
                                    .nome
                                }
                              </Link>

                              <span className="text-[9px] font-semibold text-slate-400">
                                #
                                {String(
                                  lead.numero
                                ).padStart(
                                  6,
                                  "0"
                                )}
                              </span>
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
                              <span className="inline-flex items-center gap-1">
                                <Phone className="h-3 w-3" />

                                {
                                  telefone
                                }
                              </span>

                              <span className="inline-flex items-center gap-1">
                                <Target className="h-3 w-3" />

                                {
                                  ORIGEM_LABEL[
                                    lead
                                      .origem
                                  ]
                                }
                              </span>

                              {lead.finalidade ? (
                                <span className="inline-flex items-center gap-1">
                                  <KeyRound className="h-3 w-3" />

                                  {
                                    FINALIDADE_LABEL[
                                      lead
                                        .finalidade
                                    ]
                                  }
                                </span>
                              ) : null}

                              {lead.responsavelNome ||
                              lead.responsavel?.email ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f6ee] px-2 py-1 font-semibold text-[#527443]">
                                  <Users className="h-3 w-3" />
                                  Resp.{" "}
                                  {lead.responsavelNome ||
                                    lead.responsavel?.email}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.1em] ${temperatureClasses(
                              lead.temperatura
                            )}`}
                          >
                            {lead.temperatura ===
                            "QUENTE"
                              ? "🔥 "
                              : ""}

                            {
                              TEMPERATURA_LABEL[
                                lead
                                  .temperatura
                              ]
                            }
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.08em] ${statusClasses(
                              lead.status
                            )}`}
                          >
                            {
                              STATUS_LABEL[
                                lead
                                  .status
                              ]
                            }
                          </span>
                        </div>
                      </div>

                      {/* =====================================
                          RESULTADO COMERCIAL
                      ===================================== */}

                      {convertido ? (
                        <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2">
                          <BadgeCheck className="h-4 w-4 text-emerald-600" />

                          <div>
                            <p className="text-[10px] font-bold text-emerald-700">
                              {lead.finalidade ===
                              DemandaFinalidade.COMPRAR
                                ? "Venda convertida"
                                : lead.finalidade ===
                                    DemandaFinalidade.ALUGAR
                                  ? "Locação convertida"
                                  : "Negócio convertido"}
                            </p>

                            {lead.convertidoEm ? (
                              <p className="mt-0.5 text-[8px] text-emerald-500">
                                {
                                  formatDate(
                                    lead.convertidoEm
                                  )
                                }
                              </p>
                            ) : null}
                          </div>
                        </div>
                      ) : null}

                      {perdido ? (
                        <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2">
                          <p className="text-[10px] font-bold text-red-700">
                            Não
                            convertido
                          </p>

                          {lead.motivoPerda ? (
                            <p className="mt-0.5 text-[9px] text-red-500">
                              {
                                lead.motivoPerda
                              }
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      {/* =====================================
                          DEMANDA
                      ===================================== */}

                      {demanda ? (
                        <div className="mt-4 rounded-2xl border border-[#e6ece2] bg-[#fafcf9] p-3">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            {demanda
                              .tipoImoveis
                              .length >
                            0 ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                                <House className="h-3.5 w-3.5 text-[#668052]" />

                                {demanda.tipoImoveis
                                  .slice(
                                    0,
                                    2
                                  )
                                  .join(
                                    ", "
                                  )}
                              </span>
                            ) : null}

                            {demanda
                              .bairros
                              .length >
                            0 ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
                                <MapPin className="h-3.5 w-3.5" />

                                {demanda.bairros
                                  .slice(
                                    0,
                                    3
                                  )
                                  .join(
                                    ", "
                                  )}
                              </span>
                            ) : null}

                            {demanda.valorMin !=
                              null ||
                            demanda.valorMax !=
                              null ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#365f4d]">
                                <CircleDollarSign className="h-3.5 w-3.5" />

                                {money(
                                  demanda.valorMin
                                ) ||
                                  "—"}

                                {" → "}

                                {money(
                                  demanda.valorMax
                                ) ||
                                  "Sem limite"}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ) : null}

                      {/* =====================================
                          IMÓVEL RELACIONADO
                      ===================================== */}

                      {lead.imovelOrigem ? (
                        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2.5">
                          <div className="min-w-0">
                            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Imóvel
                              relacionado
                            </p>

                            <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-700">
                              {lead
                                .imovelOrigem
                                .codigo
                                ? `${lead.imovelOrigem.codigo} • `
                                : ""}

                              {
                                lead
                                  .imovelOrigem
                                  .title
                              }
                            </p>
                          </div>

                          <Link
                            href={`/admin/imoveis/${lead.imovelOrigem.id}/editar`}
                            className="shrink-0 text-[9px] font-bold text-[#527443] hover:underline"
                          >
                            Ver imóvel
                          </Link>
                        </div>
                      ) : null}

                      {/* =====================================
                          INDICADORES
                      ===================================== */}

                      <div className="mt-3 flex flex-wrap gap-2">
                        <MiniIndicator
                          label="Interesses"
                          value={
                            lead
                              ._count
                              .interesses
                          }
                        />

                        <MiniIndicator
                          label="Tarefas"
                          value={
                            lead
                              ._count
                              .tarefas
                          }
                        />

                        <MiniIndicator
                          label="Visitas"
                          value={
                            lead
                              ._count
                              .visitas
                          }
                        />

                        <MiniIndicator
                          label="Propostas"
                          value={
                            lead
                              ._count
                              .propostas
                          }
                        />
                      </div>

                      {/* =====================================
                          FOOTER
                      ===================================== */}

                      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                          <Clock3 className="h-3 w-3" />

                          {formatDate(
                            lead.createdAt
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* WHATSAPP */}

                          {waUrl ? (
                            <a
                              href={
                                waUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#bcefd0] bg-[#ecfff3] px-3 text-[10px] font-bold text-[#168a45] transition hover:bg-[#dff9e8]"
                            >
                              <WhatsAppMark className="h-4 w-4 text-[#25D366]" />

                              WhatsApp
                            </a>
                          ) : null}

                          {/* FICHA */}

                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#365f4d] px-3 text-[10px] font-bold text-white transition hover:bg-[#294b3c]"
                          >
                            Ficha

                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>

                          {/* EDITAR */}

                          <Link
                            href={`/admin/leads/${lead.id}?editar=1`}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600 transition hover:border-[#cbd9c5] hover:bg-slate-50 hover:text-[#365f4d]"
                          >
                            <Pencil className="h-3.5 w-3.5" />

                            Editar
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}

          {/* =================================================
              PAGINAÇÃO
          ================================================= */}

          {totalPages > 1 ? (
            <div className="mt-5 flex items-center justify-center gap-2">
              {currentPage >
              1 ? (
                <Link
                  href={pageHref(
                    currentPage -
                      1
                  )}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Anterior
                </Link>
              ) : null}

              <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-[#365f4d] px-3 text-[10px] font-bold text-white">
                {currentPage}
              </span>

              {currentPage <
              totalPages ? (
                <Link
                  href={pageHref(
                    currentPage +
                      1
                  )}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Próxima
                </Link>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   COMPONENTES
========================================================= */

function MetricCard({
  label,
  value,
  icon,
  tone = "green",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;

  tone?:
    | "green"
    | "blue"
    | "red"
    | "violet"
    | "amber"
    | "orange";
}) {
  const tones = {
    green:
      "bg-[#edf4e9] text-[#527443]",

    blue:
      "bg-blue-50 text-blue-600",

    red:
      "bg-red-50 text-red-600",

    violet:
      "bg-violet-50 text-violet-600",

    amber:
      "bg-amber-50 text-amber-600",

    orange:
      "bg-orange-50 text-orange-600",
  };

  return (
    <article className="rounded-[20px] border border-slate-200 bg-white p-3.5 shadow-[0_7px_22px_rgba(15,23,42,0.035)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>

          <p className="mt-1.5 text-[24px] font-bold tracking-[-0.04em] text-slate-950">
            {value}
          </p>
        </div>

        <span
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          {icon}
        </span>
      </div>
    </article>
  );
}

function SelectFilter({
  name,
  value,
  label,
  options,
}: {
  name: string;
  value: string;
  label: string;

  options: Array<{
    value: string;
    label: string;
  }>;
}) {
  return (
    <select
      name={name}
      defaultValue={value}
      className="h-11 rounded-xl border border-slate-200 bg-[#fbfcfb] px-3 text-[10px] font-semibold text-slate-600 outline-none transition focus:border-[#8da37d] focus:ring-4 focus:ring-[#6f895c]/10 lg:col-span-1"
    >
      <option value="">
        {label}
      </option>

      {options.map(
        (option) => (
          <option
            key={
              option.value
            }
            value={
              option.value
            }
          >
            {
              option.label
            }
          </option>
        )
      )}
    </select>
  );
}

function MiniIndicator({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[9px] text-slate-500">
      <strong className="font-bold text-slate-700">
        {value}
      </strong>

      {label}
    </span>
  );
}