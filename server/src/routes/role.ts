import { Router } from "express";

import { RoleController } from "../controllers";
import { authMiddleware } from "../middlewares";

let router: Router = Router();

router
    .route("/:id?")
    .all(authMiddleware)
    .post(RoleController.Create)
    .get(RoleController.Get)
    .put(RoleController.Update)
    .delete(RoleController.Delete);

export const role = router;
