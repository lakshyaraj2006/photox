import mongoose from "mongoose";
import { UserModel } from "../models/user.model";
import { ApiError } from "../utils/ApiError";

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

export const UserService = { getUserProfile };