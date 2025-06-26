import mongoose from "mongoose";
import { PhotoModel } from "../models/photo.model";
import { ApiError } from "../utils/ApiError";
import { cloundinary, uploadOnCloudinary } from "../lib/cloudinary";
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

const deletePhoto = async (userId: string, photoId: string) => {
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(photoId)) {
        throw new ApiError(400, "User or photo id is invalid")
    }

    const photo = await PhotoModel.findById(photoId);
    const isOwner = userId === photo?.user.toString();

    if (!isOwner) throw new ApiError(401, "You are not allowed to delete this photo")

    await UserModel.findByIdAndUpdate(userId, {
        $pull: {photos: photo.id}
    });

    await PhotoModel.findByIdAndDelete(photoId);
    
    const result = await cloundinary.uploader.destroy(photo.publicId, { resource_type: 'image' });

    return result === "ok";
}

export const PhotoService = { getUserPhotos, uploadPhoto, deletePhoto };
