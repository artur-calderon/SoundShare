import { NextFunction, Request, Response } from "express";

function rulesMiddleware(req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");

        return res.status(204).send();
    }

    next();
}

export { rulesMiddleware };
