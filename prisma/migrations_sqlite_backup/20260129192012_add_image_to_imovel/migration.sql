/*
  Warnings:

  - You are about to drop the column `coverPhotoId` on the `Imovel` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Imovel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "cep" TEXT,
    "price" INTEGER,
    "image" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Imovel" ("cep", "city", "createdAt", "id", "neighborhood", "price", "slug", "title", "updatedAt") SELECT "cep", "city", "createdAt", "id", "neighborhood", "price", "slug", "title", "updatedAt" FROM "Imovel";
DROP TABLE "Imovel";
ALTER TABLE "new_Imovel" RENAME TO "Imovel";
CREATE UNIQUE INDEX "Imovel_slug_key" ON "Imovel"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
