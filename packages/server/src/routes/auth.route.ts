import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.route("/signup").post(AuthController.createUser);

export {router as AuthRouter};
