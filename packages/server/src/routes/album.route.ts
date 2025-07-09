import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { AlbumController } from "../controllers/album.controller";

const router = Router();

router.route('/user').get(verifyJWT, AlbumController.getUserAlbums);
router.route('/:albumId').get(AlbumController.getAlbum);
router.route('/create').post(verifyJWT, AlbumController.createAlbum);
router.route('/:albumId/update').patch(verifyJWT, AlbumController.updateAlbum);
router.route('/:albumId/delete').delete(verifyJWT, AlbumController.deleteAlbum);

export { router as AlbumRouter };