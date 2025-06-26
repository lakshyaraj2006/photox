import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { PhotoController } from "../controllers/photo.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route('/user').get(verifyJWT, PhotoController.getUserPhotos);
router.route('/add').post(verifyJWT, upload.single('image'), PhotoController.uploadPhoto);
router.route('/delete/:id').delete(verifyJWT, PhotoController.deletePhoto);
router.route('/:id').get(PhotoController.getPhoto);

export { router as PhotoRouter };
