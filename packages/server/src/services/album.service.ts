import mongoose from "mongoose";
import { AlbumModel } from "../models/album.model"
import { PhotoModel } from "../models/photo.model";

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

export const AlbumService = { getUserAlbums };