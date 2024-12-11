import { BaseFirestoreRepository } from "fireorm";

import { IEntityWithName } from "../interfaces";

class BaseRepository<
    T extends IEntityWithName
> extends BaseFirestoreRepository<T> {
    public async nameExists(name: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!name) {
                return resolve(false);
            }

            const objects = await this.find();

            const filtered = objects.filter((object: T) => {
                return object.name.toLowerCase() == name.toLowerCase();
            });

            return resolve(filtered.length != 0);
        });
    }
}

export { BaseRepository };
