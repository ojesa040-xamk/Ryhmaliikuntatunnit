-- CreateTable
CREATE TABLE "Tunnit" (
    "TunnitId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttajaId" INTEGER NOT NULL,
    "tunti" TEXT NOT NULL,
    "paivanmaara" TEXT NOT NULL,
    CONSTRAINT "Tunnit_kayttajaId_fkey" FOREIGN KEY ("kayttajaId") REFERENCES "Kayttajat" ("kayttajaId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Kayttajat" (
    "kayttajaId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttajatunnus" TEXT NOT NULL,
    "salasana" TEXT NOT NULL
);
