export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  House,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import {
  Prisma,
  VisitaStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import WhatsAppMark from "@/components/WhatsAppMark";

type PageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

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

export default async function VisitasPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const filtro =
    params.status || "agendadas";

  const where: Prisma.VisitaWhereInput = {};

  if (filtro === "agendadas") {
    where.status = {
      in: [
        VisitaStatus.AGENDADA,
        VisitaStatus.CONFIRMADA,
      ],
    };
  } else if (
    filtro === "realizadas"
  ) {
    where.status =
      VisitaStatus.REALIZADA;
  } else if (
    filtro === "canceladas"
  ) {
    where.status = {
      in: [
        VisitaStatus.CANCELADA,
        VisitaStatus.NAO_COMPARECEU,
      ],
    };
  }

  const visitas =
    await prisma.visita.findMany({
      where,

      orderBy: {
        dataHora:
          filtro === "agendadas"
            ? "asc"
            : "desc",
      },

      include: {
        lead: {
          include: {
            contato: true,
          },
        },

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
    });

  const agora = new Date();

  return (
    <main className="min-h-screen bg-[#f6f8f6]">
      <div className="mx-auto max-w-[1350px] px-4 py-7 sm:px-6 lg:px-8">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#527443]"
        >
          <ArrowLeft className="h-4 w-4" />
          Central de Leads
        </Link>

        <header className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#365f4d] text-white">
              <CalendarDays className="h-5 w-5" />
            </span>

            <div>
              <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-950">
                Agenda de Visitas
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Acompanhe todas as visitas cadastradas no CRM da Araras.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
            {visitas.length} visita
            {visitas.length === 1
              ? ""
              : "s"}
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap gap-2">
          <Tab
            href="/admin/visitas"
            active={
              filtro === "agendadas"
            }
          >
            Agendadas
          </Tab>

          <Tab
            href="/admin/visitas?status=realizadas"
            active={
              filtro === "realizadas"
            }
          >
            Realizadas
          </Tab>

          <Tab
            href="/admin/visitas?status=canceladas"
            active={
              filtro === "canceladas"
            }
          >
            Canceladas / não compareceu
          </Tab>

          <Tab
            href="/admin/visitas?status=todas"
            active={
              filtro === "todas"
            }
          >
            Todas
          </Tab>
        </nav>

        <section className="mt-5">
          {visitas.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-[#cddac7] bg-white px-6 py-16 text-center shadow-sm">
              <CalendarDays className="mx-auto h-8 w-8 text-[#668052]" />

              <h2 className="mt-3 text-sm font-bold text-slate-800">
                Nenhuma visita encontrada
              </h2>

              <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
                As visitas cadastradas dentro da ficha dos leads aparecerão aqui automaticamente.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {visitas.map(
                (visita) => {
                  const imovel =
                    visita.imovel;

                  const waUrl =
                    whatsappUrl(
                      visita.lead.contato
                        .whatsapp,
                      visita.lead.contato
                        .telefone
                    );

                  const atrasada =
                    visita.dataHora < agora &&
                    (visita.status ===
                      VisitaStatus.AGENDADA ||
                      visita.status ===
                        VisitaStatus.CONFIRMADA);

                  return (
                    <article
                      key={visita.id}
                      className={`rounded-[22px] border bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ${
                        atrasada
                          ? "border-amber-200"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
                            <UserRound className="h-4 w-4 shrink-0 text-[#668052]" />
                            {visita.lead.contato.nome}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                            <Phone className="h-3 w-3" />
                            {visita.lead.contato
                              .whatsapp ||
                              visita.lead.contato
                                .telefone ||
                              "Sem telefone"}
                          </p>
                        </div>

                        <VisitStatusBadge
                          status={visita.status}
                        />
                      </div>

                      <div className="mt-4 rounded-xl bg-[#f8faf7] p-3">
                        <p className="flex items-center gap-1.5 text-xs font-bold text-[#365f4d]">
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

                        <p className="mt-1 flex items-center gap-1.5 text-[9px] text-slate-400">
                          <Clock3 className="h-3 w-3" />
                          {visita.duracaoMinutos} minutos
                        </p>

                        {atrasada ? (
                          <p className="mt-2 text-[9px] font-bold text-amber-700">
                            Horário já passou — atualize o resultado da visita na ficha do lead.
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-3">
                        <p className="flex items-start gap-1.5 text-xs font-semibold text-slate-700">
                          <House className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>
                            {imovel?.codigo
                              ? `${imovel.codigo} • `
                              : visita.imovelCodigoSnapshot
                                ? `${visita.imovelCodigoSnapshot} • `
                                : ""}
                            {imovel?.title ||
                              visita.imovelTituloSnapshot ||
                              "Imóvel não informado"}
                          </span>
                        </p>

                        {imovel?.neighborhood ? (
                          <p className="mt-1 flex items-center gap-1 text-[9px] text-slate-400">
                            <MapPin className="h-3 w-3" />
                            {imovel.neighborhood} • {imovel.city}
                          </p>
                        ) : null}

                        {visita.observacoes ? (
                          <p className="mt-2 rounded-lg bg-slate-50 p-2 text-[10px] leading-4 text-slate-500">
                            {visita.observacoes}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                        <Link
                          href={`/admin/leads/${visita.lead.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-xl bg-[#365f4d] px-3 text-[10px] font-bold text-white transition hover:bg-[#294b3c]"
                        >
                          Abrir Lead
                        </Link>

                        {waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#bcefd0] bg-[#ecfff3] px-3 text-[10px] font-bold text-[#168a45] transition hover:bg-[#dff9e8]"
                          >
                            <WhatsAppMark className="h-4 w-4 text-[#25D366]" />
                            WhatsApp
                          </a>
                        ) : null}

                        {imovel ? (
                          <Link
                            href={`/admin/imoveis/${imovel.id}/editar`}
                            className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
                          >
                            Ver imóvel
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Tab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-xl bg-[#365f4d] px-4 py-2 text-xs font-bold text-white"
          : "rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
      }
    >
      {children}
    </Link>
  );
}

function VisitStatusBadge({
  status,
}: {
  status: VisitaStatus;
}) {
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

  const classes: Record<
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

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase ${classes[status]}`}
    >
      {labels[status]}
    </span>
  );
}