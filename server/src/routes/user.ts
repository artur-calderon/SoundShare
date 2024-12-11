import { Router } from "express";

import { UserController } from "../controllers";
import { authMiddleware } from "../middlewares";

let router: Router = Router();

router.post("/sign-up", UserController.SignUp);

router.post("/login/:uid", UserController.Login);

router
    .route("/:id?")
    .all(authMiddleware)
    .get(UserController.Get)
    .put(UserController.Update)
    .delete(UserController.Delete);

export const user = router;
