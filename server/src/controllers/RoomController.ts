import { Request, Response } from "express";

import { Room } from "../entities";
import { IAuth } from "../interfaces";
import { roomRepository } from "../repositories";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ServerSocket,
  UnauthorizedError,
} from "../utils";

const FREE_ROOMS = 3;

class RoomController {
  public static async Create(req: Request, res: Response) {
    const { user, permissions } = req.body.auth as IAuth;

    if (!permissions.rooms?.create) {
      const roomsCount = await roomRepository.countRoomsFromOwner(user.id);

      if (roomsCount == FREE_ROOMS) {
        throw new UnauthorizedError("Limite de rooms atingido...");
      }
    }

    if (!req.body.info) {
      throw new BadRequestError(
        "Espera-se uma propriedade 'info' com as informações da nova room...",
      );
    }

    const {
      name: _name,
      description: _description,
      cover,
      genres,
    } = req.body.info as Room;

    const name = _name?.trim();
    const description = _description?.trim();

    const exist = await roomRepository.nameExists(name);

    if (exist) {
      throw new ForbiddenError(`Room ${name} já existe...`);
    }

    const info = {
      name,
      description,
      cover,
      genres,
      owner: user.id,
      online: false,
    };

    const newRoom = await roomRepository.create(info);

    return res.status(201).json(newRoom);
  }

  public static async Get(req: Request, res: Response) {
    const { id } = req.params;

    let result: Room | Room[];

    if (!id) {
      result = await roomRepository.find();
    } else {
      result = await roomRepository.findById(id);
    }

    if (!result) {
      throw new NotFoundError("Room inexistente...");
    }

    return res.json(result);
  }

  public static async Update(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError(
        "Necessário um 'id' para realizar atualização...",
      );
    }

    const room = await roomRepository.findById(id);

    if (!room) {
      throw new NotFoundError("Sala inexistente...");
    }

    const { user, permissions } = req.body.auth as IAuth;

    if (
      (room.owner != user.id || room.moderators?.includes(user.id)) &&
      !permissions.rooms?.update
    ) {
      throw new UnauthorizedError(
        "Não é possível atualizar rooms de outros usuários sem autorização...",
      );
    }

    if (!req.body.info) {
      throw new BadRequestError(
        "Espera-se uma propriedade 'info' com as informações à atualizar...",
      );
    }

    const {
      name: _name,
      description: _description,
      cover,
      genres,
      badges,
      moderators,
      online,
    } = req.body.info as Room;

    const name = _name?.trim();
    const description = _description?.trim();

    const exist = await roomRepository.nameExists(name);

    if (exist) {
      throw new ForbiddenError(`Room ${name} já existe...`);
    }

    room.name = name ?? room.name;
    room.description = description ?? room.description;
    room.cover = cover ?? room.cover;
    room.genres = genres ?? room.genres;
    room.badges = badges ?? room.badges;
    room.moderators = moderators ?? room.moderators;
    room.online = online ?? room.online;

    const roomUpdated = await roomRepository.update(room);
    if (online !== undefined) {
      ServerSocket.OnlineSwitch(roomUpdated.id, online);
    }

    return res.json(roomUpdated);
  }

  public static async Delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("Necessário um id para realizar exclusão...");
    }

    const room = await roomRepository.findById(id);

    if (!room) {
      throw new NotFoundError("Sala inexistente...");
    }

    const { user, permissions } = req.body.auth as IAuth;

    if (room.owner != user.id && !permissions.rooms?.delete) {
      throw new UnauthorizedError(
        "Não é possível excluir rooms de outros usuários sem autorização...",
      );
    }

    await roomRepository.delete(id);

    return res.status(204).send();
  }
}

export { RoomController };
