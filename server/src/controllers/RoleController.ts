import { Request, Response } from "express";

import { Role } from "../entities";
import { IAuth } from "../interfaces";
import { roleRepository } from "../repositories";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
} from "../utils";

class RoleController {
    public static async Create(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.roles?.create) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        if (!req.body.info) {
            throw new BadRequestError(
                "Espera-se uma propriedade 'info' com as informações da nova role..."
            );
        }

        const { name: _name, permissions: _permissions } = req.body
            .info as Role;

        const name = _name?.trim();

        const exist = await roleRepository.nameExists(name);

        if (exist) {
            throw new ForbiddenError(`Role ${name} já existe...`);
        }

        const info = {
            name,
            permissions: _permissions,
        };

        const newRole = await roleRepository.create(info);

        return res.status(201).json(newRole);
    }

    public static async Get(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.roles?.read) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        const { id } = req.params;

        let result: Role | Role[];

        if (!id) {
            result = await roleRepository.find();
        } else {
            result = await roleRepository.findById(id);
        }

        if (!result) {
            throw new NotFoundError("Role inexistente...");
        }

        return res.json(result);
    }

    public static async Update(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.roles?.update) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        const { id } = req.params;

        if (!id) {
            throw new BadRequestError(
                "Necessário um 'id' para realizar atualização..."
            );
        }

        const role = await roleRepository.findById(id);

        if (!role) {
            throw new NotFoundError("Role inexistente...");
        }

        if (!req.body.info) {
            throw new BadRequestError(
                "Espera-se uma propriedade 'info' com as informações à atualizar..."
            );
        }

        const { name: _name, permissions: _permissions } = req.body
            .info as Role;

        const name = _name?.trim();

        const exist = await roleRepository.nameExists(name);

        if (exist) {
            throw new ForbiddenError(`Role ${name} já existe...`);
        }

        role.name = name ? name : role.name;
        role.permissions = _permissions ? _permissions : role.permissions;

        const roleUpdated = await roleRepository.update(role);

        return res.json(roleUpdated);
    }

    public static async Delete(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.roles?.delete) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        const { id } = req.params;

        if (!id) {
            throw new BadRequestError(
                "Necessário um 'id' para realizar exclusão..."
            );
        }

        const role = await roleRepository.findById(id);

        if (!role) {
            throw new NotFoundError("Role inexistente...");
        }

        await roleRepository.delete(id);

        return res.status(204).send();
    }
}

export { RoleController };
