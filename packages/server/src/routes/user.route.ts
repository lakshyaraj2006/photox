import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { UserController } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route('/profile').get(verifyJWT, UserController.getUserProfile);
router.route('/update').patch(verifyJWT, upload.single('image'), UserController.updateUserProfile);

export { router as UserRouter };
