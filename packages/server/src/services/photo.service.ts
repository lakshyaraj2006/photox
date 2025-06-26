import mongoose from "mongoose";
import { PhotoModel } from "../models/photo.model";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../lib/cloudinary";
import { UserModel } from "../models/user.model";

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

const uploadPhoto = async (userId: string, file: Express.Multer.File) => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "User id is invalid")
    }

    const result = await uploadOnCloudinary(file.path, userId, 'photos/');

    const photo = await PhotoModel.create({
        filename: file.filename,
        mimetype: file.mimetype,
        user: userId,
        url: result?.secure_url,
        publicId: result?.public_id
    });

    await UserModel.findByIdAndUpdate(userId, {
        $push: {
            photos: photo.id
        }
    })

    return photo;
}

export const PhotoService = { getUserPhotos, uploadPhoto };
