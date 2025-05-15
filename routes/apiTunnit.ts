import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/virhekasittely';
import { checkToken } from '../middleware/checkToken';

const prisma : PrismaClient = new PrismaClient();

const apiTunnitRouter : express.Router = express.Router();

apiTunnitRouter.use(express.json());


apiTunnitRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        const kaikkiTunnit = await prisma.tunnit.findMany({
          include: {
            osallistujat: {
              select: {kayttajaId: true}
            }
          }
        });
    
        res.json(kaikkiTunnit);
      } catch (e) {
        next(new Virhe());
      }
    });

    apiTunnitRouter.put("/:TunnitId", checkToken, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
     const tunnitId = Number(req.params.TunnitId);
      const kayttajaId = (req as any).kayttaja.kayttajaId;

     const tarkastaTunti = await prisma.tunnit.count({
      where: {
      TunnitId: tunnitId
            }
      });

      if (tarkastaTunti === 1) {
        try {
        await prisma.tunnit.update({
        where: { TunnitId: tunnitId },
        data: {
          osallistujat: {
            connect: { kayttajaId: kayttajaId }
          }
        }
        });

        res.json(await prisma.tunnit.findMany({
        include: { osallistujat: true } 
        }));
      } catch (e: any) {
        console.error(e);
        next(new Virhe(500, "Tietokantavirhe"));
      }
    } else {
      next(new Virhe(400, "Virheellinen tuntiId"));
    }
    });

    apiTunnitRouter.get("/kayttajaId", checkToken, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

      try {
        const kayttajaId = (req as any).kayttaja.kayttajaId;

        const kayttaja = await prisma.kayttajat.findUnique({
          where: {kayttajaId},
          include: {
            ilmoittautumiset: true,
          },
        });
        res.json(kayttaja);
      } catch (e: any) {
        next(new Virhe(400, "Virheellinen kayttajaId"));
      }
    });

    apiTunnitRouter.put("/peru/:TunnitId", checkToken, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const tunnitId = Number(req.params.TunnitId);
        const kayttajaId = (req as any).kayttaja.kayttajaId;

        await prisma.tunnit.update({
          where: {TunnitId: tunnitId},
          data: {
            osallistujat: {
              disconnect: {kayttajaId}
            }
          }
        });
        res.status(200).json({viesti: "Ilmoittautuminen peruttu"});
      } catch (e) {
        console.error(e);
        next(new Virhe(500, "Virhe tietokannassa"));
      }
    });

    export default apiTunnitRouter;