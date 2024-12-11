import {
    IsEmail,
    IsFirebasePushId,
    IsOptional,
    IsUrl,
    Length,
    MaxLength,
} from "class-validator";
import { Collection } from "fireorm";

import { IEntityWithName } from "../interfaces";

@Collection("users")
class User implements IEntityWithName {
    id: string;

    uid: string;

    @Length(1, 15)
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsUrl()
    image?: string;

    @IsOptional()
    @MaxLength(100)
    bio?: string;

    @IsFirebasePushId()
    role: string;
}

export { User };
