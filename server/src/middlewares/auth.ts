import { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

import { roleRepository, userRepository } from "../repositories";
import { BadRequestError, UnauthorizedError } from "../utils";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        throw new BadRequestError("Autenticação necessária...");
    }

    const { uid } = await getAuth().verifyIdToken(token);
    const user = await userRepository.findByUid(uid);

    if (!user) {
        throw new UnauthorizedError("Usuário inexistente...");
    }

    const { permissions } = await roleRepository.findById(user.role);

    if (!permissions) {
        throw new UnauthorizedError("Role inexistente...");
    }

    req.body.auth = { user, permissions };

    next();
}

export { authMiddleware };
