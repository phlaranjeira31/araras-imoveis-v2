export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Ban,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Edit3,
  FileText,
  Flame,
  House,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  Target,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  DemandaFinalidade,
  LeadOrigem,
  LeadPrioridade,
  LeadStatus,
  LeadTemperatura,
  InteresseStatus,
  VisitaStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import WhatsAppMark from "@/components/WhatsAppMark";
import CurrencyInput from "../novo/CurrencyInput";
import MultiImovelSelect from "../novo/MultiImovelSelect";

import {
  adicionarInteressesImoveis,
  agendarVisita,
  alterarStatusInteresse,
  alterarStatusVisita,
  atualizarLead,
  marcarConvertido,
  marcarPerdido,
  reabrirLead,
  removerInteresseImovel,
} from "./actions";

import LeadDeleteButton from "./LeadDeleteButton";

type PageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    editar?: string;
    salvo?: string;
    visitaAgendada?: string;
    erroVisita?: string;
    interesses?: string;
  }>;
};

const statusLabel: Record<
  LeadStatus,
  string
> = {
  NOVO: "Novo",
  PRIMEIRO_CONTATO:
    "Primeiro contato",
  EM_ATENDIMENTO:
    "Em atendimento",
  QUALIFICADO: "Qualificado",
  IMOVEIS_ENVIADOS:
    "Imóveis enviados",
  VISITA_AGENDADA:
    "Visita agendada",
  VISITA_REALIZADA:
    "Visita realizada",
  PROPOSTA: "Proposta",
  NEGOCIACAO: "Negociação",
  CONVERTIDO: "Convertido",
  PERDIDO: "Perdido",
  SEM_RETORNO: "Sem retorno",
  SEM_INTERESSE:
    "Sem interesse",
};

const origemLabel: Record<
  LeadOrigem,
  string
> = {
  SITE: "Site",
  WHATSAPP: "WhatsApp",
  TELEFONE: "Telefone",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  GOOGLE: "Google",
  INDICACAO: "Indicação",
  PRESENCIAL: "Presencial",
  PORTAL_IMOBILIARIO:
    "Portal imobiliário",
  PLACA: "Placa",
  EVENTO: "Evento",
  OUTRO: "Outro",
};

const finalidadeLabel: Record<
  DemandaFinalidade,
  string
> = {
  COMPRAR: "Comprar",
  ALUGAR: "Alugar",
  TEMPORADA: "Temporada",
  INVESTIR: "Investir",
  VENDER: "Vender",
};

const interesseStatusLabel: Record<
  InteresseStatus,
  string
> = {
  SUGERIDO: "Sugerido",
  ENVIADO: "Enviado",
  VISUALIZADO: "Visualizado",
  INTERESSADO: "Interessado",
  VISITA_AGENDADA: "Visita agendada",
  VISITA_REALIZADA: "Visita realizada",
  PROPOSTA: "Proposta",
  DESCARTADO: "Descartado",
};

function interesseStatusClasses(
  status: InteresseStatus
) {
  switch (status) {
    case InteresseStatus.SUGERIDO:
      return "border-slate-200 bg-slate-50 text-slate-600";
    case InteresseStatus.ENVIADO:
      return "border-blue-200 bg-blue-50 text-blue-700";
    case InteresseStatus.VISUALIZADO:
      return "border-violet-200 bg-violet-50 text-violet-700";
    case InteresseStatus.INTERESSADO:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case InteresseStatus.VISITA_AGENDADA:
      return "border-amber-200 bg-amber-50 text-amber-700";
    case InteresseStatus.VISITA_REALIZADA:
      return "border-teal-200 bg-teal-50 text-teal-700";
    case InteresseStatus.PROPOSTA:
      return "border-orange-200 bg-orange-50 text-orange-700";
    case InteresseStatus.DESCARTADO:
      return "border-red-200 bg-red-50 text-red-600";
  }
}

function money(
  value?: number | null
) {
  if (
    typeof value !== "number"
  ) {
    return "—";
  }

  return value.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }
  );
}

function whatsappUrl(
  whatsapp?: string | null,
  telefone?: string | null
) {
  let digits = String(
    whatsapp ||
      telefone ||
      ""
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

export default async function LeadPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query =
    await searchParams;

  const editar =
    query.editar === "1";

  const [lead, imoveisDisponiveis] =
    await Promise.all([
      prisma.lead.findUnique({
        where: {
          id,
        },

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
              neighborhood: true,
              city: true,
              price: true,
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

          interesses: {
            orderBy: {
              createdAt: "desc",
            },

            include: {
              imovel: {
                select: {
                  id: true,
                  codigo: true,
                  title: true,
                  neighborhood: true,
                  price: true,
                },
              },
            },
          },

          tarefas: {
            orderBy: {
              dataPrevista: "asc",
            },

            take: 10,
          },

          visitas: {
            orderBy: {
              dataHora: "desc",
            },

            include: {
              imovel: {
                select: {
                  id: true,
                  codigo: true,
                  title: true,
                  neighborhood: true,
                  city: true,
                },
              },
            },
          },

          propostas: {
            orderBy: {
              createdAt: "desc",
            },

            take: 10,
          },

          historicos: {
            orderBy: {
              createdAt: "desc",
            },

            take: 50,
          },
        },
      }),

      prisma.imovel.findMany({
        where: {
          ativo: true,
        },

        orderBy: [
          {
            neighborhood: "asc",
          },
          {
            title: "asc",
          },
        ],

        select: {
          id: true,
          codigo: true,
          title: true,
          neighborhood: true,
          city: true,
          price: true,
        },
      }),
    ]);

  if (!lead) {
    notFound();
  }

  const interesseImovelIds = new Set(
    lead.interesses
      .map((interesse) => interesse.imovelId)
      .filter((imovelId): imovelId is string =>
        Boolean(imovelId)
      )
  );

  const imoveisParaAdicionar =
    imoveisDisponiveis
      .filter(
        (imovel) =>
          !interesseImovelIds.has(imovel.id)
      )
      .map((imovel) => ({
        id: imovel.id,
        codigo: imovel.codigo,
        title: imovel.title,
        neighborhood: imovel.neighborhood,
        city: imovel.city,
        valor:
          typeof imovel.price === "number"
            ? money(imovel.price)
            : null,
      }));

  const demanda =
    lead.demandas[0];

  const waUrl =
    whatsappUrl(
      lead.contato.whatsapp,
      lead.contato.telefone
    );

  const convertido =
    lead.status ===
    LeadStatus.CONVERTIDO;

  const perdido =
    lead.status ===
    LeadStatus.PERDIDO;

  let resultado =
    "Em andamento";

  if (convertido) {
    if (
      lead.finalidade ===
      DemandaFinalidade.COMPRAR
    ) {
      resultado =
        "Venda convertida";
    } else if (
      lead.finalidade ===
      DemandaFinalidade.ALUGAR
    ) {
      resultado =
        "Locação convertida";
    } else {
      resultado =
        "Negócio convertido";
    }
  }

  if (perdido) {
    resultado =
      "Não convertido";
  }

  /* =======================================================
     MODO EDIÇÃO
  ======================================================= */

  if (editar) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f8faf8_0%,#f2f6f3_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
          <Link
            href={`/admin/leads/${id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#527443]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para ficha
          </Link>

          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-950">
              Editar Lead
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              #{String(
                lead.numero
              ).padStart(6, "0")}{" "}
              • {lead.contato.nome}
            </p>
          </div>

          <form
            action={atualizarLead.bind(
              null,
              id
            )}
            className="mt-6 space-y-5"
          >
            <EditSection
              title="Pessoa"
              icon={
                <UserRound className="h-4 w-4" />
              }
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Field
                  name="nome"
                  label="Nome"
                  defaultValue={
                    lead.contato.nome
                  }
                />

                <Field
                  name="telefone"
                  label="Telefone"
                  defaultValue={
                    lead.contato
                      .telefone || ""
                  }
                />

                <Field
                  name="whatsapp"
                  label="WhatsApp"
                  defaultValue={
                    lead.contato
                      .whatsapp || ""
                  }
                />

                <Field
                  name="email"
                  label="E-mail"
                  defaultValue={
                    lead.contato.email ||
                    ""
                  }
                />

                <Field
                  name="cpf"
                  label="CPF"
                  defaultValue={
                    lead.contato.cpf ||
                    ""
                  }
                />
              </div>
            </EditSection>

            <EditSection
              title="Classificação"
              icon={
                <Target className="h-4 w-4" />
              }
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Select
                  name="origem"
                  label="Origem"
                  value={lead.origem}
                >
                  {Object.values(
                    LeadOrigem
                  ).map((value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {
                        origemLabel[
                          value
                        ]
                      }
                    </option>
                  ))}
                </Select>

                <Select
                  name="prioridade"
                  label="Prioridade"
                  value={
                    lead.prioridade
                  }
                >
                  {Object.values(
                    LeadPrioridade
                  ).map((value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ))}
                </Select>

                <Select
                  name="temperatura"
                  label="Temperatura"
                  value={
                    lead.temperatura
                  }
                >
                  {Object.values(
                    LeadTemperatura
                  ).map((value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ))}
                </Select>

                <Select
                  name="finalidade"
                  label="Finalidade"
                  value={
                    lead.finalidade ||
                    DemandaFinalidade.COMPRAR
                  }
                >
                  {Object.values(
                    DemandaFinalidade
                  ).map((value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {
                        finalidadeLabel[
                          value
                        ]
                      }
                    </option>
                  ))}
                </Select>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field
                  name="origemDetalhe"
                  label="Detalhe da origem"
                  defaultValue={
                    lead.origemDetalhe ||
                    ""
                  }
                />

                <Field
                  name="responsavelNome"
                  label="Responsável pelo atendimento"
                  defaultValue={
                    lead.responsavelNome ||
                    lead.responsavel?.email ||
                    ""
                  }
                />
              </div>
            </EditSection>

            <EditSection
              title="Demanda"
              icon={
                <House className="h-4 w-4" />
              }
            >
              <div className="grid gap-3 lg:grid-cols-3">
                <Field
                  name="tipoImoveis"
                  label="Tipos de imóvel"
                  defaultValue={
                    demanda?.tipoImoveis.join(
                      ", "
                    ) || ""
                  }
                />

                <Field
                  name="cidades"
                  label="Cidades"
                  defaultValue={
                    demanda?.cidades.join(
                      ", "
                    ) || ""
                  }
                />

                <Field
                  name="bairros"
                  label="Bairros"
                  defaultValue={
                    demanda?.bairros.join(
                      ", "
                    ) || ""
                  }
                />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <CurrencyInput
                  name="valorMin"
                  label="Valor mínimo"
                  defaultValue={
                    demanda?.valorMin
                  }
                />

                <CurrencyInput
                  name="valorMax"
                  label="Valor máximo"
                  defaultValue={
                    demanda?.valorMax
                  }
                />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  name="quartosMin"
                  label="Quartos mínimos"
                  type="number"
                  defaultValue={
                    demanda?.quartosMin ??
                    ""
                  }
                />

                <Field
                  name="suitesMin"
                  label="Suítes mínimas"
                  type="number"
                  defaultValue={
                    demanda?.suitesMin ??
                    ""
                  }
                />

                <Field
                  name="banheirosMin"
                  label="Banheiros mínimos"
                  type="number"
                  defaultValue={
                    demanda?.banheirosMin ??
                    ""
                  }
                />

                <Field
                  name="vagasMin"
                  label="Vagas mínimas"
                  type="number"
                  defaultValue={
                    demanda?.vagasMin ??
                    ""
                  }
                />
              </div>

              <div className="mt-3">
                <TextArea
                  name="demandaObservacoes"
                  label="Observações da demanda"
                  defaultValue={
                    demanda?.observacoes ||
                    ""
                  }
                />
              </div>
            </EditSection>

            <EditSection
              title="Atendimento"
              icon={
                <FileText className="h-4 w-4" />
              }
            >
              <Field
                name="assunto"
                label="Assunto"
                defaultValue={
                  lead.assunto || ""
                }
              />

              <div className="mt-3">
                <TextArea
                  name="mensagemInicial"
                  label="Mensagem inicial"
                  defaultValue={
                    lead.mensagemInicial ||
                    ""
                  }
                />
              </div>

              <div className="mt-3">
                <TextArea
                  name="observacoes"
                  label="Observações internas"
                  defaultValue={
                    lead.observacoes ||
                    ""
                  }
                />
              </div>
            </EditSection>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#16863c] px-6 text-sm font-bold text-white hover:bg-[#107533]"
              >
                <Save className="h-4 w-4" />
                Salvar alterações
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  /* =======================================================
     FICHA
  ======================================================= */

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8faf8_0%,#f2f6f3_100%)]">
      <div className="mx-auto max-w-[1350px] px-4 py-7 sm:px-6 lg:px-8">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#527443]"
        >
          <ArrowLeft className="h-4 w-4" />
          Central de Leads
        </Link>

        {query.salvo === "1" ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
            Alterações salvas com sucesso.
          </div>
        ) : null}

        {query.visitaAgendada === "1" ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
            Visita agendada com sucesso e registrada no histórico do cliente.
          </div>
        ) : null}

        {query.erroVisita === "data" ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            Informe uma data e um horário válidos para a visita.
          </div>
        ) : null}

        {query.interesses === "adicionados" ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
            Imóvel de interesse adicionado e registrado no histórico do lead.
          </div>
        ) : null}

        {query.interesses === "removido" ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600">
            Imóvel removido dos interesses deste lead. O imóvel continua normalmente na carteira.
          </div>
        ) : null}

        {query.interesses === "status" ? (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-semibold text-blue-700">
            Etapa do imóvel atualizada e registrada no histórico do lead.
          </div>
        ) : null}

        <header className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#365f4d] text-xl font-bold text-white">
              {lead.contato.nome
                .slice(0, 1)
                .toUpperCase()}
            </span>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[30px] font-bold tracking-[-0.04em] text-slate-950">
                  {lead.contato.nome}
                </h1>

                {lead.temperatura ===
                "QUENTE" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[9px] font-bold text-red-600">
                    <Flame className="h-3 w-3" />
                    QUENTE
                  </span>
                ) : null}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>
                  Lead #
                  {String(
                    lead.numero
                  ).padStart(6, "0")}{" "}
                  •{" "}
                  {
                    statusLabel[
                      lead.status
                    ]
                  }
                </span>

                {lead.responsavelNome ||
                lead.responsavel?.email ? (
                  <span className="rounded-full border border-[#dce7d7] bg-[#f1f6ee] px-2.5 py-1 text-[10px] font-semibold text-[#527443]">
                    Responsável:{" "}
                    {lead.responsavelNome ||
                      lead.responsavel?.email}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#25D366] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#1fba58]"
              >
                <WhatsAppMark className="h-5 w-5 text-white" />
                WhatsApp
              </a>
            ) : null}

            <Link
              href={`/admin/leads/${id}?editar=1`}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <Edit3 className="h-4 w-4" />
              Editar
            </Link>

            <LeadDeleteButton
              id={id}
              nome={lead.contato.nome}
            />
          </div>
        </header>

        {/* RESULTADO */}

        <section
          className={`mt-6 rounded-[24px] border p-5 ${
            convertido
              ? "border-emerald-200 bg-emerald-50"
              : perdido
                ? "border-red-200 bg-red-50"
                : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Resultado comercial
              </p>

              <p
                className={`mt-1 text-xl font-bold ${
                  convertido
                    ? "text-emerald-700"
                    : perdido
                      ? "text-red-700"
                      : "text-slate-900"
                }`}
              >
                {resultado}
              </p>

              {lead.convertidoEm ? (
                <p className="mt-1 text-xs text-emerald-600">
                  Convertido em{" "}
                  {lead.convertidoEm.toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              ) : null}

              {lead.motivoPerda ? (
                <p className="mt-1 text-xs text-red-600">
                  Motivo:{" "}
                  {lead.motivoPerda}
                </p>
              ) : null}
            </div>

            {!convertido &&
            !perdido ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <form
                  action={marcarConvertido.bind(
                    null,
                    id
                  )}
                >
                  <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Marcar convertido
                  </button>
                </form>

                <form
                  action={marcarPerdido.bind(
                    null,
                    id
                  )}
                  className="flex gap-2"
                >
                  <input
                    name="motivoPerda"
                    placeholder="Motivo da perda"
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none"
                  />

                  <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-600 hover:bg-red-100">
                    <XCircle className="h-4 w-4" />
                    Não convertido
                  </button>
                </form>
              </div>
            ) : (
              <form
                action={reabrirLead.bind(
                  null,
                  id
                )}
              >
                <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50">
                  <RotateCcw className="h-4 w-4" />
                  Reabrir atendimento
                </button>
              </form>
            )}
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            {/* CONTATO */}

            <Card
              title="Contato"
              icon={
                <UserRound className="h-4 w-4" />
              }
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label="Telefone"
                  value={
                    lead.contato
                      .telefone || "—"
                  }
                  icon={
                    <Phone className="h-3.5 w-3.5" />
                  }
                />

                <Info
                  label="WhatsApp"
                  value={
                    lead.contato
                      .whatsapp || "—"
                  }
                  icon={
                    <WhatsAppMark className="h-4 w-4 text-[#25D366]" />
                  }
                />

                <Info
                  label="E-mail"
                  value={
                    lead.contato.email ||
                    "—"
                  }
                  icon={
                    <Mail className="h-3.5 w-3.5" />
                  }
                />

                <Info
                  label="Origem"
                  value={
                    origemLabel[
                      lead.origem
                    ]
                  }
                  icon={
                    <Target className="h-3.5 w-3.5" />
                  }
                />

                <Info
                  label="Responsável"
                  value={
                    lead.responsavelNome ||
                    lead.responsavel?.email ||
                    "Não atribuído"
                  }
                  icon={
                    <UserRound className="h-3.5 w-3.5" />
                  }
                />
              </div>
            </Card>

            {/* DEMANDA */}

            <Card
              title="Ficha de demanda"
              icon={
                <House className="h-4 w-4" />
              }
            >
              {demanda ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Info
                      label="Finalidade"
                      value={
                        finalidadeLabel[
                          demanda.finalidade
                        ]
                      }
                    />

                    <Info
                      label="Tipo"
                      value={
                        demanda.tipoImoveis.join(
                          ", "
                        ) || "—"
                      }
                    />

                    <Info
                      label="Regiões"
                      value={
                        demanda.bairros.join(
                          ", "
                        ) || "—"
                      }
                      icon={
                        <MapPin className="h-3.5 w-3.5" />
                      }
                    />

                    <Info
                      label="Valor mínimo"
                      value={money(
                        demanda.valorMin
                      )}
                      icon={
                        <CircleDollarSign className="h-3.5 w-3.5" />
                      }
                    />

                    <Info
                      label="Valor máximo"
                      value={money(
                        demanda.valorMax
                      )}
                    />

                    <Info
                      label="Quartos"
                      value={
                        demanda.quartosMin !=
                        null
                          ? `${demanda.quartosMin}+`
                          : "—"
                      }
                    />
                  </div>

                  {demanda.observacoes ? (
                    <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                      {
                        demanda.observacoes
                      }
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-xs text-slate-400">
                  Nenhuma demanda cadastrada.
                </p>
              )}
            </Card>

            {/* INTERESSES */}

            <Card
              title="Imóveis de interesse"
              icon={
                <Building2 className="h-4 w-4" />
              }
            >
              <div className="rounded-2xl border border-[#dce7d7] bg-[#f7faf5] p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Adicionar imóveis à ficha
                    </p>

                    <p className="mt-0.5 text-[9px] leading-4 text-slate-400">
                      Pesquise a carteira e relacione novos imóveis sem precisar editar todo o lead.
                    </p>
                  </div>

                  <span className="mt-2 inline-flex w-fit rounded-full border border-[#dce7d7] bg-white px-2.5 py-1 text-[9px] font-bold text-[#527443] sm:mt-0">
                    {lead.interesses.length}{" "}
                    {lead.interesses.length === 1
                      ? "imóvel relacionado"
                      : "imóveis relacionados"}
                  </span>
                </div>

                {imoveisParaAdicionar.length > 0 ? (
                  <form
                    action={adicionarInteressesImoveis.bind(
                      null,
                      id
                    )}
                    className="mt-4"
                  >
                    <MultiImovelSelect
                      imoveis={
                        imoveisParaAdicionar
                      }
                    />

                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#365f4d] px-4 text-[10px] font-bold text-white transition hover:bg-[#294b3c]"
                      >
                        <Building2 className="h-3.5 w-3.5" />
                        Adicionar selecionados
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-[#cfdcc9] bg-white px-4 py-5 text-center text-[10px] text-slate-400">
                    Todos os imóveis ativos disponíveis já estão relacionados a este lead.
                  </div>
                )}
              </div>

              {lead.interesses.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {lead.interesses.map(
                    (interesse) => {
                      const tituloImovel =
                        interesse.imovel?.title ||
                        interesse.imovelTituloSnapshot ||
                        "Imóvel";

                      const codigoImovel =
                        interesse.imovel?.codigo ||
                        interesse.imovelCodigoSnapshot;

                      return (
                        <div
                          key={interesse.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_5px_16px_rgba(15,23,42,0.025)]"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-bold text-slate-800">
                                  {codigoImovel
                                    ? `${codigoImovel} • `
                                    : ""}
                                  {tituloImovel}
                                </p>

                                <span
                                  className={`rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.08em] ${interesseStatusClasses(
                                    interesse.status
                                  )}`}
                                >
                                  {
                                    interesseStatusLabel[
                                      interesse.status
                                    ]
                                  }
                                </span>
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-slate-400">
                                {interesse.imovel?.neighborhood ? (
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {
                                      interesse.imovel
                                        .neighborhood
                                    }
                                  </span>
                                ) : null}

                                {typeof interesse.imovel?.price ===
                                "number" ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-[#527443]">
                                    <CircleDollarSign className="h-3 w-3" />
                                    {money(
                                      interesse.imovel.price
                                    )}
                                  </span>
                                ) : null}

                                <span>
                                  Origem:{" "}
                                  {interesse.origem
                                    .toLowerCase()
                                    .replaceAll("_", " ")}
                                </span>
                              </div>
                            </div>

                            {interesse.imovel ? (
                              <Link
                                href={`/admin/imoveis/${interesse.imovel.id}/editar`}
                                className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold text-[#527443] transition hover:bg-[#f7faf5]"
                              >
                                Ver imóvel
                              </Link>
                            ) : null}
                          </div>

                          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-3 lg:flex-row lg:items-end lg:justify-between">
                            <form
                              action={alterarStatusInteresse.bind(
                                null,
                                id,
                                interesse.id
                              )}
                              className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end"
                            >
                              <label className="min-w-0 flex-1">
                                <span className="mb-1 block text-[9px] font-semibold text-slate-500">
                                  Etapa deste imóvel
                                </span>

                                <select
                                  name="status"
                                  defaultValue={
                                    interesse.status
                                  }
                                  className="h-9 w-full rounded-lg border border-slate-200 bg-[#fbfcfb] px-2.5 text-[10px] font-semibold text-slate-600 outline-none focus:border-[#8da37d]"
                                >
                                  {Object.values(
                                    InteresseStatus
                                  ).map(
                                    (status) => (
                                      <option
                                        key={status}
                                        value={status}
                                      >
                                        {
                                          interesseStatusLabel[
                                            status
                                          ]
                                        }
                                      </option>
                                    )
                                  )}
                                </select>
                              </label>

                              <button
                                type="submit"
                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#cfdcc9] bg-[#f1f6ee] px-3 text-[9px] font-bold text-[#527443] transition hover:bg-[#e7f0e3]"
                              >
                                <Check className="h-3 w-3" />
                                Atualizar etapa
                              </button>
                            </form>

                            <form
                              action={removerInteresseImovel.bind(
                                null,
                                id,
                                interesse.id
                              )}
                            >
                              <button
                                type="submit"
                                title="Remove apenas o vínculo deste imóvel com o lead. O imóvel não é apagado."
                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-[9px] font-bold text-red-600 transition hover:bg-red-100"
                              >
                                <XCircle className="h-3 w-3" />
                                Remover interesse
                              </button>
                            </form>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                  <p className="text-xs font-semibold text-slate-600">
                    Nenhum imóvel relacionado ainda.
                  </p>

                  <p className="mt-1 text-[9px] text-slate-400">
                    Use a busca acima para começar a montar a seleção deste cliente.
                  </p>
                </div>
              )}
            </Card>

            {/* VISITAS */}

            <Card
              title="Visitas"
              icon={
                <CalendarDays className="h-4 w-4" />
              }
            >
              <div className="rounded-2xl border border-[#dce7d7] bg-[#f7faf5] p-4">
                <div className="flex items-start gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#527443]">
                    <CalendarPlus className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Agendar nova visita
                    </p>

                    <p className="mt-0.5 text-[9px] leading-4 text-slate-400">
                      A visita será vinculada ao cliente e registrada automaticamente no histórico.
                    </p>
                  </div>
                </div>

                <form
                  action={agendarVisita.bind(
                    null,
                    id
                  )}
                  className="mt-4 grid gap-3 lg:grid-cols-2"
                >
                  <label>
                    <span className="mb-1.5 block text-[10px] font-semibold text-slate-600">
                      Data e horário *
                    </span>

                    <input
                      type="datetime-local"
                      name="dataHora"
                      required
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#8da37d] focus:ring-4 focus:ring-[#6f895c]/10"
                    />
                  </label>

                  <label>
                    <span className="mb-1.5 block text-[10px] font-semibold text-slate-600">
                      Duração prevista
                    </span>

                    <select
                      name="duracaoMinutos"
                      defaultValue="60"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#8da37d]"
                    >
                      <option value="30">30 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="90">1h30</option>
                      <option value="120">2 horas</option>
                    </select>
                  </label>

                  <label className="lg:col-span-2">
                    <span className="mb-1.5 block text-[10px] font-semibold text-slate-600">
                      Imóvel da visita
                    </span>

                    <select
                      name="imovelId"
                      defaultValue={
                        lead.imovelOrigem?.id ||
                        lead.interesses.find(
                          (item) => item.imovel?.id
                        )?.imovel?.id ||
                        ""
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#8da37d]"
                    >
                      <option value="">
                        Selecionar imóvel
                      </option>

                      {imoveisDisponiveis.map(
                        (imovel) => (
                          <option
                            key={imovel.id}
                            value={imovel.id}
                          >
                            {[
                              imovel.codigo,
                              imovel.title,
                              imovel.neighborhood,
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                          </option>
                        )
                      )}
                    </select>
                  </label>

                  <label className="lg:col-span-2">
                    <span className="mb-1.5 block text-[10px] font-semibold text-slate-600">
                      Observações da visita
                    </span>

                    <textarea
                      name="observacoesVisita"
                      rows={3}
                      placeholder="Ex.: confirmar com o cliente 1h antes, cliente irá acompanhado..."
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700 outline-none focus:border-[#8da37d] focus:ring-4 focus:ring-[#6f895c]/10"
                    />
                  </label>

                  <div className="lg:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#16863c] px-5 text-xs font-bold text-white transition hover:bg-[#107533]"
                    >
                      <CalendarPlus className="h-4 w-4" />
                      Agendar visita
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-4">
                {lead.visitas.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-400">
                    Nenhuma visita registrada para este cliente.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lead.visitas.map(
                      (visita) => {
                        const tituloImovel =
                          visita.imovel?.title ||
                          visita.imovelTituloSnapshot ||
                          "Imóvel não informado";

                        const codigoImovel =
                          visita.imovel?.codigo ||
                          visita.imovelCodigoSnapshot;

                        return (
                          <div
                            key={visita.id}
                            className="rounded-2xl border border-slate-100 bg-[#fbfcfb] p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-xs font-bold text-slate-800">
                                    {codigoImovel
                                      ? `${codigoImovel} • `
                                      : ""}
                                    {tituloImovel}
                                  </p>

                                  <VisitStatusBadge
                                    status={visita.status}
                                  />
                                </div>

                                <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#365f4d]">
                                  <CalendarDays className="h-3.5 w-3.5" />
                                  {visita.dataHora.toLocaleString(
                                    "pt-BR",
                                    {
                                      timeZone:
                                        "America/Sao_Paulo",
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>

                                <p className="mt-1 text-[9px] text-slate-400">
                                  Duração prevista: {visita.duracaoMinutos} minutos
                                </p>

                                {visita.observacoes ? (
                                  <p className="mt-2 rounded-lg bg-white p-2 text-[10px] leading-4 text-slate-500">
                                    {visita.observacoes}
                                  </p>
                                ) : null}
                              </div>

                              <div className="flex shrink-0 flex-wrap gap-1.5">
                                {visita.status ===
                                VisitaStatus.AGENDADA ? (
                                  <form
                                    action={alterarStatusVisita.bind(
                                      null,
                                      id,
                                      visita.id,
                                      "CONFIRMADA"
                                    )}
                                  >
                                    <button
                                      type="submit"
                                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 text-[9px] font-bold text-blue-700 transition hover:bg-blue-100"
                                    >
                                      <CalendarCheck className="h-3 w-3" />
                                      Confirmar
                                    </button>
                                  </form>
                                ) : null}

                                {visita.status !==
                                  VisitaStatus.REALIZADA &&
                                visita.status !==
                                  VisitaStatus.CANCELADA &&
                                visita.status !==
                                  VisitaStatus.NAO_COMPARECEU ? (
                                  <form
                                    action={alterarStatusVisita.bind(
                                      null,
                                      id,
                                      visita.id,
                                      "REALIZADA"
                                    )}
                                  >
                                    <button
                                      type="submit"
                                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 text-[9px] font-bold text-emerald-700 transition hover:bg-emerald-100"
                                    >
                                      <Check className="h-3 w-3" />
                                      Realizada
                                    </button>
                                  </form>
                                ) : null}

                                {visita.status !==
                                  VisitaStatus.REALIZADA &&
                                visita.status !==
                                  VisitaStatus.CANCELADA &&
                                visita.status !==
                                  VisitaStatus.NAO_COMPARECEU ? (
                                  <form
                                    action={alterarStatusVisita.bind(
                                      null,
                                      id,
                                      visita.id,
                                      "NAO_COMPARECEU"
                                    )}
                                  >
                                    <button
                                      type="submit"
                                      className="inline-flex h-8 items-center rounded-lg border border-amber-200 bg-amber-50 px-2.5 text-[9px] font-bold text-amber-700 transition hover:bg-amber-100"
                                    >
                                      Não compareceu
                                    </button>
                                  </form>
                                ) : null}

                                {visita.status !==
                                  VisitaStatus.REALIZADA &&
                                visita.status !==
                                  VisitaStatus.CANCELADA &&
                                visita.status !==
                                  VisitaStatus.NAO_COMPARECEU ? (
                                  <form
                                    action={alterarStatusVisita.bind(
                                      null,
                                      id,
                                      visita.id,
                                      "CANCELADA"
                                    )}
                                  >
                                    <button
                                      type="submit"
                                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 text-[9px] font-bold text-red-600 transition hover:bg-red-100"
                                    >
                                      <Ban className="h-3 w-3" />
                                      Cancelar
                                    </button>
                                  </form>
                                ) : null}
                              </div>
                            </div>

                            {visita.imovel ? (
                              <div className="mt-3 border-t border-slate-100 pt-3">
                                <Link
                                  href={`/admin/imoveis/${visita.imovel.id}/editar`}
                                  className="text-[9px] font-bold text-[#527443] hover:underline"
                                >
                                  Ver imóvel da visita
                                </Link>
                              </div>
                            ) : null}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* HISTÓRICO */}

          <div className="space-y-5">
            <Card
              title="Resumo"
              icon={
                <BadgeCheck className="h-4 w-4" />
              }
            >
              <div className="grid grid-cols-2 gap-2">
                <Counter
                  label="Interesses"
                  value={
                    lead.interesses
                      .length
                  }
                />

                <Counter
                  label="Tarefas"
                  value={
                    lead.tarefas.length
                  }
                />

                <Counter
                  label="Visitas"
                  value={
                    lead.visitas.length
                  }
                />

                <Counter
                  label="Propostas"
                  value={
                    lead.propostas
                      .length
                  }
                />
              </div>
            </Card>

            <Card
              title="Histórico"
              icon={
                <Clock3 className="h-4 w-4" />
              }
            >
              {lead.historicos.length >
              0 ? (
                <div className="space-y-4">
                  {lead.historicos.map(
                    (historico) => (
                      <div
                        key={
                          historico.id
                        }
                        className="relative border-l border-slate-200 pl-4"
                      >
                        <span className="absolute -left-[4px] top-1 h-2 w-2 rounded-full bg-[#668052]" />

                        <p className="text-xs font-semibold text-slate-700">
                          {
                            historico.descricao
                          }
                        </p>

                        <p className="mt-1 text-[9px] text-slate-400">
                          {historico.createdAt.toLocaleString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Sem histórico.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   COMPONENTES
========================================================= */

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#edf4e9] text-[#527443]">
          {icon}
        </span>

        <h2 className="text-sm font-bold text-slate-900">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-[#fbfcfb] p-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        {icon}
        {value}
      </div>
    </div>
  );
}

function Counter({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-lg font-bold text-slate-950">
        {value}
      </p>

      <p className="text-[9px] text-slate-400">
        {label}
      </p>
    </div>
  );
}



function VisitStatusBadge({
  status,
}: {
  status: VisitaStatus;
}) {
  const styles: Record<
    VisitaStatus,
    string
  > = {
    AGENDADA:
      "border-amber-200 bg-amber-50 text-amber-700",
    CONFIRMADA:
      "border-blue-200 bg-blue-50 text-blue-700",
    REALIZADA:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    CANCELADA:
      "border-red-200 bg-red-50 text-red-600",
    NAO_COMPARECEU:
      "border-slate-200 bg-slate-100 text-slate-600",
  };

  const labels: Record<
    VisitaStatus,
    string
  > = {
    AGENDADA: "Agendada",
    CONFIRMADA: "Confirmada",
    REALIZADA: "Realizada",
    CANCELADA: "Cancelada",
    NAO_COMPARECEU:
      "Não compareceu",
  };

  return (
    <span
      className={`rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function EditSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.025)]">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#edf4e9] text-[#527443]">
          {icon}
        </span>

        <h2 className="text-sm font-bold">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue:
    | string
    | number;
  type?: string;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[10px] font-semibold text-slate-600">
        {label}
      </span>

      <input
        name={name}
        type={type}
        defaultValue={
          defaultValue
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-[#fbfcfb] px-3 text-xs outline-none focus:border-[#8da37d] focus:ring-4 focus:ring-[#6f895c]/10"
      />
    </label>
  );
}

function Select({
  name,
  label,
  value,
  children,
}: {
  name: string;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[10px] font-semibold text-slate-600">
        {label}
      </span>

      <select
        name={name}
        defaultValue={value}
        className="h-11 w-full rounded-xl border border-slate-200 bg-[#fbfcfb] px-3 text-xs"
      >
        {children}
      </select>
    </label>
  );
}

function TextArea({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[10px] font-semibold text-slate-600">
        {label}
      </span>

      <textarea
        name={name}
        defaultValue={
          defaultValue
        }
        rows={4}
        className="w-full rounded-xl border border-slate-200 bg-[#fbfcfb] p-3 text-xs leading-5"
      />
    </label>
  );
}