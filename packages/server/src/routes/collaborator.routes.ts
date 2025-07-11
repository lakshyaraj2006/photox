import { Router } from "express";
import { CollaboratorController } from "../controllers/collaborator.controller";
import { verifyJWT } from "../middlewares/verifyJWT";

const router = Router();

router.route('/check/:albumId').get(verifyJWT, CollaboratorController.checkCollaboration);

export { router as CollaboratorRouter };