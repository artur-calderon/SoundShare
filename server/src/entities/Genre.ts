import { Length } from "class-validator";
import { Collection } from "fireorm";

import { IEntityWithName } from "../interfaces";

@Collection("genres")
class Genre implements IEntityWithName {
    id: string;

    @Length(1, 15)
    name: string;
}

export { Genre };
