import { NextFunction, Request, Response } from "express";

function requestRegisterMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.info(
        `MÉTODO: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
        console.info(
            `MÉTODO: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
        );
    });

    next();
}

export { requestRegisterMiddleware };
