import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { PhotoController } from "../controllers/photo.controller";

const router = Router();

router.route('/user').get(verifyJWT, PhotoController.getUserPhotos);

export { router as PhotoRouter };
