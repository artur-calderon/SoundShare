import { Request, Response } from "express";

import { Genre } from "../entities";
import { IAuth } from "../interfaces";
import { genreRepository } from "../repositories";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
} from "../utils";

class GenreController {
    public static async Create(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.genres?.create) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        if (!req.body.info) {
            throw new BadRequestError(
                "Espera-se uma propriedade 'info' com as informações do novo genre..."
            );
        }

        const { name: _name } = req.body.info as Genre;

        const name = _name?.trim();

        const exist = await genreRepository.nameExists(name);

        if (exist) {
            throw new ForbiddenError(`Genre ${name} já existe...`);
        }

        const info = {
            name,
        };

        const newGenre = await genreRepository.create(info);

        return res.status(201).json(newGenre);
    }

    public static async Get(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.genres?.read) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        const { id } = req.params;

        let result: Genre | Genre[];

        if (!id) {
            result = await genreRepository.find();
        } else {
            result = await genreRepository.findById(id);
        }

        if (!result) {
            throw new NotFoundError("Genre inexistente...");
        }

        return res.json(result);
    }

    public static async Update(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.genres?.update) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        const { id } = req.params;

        if (!id) {
            throw new BadRequestError(
                "Necessário um 'id' para realizar atualização..."
            );
        }

        const genre = await genreRepository.findById(id);

        if (!genre) {
            throw new NotFoundError("Genre inexistente...");
        }

        if (!req.body.info) {
            throw new BadRequestError(
                "Espera-se uma propriedade 'info' com as informações à atualizar..."
            );
        }

        const { name: _name } = req.body.info as Genre;

        const name = _name?.trim();

        const exist = await genreRepository.nameExists(name);

        if (exist) {
            throw new ForbiddenError(`Genre ${name} já existe...`);
        }

        genre.name = name ? name : genre.name;

        const genreUpdated = await genreRepository.update(genre);

        return res.json(genreUpdated);
    }

    public static async Delete(req: Request, res: Response) {
        const { permissions } = req.body.auth as IAuth;

        if (!permissions.genres?.delete) {
            throw new UnauthorizedError("Permissão necessária...");
        }

        const { id } = req.params;

        if (!id) {
            throw new BadRequestError(
                "Necessário um 'id' para realizar exclusão..."
            );
        }

        const genre = await genreRepository.findById(id);

        if (!genre) {
            throw new NotFoundError("Genre inexistente...");
        }

        await genreRepository.delete(id);

        return res.status(204).send();
    }
}

export { GenreController };
