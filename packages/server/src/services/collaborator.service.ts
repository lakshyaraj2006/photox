import mongoose from "mongoose";
import { AlbumModel } from "../models/album.model";
import { ApiError } from "../utils/ApiError";

const checkCollboration = async (albumId: string, userId: string) => {
    if (!mongoose.isValidObjectId(albumId) || !mongoose.isValidObjectId(userId))
        throw new ApiError(400, "Invalid user id or album id")

    const album = await AlbumModel.findById(albumId);

    if (!album) throw new ApiError(404, "Album was not found!");

    if (album.user.toString() === userId) return true;

    const isCollaborator = album?.collaborators?.includes(new mongoose.Types.ObjectId(userId));

    return isCollaborator;
}

export const CollaboratorService = { checkCollboration };
