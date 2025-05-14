/*
  Warnings:

  - Added the required column `kellonaika` to the `Tunnit` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tunnit" (
    "TunnitId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tunti" TEXT NOT NULL,
    "paivanmaara" TEXT NOT NULL,
    "kellonaika" TEXT NOT NULL
);
INSERT INTO "new_Tunnit" ("TunnitId", "paivanmaara", "tunti") SELECT "TunnitId", "paivanmaara", "tunti" FROM "Tunnit";
DROP TABLE "Tunnit";
ALTER TABLE "new_Tunnit" RENAME TO "Tunnit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
