/*
  Warnings:

  - You are about to drop the `ImovelPhoto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `image` on the `Imovel` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ImovelPhoto_imovelId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ImovelPhoto";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Imovel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "cep" TEXT,
    "street" TEXT,
    "number" TEXT,
    "lat" REAL,
    "lng" REAL,
    "price" INTEGER,
    "slug" TEXT NOT NULL,
    "coverPhotoId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Imovel" ("cep", "city", "createdAt", "id", "neighborhood", "price", "slug", "title", "updatedAt") SELECT "cep", "city", "createdAt", "id", "neighborhood", "price", "slug", "title", "updatedAt" FROM "Imovel";
DROP TABLE "Imovel";
ALTER TABLE "new_Imovel" RENAME TO "Imovel";
CREATE UNIQUE INDEX "Imovel_slug_key" ON "Imovel"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Photo_imovelId_idx" ON "Photo"("imovelId");
