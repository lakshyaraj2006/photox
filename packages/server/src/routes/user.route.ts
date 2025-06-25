import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.route('/profile').get(verifyJWT, UserController.getUserProfile);

export { router as UserRouter };
