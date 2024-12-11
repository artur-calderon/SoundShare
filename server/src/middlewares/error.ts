import { NextFunction, Request, Response } from "express";
import { FirebaseError } from "firebase-admin";

import { ServerError } from "../utils";

const expectedErrors: Record<string, number> = {
    "auth/email-already-exists": 403,
    "auth/id-token-expired": 401,
    "auth/id-token-revoked": 401,
    "auth/user-not-found": 404,
    "auth/invalid": 400,
};

function errorMiddleware(
    error: Error & Partial<ServerError> & Partial<FirebaseError>,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode: number = expectedErrors[error.code ?? ""];

    if (!statusCode) {
        statusCode = expectedErrors[error.code?.split("-")[0] ?? ""];

        if (!statusCode) {
            statusCode = error.statusCode ?? 500;
        }
    }

    let message: string = error.message ?? "Internal Server Error";

    if (statusCode == 500) {
        console.info("Erro não tratado:", error);
    }

    return res.status(statusCode).json({ message });
}

export { errorMiddleware };
