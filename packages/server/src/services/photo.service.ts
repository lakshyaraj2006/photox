import mongoose from "mongoose";
import { PhotoModel } from "../models/photo.model";
import { ApiError } from "../utils/ApiError";

const getUserPhotos = async (userId: string) => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "User id is invalid")
    }

    const photos = await PhotoModel.find({ user: userId })
        .populate(
            {
                path: 'user',
                select: '_id name username image'
            }
        );

    const populatedPhotos = await Promise.all(
        photos.map(async (photo) => {
            if (photo.albums && photo.albums.length > 0) {
                await photo.populate({
                    path: 'albums',
                    select: '_id title description user',
                    populate: {
                        path: 'user',
                        select: '_id name username image'
                    }
                });
            }
            return photo;
        })
    );
    return populatedPhotos;
}

export const PhotoService = { getUserPhotos };
