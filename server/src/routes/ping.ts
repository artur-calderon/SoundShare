import { Router, Request, Response } from "express";

let router: Router = Router();

router.get("", (req: Request, res: Response) => {
    return res.json("Olá mundo!");
});

export const ping = router;
