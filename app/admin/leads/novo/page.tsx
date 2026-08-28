export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";

import {
  ArrowLeft,
  Building2,
  CircleDollarSign,
  FileText,
  House,
  MapPin,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Users,
} from "lucide-react";

import {
  DemandaFinalidade,
  LeadOrigem,
  LeadPrioridade,
  LeadTemperatura,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { criarLead } from "./actions";

import CurrencyInput from "./CurrencyInput";
import MultiImovelSelect from "./MultiImovelSelect";

type PageProps = {
  searchParams: Promise<{
    erro?: string;
  }>;
};

const ORIGENS = [
  [LeadOrigem.WHATSAPP, "WhatsApp"],
  [LeadOrigem.TELEFONE, "Telefone"],
  [LeadOrigem.INDICACAO, "Indicação"],
  [LeadOrigem.INSTAGRAM, "Instagram"],
  [LeadOrigem.FACEBOOK, "Facebook"],
  [LeadOrigem.GOOGLE, "Google"],
  [LeadOrigem.SITE, "Site"],
  [
    LeadOrigem.PORTAL_IMOBILIARIO,
    "Portal imobiliário",
  ],
  [LeadOrigem.PRESENCIAL, "Presencial"],
  [LeadOrigem.PLACA, "Placa"],
  [LeadOrigem.EVENTO, "Evento"],
  [LeadOrigem.OUTRO, "Outro"],
] as const;

const FINALIDADES = [
  [DemandaFinalidade.COMPRAR, "Comprar"],
  [DemandaFinalidade.ALUGAR, "Alugar"],
  [
    DemandaFinalidade.TEMPORADA,
    "Temporada",
  ],
  [DemandaFinalidade.INVESTIR, "Investir"],
  [DemandaFinalidade.VENDER, "Vender"],
] as const;

const PRIORIDADES = [
  [LeadPrioridade.BAIXA, "Baixa"],
  [LeadPrioridade.NORMAL, "Normal"],
  [LeadPrioridade.ALTA, "Alta"],
  [LeadPrioridade.URGENTE, "Urgente"],
] as const;

const TEMPERATURAS = [
  [LeadTemperatura.FRIO, "Frio"],
  [LeadTemperatura.MORNO, "Morno"],
  [LeadTemperatura.QUENTE, "Quente"],
] as const;

function money(value?: number | null) {
  if (typeof value !== "number") {
    return null;
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default async function NovoLeadPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const [imoveis, usuarios] =
    await Promise.all([
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
          priceRent: true,
          purpose: true,
        },
      }),

      prisma.user.findMany({
        orderBy: {
          email: "asc",
        },

        select: {
          id: true,
          email: true,
        },
      }),
    ]);

  const errorMessage =
    params.erro === "nome"
      ? "Informe o nome da pessoa."
      : params.erro ===
          "contato"
        ? "Informe pelo menos telefone, WhatsApp ou e-mail."
        : params.erro ===
            "finalidade"
          ? "Informe a finalidade da oportunidade."
          : null;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8faf8_0%,#f2f6f3_100%)]">
      <div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-6 lg:px-8">
        {/* TOPO */}

        <header className="flex flex-col gap-5 rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#527443] transition hover:text-[#365f4d]"
            >
              <ArrowLeft className="h-4 w-4" />

              Voltar para leads
            </Link>

            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#365f4d] text-white">
                <UserRound className="h-5 w-5" />
              </span>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[28px] font-bold tracking-[-0.04em] text-slate-950 sm:text-[32px]">
                    Novo Lead
                  </h1>

                  <span className="rounded-full border border-[#dce7d7] bg-[#f1f6ee] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#668052]">
                    Araras CRM
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Cadastre uma nova oportunidade
                  comercial e sua demanda.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/admin/leads"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </Link>
        </header>

        {errorMessage ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <form
          action={criarLead}
          className="mt-6 space-y-5"
        >
          {/* =================================================
              PESSOA
          ================================================= */}

          <SectionCard
            icon={
              <Users className="h-4 w-4" />
            }
            title="Dados da pessoa"
            description="Informações principais para contato e identificação."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Nome completo"
                name="nome"
                required
                placeholder="Ex.: João da Silva"
              />

              <Field
                label="Telefone"
                name="telefone"
                type="tel"
                placeholder="(24) 99999-9999"
              />

              <Field
                label="WhatsApp"
                name="whatsapp"
                type="tel"
                placeholder="(24) 99999-9999"
              />

              <Field
                label="E-mail"
                name="email"
                type="email"
                placeholder="cliente@email.com"
              />

              <Field
                label="CPF"
                name="cpf"
                placeholder="Opcional"
              />

              <SelectField
                label="Consentimento para contato"
                name="consentimentoContato"
                defaultValue=""
              >
                <option value="">
                  Não informado
                </option>

                <option value="true">
                  Sim
                </option>

                <option value="false">
                  Não
                </option>
              </SelectField>
            </div>

            <div className="mt-3">
              <Field
                label="Origem do consentimento"
                name="origemConsentimento"
                placeholder="Ex.: contato telefônico, formulário do site..."
              />
            </div>
          </SectionCard>

          {/* =================================================
              ORIGEM / CLASSIFICAÇÃO
          ================================================= */}

          <SectionCard
            icon={
              <Target className="h-4 w-4" />
            }
            title="Origem e classificação"
            description="Identifique de onde veio e o nível atual da oportunidade."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <SelectField
                label="Origem"
                name="origem"
                defaultValue={
                  LeadOrigem.WHATSAPP
                }
                required
              >
                {ORIGENS.map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </SelectField>

              <Field
                label="Detalhe da origem"
                name="origemDetalhe"
                placeholder="Ex.: indicação de Maria"
              />

              <SelectField
                label="Finalidade"
                name="finalidade"
                defaultValue={
                  DemandaFinalidade.COMPRAR
                }
                required
              >
                {FINALIDADES.map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </SelectField>

              <SelectField
                label="Prioridade"
                name="prioridade"
                defaultValue={
                  LeadPrioridade.NORMAL
                }
              >
                {PRIORIDADES.map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </SelectField>

              <SelectField
                label="Temperatura"
                name="temperatura"
                defaultValue={
                  LeadTemperatura.MORNO
                }
              >
                {TEMPERATURAS.map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </SelectField>

            </div>

            <div className="mt-4 rounded-2xl border border-[#dfe9da] bg-[#f8fbf6] p-4">
              <div className="mb-3">
                <p className="text-[11px] font-bold text-slate-800">
                  Responsável pelo atendimento
                </p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  Escreva o nome de quem está conduzindo esse lead. O vínculo com um usuário do sistema continua opcional.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Nome do responsável"
                  name="responsavelNome"
                  placeholder="Ex.: Claudia, Lidiane, Pedro..."
                  helper="Esse nome será exibido na ficha e poderá ser usado nos filtros da Central de Leads."
                />

                <SelectField
                  label="Usuário do sistema (opcional)"
                  name="responsavelId"
                  defaultValue=""
                >
                  <option value="">
                    Nenhum usuário vinculado
                  </option>

                  {usuarios.map(
                    (usuario) => (
                      <option
                        key={usuario.id}
                        value={usuario.id}
                      >
                        {usuario.email}
                      </option>
                    )
                  )}
                </SelectField>
              </div>
            </div>
          </SectionCard>

          {/* =================================================
              DEMANDA
          ================================================= */}

          <SectionCard
            icon={
              <House className="h-4 w-4" />
            }
            title="Ficha de demanda"
            description="O que exatamente essa pessoa procura?"
          >
            <div className="grid gap-3 lg:grid-cols-3">
              <Field
                label="Tipos de imóvel"
                name="tipoImoveis"
                placeholder="Casa, Apartamento, Terreno"
                helper="Separe mais de um tipo por vírgula."
              />

              <Field
                label="Cidades"
                name="cidades"
                placeholder="Petrópolis"
                helper="Separe por vírgula."
              />

              <Field
                label="Bairros / regiões"
                name="bairros"
                placeholder="Itaipava, Araras, Corrêas"
                helper="Separe por vírgula."
              />
            </div>

            <div className="mt-5 flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-[#668052]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#668052]">
                Faixa de investimento
              </p>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
  <CurrencyInput
    label="Valor mínimo"
    name="valorMin"
    placeholder="R$ 1.500.000"
  />

  <CurrencyInput
    label="Valor máximo"
    name="valorMax"
    placeholder="R$ 2.000.000"
  />
</div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Quartos mínimos"
                name="quartosMin"
                type="number"
                min="0"
              />

              <Field
                label="Suítes mínimas"
                name="suitesMin"
                type="number"
                min="0"
              />

              <Field
                label="Banheiros mínimos"
                name="banheirosMin"
                type="number"
                min="0"
              />

              <Field
                label="Vagas mínimas"
                name="vagasMin"
                type="number"
                min="0"
              />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Área construída mínima"
                name="areaConstruidaMin"
                type="number"
                min="0"
                suffix="m²"
              />

              <Field
                label="Área construída máxima"
                name="areaConstruidaMax"
                type="number"
                min="0"
                suffix="m²"
              />

              <Field
                label="Área terreno mínima"
                name="areaTerrenoMin"
                type="number"
                min="0"
                suffix="m²"
              />

              <Field
                label="Área terreno máxima"
                name="areaTerrenoMax"
                type="number"
                min="0"
                suffix="m²"
              />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <BooleanSelect
                label="Mobiliado"
                name="mobiliado"
              />

              <BooleanSelect
                label="Deseja condomínio"
                name="desejaCondominio"
              />

              <BooleanSelect
                label="Aceita reforma"
                name="aceitaReforma"
              />
            </div>

            <div className="mt-3">
              <TextArea
                label="Observações da demanda"
                name="demandaObservacoes"
                placeholder="Ex.: prefere rua tranquila, aceita pequena reforma, precisa de área externa..."
                rows={3}
              />
            </div>
          </SectionCard>

          {/* =================================================
              IMÓVEIS ESPECÍFICOS
          ================================================= */}

          <SectionCard
            icon={
              <Building2 className="h-4 w-4" />
            }
            title="Imóveis específicos"
            description="Se esse lead já demonstrou interesse em um ou mais imóveis da carteira, relacione todos aqui."
          >
            <MultiImovelSelect
              imoveis={imoveis.map((imovel) => {
                const isRent =
                  String(
                    imovel.purpose ||
                      ""
                  ).toLowerCase() ===
                  "alugar";

                const value =
                  isRent
                    ? imovel.priceRent
                    : imovel.price;

                return {
                  id: imovel.id,
                  codigo: imovel.codigo,
                  title: imovel.title,
                  neighborhood: imovel.neighborhood,
                  city: imovel.city,
                  valor: money(value),
                };
              })}
            />

            <p className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
              <MapPin className="h-3 w-3" />

              {imoveis.length} imóveis ativos disponíveis para relacionamento.
            </p>
          </SectionCard>

          {/* =================================================
              ATENDIMENTO
          ================================================= */}

          <SectionCard
            icon={
              <FileText className="h-4 w-4" />
            }
            title="Atendimento inicial"
            description="Registre o contexto do primeiro contato."
          >
            <Field
              label="Assunto"
              name="assunto"
              placeholder="Ex.: Procura casa em Itaipava até R$ 2 milhões"
            />

            <div className="mt-3">
              <TextArea
                label="Mensagem inicial"
                name="mensagemInicial"
                placeholder="Cole ou descreva a primeira mensagem recebida..."
                rows={4}
              />
            </div>

            <div className="mt-3">
              <TextArea
                label="Observações internas"
                name="observacoes"
                placeholder="Informações importantes para o atendimento..."
                rows={4}
              />
            </div>
          </SectionCard>

          {/* =================================================
              SEGURANÇA / SALVAR
          ================================================= */}

          <section className="rounded-[24px] border border-[#dce7d7] bg-[#f5f9f3] p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#527443]">
                  <ShieldCheck className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Cadastro seguro
                  </p>

                  <p className="mt-1 max-w-xl text-[10px] leading-4 text-slate-500">
                    Pessoa, lead, demanda, interesse e histórico serão gravados em uma única transação. Se alguma etapa falhar, o cadastro não ficará incompleto.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#16863c] px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#107533]"
              >
                <Save className="h-4 w-4" />
                Salvar Lead
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}

/* =========================================================
   COMPONENTES
========================================================= */

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)] sm:p-6">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf4e9] text-[#527443]">
          {icon}
        </span>

        <div>
          <h2 className="text-[16px] font-bold tracking-[-0.02em] text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-[11px] leading-4 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  helper,
  min,
  suffix,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helper?: string;
  min?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-slate-700">
        {label}
        {required ? (
          <span className="ml-1 text-red-500">
            *
          </span>
        ) : null}
      </span>

      <div className="relative">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          min={min}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 hover:border-slate-300 focus:border-[#8da37d] focus:ring-4 focus:ring-[#6f895c]/10"
        />

        {suffix ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
            {suffix}
          </span>
        ) : null}
      </div>

      {helper ? (
        <span className="mt-1 block text-[9px] text-slate-400">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  required,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-slate-700">
        {label}

        {required ? (
          <span className="ml-1 text-red-500">
            *
          </span>
        ) : null}
      </span>

      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-[#8da37d] focus:ring-4 focus:ring-[#6f895c]/10"
      >
        {children}
      </select>
    </label>
  );
}

function BooleanSelect({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  return (
    <SelectField
      label={label}
      name={name}
      defaultValue=""
    >
      <option value="">
        Não informado
      </option>

      <option value="true">
        Sim
      </option>

      <option value="false">
        Não
      </option>
    </SelectField>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  rows,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-slate-700">
        {label}
      </span>

      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-5 text-slate-700 outline-none transition placeholder:text-slate-300 hover:border-slate-300 focus:border-[#8da37d] focus:ring-4 focus:ring-[#6f895c]/10"
      />
    </label>
  );
}