import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { AlbumController } from "../controllers/album.controller";

const router = Router();

router.route('/user').get(verifyJWT, AlbumController.getUserAlbums);

export { router as AlbumRouter };