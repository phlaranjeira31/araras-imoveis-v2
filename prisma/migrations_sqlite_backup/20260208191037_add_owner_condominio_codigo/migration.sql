/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Imovel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Imovel" ADD COLUMN "codigo" TEXT;
ALTER TABLE "Imovel" ADD COLUMN "condominioNome" TEXT;
ALTER TABLE "Imovel" ADD COLUMN "proprietarioCpf" TEXT;
ALTER TABLE "Imovel" ADD COLUMN "proprietarioEmail" TEXT;
ALTER TABLE "Imovel" ADD COLUMN "proprietarioNome" TEXT;
ALTER TABLE "Imovel" ADD COLUMN "proprietarioTelefone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Imovel_codigo_key" ON "Imovel"("codigo");
