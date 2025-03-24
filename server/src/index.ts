import "dotenv/config";
import "express-async-errors";

import express from "express";
import http from "http";

import "./data-source";

import path from "path";

import {
    errorMiddleware,
    requestRegisterMiddleware,
    rulesMiddleware,
} from "./middlewares";
import { routes } from "./routes";
import { ServerSocket, Spotify, YouTube } from "./utils";
import { startSocketServer } from "./utils/ServerSocket2";

/** Cria o aplicativo express */
const application = express();

// Deploy
// const __dirname = path.resolve();


/** Regras da nossa API */
application.use(rulesMiddleware);

/** Analisar o corpo da solicitação */
application.use(express.urlencoded({ extended: true }));
application.use(express.json());

/** Registre a solicitação */
application.use(requestRegisterMiddleware);

/** Rotas */
application.use(routes);
application.use(express.static(path.join(__dirname,"../../frontend/dist")));
application.get("/*", (req, res) =>{
    res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
})

/** Tratamento de erros */
application.use(errorMiddleware);

/** Cria o servidor http */
const httpServer = http.createServer(application);

/** Porta que será ouvida */
const PORT = process.env.PORT ?? 1337;

/** Inicia o servidor e o socket */
httpServer.listen(process.env.PORT, async () => {
    /** Cria e inicia o web socket */
    // new ServerSocket(httpServer);
    startSocketServer(httpServer);

    /** Cria e inicia o Spotify */
    new Spotify();
    await Spotify.Start();

    /** Cria e inicia o YouTube */
    new YouTube();

    console.info(`Servidor em execução na porta ${process.env.PORT}`);
});
