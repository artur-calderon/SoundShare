import { ICRUDPermission } from "./ICRUDPermission";

interface IPermissions {
    badges: Partial<ICRUDPermission>;
    genres: Partial<ICRUDPermission>;
    users: Partial<ICRUDPermission>;
    roles: Partial<ICRUDPermission>;
    rooms: Partial<ICRUDPermission>;
}

export { IPermissions };
