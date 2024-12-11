import { Router } from "express";

import { badge } from "./badge";
import { genre } from "./genre";
import { music } from "./music";
import { ping } from "./ping";
import { role } from "./role";
import { room } from "./room";
import { user } from "./user";
import { video } from "./video";

let router: Router = Router();

/** Verificação de saúde */
router.use("/ping", ping);

/** Rotas de pesquisa */
router.use("/music", music);
router.use("/video", video);

/** Rotas de dados */
router.use("/badge", badge);
router.use("/genre", genre);
router.use("/role", role);
router.use("/room", room);
router.use("/user", user);

export const routes = router;
