/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `BlogPost` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "author" TEXT,
    "coverUrl" TEXT,
    "imagesJson" TEXT NOT NULL DEFAULT '[]',
    "videosJson" TEXT NOT NULL DEFAULT '[]',
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_BlogPost" ("author", "category", "content", "coverUrl", "createdAt", "excerpt", "id", "publishedAt", "slug", "title") SELECT "author", "category", "content", "coverUrl", "createdAt", "excerpt", "id", "publishedAt", "slug", "title" FROM "BlogPost";
DROP TABLE "BlogPost";
ALTER TABLE "new_BlogPost" RENAME TO "BlogPost";
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
