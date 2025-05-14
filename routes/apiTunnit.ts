import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/virhekasittely';

const prisma : PrismaClient = new PrismaClient();

const apiTunnitRouter : express.Router = express.Router();

apiTunnitRouter.use(express.json());


apiTunnitRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        const kaikkiTunnit = await prisma.tunnit.findMany({
          include: {
            osallistujat: true
          }
        });
    
        res.json(kaikkiTunnit);
      } catch (e) {
        next(new Virhe());
      }
    });

    export default apiTunnitRouter;