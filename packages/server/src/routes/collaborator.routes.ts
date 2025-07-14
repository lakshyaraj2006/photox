import { Router } from "express";
import { CollaboratorController } from "../controllers/collaborator.controller";
import { verifyJWT } from "../middlewares/verifyJWT";

const router = Router();

router.route('/check/:albumId').get(verifyJWT, CollaboratorController.checkCollaboration);
router.route('/invite/:albumId').post(CollaboratorController.collaboratorInvite);
router.route('/accept/:albumId/:token').get(CollaboratorController.acceptInvite);
router.route('/remove/:albumId').post(verifyJWT, CollaboratorController.removeCollaborator);

export { router as CollaboratorRouter };