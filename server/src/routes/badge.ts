import { Router } from "express";

import { BadgeController } from "../controllers";
import { authMiddleware } from "../middlewares";

let router: Router = Router();

router
    .route("/:id?")
    .all(authMiddleware)
    .post(BadgeController.Create)
    .get(BadgeController.Get)
    .put(BadgeController.Update)
    .delete(BadgeController.Delete);

export const badge = router;
