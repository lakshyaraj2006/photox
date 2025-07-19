import mongoose from "mongoose";
import { UserModel } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../lib/cloudinary";

const getUserProfile = async (userId: string) => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(500, "User id is invalid")
    }
    const user = await UserModel.findById(userId).select('-password');

    if (!user) {
        throw new ApiError(404, "User was not found")
    }

    return user;
}

const updateUserProfile = async (userId: string, userData: { name: string, file: Express.Multer.File | undefined }) => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(500, "User id is invalid")
    }
    const { name, file } = userData;
    let result;

    let updatedUser;
    if (file) {
        result = await uploadOnCloudinary(file.path, userId, 'avatars/')

        updatedUser = await UserModel.findByIdAndUpdate(userId, {
            $set: { name, image: result?.secure_url }
        }).select('-password');
    }

    updatedUser = await UserModel.findByIdAndUpdate(userId, {
        $set: { name }
    })

    return updatedUser;
}

export const UserService = { getUserProfile, updateUserProfile };