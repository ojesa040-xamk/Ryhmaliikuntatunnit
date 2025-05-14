/*
  Warnings:

  - You are about to drop the column `kayttajaId` on the `Tunnit` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tunnit" (
    "TunnitId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tunti" TEXT NOT NULL,
    "paivanmaara" TEXT NOT NULL
);
INSERT INTO "new_Tunnit" ("TunnitId", "paivanmaara", "tunti") SELECT "TunnitId", "paivanmaara", "tunti" FROM "Tunnit";
DROP TABLE "Tunnit";
ALTER TABLE "new_Tunnit" RENAME TO "Tunnit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
