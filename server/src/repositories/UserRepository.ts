import { CustomRepository, getRepository } from "fireorm";

import { User } from "../entities";

import { BaseRepository } from "./BaseRepository";

@CustomRepository(User)
class UserRepository extends BaseRepository<User> {
    public async findByUid(uid: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            const user = await this.whereEqualTo("uid", uid).findOne();

            return resolve(user as User);
        });
    }
}

export const userRepository = getRepository(User) as UserRepository;
