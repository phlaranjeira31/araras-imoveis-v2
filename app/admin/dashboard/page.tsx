export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  CarFront,
  CircleDollarSign,
  Clock3,
  Eye,
  Home,
  ImageOff,
  KeyRound,
  LayoutDashboard,
  MapPin,
  Ruler,
  Sparkles,
  Star,
  TrendingUp,
  TriangleAlert,
  WalletCards,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

/* =========================================================
   HELPERS
========================================================= */

function formatBRL(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "R$ 0";
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatCompactBRL(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "R$ 0";
  }

  if (value >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000)
      .toFixed(1)
      .replace(".", ",")} bi`;
  }

  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000)
      .toFixed(1)
      .replace(".", ",")} mi`;
  }

  if (value >= 1_000) {
    return `R$ ${(value / 1_000)
      .toFixed(0)
      .replace(".", ",")} mil`;
  }

  return formatBRL(value);
}

function formatNumber(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString("pt-BR");
}

function getAverage(values: number[]) {
  if (!values.length) return 0;

  return (
    values.reduce((total, value) => total + value, 0) /
    values.length
  );
}

function getMedian(values: number[]) {
  if (!values.length) return 0;

  const ordered = [...values].sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);

  if (ordered.length % 2 === 0) {
    return (ordered[middle - 1] + ordered[middle]) / 2;
  }

  return ordered[middle];
}

function percentage(value: number, total: number) {
  if (!total) return 0;

  return Math.round((value / total) * 100);
}

function normalizePurpose(value?: string | null) {
  return String(value ?? "").trim().toLowerCase();
}

/* =========================================================
   STAT CARD
========================================================= */

type StatCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  icon: ReactNode;
  tone?: "green" | "blue" | "orange" | "red" | "neutral";
};

function StatCard({
  label,
  value,
  helper,
  icon,
  tone = "green",
}: StatCardProps) {
  const tones = {
    green: {
      icon: "bg-[#eaf2e5] text-[#4f7041]",
      border: "border-[#dde8d8]",
    },

    blue: {
      icon: "bg-sky-50 text-sky-700",
      border: "border-sky-100",
    },

    orange: {
      icon: "bg-amber-50 text-amber-700",
      border: "border-amber-100",
    },

    red: {
      icon: "bg-red-50 text-red-600",
      border: "border-red-100",
    },

    neutral: {
      icon: "bg-slate-100 text-slate-600",
      border: "border-slate-200",
    },
  };

  const style = tones[tone];

  return (
    <article
      className={`
        relative overflow-hidden rounded-[22px] border bg-white p-4
        shadow-[0_8px_25px_rgba(15,23,42,0.04)]
        transition duration-300 hover:-translate-y-0.5
        hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]
        ${style.border}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 truncate text-[26px] font-bold tracking-[-0.035em] text-slate-950">
            {value}
          </p>

          {helper ? (
            <p className="mt-1 text-[11px] leading-4 text-slate-500">
              {helper}
            </p>
          ) : null}
        </div>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
        >
          {icon}
        </span>
      </div>
    </article>
  );
}

/* =========================================================
   FINANCIAL CARD
========================================================= */

function FinancialCard({
  label,
  value,
  helper,
  featured = false,
}: {
  label: string;
  value: string;
  helper?: string;
  featured?: boolean;
}) {
  return (
    <article
      className={
        featured
          ? "rounded-[20px] border border-[#d8e5d2] bg-[linear-gradient(135deg,#eef5ea_0%,#f8fbf6_100%)] p-4"
          : "rounded-[20px] border border-slate-100 bg-white p-4"
      }
    >
      <p
        className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${
          featured ? "text-[#668052]" : "text-slate-400"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold tracking-[-0.03em] ${
          featured ? "text-[#365f4d]" : "text-slate-950"
        }`}
      >
        {value}
      </p>

      {helper ? (
        <p className="mt-1 text-[11px] leading-4 text-slate-500">
          {helper}
        </p>
      ) : null}
    </article>
  );
}

/* =========================================================
   RANKING
========================================================= */

type BarItem = {
  label: string;
  value: number;
  href?: string;
};

function RankingList({
  title,
  description,
  items,
  icon,
}: {
  title: string;
  description: string;
  items: BarItem[];
  icon: ReactNode;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-bold tracking-[-0.02em] text-slate-950">
            {title}
          </h2>

          <p className="mt-1 text-[11px] text-slate-500">
            {description}
          </p>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf4e9] text-[#527443]">
          {icon}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
            Nenhum dado disponível.
          </p>
        ) : (
          items.map((item, index) => {
            const barPercentage = Math.max(
              3,
              Math.round((item.value / max) * 100)
            );

            const content = (
              <>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#edf4e9] text-[9px] font-bold text-[#527443]">
                      {index + 1}
                    </span>

                    <span className="truncate text-[12px] font-semibold text-slate-700">
                      {item.label}
                    </span>
                  </div>

                  <span className="shrink-0 text-[11px] font-bold text-[#365f4d]">
                    {item.value}
                  </span>
                </div>

                <div className="h-[7px] overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8ca27a] to-[#365f4d]"
                    style={{
                      width: `${barPercentage}%`,
                    }}
                  />
                </div>
              </>
            );

            if (item.href) {
              return (
                <Link
                  href={item.href}
                  key={`${item.label}-${index}`}
                  className="block rounded-xl p-1 transition hover:bg-[#fafcf9]"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={`${item.label}-${index}`}>{content}</div>
            );
          })
        )}
      </div>
    </section>
  );
}

/* =========================================================
   DONUT ATIVOS / INATIVOS
========================================================= */

function StatusChart({
  ativos,
  inativos,
}: {
  ativos: number;
  inativos: number;
}) {
  const total = ativos + inativos;
  const ativoPercent = percentage(ativos, total);

  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)]">
      <div>
        <h2 className="text-[17px] font-bold tracking-[-0.02em] text-slate-950">
          Status da carteira
        </h2>

        <p className="mt-1 text-[11px] text-slate-500">
          Relação entre imóveis ativos e inativos.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
        <div
          className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(
              #365f4d 0% ${ativoPercent}%,
              #d8dee0 ${ativoPercent}% 100%
            )`,
          }}
        >
          <div className="flex h-[116px] w-[116px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
            <span className="text-[29px] font-bold tracking-[-0.04em] text-slate-950">
              {ativoPercent}%
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              ativos
            </span>
          </div>
        </div>

        <div className="w-full max-w-[230px] space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-[#f4f8f1] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#365f4d]" />

              <span className="text-xs font-semibold text-slate-600">
                Ativos
              </span>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-slate-950">
                {ativos}
              </p>

              <p className="text-[9px] text-slate-400">
                {percentage(ativos, total)}%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />

              <span className="text-xs font-semibold text-slate-600">
                Inativos
              </span>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-slate-950">
                {inativos}
              </p>

              <p className="text-[9px] text-slate-400">
                {percentage(inativos, total)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   DONUT VENDA / LOCAÇÃO
========================================================= */

function PurposeChart({
  venda,
  aluguel,
  outros,
}: {
  venda: number;
  aluguel: number;
  outros: number;
}) {
  const total = venda + aluguel + outros;

  const vendaPercent = percentage(venda, total);
  const aluguelPercent = percentage(aluguel, total);

  const endVenda = vendaPercent;
  const endAluguel = Math.min(100, vendaPercent + aluguelPercent);

  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)]">
      <div>
        <h2 className="text-[17px] font-bold tracking-[-0.02em] text-slate-950">
          Finalidade dos imóveis
        </h2>

        <p className="mt-1 text-[11px] text-slate-500">
          Distribuição entre venda e locação.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
        <div
          className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(
              #365f4d 0% ${endVenda}%,
              #6da5c8 ${endVenda}% ${endAluguel}%,
              #dce2df ${endAluguel}% 100%
            )`,
          }}
        >
          <div className="flex h-[116px] w-[116px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
            <span className="text-[28px] font-bold tracking-[-0.04em] text-slate-950">
              {total}
            </span>

            <span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-400">
              imóveis
            </span>
          </div>
        </div>

        <div className="w-full max-w-[230px] space-y-3">
          <LegendRow
            colorClass="bg-[#365f4d]"
            label="Venda"
            value={venda}
            pct={percentage(venda, total)}
          />

          <LegendRow
            colorClass="bg-[#6da5c8]"
            label="Locação"
            value={aluguel}
            pct={percentage(aluguel, total)}
          />

          {outros > 0 ? (
            <LegendRow
              colorClass="bg-slate-300"
              label="Outros"
              value={outros}
              pct={percentage(outros, total)}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function LegendRow({
  colorClass,
  label,
  value,
  pct,
}: {
  colorClass: string;
  label: string;
  value: number;
  pct: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />

        <span className="text-xs font-semibold text-slate-600">
          {label}
        </span>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-slate-950">{value}</p>

        <p className="text-[9px] text-slate-400">{pct}%</p>
      </div>
    </div>
  );
}

/* =========================================================
   EVOLUÇÃO MENSAL
========================================================= */

type MonthItem = {
  label: string;
  value: number;
};

function MonthlyChart({
  items,
}: {
  items: MonthItem[];
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-bold tracking-[-0.02em] text-slate-950">
            Evolução dos cadastros
          </h2>

          <p className="mt-1 text-[11px] text-slate-500">
            Novos imóveis cadastrados nos últimos 6 meses.
          </p>
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf4e9] text-[#527443]">
          <TrendingUp className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-7 flex h-[185px] items-end gap-3">
        {items.map((item) => {
          const height = Math.max(
            10,
            Math.round((item.value / max) * 130)
          );

          return (
            <div
              key={item.label}
              className="flex min-w-0 flex-1 flex-col items-center justify-end"
            >
              <span className="mb-2 text-[10px] font-bold text-slate-600">
                {item.value}
              </span>

              <div className="flex h-[130px] w-full max-w-12 items-end rounded-t-lg bg-slate-50">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#365f4d] to-[#829a6e]"
                  style={{
                    height,
                  }}
                />
              </div>

              <span className="mt-2 truncate text-[9px] font-semibold uppercase text-slate-400">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================
   QUALIDADE
========================================================= */

function QualityItem({
  label,
  value,
  total,
  goodWhenZero = true,
}: {
  label: string;
  value: number;
  total: number;
  goodWhenZero?: boolean;
}) {
  const pct = percentage(value, total);

  const good =
    goodWhenZero && value === 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-[#fbfcfb] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-600">
          {label}
        </p>

        <span
          className={`text-lg font-bold ${
            good
              ? "text-[#365f4d]"
              : value > 0
                ? "text-amber-600"
                : "text-slate-900"
          }`}
        >
          {value}
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            value === 0
              ? "bg-[#365f4d]"
              : "bg-amber-500"
          }`}
          style={{
            width: value === 0 ? "100%" : `${Math.max(3, pct)}%`,
          }}
        />
      </div>

      <p className="mt-2 text-[9px] text-slate-400">
        {value === 0
          ? "Nenhuma pendência"
          : `${pct}% da base`}
      </p>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminDashboardPage() {
  const imoveis = await prisma.imovel.findMany({
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      title: true,

      city: true,
      neighborhood: true,

      price: true,
      priceRent: true,

      tipo: true,
      purpose: true,

      ativo: true,
      featured: true,

      createdAt: true,
      updatedAt: true,

      coverPhotoId: true,

      quartos: true,
      banheiros: true,
      vagas: true,

      areaConstruida: true,
      areaTerreno: true,

      codigo: true,

      photos: {
        select: {
          id: true,
        },
      },
    },
  });

  /* =======================================================
     CARTEIRA
  ======================================================= */

  const total = imoveis.length;

  const ativos = imoveis.filter(
    (imovel) => imovel.ativo
  ).length;

  const inativos = total - ativos;

  const destacados = imoveis.filter(
    (imovel) => imovel.featured
  ).length;

  const vendaImoveis = imoveis.filter(
    (imovel) =>
      normalizePurpose(imovel.purpose) === "comprar"
  );

  const aluguelImoveis = imoveis.filter(
    (imovel) =>
      normalizePurpose(imovel.purpose) === "alugar"
  );

  const venda = vendaImoveis.length;
  const aluguel = aluguelImoveis.length;

  const outros = Math.max(
    0,
    total - venda - aluguel
  );

  const ativosPercent = percentage(ativos, total);

  /* =======================================================
     TEMPO / ATIVIDADE
  ======================================================= */

  const agora = new Date();

  const inicioMes = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    1
  );

  const trintaDiasAtras = new Date(agora);
  trintaDiasAtras.setDate(
    trintaDiasAtras.getDate() - 30
  );

  const noventaDiasAtras = new Date(agora);
  noventaDiasAtras.setDate(
    noventaDiasAtras.getDate() - 90
  );

  const novosMes = imoveis.filter(
    (imovel) =>
      new Date(imovel.createdAt) >= inicioMes
  ).length;

  const atualizados30Dias = imoveis.filter(
    (imovel) =>
      new Date(imovel.updatedAt) >= trintaDiasAtras
  ).length;

  const semAtualizacao90Dias = imoveis.filter(
    (imovel) =>
      new Date(imovel.updatedAt) < noventaDiasAtras
  ).length;

  /* =======================================================
     FINANCEIRO - VENDA
  ======================================================= */

  const vendaComPreco = imoveis.filter(
    (imovel) =>
      normalizePurpose(imovel.purpose) !== "alugar" &&
      typeof imovel.price === "number" &&
      imovel.price > 0
  );

  const valoresVenda = vendaComPreco.map(
    (imovel) => imovel.price as number
  );

  const vendaAtivaComPreco = vendaComPreco.filter(
    (imovel) => imovel.ativo
  );

  const vendaInativaComPreco = vendaComPreco.filter(
    (imovel) => !imovel.ativo
  );

  const valoresVendaAtivos =
    vendaAtivaComPreco.map(
      (imovel) => imovel.price as number
    );

  const valoresVendaInativos =
    vendaInativaComPreco.map(
      (imovel) => imovel.price as number
    );

  const valorCarteiraVenda =
    valoresVenda.reduce(
      (sum, value) => sum + value,
      0
    );

  const valorCarteiraAtiva =
    valoresVendaAtivos.reduce(
      (sum, value) => sum + value,
      0
    );

  const valorCarteiraInativa =
    valoresVendaInativos.reduce(
      (sum, value) => sum + value,
      0
    );

  const valorMedioVenda =
    getAverage(valoresVenda);

  const valorMedioAtivos =
    getAverage(valoresVendaAtivos);

  const medianaVenda =
    getMedian(valoresVenda);

  const maiorValor =
    valoresVenda.length > 0
      ? Math.max(...valoresVenda)
      : 0;

  const menorValor =
    valoresVenda.length > 0
      ? Math.min(...valoresVenda)
      : 0;

  /* =======================================================
     FINANCEIRO - LOCAÇÃO
  ======================================================= */

  const aluguelComPreco = aluguelImoveis.filter(
    (imovel) =>
      typeof imovel.priceRent === "number" &&
      imovel.priceRent > 0
  );

  const alugueisAtivosComPreco =
    aluguelComPreco.filter(
      (imovel) => imovel.ativo
    );

  const valoresAluguel =
    aluguelComPreco.map(
      (imovel) => imovel.priceRent as number
    );

  const valoresAluguelAtivos =
    alugueisAtivosComPreco.map(
      (imovel) => imovel.priceRent as number
    );

  const aluguelMedio =
    getAverage(valoresAluguel);

  const somaMensalAlugueis =
    valoresAluguelAtivos.reduce(
      (sum, value) => sum + value,
      0
    );

  const potencialAnualLocacao =
    somaMensalAlugueis * 12;

  const maiorAluguel =
    valoresAluguel.length > 0
      ? Math.max(...valoresAluguel)
      : 0;

  /* =======================================================
     PREÇO POR M²
  ======================================================= */

  const valoresM2 = imoveis
    .filter(
      (imovel) =>
        imovel.ativo &&
        normalizePurpose(imovel.purpose) !== "alugar" &&
        typeof imovel.price === "number" &&
        imovel.price > 0 &&
        typeof imovel.areaConstruida === "number" &&
        imovel.areaConstruida > 0
    )
    .map(
      (imovel) =>
        (imovel.price as number) /
        (imovel.areaConstruida as number)
    );

  const precoMedioM2 =
    getAverage(valoresM2);

  /* =======================================================
     ÁREAS
  ======================================================= */

  const areasConstruidas = imoveis
    .filter(
      (imovel) =>
        typeof imovel.areaConstruida === "number" &&
        imovel.areaConstruida > 0
    )
    .map(
      (imovel) =>
        imovel.areaConstruida as number
    );

  const areasTerreno = imoveis
    .filter(
      (imovel) =>
        typeof imovel.areaTerreno === "number" &&
        imovel.areaTerreno > 0
    )
    .map(
      (imovel) =>
        imovel.areaTerreno as number
    );

  const areaMediaConstruida =
    getAverage(areasConstruidas);

  const areaMediaTerreno =
    getAverage(areasTerreno);

  /* =======================================================
     QUALIDADE DOS CADASTROS
  ======================================================= */

  const semFoto = imoveis.filter(
    (imovel) => imovel.photos.length === 0
  ).length;

  const semCapa = imoveis.filter(
    (imovel) => !imovel.coverPhotoId
  ).length;

  const semBairro = imoveis.filter(
    (imovel) =>
      !String(
        imovel.neighborhood ?? ""
      ).trim()
  ).length;

  const semTipo = imoveis.filter(
    (imovel) =>
      !String(imovel.tipo ?? "").trim()
  ).length;

  const semPreco = imoveis.filter(
    (imovel) => {
      const purpose = normalizePurpose(
        imovel.purpose
      );

      if (purpose === "alugar") {
        return (
          typeof imovel.priceRent !== "number" ||
          imovel.priceRent <= 0
        );
      }

      return (
        typeof imovel.price !== "number" ||
        imovel.price <= 0
      );
    }
  ).length;

  const cadastrosComPendencia =
    imoveis.filter((imovel) => {
      const purpose = normalizePurpose(
        imovel.purpose
      );

      const semValor =
        purpose === "alugar"
          ? typeof imovel.priceRent !==
              "number" ||
            imovel.priceRent <= 0
          : typeof imovel.price !==
                "number" ||
              imovel.price <= 0;

      return (
        imovel.photos.length === 0 ||
        !imovel.coverPhotoId ||
        semValor ||
        !String(
          imovel.neighborhood ?? ""
        ).trim() ||
        !String(imovel.tipo ?? "").trim()
      );
    }).length;

  const completos = Math.max(
    0,
    total - cadastrosComPendencia
  );

  const qualidadeBase =
    percentage(completos, total);

  /* =======================================================
     RANKINGS
  ======================================================= */

  function contarPorCampo(
    values: Array<
      string | null | undefined
    >
  ) {
    const counter = new Map<
      string,
      number
    >();

    for (const raw of values) {
      const value = String(
        raw ?? ""
      ).trim();

      if (!value) continue;

      counter.set(
        value,
        (counter.get(value) ?? 0) + 1
      );
    }

    return Array.from(
      counter.entries()
    )
      .map(([label, value]) => ({
        label,
        value,
      }))
      .sort(
        (a, b) => b.value - a.value
      );
  }

  const tipos = contarPorCampo(
    imoveis.map(
      (imovel) => imovel.tipo
    )
  )
    .slice(0, 8)
    .map((item) => ({
      ...item,

      href: `/admin/imoveis?tipo=${encodeURIComponent(
        item.label
      )}`,
    }));

  const bairros = contarPorCampo(
    imoveis.map(
      (imovel) =>
        imovel.neighborhood
    )
  )
    .slice(0, 8)
    .map((item) => ({
      ...item,

      href: `/admin/imoveis?bairro=${encodeURIComponent(
        item.label
      )}`,
    }));

  const cidades = contarPorCampo(
    imoveis.map(
      (imovel) => imovel.city
    )
  ).slice(0, 8);

  /* =======================================================
     FAIXA DE PREÇO
  ======================================================= */

  const faixasPreco = [
    {
      label: "Até R$ 500 mil",
      value: valoresVenda.filter(
        (value) => value <= 500000
      ).length,
    },

    {
      label: "R$ 500 mil a R$ 1 milhão",
      value: valoresVenda.filter(
        (value) =>
          value > 500000 &&
          value <= 1000000
      ).length,
    },

    {
      label: "R$ 1 mi a R$ 2 milhões",
      value: valoresVenda.filter(
        (value) =>
          value > 1000000 &&
          value <= 2000000
      ).length,
    },

    {
      label: "R$ 2 mi a R$ 5 milhões",
      value: valoresVenda.filter(
        (value) =>
          value > 2000000 &&
          value <= 5000000
      ).length,
    },

    {
      label: "R$ 5 mi a R$ 10 milhões",
      value: valoresVenda.filter(
        (value) =>
          value > 5000000 &&
          value <= 10000000
      ).length,
    },

    {
      label: "Acima de R$ 10 milhões",
      value: valoresVenda.filter(
        (value) => value > 10000000
      ).length,
    },
  ].filter(
    (item) => item.value > 0
  );

  /* =======================================================
     EVOLUÇÃO - 6 MESES
  ======================================================= */

  const meses: MonthItem[] =
    Array.from({
      length: 6,
    }).map((_, index) => {
      const offset = 5 - index;

      const date = new Date(
        agora.getFullYear(),
        agora.getMonth() - offset,
        1
      );

      const next = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1
      );

      const value = imoveis.filter(
        (imovel) => {
          const created = new Date(
            imovel.createdAt
          );

          return (
            created >= date &&
            created < next
          );
        }
      ).length;

      const label = date
        .toLocaleDateString(
          "pt-BR",
          {
            month: "short",
          }
        )
        .replace(".", "");

      return {
        label,
        value,
      };
    });

  /* =======================================================
     LISTAS RECENTES
  ======================================================= */

  const ultimosCadastros =
    imoveis.slice(0, 6);

  const ultimasAtualizacoes = [
    ...imoveis,
  ]
    .sort(
      (a, b) =>
        new Date(
          b.updatedAt
        ).getTime() -
        new Date(
          a.updatedAt
        ).getTime()
    )
    .slice(0, 6);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#f7f9f7] font-sans">
      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/imoveis"
              className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#527443] transition hover:text-[#365f4d]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para imóveis
            </Link>

            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#365f4d] text-white shadow-sm">
                <LayoutDashboard className="h-5 w-5" />
              </span>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[28px] font-bold tracking-[-0.04em] text-slate-950 sm:text-[32px]">
                    Dashboard Geral
                  </h1>

                  <span className="rounded-full border border-[#dbe6d5] bg-[#f2f7ef] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#668052]">
                    Carteira imobiliária
                  </span>
                </div>

                <p className="mt-1 text-[12px] text-slate-500">
                  Indicadores completos da carteira da Araras Imóveis.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/admin/imoveis/novo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#16863c] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#107533]"
          >
            Cadastrar imóvel
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        {/* =================================================
            VISÃO GERAL
        ================================================= */}

        <section className="mt-7">
          <SectionTitle
            icon={
              <BarChart3 className="h-4 w-4" />
            }
            label="Visão geral"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <StatCard
              label="Total"
              value={total}
              helper="Todos os imóveis"
              icon={
                <Building2 className="h-5 w-5" />
              }
            />

            <StatCard
              label="Ativos"
              value={ativos}
              helper={`${ativosPercent}% da base`}
              icon={
                <BadgeCheck className="h-5 w-5" />
              }
            />

            <StatCard
              label="Inativos"
              value={inativos}
              helper={`${percentage(
                inativos,
                total
              )}% da base`}
              icon={
                <Eye className="h-5 w-5" />
              }
              tone={
                inativos > 0
                  ? "orange"
                  : "green"
              }
            />

            <StatCard
              label="Venda"
              value={venda}
              helper="Imóveis à venda"
              icon={
                <Home className="h-5 w-5" />
              }
            />

            <StatCard
              label="Locação"
              value={aluguel}
              helper="Imóveis para aluguel"
              icon={
                <KeyRound className="h-5 w-5" />
              }
              tone="blue"
            />

            <StatCard
              label="Destaques"
              value={destacados}
              helper="Prioridade na home"
              icon={
                <Star className="h-5 w-5" />
              }
            />

            <StatCard
              label="Novos no mês"
              value={novosMes}
              helper="Cadastros recentes"
              icon={
                <CalendarDays className="h-5 w-5" />
              }
              tone="blue"
            />

            <StatCard
              label="Pendências"
              value={
                cadastrosComPendencia
              }
              helper={`${qualidadeBase}% completos`}
              icon={
                <TriangleAlert className="h-5 w-5" />
              }
              tone={
                cadastrosComPendencia >
                0
                  ? "orange"
                  : "green"
              }
            />
          </div>
        </section>

        {/* =================================================
            GRÁFICOS STATUS
        ================================================= */}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <StatusChart
            ativos={ativos}
            inativos={inativos}
          />

          <PurposeChart
            venda={venda}
            aluguel={aluguel}
            outros={outros}
          />
        </div>

        {/* =================================================
            FINANCEIRO
        ================================================= */}

        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)] sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf4e9] text-[#527443]">
                  <CircleDollarSign className="h-4 w-4" />
                </span>

                <div>
                  <h2 className="text-[19px] font-bold tracking-[-0.025em] text-slate-950">
                    Financeiro da carteira
                  </h2>

                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Valores anunciados dos imóveis cadastrados.
                  </p>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dce7d7] bg-[#f5f8f3] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#668052]">
              <WalletCards className="h-3.5 w-3.5" />
              Indicadores financeiros
            </span>
          </div>

          {/* CARTEIRA */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FinancialCard
              label="Carteira total de venda"
              value={formatBRL(
                valorCarteiraVenda
              )}
              helper={`${valoresVenda.length} imóveis com valor cadastrado`}
              featured
            />

            <FinancialCard
              label="Carteira ativa"
              value={formatBRL(
                valorCarteiraAtiva
              )}
              helper={`${vendaAtivaComPreco.length} imóveis ativos`}
              featured
            />

            <FinancialCard
              label="Carteira inativa"
              value={formatBRL(
                valorCarteiraInativa
              )}
              helper={`${vendaInativaComPreco.length} imóveis inativos`}
            />

            <FinancialCard
              label="Ticket médio ativo"
              value={formatBRL(
                valorMedioAtivos
              )}
              helper="Média dos imóveis ativos"
            />
          </div>

          {/* INDICADORES */}
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FinancialCard
              label="Preço médio geral"
              value={formatBRL(
                valorMedioVenda
              )}
            />

            <FinancialCard
              label="Mediana de preço"
              value={formatBRL(
                medianaVenda
              )}
              helper="Reduz impacto dos extremos"
            />

            <FinancialCard
              label="Maior anúncio"
              value={formatBRL(
                maiorValor
              )}
            />

            <FinancialCard
              label="Menor anúncio"
              value={formatBRL(
                menorValor
              )}
            />
          </div>

          {/* LOCAÇÃO */}
          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-sky-600" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-500">
                Carteira de locação
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FinancialCard
                label="Soma mensal anunciada"
                value={formatBRL(
                  somaMensalAlugueis
                )}
                helper={`${alugueisAtivosComPreco.length} locações ativas`}
              />

              <FinancialCard
                label="Potencial anual"
                value={formatBRL(
                  potencialAnualLocacao
                )}
                helper="12 meses sobre os valores ativos"
              />

              <FinancialCard
                label="Aluguel médio"
                value={formatBRL(
                  aluguelMedio
                )}
              />

              <FinancialCard
                label="Maior aluguel"
                value={formatBRL(
                  maiorAluguel
                )}
              />
            </div>
          </div>

          {/* M² */}
          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <FinancialCard
                label="Preço médio por m²"
                value={`${formatBRL(
                  precoMedioM2
                )}/m²`}
                helper="Venda ativa com área construída informada"
              />

              <FinancialCard
                label="Área construída média"
                value={`${formatNumber(
                  Math.round(
                    areaMediaConstruida
                  )
                )} m²`}
              />

              <FinancialCard
                label="Área de terreno média"
                value={`${formatNumber(
                  Math.round(
                    areaMediaTerreno
                  )
                )} m²`}
              />
            </div>
          </div>
        </section>

        {/* =================================================
            EVOLUÇÃO + FAIXA PREÇO
        ================================================= */}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <MonthlyChart items={meses} />

          <RankingList
            title="Distribuição por faixa de preço"
            description="Quantidade de imóveis de venda em cada faixa."
            items={faixasPreco}
            icon={
              <CircleDollarSign className="h-4 w-4" />
            }
          />
        </div>

        {/* =================================================
            TIPO + BAIRRO + CIDADE
        ================================================= */}

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <RankingList
            title="Imóveis por tipo"
            description="Categorias mais presentes na carteira."
            items={tipos}
            icon={
              <Building2 className="h-4 w-4" />
            }
          />

          <RankingList
            title="Imóveis por bairro"
            description="Bairros com maior volume de imóveis."
            items={bairros}
            icon={
              <MapPin className="h-4 w-4" />
            }
          />

          <RankingList
            title="Imóveis por cidade"
            description="Distribuição geográfica da carteira."
            items={cidades}
            icon={
              <MapPin className="h-4 w-4" />
            }
          />
        </div>

        {/* =================================================
            ATIVIDADE OPERACIONAL
        ================================================= */}

        <section className="mt-6">
          <SectionTitle
            icon={
              <Activity className="h-4 w-4" />
            }
            label="Atividade da carteira"
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard
              label="Atualizados em 30 dias"
              value={atualizados30Dias}
              helper={`${percentage(
                atualizados30Dias,
                total
              )}% da carteira`}
              icon={
                <Activity className="h-5 w-5" />
              }
            />

            <StatCard
              label="Sem atualização há 90 dias"
              value={
                semAtualizacao90Dias
              }
              helper="Podem precisar de revisão"
              icon={
                <Clock3 className="h-5 w-5" />
              }
              tone={
                semAtualizacao90Dias >
                0
                  ? "orange"
                  : "green"
              }
            />

            <StatCard
              label="Qualidade da base"
              value={`${qualidadeBase}%`}
              helper={`${completos} cadastros completos`}
              icon={
                <Sparkles className="h-5 w-5" />
              }
            />
          </div>
        </section>

        {/* =================================================
            QUALIDADE
        ================================================= */}

        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[19px] font-bold tracking-[-0.025em] text-slate-950">
                Qualidade dos anúncios
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
                Pendências que podem afetar a apresentação dos imóveis no site.
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf4e9] text-[#527443]">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <QualityItem
              label="Sem fotos"
              value={semFoto}
              total={total}
            />

            <QualityItem
              label="Sem foto de capa"
              value={semCapa}
              total={total}
            />

            <QualityItem
              label="Sem preço"
              value={semPreco}
              total={total}
            />

            <QualityItem
              label="Sem bairro"
              value={semBairro}
              total={total}
            />

            <QualityItem
              label="Sem tipo"
              value={semTipo}
              total={total}
            />
          </div>

          <div className="mt-4 rounded-[18px] border border-[#dce8d7] bg-[#f5f9f3] px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#527443]">
                  Nível geral de qualidade
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  {completos} de {total} imóveis sem as principais pendências.
                </p>
              </div>

              <p className="text-[28px] font-bold tracking-[-0.04em] text-[#365f4d]">
                {qualidadeBase}%
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8ca27a] to-[#365f4d]"
                style={{
                  width: `${qualidadeBase}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* =================================================
            ÚLTIMOS CADASTROS + ATUALIZAÇÕES
        ================================================= */}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <RecentList
            title="Últimos imóveis cadastrados"
            description="Cadastros adicionados recentemente."
            items={ultimosCadastros}
            dateField="createdAt"
          />

          <RecentList
            title="Últimas atualizações"
            description="Imóveis alterados mais recentemente."
            items={ultimasAtualizacoes}
            dateField="updatedAt"
          />
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2 text-[#668052]">
      {icon}

      <p className="text-[9px] font-semibold uppercase tracking-[0.19em]">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   RECENT LIST
========================================================= */

type RecentItem = {
  id: string;
  title: string;
  codigo: string | null;
  neighborhood: string | null;
  city: string | null;
  price: number | null;
  priceRent: number | null;
  purpose: string | null;
  ativo: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  quartos: number | null;
  banheiros: number | null;
  vagas: number | null;
  areaConstruida: number | null;
};

function RecentList({
  title,
  description,
  items,
  dateField,
}: {
  title: string;
  description: string;
  items: RecentItem[];
  dateField: "createdAt" | "updatedAt";
}) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-bold tracking-[-0.02em] text-slate-950">
            {title}
          </h2>

          <p className="mt-1 text-[11px] text-slate-500">
            {description}
          </p>
        </div>

        <Link
          href="/admin/imoveis"
          className="hidden items-center gap-1.5 text-[10px] font-semibold text-[#527443] transition hover:text-[#365f4d] sm:inline-flex"
        >
          Ver todos
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {items.map((imovel) => {
          const isRent =
            normalizePurpose(
              imovel.purpose
            ) === "alugar";

          const value =
            isRent &&
            typeof imovel.priceRent ===
              "number"
              ? imovel.priceRent
              : imovel.price;

          return (
            <Link
              key={imovel.id}
              href={`/admin/imoveis/${imovel.id}/editar`}
              className="group flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      imovel.ativo
                        ? "bg-[#4f7041]"
                        : "bg-slate-300"
                    }`}
                  />

                  <p className="truncate text-[12px] font-semibold text-slate-800 transition group-hover:text-[#365f4d]">
                    {imovel.title}
                  </p>

                  {imovel.featured ? (
                    <Star className="h-3 w-3 shrink-0 fill-[#8ca076] text-[#8ca076]" />
                  ) : null}
                </div>

                <p className="mt-1 truncate pl-4 text-[10px] text-slate-400">
                  {[
                    imovel.codigo,
                    imovel.neighborhood,
                    imovel.city,
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-2 pl-4 text-[9px] text-slate-400">
                  {typeof imovel.quartos ===
                    "number" &&
                  imovel.quartos > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <BedDouble className="h-3 w-3" />
                      {imovel.quartos}
                    </span>
                  ) : null}

                  {typeof imovel.banheiros ===
                    "number" &&
                  imovel.banheiros > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {imovel.banheiros}
                    </span>
                  ) : null}

                  {typeof imovel.vagas ===
                    "number" &&
                  imovel.vagas > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <CarFront className="h-3 w-3" />
                      {imovel.vagas}
                    </span>
                  ) : null}

                  {typeof imovel.areaConstruida ===
                    "number" &&
                  imovel.areaConstruida > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Ruler className="h-3 w-3" />
                      {formatNumber(
                        imovel.areaConstruida
                      )}{" "}
                      m²
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-[12px] font-bold text-[#365f4d]">
                    {typeof value === "number"
                      ? formatCompactBRL(
                          value
                        )
                      : "Sem preço"}
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-400">
                    {new Date(
                      imovel[dateField]
                    ).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition group-hover:bg-[#edf4e9] group-hover:text-[#527443]">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}