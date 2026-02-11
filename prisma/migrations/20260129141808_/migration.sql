/*
  Warnings:

  - Added the required column `slug` to the `imovel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_imovel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "price" INTEGER,
    "image" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_imovel" ("city", "createdAt", "id", "neighborhood", "price", "title", "updatedAt") SELECT "city", "createdAt", "id", "neighborhood", "price", "title", "updatedAt" FROM "imovel";
DROP TABLE "imovel";
ALTER TABLE "new_imovel" RENAME TO "imovel";
CREATE UNIQUE INDEX "imovel_slug_key" ON "imovel"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
