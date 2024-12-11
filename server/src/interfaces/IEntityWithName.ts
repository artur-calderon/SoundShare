import { IEntity } from "fireorm";

interface IEntityWithName extends IEntity {
    name: string;
}

export { IEntityWithName };
