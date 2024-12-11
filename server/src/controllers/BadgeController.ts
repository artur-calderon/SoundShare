import { Request, Response } from "express";

import { Badge } from "../entities";
import { IAuth } from "../interfaces";
import { badgeRepository } from "../repositories";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
} from "../utils";

class BadgeController {
    public static async Create(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.badges?.create) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        if (!req.body.info) {
            throw new BadRequestError(
                "Espera-se uma propriedade 'info' com as informações da nova badge..."
            );
        }

        const { name: _name, image } = req.body.info as Badge;

        const name = _name?.trim();

        const exist = await badgeRepository.nameExists(name);

        if (exist) {
            throw new ForbiddenError(`Badge ${name} já existe...`);
        }

        const info = {
            name,
            image,
        };

        const newBadge = await badgeRepository.create(info);

        return res.status(201).json(newBadge);
    }

    public static async Get(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.badges?.read) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        const { id } = req.params;

        let result: Badge | Badge[];

        if (!id) {
            result = await badgeRepository.find();
        } else {
            result = await badgeRepository.findById(id);
        }

        if (!result) {
            throw new NotFoundError("Badge inexistente...");
        }

        return res.json(result);
    }

    public static async Update(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.badges?.update) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        const { id } = req.params;

        if (!id) {
            throw new BadRequestError(
                "Necessário um 'id' para realizar atualização..."
            );
        }

        const badge = await badgeRepository.findById(id);

        if (!badge) {
            throw new NotFoundError("Badge inexistente...");
        }

        if (!req.body.info) {
            throw new BadRequestError(
                "Espera-se uma propriedade 'info' com as informações à atualizar..."
            );
        }

        const { name: _name, image } = req.body.info as Badge;

        const name = _name?.trim();

        const exist = await badgeRepository.nameExists(name);

        if (exist) {
            throw new ForbiddenError(`Badge ${name} já existe...`);
        }

        badge.name = name ? name : badge.name;
        badge.image = image ? image : badge.image;

        const badgeUpdated = await badgeRepository.update(badge);

        return res.json(badgeUpdated);
    }

    public static async Delete(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.badges?.delete) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        const { id } = req.params;

        if (!id) {
            throw new BadRequestError(
                "Necessário um 'id' para realizar exclusão..."
            );
        }

        const badge = await badgeRepository.findById(id);

        if (!badge) {
            throw new NotFoundError("Badge inexistente...");
        }

        await badgeRepository.delete(id);

        return res.status(204).send();
    }
}

export { BadgeController };
