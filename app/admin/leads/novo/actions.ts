"use server";

import {
  DemandaFinalidade,
  InteresseOrigem,
  InteresseStatus,
  LeadOrigem,
  LeadPrioridade,
  LeadTemperatura,
  Prisma,
} from "@prisma/client";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function text(value: FormDataEntryValue | null) {
  const result = String(value ?? "").trim();
  return result || null;
}

function numberOrNull(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();

  if (!raw) return null;

  const number = Number(raw);

  if (!Number.isFinite(number)) {
    return null;
  }

  return Math.round(number);
}

function booleanOrNull(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();

  if (raw === "true") return true;
  if (raw === "false") return false;

  return null;
}

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter(
      (item, index, array) =>
        array.findIndex(
          (other) =>
            other.toLocaleLowerCase("pt-BR") ===
            item.toLocaleLowerCase("pt-BR")
        ) === index
    );
}

function normalizePhone(value?: string | null) {
  if (!value) return null;

  const digits = value.replace(/\D/g, "");

  if (!digits) return null;

  return digits.startsWith("55") && digits.length >= 12
    ? digits.slice(2)
    : digits;
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

export async function criarLead(formData: FormData) {
  /* =======================================================
     PESSOA
  ======================================================= */

  const nome = text(formData.get("nome"));

  const telefone = text(formData.get("telefone"));
  const whatsapp = text(formData.get("whatsapp"));
  const email = text(formData.get("email"));
  const cpf = text(formData.get("cpf"));

  if (!nome) {
    redirect("/admin/leads/novo?erro=nome");
  }

  if (!telefone && !whatsapp && !email) {
    redirect("/admin/leads/novo?erro=contato");
  }

  const principalPhone = whatsapp || telefone;
  const telefoneNormalizado = normalizePhone(principalPhone);

  /* =======================================================
     CLASSIFICAÇÃO
  ======================================================= */

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

  const finalidadeRaw = text(
    formData.get("finalidade")
  );

  if (
    !finalidadeRaw ||
    !Object.values(DemandaFinalidade).includes(
      finalidadeRaw as DemandaFinalidade
    )
  ) {
    redirect("/admin/leads/novo?erro=finalidade");
  }

  const finalidade =
    finalidadeRaw as DemandaFinalidade;

  const origemDetalhe = text(
    formData.get("origemDetalhe")
  );

  const responsavelId = text(
    formData.get("responsavelId")
  );

  const responsavelNome = text(
    formData.get("responsavelNome")
  );

  /* =======================================================
     DEMANDA
  ======================================================= */

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

  const areaConstruidaMin = numberOrNull(
    formData.get("areaConstruidaMin")
  );

  const areaConstruidaMax = numberOrNull(
    formData.get("areaConstruidaMax")
  );

  const areaTerrenoMin = numberOrNull(
    formData.get("areaTerrenoMin")
  );

  const areaTerrenoMax = numberOrNull(
    formData.get("areaTerrenoMax")
  );

  const mobiliado = booleanOrNull(
    formData.get("mobiliado")
  );

  const desejaCondominio = booleanOrNull(
    formData.get("desejaCondominio")
  );

  const aceitaReforma = booleanOrNull(
    formData.get("aceitaReforma")
  );

  const demandaObservacoes = text(
    formData.get("demandaObservacoes")
  );

  /* =======================================================
     ATENDIMENTO
  ======================================================= */

  const assunto = text(
    formData.get("assunto")
  );

  const mensagemInicial = text(
    formData.get("mensagemInicial")
  );

  const observacoes = text(
    formData.get("observacoes")
  );

  /* =======================================================
     IMÓVEIS ESPECÍFICOS
  ======================================================= */

  const imovelIds = Array.from(
    new Set(
      formData
        .getAll("imovelIds")
        .map((value) => String(value).trim())
        .filter(Boolean)
    )
  );

  // Compatibilidade com o campo antigo de imóvel único.
  const imovelIdLegado = text(
    formData.get("imovelId")
  );

  if (
    imovelIds.length === 0 &&
    imovelIdLegado
  ) {
    imovelIds.push(imovelIdLegado);
  }

  /* =======================================================
     LGPD
  ======================================================= */

  const consentimentoContato =
    booleanOrNull(
      formData.get("consentimentoContato")
    );

  const origemConsentimento = text(
    formData.get("origemConsentimento")
  );

  /* =======================================================
     TRANSAÇÃO
  ======================================================= */

  const result = await prisma.$transaction(
    async (tx) => {
      /*
       * Procuramos pessoa existente por
       * telefone OU e-mail.
       *
       * NÃO apagamos nem sobrescrevemos
       * informação existente.
       */

      const possibleContacts:
        Prisma.ContatoWhereInput[] = [];

      if (telefoneNormalizado) {
        possibleContacts.push({
          telefoneNormalizado,
        });
      }

      if (email) {
        possibleContacts.push({
          email: {
            equals: email,
            mode: "insensitive",
          },
        });
      }

      const contatoExistente =
        possibleContacts.length > 0
          ? await tx.contato.findFirst({
              where: {
                OR: possibleContacts,
              },

              orderBy: {
                createdAt: "asc",
              },
            })
          : null;

      let contato;

      if (contatoExistente) {
        /*
         * Reutilizamos o contato.
         * Só completamos campos que ainda
         * estavam vazios.
         */

        const updateData:
          Prisma.ContatoUpdateInput = {};

        if (
          !contatoExistente.telefone &&
          telefone
        ) {
          updateData.telefone = telefone;
        }

        if (
          !contatoExistente.whatsapp &&
          whatsapp
        ) {
          updateData.whatsapp = whatsapp;
        }

        if (
          !contatoExistente.email &&
          email
        ) {
          updateData.email = email;
        }

        if (
          !contatoExistente.cpf &&
          cpf
        ) {
          updateData.cpf = cpf;
        }

        if (
          !contatoExistente.telefoneNormalizado &&
          telefoneNormalizado
        ) {
          updateData.telefoneNormalizado =
            telefoneNormalizado;
        }

        if (
          contatoExistente.consentimentoContato ===
            null &&
          consentimentoContato !== null
        ) {
          updateData.consentimentoContato =
            consentimentoContato;
        }

        if (
          !contatoExistente.origemConsentimento &&
          origemConsentimento
        ) {
          updateData.origemConsentimento =
            origemConsentimento;
        }

        if (
          Object.keys(updateData).length >
          0
        ) {
          contato =
            await tx.contato.update({
              where: {
                id: contatoExistente.id,
              },

              data: updateData,
            });
        } else {
          contato = contatoExistente;
        }
      } else {
        contato =
          await tx.contato.create({
            data: {
              nome,

              telefone,

              whatsapp,

              telefoneNormalizado,

              email,

              cpf,

              consentimentoContato,

              consentimentoEm:
                consentimentoContato === true
                  ? new Date()
                  : null,

              origemConsentimento,
            },
          });
      }

      /*
       * Valida responsável.
       */

      let responsavelFinalId:
        string | null = null;

      if (responsavelId) {
        const user =
          await tx.user.findUnique({
            where: {
              id: responsavelId,
            },

            select: {
              id: true,
            },
          });

        if (user) {
          responsavelFinalId =
            user.id;
        }
      }

      /*
       * Valida os imóveis específicos selecionados.
       * A ordem escolhida no formulário é preservada.
       */

      const imoveisEncontrados =
        imovelIds.length > 0
          ? await tx.imovel.findMany({
              where: {
                id: {
                  in: imovelIds,
                },
              },

              select: {
                id: true,
                title: true,
                codigo: true,
              },
            })
          : [];

      const imoveisPorId = new Map(
        imoveisEncontrados.map((imovel) => [
          imovel.id,
          imovel,
        ])
      );

      const imoveis = imovelIds
        .map((imovelId) =>
          imoveisPorId.get(imovelId)
        )
        .filter(
          (imovel): imovel is {
            id: string;
            title: string;
            codigo: string | null;
          } => Boolean(imovel)
        );

      // Mantemos o primeiro como imóvel de origem/principal
      // para preservar a compatibilidade com o CRM atual.
      const imovelPrincipal =
        imoveis[0] ?? null;

      /*
       * Cria oportunidade.
       */

      const lead =
        await tx.lead.create({
          data: {
            contatoId: contato.id,

            status: "NOVO",

            prioridade,

            temperatura,

            origem,

            origemDetalhe,

            finalidade,

            assunto,

            mensagemInicial,

            observacoes,

            score: 0,

            responsavelId:
              responsavelFinalId,

            responsavelNome,

            imovelOrigemId:
              imovelPrincipal?.id ?? null,
          },
        });

      /*
       * Cria ficha de demanda.
       */

      await tx.demanda.create({
        data: {
          leadId: lead.id,

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

          areaConstruidaMin,

          areaConstruidaMax,

          areaTerrenoMin,

          areaTerrenoMax,

          mobiliado,

          desejaCondominio,

          aceitaReforma,

          observacoes:
            demandaObservacoes,
        },
      });

      /*
       * Registra todos os imóveis selecionados
       * como interesses do lead.
       */

      if (imoveis.length > 0) {
        await tx.interesseImovel.createMany({
          data: imoveis.map((imovel) => ({
            leadId: lead.id,

            imovelId: imovel.id,

            imovelCodigoSnapshot:
              imovel.codigo,

            imovelTituloSnapshot:
              imovel.title,

            origem:
              InteresseOrigem.MANUAL,

            status:
              InteresseStatus.INTERESSADO,

            observacoes:
              "Imóvel relacionado no cadastro inicial do lead.",
          })),
        });
      }

      /*
       * Histórico inicial.
       */

      await tx.leadHistorico.create({
        data: {
          leadId: lead.id,

          usuarioId:
            responsavelFinalId,

          tipo: "LEAD_CRIADO_MANUAL",

          descricao:
            contatoExistente
              ? "Nova oportunidade criada utilizando um contato já existente no CRM."
              : "Lead cadastrado manualmente no CRM.",

          dados: {
            origem,
            finalidade,
            prioridade,
            temperatura,
            responsavelNome,
            contatoReutilizado:
              Boolean(
                contatoExistente
              ),

            imovelRelacionado:
              imovelPrincipal
                ? {
                    id: imovelPrincipal.id,
                    codigo:
                      imovelPrincipal.codigo,
                    titulo:
                      imovelPrincipal.title,
                  }
                : null,

            imoveisRelacionados:
              imoveis.map((imovel) => ({
                id: imovel.id,
                codigo: imovel.codigo,
                titulo: imovel.title,
              })),
          },
        },
      });

      return {
        id: lead.id,
        numero: lead.numero,
      };
    }
  );

  revalidatePath("/admin/leads");

  redirect(
    `/admin/leads?criado=${result.numero}`
  );
}