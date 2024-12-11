import { Router } from "express";

import { RoomController } from "../controllers";
import { authMiddleware } from "../middlewares";

let router: Router = Router();

router
    .route("/:id?")
    .all(authMiddleware)
    .post(RoomController.Create)
    .get(RoomController.Get)
    .put(RoomController.Update)
    .delete(RoomController.Delete);

export const room = router;
