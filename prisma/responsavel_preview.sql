-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "responsavelNome" TEXT;

-- CreateIndex
CREATE INDEX "Lead_responsavelNome_idx" ON "Lead"("responsavelNome");
