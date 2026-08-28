"use server";

import {
  ClienteStatus,
  DemandaFinalidade,
  LeadOrigem,
  LeadPrioridade,
  LeadStatus,
  LeadTemperatura,
  InteresseStatus,
  Prisma,
  VisitaStatus,
} from "@prisma/client";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function text(
  value: FormDataEntryValue | null
) {
  const result =
    String(value ?? "").trim();

  return result || null;
}

function numberOrNull(
  value: FormDataEntryValue | null
) {
  const raw =
    String(value ?? "").trim();

  if (!raw) return null;

  const result = Number(raw);

  return Number.isFinite(result)
    ? Math.round(result)
    : null;
}

function splitList(
  value: FormDataEntryValue | null
) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizePhone(
  value?: string | null
) {
  if (!value) return null;

  let digits =
    value.replace(/\D/g, "");

  if (
    digits.startsWith("55") &&
    digits.length >= 12
  ) {
    digits = digits.slice(2);
  }

  return digits || null;
}

function enumValue<T extends string>(
  value: FormDataEntryValue | null,
  values: readonly T[],
  fallback: T
): T {
  const raw = String(value ?? "");

  return values.includes(raw as T)
    ? (raw as T)
    : fallback;
}

/* =========================================================
   EDITAR LEAD
========================================================= */

export async function atualizarLead(
  id: string,
  formData: FormData
) {
  const nome = text(
    formData.get("nome")
  );

  if (!nome) return;

  const telefone = text(
    formData.get("telefone")
  );

  const whatsapp = text(
    formData.get("whatsapp")
  );

  const email = text(
    formData.get("email")
  );

  const cpf = text(
    formData.get("cpf")
  );

  const origem = enumValue(
    formData.get("origem"),
    Object.values(LeadOrigem),
    LeadOrigem.OUTRO
  );

  const prioridade = enumValue(
    formData.get("prioridade"),
    Object.values(LeadPrioridade),
    LeadPrioridade.NORMAL
  );

  const temperatura = enumValue(
    formData.get("temperatura"),
    Object.values(LeadTemperatura),
    LeadTemperatura.MORNO
  );

  const finalidade = enumValue(
    formData.get("finalidade"),
    Object.values(DemandaFinalidade),
    DemandaFinalidade.COMPRAR
  );

  const origemDetalhe = text(
    formData.get("origemDetalhe")
  );

  const responsavelNome = text(
    formData.get("responsavelNome")
  );

  const assunto = text(
    formData.get("assunto")
  );

  const mensagemInicial = text(
    formData.get("mensagemInicial")
  );

  const observacoes = text(
    formData.get("observacoes")
  );

  const tipoImoveis = splitList(
    formData.get("tipoImoveis")
  );

  const cidades = splitList(
    formData.get("cidades")
  );

  const bairros = splitList(
    formData.get("bairros")
  );

  const valorMin = numberOrNull(
    formData.get("valorMin")
  );

  const valorMax = numberOrNull(
    formData.get("valorMax")
  );

  const quartosMin = numberOrNull(
    formData.get("quartosMin")
  );

  const suitesMin = numberOrNull(
    formData.get("suitesMin")
  );

  const banheirosMin = numberOrNull(
    formData.get("banheirosMin")
  );

  const vagasMin = numberOrNull(
    formData.get("vagasMin")
  );

  const demandaObservacoes = text(
    formData.get("demandaObservacoes")
  );

  await prisma.$transaction(
    async (tx) => {
      const lead =
        await tx.lead.findUnique({
          where: {
            id,
          },

          include: {
            demandas: {
              where: {
                ativo: true,
              },

              orderBy: {
                createdAt: "desc",
              },

              take: 1,
            },
          },
        });

      if (!lead) {
        throw new Error(
          "Lead não encontrado."
        );
      }

      await tx.contato.update({
        where: {
          id: lead.contatoId,
        },

        data: {
          nome,
          telefone,
          whatsapp,
          email,
          cpf,

          telefoneNormalizado:
            normalizePhone(
              whatsapp || telefone
            ),
        },
      });

      await tx.lead.update({
        where: {
          id,
        },

        data: {
          origem,
          origemDetalhe,
          responsavelNome,
          prioridade,
          temperatura,
          finalidade,
          assunto,
          mensagemInicial,
          observacoes,
        },
      });

      const demanda =
        lead.demandas[0];

      const demandaData = {
        finalidade,
        tipoImoveis,
        cidades,
        bairros,
        valorMin,
        valorMax,
        quartosMin,
        suitesMin,
        banheirosMin,
        vagasMin,
        observacoes:
          demandaObservacoes,
      };

      if (demanda) {
        await tx.demanda.update({
          where: {
            id: demanda.id,
          },

          data: demandaData,
        });
      } else {
        await tx.demanda.create({
          data: {
            leadId: id,
            ...demandaData,
          },
        });
      }

      await tx.leadHistorico.create({
        data: {
          leadId: id,
          tipo: "LEAD_EDITADO",
          descricao:
            "Dados do lead e da demanda foram atualizados.",
        },
      });
    }
  );

  revalidatePath("/admin/leads");
  revalidatePath(
    `/admin/leads/${id}`
  );

  redirect(
    `/admin/leads/${id}?salvo=1`
  );
}

/* =========================================================
   CONVERTIDO
========================================================= */

export async function marcarConvertido(
  id: string
) {
  await prisma.$transaction(
    async (tx) => {
      const lead =
        await tx.lead.findUnique({
          where: { id },

          select: {
            id: true,
            contatoId: true,
            finalidade: true,
          },
        });

      if (!lead) {
        throw new Error(
          "Lead não encontrado."
        );
      }

      const agora = new Date();

      await tx.lead.update({
        where: {
          id,
        },

        data: {
          status:
            LeadStatus.CONVERTIDO,

          convertidoEm: agora,

          perdidoEm: null,
          motivoPerda: null,
        },
      });

      /*
       * Lead convertido vira cliente,
       * mas o Lead continua existindo.
       */

      await tx.cliente.upsert({
        where: {
          contatoId:
            lead.contatoId,
        },

        update: {
          status:
            ClienteStatus.ATIVO,
        },

        create: {
          contatoId:
            lead.contatoId,

          leadOrigemId: id,

          status:
            ClienteStatus.ATIVO,

          clienteDesde: agora,
        },
      });

      let descricao =
        "Lead marcado como convertido.";

      if (
        lead.finalidade ===
        DemandaFinalidade.COMPRAR
      ) {
        descricao =
          "Lead convertido em venda.";
      }

      if (
        lead.finalidade ===
        DemandaFinalidade.ALUGAR
      ) {
        descricao =
          "Lead convertido em locação.";
      }

      await tx.leadHistorico.create({
        data: {
          leadId: id,

          tipo:
            "LEAD_CONVERTIDO",

          descricao,
        },
      });
    }
  );

  revalidatePath("/admin/leads");
  revalidatePath(
    `/admin/leads/${id}`
  );
}

/* =========================================================
   PERDIDO / NÃO CONVERTIDO
========================================================= */

export async function marcarPerdido(
  id: string,
  formData: FormData
) {
  const motivo =
    text(
      formData.get("motivoPerda")
    ) || "Não informado";

  await prisma.$transaction([
    prisma.lead.update({
      where: {
        id,
      },

      data: {
        status:
          LeadStatus.PERDIDO,

        perdidoEm: new Date(),

        motivoPerda: motivo,

        convertidoEm: null,
      },
    }),

    prisma.leadHistorico.create({
      data: {
        leadId: id,

        tipo: "LEAD_PERDIDO",

        descricao: `Lead marcado como não convertido. Motivo: ${motivo}`,
      },
    }),
  ]);

  revalidatePath("/admin/leads");
  revalidatePath(
    `/admin/leads/${id}`
  );
}

/* =========================================================
   REABRIR
========================================================= */

export async function reabrirLead(
  id: string
) {
  await prisma.$transaction([
    prisma.lead.update({
      where: {
        id,
      },

      data: {
        status:
          LeadStatus.EM_ATENDIMENTO,

        convertidoEm: null,
        perdidoEm: null,
        motivoPerda: null,
      },
    }),

    prisma.leadHistorico.create({
      data: {
        leadId: id,

        tipo: "LEAD_REABERTO",

        descricao:
          "O atendimento foi reaberto.",
      },
    }),
  ]);

  revalidatePath("/admin/leads");
  revalidatePath(
    `/admin/leads/${id}`
  );
}

/* =========================================================
   EXCLUIR

   Não apagamos o CONTATO automaticamente.
   Somente a oportunidade e seus registros relacionados.
========================================================= */

export async function excluirLead(
  id: string
) {
  await prisma.$transaction(
    async (tx) => {
      const propostas =
        await tx.proposta.findMany({
          where: {
            leadId: id,
          },

          select: {
            id: true,
          },
        });

      const propostaIds =
        propostas.map(
          (item) => item.id
        );

      if (
        propostaIds.length > 0
      ) {
        await tx.propostaHistorico.deleteMany(
          {
            where: {
              propostaId: {
                in: propostaIds,
              },
            },
          }
        );
      }

      await tx.proposta.deleteMany({
        where: {
          leadId: id,
        },
      });

      await tx.visita.deleteMany({
        where: {
          leadId: id,
        },
      });

      await tx.leadTarefa.deleteMany({
        where: {
          leadId: id,
        },
      });

      await tx.interesseImovel.deleteMany({
        where: {
          leadId: id,
        },
      });

      await tx.demanda.deleteMany({
        where: {
          leadId: id,
        },
      });

      await tx.leadHistorico.deleteMany({
        where: {
          leadId: id,
        },
      });

      await tx.lead.delete({
        where: {
          id,
        },
      });
    }
  );

  revalidatePath("/admin/leads");

  redirect(
    "/admin/leads?excluido=1"
  );
}

/* =========================================================
   IMÓVEIS DE INTERESSE
========================================================= */

export async function adicionarInteressesImoveis(
  leadId: string,
  formData: FormData
) {
  const imovelIds = Array.from(
    new Set(
      formData
        .getAll("imovelIds")
        .map((value) =>
          String(value ?? "").trim()
        )
        .filter(Boolean)
    )
  );

  if (imovelIds.length === 0) {
    redirect(
      `/admin/leads/${leadId}`
    );
  }

  let adicionados = 0;

  await prisma.$transaction(
    async (tx) => {
      const lead =
        await tx.lead.findUnique({
          where: {
            id: leadId,
          },

          select: {
            id: true,
          },
        });

      if (!lead) {
        throw new Error(
          "Lead não encontrado."
        );
      }

      const existentes =
        await tx.interesseImovel.findMany({
          where: {
            leadId,
            imovelId: {
              in: imovelIds,
            },
          },

          select: {
            imovelId: true,
          },
        });

      const idsExistentes = new Set(
        existentes
          .map(
            (interesse) =>
              interesse.imovelId
          )
          .filter(
            (imovelId): imovelId is string =>
              Boolean(imovelId)
          )
      );

      const novosIds =
        imovelIds.filter(
          (imovelId) =>
            !idsExistentes.has(imovelId)
        );

      if (novosIds.length === 0) {
        return;
      }

      const imoveis =
        await tx.imovel.findMany({
          where: {
            id: {
              in: novosIds,
            },
            ativo: true,
          },

          select: {
            id: true,
            codigo: true,
            title: true,
          },
        });

      for (const imovel of imoveis) {
        await tx.interesseImovel.create({
          data: {
            leadId,
            imovelId: imovel.id,
            imovelCodigoSnapshot:
              imovel.codigo,
            imovelTituloSnapshot:
              imovel.title,
            status:
              InteresseStatus.INTERESSADO,
          },
        });

        const nomeImovel = `${
          imovel.codigo
            ? `${imovel.codigo} • `
            : ""
        }${imovel.title}`;

        await tx.leadHistorico.create({
          data: {
            leadId,
            tipo:
              "INTERESSE_IMOVEL_ADICIONADO",
            descricao: `Imóvel ${nomeImovel} adicionado aos interesses do cliente.`,
            dados: {
              imovelId: imovel.id,
              codigo: imovel.codigo,
              titulo: imovel.title,
            },
          },
        });

        adicionados += 1;
      }
    }
  );

  revalidatePath(
    `/admin/leads/${leadId}`
  );
  revalidatePath("/admin/leads");

  redirect(
    adicionados > 0
      ? `/admin/leads/${leadId}?interesses=adicionados`
      : `/admin/leads/${leadId}`
  );
}

export async function alterarStatusInteresse(
  leadId: string,
  interesseId: string,
  formData: FormData
) {
  const novoStatus = enumValue(
    formData.get("status"),
    Object.values(InteresseStatus),
    InteresseStatus.INTERESSADO
  );

  await prisma.$transaction(
    async (tx) => {
      const interesse =
        await tx.interesseImovel.findUnique({
          where: {
            id: interesseId,
          },

          include: {
            imovel: {
              select: {
                codigo: true,
                title: true,
              },
            },
          },
        });

      if (
        !interesse ||
        interesse.leadId !== leadId
      ) {
        throw new Error(
          "Interesse não encontrado."
        );
      }

      if (
        interesse.status ===
        novoStatus
      ) {
        return;
      }

      const statusAnterior =
        interesse.status;

      await tx.interesseImovel.update({
        where: {
          id: interesseId,
        },

        data: {
          status: novoStatus,
        },
      });

      const nomeImovel =
        interesse.imovel
          ? `${
              interesse.imovel.codigo
                ? `${interesse.imovel.codigo} • `
                : ""
            }${interesse.imovel.title}`
          : interesse.imovelTituloSnapshot ||
            "Imóvel";

      await tx.leadHistorico.create({
        data: {
          leadId,
          tipo:
            "INTERESSE_IMOVEL_STATUS",
          descricao: `Etapa de ${nomeImovel} alterada de ${statusAnterior} para ${novoStatus}.`,
          dados: {
            interesseId,
            statusAnterior,
            novoStatus,
            imovelId:
              interesse.imovelId,
          },
        },
      });
    }
  );

  revalidatePath(
    `/admin/leads/${leadId}`
  );
  revalidatePath("/admin/leads");

  redirect(
    `/admin/leads/${leadId}?interesses=status`
  );
}

export async function removerInteresseImovel(
  leadId: string,
  interesseId: string
) {
  await prisma.$transaction(
    async (tx) => {
      const interesse =
        await tx.interesseImovel.findUnique({
          where: {
            id: interesseId,
          },

          include: {
            imovel: {
              select: {
                codigo: true,
                title: true,
              },
            },
          },
        });

      if (
        !interesse ||
        interesse.leadId !== leadId
      ) {
        throw new Error(
          "Interesse não encontrado."
        );
      }

      const nomeImovel =
        interesse.imovel
          ? `${
              interesse.imovel.codigo
                ? `${interesse.imovel.codigo} • `
                : ""
            }${interesse.imovel.title}`
          : interesse.imovelTituloSnapshot ||
            "Imóvel";

      await tx.interesseImovel.delete({
        where: {
          id: interesseId,
        },
      });

      await tx.leadHistorico.create({
        data: {
          leadId,
          tipo:
            "INTERESSE_IMOVEL_REMOVIDO",
          descricao: `${nomeImovel} removido dos imóveis de interesse do cliente.`,
          dados: {
            interesseId,
            imovelId:
              interesse.imovelId,
            codigo:
              interesse.imovel?.codigo ??
              interesse.imovelCodigoSnapshot,
            titulo:
              interesse.imovel?.title ??
              interesse.imovelTituloSnapshot,
          },
        },
      });
    }
  );

  revalidatePath(
    `/admin/leads/${leadId}`
  );
  revalidatePath("/admin/leads");

  redirect(
    `/admin/leads/${leadId}?interesses=removido`
  );
}

/* =========================================================
   AGENDAR VISITA
========================================================= */

export async function agendarVisita(
  id: string,
  formData: FormData
) {
  const dataHoraRaw = text(
    formData.get("dataHora")
  );

  const imovelId = text(
    formData.get("imovelId")
  );

  const observacoes = text(
    formData.get("observacoesVisita")
  );

  const duracaoMinutos =
    numberOrNull(
      formData.get("duracaoMinutos")
    ) || 60;

  if (!dataHoraRaw) {
    redirect(
      `/admin/leads/${id}?erroVisita=data`
    );
  }

  const dataComFuso =
    dataHoraRaw.length === 16
      ? `${dataHoraRaw}:00-03:00`
      : `${dataHoraRaw}-03:00`;

  const dataHora = new Date(
    dataComFuso
  );

  if (
    Number.isNaN(
      dataHora.getTime()
    )
  ) {
    redirect(
      `/admin/leads/${id}?erroVisita=data`
    );
  }

  await prisma.$transaction(
    async (tx) => {
      const lead =
        await tx.lead.findUnique({
          where: {
            id,
          },

          select: {
            id: true,
            status: true,
          },
        });

      if (!lead) {
        throw new Error(
          "Lead não encontrado."
        );
      }

      let imovel:
        | {
            id: string;
            title: string;
            codigo: string | null;
          }
        | null = null;

      if (imovelId) {
        imovel =
          await tx.imovel.findUnique({
            where: {
              id: imovelId,
            },

            select: {
              id: true,
              title: true,
              codigo: true,
            },
          });
      }

      await tx.visita.create({
        data: {
          leadId: id,

          imovelId:
            imovel?.id ?? null,

          imovelCodigoSnapshot:
            imovel?.codigo ?? null,

          imovelTituloSnapshot:
            imovel?.title ?? null,

          dataHora,
          duracaoMinutos,

          status:
            VisitaStatus.AGENDADA,

          observacoes,
        },
      });

      const statusQuePodemAvancarParaVisita: LeadStatus[] = [
  LeadStatus.NOVO,
  LeadStatus.PRIMEIRO_CONTATO,
  LeadStatus.EM_ATENDIMENTO,
  LeadStatus.QUALIFICADO,
  LeadStatus.IMOVEIS_ENVIADOS,
];

const podeAvancarParaVisita =
  statusQuePodemAvancarParaVisita.includes(lead.status);

      if (podeAvancarParaVisita) {
        await tx.lead.update({
          where: {
            id,
          },

          data: {
            status:
              LeadStatus.VISITA_AGENDADA,
          },
        });
      }

      const dataFormatada =
        new Intl.DateTimeFormat(
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
        ).format(dataHora);

      const nomeImovel = imovel
        ? `${
            imovel.codigo
              ? `${imovel.codigo} • `
              : ""
          }${imovel.title}`
        : "imóvel não informado";

      await tx.leadHistorico.create({
        data: {
          leadId: id,
          tipo: "VISITA_AGENDADA",
          descricao: `Visita agendada para ${dataFormatada} — ${nomeImovel}.`,

          dados: {
            dataHora:
              dataHora.toISOString(),
            duracaoMinutos,
            observacoes,
            imovel:
              imovel
                ? {
                    id: imovel.id,
                    codigo:
                      imovel.codigo,
                    titulo:
                      imovel.title,
                  }
                : null,
          },
        },
      });
    }
  );

  revalidatePath(
    `/admin/leads/${id}`
  );
  revalidatePath("/admin/leads");
  revalidatePath("/admin/visitas");

  redirect(
    `/admin/leads/${id}?visitaAgendada=1`
  );
}

/* =========================================================
   ALTERAR STATUS DA VISITA
========================================================= */

export async function alterarStatusVisita(
  leadId: string,
  visitaId: string,
  novoStatus:
    | "CONFIRMADA"
    | "REALIZADA"
    | "CANCELADA"
    | "NAO_COMPARECEU"
) {
  await prisma.$transaction(
    async (tx) => {
      const visita =
        await tx.visita.findUnique({
          where: {
            id: visitaId,
          },

          include: {
            lead: {
              select: {
                id: true,
                status: true,
              },
            },

            imovel: {
              select: {
                codigo: true,
                title: true,
              },
            },
          },
        });

      if (
        !visita ||
        visita.leadId !== leadId
      ) {
        throw new Error(
          "Visita não encontrada."
        );
      }

      const status =
        novoStatus as VisitaStatus;

      await tx.visita.update({
        where: {
          id: visitaId,
        },

        data: {
          status,
        },
      });

      const statusTerminais: LeadStatus[] = [
  LeadStatus.PROPOSTA,
  LeadStatus.NEGOCIACAO,
  LeadStatus.CONVERTIDO,
  LeadStatus.PERDIDO,
];

const statusTerminal =
  statusTerminais.includes(visita.lead.status);

      if (!statusTerminal) {
        if (
          status ===
          VisitaStatus.REALIZADA
        ) {
          await tx.lead.update({
            where: {
              id: leadId,
            },

            data: {
              status:
                LeadStatus.VISITA_REALIZADA,
            },
          });
        } else if (
          status ===
            VisitaStatus.CONFIRMADA ||
          status ===
            VisitaStatus.AGENDADA
        ) {
          await tx.lead.update({
            where: {
              id: leadId,
            },

            data: {
              status:
                LeadStatus.VISITA_AGENDADA,
            },
          });
        } else {
          const outraVisitaAtiva =
            await tx.visita.findFirst({
              where: {
                leadId,
                id: {
                  not: visitaId,
                },
                status: {
                  in: [
                    VisitaStatus.AGENDADA,
                    VisitaStatus.CONFIRMADA,
                  ],
                },
              },

              select: {
                id: true,
              },
            });

          await tx.lead.update({
            where: {
              id: leadId,
            },

            data: {
              status: outraVisitaAtiva
                ? LeadStatus.VISITA_AGENDADA
                : LeadStatus.EM_ATENDIMENTO,
            },
          });
        }
      }

      const labels: Record<
        typeof novoStatus,
        string
      > = {
        CONFIRMADA:
          "Visita confirmada",
        REALIZADA:
          "Visita realizada",
        CANCELADA:
          "Visita cancelada",
        NAO_COMPARECEU:
          "Cliente não compareceu à visita",
      };

      const nomeImovel =
        visita.imovel
          ? `${
              visita.imovel.codigo
                ? `${visita.imovel.codigo} • `
                : ""
            }${visita.imovel.title}`
          : visita.imovelTituloSnapshot ||
            "imóvel não informado";

      await tx.leadHistorico.create({
        data: {
          leadId,
          tipo: `VISITA_${novoStatus}`,
          descricao: `${labels[novoStatus]} — ${nomeImovel}.`,
          dados: {
            visitaId,
            status:
              novoStatus,
          },
        },
      });
    }
  );

  revalidatePath(
    `/admin/leads/${leadId}`
  );
  revalidatePath("/admin/leads");
  revalidatePath("/admin/visitas");
}
