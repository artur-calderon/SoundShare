import { Router, Request, Response } from "express";

import { authMiddleware } from "../middlewares";
import { BadRequestError, YouTube } from "../utils";

let router: Router = Router();

router.get("", authMiddleware, async (req: Request, res: Response) => {
    const { name, artist, search } = req.query;
    console.log({ name, artist, search });
    if ((!name || !artist) && !search) {
        throw new BadRequestError(
            "Parametros insufucientes... Espera-se: video?name={nome da música}&artist={nome do artista} ou video?search={sua pesquisa}"
        );
    }

    const query =
        !name || !artist
            ? (search as string)
            : `${name as string} ${artist as string}`;

    const result = await YouTube.Search(query);

    return res.json(result);
});

export const video = router;
