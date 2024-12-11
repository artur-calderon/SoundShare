import { User } from "../entities";

import { IPermissions } from "./IPermissions";

interface IAuth {
    user: User;
    permissions: Partial<IPermissions>;
}

export { IAuth };
