import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ virhe: "Token puuttuu" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "SalausAvainOk") as {
      kayttajaId: number;
      kayttajatunnus: string };

    (req as any).kayttaja = decoded;

    next();
  } catch (e) {
    res.status(401).json({ virhe: "Virheellinen token" });
  }
};