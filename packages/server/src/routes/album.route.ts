import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { AlbumController } from "../controllers/album.controller";

const router = Router();

router.route('/user').get(verifyJWT, AlbumController.getUserAlbums);
router.route('/:albumId').get(AlbumController.getAlbum);

export { router as AlbumRouter };