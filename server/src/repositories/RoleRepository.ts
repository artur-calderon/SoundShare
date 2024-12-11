import { CustomRepository, getRepository } from "fireorm";

import { Role } from "../entities";
import { NotFoundError } from "../utils";

import { BaseRepository } from "./BaseRepository";

@CustomRepository(Role)
class RoleRepository extends BaseRepository<Role> {
    public async getIdByName(name: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const role = await this.whereEqualTo("name", name).findOne();

            if (!role) {
                return reject(new NotFoundError("Role inexistente..."));
            }

            return resolve(role.id);
        });
    }
}

export const roleRepository = getRepository(Role) as RoleRepository;
