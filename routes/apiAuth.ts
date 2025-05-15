import { PrismaClient } from "@prisma/client";
import { Virhe } from "../errors/virhekasittely";
import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const apiAuthRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiAuthRouter.use(express.json());

apiAuthRouter.post("/kirjautuminen", async (req : express.Request, res : express.Response, next : express.NextFunction) : Promise<void> => {

    try {
        const kayttaja = await prisma.kayttajat.findFirst({
            where : {
                kayttajatunnus : req.body.kayttajatunnus
            }
        });
        if (req.body.kayttajatunnus === kayttaja?.kayttajatunnus) {
            let hash = crypto.createHash("sha512").update(req.body.salasana).digest("hex");

            if (hash === kayttaja?.salasana) {
                let token = jwt.sign(
                { kayttajaId: kayttaja.kayttajaId,
                  kayttajatunnus: kayttaja.kayttajatunnus },
                "SalausAvainOk"
);

                res.json({token : token})
            } else {
                next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
            }
        } else {
            next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
        }
    } catch {
        next(new Virhe());
    }
});

apiAuthRouter.post("/rekisterointi", async (req, res, next) => {
  try {
    const { kayttajatunnus, salasana } = req.body;

    if (!kayttajatunnus || !salasana) {
      return next(new Virhe(400, "Käyttäjätunnus ja salasana vaaditaan"));
    }

    const existing = await prisma.kayttajat.findFirst({
      where: { kayttajatunnus }
    });

    if (existing) {
      return next(new Virhe(409, "Käyttäjätunnus on jo käytössä"));
    }

    const hash = crypto.createHash("sha512").update(salasana).digest("hex");

    const uusiKayttaja = await prisma.kayttajat.create({
      data: {
        kayttajatunnus,
        salasana: hash
      }
    });

    const token = jwt.sign(
      { kayttajatunnus: uusiKayttaja.kayttajatunnus,
        kayttajaId: uusiKayttaja.kayttajaId
      }, "SalausAvainOk");
    res.status(201).json({ token });

  } catch (e) {
    next(new Virhe());
  }
});


export default apiAuthRouter;