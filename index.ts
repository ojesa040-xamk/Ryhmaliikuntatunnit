
import express from 'express'
import cors from 'cors';
import path from 'path';
import virheKasittely from './errors/virhekasittely';
import apiAuthRouter from './routes/apiAuth';
import apiTunnitRouter from './routes/apiTunnit';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3107;

app.use(express.json());

app.use(cors({origin: "http://localhost:3000"}));

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/auth", apiAuthRouter);
app.use("/api/tunnit", apiTunnitRouter);

app.use(virheKasittely);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {
    if (!res.headersSent) {
        res.status(404).json({viesti : "Virheellinen reitti"});
    }
    next();
})

app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin : ${portti}`);
});


