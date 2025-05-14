-- CreateTable
CREATE TABLE "_Ilmoittautumiset" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Ilmoittautumiset_A_fkey" FOREIGN KEY ("A") REFERENCES "Kayttajat" ("kayttajaId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Ilmoittautumiset_B_fkey" FOREIGN KEY ("B") REFERENCES "Tunnit" ("TunnitId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tunnit" (
    "TunnitId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttajaId" INTEGER,
    "tunti" TEXT NOT NULL,
    "paivanmaara" TEXT NOT NULL
);
INSERT INTO "new_Tunnit" ("TunnitId", "kayttajaId", "paivanmaara", "tunti") SELECT "TunnitId", "kayttajaId", "paivanmaara", "tunti" FROM "Tunnit";
DROP TABLE "Tunnit";
ALTER TABLE "new_Tunnit" RENAME TO "Tunnit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_Ilmoittautumiset_AB_unique" ON "_Ilmoittautumiset"("A", "B");

-- CreateIndex
CREATE INDEX "_Ilmoittautumiset_B_index" ON "_Ilmoittautumiset"("B");
