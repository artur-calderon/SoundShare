import { Router } from "express";

import { GenreController } from "../controllers";
import { authMiddleware } from "../middlewares";

let router: Router = Router();

router
    .route("/:id?")
    .all(authMiddleware)
    .post(GenreController.Create)
    .get(GenreController.Get)
    .put(GenreController.Update)
    .delete(GenreController.Delete);

export const genre = router;
