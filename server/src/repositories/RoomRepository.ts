import { CustomRepository, getRepository } from "fireorm";

import { Room } from "../entities";

import { BaseRepository } from "./BaseRepository";

@CustomRepository(Room)
class RoomRepository extends BaseRepository<Room> {
    public async countRoomsFromOwner(id: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            const rooms = await this.whereEqualTo("owner", id).find();

            if (!rooms) {
                return resolve(0);
            }

            return resolve(rooms.length);
        });
    }
}

export const roomRepository = getRepository(Room) as RoomRepository;
