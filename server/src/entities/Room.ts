import {
    ArrayUnique,
    IsArray,
    IsFirebasePushId,
    IsOptional,
    IsUrl,
    Length,
    MaxLength,
} from "class-validator";
import { Collection } from "fireorm";

import { IEntityWithName } from "../interfaces";

@Collection("rooms")
class Room implements IEntityWithName {
    id: string;

    @Length(1, 25)
    name: string;

    @IsOptional()
    @MaxLength(100)
    description?: string;

    @IsOptional()
    @IsUrl()
    cover?: string;

    @IsArray()
    @ArrayUnique()
    @IsFirebasePushId({ each: true })
    genres: string[];

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsFirebasePushId({ each: true })
    badges?: string[];

    @IsFirebasePushId()
    owner: string;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsFirebasePushId({ each: true })
    moderators?: string[];

    online: boolean;
}

export { Room };
