-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NOVO', 'PRIMEIRO_CONTATO', 'EM_ATENDIMENTO', 'QUALIFICADO', 'IMOVEIS_ENVIADOS', 'VISITA_AGENDADA', 'VISITA_REALIZADA', 'PROPOSTA', 'NEGOCIACAO', 'CONVERTIDO', 'PERDIDO', 'SEM_RETORNO', 'SEM_INTERESSE');

-- CreateEnum
CREATE TYPE "LeadPrioridade" AS ENUM ('BAIXA', 'NORMAL', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "LeadTemperatura" AS ENUM ('FRIO', 'MORNO', 'QUENTE');

-- CreateEnum
CREATE TYPE "LeadOrigem" AS ENUM ('SITE', 'WHATSAPP', 'TELEFONE', 'INSTAGRAM', 'FACEBOOK', 'GOOGLE', 'INDICACAO', 'PRESENCIAL', 'PORTAL_IMOBILIARIO', 'PLACA', 'EVENTO', 'OUTRO');

-- CreateEnum
CREATE TYPE "DemandaFinalidade" AS ENUM ('COMPRAR', 'ALUGAR', 'TEMPORADA', 'INVESTIR', 'VENDER');

-- CreateEnum
CREATE TYPE "InteresseOrigem" AS ENUM ('MANUAL', 'MATCH_AUTOMATICO', 'SITE', 'WHATSAPP', 'OUTRO');

-- CreateEnum
CREATE TYPE "InteresseStatus" AS ENUM ('SUGERIDO', 'ENVIADO', 'VISUALIZADO', 'INTERESSADO', 'VISITA_AGENDADA', 'VISITA_REALIZADA', 'PROPOSTA', 'DESCARTADO');

-- CreateEnum
CREATE TYPE "TarefaTipo" AS ENUM ('LIGACAO', 'WHATSAPP', 'EMAIL', 'RETORNO', 'DOCUMENTO', 'VISITA', 'PROPOSTA', 'OUTRO');

-- CreateEnum
CREATE TYPE "TarefaStatus" AS ENUM ('PENDENTE', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "VisitaStatus" AS ENUM ('AGENDADA', 'CONFIRMADA', 'REALIZADA', 'CANCELADA', 'NAO_COMPARECEU');

-- CreateEnum
CREATE TYPE "PropostaStatus" AS ENUM ('RASCUNHO', 'ENVIADA', 'EM_ANALISE', 'CONTRAPROPOSTA', 'NEGOCIACAO', 'ACEITA', 'RECUSADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "ClienteStatus" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "Contato" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "telefoneNormalizado" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "cpf" TEXT,
    "observacoesGerais" TEXT,
    "consentimentoContato" BOOLEAN,
    "consentimentoEm" TIMESTAMP(3),
    "origemConsentimento" TEXT,
    "bloqueadoParaContato" BOOLEAN NOT NULL DEFAULT false,
    "motivoBloqueioContato" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "contatoId" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NOVO',
    "prioridade" "LeadPrioridade" NOT NULL DEFAULT 'NORMAL',
    "temperatura" "LeadTemperatura" NOT NULL DEFAULT 'MORNO',
    "origem" "LeadOrigem" NOT NULL DEFAULT 'OUTRO',
    "origemDetalhe" TEXT,
    "finalidade" "DemandaFinalidade",
    "assunto" TEXT,
    "mensagemInicial" TEXT,
    "observacoes" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "responsavelId" TEXT,
    "imovelOrigemId" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "paginaOrigem" TEXT,
    "referrer" TEXT,
    "primeiroContatoEm" TIMESTAMP(3),
    "ultimoContatoEm" TIMESTAMP(3),
    "convertidoEm" TIMESTAMP(3),
    "perdidoEm" TIMESTAMP(3),
    "motivoPerda" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Demanda" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "finalidade" "DemandaFinalidade" NOT NULL,
    "tipoImoveis" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cidades" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bairros" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "valorMin" INTEGER,
    "valorMax" INTEGER,
    "quartosMin" INTEGER,
    "suitesMin" INTEGER,
    "banheirosMin" INTEGER,
    "vagasMin" INTEGER,
    "areaConstruidaMin" INTEGER,
    "areaConstruidaMax" INTEGER,
    "areaTerrenoMin" INTEGER,
    "areaTerrenoMax" INTEGER,
    "mobiliado" BOOLEAN,
    "desejaCondominio" BOOLEAN,
    "aceitaReforma" BOOLEAN,
    "observacoes" TEXT,
    "criteriosExtras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Demanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteresseImovel" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "imovelId" TEXT,
    "imovelCodigoSnapshot" TEXT,
    "imovelTituloSnapshot" TEXT,
    "origem" "InteresseOrigem" NOT NULL DEFAULT 'MANUAL',
    "status" "InteresseStatus" NOT NULL DEFAULT 'INTERESSADO',
    "score" INTEGER,
    "motivosMatch" JSONB,
    "observacoes" TEXT,
    "ultimoContatoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InteresseImovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadHistorico" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dados" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadHistorico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadTarefa" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "responsavelId" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TarefaTipo" NOT NULL DEFAULT 'OUTRO',
    "status" "TarefaStatus" NOT NULL DEFAULT 'PENDENTE',
    "prioridade" "LeadPrioridade" NOT NULL DEFAULT 'NORMAL',
    "dataPrevista" TIMESTAMP(3) NOT NULL,
    "concluidaEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadTarefa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visita" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "imovelId" TEXT,
    "responsavelId" TEXT,
    "imovelCodigoSnapshot" TEXT,
    "imovelTituloSnapshot" TEXT,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "duracaoMinutos" INTEGER NOT NULL DEFAULT 60,
    "status" "VisitaStatus" NOT NULL DEFAULT 'AGENDADA',
    "observacoes" TEXT,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposta" (
    "id" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "leadId" TEXT NOT NULL,
    "imovelId" TEXT,
    "responsavelId" TEXT,
    "imovelCodigoSnapshot" TEXT,
    "imovelTituloSnapshot" TEXT,
    "valorAnuncio" INTEGER,
    "valorProposto" INTEGER NOT NULL,
    "entrada" INTEGER,
    "financiamento" BOOLEAN,
    "formaPagamento" TEXT,
    "condicoes" TEXT,
    "status" "PropostaStatus" NOT NULL DEFAULT 'RASCUNHO',
    "validade" TIMESTAMP(3),
    "aceitaEm" TIMESTAMP(3),
    "recusadaEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropostaHistorico" (
    "id" TEXT NOT NULL,
    "propostaId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "acao" TEXT NOT NULL,
    "statusAnterior" "PropostaStatus",
    "statusNovo" "PropostaStatus",
    "valorAnterior" INTEGER,
    "valorNovo" INTEGER,
    "descricao" TEXT,
    "dados" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropostaHistorico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "contatoId" TEXT NOT NULL,
    "leadOrigemId" TEXT,
    "status" "ClienteStatus" NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,
    "clienteDesde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contato_nome_idx" ON "Contato"("nome");

-- CreateIndex
CREATE INDEX "Contato_telefone_idx" ON "Contato"("telefone");

-- CreateIndex
CREATE INDEX "Contato_telefoneNormalizado_idx" ON "Contato"("telefoneNormalizado");

-- CreateIndex
CREATE INDEX "Contato_email_idx" ON "Contato"("email");

-- CreateIndex
CREATE INDEX "Contato_createdAt_idx" ON "Contato"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_numero_key" ON "Lead"("numero");

-- CreateIndex
CREATE INDEX "Lead_contatoId_idx" ON "Lead"("contatoId");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_prioridade_idx" ON "Lead"("prioridade");

-- CreateIndex
CREATE INDEX "Lead_temperatura_idx" ON "Lead"("temperatura");

-- CreateIndex
CREATE INDEX "Lead_origem_idx" ON "Lead"("origem");

-- CreateIndex
CREATE INDEX "Lead_responsavelId_idx" ON "Lead"("responsavelId");

-- CreateIndex
CREATE INDEX "Lead_imovelOrigemId_idx" ON "Lead"("imovelOrigemId");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_updatedAt_idx" ON "Lead"("updatedAt");

-- CreateIndex
CREATE INDEX "Demanda_leadId_idx" ON "Demanda"("leadId");

-- CreateIndex
CREATE INDEX "Demanda_finalidade_idx" ON "Demanda"("finalidade");

-- CreateIndex
CREATE INDEX "Demanda_ativo_idx" ON "Demanda"("ativo");

-- CreateIndex
CREATE INDEX "Demanda_createdAt_idx" ON "Demanda"("createdAt");

-- CreateIndex
CREATE INDEX "InteresseImovel_leadId_idx" ON "InteresseImovel"("leadId");

-- CreateIndex
CREATE INDEX "InteresseImovel_imovelId_idx" ON "InteresseImovel"("imovelId");

-- CreateIndex
CREATE INDEX "InteresseImovel_status_idx" ON "InteresseImovel"("status");

-- CreateIndex
CREATE INDEX "InteresseImovel_origem_idx" ON "InteresseImovel"("origem");

-- CreateIndex
CREATE INDEX "InteresseImovel_score_idx" ON "InteresseImovel"("score");

-- CreateIndex
CREATE INDEX "InteresseImovel_createdAt_idx" ON "InteresseImovel"("createdAt");

-- CreateIndex
CREATE INDEX "LeadHistorico_leadId_idx" ON "LeadHistorico"("leadId");

-- CreateIndex
CREATE INDEX "LeadHistorico_leadId_createdAt_idx" ON "LeadHistorico"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "LeadHistorico_usuarioId_idx" ON "LeadHistorico"("usuarioId");

-- CreateIndex
CREATE INDEX "LeadHistorico_tipo_idx" ON "LeadHistorico"("tipo");

-- CreateIndex
CREATE INDEX "LeadTarefa_leadId_idx" ON "LeadTarefa"("leadId");

-- CreateIndex
CREATE INDEX "LeadTarefa_responsavelId_idx" ON "LeadTarefa"("responsavelId");

-- CreateIndex
CREATE INDEX "LeadTarefa_status_idx" ON "LeadTarefa"("status");

-- CreateIndex
CREATE INDEX "LeadTarefa_dataPrevista_idx" ON "LeadTarefa"("dataPrevista");

-- CreateIndex
CREATE INDEX "LeadTarefa_prioridade_idx" ON "LeadTarefa"("prioridade");

-- CreateIndex
CREATE INDEX "Visita_leadId_idx" ON "Visita"("leadId");

-- CreateIndex
CREATE INDEX "Visita_imovelId_idx" ON "Visita"("imovelId");

-- CreateIndex
CREATE INDEX "Visita_responsavelId_idx" ON "Visita"("responsavelId");

-- CreateIndex
CREATE INDEX "Visita_status_idx" ON "Visita"("status");

-- CreateIndex
CREATE INDEX "Visita_dataHora_idx" ON "Visita"("dataHora");

-- CreateIndex
CREATE UNIQUE INDEX "Proposta_numero_key" ON "Proposta"("numero");

-- CreateIndex
CREATE INDEX "Proposta_leadId_idx" ON "Proposta"("leadId");

-- CreateIndex
CREATE INDEX "Proposta_imovelId_idx" ON "Proposta"("imovelId");

-- CreateIndex
CREATE INDEX "Proposta_responsavelId_idx" ON "Proposta"("responsavelId");

-- CreateIndex
CREATE INDEX "Proposta_status_idx" ON "Proposta"("status");

-- CreateIndex
CREATE INDEX "Proposta_createdAt_idx" ON "Proposta"("createdAt");

-- CreateIndex
CREATE INDEX "PropostaHistorico_propostaId_idx" ON "PropostaHistorico"("propostaId");

-- CreateIndex
CREATE INDEX "PropostaHistorico_propostaId_createdAt_idx" ON "PropostaHistorico"("propostaId", "createdAt");

-- CreateIndex
CREATE INDEX "PropostaHistorico_usuarioId_idx" ON "PropostaHistorico"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_contatoId_key" ON "Cliente"("contatoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_leadOrigemId_key" ON "Cliente"("leadOrigemId");

-- CreateIndex
CREATE INDEX "Cliente_status_idx" ON "Cliente"("status");

-- CreateIndex
CREATE INDEX "Cliente_clienteDesde_idx" ON "Cliente"("clienteDesde");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "Contato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_imovelOrigemId_fkey" FOREIGN KEY ("imovelOrigemId") REFERENCES "Imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demanda" ADD CONSTRAINT "Demanda_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteresseImovel" ADD CONSTRAINT "InteresseImovel_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteresseImovel" ADD CONSTRAINT "InteresseImovel_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadHistorico" ADD CONSTRAINT "LeadHistorico_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadHistorico" ADD CONSTRAINT "LeadHistorico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadTarefa" ADD CONSTRAINT "LeadTarefa_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadTarefa" ADD CONSTRAINT "LeadTarefa_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visita" ADD CONSTRAINT "Visita_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visita" ADD CONSTRAINT "Visita_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visita" ADD CONSTRAINT "Visita_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposta" ADD CONSTRAINT "Proposta_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposta" ADD CONSTRAINT "Proposta_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposta" ADD CONSTRAINT "Proposta_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropostaHistorico" ADD CONSTRAINT "PropostaHistorico_propostaId_fkey" FOREIGN KEY ("propostaId") REFERENCES "Proposta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropostaHistorico" ADD CONSTRAINT "PropostaHistorico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "Contato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_leadOrigemId_fkey" FOREIGN KEY ("leadOrigemId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
