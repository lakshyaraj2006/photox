import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { PhotoController } from "../controllers/photo.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route('/user').get(verifyJWT, PhotoController.getUserPhotos);
router.route('/add').post(verifyJWT, upload.single('image'), PhotoController.uploadPhoto);

export { router as PhotoRouter };
