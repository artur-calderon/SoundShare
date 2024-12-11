import { Router, Request, Response } from "express";

import { authMiddleware } from "../middlewares";
import { BadRequestError, Spotify } from "../utils";

let router: Router = Router();

router.get("", authMiddleware, async (req: Request, res: Response) => {
    const { search } = req.query;

    if (!search) {
        throw new BadRequestError(
            "Parametros insufucientes... Espera-se: /music?search={sua pesquisa}"
        );
    }

    const result = await Spotify.Search(search as string);

    return res.json(result);
});

export const music = router;
