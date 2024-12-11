import { Length } from "class-validator";
import { Collection } from "fireorm";

import { IEntityWithName, IPermissions } from "../interfaces";

@Collection("roles")
class Role implements IEntityWithName {
    id: string;

    @Length(1, 15)
    name: string;

    permissions: Partial<IPermissions>;
}

export { Role };
