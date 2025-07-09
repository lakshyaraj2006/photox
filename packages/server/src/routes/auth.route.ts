import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares/verifyJWT";

const router = Router();

router.route("/signup").post(AuthController.createUser);
router.route("/login").post(AuthController.loginUser);
router.route("/refresh-token").post(AuthController.refreshToken);
router.route("/logout").post(verifyJWT, AuthController.logoutUser);

export {router as AuthRouter};
