-- CreateIndex
CREATE INDEX "Imovel_neighborhood_idx" ON "Imovel"("neighborhood");

-- CreateIndex
CREATE INDEX "Imovel_city_idx" ON "Imovel"("city");

-- CreateIndex
CREATE INDEX "Imovel_purpose_idx" ON "Imovel"("purpose");

-- CreateIndex
CREATE INDEX "Imovel_tipo_idx" ON "Imovel"("tipo");

-- CreateIndex
CREATE INDEX "Imovel_price_idx" ON "Imovel"("price");

-- CreateIndex
CREATE INDEX "Imovel_city_neighborhood_idx" ON "Imovel"("city", "neighborhood");
