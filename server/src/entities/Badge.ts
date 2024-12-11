import { IsUrl, Length } from "class-validator";
import { Collection } from "fireorm";

import { IEntityWithName } from "../interfaces";

@Collection("badges")
class Badge implements IEntityWithName {
    id: string;

    @Length(1, 15)
    name: string;

    @IsUrl()
    image: string;
}

export { Badge };
