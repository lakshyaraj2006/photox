import mongoose from "mongoose";
import { AlbumModel } from "../models/album.model"
import { PhotoModel } from "../models/photo.model";
import { ApiError } from "../utils/ApiError";

const getUserAlbums = async (userId: string) => {
    const albums = await AlbumModel.find({ user: userId })
        .populate(
            {
                path: 'user',
                select: '_id name username image'
            }
        );

    const populatedAlbums = await Promise.all(
        albums.map(async (album) => {
            const photos = album.photos as mongoose.Types.ObjectId[] | undefined;

            if (Array.isArray(photos) && photos.length > 0) {
                const firstPhotoId = photos[0];
                const populatedPhoto = await PhotoModel.findById(firstPhotoId)
                    .select('_id filename mimetype url');

                album.photos = populatedPhoto ? [populatedPhoto] as any : [];
            } else {
                album.photos = [];
            }
            return album;
        })
    );

    return populatedAlbums;
}

const getAlbum = async (albumId: string) => {
    if (!mongoose.isValidObjectId(albumId)) throw new ApiError(400, "Invalid album id")
    const album = await AlbumModel.findById(albumId)
        .populate(
            {
                path: 'user',
                select: '_id name username image'
            }
        );

    if (!album) throw new ApiError(404, "Album was not found!") 

    if (album.photos?.length) {
        await album.populate({
            path: 'photos',
            select: '_id filename url user',
            populate: {
                path: 'user',
                select: '_id name username image'
            }
        });
    }

    if (album.collaborators?.length) {
        await album.populate({
            path: 'collaborators',
            select: '_id name username image'
        });
    }

    return album;
}

export const AlbumService = { getUserAlbums, getAlbum };